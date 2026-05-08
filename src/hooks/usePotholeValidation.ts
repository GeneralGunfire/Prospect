import { useMemo } from 'react';
import type { PotholeSeverity } from '../services/potholeService';
import {
  SPAM_KEYWORDS,
  POTHOLE_KEYWORDS,
  GIBBERISH_PATTERN,
  ALL_CAPS_PATTERN,
  PROVINCE_CITY_MAP,
} from '../utils/suspiciousPatterns';

// ── localStorage keys ──────────────────────────────────────────────────────────

const LS_REPORT_TIMES = 'prospect_pothole_report_times';
const LS_LOCATION_REPORTS = 'prospect_pothole_locations';

// ── Helpers ────────────────────────────────────────────────────────────────────

function locationHash(province: string, city: string, suburb: string, street: string): string {
  return [province, city, suburb, street].map(s => s.toLowerCase().trim()).join('|');
}

function getReportTimes(): number[] {
  try {
    return JSON.parse(localStorage.getItem(LS_REPORT_TIMES) ?? '[]');
  } catch { return []; }
}

function getLocationReports(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(LS_LOCATION_REPORTS) ?? '{}');
  } catch { return {}; }
}

export function recordSubmission(province: string, city: string, suburb: string, street: string) {
  const now = Date.now();

  // Record time
  const times = getReportTimes();
  times.push(now);
  // Keep only last 100
  localStorage.setItem(LS_REPORT_TIMES, JSON.stringify(times.slice(-100)));

  // Record location
  const locs = getLocationReports();
  locs[locationHash(province, city, suburb, street)] = now;
  localStorage.setItem(LS_LOCATION_REPORTS, JSON.stringify(locs));
}

// ── Individual checks ──────────────────────────────────────────────────────────

export function detectDuplicate(province: string, city: string, suburb: string, street: string): Date | null {
  if (!province && !city) return null;
  const locs = getLocationReports();
  const hash = locationHash(province, city, suburb, street);
  const ts = locs[hash];
  if (!ts) return null;
  const age = Date.now() - ts;
  if (age < 24 * 60 * 60 * 1000) return new Date(ts);
  return null;
}

export function detectSpamRate(): { isSpam: boolean; recentCount: number } {
  const times = getReportTimes();
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  const recentCount = times.filter(t => t > tenMinutesAgo).length;
  return { isSpam: recentCount >= 5, recentCount };
}

export function detectTemporalClustering(): boolean {
  const times = getReportTimes();
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  return times.filter(t => t > oneHourAgo).length >= 10;
}

export function scoreDescription(text: string): {
  score: number;
  flags: string[];
} {
  const flags: string[] = [];
  let score = 100;

  if (!text || text.trim().length === 0) {
    return { score: 50, flags: [] }; // no description is neutral (optional field)
  }

  const trimmed = text.trim();

  if (trimmed.length < 10) {
    flags.push('too_short');
    score -= 30;
  }

  if (ALL_CAPS_PATTERN.test(trimmed) && trimmed.length > 5) {
    flags.push('all_caps');
    score -= 20;
  }

  if (GIBBERISH_PATTERN.test(trimmed)) {
    flags.push('gibberish');
    score -= 40;
  }

  const lower = trimmed.toLowerCase();
  if (SPAM_KEYWORDS.some(kw => lower === kw || lower.startsWith(kw + ' ') || lower === kw)) {
    flags.push('spam_keyword');
    score -= 50;
  }

  const hasPotholeKeyword = POTHOLE_KEYWORDS.some(kw => lower.includes(kw));
  if (!hasPotholeKeyword && trimmed.length > 5) {
    flags.push('no_relevant_keywords');
    score -= 15;
  }

  // Repeated chars
  if (/(.)\1{3,}/.test(trimmed)) {
    flags.push('repeated_chars');
    score -= 25;
  }

  // Purely numeric/emoji
  if (/^[\d\s\W]+$/.test(trimmed)) {
    flags.push('no_words');
    score -= 35;
  }

  return { score: Math.max(0, score), flags };
}

export function validateLocation(province: string, city: string): {
  valid: boolean;
  flag: boolean;
} {
  if (!province || !city) return { valid: false, flag: false };
  const validCities = PROVINCE_CITY_MAP[province];
  if (!validCities) return { valid: true, flag: false }; // province not in our map, don't penalise
  // City is from the dropdown so it's valid if selected; we just check mismatch isn't possible
  return { valid: true, flag: false };
}

export function validatePhoto(file: File | null, severity: PotholeSeverity | ''): {
  suggestPhoto: boolean;
} {
  if (file) return { suggestPhoto: false };
  if (severity === 'high' || severity === 'medium') return { suggestPhoto: true };
  return { suggestPhoto: false };
}

export function detectAllHighSeverityPattern(severity: PotholeSeverity | ''): boolean {
  const times = getReportTimes();
  const tenMinAgo = Date.now() - 10 * 60 * 1000;
  const recentCount = times.filter(t => t > tenMinAgo).length;
  // Flag if they've submitted multiple reports quickly AND current one is high
  return recentCount >= 3 && severity === 'high';
}

// ── Main hook ──────────────────────────────────────────────────────────────────

export interface ValidationResult {
  score: number;             // 0–100, higher = more trustworthy
  flags: string[];           // machine-readable flag list
  warnings: string[];        // human-readable warnings shown in UI
  duplicateDate: Date | null;
  isSpam: boolean;
  isClustered: boolean;
  suggestPhoto: boolean;
  descFlags: string[];
}

interface ValidationInput {
  province: string;
  city: string;
  suburb: string;
  street: string;
  severity: PotholeSeverity | '';
  description: string;
  imageFile: File | null;
}

export function usePotholeValidation(input: ValidationInput): ValidationResult {
  return useMemo(() => {
    const flags: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // 1. Duplicate location
    const duplicateDate = detectDuplicate(input.province, input.city, input.suburb, input.street);
    if (duplicateDate) {
      flags.push('duplicate_location');
      warnings.push(`A pothole was already reported here on ${duplicateDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}. You can still submit if it's a different pothole.`);
      score -= 15;
    }

    // 2. Spam rate
    const { isSpam, recentCount } = detectSpamRate();
    if (isSpam) {
      flags.push('rapid_submission');
      warnings.push(`You've submitted ${recentCount} reports in the last 10 minutes. Slow down — quality over quantity.`);
      score -= 30;
    }

    // 3. Temporal clustering
    const isClustered = detectTemporalClustering();
    if (isClustered) {
      flags.push('account_clustering');
      warnings.push('Your reports are being queued for review before publishing.');
      score -= 20;
    }

    // 4. Description quality
    const { score: descScore, flags: descFlags } = scoreDescription(input.description);
    if (descFlags.length > 0) {
      flags.push(...descFlags.map(f => `desc_${f}`));
      if (descFlags.includes('spam_keyword')) {
        warnings.push('Description looks like test or spam content.');
        score -= 25;
      } else if (descFlags.includes('gibberish')) {
        warnings.push('Description appears to be gibberish.');
        score -= 20;
      } else if (descFlags.includes('too_short') && input.description.trim().length > 0) {
        warnings.push('Description is very short — add more detail to help verify.');
        score -= 10;
      }
    } else {
      // Good description boosts score
      score += Math.floor((descScore - 80) / 10);
    }

    // 5. Photo suggestion
    const { suggestPhoto } = validatePhoto(input.imageFile, input.severity);
    if (suggestPhoto) {
      flags.push('no_photo_medium_high');
      warnings.push(`Adding a photo helps verify ${input.severity} severity reports.`);
      score -= 5;
    }

    // 6. All-high pattern
    if (detectAllHighSeverityPattern(input.severity)) {
      flags.push('all_high_pattern');
      score -= 10;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      flags,
      warnings,
      duplicateDate,
      isSpam,
      isClustered,
      suggestPhoto,
      descFlags,
    };
  }, [
    input.province, input.city, input.suburb, input.street,
    input.severity, input.description, input.imageFile,
  ]);
}
