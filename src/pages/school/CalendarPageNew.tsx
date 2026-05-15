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
  Grid3x3,
  List,
} from 'lucide-react';
import AppHeader from '../../components/shell/AppHeader';
import type { AppPage } from '../../lib/withAuth';
import { calendarStorage, type UserCalendarEvent } from '../../services/storageService';

interface CalendarPageProps {
  onNavigate: (page: AppPage) => void;
  onSignOut: () => void;
}

const ACADEMIC_YEAR = 2026;

const EVENT_STYLE: Record<UserCalendarEvent['category'], { dot: string; label: string }> = {
  exam:     { dot: 'bg-slate-700', label: 'Exam' },
  deadline: { dot: 'bg-slate-500', label: 'Deadline' },
  holiday:  { dot: 'bg-slate-400', label: 'Holiday' },
  other:    { dot: 'bg-slate-300', label: 'Event' },
};

function deadlineDot(category: string) {
  if (category === 'Exams')   return 'bg-slate-700';
  if (category === 'Funding') return 'bg-amber-400';
  if (category === 'University') return 'bg-blue-400';
  return 'bg-slate-400';
}

function deadlineBadgeCls(category: string) {
  if (category === 'Exams')      return 'bg-slate-900 text-white';
  if (category === 'Funding')    return 'bg-amber-100 text-amber-800';
  if (category === 'University') return 'bg-blue-50 text-blue-800';
  return 'bg-slate-100 text-slate-600';
}

const TERMS = [
  { id: 1, name: 'Term 1', start: '14 Jan', end: '27 Mar', weeks: 11, holidays: '28 Mar – 7 Apr',    startMonth: 0, startDay: 14, endMonth: 2, endDay: 27 },
  { id: 2, name: 'Term 2', start: '8 Apr',  end: '26 Jun', weeks: 12, holidays: '27 Jun – 20 Jul',   startMonth: 3, startDay: 8,  endMonth: 5, endDay: 26 },
  { id: 3, name: 'Term 3', start: '21 Jul', end: '2 Oct',  weeks: 11, holidays: '3 Oct – 12 Oct',    startMonth: 6, startDay: 21, endMonth: 9, endDay: 2  },
  { id: 4, name: 'Term 4', start: '13 Oct', end: '9 Dec',  weeks: 9,  holidays: '10 Dec – Jan 2027', startMonth: 9, startDay: 13, endMonth: 11, endDay: 9 },
];

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
  const today = new Date(); today.setHours(0, 0, 0, 0);
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

function daysInMonth(y: number, m: number)    { return new Date(y, m + 1, 0).getDate(); }
function firstDayOffset(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDaysAway(n: number) {
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  if (n < 0)  return `${Math.abs(n)}d ago`;
  return `${n}d`;
}

const DeadlineIcon = ({ icon, className = 'w-4 h-4' }: { icon: DeadlineEvent['icon']; className?: string }) => {
  if (icon === 'funding') return <Wallet className={className} />;
  if (icon === 'exam')    return <BookOpen className={className} />;
  return <GraduationCap className={className} />;
};

export default function CalendarPageNew({ onNavigate, onSignOut }: CalendarPageProps) {
  const [activeTab, setActiveTab]     = useState<'calendar' | 'terms' | 'deadlines'>('calendar');
  const [calView, setCalView]         = useState<'month' | 'week' | 'list'>('month');
  const [viewDate, setViewDate]       = useState(new Date(ACADEMIC_YEAR, new Date().getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [userEventsByDate, setUserEventsByDate] = useState<Map<string, UserCalendarEvent[]>>(
    () => buildEventMap(calendarStorage.getEvents())
  );
  const [newEventName,     setNewEventName]     = useState('');
  const [newEventCategory, setNewEventCategory] = useState<UserCalendarEvent['category']>('other');
  const [savedEvent,       setSavedEvent]       = useState(false);
  const [showHolidays,     setShowHolidays]     = useState(true);
  const [showPersonal,     setShowPersonal]     = useState(true);
  const [showDeadlines,    setShowDeadlines]    = useState(true);

  const reloadEvents = () => setUserEventsByDate(buildEventMap(calendarStorage.getEvents()));

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = useCallback(() => setViewDate(new Date(year, month - 1, 1)), [year, month]);
  const nextMonth = useCallback(() => setViewDate(new Date(year, month + 1, 1)), [year, month]);
  const prevWeek  = useCallback(() => setViewDate(d => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; }), []);
  const nextWeek  = useCallback(() => setViewDate(d => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; }), []);

  const goToToday = () => setViewDate(new Date(ACADEMIC_YEAR, new Date().getMonth(), new Date().getDate()));

  const navigatePrev = () => { if (calView === 'month') prevMonth(); else if (calView === 'week') prevWeek(); };
  const navigateNext = () => { if (calView === 'month') nextMonth(); else if (calView === 'week') nextWeek(); };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activeTab !== 'calendar') return;
      if (e.key === 'ArrowLeft')  navigatePrev();
      if (e.key === 'ArrowRight') navigateNext();
      if (e.key === 'Escape')     setSelectedDay(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab, calView, month, year]);

  const isToday = (day: number, m = month, y = year) => {
    const now = new Date();
    return now.getDate() === day && now.getMonth() === m && now.getFullYear() === y;
  };

  const getDeadlinesForIso = (iso: string) => showDeadlines ? DEADLINES.filter(d => d.isoDate === iso) : [];
  const getHoliday         = (iso: string) => showHolidays  ? (PUBLIC_HOLIDAY_MAP[iso] ?? null) : null;

  const nextDeadline = useMemo(() => {
    const today = new Date();
    return DEADLINES.find(d => new Date(d.isoDate) >= today) ?? DEADLINES[DEADLINES.length - 1];
  }, []);

  const daysUntilNext  = nextDeadline ? daysUntil(nextDeadline.isoDate) : null;
  const currentTerm    = getTermForDate(month, 15);

  const selectedDayLabel = useMemo(() => {
    if (!selectedDay) return '';
    const [y, m, d] = selectedDay.split('-').map(Number);
    return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
  }, [selectedDay]);

  const saveEvent = () => {
    if (!newEventName.trim() || !selectedDay) return;
    calendarStorage.saveEvent({
      id: `evt-${Date.now()}`, eventName: newEventName.trim(),
      eventDate: selectedDay, category: newEventCategory, createdAt: new Date().toISOString(),
    });
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

  const navTitle = useMemo(() => {
    if (calView === 'month') return `${MONTH_NAMES[month]} ${year}`;
    if (calView === 'week') {
      const ws = getWeekStart(viewDate);
      const we = new Date(ws); we.setDate(ws.getDate() + 6);
      return `${ws.getDate()} ${MONTH_NAMES[ws.getMonth()].slice(0, 3)} – ${we.getDate()} ${MONTH_NAMES[we.getMonth()].slice(0, 3)}`;
    }
    return 'All Events';
  }, [calView, month, year, viewDate]);

  const mockUser = { id: 'user', email: 'student@prospect.co.za', user_metadata: { full_name: 'Prospect Student' } } as any;

  // ── Side panel ────────────────────────────────────────────────────────────

  const renderSidePanel = () => (
    <div className="lg:w-64 shrink-0">
      <AnimatePresence mode="wait">
        {selectedDay ? (
          <motion.div
            key="day-detail"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="border border-slate-200 rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-0.5">Selected</p>
                <p className="text-[15px] font-black">{selectedDayLabel}</p>
                {(() => {
                  const [, m, d] = selectedDay.split('-').map(Number);
                  const t = getTermForDate(m - 1, d);
                  return t ? <p className="text-[11px] text-white/40 mt-0.5">{t.name}</p> : null;
                })()}
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
              {(() => {
                const dls = getDeadlinesForIso(selectedDay);
                const hol = getHoliday(selectedDay);
                if (!dls.length && !hol) return null;
                return (
                  <div className="px-5 py-4 space-y-3">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Key Dates</p>
                    {hol && (
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                        <p className="text-[13px] text-slate-600">{hol}</p>
                      </div>
                    )}
                    {dls.map((dl, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <DeadlineIcon icon={dl.icon} className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{dl.category}</p>
                          <p className="text-[13px] font-bold text-slate-800">{dl.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {(userEventsByDate.get(selectedDay) ?? []).length > 0 && (
                <div className="px-5 py-4 space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">Your Events</p>
                  {(userEventsByDate.get(selectedDay) ?? []).map(evt => (
                    <div key={evt.id} className="flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${EVENT_STYLE[evt.category].dot}`} />
                      <p className="text-[13px] text-slate-700 flex-1">{evt.eventName}</p>
                      <button
                        onClick={() => { calendarStorage.deleteEvent(evt.id); reloadEvents(); }}
                        className="p-1.5 text-slate-300 hover:text-slate-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="px-5 py-4 space-y-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Add Event</p>
                <input
                  type="text"
                  value={newEventName}
                  onChange={e => setNewEventName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEvent()}
                  data-testid="event-description"
                  placeholder="e.g. Maths exam..."
                  className="w-full px-3 py-2.5 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 placeholder:text-slate-300 transition-colors"
                  style={{ fontSize: '16px' }}
                />
                <div className="grid grid-cols-4 gap-1">
                  {(['exam','deadline','holiday','other'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewEventCategory(cat)}
                      className={`py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors ${
                        newEventCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {EVENT_STYLE[cat].label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={saveEvent}
                  disabled={!newEventName.trim()}
                  data-testid="create-event-btn"
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-lg transition-colors bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {savedEvent ? 'Saved' : <><Plus className="w-3.5 h-3.5" /> Add</>}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="border border-slate-100 rounded-xl p-6 text-center"
          >
            <CalendarIcon className="w-7 h-7 text-slate-200 mx-auto mb-3" />
            <p className="text-[13px] text-slate-400">Click any day to view details or add an event</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ── Month view ────────────────────────────────────────────────────────────

  const renderMonth = () => {
    const offset = firstDayOffset(year, month);
    const days   = daysInMonth(year, month);

    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
              {WEEK_DAYS.map((d, i) => (
                <div key={d} className={`py-2.5 text-center text-[11px] font-black uppercase tracking-widest ${i >= 5 ? 'text-slate-300' : 'text-slate-400'}`}>
                  <span className="hidden sm:inline">{d}</span>
                  <span className="sm:hidden">{d[0]}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`e-${i}`} className="min-h-20 sm:min-h-24 md:min-h-28 bg-slate-50/50 border-b border-r border-slate-100" />
              ))}

              {Array.from({ length: days }).map((_, i) => {
                const day       = i + 1;
                const iso       = toIso(year, month, day);
                const colIndex  = (offset + i) % 7;
                const isWeekend = colIndex >= 5;
                const today     = isToday(day);
                const dlList    = getDeadlinesForIso(iso);
                const holiday   = getHoliday(iso);
                const userEvts  = showPersonal ? (userEventsByDate.get(iso) ?? []) : [];
                const isSelected = selectedDay === iso;

                type Chip = { key: string; dot: string };
                const dots: Chip[] = [];
                for (const dl of dlList) dots.push({ key: dl.isoDate + dl.title, dot: deadlineDot(dl.category) });
                for (const e of userEvts)  dots.push({ key: e.id, dot: EVENT_STYLE[e.category].dot });
                if (holiday && dots.length < 3) dots.push({ key: 'hol', dot: 'bg-slate-300' });
                const visibleDots = dots.slice(0, 3);

                const isLastCol = (offset + i) % 7 === 6;

                return (
                  <button
                    key={day}
                    data-testid="calendar-day"
                    onClick={() => setSelectedDay(iso === selectedDay ? null : iso)}
                    className={[
                      'relative min-h-20 sm:min-h-24 md:min-h-28 p-1.5 sm:p-2 text-left border-b border-slate-100 transition-colors',
                      isLastCol ? '' : 'border-r border-slate-100',
                      isWeekend ? 'bg-slate-50/60' : 'bg-white',
                      isSelected ? 'bg-blue-50' : 'hover:bg-slate-50',
                    ].filter(Boolean).join(' ')}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 border-2 border-slate-900 pointer-events-none rounded-sm" />
                    )}

                    <span className={[
                      'inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md text-[11px] font-black mb-1.5 transition-colors',
                      today      ? 'bg-slate-900 text-white'  :
                      isSelected ? 'text-slate-900'           :
                      isWeekend  ? 'text-slate-300'           :
                                   'text-slate-600',
                    ].join(' ')}>
                      {day}
                    </span>

                    {visibleDots.length > 0 && (
                      <div className="flex gap-0.5 mt-auto">
                        {visibleDots.map(c => (
                          <span key={c.key} className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-slate-900 inline-flex items-center justify-center text-[10px] font-black text-white">·</span>
              <span className="text-[12px] text-slate-500">Today</span>
            </div>
            {[
              { dot: 'bg-slate-700', label: 'Exam' },
              { dot: 'bg-blue-400',  label: 'University' },
              { dot: 'bg-amber-400', label: 'Funding' },
              { dot: 'bg-slate-300', label: 'Holiday' },
            ].map(({ dot, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-[12px] text-slate-500">{label}</span>
              </div>
            ))}
            <span className="text-[11px] text-slate-300 ml-auto hidden md:block">← → to navigate</span>
          </div>
        </div>

        {renderSidePanel()}
      </div>
    );
  };

  // ── Week view ─────────────────────────────────────────────────────────────

  const renderWeek = () => {
    const weekStart = getWeekStart(viewDate);
    const weekDays  = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d;
    });

    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
              {weekDays.map((d, i) => {
                const todayFlag = isToday(d.getDate(), d.getMonth(), d.getFullYear());
                return (
                  <div key={i} className="py-3 text-center">
                    <p className={`text-[11px] font-black uppercase tracking-widest mb-1.5 ${i >= 5 ? 'text-slate-300' : 'text-slate-400'}`}>
                      {WEEK_DAYS[i]}
                    </p>
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-[13px] font-black mx-auto transition-colors ${
                      todayFlag ? 'bg-slate-900 text-white' : i >= 5 ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {d.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-64">
              {weekDays.map((d, i) => {
                const iso      = toIso(d.getFullYear(), d.getMonth(), d.getDate());
                const dlList   = getDeadlinesForIso(iso);
                const holiday  = getHoliday(iso);
                const userEvts = showPersonal ? (userEventsByDate.get(iso) ?? []) : [];
                const isSelected = selectedDay === iso;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(iso === selectedDay ? null : iso)}
                    className={[
                      'relative p-1.5 text-left transition-colors flex flex-col gap-1 min-h-64',
                      i >= 5 ? 'bg-slate-50/50' : 'bg-white',
                      isSelected ? 'bg-blue-50' : 'hover:bg-slate-50',
                    ].join(' ')}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 border-2 border-slate-900 pointer-events-none" />
                    )}
                    {holiday && (
                      <span className="text-[10px] font-bold text-slate-400 px-1 truncate">{holiday.split(' ')[0]}</span>
                    )}
                    {dlList.map(dl => (
                      <div key={dl.isoDate + dl.title} className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${deadlineDot(dl.category)}`} />
                        <span className="text-[10px] font-medium text-slate-600 truncate">{dl.shortTitle}</span>
                      </div>
                    ))}
                    {userEvts.map(e => (
                      <div key={e.id} className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${EVENT_STYLE[e.category].dot}`} />
                        <span className="text-[10px] font-medium text-slate-600 truncate">{e.eventName}</span>
                      </div>
                    ))}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {renderSidePanel()}
      </div>
    );
  };

  // ── List view ─────────────────────────────────────────────────────────────

  const renderList = () => {
    type ListItem = { iso: string; label: string; category: string; icon?: DeadlineEvent['icon']; daysAway: number; isUser?: boolean; userId?: string };
    const items: ListItem[] = [];

    if (showDeadlines) {
      for (const dl of DEADLINES)
        items.push({ iso: dl.isoDate, label: dl.title, category: dl.category, icon: dl.icon, daysAway: daysUntil(dl.isoDate) });
    }
    if (showHolidays) {
      for (const [iso, name] of Object.entries(PUBLIC_HOLIDAY_MAP))
        items.push({ iso, label: name, category: 'Holiday', daysAway: daysUntil(iso) });
    }
    if (showPersonal) {
      for (const [iso, evts] of userEventsByDate)
        for (const e of evts)
          items.push({ iso, label: e.eventName, category: EVENT_STYLE[e.category].label, daysAway: daysUntil(iso), isUser: true, userId: e.id });
    }

    const sorted   = items.sort((a, b) => a.iso.localeCompare(b.iso));
    const upcoming = sorted.filter(i => i.daysAway >= 0);
    const past     = sorted.filter(i => i.daysAway < 0);

    const renderGroup = (group: ListItem[], isPast = false) => (
      <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
        {group.map((item, i) => (
          <div
            key={`${item.iso}-${i}`}
            className={`flex items-center gap-4 px-5 py-4 ${isPast ? 'opacity-40' : 'hover:bg-slate-50'} transition-colors`}
          >
            <div className="shrink-0 w-10 text-center">
              <p className="text-[13px] font-black text-slate-900 leading-none">
                {new Date(item.iso).toLocaleDateString('en-ZA', { day: 'numeric' })}
              </p>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
                {new Date(item.iso).toLocaleDateString('en-ZA', { month: 'short' })}
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[14px] font-bold text-slate-800 leading-snug ${isPast ? 'line-through text-slate-400' : ''}`}>
                {item.label}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{item.category}</p>
            </div>
            {!isPast && (
              <span className={`text-[11px] font-black shrink-0 tabular-nums ${
                item.daysAway === 0 ? 'text-red-600' :
                item.daysAway <= 14 ? 'text-amber-600' :
                'text-slate-400'
              }`}>
                {formatDaysAway(item.daysAway)}
              </span>
            )}
            {item.isUser && !isPast && (
              <button
                onClick={() => { calendarStorage.deleteEvent(item.userId!); reloadEvents(); }}
                className="p-1.5 text-slate-300 hover:text-slate-600 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    );

    return (
      <div className="max-w-2xl space-y-8">
        {upcoming.length > 0 && (
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
              Upcoming — {upcoming.length} events
            </p>
            {renderGroup(upcoming)}
          </div>
        )}
        {past.length > 0 && (
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Past</p>
            {renderGroup(past, true)}
          </div>
        )}
      </div>
    );
  };

  // ── Page render ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="calendar" user={mockUser} onNavigate={onNavigate} mode="school" />

      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">

        {/* Page header */}
        <div className="pt-4 mb-8">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-3">Academic Calendar 2026</p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900" style={{ letterSpacing: '-0.025em' }}>Calendar</h1>
        </div>

        {/* Summary strip */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl">
            <Bell className="w-4 h-4 text-white/50 shrink-0" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-0.5">Next deadline</p>
              <p className="text-[13px] font-bold leading-none">
                {nextDeadline?.shortTitle}
                {daysUntilNext != null && daysUntilNext > 0 && (
                  <span className="ml-2 font-normal text-white/50">{daysUntilNext}d</span>
                )}
                {daysUntilNext === 0 && <span className="ml-2 font-black">Today</span>}
              </p>
            </div>
          </div>
          {currentTerm && (
            <div className="flex items-center gap-2.5 px-4 py-3 border border-slate-200 rounded-xl">
              <Flag className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Current term</p>
                <p className="text-[13px] font-bold text-slate-800 leading-none">{currentTerm.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tab bar + controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
            {(['calendar', 'terms', 'deadlines'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'calendar' && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex p-1 bg-slate-100 rounded-xl">
                {([
                  { v: 'month', icon: CalendarIcon, label: 'Month' },
                  { v: 'week',  icon: Grid3x3,      label: 'Week'  },
                  { v: 'list',  icon: List,          label: 'List'  },
                ] as const).map(({ v, icon: Icon, label }) => (
                  <button
                    key={v}
                    onClick={() => setCalView(v)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                      calView === v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                {([
                  { label: 'Deadlines', state: showDeadlines, toggle: () => setShowDeadlines(s => !s) },
                  { label: 'Holidays',  state: showHolidays,  toggle: () => setShowHolidays(s => !s)  },
                  { label: 'My Events', state: showPersonal,  toggle: () => setShowPersonal(s => !s)  },
                ]).map(({ label, state, toggle }) => (
                  <button
                    key={label}
                    onClick={toggle}
                    className={`px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors border ${
                      state
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Calendar nav */}
        {activeTab === 'calendar' && calView !== 'list' && (
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              <button
                onClick={navigatePrev}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
              >
                Today
              </button>
              <button
                onClick={navigateNext}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-[18px] font-black text-slate-900" style={{ letterSpacing: '-0.02em' }}>
              {navTitle}
            </h3>
          </div>
        )}

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'calendar' && (
            <motion.div key={`cal-${calView}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {calView === 'month' && renderMonth()}
              {calView === 'week'  && renderWeek()}
              {calView === 'list'  && renderList()}
            </motion.div>
          )}

          {activeTab === 'terms' && (
            <motion.div key="terms" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="max-w-2xl">
              <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                {TERMS.map((term, i) => (
                  <motion.div
                    key={term.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="px-6 py-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Term {term.id}</p>
                        <h3 className="text-[20px] font-black text-slate-900" style={{ letterSpacing: '-0.02em' }}>{term.name}</h3>
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-1 border border-slate-200 rounded-full text-slate-500">
                        {term.weeks}w
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Start</p>
                        <p className="text-[14px] font-bold text-slate-800">{term.start}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">End</p>
                        <p className="text-[14px] font-bold text-slate-800">{term.end}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Holidays</p>
                        <p className="text-[13px] text-slate-600 leading-snug">{term.holidays}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">2026 Year Timeline</p>
                <div className="flex gap-1 h-6 rounded-lg overflow-hidden border border-slate-100">
                  {TERMS.map((t, i) => (
                    <div
                      key={t.id}
                      className={`flex items-center justify-center ${['bg-slate-800','bg-slate-700','bg-slate-600','bg-slate-500'][i]}`}
                      style={{ flexGrow: t.weeks }}
                    >
                      <span className="text-[10px] font-black text-white/80 hidden sm:block">{t.name}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1.5 px-0.5">
                  {['Jan', 'Apr', 'Jul', 'Oct', 'Dec'].map(m => (
                    <span key={m} className="text-[11px] text-slate-400">{m}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'deadlines' && (
            <motion.div key="deadlines" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="max-w-2xl">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5">
                All Key Dates · {DEADLINES.length} events
              </p>
              <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                {sortedDeadlines.map((item, i) => {
                  const days   = daysUntil(item.isoDate);
                  const isPast = days < 0;

                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-4 px-5 py-4 transition-colors ${isPast ? 'opacity-40' : 'hover:bg-slate-50'}`}
                    >
                      <div className="shrink-0 w-10 text-center">
                        <p className="text-[14px] font-black text-slate-900 leading-none">
                          {new Date(item.isoDate).toLocaleDateString('en-ZA', { day: 'numeric' })}
                        </p>
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
                          {new Date(item.isoDate).toLocaleDateString('en-ZA', { month: 'short' })}
                        </p>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-[14px] font-bold text-slate-800 leading-snug ${isPast ? 'line-through text-slate-400' : ''}`}>
                          {item.title}
                        </p>
                        <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-1 ${deadlineBadgeCls(item.category)}`}>
                          {item.category}
                        </span>
                      </div>

                      {!isPast && (
                        <span className={`text-[12px] font-black tabular-nums shrink-0 ${
                          days === 0 ? 'text-red-600' : days <= 14 ? 'text-amber-600' : 'text-slate-400'
                        }`}>
                          {formatDaysAway(days)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
