import { useState, useMemo } from 'react';
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
  { id: 1, name: 'Term 1', start: '14 Jan', end: '27 Mar', weeks: 11, holidays: '28 Mar – 7 Apr', startMonth: 0, startDay: 14, endMonth: 2, endDay: 27, color: 'from-blue-500 to-blue-600', light: 'bg-blue-50 border-blue-200 text-blue-700' },
  { id: 2, name: 'Term 2', start: '8 Apr',  end: '26 Jun', weeks: 12, holidays: '27 Jun – 20 Jul', startMonth: 3, startDay: 8,  endMonth: 5, endDay: 26, color: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { id: 3, name: 'Term 3', start: '21 Jul', end: '2 Oct',  weeks: 11, holidays: '3 Oct – 12 Oct',  startMonth: 6, startDay: 21, endMonth: 9, endDay: 2,  color: 'from-violet-500 to-violet-600', light: 'bg-violet-50 border-violet-200 text-violet-700' },
  { id: 4, name: 'Term 4', start: '13 Oct', end: '9 Dec',  weeks: 9,  holidays: '10 Dec – Jan 2027', startMonth: 9, startDay: 13, endMonth: 11, endDay: 9, color: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
];

interface DeadlineEvent {
  title: string;
  date: string;
  isoDate: string;
  category: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  icon: 'university' | 'funding' | 'exam';
}

const DEADLINES: DeadlineEvent[] = [
  { title: 'UCT Applications Open',     date: '1 Mar',   isoDate: '2026-03-01', category: 'University', type: 'info',    icon: 'university' },
  { title: 'UP Applications Open',      date: '1 Apr',   isoDate: '2026-04-01', category: 'University', type: 'warning', icon: 'university' },
  { title: 'UNISA Semester 2 Reg',      date: '15 May',  isoDate: '2026-05-15', category: 'University', type: 'info',    icon: 'university' },
  { title: 'Wits Early Applications',   date: '30 Jun',  isoDate: '2026-06-30', category: 'University', type: 'danger',  icon: 'university' },
  { title: 'Stellenbosch Applications', date: '31 Jul',  isoDate: '2026-07-31', category: 'University', type: 'warning', icon: 'university' },
  { title: 'NSFAS 2027 Applications',   date: '1 Sep',   isoDate: '2026-09-01', category: 'Funding',    type: 'info',    icon: 'funding' },
  { title: 'UJ Applications Close',     date: '30 Sep',  isoDate: '2026-09-30', category: 'University', type: 'danger',  icon: 'university' },
  { title: 'NSF Bursary Closes',        date: '15 Oct',  isoDate: '2026-10-15', category: 'Funding',    type: 'warning', icon: 'funding' },
  { title: 'Matric Finals Begin',        date: '20 Oct',  isoDate: '2026-10-20', category: 'Exams',      type: 'danger',  icon: 'exam' },
  { title: 'DHET TVET Applications',    date: '30 Oct',  isoDate: '2026-10-30', category: 'TVET',       type: 'info',    icon: 'university' },
  { title: 'Sasol Bursary Deadline',    date: '15 Nov',  isoDate: '2026-11-15', category: 'Funding',    type: 'warning', icon: 'funding' },
  { title: 'Matric Results Released',   date: '6 Jan',   isoDate: '2027-01-06', category: 'Exams',      type: 'success', icon: 'exam' },
];

// Public holidays (day month abbreviated)
const PUBLIC_HOLIDAY_MAP: Record<string, string> = {
  '2026-01-01': "New Year's Day",
  '2026-03-21': 'Human Rights Day',
  '2026-04-03': 'Good Friday',
  '2026-04-06': 'Family Day',
  '2026-04-27': 'Freedom Day',
  '2026-05-01': 'Workers Day',
  '2026-06-16': "Youth Day",
  '2026-08-09': "Women's Day",
  '2026-09-24': 'Heritage Day',
  '2026-12-16': 'Day of Reconciliation',
  '2026-12-25': 'Christmas Day',
  '2026-12-26': 'Day of Goodwill',
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEK_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const CATEGORY_COLORS: Record<UserCalendarEvent['category'], string> = {
  exam:     'bg-red-50 text-red-600 border-red-200',
  deadline: 'bg-amber-50 text-amber-600 border-amber-200',
  holiday:  'bg-sky-50 text-sky-600 border-sky-200',
  other:    'bg-indigo-50 text-indigo-600 border-indigo-200',
};

const CATEGORY_DOT: Record<UserCalendarEvent['category'], string> = {
  exam: 'bg-red-400', deadline: 'bg-amber-400', holiday: 'bg-sky-400', other: 'bg-indigo-400',
};

function pad(n: number) { return String(n).padStart(2, '0'); }
function toIso(y: number, month: number, d: number) { return `${y}-${pad(month + 1)}-${pad(d)}`; }

function buildEventMap(events: UserCalendarEvent[]): Map<string, UserCalendarEvent[]> {
  const m = new Map<string, UserCalendarEvent[]>();
  for (const e of events) {
    if (!m.has(e.eventDate)) m.set(e.eventDate, []);
    m.get(e.eventDate)!.push(e);
  }
  return m;
}

function daysUntil(isoDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(isoDate);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

function getTermForDate(month: number, day: number): typeof TERMS[0] | null {
  for (const term of TERMS) {
    const afterStart = month > term.startMonth || (month === term.startMonth && day >= term.startDay);
    const beforeEnd  = month < term.endMonth  || (month === term.endMonth  && day <= term.endDay);
    if (afterStart && beforeEnd) return term;
  }
  return null;
}

const DeadlineIcon = ({ icon }: { icon: DeadlineEvent['icon'] }) => {
  if (icon === 'funding') return <Wallet className="w-4 h-4" />;
  if (icon === 'exam')    return <BookOpen className="w-4 h-4" />;
  return <GraduationCap className="w-4 h-4" />;
};

export default function CalendarPageNew({ onNavigate, onSignOut }: CalendarPageProps) {
  const [activeTab, setActiveTab]     = useState<'calendar' | 'terms' | 'deadlines'>('calendar');
  const [viewDate, setViewDate]       = useState(new Date(ACADEMIC_YEAR, 0, 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [userEventsByDate, setUserEventsByDate] = useState<Map<string, UserCalendarEvent[]>>(
    () => buildEventMap(calendarStorage.getEvents())
  );
  const [newEventName, setNewEventName]         = useState('');
  const [newEventCategory, setNewEventCategory] = useState<UserCalendarEvent['category']>('other');
  const [savedEvent, setSavedEvent]             = useState(false);

  const reloadEvents = () => setUserEventsByDate(buildEventMap(calendarStorage.getEvents()));

  const daysInMonth  = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOffset = (y: number, m: number) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; };

  const goToToday = () => setViewDate(new Date(ACADEMIC_YEAR, new Date().getMonth(), 1));

  const isToday = (day: number) => {
    const now = new Date();
    return now.getDate() === day && now.getMonth() === viewDate.getMonth() && now.getFullYear() === viewDate.getFullYear();
  };

  const getDeadlinesForDay = (day: number) => {
    const iso = toIso(viewDate.getFullYear(), viewDate.getMonth(), day);
    return DEADLINES.filter(d => d.isoDate === iso);
  };

  const getHoliday = (day: number) => {
    const iso = toIso(viewDate.getFullYear(), viewDate.getMonth(), day);
    return PUBLIC_HOLIDAY_MAP[iso] ?? null;
  };

  const nextDeadline = useMemo(() => {
    const today = new Date();
    return DEADLINES.find(d => new Date(d.isoDate) > today) ?? DEADLINES[0];
  }, []);

  // Current term banner info
  const currentTermForView = getTermForDate(viewDate.getMonth(), 15); // mid-month

  const sortedDeadlines = useMemo(() => {
    const today = new Date();
    const future = DEADLINES.filter(d => new Date(d.isoDate) >= today).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
    const past   = DEADLINES.filter(d => new Date(d.isoDate) <  today).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
    return [...future, ...past];
  }, []);

  const mockUser = { id: 'user', email: 'student@prospect.co.za', user_metadata: { full_name: 'Prospect Student' } } as any;

  const saveEvent = () => {
    if (!newEventName.trim() || !selectedDay) return;
    const evt: UserCalendarEvent = { id: `evt-${Date.now()}`, eventName: newEventName.trim(), eventDate: selectedDay, category: newEventCategory, createdAt: new Date().toISOString() };
    calendarStorage.saveEvent(evt);
    reloadEvents();
    setSavedEvent(true);
    setNewEventName('');
    setTimeout(() => setSavedEvent(false), 1500);
  };

  // Format selected day for modal title
  const selectedDayLabel = useMemo(() => {
    if (!selectedDay) return '';
    const [y, m, d] = selectedDay.split('-').map(Number);
    return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
  }, [selectedDay]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AppHeader currentPage="calendar" user={mockUser} onNavigate={onNavigate} mode="school" />

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 mb-4">
              <CalendarIcon className="w-4 h-4 text-slate-900" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Academic Calendar {ACADEMIC_YEAR}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">Study Calendar</h1>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">
              Track school terms, public holidays, and critical deadlines. Click any day to add personal events.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* Current term badge */}
            {currentTermForView && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${currentTermForView.light} text-xs font-bold`}>
                <Flag className="w-3 h-3" />
                {currentTermForView.name}
              </div>
            )}
            {/* Next deadline pill */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl">
              <Bell className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-red-400">Next Deadline</p>
                <p className="text-xs font-bold text-red-700">{nextDeadline.title}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Tab Selector */}
          <div className="flex max-w-md mx-auto p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            {([
              { key: 'calendar', label: 'Calendar' },
              { key: 'terms',    label: 'Terms' },
              { key: 'deadlines', label: 'Deadlines' },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === key ? 'bg-navy text-white shadow-md' : 'text-slate-500 hover:text-navy hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ── Calendar Grid ── */}
            {activeTab === 'calendar' && (
              <motion.div
                key="calendar-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-slate-200/50 overflow-hidden"
              >
                {/* Month header */}
                <div className="flex items-center justify-between mb-8 px-2">
                  <div>
                    <h3 className="text-3xl font-black text-navy tracking-tight">
                      {MONTH_NAMES[viewDate.getMonth()]} <span className="text-slate-200">{viewDate.getFullYear()}</span>
                    </h3>
                    {currentTermForView && (
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${currentTermForView.light}`}>
                        {currentTermForView.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToToday}
                      className="px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-slate-600"
                    >
                      Today
                    </button>
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                      className="p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-all active:scale-95 shadow-sm">
                      <ChevronLeft className="w-5 h-5 text-navy" />
                    </button>
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                      className="p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-all active:scale-95 shadow-sm">
                      <ChevronRight className="w-5 h-5 text-navy" />
                    </button>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-3xl overflow-hidden">
                  {WEEK_DAYS.map(d => (
                    <div key={d} className="bg-slate-50 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{d}</div>
                  ))}

                  {Array.from({ length: firstDayOffset(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => (
                    <div key={`e-${i}`} className="bg-white h-20 md:h-32 opacity-40" />
                  ))}

                  {Array.from({ length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
                    const day = i + 1;
                    const iso = toIso(viewDate.getFullYear(), viewDate.getMonth(), day);
                    const deadlines = getDeadlinesForDay(day);
                    const holiday = getHoliday(day);
                    const isWeekend = (firstDayOffset(viewDate.getFullYear(), viewDate.getMonth()) + i) % 7 >= 5;
                    const userEvts = userEventsByDate.get(iso) ?? [];
                    const term = getTermForDate(viewDate.getMonth(), day);

                    return (
                      <button
                        key={day}
                        data-testid="calendar-day"
                        onClick={() => setSelectedDay(iso === selectedDay ? null : iso)}
                        className={`relative h-20 md:h-32 p-2 md:p-3 text-left transition-all duration-200 hover:z-10 hover:shadow-lg group
                          ${isWeekend ? 'bg-slate-50/60' : 'bg-white'}
                          ${holiday ? 'bg-sky-50/40' : ''}
                          ${selectedDay === iso ? 'ring-2 ring-inset ring-navy z-10 bg-navy/5' : ''}
                        `}
                      >
                        {/* Term color strip */}
                        {term && (
                          <div className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${term.color} opacity-60`} />
                        )}

                        <span className={`inline-flex w-7 h-7 items-center justify-center rounded-lg text-xs font-black transition-all
                          ${isToday(day) ? 'bg-navy text-white shadow-lg' : holiday ? 'text-sky-600' : 'text-slate-500 group-hover:text-navy group-hover:bg-slate-100'}`
                        }>
                          {day}
                        </span>

                        {/* Holiday label */}
                        {holiday && (
                          <div className="mt-1 text-[8px] font-bold text-sky-600 leading-tight truncate hidden md:block">
                            {holiday}
                          </div>
                        )}

                        {/* Deadline chips */}
                        {deadlines.slice(0, 1).map((dl, j) => (
                          <div key={j} className={`mt-1 text-[8px] font-black px-1.5 py-0.5 rounded-md truncate hidden md:block ${
                            dl.type === 'danger' ? 'bg-red-100 text-red-700' : dl.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {dl.title}
                          </div>
                        ))}

                        {/* User event dots */}
                        {userEvts.length > 0 && (
                          <div className="absolute bottom-1.5 left-2 flex gap-0.5">
                            {userEvts.slice(0, 3).map((evt, j) => (
                              <span key={j} className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOT[evt.category]}`} />
                            ))}
                          </div>
                        )}

                        {/* Deadline dot on mobile */}
                        {deadlines.length > 0 && (
                          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-400 md:hidden" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-4 px-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-navy" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1.5 rounded-sm bg-red-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deadline</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1.5 rounded-sm bg-sky-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Holiday</span>
                  </div>
                  {TERMS.map(t => (
                    <div key={t.id} className="flex items-center gap-1.5">
                      <div className={`w-3 h-1 rounded-full bg-linear-to-r ${t.color}`} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Terms ── */}
            {activeTab === 'terms' && (
              <motion.div
                key="terms-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {TERMS.map((term, i) => (
                    <motion.div
                      key={term.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.08)' }}
                      className="bg-white border border-slate-100 rounded-3xl p-6 transition-all cursor-default"
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${term.color} flex items-center justify-center text-white font-black text-xl shadow-md`}>
                          {term.id}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{term.weeks}w</span>
                      </div>
                      <h3 className="text-lg font-black text-navy mb-3">{term.name}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Start</span>
                          <span className="text-xs font-bold text-slate-900">{term.start}</span>
                        </div>
                        <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">End</span>
                          <span className="text-xs font-bold text-slate-900">{term.end}</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 mt-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Holidays</p>
                          <p className="text-xs font-semibold text-slate-600">{term.holidays}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Term timeline bar */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">2026 Academic Year Overview</p>
                  <div className="flex gap-1 h-8 rounded-xl overflow-hidden">
                    {TERMS.map((term, i) => (
                      <div
                        key={term.id}
                        className={`flex-1 bg-linear-to-r ${term.color} flex items-center justify-center`}
                        style={{ flexGrow: term.weeks }}
                      >
                        <span className="text-[10px] font-black text-white/90">{term.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-slate-400">Jan</span>
                    <span className="text-[10px] text-slate-400">Apr</span>
                    <span className="text-[10px] text-slate-400">Jul</span>
                    <span className="text-[10px] text-slate-400">Oct</span>
                    <span className="text-[10px] text-slate-400">Dec</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Deadlines ── */}
            {activeTab === 'deadlines' && (
              <motion.div
                key="deadlines-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto space-y-3"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Key Dates for 2026 — Sorted by Date</p>
                {sortedDeadlines.map((item, i) => {
                  const days = daysUntil(item.isoDate);
                  const isPast = days < 0;
                  const typeStyle = {
                    danger:  { bg: 'bg-red-50',   border: 'border-red-100',   text: 'text-red-600',   badge: 'bg-red-100 text-red-700',     dot: 'bg-red-400',   iconBg: 'bg-red-100 text-red-600' },
                    warning: { bg: 'bg-amber-50',  border: 'border-amber-100', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400', iconBg: 'bg-amber-100 text-amber-600' },
                    info:    { bg: 'bg-blue-50',   border: 'border-blue-100',  text: 'text-blue-700',  badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-400',  iconBg: 'bg-blue-100 text-blue-600' },
                    success: { bg: 'bg-green-50',  border: 'border-green-100', text: 'text-green-700', badge: 'bg-green-100 text-green-700', dot: 'bg-green-400', iconBg: 'bg-green-100 text-green-600' },
                  }[item.type];

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isPast ? 'opacity-50 bg-slate-50 border-slate-100' : `${typeStyle.bg} ${typeStyle.border}`}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isPast ? 'bg-slate-100 text-slate-400' : typeStyle.iconBg}`}>
                        <DeadlineIcon icon={item.icon} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 ${isPast ? 'text-slate-400' : 'text-slate-400'}`}>{item.category}</p>
                        <h4 className={`text-sm font-bold truncate ${isPast ? 'text-slate-500 line-through' : typeStyle.text}`}>{item.title}</h4>
                      </div>
                      <div className="text-right shrink-0 space-y-1">
                        <div className={`text-xs font-black px-2.5 py-1 rounded-lg ${isPast ? 'bg-slate-100 text-slate-400' : typeStyle.badge}`}>{item.date}</div>
                        {!isPast && (
                          <div className="text-[10px] font-bold text-slate-400">
                            {days === 0 ? 'Today!' : `${days}d away`}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Day event modal */}
      <AnimatePresence>
        {selectedDay && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 z-50 bg-white rounded-3xl shadow-2xl border border-slate-100 w-full md:w-[420px] overflow-hidden max-h-[90vh] flex flex-col"
              data-testid="create-event-modal"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                <div>
                  <h3 className="text-sm font-black text-navy">{selectedDayLabel}</h3>
                  {(() => {
                    const [y, m, d] = (selectedDay ?? '').split('-').map(Number);
                    const term = getTermForDate(m - 1, d);
                    return term ? <span className={`text-[10px] font-bold ${term.light.split(' ')[2]}`}>{term.name}</span> : null;
                  })()}
                </div>
                <button onClick={() => setSelectedDay(null)} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                {/* Deadlines on this day */}
                {(() => {
                  const [y, m, d] = (selectedDay ?? '').split('-').map(Number);
                  const dayDeadlines = DEADLINES.filter(dl => dl.isoDate === selectedDay);
                  const holiday = PUBLIC_HOLIDAY_MAP[selectedDay ?? ''];
                  return (dayDeadlines.length > 0 || holiday) ? (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Key Dates</p>
                      {holiday && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 border border-sky-200">
                          <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                          <p className="text-xs font-bold text-sky-700">{holiday}</p>
                          <span className="ml-auto text-[9px] font-bold text-sky-400 uppercase">Public Holiday</span>
                        </div>
                      )}
                      {dayDeadlines.map((dl, i) => (
                        <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                          dl.type === 'danger' ? 'bg-red-50 border border-red-200' : dl.type === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'
                        }`}>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${dl.type === 'danger' ? 'bg-red-400' : dl.type === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                          <p className={`text-xs font-bold ${dl.type === 'danger' ? 'text-red-700' : dl.type === 'warning' ? 'text-amber-700' : 'text-blue-700'}`}>{dl.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : null;
                })()}

                {/* User events */}
                {(userEventsByDate.get(selectedDay) ?? []).length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Events</p>
                    {(userEventsByDate.get(selectedDay) ?? []).map(evt => (
                      <div key={evt.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${CATEGORY_COLORS[evt.category]}`}>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${CATEGORY_DOT[evt.category]}`} />
                        <p className="text-xs font-bold flex-1">{evt.eventName}</p>
                        <button
                          onClick={() => { calendarStorage.deleteEvent(evt.id); reloadEvents(); }}
                          className="p-1 hover:bg-white/60 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add event */}
                <div className="space-y-3 pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Add Event</p>
                  <input
                    type="text"
                    value={newEventName}
                    onChange={e => setNewEventName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveEvent()}
                    data-testid="event-description"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 transition-all placeholder:text-slate-300"
                    placeholder="Maths exam, assignment due..."
                  />
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['exam', 'deadline', 'holiday', 'other'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setNewEventCategory(cat)}
                        className={`py-2 text-[9px] font-black uppercase tracking-widest rounded-xl border transition-all ${newEventCategory === cat ? CATEGORY_COLORS[cat] : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex gap-2 shrink-0">
                <button
                  onClick={() => setSelectedDay(null)}
                  className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-widest border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={saveEvent}
                  disabled={!newEventName.trim()}
                  data-testid="create-event-btn"
                  className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
                    savedEvent
                      ? 'bg-emerald-500 text-white'
                      : 'bg-navy text-white hover:bg-navy/90 disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  {savedEvent ? 'Saved ✓' : <><Plus className="w-3.5 h-3.5" /> Add Event</>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
