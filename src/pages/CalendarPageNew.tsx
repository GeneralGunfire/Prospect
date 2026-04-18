import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Bell,
  X,
  Plus,
  Trash2,
  GraduationCap,
  Wallet,
  BookOpen,
  Flag,
  Filter,
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import type { AppPage } from '../lib/withAuth';
import { calendarStorage, type UserCalendarEvent } from '../services/storageService';

interface CalendarPageProps {
  onNavigate: (page: AppPage) => void;
  onSignOut: () => void;
}

const ACADEMIC_YEAR = 2026;

// ── Design tokens ─────────────────────────────────────────────────────────────
// Primary:  indigo-600  (#4F46E5)  — interactive: selected day, active tab, CTA
// Deadline: red         (50/200/700)
// School:   blue        (50/200/700) — same family as primary, lighter
// Holiday:  teal        (50/200/700) — clearly distinct
// Personal: emerald     (50/200/700) — distinct from primary blue, positive/growth
// Term:     slate-300   thin top border — neutral "in school" indicator
// Base:     slate-800 text  •  slate-200 borders  •  slate-50 weekend bg

const CHIP = {
  deadline: 'bg-red-50     border border-red-200     text-red-700',
  school:   'bg-blue-50    border border-blue-200    text-blue-700',
  holiday:  'bg-teal-50    border border-teal-200    text-teal-700',
  personal: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
  exam:     'bg-red-50     border border-red-200     text-red-700',
} as const;

const DOT = {
  deadline: 'bg-red-500',
  school:   'bg-blue-500',
  holiday:  'bg-teal-500',
  personal: 'bg-emerald-500',
  exam:     'bg-red-500',
} as const;

// Map UserCalendarEvent categories to unified chip style
const EVENT_STYLE: Record<UserCalendarEvent['category'], { chip: string; dot: string; label: string }> = {
  exam:     { chip: CHIP.exam,     dot: DOT.exam,     label: 'Exam' },
  deadline: { chip: CHIP.deadline, dot: DOT.deadline, label: 'Deadline' },
  holiday:  { chip: CHIP.holiday,  dot: DOT.holiday,  label: 'Holiday' },
  other:    { chip: CHIP.personal, dot: DOT.personal, label: 'Event' },
};

// Map DEADLINE types to chip style — category drives color, not urgency level
function deadlineChip(category: string): string {
  if (category === 'Exams') return CHIP.exam;
  if (category === 'Funding') return CHIP.holiday;   // teal = money/growth
  return CHIP.school;                                 // blue = university/TVET
}
function deadlineDot(category: string): string {
  if (category === 'Exams') return DOT.exam;
  if (category === 'Funding') return DOT.holiday;
  return DOT.school;
}

// ── Term data ─────────────────────────────────────────────────────────────────
const TERMS = [
  { id: 1, name: 'Term 1', start: '14 Jan', end: '27 Mar', weeks: 11, holidays: '28 Mar – 7 Apr', startMonth: 0, startDay: 14, endMonth: 2, endDay: 27 },
  { id: 2, name: 'Term 2', start: '8 Apr',  end: '26 Jun', weeks: 12, holidays: '27 Jun – 20 Jul', startMonth: 3, startDay: 8,  endMonth: 5, endDay: 26 },
  { id: 3, name: 'Term 3', start: '21 Jul', end: '2 Oct',  weeks: 11, holidays: '3 Oct – 12 Oct',  startMonth: 6, startDay: 21, endMonth: 9, endDay: 2  },
  { id: 4, name: 'Term 4', start: '13 Oct', end: '9 Dec',  weeks: 9,  holidays: '10 Dec – Jan 2027', startMonth: 9, startDay: 13, endMonth: 11, endDay: 9 },
];

// Timeline gradient for terms tab (decorative only — not repeated on grid)
const TERM_GRADIENT = ['from-blue-500 to-indigo-500', 'from-indigo-500 to-indigo-600', 'from-indigo-600 to-blue-600', 'from-blue-600 to-indigo-700'];

// ── Deadlines ─────────────────────────────────────────────────────────────────
interface DeadlineEvent {
  title: string; shortTitle: string; date: string; isoDate: string;
  category: string; icon: 'university' | 'funding' | 'exam';
}

const DEADLINES: DeadlineEvent[] = [
  { title: 'UCT Applications Open',     shortTitle: 'UCT Apps',    date: '1 Mar',  isoDate: '2026-03-01', category: 'University', icon: 'university' },
  { title: 'UP Applications Open',      shortTitle: 'UP Apps',     date: '1 Apr',  isoDate: '2026-04-01', category: 'University', icon: 'university' },
  { title: 'UNISA Semester 2 Reg',      shortTitle: 'UNISA Reg',   date: '15 May', isoDate: '2026-05-15', category: 'University', icon: 'university' },
  { title: 'Wits Early Applications',   shortTitle: 'Wits Apps',   date: '30 Jun', isoDate: '2026-06-30', category: 'University', icon: 'university' },
  { title: 'Stellenbosch Applications', shortTitle: 'SU Apps',     date: '31 Jul', isoDate: '2026-07-31', category: 'University', icon: 'university' },
  { title: 'NSFAS 2027 Applications',   shortTitle: 'NSFAS',       date: '1 Sep',  isoDate: '2026-09-01', category: 'Funding',    icon: 'funding'    },
  { title: 'UJ Applications Close',     shortTitle: 'UJ Closes',   date: '30 Sep', isoDate: '2026-09-30', category: 'University', icon: 'university' },
  { title: 'NSF Bursary Closes',        shortTitle: 'NSF Bursary', date: '15 Oct', isoDate: '2026-10-15', category: 'Funding',    icon: 'funding'    },
  { title: 'Matric Finals Begin',       shortTitle: 'Matric',      date: '20 Oct', isoDate: '2026-10-20', category: 'Exams',      icon: 'exam'       },
  { title: 'DHET TVET Applications',    shortTitle: 'TVET Apps',   date: '30 Oct', isoDate: '2026-10-30', category: 'TVET',       icon: 'university' },
  { title: 'Sasol Bursary Deadline',    shortTitle: 'Sasol',       date: '15 Nov', isoDate: '2026-11-15', category: 'Funding',    icon: 'funding'    },
  { title: 'Matric Results Released',   shortTitle: 'Results',     date: '6 Jan',  isoDate: '2027-01-06', category: 'Exams',      icon: 'exam'       },
];

// ── Public holidays ────────────────────────────────────────────────────────────
const PUBLIC_HOLIDAY_MAP: Record<string, string> = {
  '2026-01-01': "New Year's Day",    '2026-03-21': 'Human Rights Day',
  '2026-04-03': 'Good Friday',       '2026-04-06': 'Family Day',
  '2026-04-27': 'Freedom Day',       '2026-05-01': "Workers' Day",
  '2026-06-16': 'Youth Day',         '2026-08-09': "Women's Day",
  '2026-09-24': 'Heritage Day',      '2026-12-16': 'Day of Reconciliation',
  '2026-12-25': 'Christmas Day',     '2026-12-26': 'Day of Goodwill',
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEK_DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function pad(n: number) { return String(n).padStart(2, '0'); }
function toIso(y: number, m: number, d: number) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

function buildEventMap(events: UserCalendarEvent[]) {
  const m = new Map<string, UserCalendarEvent[]>();
  for (const e of events) {
    if (!m.has(e.eventDate)) m.set(e.eventDate, []);
    m.get(e.eventDate)!.push(e);
  }
  return m;
}

function daysUntil(iso: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((new Date(iso).getTime() - today.getTime()) / 86400000);
}

function getTermForDate(month: number, day: number) {
  for (const t of TERMS) {
    const after  = month > t.startMonth || (month === t.startMonth && day >= t.startDay);
    const before = month < t.endMonth   || (month === t.endMonth   && day <= t.endDay);
    if (after && before) return t;
  }
  return null;
}

function daysInMonth(y: number, m: number)  { return new Date(y, m + 1, 0).getDate(); }
function firstDayOffset(y: number, m: number) {
  const d = new Date(y, m, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

const DeadlineIcon = ({ icon, className = 'w-4 h-4' }: { icon: DeadlineEvent['icon']; className?: string }) => {
  if (icon === 'funding') return <Wallet className={className} />;
  if (icon === 'exam')    return <BookOpen className={className} />;
  return <GraduationCap className={className} />;
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function CalendarPageNew({ onNavigate, onSignOut }: CalendarPageProps) {
  const [activeTab, setActiveTab]     = useState<'calendar' | 'terms' | 'deadlines'>('calendar');
  const [viewDate, setViewDate]       = useState(new Date(ACADEMIC_YEAR, new Date().getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [userEventsByDate, setUserEventsByDate] = useState<Map<string, UserCalendarEvent[]>>(
    () => buildEventMap(calendarStorage.getEvents())
  );
  const [newEventName,     setNewEventName]     = useState('');
  const [newEventCategory, setNewEventCategory] = useState<UserCalendarEvent['category']>('other');
  const [savedEvent,       setSavedEvent]       = useState(false);

  const [showDeadlines, setShowDeadlines] = useState(true);
  const [showHolidays,  setShowHolidays]  = useState(true);
  const [showPersonal,  setShowPersonal]  = useState(true);

  const reloadEvents = () => setUserEventsByDate(buildEventMap(calendarStorage.getEvents()));

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = useCallback(() => setViewDate(new Date(year, month - 1, 1)), [year, month]);
  const nextMonth = useCallback(() => setViewDate(new Date(year, month + 1, 1)), [year, month]);
  const goToToday = () => setViewDate(new Date(ACADEMIC_YEAR, new Date().getMonth(), 1));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activeTab !== 'calendar') return;
      if (e.key === 'ArrowLeft')  prevMonth();
      if (e.key === 'ArrowRight') nextMonth();
      if (e.key === 'Escape')     setSelectedDay(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab, prevMonth, nextMonth]);

  const isToday = (day: number) => {
    const now = new Date();
    return now.getDate() === day && now.getMonth() === month && now.getFullYear() === year;
  };

  const getDeadlinesForIso = (iso: string) => showDeadlines ? DEADLINES.filter(d => d.isoDate === iso) : [];
  const getHoliday = (iso: string) => showHolidays ? (PUBLIC_HOLIDAY_MAP[iso] ?? null) : null;

  const nextDeadline = useMemo(() => {
    const today = new Date();
    return DEADLINES.find(d => new Date(d.isoDate) >= today) ?? DEADLINES[DEADLINES.length - 1];
  }, []);

  const eventsThisWeek = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const start = new Date(today); start.setDate(today.getDate() - today.getDay() + 1);
    const end   = new Date(start); end.setDate(start.getDate() + 6);
    let count = 0;
    for (const [iso, evts] of userEventsByDate) { if (new Date(iso) >= start && new Date(iso) <= end) count += evts.length; }
    for (const dl of DEADLINES) { if (new Date(dl.isoDate) >= start && new Date(dl.isoDate) <= end) count++; }
    return count;
  }, [userEventsByDate]);

  const daysUntilNext = nextDeadline ? daysUntil(nextDeadline.isoDate) : null;
  const currentTerm   = getTermForDate(month, 15);

  const selectedDayLabel = useMemo(() => {
    if (!selectedDay) return '';
    const [y, m, d] = selectedDay.split('-').map(Number);
    return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
  }, [selectedDay]);

  const saveEvent = () => {
    if (!newEventName.trim() || !selectedDay) return;
    const evt: UserCalendarEvent = {
      id: `evt-${Date.now()}`, eventName: newEventName.trim(),
      eventDate: selectedDay, category: newEventCategory, createdAt: new Date().toISOString(),
    };
    calendarStorage.saveEvent(evt);
    reloadEvents(); setSavedEvent(true); setNewEventName('');
    setTimeout(() => setSavedEvent(false), 1500);
  };

  const sortedDeadlines = useMemo(() => {
    const today = new Date();
    return [
      ...DEADLINES.filter(d => new Date(d.isoDate) >= today).sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
      ...DEADLINES.filter(d => new Date(d.isoDate) <  today).sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
    ];
  }, []);

  const mockUser = { id: 'user', email: 'student@prospect.co.za', user_metadata: { full_name: 'Prospect Student' } } as any;

  // ── Calendar grid render ──────────────────────────────────────────────────
  const renderCalendar = () => {
    const offset = firstDayOffset(year, month);
    const days   = daysInMonth(year, month);

    return (
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Grid column ── */}
        <div className="flex-1 min-w-0">

          {/* Stats bar */}
          <div className="flex flex-wrap gap-2 mb-5">
            {/* Next deadline — toned-down red, same structure as chips */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl flex-1 min-w-0">
              <Bell className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-red-400">Next Deadline</p>
                <p className="text-xs font-bold text-red-700 truncate">
                  {nextDeadline?.shortTitle}
                  {daysUntilNext != null && daysUntilNext > 0 && <span className="ml-1.5 font-normal text-red-400">· {daysUntilNext}d</span>}
                  {daysUntilNext === 0 && <span className="ml-1.5 font-black text-red-600">· Today!</span>}
                </p>
              </div>
            </div>

            {eventsThisWeek > 0 && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
                <p className="text-xs font-bold text-indigo-700">{eventsThisWeek} this week</p>
              </div>
            )}

            {currentTerm && (
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <Flag className="w-3 h-3 text-slate-500" />
                <p className="text-xs font-bold text-slate-600">{currentTerm.name}</p>
              </div>
            )}
          </div>

          {/* Month + nav */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-none">
                {MONTH_NAMES[month]}
              </h3>
              <span className="text-sm font-semibold text-slate-400">{year}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={goToToday}
                className="px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all">
                Today
              </button>
              <button onClick={prevMonth} title="← prev month"
                className="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 flex items-center justify-center transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextMonth} title="→ next month"
                className="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 flex items-center justify-center transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
              {WEEK_DAYS.map((d, i) => (
                <div key={d} className={`py-3 text-center text-[10px] font-black uppercase tracking-widest ${i >= 5 ? 'text-slate-400' : 'text-slate-600'}`}>
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {/* Empty offset */}
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`e-${i}`} className="h-24 md:h-28 bg-slate-50/40 border-b border-r border-slate-100" />
              ))}

              {/* Day cells */}
              {Array.from({ length: days }).map((_, i) => {
                const day        = i + 1;
                const iso        = toIso(year, month, day);
                const colIndex   = (offset + i) % 7;
                const isWeekend  = colIndex >= 5;
                const today      = isToday(day);
                const dlList     = getDeadlinesForIso(iso);
                const holiday    = getHoliday(iso);
                const userEvts   = showPersonal ? (userEventsByDate.get(iso) ?? []) : [];
                const inTerm     = getTermForDate(month, day) !== null;
                const isSelected = selectedDay === iso;
                const hasDeadline = dlList.length > 0;

                // Build chips: deadlines (highest priority), user events, holiday
                type Chip = { key: string; label: string; chip: string; dot: string };
                const chips: Chip[] = [];
                for (const dl of dlList) chips.push({ key: dl.isoDate + dl.title, label: dl.shortTitle, chip: deadlineChip(dl.category), dot: deadlineDot(dl.category) });
                for (const e of userEvts)  chips.push({ key: e.id, label: e.eventName, chip: EVENT_STYLE[e.category].chip, dot: EVENT_STYLE[e.category].dot });
                if (holiday && chips.length < 2) chips.push({ key: 'hol', label: holiday.split(' ')[0], chip: CHIP.holiday, dot: DOT.holiday });
                const visible  = chips.slice(0, 2);
                const overflow = chips.length - 2;

                return (
                  <motion.button
                    key={day}
                    data-testid="calendar-day"
                    onClick={() => setSelectedDay(iso === selectedDay ? null : iso)}
                    whileHover={{ backgroundColor: isSelected ? undefined : hasDeadline ? 'rgba(239,68,68,0.04)' : 'rgba(79,70,229,0.03)' }}
                    className={[
                      'relative min-h-[6rem] md:min-h-[7rem] p-2 text-left border-b border-r border-slate-100 transition-colors',
                      isWeekend  ? 'bg-slate-50/70' : 'bg-white',
                      hasDeadline && !isSelected ? 'bg-red-50/40' : '',
                      holiday && !hasDeadline && !isSelected ? 'bg-teal-50/30' : '',
                      isSelected ? 'bg-indigo-50 ring-2 ring-inset ring-indigo-500 z-10' : '',
                      (offset + i) % 7 === 6 ? 'border-r-0' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    {/* Term indicator: thin neutral top border — no color noise */}
                    {inTerm && <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-300/60" />}

                    {/* Day number */}
                    <span className={[
                      'inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black mb-1.5 transition-all',
                      today
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300/50 scale-110'
                        : isSelected
                          ? 'bg-indigo-100 text-indigo-700'
                          : isWeekend
                            ? 'text-slate-400'
                            : 'text-slate-700',
                    ].filter(Boolean).join(' ')}>
                      {day}
                    </span>

                    {/* Chips — md+ */}
                    <div className="hidden md:flex flex-col gap-0.5">
                      {visible.map(c => (
                        <span key={c.key} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate leading-tight ${c.chip}`}>
                          {c.label}
                        </span>
                      ))}
                      {overflow > 0 && (
                        <span className="text-[9px] font-bold text-slate-400 pl-1">+{overflow}</span>
                      )}
                    </div>

                    {/* Dot row — mobile */}
                    <div className="flex gap-0.5 mt-0.5 md:hidden">
                      {chips.slice(0, 3).map((c, j) => (
                        <span key={j} className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Legend — chips match exactly */}
          <div className="mt-4 flex flex-wrap gap-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-indigo-600 text-[8px] font-black text-white">17</span>
              <span className="text-[10px] font-bold text-slate-500">Today</span>
            </div>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${CHIP.deadline}`}>Deadline</span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${CHIP.holiday}`}>Holiday</span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${CHIP.school}`}>University</span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${CHIP.personal}`}>Your Event</span>
            <div className="flex items-center gap-1.5 ml-1">
              <div className="w-4 h-[2px] bg-slate-300 rounded" />
              <span className="text-[10px] font-bold text-slate-400">In term</span>
            </div>
            <span className="text-[10px] text-slate-300 ml-auto hidden md:block">← → keys to navigate</span>
          </div>
        </div>

        {/* ── Side panel ── */}
        <div className="lg:w-72 shrink-0 space-y-4">

          {/* Selected day */}
          <AnimatePresence mode="wait">
            {selectedDay ? (
              <motion.div key="day-detail" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.16 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                {/* Header — indigo primary, not heavy navy */}
                <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Selected</p>
                    <h4 className="text-sm font-black">{selectedDayLabel}</h4>
                    {(() => {
                      const [, m, d] = selectedDay.split('-').map(Number);
                      const t = getTermForDate(m - 1, d);
                      return t ? <span className="text-[10px] text-indigo-200">{t.name}</span> : null;
                    })()}
                  </div>
                  <button onClick={() => setSelectedDay(null)} className="p-1.5 hover:bg-white/10 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3 max-h-[52vh] overflow-y-auto">
                  {/* Key dates */}
                  {(() => {
                    const dls = getDeadlinesForIso(selectedDay);
                    const hol = getHoliday(selectedDay);
                    if (!dls.length && !hol) return null;
                    return (
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Key Dates</p>
                        {hol && (
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${CHIP.holiday}`}>
                            <span className={`w-2 h-2 rounded-full shrink-0 ${DOT.holiday}`} />
                            <p className="text-xs font-bold">{hol}</p>
                          </div>
                        )}
                        {dls.map((dl, i) => (
                          <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${deadlineChip(dl.category)}`}>
                            <DeadlineIcon icon={dl.icon} className="w-3.5 h-3.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{dl.category}</p>
                              <p className="text-xs font-bold truncate">{dl.title}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* User events */}
                  {(userEventsByDate.get(selectedDay) ?? []).length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Your Events</p>
                      {(userEventsByDate.get(selectedDay) ?? []).map(evt => (
                        <div key={evt.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${EVENT_STYLE[evt.category].chip}`}>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${EVENT_STYLE[evt.category].dot}`} />
                          <p className="text-xs font-bold flex-1">{evt.eventName}</p>
                          <button onClick={() => { calendarStorage.deleteEvent(evt.id); reloadEvents(); }} className="p-0.5 hover:opacity-60">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add event */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Add Event</p>
                    <input
                      type="text" value={newEventName} onChange={e => setNewEventName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveEvent()}
                      data-testid="event-description"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-slate-300 transition-all"
                      placeholder="e.g. Maths exam..."
                    />
                    <div className="grid grid-cols-4 gap-1">
                      {(['exam','deadline','holiday','other'] as const).map(cat => (
                        <button key={cat} onClick={() => setNewEventCategory(cat)}
                          className={`py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${newEventCategory === cat ? EVENT_STYLE[cat].chip : 'bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100'}`}>
                          {EVENT_STYLE[cat].label}
                        </button>
                      ))}
                    </div>
                    <button onClick={saveEvent} disabled={!newEventName.trim()} data-testid="create-event-btn"
                      className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${savedEvent ? 'bg-teal-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed'}`}>
                      {savedEvent ? 'Saved ✓' : <><Plus className="w-3.5 h-3.5" /> Add Event</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white border border-slate-100 rounded-2xl p-5 text-center">
                <CalendarIcon className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-400">Click any day to see details or add an event</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upcoming deadlines */}
          <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Coming Up</p>
            </div>
            <div className="divide-y divide-border">
              {sortedDeadlines.filter(d => daysUntil(d.isoDate) >= 0).slice(0, 6).map((dl, i) => {
                const days = daysUntil(dl.isoDate);
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${deadlineChip(dl.category)}`}>
                      <DeadlineIcon icon={dl.icon} className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{dl.shortTitle}</p>
                      <p className="text-xs text-text-tertiary">{dl.date}</p>
                    </div>
                    <span className={`text-xs font-semibold tabular-nums ${days === 0 ? 'text-red-600' : days <= 14 ? 'text-amber-500' : 'text-text-tertiary'}`}>
                      {days === 0 ? 'Today' : `${days}d`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Page render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-light">
      <AppHeader currentPage="calendar" user={mockUser} onNavigate={onNavigate} mode="school" />

      <main className="pt-24 pb-20 px-4 md:px-6 max-w-7xl mx-auto">

        {/* Hero header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-widest">
                Academic Calendar {ACADEMIC_YEAR}
              </span>
            </div>
            <h1 className="text-h2 text-text-primary">Study Calendar</h1>
            <p className="text-sm text-text-secondary mt-1">Track terms, deadlines, and personal events.</p>
          </div>

          {/* Filter toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-text-tertiary flex items-center gap-1">
              <Filter className="w-3 h-3" /> Show:
            </span>
            {[
              { label: 'Deadlines', active: showDeadlines, toggle: () => setShowDeadlines(s => !s), chip: CHIP.deadline },
              { label: 'Holidays',  active: showHolidays,  toggle: () => setShowHolidays(s => !s),  chip: CHIP.holiday  },
              { label: 'Personal',  active: showPersonal,  toggle: () => setShowPersonal(s => !s),  chip: CHIP.personal },
            ].map(({ label, active, toggle, chip }) => (
              <button key={label} onClick={toggle} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-9 ${active ? chip : 'bg-white border border-border text-text-tertiary hover:text-text-primary'}`}>
                {active ? '✓ ' : ''}{label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs — modern underline style */}
        <div className="border-b border-border mb-7">
          <div className="flex gap-0">
            {(['calendar','terms','deadlines'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-3 text-sm font-medium transition-all capitalize min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                  activeTab === tab
                    ? 'text-[#1E3A5F] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1E3A5F] after:rounded-full'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Calendar tab ── */}
          {activeTab === 'calendar' && (
            <motion.div key="cal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {renderCalendar()}
            </motion.div>
          )}

          {/* ── Terms tab ── */}
          {activeTab === 'terms' && (
            <motion.div key="terms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TERMS.map((term, i) => (
                  <motion.div key={term.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.07)' }}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <div className={`h-1.5 bg-linear-to-r ${TERM_GRADIENT[i]}`} />
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Term {term.id}</p>
                          <h3 className="text-xl font-black text-slate-800">{term.name}</h3>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">{term.weeks}w</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-slate-50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Start</span>
                          <span className="text-xs font-bold text-slate-700">{term.start}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">End</span>
                          <span className="text-xs font-bold text-slate-700">{term.end}</span>
                        </div>
                        <div className="pt-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Holidays</p>
                          <p className="text-xs font-semibold text-slate-600">{term.holidays}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Timeline bar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">2026 Academic Year Timeline</p>
                <div className="flex gap-0.5 h-7 rounded-xl overflow-hidden">
                  {TERMS.map((t, i) => (
                    <div key={t.id} className={`bg-linear-to-r ${TERM_GRADIENT[i]} flex items-center justify-center`} style={{ flexGrow: t.weeks }}>
                      <span className="text-[10px] font-black text-white/90 hidden sm:block">{t.name}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1.5">
                  {['Jan','Apr','Jul','Oct','Dec'].map(m => (
                    <span key={m} className="text-[10px] text-slate-400">{m}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Deadlines tab ── */}
          {activeTab === 'deadlines' && (
            <motion.div key="deadlines" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">All Key Dates · Sorted by Date</p>
              {sortedDeadlines.map((item, i) => {
                const days   = daysUntil(item.isoDate);
                const isPast = days < 0;
                const chip   = deadlineChip(item.category);
                const dot    = deadlineDot(item.category);

                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${isPast ? 'opacity-40 bg-slate-50 border-slate-100' : chip}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isPast ? 'bg-slate-100 text-slate-400' : `bg-white/60`}`}>
                      <DeadlineIcon icon={item.icon} className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] opacity-60">{item.category}</p>
                      <h4 className={`text-sm font-bold truncate ${isPast ? 'line-through text-slate-400' : ''}`}>{item.title}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-white/60 mb-0.5">{item.date}</div>
                      {!isPast && (
                        <div className={`text-[10px] font-black ${days === 0 ? 'text-red-600' : days <= 14 ? 'text-amber-500' : 'opacity-60'}`}>
                          {days === 0 ? 'Today!' : `${days}d`}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
