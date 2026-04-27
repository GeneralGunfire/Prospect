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
  Search,
  Grid3x3,
  Clock,
  List,
  Filter,
  ChevronDown,
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

const CHIP = {
  deadline: 'bg-red-50     border border-red-200     text-red-700',
  school:   'bg-blue-50    border border-blue-200    text-blue-700',
  holiday:  'bg-slate-50    border border-slate-200    text-slate-600',
  personal: 'bg-blue-50 border border-blue-200 text-blue-700',
  exam:     'bg-red-50     border border-red-200     text-red-700',
} as const;

const DOT = {
  deadline: 'bg-red-500',
  school:   'bg-blue-500',
  holiday:  'bg-slate-500',
  personal: 'bg-blue-500',
  exam:     'bg-red-500',
} as const;

const EVENT_STYLE: Record<UserCalendarEvent['category'], { chip: string; dot: string; label: string }> = {
  exam:     { chip: CHIP.exam,     dot: DOT.exam,     label: 'Exam' },
  deadline: { chip: CHIP.deadline, dot: DOT.deadline, label: 'Deadline' },
  holiday:  { chip: CHIP.holiday,  dot: DOT.holiday,  label: 'Holiday' },
  other:    { chip: CHIP.personal, dot: DOT.personal, label: 'Event' },
};

function deadlineChip(category: string): string {
  if (category === 'Exams') return CHIP.exam;
  if (category === 'Funding') return CHIP.holiday;
  return CHIP.school;
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

const TERM_GRADIENT = ['from-blue-400 to-blue-500', 'from-blue-500 to-blue-600', 'from-blue-600 to-blue-700', 'from-blue-700 to-slate-700'];

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

function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

const DeadlineIcon = ({ icon, className = 'w-4 h-4' }: { icon: DeadlineEvent['icon']; className?: string }) => {
  if (icon === 'funding') return <Wallet className={className} />;
  if (icon === 'exam')    return <BookOpen className={className} />;
  return <GraduationCap className={className} />;
};

// ── Filter dropdown ────────────────────────────────────────────────────────────
function FilterDropdown({ label, options, selected, onToggle, onClear }: {
  label: string;
  options: { value: string; label: string; dot?: string }[];
  selected: string[];
  onToggle: (v: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={[
          'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all',
          selected.length > 0
            ? 'border-blue-300 bg-blue-50 text-blue-700'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
        ].join(' ')}
      >
        <Filter className="w-3.5 h-3.5" />
        {label}
        {selected.length > 0 && (
          <span className="bg-blue-600 text-white rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none">
            {selected.length}
          </span>
        )}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute top-full mt-1.5 left-0 z-20 bg-white border border-slate-200 rounded-xl shadow-lg min-w-[160px] overflow-hidden"
            >
              <div className="py-1">
                {options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onToggle(opt.value)}
                    className={[
                      'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left',
                      selected.includes(opt.value)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    {opt.dot && <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${opt.dot}`} />}
                    <span className="flex-1">{opt.label}</span>
                    {selected.includes(opt.value) && (
                      <span className="text-blue-500 font-bold text-xs">✓</span>
                    )}
                  </button>
                ))}
                {selected.length > 0 && (
                  <>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => { onClear(); setOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <X className="w-3 h-3" /> Clear filter
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CalendarPageNew({ onNavigate, onSignOut }: CalendarPageProps) {
  const [activeTab, setActiveTab]     = useState<'calendar' | 'terms' | 'deadlines'>('calendar');
  const [calView, setCalView]         = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [viewDate, setViewDate]       = useState(new Date(ACADEMIC_YEAR, new Date().getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [userEventsByDate, setUserEventsByDate] = useState<Map<string, UserCalendarEvent[]>>(
    () => buildEventMap(calendarStorage.getEvents())
  );
  const [newEventName,     setNewEventName]     = useState('');
  const [newEventCategory, setNewEventCategory] = useState<UserCalendarEvent['category']>('other');
  const [savedEvent,       setSavedEvent]       = useState(false);
  const [searchQuery,      setSearchQuery]      = useState('');

  // Filter state
  const [showDeadlines, setShowDeadlines] = useState(true);
  const [showHolidays,  setShowHolidays]  = useState(true);
  const [showPersonal,  setShowPersonal]  = useState(true);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);

  const reloadEvents = () => setUserEventsByDate(buildEventMap(calendarStorage.getEvents()));

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = useCallback(() => setViewDate(new Date(year, month - 1, 1)), [year, month]);
  const nextMonth = useCallback(() => setViewDate(new Date(year, month + 1, 1)), [year, month]);

  const prevWeek  = useCallback(() => setViewDate(d => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; }), []);
  const nextWeek  = useCallback(() => setViewDate(d => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; }), []);

  const prevDay   = useCallback(() => setViewDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; }), []);
  const nextDay   = useCallback(() => setViewDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; }), []);

  const goToToday = () => setViewDate(new Date(ACADEMIC_YEAR, new Date().getMonth(), new Date().getDate()));

  const navigatePrev = () => {
    if (calView === 'month') prevMonth();
    else if (calView === 'week') prevWeek();
    else if (calView === 'day') prevDay();
  };
  const navigateNext = () => {
    if (calView === 'month') nextMonth();
    else if (calView === 'week') nextWeek();
    else if (calView === 'day') nextDay();
  };

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

  // ── Filtered search results ────────────────────────────────────────────────
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results: { iso: string; label: string; type: string; chip: string }[] = [];
    for (const dl of DEADLINES) {
      if (dl.title.toLowerCase().includes(q) || dl.category.toLowerCase().includes(q)) {
        results.push({ iso: dl.isoDate, label: dl.title, type: dl.category, chip: deadlineChip(dl.category) });
      }
    }
    for (const [iso, evts] of userEventsByDate) {
      for (const e of evts) {
        if (e.eventName.toLowerCase().includes(q)) {
          results.push({ iso, label: e.eventName, type: EVENT_STYLE[e.category].label, chip: EVENT_STYLE[e.category].chip });
        }
      }
    }
    for (const [iso, name] of Object.entries(PUBLIC_HOLIDAY_MAP)) {
      if (name.toLowerCase().includes(q)) {
        results.push({ iso, label: name, type: 'Holiday', chip: CHIP.holiday });
      }
    }
    return results.sort((a, b) => a.iso.localeCompare(b.iso));
  }, [searchQuery, userEventsByDate]);

  const mockUser = { id: 'user', email: 'student@prospect.co.za', user_metadata: { full_name: 'Prospect Student' } } as any;

  // ── Calendar nav title ────────────────────────────────────────────────────
  const navTitle = useMemo(() => {
    if (calView === 'month') return `${MONTH_NAMES[month]} ${year}`;
    if (calView === 'week') {
      const ws = getWeekStart(viewDate);
      const we = new Date(ws); we.setDate(ws.getDate() + 6);
      return `${ws.getDate()} ${MONTH_NAMES[ws.getMonth()].slice(0,3)} – ${we.getDate()} ${MONTH_NAMES[we.getMonth()].slice(0,3)}`;
    }
    if (calView === 'day') return viewDate.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' });
    return 'All Events';
  }, [calView, month, year, viewDate]);

  // ── Shared side panel ─────────────────────────────────────────────────────
  const renderSidePanel = () => (
    <div className="lg:w-72 shrink-0 space-y-4">
      <AnimatePresence mode="wait">
        {selectedDay ? (
          <motion.div key="day-detail" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.16 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Selected</p>
                <h4 className="text-sm font-black">{selectedDayLabel}</h4>
                {(() => {
                  const [, m, d] = selectedDay.split('-').map(Number);
                  const t = getTermForDate(m - 1, d);
                  return t ? <span className="text-[10px] text-blue-200">{t.name}</span> : null;
                })()}
              </div>
              <button onClick={() => setSelectedDay(null)} className="p-1.5 hover:bg-white/10 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[52vh] overflow-y-auto">
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

              <div className="space-y-2 pt-1 border-t border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Add Event</p>
                <input
                  type="text" value={newEventName} onChange={e => setNewEventName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEvent()}
                  data-testid="event-description"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-slate-300 transition-all"
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
                  className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${savedEvent ? 'bg-slate-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed'}`}>
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
    </div>
  );

  // ── Month view ────────────────────────────────────────────────────────────
  const renderMonth = () => {
    const offset = firstDayOffset(year, month);
    const days   = daysInMonth(year, month);

    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          {/* Stats bar */}
          <div className="flex flex-wrap gap-2 mb-5">
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
              <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                <p className="text-xs font-bold text-blue-700">{eventsThisWeek} this week</p>
              </div>
            )}
            {currentTerm && (
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <Flag className="w-3 h-3 text-slate-500" />
                <p className="text-xs font-bold text-slate-600">{currentTerm.name}</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
              {WEEK_DAYS.map((d, i) => (
                <div key={d} className={`py-3 text-center text-[10px] font-black uppercase tracking-widest ${i >= 5 ? 'text-slate-400' : 'text-slate-600'}`}>
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`e-${i}`} className="h-24 md:h-28 bg-slate-50/40 border-b border-r border-slate-100" />
              ))}

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
                      holiday && !hasDeadline && !isSelected ? 'bg-slate-50/30' : '',
                      isSelected ? 'bg-blue-50 ring-2 ring-inset ring-blue-500 z-10' : '',
                      (offset + i) % 7 === 6 ? 'border-r-0' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    {inTerm && <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-300/60" />}
                    <span className={[
                      'inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black mb-1.5 transition-all',
                      today
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-300/50 scale-110'
                        : isSelected
                          ? 'bg-blue-100 text-blue-700'
                          : isWeekend
                            ? 'text-slate-400'
                            : 'text-slate-700',
                    ].filter(Boolean).join(' ')}>
                      {day}
                    </span>
                    <div className="hidden md:flex flex-col gap-0.5">
                      {visible.map(c => (
                        <span key={c.key} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate leading-tight ${c.chip}`}>
                          {c.label}
                        </span>
                      ))}
                      {overflow > 0 && <span className="text-[9px] font-bold text-slate-400 pl-1">+{overflow}</span>}
                    </div>
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

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-[8px] font-black text-white">17</span>
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
        {renderSidePanel()}
      </div>
    );
  };

  // ── Week view ─────────────────────────────────────────────────────────────
  const renderWeek = () => {
    const weekStart = getWeekStart(viewDate);
    const weekDays  = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
      return d;
    });

    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
              {weekDays.map((d, i) => {
                const todayFlag = isToday(d.getDate(), d.getMonth(), d.getFullYear());
                return (
                  <div key={i} className="py-3 text-center">
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${i >= 5 ? 'text-slate-400' : 'text-slate-500'}`}>
                      {WEEK_DAYS[i]}
                    </p>
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black mx-auto ${
                      todayFlag ? 'bg-blue-600 text-white shadow-sm shadow-blue-300/50' : i >= 5 ? 'text-slate-400' : 'text-slate-700'
                    }`}>
                      {d.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[360px]">
              {weekDays.map((d, i) => {
                const iso       = toIso(d.getFullYear(), d.getMonth(), d.getDate());
                const dlList    = getDeadlinesForIso(iso);
                const holiday   = getHoliday(iso);
                const userEvts  = showPersonal ? (userEventsByDate.get(iso) ?? []) : [];
                const isSelected = selectedDay === iso;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(iso === selectedDay ? null : iso)}
                    className={[
                      'p-2 text-left transition-colors hover:bg-blue-50/50 min-h-[360px] flex flex-col gap-1',
                      i >= 5 ? 'bg-slate-50/50' : 'bg-white',
                      isSelected ? 'bg-blue-50 ring-2 ring-inset ring-blue-400' : '',
                    ].join(' ')}
                  >
                    {holiday && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate ${CHIP.holiday}`}>
                        {holiday.split(' ')[0]}
                      </span>
                    )}
                    {dlList.map(dl => (
                      <span key={dl.isoDate + dl.title} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate ${deadlineChip(dl.category)}`}>
                        {dl.shortTitle}
                      </span>
                    ))}
                    {userEvts.map(e => (
                      <span key={e.id} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate ${EVENT_STYLE[e.category].chip}`}>
                        {e.eventName}
                      </span>
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

  // ── Day view ──────────────────────────────────────────────────────────────
  const renderDay = () => {
    const iso      = toIso(viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate());
    const dlList   = getDeadlinesForIso(iso);
    const holiday  = getHoliday(iso);
    const userEvts = showPersonal ? (userEventsByDate.get(iso) ?? []) : [];
    const term     = getTermForDate(viewDate.getMonth(), viewDate.getDate());
    const todayFlag = isToday(viewDate.getDate(), viewDate.getMonth(), viewDate.getFullYear());
    const hasItems = dlList.length > 0 || !!holiday || userEvts.length > 0;

    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Day header */}
            <div className={`px-6 py-5 border-b border-slate-100 flex items-center justify-between ${todayFlag ? 'bg-blue-50' : 'bg-slate-50'}`}>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  {viewDate.toLocaleDateString('en-ZA', { weekday: 'long' })}
                </p>
                <h3 className={`text-3xl font-black ${todayFlag ? 'text-blue-600' : 'text-slate-800'}`}>
                  {viewDate.getDate()}
                </h3>
                <p className="text-sm text-slate-500">{MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}</p>
              </div>
              <div className="text-right space-y-1">
                {todayFlag && <span className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Today</span>}
                {term && <p className="text-[10px] font-bold text-slate-500">{term.name}</p>}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {!hasItems && (
                <div className="text-center py-12">
                  <CalendarIcon className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-400">No events on this day</p>
                  <p className="text-xs text-slate-300 mt-1">Click a day in month view to add one</p>
                </div>
              )}

              {holiday && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${CHIP.holiday}`}>
                  <span className={`w-3 h-3 rounded-full shrink-0 ${DOT.holiday}`} />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Public Holiday</p>
                    <p className="text-sm font-bold">{holiday}</p>
                  </div>
                </div>
              )}

              {dlList.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Deadlines &amp; Key Dates</p>
                  {dlList.map((dl, i) => (
                    <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${deadlineChip(dl.category)}`}>
                      <DeadlineIcon icon={dl.icon} className="w-4 h-4 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{dl.category}</p>
                        <p className="text-sm font-bold">{dl.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {userEvts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Your Events</p>
                  {userEvts.map(evt => (
                    <div key={evt.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${EVENT_STYLE[evt.category].chip}`}>
                      <span className={`w-3 h-3 rounded-full shrink-0 ${EVENT_STYLE[evt.category].dot}`} />
                      <p className="text-sm font-bold flex-1">{evt.eventName}</p>
                      <button onClick={() => { calendarStorage.deleteEvent(evt.id); reloadEvents(); }} className="p-1 hover:opacity-60 transition-opacity">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add event inline */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Add Event to This Day</p>
                <div className="flex gap-2">
                  <input
                    type="text" value={newEventName} onChange={e => setNewEventName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { setSelectedDay(iso); saveEvent(); } }}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-slate-300 transition-all"
                    placeholder="Event name..."
                  />
                  <button
                    onClick={() => { setSelectedDay(iso); saveEvent(); }}
                    disabled={!newEventName.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-40 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-1">
                  {(['exam','deadline','holiday','other'] as const).map(cat => (
                    <button key={cat} onClick={() => setNewEventCategory(cat)}
                      className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${newEventCategory === cat ? EVENT_STYLE[cat].chip : 'bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100'}`}>
                      {EVENT_STYLE[cat].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {renderSidePanel()}
      </div>
    );
  };

  // ── List view ─────────────────────────────────────────────────────────────
  const renderList = () => {
    type ListItem = { iso: string; label: string; category: string; icon?: DeadlineEvent['icon']; chip: string; dot: string; daysAway: number; isUser?: boolean; userId?: string };
    const items: ListItem[] = [];

    if (showDeadlines) {
      for (const dl of DEADLINES) {
        items.push({ iso: dl.isoDate, label: dl.title, category: dl.category, icon: dl.icon, chip: deadlineChip(dl.category), dot: deadlineDot(dl.category), daysAway: daysUntil(dl.isoDate) });
      }
    }
    if (showHolidays) {
      for (const [iso, name] of Object.entries(PUBLIC_HOLIDAY_MAP)) {
        items.push({ iso, label: name, category: 'Holiday', chip: CHIP.holiday, dot: DOT.holiday, daysAway: daysUntil(iso) });
      }
    }
    if (showPersonal) {
      for (const [iso, evts] of userEventsByDate) {
        for (const e of evts) {
          items.push({ iso, label: e.eventName, category: EVENT_STYLE[e.category].label, chip: EVENT_STYLE[e.category].chip, dot: EVENT_STYLE[e.category].dot, daysAway: daysUntil(iso), isUser: true, userId: e.id });
        }
      }
    }

    const sorted = items.sort((a, b) => a.iso.localeCompare(b.iso));
    const upcoming = sorted.filter(i => i.daysAway >= 0);
    const past     = sorted.filter(i => i.daysAway < 0);

    const renderGroup = (group: ListItem[], isPast = false) => (
      <div className="space-y-2">
        {group.map((item, i) => (
          <motion.div
            key={`${item.iso}-${i}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            className={[
              'flex items-center gap-3 p-3.5 rounded-xl border transition-all',
              isPast ? 'opacity-40 bg-slate-50 border-slate-100' : item.chip,
            ].join(' ')}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white/60`}>
              {item.icon
                ? <DeadlineIcon icon={item.icon} className="w-4 h-4" />
                : <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] opacity-60">{item.category}</p>
              <h4 className={`text-sm font-bold truncate ${isPast ? 'line-through text-slate-400' : ''}`}>{item.label}</h4>
            </div>
            <div className="text-right shrink-0 flex items-center gap-2">
              <div>
                <div className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-white/60 mb-0.5">
                  {new Date(item.iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                </div>
                {!isPast && (
                  <div className={`text-[10px] font-black text-right ${item.daysAway === 0 ? 'text-red-600' : item.daysAway <= 14 ? 'text-amber-500' : 'opacity-60'}`}>
                    {item.daysAway === 0 ? 'Today!' : `${item.daysAway}d`}
                  </div>
                )}
              </div>
              {item.isUser && !isPast && (
                <button onClick={() => { calendarStorage.deleteEvent(item.userId!); reloadEvents(); }} className="p-1 hover:opacity-60 ml-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );

    return (
      <div className="max-w-2xl space-y-6">
        {upcoming.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Upcoming · {upcoming.length} events</p>
            {renderGroup(upcoming)}
          </div>
        )}
        {past.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Past</p>
            {renderGroup(past, true)}
          </div>
        )}
      </div>
    );
  };

  // ── Page render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AppHeader currentPage="calendar" user={mockUser} onNavigate={onNavigate} mode="school" />

      <main className="pt-24 pb-20 px-4 md:px-6 max-w-7xl mx-auto">

        {/* ── Page header ── */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/5 mb-3">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-700" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Academic Calendar {ACADEMIC_YEAR}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800">Study Calendar</h1>
          <p className="text-sm text-slate-400 mt-1">Track terms, deadlines, and personal events.</p>
        </div>

        {/* ── Main tab bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex w-fit p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            {(['calendar','terms','deadlines'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-blue-600'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* View switcher — only in calendar tab */}
          {activeTab === 'calendar' && (
            <>
              {/* Desktop button group */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                <button onClick={() => setCalView('month')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${calView === 'month' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-700'}`}>
                  <CalendarIcon className="w-3.5 h-3.5" /> Month
                </button>
                <button onClick={() => setCalView('week')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${calView === 'week' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-700'}`}>
                  <Grid3x3 className="w-3.5 h-3.5" /> Week
                </button>
                <button onClick={() => setCalView('day')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${calView === 'day' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-700'}`}>
                  <Clock className="w-3.5 h-3.5" /> Day
                </button>
                <button onClick={() => setCalView('list')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${calView === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-700'}`}>
                  <List className="w-3.5 h-3.5" /> List
                </button>
              </div>

              {/* Mobile select */}
              <select
                value={calView}
                onChange={e => setCalView(e.target.value as any)}
                className="sm:hidden px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="month">Month View</option>
                <option value="week">Week View</option>
                <option value="day">Day View</option>
                <option value="list">List View</option>
              </select>
            </>
          )}
        </div>

        {/* ── Calendar sub-header (nav + search + filters) ── */}
        {activeTab === 'calendar' && (
          <div className="flex flex-col gap-3 mb-6">
            {/* Nav row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {calView !== 'list' && (
                  <div className="flex items-center gap-1.5">
                    <button onClick={navigatePrev}
                      className="w-8 h-8 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center transition-all shadow-sm">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={goToToday}
                      className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
                      Today
                    </button>
                    <button onClick={navigateNext}
                      className="w-8 h-8 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center transition-all shadow-sm">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {calView !== 'list' && (
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">{navTitle}</h3>
                  </div>
                )}
              </div>
            </div>

            {/* Search + filter row */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events & deadlines…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-slate-400 shadow-sm transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <FilterDropdown
                  label="Deadlines"
                  options={[
                    { value: 'University', label: 'University', dot: DOT.school },
                    { value: 'Funding', label: 'Funding', dot: DOT.holiday },
                    { value: 'Exams', label: 'Exams', dot: DOT.exam },
                    { value: 'TVET', label: 'TVET', dot: DOT.school },
                  ]}
                  selected={filterCategories}
                  onToggle={v => setFilterCategories(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])}
                  onClear={() => setFilterCategories([])}
                />
                <button
                  onClick={() => setShowHolidays(s => !s)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${showHolidays ? `${CHIP.holiday}` : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50'}`}
                >
                  Holidays
                </button>
                <button
                  onClick={() => setShowPersonal(s => !s)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${showPersonal ? `${CHIP.personal}` : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50'}`}
                >
                  My Events
                </button>
              </div>
            </div>

            {/* Search results dropdown */}
            <AnimatePresence>
              {searchResults && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden max-h-72 overflow-y-auto"
                >
                  {searchResults.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-400">No results for "{searchQuery}"</div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {searchResults.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const [y, m] = r.iso.split('-').map(Number);
                            setViewDate(new Date(y, m - 1, 1));
                            setSelectedDay(r.iso);
                            setSearchQuery('');
                            setCalView('month');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                        >
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 bg-current`} style={{ backgroundColor: '' }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">{r.label}</p>
                            <p className="text-[10px] text-slate-400">{r.type} · {new Date(r.iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${r.chip}`}>{r.type}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">
          {activeTab === 'calendar' && (
            <motion.div key={`cal-${calView}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {calView === 'month' && renderMonth()}
              {calView === 'week'  && renderWeek()}
              {calView === 'day'   && renderDay()}
              {calView === 'list'  && renderList()}
            </motion.div>
          )}

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

          {activeTab === 'deadlines' && (
            <motion.div key="deadlines" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">All Key Dates · Sorted by Date</p>
              {sortedDeadlines.map((item, i) => {
                const days   = daysUntil(item.isoDate);
                const isPast = days < 0;
                const chip   = deadlineChip(item.category);

                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${isPast ? 'opacity-40 bg-slate-50 border-slate-100' : chip}`}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white/60">
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
