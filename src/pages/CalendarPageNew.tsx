import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Bell,
  Clock,
  X,
  Plus,
  Trash2,
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
  { 
    id: 1, 
    name: 'Term 1', 
    start: '14 Jan', 
    end: '27 Mar', 
    weeks: 11, 
    holidays: '28 Mar – 7 Apr',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: 2, 
    name: 'Term 2', 
    start: '8 Apr', 
    end: '26 Jun', 
    weeks: 12, 
    holidays: '27 Jun – 20 Jul',
    color: 'from-indigo-500 to-indigo-600'
  },
  { 
    id: 3, 
    name: 'Term 3', 
    start: '21 Jul', 
    end: '2 Oct', 
    weeks: 11, 
    holidays: '3 Oct – 12 Oct',
    color: 'from-violet-500 to-violet-600'
  },
  { 
    id: 4, 
    name: 'Term 4', 
    start: '13 Oct', 
    end: '9 Dec', 
    weeks: 9, 
    holidays: '10 Dec – Jan 2027',
    color: 'from-emerald-500 to-emerald-600'
  },
];

interface Event {
  title: string;
  date: string;
  category: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  dotColor: string;
}

const DEADLINES: Event[] = [
  { title: 'UP Applications Open', date: '1 April', category: 'University', type: 'warning', dotColor: 'bg-amber-400' },
  { title: 'Wits Early Applications', date: '30 June', category: 'University', type: 'danger', dotColor: 'bg-red-500' },
  { title: 'NSFAS 2027 Opens', date: '1 September', category: 'Funding', type: 'info', dotColor: 'bg-blue-500' },
  { title: 'Matric Finals Begin', date: '20 October', category: 'Exams', type: 'danger', dotColor: 'bg-prospect-gold' },
];

const PUBLIC_HOLIDAYS = ['1 Jan', '21 Mar', '3 Apr', '6 Apr', '27 Apr', '1 May', '16 Jun', '9 Aug', '24 Sep', '16 Dec', '25 Dec', '26 Dec'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CATEGORY_COLORS: Record<UserCalendarEvent['category'], string> = {
  exam:     'bg-red-50 text-red-600 border-red-200',
  deadline: 'bg-amber-50 text-amber-600 border-amber-200',
  holiday:  'bg-sky-50 text-sky-600 border-sky-200',
  other:    'bg-indigo-50 text-indigo-600 border-indigo-200',
};

const CATEGORY_DOT: Record<UserCalendarEvent['category'], string> = {
  exam:     'bg-red-400',
  deadline: 'bg-amber-400',
  holiday:  'bg-sky-400',
  other:    'bg-indigo-400',
};

function buildEventMap(events: UserCalendarEvent[]): Map<string, UserCalendarEvent[]> {
  const m = new Map<string, UserCalendarEvent[]>();
  for (const e of events) {
    if (!m.has(e.eventDate)) m.set(e.eventDate, []);
    m.get(e.eventDate)!.push(e);
  }
  return m;
}

function pad(n: number) { return String(n).padStart(2, '0'); }
function toIso(y: number, month: number, d: number) {
  return `${y}-${pad(month + 1)}-${pad(d)}`;
}

export default function CalendarPageNew({ onNavigate, onSignOut }: CalendarPageProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'terms' | 'deadlines'>('calendar');
  const [viewDate, setViewDate] = useState(new Date(ACADEMIC_YEAR, 0, 1)); // Start at Jan 2026
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [userEventsByDate, setUserEventsByDate] = useState<Map<string, UserCalendarEvent[]>>(() =>
    buildEventMap(calendarStorage.getEvents())
  );
  const [newEventName, setNewEventName] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<UserCalendarEvent['category']>('other');
  const [savingEvent, setSavingEvent] = useState(false);
  const [savedEvent, setSavedEvent] = useState(false);

  const reloadEvents = () => setUserEventsByDate(buildEventMap(calendarStorage.getEvents()));

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOffset = (y: number, m: number) => {
    const d = new Date(y, m, 1).getDay();
    return d === 0 ? 6 : d - 1; // Monday start
  };

  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));

  const isToday = (day: number) => {
    const now = new Date();
    return now.getDate() === day && now.getMonth() === viewDate.getMonth() && now.getFullYear() === viewDate.getFullYear();
  };

  // Simple helper to check if a day has a deadline (matches the mock data strings)
  const hasDeadline = (day: number) => {
    const monthName = MONTH_NAMES[viewDate.getMonth()];
    const dateStr = `${day} ${monthName}`;
    return DEADLINES.find(d => d.date === dateStr || d.date === `0${day} ${monthName}`);
  };

  const isPublicHoliday = (day: number) => {
    const monthName = MONTH_NAMES[viewDate.getMonth()].substring(0, 3);
    const dateStr = `${day} ${monthName}`;
    return PUBLIC_HOLIDAYS.some(h => h.startsWith(`${day} `) && h.endsWith(monthName));
  };

  const nextDeadline = useMemo(() => {
    // For UI purposes, just grab the first one as "upcoming"
    return DEADLINES[0];
  }, []);

  const eventsThisMonth = useMemo(() => {
    const monthName = MONTH_NAMES[viewDate.getMonth()];
    return DEADLINES.filter(d => d.date.includes(monthName));
  }, [viewDate]);

  // Mock user for Header
  const mockUser = {
    id: 'user',
    email: 'student@prospect.co.za',
    user_metadata: { full_name: 'Prospect Student' }
  } as any;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AppHeader 
        currentPage="calendar" 
        user={mockUser} 
        onNavigate={onNavigate} 
        mode="school"
      />

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Hero Section — functional, not decorative */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 mb-4">
              <CalendarIcon className="w-4 h-4 text-slate-900" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Academic Calendar {ACADEMIC_YEAR}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
              Study Calendar
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">
              Track school terms, public holidays, and critical application deadlines. Click any day to add personal events.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
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
            {/* Centered Tab Selector */}
            <div className="flex max-w-md mx-auto p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              {(['calendar', 'terms', 'deadlines'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? 'bg-navy text-white shadow-md' 
                      : 'text-slate-500 hover:text-navy hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Switcher - Now Full Width */}
            <AnimatePresence mode="wait">
              {activeTab === 'calendar' && (
                <motion.div
                  key="calendar-grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 overflow-hidden"
                >
                  {/* Month Header */}
                  <div className="flex items-center justify-between mb-8 px-2">
                    <h3 className="text-3xl font-black text-navy tracking-tight">
                      {MONTH_NAMES[viewDate.getMonth()]} <span className="text-slate-200">{viewDate.getFullYear()}</span>
                    </h3>
                    <div className="flex gap-3">
                      <button onClick={prevMonth} className="p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-all active:scale-95 shadow-sm">
                        <ChevronLeft className="w-6 h-6 text-navy" />
                      </button>
                      <button onClick={nextMonth} className="p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-all active:scale-95 shadow-sm">
                        <ChevronRight className="w-6 h-6 text-navy" />
                      </button>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-3xl overflow-hidden shadow-inner">
                    {WEEK_DAYS.map(d => (
                      <div key={d} className="bg-slate-50 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {d}
                      </div>
                    ))}
                    
                    {/* Empty starting cells */}
                    {Array.from({ length: firstDayOffset(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => (
                      <div key={`empty-${i}`} className="bg-slate-50/50 h-24 md:h-40" />
                    ))}

                    {/* Actual day cells */}
                    {Array.from({ length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
                      const day = i + 1;
                      const deadline = hasDeadline(day);
                      const isWeekend = (firstDayOffset(viewDate.getFullYear(), viewDate.getMonth()) + i) % 7 >= 5;
                      const iso = toIso(viewDate.getFullYear(), viewDate.getMonth(), day);
                      const userEvts = userEventsByDate.get(iso) ?? [];

                      return (
                        <button
                          key={day}
                          data-testid="calendar-day"
                          onClick={() => setSelectedDay(iso === selectedDay ? null : iso)}
                          className={`relative bg-white h-24 md:h-40 p-4 group transition-all duration-300 hover:z-10 hover:shadow-2xl hover:bg-blue-50/50 text-left w-full ${
                            isWeekend ? 'bg-slate-50/40' : ''
                          } ${selectedDay === iso ? 'ring-2 ring-inset ring-navy z-10' : ''}`}
                        >
                          <span className={`inline-flex w-8 h-8 items-center justify-center rounded-xl text-sm font-black transition-all ${
                            isToday(day)
                              ? 'bg-navy text-white shadow-xl shadow-navy/20 scale-110'
                              : 'text-slate-400 group-hover:text-navy'
                          }`}>
                            {day}
                          </span>

                          {deadline && (
                            <div className="mt-3 space-y-1">
                              <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg truncate shadow-sm ${
                                deadline.type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                              }`}>
                                {deadline.title}
                              </div>
                            </div>
                          )}

                          {/* User event dots */}
                          {userEvts.length > 0 && (
                            <div className="absolute bottom-2 left-2 flex gap-0.5">
                              {userEvts.slice(0, 3).map((evt, j) => (
                                <span key={j} className={`w-2 h-2 rounded-full ${CATEGORY_DOT[evt.category]}`} />
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'terms' && (
                <motion.div 
                  key="terms-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {TERMS.map((term, i) => (
                    <motion.div
                      key={term.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="group bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-blue-200 transition-all cursor-default"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${term.color} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                          {term.id}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {term.weeks} Weeks
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-navy mb-4">{term.name}</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-50">
                          <span className="text-xs font-bold text-slate-500 uppercase">Duration</span>
                          <span className="text-sm font-bold text-navy">{term.start} — {term.end}</span>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Upcoming Holidays</p>
                          <p className="text-xs font-bold text-slate-700">{term.holidays}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'deadlines' && (
                <motion.div
                  key="deadlines-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 max-w-3xl mx-auto"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Key Dates for 2026</p>
                  {DEADLINES.map((item, i) => {
                    const DEADLINE_ICONS: Record<string, React.ReactNode> = {
                      University: <ChevronRight className="w-4 h-4" />,
                      Funding: <Bell className="w-4 h-4" />,
                      Exams: <Bell className="w-4 h-4" />,
                    };
                    const typeStyle = {
                      danger:  { bg: 'bg-red-50',   border: 'border-red-100',   text: 'text-red-600',   badge: 'bg-red-100 text-red-700',   dot: 'bg-red-400' },
                      warning: { bg: 'bg-amber-50',  border: 'border-amber-100', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
                      info:    { bg: 'bg-blue-50',   border: 'border-blue-100',  text: 'text-blue-600',  badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-400' },
                      success: { bg: 'bg-green-50',  border: 'border-green-100', text: 'text-green-600', badge: 'bg-green-100 text-green-700', dot: 'bg-green-400' },
                    }[item.type];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`flex items-center gap-4 ${typeStyle.bg} border ${typeStyle.border} p-5 rounded-2xl`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${typeStyle.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{item.category}</p>
                          <h4 className={`font-bold truncate ${typeStyle.text}`}>{item.title}</h4>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${typeStyle.badge}`}>{item.date}</span>
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
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 z-50 bg-white rounded-3xl shadow-2xl border border-slate-100 w-full md:w-96 overflow-hidden"
              data-testid="create-event-modal"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="text-base font-black text-navy">{selectedDay}</h3>
                <button onClick={() => setSelectedDay(null)} className="p-1.5 hover:bg-slate-50 rounded-lg">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Existing user events */}
                {(userEventsByDate.get(selectedDay) ?? []).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Events</p>
                    {(userEventsByDate.get(selectedDay) ?? []).map(evt => (
                      <div key={evt.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${CATEGORY_COLORS[evt.category]}`}>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${CATEGORY_DOT[evt.category]}`} />
                        <p className="text-xs font-bold flex-1">{evt.eventName}</p>
                        <button onClick={() => { calendarStorage.deleteEvent(evt.id); reloadEvents(); }}
                          className="p-1 hover:bg-white/60 rounded-lg">
                          <Trash2 className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t border-slate-100" />
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">Add Event</label>
                  <input
                    type="text"
                    value={newEventName}
                    onChange={e => setNewEventName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !savingEvent && newEventName.trim() && (() => {
                      const evt: UserCalendarEvent = { id: `evt-${Date.now()}`, eventName: newEventName.trim(), eventDate: selectedDay!, category: newEventCategory, createdAt: new Date().toISOString() };
                      calendarStorage.saveEvent(evt); reloadEvents(); setSavedEvent(true); setNewEventName('');
                      setTimeout(() => setSavedEvent(false), 1200);
                    })()}
                    data-testid="event-description"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/30 transition-all"
                    placeholder="e.g. Maths exam, assignment due..."
                  />
                  <div className="flex gap-1.5">
                    {(['exam', 'deadline', 'other', 'holiday'] as const).map(cat => (
                      <button key={cat} onClick={() => setNewEventCategory(cat)}
                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all ${newEventCategory === cat ? CATEGORY_COLORS[cat] : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedDay(null)}
                    className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-widest border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50">
                    Close
                  </button>
                  <button
                    onClick={() => {
                      if (!newEventName.trim() || savingEvent) return;
                      setSavingEvent(true);
                      const evt: UserCalendarEvent = { id: `evt-${Date.now()}`, eventName: newEventName.trim(), eventDate: selectedDay!, category: newEventCategory, createdAt: new Date().toISOString() };
                      calendarStorage.saveEvent(evt); reloadEvents();
                      setSavingEvent(false); setSavedEvent(true); setNewEventName('');
                      setTimeout(() => setSavedEvent(false), 1200);
                    }}
                    disabled={!newEventName.trim()}
                    data-testid="create-event-btn"
                    className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${savedEvent ? 'bg-emerald-500 text-white' : 'bg-navy text-white hover:bg-navy/90 disabled:opacity-40'}`}
                  >
                    {savedEvent ? 'Saved ✓' : <><Plus className="w-3 h-3" /> Add</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}