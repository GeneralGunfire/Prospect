/**
 * South Africa 2026 — Official School & Public Holiday Calendar
 * Sources:
 *  - Department of Basic Education: education.gov.za (2026 School Calendar PDF)
 *  - Office Holidays: officeholidays.com/countries/south-africa/2026
 *  - BusinessTech (citing DBE directly): businesstech.co.za
 *  - Western Cape Government NSC Timetable PDF
 */

export type EventType =
  | 'public_holiday'
  | 'term'
  | 'holiday'
  | 'exam_week';

export interface SA2026Event {
  date: string;        // YYYY-MM-DD
  name: string;
  type: EventType;
  shortName?: string;  // Compact label for calendar cell
  note?: string;
}

export const SA_2026_EVENTS: SA2026Event[] = [
  // ── Public Holidays ──────────────────────────────────────────────────────
  { date: '2026-01-01', name: "New Year's Day",               shortName: "New Year",       type: 'public_holiday' },
  { date: '2026-03-21', name: 'Human Rights Day',             shortName: 'Human Rights',   type: 'public_holiday', note: 'Falls on Saturday — no substitute day' },
  { date: '2026-04-03', name: 'Good Friday',                  shortName: 'Good Friday',    type: 'public_holiday' },
  { date: '2026-04-06', name: 'Family Day',                   shortName: 'Family Day',     type: 'public_holiday', note: 'Easter Monday' },
  { date: '2026-04-27', name: 'Freedom Day',                  shortName: 'Freedom Day',    type: 'public_holiday' },
  { date: '2026-05-01', name: "Workers' Day",                 shortName: "Workers' Day",   type: 'public_holiday' },
  { date: '2026-06-15', name: 'Special School Holiday',       shortName: 'Special Holiday',type: 'holiday',        note: 'DBE-declared bridge before Youth Day' },
  { date: '2026-06-16', name: 'Youth Day',                    shortName: 'Youth Day',      type: 'public_holiday' },
  { date: '2026-08-09', name: 'National Women\'s Day',        shortName: "Women's Day",    type: 'public_holiday', note: 'Falls on Sunday' },
  { date: '2026-08-10', name: "National Women's Day (in lieu)", shortName: "Women's Day",  type: 'public_holiday', note: 'Observed Monday — substitute for Sunday' },
  { date: '2026-09-24', name: 'Heritage Day',                 shortName: 'Heritage Day',   type: 'public_holiday' },
  { date: '2026-12-16', name: 'Day of Reconciliation',        shortName: 'Reconciliation', type: 'public_holiday' },
  { date: '2026-12-25', name: 'Christmas Day',                shortName: 'Christmas',      type: 'public_holiday' },
  { date: '2026-12-26', name: 'Day of Goodwill',              shortName: 'Goodwill',       type: 'public_holiday', note: 'Falls on Saturday — no substitute day' },

  // ── School Terms (DBE Official) ───────────────────────────────────────────
  // Term 1: 14 Jan – 27 Mar
  ...generateTermDays('2026-01-14', '2026-03-27', 'Term 1'),
  // Term 2: 8 Apr – 26 Jun
  ...generateTermDays('2026-04-08', '2026-06-26', 'Term 2'),
  // Term 3: 21 Jul – 23 Sep
  ...generateTermDays('2026-07-21', '2026-09-23', 'Term 3'),
  // Term 4: 6 Oct – 9 Dec
  ...generateTermDays('2026-10-06', '2026-12-09', 'Term 4'),

  // ── School Holidays (breaks between terms) ────────────────────────────────
  ...generateHolidayDays('2026-03-28', '2026-04-07', 'Autumn Break'),
  ...generateHolidayDays('2026-06-27', '2026-07-20', 'Winter Break'),
  ...generateHolidayDays('2026-09-24', '2026-10-05', 'Spring Break'),

  // ── Exam Periods ──────────────────────────────────────────────────────────
  // NSC May/June mid-year exams (Grade 12)
  ...generateExamDays('2026-05-11', '2026-06-12', 'NSC Mid-Year Exams'),
  // NSC October/November finals (Grade 12)
  ...generateExamDays('2026-10-17', '2026-11-17', 'NSC Final Exams'),
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function dateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    const d = cur.getDay(); // 0 = Sun, 6 = Sat
    if (d !== 0 && d !== 6) {   // weekdays only
      dates.push(cur.toISOString().slice(0, 10));
    }
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function generateTermDays(start: string, end: string, label: string): SA2026Event[] {
  return dateRange(start, end).map(date => ({
    date,
    name: label,
    shortName: label,
    type: 'term' as EventType,
  }));
}

function generateHolidayDays(start: string, end: string, label: string): SA2026Event[] {
  // Include all calendar days (not just weekdays) for holidays
  const dates: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return dates.map(date => ({
    date,
    name: label,
    shortName: label,
    type: 'holiday' as EventType,
  }));
}

function generateExamDays(start: string, end: string, label: string): SA2026Event[] {
  return dateRange(start, end).map(date => ({
    date,
    name: label,
    shortName: 'Matric Exams',
    type: 'exam_week' as EventType,
  }));
}

// ── Lookup helpers ────────────────────────────────────────────────────────────

/** Returns events for a specific date, highest-priority first */
export function getEventsForDate(date: string): SA2026Event[] {
  const priority: Record<EventType, number> = {
    public_holiday: 0,
    exam_week: 1,
    holiday: 2,
    term: 3,
  };
  return SA_2026_EVENTS
    .filter(e => e.date === date)
    .sort((a, b) => priority[a.type] - priority[b.type]);
}

/** Returns all named (non-term background) events for a month YYYY-MM */
export function getKeyEventsForMonth(yearMonth: string): SA2026Event[] {
  return SA_2026_EVENTS.filter(
    e => e.date.startsWith(yearMonth) && e.type !== 'term'
  );
}

/** Returns the next N upcoming named events from today */
export function getUpcomingEvents(count = 5): SA2026Event[] {
  const today = new Date().toISOString().slice(0, 10);
  const seen = new Set<string>();
  return SA_2026_EVENTS
    .filter(e => e.date >= today && e.type !== 'term')
    .filter(e => {
      const key = e.date + e.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, count);
}

/** Key named events only (no per-day term/holiday background fills) */
export const SA_2026_NAMED_EVENTS = SA_2026_EVENTS.filter(e => e.type !== 'term');

// School term spans (for reference in UI)
export const TERM_SPANS = [
  { term: 1, start: '2026-01-14', end: '2026-03-27', label: 'Term 1' },
  { term: 2, start: '2026-04-08', end: '2026-06-26', label: 'Term 2' },
  { term: 3, start: '2026-07-21', end: '2026-09-23', label: 'Term 3' },
  { term: 4, start: '2026-10-06', end: '2026-12-09', label: 'Term 4' },
];
