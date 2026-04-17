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

const TERMS = [
  { id: 1, name: 'Term 1', start: '14 Jan', end: '27 Mar', weeks: 11, holidays: '28 Mar – 7 Apr', startMonth: 0, startDay: 14, endMonth: 2, endDay: 27, gradient: 'from-blue-500 to-blue-600', tint: 'bg-blue-500/[0.04]', light: 'bg-blue-50 border-blue-200 text-blue-700', strip: 'bg-blue-500' },
  { id: 2, name: 'Term 2', start: '8 Apr',  end: '26 Jun', weeks: 12, holidays: '27 Jun – 20 Jul', startMonth: 3, startDay: 8,  endMonth: 5, endDay: 26, gradient: 'from-indigo-500 to-indigo-600', tint: 'bg-indigo-500/[0.04]', light: 'bg-indigo-50 border-indigo-200 text-indigo-700', strip: 'bg-indigo-500' },
  { id: 3, name: 'Term 3', start: '21 Jul', end: '2 Oct',  weeks: 11, holidays: '3 Oct – 12 Oct',  startMonth: 6, startDay: 21, endMonth: 9, endDay: 2,  gradient: 'from-violet-500 to-violet-600', tint: 'bg-violet-500/[0.04]', light: 'bg-violet-50 border-violet-200 text-violet-700', strip: 'bg-violet-500' },
  { id: 4, name: 'Term 4', start: '13 Oct', end: '9 Dec',  weeks: 9,  holidays: '10 Dec – Jan 2027', startMonth: 9, startDay: 13, endMonth: 11, endDay: 9, gradient: 'from-emerald-500 to-emerald-600', tint: 'bg-emerald-500/[0.04]', light: 'bg-emerald-50 border-emerald-200 text-emerald-700', strip: 'bg-emerald-500' },
];

interface DeadlineEvent {
  title: string;
  shortTitle: string;
  date: string;
  isoDate: string;
  category: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  icon: 'university' | 'funding' | 'exam';
}

const DEADLINES: DeadlineEvent[] = [
  { title: 'UCT Applications Open',     shortTitle: 'UCT Apps',    date: '1 Mar',  isoDate: '2026-03-01', category: 'University', type: 'info',    icon: 'university' },
  { title: 'UP Applications Open',      shortTitle: 'UP Apps',     date: '1 Apr',  isoDate: '2026-04-01', category: 'University', type: 'warning', icon: 'university' },
  { title: 'UNISA Semester 2 Reg',      shortTitle: 'UNISA Reg',   date: '15 May', isoDate: '2026-05-15', category: 'University', type: 'info',    icon: 'university' },
  { title: 'Wits Early Applications',   shortTitle: 'Wits Apps',   date: '30 Jun', isoDate: '2026-06-30', category: 'University', type: 'danger',  icon: 'university' },
  { title: 'Stellenbosch Applications', shortTitle: 'SU Apps',     date: '31 Jul', isoDate: '2026-07-31', category: 'University', type: 'warning', icon: 'university' },
  { title: 'NSFAS 2027 Applications',   shortTitle: 'NSFAS',       date: '1 Sep',  isoDate: '2026-09-01', category: 'Funding',    type: 'info',    icon: 'funding' },
  { title: 'UJ Applications Close',     shortTitle: 'UJ Closes',   date: '30 Sep', isoDate: '2026-09-30', category: 'University', type: 'danger',  icon: 'university' },
  { title: 'NSF Bursary Closes',        shortTitle: 'NSF Bursary', date: '15 Oct', isoDate: '2026-10-15', category: 'Funding',    type: 'warning', icon: 'funding' },
  { title: 'Matric Finals Begin',       shortTitle: 'Matric',      date: '20 Oct', isoDate: '2026-10-20', category: 'Exams',      type: 'danger',  icon: 'exam' },
  { title: 'DHET TVET Applications',    shortTitle: 'TVET Apps',   date: '30 Oct', isoDate: '2026-10-30', category: 'TVET',       type: 'info',    icon: 'university' },
  { title: 'Sasol Bursary Deadline',    shortTitle: 'Sasol',       date: '15 Nov', isoDate: '2026-11-15', category: 'Funding',    type: 'warning', icon: 'funding' },
  { title: 'Matric Results Released',   shortTitle: 'Results',     date: '6 Jan',  isoDate: '2027-01-06', category: 'Exams',      type: 'success', icon: 'exam' },
];

const PUBLIC_HOLIDAY_MAP: Record<string, string> = {
  '2026-01-01': "New Year's Day",
  '2026-03-21': 'Human Rights Day',
  '2026-04-03': 'Good Friday',
  '2026-04-06': 'Family Day',
  '2026-04-27': 'Freedom Day',
  '2026-05-01': "Workers' Day",
  '2026-06-16': 'Youth Day',
  '2026-08-09': "Women's Day",
  '2026-09-24': 'Heritage Day',
  '2026-12-16': 'Day of Reconciliation',
  '2026-12-25': 'Christmas Day',
  '2026-12-26': 'Day of Goodwill',
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEK_DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// Color system — consistent across grid + legend + pills
const EVENT_COLORS: Record<UserCalendarEvent['category'], { pill: string; dot: string; label: string }> = {
  exam:     { pill: 'bg-red-100 text-red-700 border border-red-200',        dot: 'bg-red-500',    label: 'Exam' },
  deadline: { pill: 'bg-amber-100 text-amber-700 border border-amber-200',  dot: 'bg-amber-500',  label: 'Deadline' },
  holiday:  { pill: 'bg-sky-100 text-sky-700 border border-sky-200',        dot: 'bg-sky-500',    label: 'Holiday' },
  other:    { pill: 'bg-indigo-100 text-indigo-700 border border-indigo-200', dot: 'bg-indigo-500', label: 'Event' },
};

// ── helpers ────────────────────────────────────────────────────────────────

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
    const after = month > t.startMonth || (month === t.startMonth && day >= t.startDay);
    const before = month < t.endMonth  || (month === t.endMonth  && day <= t.endDay);
    if (after && before) return t;
  }
  return null;
}

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOffset(y: number, m: number) {
  const d = new Date(y, m, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

const DeadlineIcon = ({ icon, className = 'w-4 h-4' }: { icon: DeadlineEvent['icon']; className?: string }) => {
  if (icon === 'funding') return <Wallet className={className} />;
  if (icon === 'exam')    return <BookOpen className={className} />;
  return <GraduationCap className={className} />;
};

// ── main component ─────────────────────────────────────────────────────────

export default function CalendarPageNew({ onNavigate, onSignOut }: CalendarPageProps) {
  const [activeTab, setActiveTab]     = useState<'calendar' | 'terms' | 'deadlines'>('calendar');
  const [viewDate, setViewDate]       = useState(new Date(ACADEMIC_YEAR, new Date().getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [userEventsByDate, setUserEventsByDate] = useState<Map<string, UserCalendarEvent[]>>(
    () => buildEventMap(calendarStorage.getEvents())
  );
  const [newEventName, setNewEventName]         = useState('');
  const [newEventCategory, setNewEventCategory] = useState<UserCalendarEvent['category']>('other');
  const [savedEvent, setSavedEvent]             = useState(false);

  // Filter toggles
  const [showDeadlines, setShowDeadlines] = useState(true);
  const [showHolidays,  setShowHolidays]  = useState(true);
  const [showPersonal,  setShowPersonal]  = useState(true);

  const reloadEvents = () => setUserEventsByDate(buildEventMap(calendarStorage.getEvents()));

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = useCallback(() => setViewDate(new Date(year, month - 1, 1)), [year, month]);
  const nextMonth = useCallback(() => setViewDate(new Date(year, month + 1, 1)), [year, month]);
  const goToToday = () => setViewDate(new Date(ACADEMIC_YEAR, new Date().getMonth(), 1));

  // Keyboard navigation
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

  const getDeadlinesForIso = (iso: string) =>
    showDeadlines ? DEADLINES.filter(d => d.isoDate === iso) : [];

  const getHoliday = (iso: string) =>
    showHolidays ? (PUBLIC_HOLIDAY_MAP[iso] ?? null) : null;

  // Next upcoming deadline
  const nextDeadline = useMemo(() => {
    const today = new Date();
    return DEADLINES.find(d => new Date(d.isoDate) >= today) ?? DEADLINES[DEADLINES.length - 1];
  }, []);

  // Events this week
  const eventsThisWeek = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const endOfWeek   = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6);
    let count = 0;
    for (const [iso, evts] of userEventsByDate) {
      const d = new Date(iso);
      if (d >= startOfWeek && d <= endOfWeek) count += evts.length;
    }
    // Also count deadlines this week
    for (const dl of DEADLINES) {
      const d = new Date(dl.isoDate);
      if (d >= startOfWeek && d <= endOfWeek) count++;
    }
    return count;
  }, [userEventsByDate]);

  const daysUntilNext = nextDeadline ? daysUntil(nextDeadline.isoDate) : null;

  const currentTerm = getTermForDate(month, 15);

  const selectedDayLabel = useMemo(() => {
    if (!selectedDay) return '';
    const [y, m, d] = selectedDay.split('-').map(Number);
    return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
  }, [selectedDay]);

  const saveEvent = () => {
    if (!newEventName.trim() || !selectedDay) return;
    const evt: UserCalendarEvent = {
      id: `evt-${Date.now()}`,
      eventName: newEventName.trim(),
      eventDate: selectedDay,
      category: newEventCategory,
      createdAt: new Date().toISOString(),
    };
    calendarStorage.saveEvent(evt);
    reloadEvents();
    setSavedEvent(true);
    setNewEventName('');
    setTimeout(() => setSavedEvent(false), 1500);
  };

  const sortedDeadlines = useMemo(() => {
    const today = new Date();
    const future = DEADLINES.filter(d => new Date(d.isoDate) >= today).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
    const past   = DEADLINES.filter(d => new Date(d.isoDate) <  today).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
    return [...future, ...past];
  }, []);

  const mockUser = { id: 'user', email: 'student@prospect.co.za', user_metadata: { full_name: 'Prospect Student' } } as any;

  // ── render helpers ─────────────────────────────────────────────────────

  const renderCalendar = () => {
    const offset = firstDayOffset(year, month);
    const days   = daysInMonth(year, month);

    return (
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Main calendar ── */}
        <div className="flex-1 min-w-0">
          {/* Stats bar */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl flex-1 min-w-0">
              <Bell className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-red-400">Next Deadline</p>
                <p className="text-xs font-bold text-red-700 truncate">
                  {nextDeadline?.shortTitle}
                  {daysUntilNext != null && daysUntilNext > 0 && (
                    <span className="ml-1.5 font-normal text-red-400">· {daysUntilNext}d away</span>
                  )}
                  {daysUntilNext === 0 && <span className="ml-1.5 text-red-500 font-black">· Today!</span>}
                </p>
              </div>
            </div>
            {eventsThisWeek > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
                <p className="text-xs font-bold text-indigo-700">{eventsThisWeek} this week</p>
              </div>
            )}
            {currentTerm && (
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${currentTerm.light} text-xs font-bold`}>
                <Flag className="w-3 h-3" />
                {currentTerm.name}
              </div>
            )}
          </div>

          {/* Month header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-navy tracking-tight leading-none">
                {MONTH_NAMES[month]}
              </h3>
              <span className="text-sm font-bold text-slate-400">{year}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-navy/5 hover:bg-navy hover:text-white text-navy transition-all"
              >
                Today
              </button>
              <button onClick={prevMonth} title="Previous month (←)"
                className="w-9 h-9 rounded-xl border border-slate-200 hover:border-navy hover:bg-navy hover:text-white text-slate-500 flex items-center justify-center transition-all shadow-sm">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextMonth} title="Next month (→)"
                className="w-9 h-9 rounded-xl border border-slate-200 hover:border-navy hover:bg-navy hover:text-white text-slate-500 flex items-center justify-center transition-all shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-slate-100">
              {WEEK_DAYS.map((d, i) => (
                <div key={d} className={`py-3 text-center text-[10px] font-black uppercase tracking-widest ${i >= 5 ? 'text-slate-400' : 'text-slate-600'}`}>
                  {d}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7">
              {/* Empty offset cells */}
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`e-${i}`} className="h-24 md:h-28 bg-slate-50/50 border-b border-r border-slate-100 last:border-r-0" />
              ))}

              {/* Day cells */}
              {Array.from({ length: days }).map((_, i) => {
                const day = i + 1;
                const iso = toIso(year, month, day);
                const colIndex = (offset + i) % 7;
                const isWeekend = colIndex >= 5;
                const today = isToday(day);
                const dlList = getDeadlinesForIso(iso);
                const holiday = getHoliday(iso);
                const userEvts = showPersonal ? (userEventsByDate.get(iso) ?? []) : [];
                const term = getTermForDate(month, day);
                const isSelected = selectedDay === iso;
                const hasDeadline = dlList.length > 0;

                // Build visible chips: deadlines first, then user events, then holiday
                type Chip = { key: string; label: string; cls: string };
                const chips: Chip[] = [];
                if (dlList.length > 0) chips.push({ key: 'dl0', label: dlList[0].shortTitle, cls: 'bg-red-100 text-red-700 border-red-200' });
                if (dlList.length > 1) chips.push({ key: 'dl1', label: dlList[1].shortTitle, cls: 'bg-red-100 text-red-700 border-red-200' });
                for (const e of userEvts) chips.push({ key: e.id, label: e.eventName, cls: EVENT_COLORS[e.category].pill });
                if (holiday && chips.length < 2) chips.push({ key: 'hol', label: holiday.split(' ')[0], cls: 'bg-sky-100 text-sky-700 border-sky-200' });
                const visibleChips = chips.slice(0, 2);
                const overflow = chips.length - 2;

                return (
                  <motion.button
                    key={day}
                    data-testid="calendar-day"
                    onClick={() => setSelectedDay(iso === selectedDay ? null : iso)}
                    whileHover={{ backgroundColor: isSelected ? undefined : (hasDeadline ? 'rgba(239,68,68,0.05)' : 'rgba(30,41,59,0.03)') }}
                    className={`relative min-h-[6rem] md:min-h-[7rem] p-2 text-left border-b border-r border-slate-100 transition-colors
                      ${isWeekend ? 'bg-slate-50/70' : 'bg-white'}
                      ${hasDeadline && !isSelected ? 'bg-red-50/50' : ''}
                      ${holiday && !hasDeadline && !isSelected ? 'bg-sky-50/40' : ''}
                      ${isSelected ? 'bg-navy/[0.06] ring-2 ring-inset ring-navy z-10' : ''}
                      ${(offset + i) % 7 === 6 ? 'border-r-0' : ''}
                    `}
                  >
                    {/* Term strip at top */}
                    {term && <div className={`absolute top-0 left-0 right-0 h-[3px] ${term.strip}`} />}

                    {/* Day number */}
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black mb-1.5 transition-all
                      ${today
                        ? 'bg-navy text-white shadow-md shadow-navy/30 scale-110'
                        : isSelected
                          ? 'bg-navy/10 text-navy'
                          : isWeekend
                            ? 'text-slate-400'
                            : 'text-slate-700'
                      }
                    `}>
                      {day}
                    </span>

                    {/* Holiday dot on mobile */}
                    {holiday && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 md:hidden" />}

                    {/* Chips — visible on md+ */}
                    <div className="hidden md:flex flex-col gap-0.5 mt-0.5">
                      {visibleChips.map(c => (
                        <span key={c.key} className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border truncate leading-tight ${c.cls}`}>
                          {c.label}
                        </span>
                      ))}
                      {overflow > 0 && (
                        <span className="text-[9px] font-black text-slate-400 px-1">+{overflow} more</span>
                      )}
                    </div>

                    {/* Dot row — mobile only */}
                    <div className="flex gap-0.5 mt-1 md:hidden">
                      {chips.slice(0, 3).map((c, j) => (
                        <span key={j} className={`w-1.5 h-1.5 rounded-full ${c.cls.includes('red') ? 'bg-red-500' : c.cls.includes('amber') ? 'bg-amber-400' : c.cls.includes('sky') ? 'bg-sky-400' : 'bg-indigo-400'}`} />
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3 px-1">
            <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-md bg-navy" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today</span></div>
            <div className="flex items-center gap-1.5"><span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-100 text-red-700 border border-red-200">Deadline</span></div>
            <div className="flex items-center gap-1.5"><span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 border border-sky-200">Holiday</span></div>
            <div className="flex items-center gap-1.5"><span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200">Your Event</span></div>
            {TERMS.map(t => (
              <div key={t.id} className="flex items-center gap-1.5">
                <div className={`w-3 h-2 rounded-sm ${t.strip}`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.name}</span>
              </div>
            ))}
            <span className="text-[10px] text-slate-300 ml-auto hidden md:block">← → to navigate months</span>
          </div>
        </div>

        {/* ── Right side panel ── */}
        <div className="lg:w-72 shrink-0 space-y-4">
          {/* Selected day detail */}
          <AnimatePresence mode="wait">
            {selectedDay ? (
              <motion.div
                key="day-detail"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.18 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-navy text-white">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-navy-200 opacity-70">Selected</p>
                    <h4 className="text-sm font-black">{selectedDayLabel}</h4>
                    {(() => {
                      const [, m, d] = selectedDay.split('-').map(Number);
                      const t = getTermForDate(m - 1, d);
                      return t ? <span className="text-[10px] text-white/60">{t.name}</span> : null;
                    })()}
                  </div>
                  <button onClick={() => setSelectedDay(null)} className="p-1.5 hover:bg-white/10 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
                  {/* Key dates on this day */}
                  {(() => {
                    const dls = getDeadlinesForIso(selectedDay);
                    const hol = getHoliday(selectedDay);
                    if (!dls.length && !hol) return null;
                    return (
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Key Dates</p>
                        {hol && (
                          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 border border-sky-200">
                            <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                            <p className="text-xs font-bold text-sky-700">{hol}</p>
                          </div>
                        )}
                        {dls.map((dl, i) => {
                          const s = { danger: 'bg-red-50 border-red-200 text-red-700', warning: 'bg-amber-50 border-amber-200 text-amber-700', info: 'bg-blue-50 border-blue-200 text-blue-700', success: 'bg-green-50 border-green-200 text-green-700' }[dl.type];
                          return (
                            <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${s}`}>
                              <DeadlineIcon icon={dl.icon} className="w-3.5 h-3.5 shrink-0" />
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{dl.category}</p>
                                <p className="text-xs font-bold">{dl.title}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* User events */}
                  {(userEventsByDate.get(selectedDay) ?? []).length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Your Events</p>
                      {(userEventsByDate.get(selectedDay) ?? []).map(evt => (
                        <div key={evt.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${EVENT_COLORS[evt.category].pill}`}>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${EVENT_COLORS[evt.category].dot}`} />
                          <p className="text-xs font-bold flex-1">{evt.eventName}</p>
                          <button onClick={() => { calendarStorage.deleteEvent(evt.id); reloadEvents(); }} className="p-0.5 hover:opacity-60">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add event form */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Add Event</p>
                    <input
                      type="text"
                      value={newEventName}
                      onChange={e => setNewEventName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveEvent()}
                      data-testid="event-description"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 placeholder:text-slate-300"
                      placeholder="e.g. Maths exam..."
                    />
                    <div className="grid grid-cols-4 gap-1">
                      {(['exam','deadline','holiday','other'] as const).map(cat => (
                        <button key={cat} onClick={() => setNewEventCategory(cat)}
                          className={`py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border transition-all ${newEventCategory === cat ? EVENT_COLORS[cat].pill : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}>
                          {EVENT_COLORS[cat].label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={saveEvent}
                      disabled={!newEventName.trim()}
                      data-testid="create-event-btn"
                      className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${savedEvent ? 'bg-emerald-500 text-white' : 'bg-navy text-white hover:bg-navy/90 disabled:opacity-40 disabled:cursor-not-allowed'}`}
                    >
                      {savedEvent ? 'Saved ✓' : <><Plus className="w-3.5 h-3.5" /> Add Event</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="day-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-slate-100 rounded-2xl p-5 text-center"
              >
                <CalendarIcon className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-400">Click any day to see details or add an event</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upcoming deadlines panel */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Coming Up</p>
            </div>
            <div className="divide-y divide-slate-50">
              {sortedDeadlines.filter(d => daysUntil(d.isoDate) >= 0).slice(0, 5).map((dl, i) => {
                const days = daysUntil(dl.isoDate);
                const s = { danger: 'text-red-500', warning: 'text-amber-500', info: 'text-blue-500', success: 'text-green-500' }[dl.type];
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div className={`w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 ${s}`}>
                      <DeadlineIcon icon={dl.icon} className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{dl.shortTitle}</p>
                      <p className="text-[9px] text-slate-400">{dl.date}</p>
                    </div>
                    <span className={`text-[10px] font-black ${days === 0 ? 'text-red-600' : days <= 14 ? 'text-amber-500' : 'text-slate-400'}`}>
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

  // ── render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AppHeader currentPage="calendar" user={mockUser} onNavigate={onNavigate} mode="school" />

      <main className="pt-24 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/5 mb-3">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-900" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Academic Calendar {ACADEMIC_YEAR}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Study Calendar</h1>
            <p className="text-sm text-slate-400 mt-1">Track terms, deadlines, and personal events.</p>
          </div>

          {/* Filter toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1 flex items-center gap-1"><Filter className="w-3 h-3" /> Show:</span>
            {[
              { label: 'Deadlines', active: showDeadlines, toggle: () => setShowDeadlines(s => !s), cls: 'bg-red-100 text-red-700 border-red-200' },
              { label: 'Holidays',  active: showHolidays,  toggle: () => setShowHolidays(s => !s),  cls: 'bg-sky-100 text-sky-700 border-sky-200' },
              { label: 'Personal',  active: showPersonal,  toggle: () => setShowPersonal(s => !s),  cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
            ].map(({ label, active, toggle, cls }) => (
              <button
                key={label}
                onClick={toggle}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${active ? cls : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'}`}
              >
                {active ? '✓' : '○'} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex max-w-xs p-1 bg-white border border-slate-200 rounded-xl shadow-sm mb-8">
          {(['calendar','terms','deadlines'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-navy text-white shadow-sm' : 'text-slate-400 hover:text-navy'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── CALENDAR ── */}
          {activeTab === 'calendar' && (
            <motion.div key="cal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              {renderCalendar()}
            </motion.div>
          )}

          {/* ── TERMS ── */}
          {activeTab === 'terms' && (
            <motion.div key="terms" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TERMS.map((term, i) => (
                  <motion.div
                    key={term.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.08)' }}
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden"
                  >
                    <div className={`h-2 bg-linear-to-r ${term.gradient}`} />
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Term {term.id}</p>
                          <h3 className="text-xl font-black text-navy">{term.name}</h3>
                        </div>
                        <span className="text-[10px] font-black text-slate-300 bg-slate-50 px-2 py-0.5 rounded-lg">{term.weeks}w</span>
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Start</span>
                          <span className="text-xs font-bold text-slate-800">{term.start}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">End</span>
                          <span className="text-xs font-bold text-slate-800">{term.end}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-50">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Holidays</p>
                          <p className="text-xs font-semibold text-slate-600">{term.holidays}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Timeline bar */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">2026 Academic Year Timeline</p>
                <div className="flex gap-0.5 h-7 rounded-xl overflow-hidden">
                  {TERMS.map(t => (
                    <div key={t.id} className={`bg-linear-to-r ${t.gradient} flex items-center justify-center`} style={{ flexGrow: t.weeks }}>
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

          {/* ── DEADLINES ── */}
          {activeTab === 'deadlines' && (
            <motion.div key="deadlines" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">All Key Dates for 2026</p>
              {sortedDeadlines.map((item, i) => {
                const days = daysUntil(item.isoDate);
                const isPast = days < 0;
                const typeStyle = {
                  danger:  { bg: 'bg-red-50',   border: 'border-red-100',   text: 'text-red-700',   badge: 'bg-red-100 text-red-700',   iconBg: 'bg-red-100 text-red-600' },
                  warning: { bg: 'bg-amber-50',  border: 'border-amber-100', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', iconBg: 'bg-amber-100 text-amber-600' },
                  info:    { bg: 'bg-blue-50',   border: 'border-blue-100',  text: 'text-blue-700',  badge: 'bg-blue-100 text-blue-700',   iconBg: 'bg-blue-100 text-blue-600' },
                  success: { bg: 'bg-green-50',  border: 'border-green-100', text: 'text-green-700', badge: 'bg-green-100 text-green-700', iconBg: 'bg-green-100 text-green-600' },
                }[item.type];

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${isPast ? 'opacity-40 bg-slate-50 border-slate-100' : `${typeStyle.bg} ${typeStyle.border}`}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isPast ? 'bg-slate-100 text-slate-400' : typeStyle.iconBg}`}>
                      <DeadlineIcon icon={item.icon} className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">{item.category}</p>
                      <h4 className={`text-sm font-bold truncate ${isPast ? 'line-through text-slate-400' : typeStyle.text}`}>{item.title}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-[10px] font-black px-2 py-0.5 rounded-lg mb-0.5 ${isPast ? 'bg-slate-100 text-slate-400' : typeStyle.badge}`}>{item.date}</div>
                      {!isPast && <div className={`text-[10px] font-bold ${days === 0 ? 'text-red-600' : days <= 14 ? 'text-amber-500' : 'text-slate-400'}`}>{days === 0 ? 'Today!' : `${days}d`}</div>}
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
