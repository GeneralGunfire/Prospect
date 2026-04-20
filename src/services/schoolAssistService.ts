import { supabase } from '../lib/supabase';
import { grade10Term1AllTopics } from '../data/studyLibrary/index';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TopicResult {
  id: string;
  title: string;
  subject: string;
  grade: number;
  snippet: string;
}

export interface QuestionResult {
  id: string;
  type: 'qa' | 'topic';
  question?: string;
  answer?: string;
  title?: string;
  subject?: string;
  grade?: number;
  snippet?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Standard Levenshtein distance between two strings */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Returns true if `query` appears as a substring of `text` (case-insensitive)
 * OR if the Levenshtein distance between the lowercased strings is less than 3.
 */
export function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return false;
  if (t.includes(q)) return true;
  return levenshteinDistance(t, q) < 3;
}

/** Resolve the subject label from a topic object */
function resolveSubject(topic: (typeof grade10Term1AllTopics)[0]): string {
  // Some topic files have an explicit subject field
  const raw = (topic as any).subject as string | undefined;
  if (raw) return raw.charAt(0).toUpperCase() + raw.slice(1);

  // Fall back to inferring from id / title
  const id = topic.id.toLowerCase();
  if (id.includes('math') || id.includes('algebra') || id.includes('equation') ||
    id.includes('function') || id.includes('pattern') || id.includes('modell')) {
    return 'Mathematics';
  }
  if (id.includes('wave') || id.includes('atom') || id.includes('classification') ||
    id.includes('periodic') || id.includes('bond') || id.includes('physics') ||
    id.includes('chemist')) {
    return 'Physical Sciences';
  }
  if (id.includes('biodiversity') || id.includes('kingdom') || id.includes('taxonomy') ||
    id.includes('species') || id.includes('life')) {
    return 'Life Sciences';
  }
  if (id.includes('account') || id.includes('journal') || id.includes('ledger') ||
    id.includes('source-doc') || id.includes('double-entry')) {
    return 'Accounting';
  }
  if (id.includes('business') || id.includes('environment') || id.includes('sector') ||
    id.includes('stakeholder') || id.includes('operation')) {
    return 'Business Studies';
  }
  if (id.includes('economic') || id.includes('production') || id.includes('circular') ||
    id.includes('factor')) {
    return 'Economics';
  }
  if (id.includes('english') || id.includes('language') || id.includes('comprehension') ||
    id.includes('essay') || id.includes('literary') || id.includes('communication')) {
    return 'English';
  }
  if (id.includes('computer') || id.includes('file-man') || id.includes('word-proc') ||
    id.includes('spreadsheet')) {
    return 'CAT';
  }
  if (id.includes('drawing') || id.includes('line-type') || id.includes('geometrical') ||
    id.includes('orthograph') || id.includes('measuring') || id.includes('polygon') ||
    id.includes('circumscribed')) {
    return 'EGD';
  }
  return 'General';
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fuzzy-search study library topics by title or description.
 * Returns top 5 matches.
 */
export async function searchTopics(query: string): Promise<TopicResult[]> {
  const q = query.trim();
  if (!q) return [];

  const words = q.toLowerCase().split(/\s+/).filter(Boolean);

  const scored = grade10Term1AllTopics
    .map((topic) => {
      const titleLower = topic.title.toLowerCase();
      const descLower = (topic.description ?? '').toLowerCase();
      const combined = `${titleLower} ${descLower}`;

      // Score: each matching word contributes; title matches worth more
      let score = 0;
      for (const word of words) {
        if (titleLower.includes(word)) score += 3;
        else if (descLower.includes(word)) score += 1;
        else if (fuzzyMatch(titleLower, word)) score += 2;
        else if (fuzzyMatch(descLower, word)) score += 0.5;
        else if (fuzzyMatch(combined, word)) score += 0.2;
      }

      return { topic, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return scored.map(({ topic }) => ({
    id: topic.id,
    title: topic.title,
    subject: resolveSubject(topic),
    grade: topic.grade,
    snippet: (topic.description ?? '').slice(0, 150),
  }));
}

/**
 * Search the qa_pairs Supabase table and study library descriptions for the query.
 * Returns up to 8 results (qa pairs first, then matching topics).
 */
export async function searchQuestion(query: string): Promise<QuestionResult[]> {
  const q = query.trim();
  if (!q) return [];

  const results: QuestionResult[] = [];

  // 1. Query Supabase qa_pairs table
  try {
    const { data, error } = await supabase
      .from('qa_pairs')
      .select('id, question, answer, subject, grade')
      .ilike('question', `%${q}%`)
      .limit(5);

    if (!error && data) {
      for (const row of data) {
        results.push({
          id: row.id,
          type: 'qa',
          question: row.question,
          answer: row.answer,
          subject: row.subject,
          grade: row.grade,
        });
      }
    }
  } catch (_) {
    // Table may not exist yet; silently continue
  }

  // 2. Supplement with study library topic descriptions
  if (results.length < 8) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const topicMatches = grade10Term1AllTopics
      .filter((topic) => {
        const combined = `${topic.title} ${topic.description ?? ''}`.toLowerCase();
        return words.some((w) => combined.includes(w) || fuzzyMatch(combined, w));
      })
      .slice(0, 8 - results.length);

    for (const topic of topicMatches) {
      results.push({
        id: `topic-${topic.id}`,
        type: 'topic',
        title: topic.title,
        subject: resolveSubject(topic),
        grade: topic.grade,
        snippet: (topic.description ?? '').slice(0, 150),
      });
    }
  }

  return results;
}
