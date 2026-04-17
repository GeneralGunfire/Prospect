import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sun, BookOpen, GraduationCap, Landmark, X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AppHeader from '../components/AppHeader';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import { calendarStorage, type UserCalendarEvent } from '../services/storageService';
import { pushCalendarEvent, deleteCalendarEvent as syncDeleteCalendarEvent } from '../services/supabaseSync';
import {
  SA_2026_EVENTS,
  getEventsForDate,
  getUpcomingEvents,
  TERM_SPANS,
  type SA2026Event,
  type EventType,
} from '../data/sa2026Calendar';

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const WEEK_DAYS = ['Mo','Tu','We','Th','Fr','Sa','Su'];

const EVENT_STYLE: Record<EventType, { bg: string; border: string; text: string; dot: string; label: string; icon: React.ReactNode }> = {
  public_holiday: { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  dot: 'bg-amber-400',  label: 'Public Holiday', icon: <Landmark className="w-3 h-3" /> },
  exam_week:      { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-600',    dot: 'bg-red-400',    label: 'Exam Period',    icon: <GraduationCap className="w-3 h-3" /> },
  holiday:        { bg: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-700',    dot: 'bg-sky-400',    label: 'School Holiday', icon: <Sun className="w-3 h-3" /> },
  term:           { bg: 'bg-emerald-50',border: 'border-emerald-200',text: 'text-emerald-700',dot: 'bg-emerald-400',label: 'School Term',    icon: <BookOpen className="w-3 h-3" /> },
};

// Cell tints — lighter than card backgrounds so text stays readable
const CELL_TINT: Record<EventType, string> = {
  public_holiday: 'bg-amber-50/70',
  exam_week:      'bg-red-50/60',
  holiday:        'bg-sky-50/60',
  term:           'bg-emerald-50/40',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function pad(n: number) { return String(n).padStart(2, '0'); }
function toIso(y: number, m: number, d: number) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOffset(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }
function getTermForDate(date: string) { return TERM_SPANS.find(t => date >= t.start && date <= t.end) ?? null; }
function formatShortDate(iso: string) {
  const [, m, d] = iso.split('-');
  return `${parseInt(d)} ${MONTH_NAMES[parseInt(m) - 1].slice(0, 3)}`;
}
function hasNamedEvents(monthKey: string) {
  return SA_2026_EVENTS.some(e => e.date.startsWith(monthKey) && e.type !== 'term');
}

// ── Upcoming Strip ────────────────────────────────────────────────────────────

function UpcomingStrip() {
  const events = useMemo(() => getUpcomingEvents(7), []);
  if (!events.length) return null;

  return (
    <div className="mb-8">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Upcoming</p>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {events.map((evt, i) => {
          const s = EVENT_STYLE[evt.type];
          return (
            <motion.div
              key={evt.date + evt.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border ${s.bg} ${s.border}`}
            >
              <span className={s.text}>{s.icon}</span>
              <div>
                <p className={`text-xs font-bold leading-none ${s.text}`}>{evt.shortName ?? evt.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{formatShortDate(evt.date)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Day Modal (view events + create user event) ───────────────────────────────

const CATEGORY_STYLE: Record<UserCalendarEvent['category'], { bg: string; border: string; text: string; dot: string }> = {
  exam:     { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    dot: 'bg-red-400' },
  deadline: { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  holiday:  { bg: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-700',    dot: 'bg-sky-400' },
  other:    { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-400' },
};

function DayModal({
  dateIso,
  sa2026Events,
  userEvents,
  onClose,
  onEventsChanged,
  userId,
}: {
  dateIso: string;
  sa2026Events: SA2026Event[];
  userEvents: UserCalendarEvent[];
  onClose: () => void;
  onEventsChanged: () => void;
  userId: string;
}) {
  const [label_text, setLabelText] = useState('');
  const [category, setCategory] = useState<UserCalendarEvent['category']>('other');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [, m, d] = dateIso.split('-');
  const dateLabel = `${parseInt(d)} ${MONTH_NAMES[parseInt(m) - 1]} ${dateIso.split('-')[0]}`;
  const term = getTermForDate(dateIso);
  const namedEvents = sa2026Events.filter(e => e.type !== 'term');

  const handleCreate = async () => {
    if (!label_text.trim()) return;
    setSaving(true);
    const event: UserCalendarEvent = {
      id: `${userId}-${dateIso}-${Date.now()}`,
      eventName: label_text.trim(),
      eventDate: dateIso,
      category,
      createdAt: new Date().toISOString(),
    };
    calendarStorage.saveEvent(event);
    setTimeout(() => pushCalendarEvent(userId, event), 0);
    onEventsChanged();
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setLabelText(''); }, 1200);
  };

  const handleDelete = (eventId: string) => {
    calendarStorage.deleteEvent(eventId);
    setTimeout(() => syncDeleteCalendarEvent(userId, eventId), 0);
    onEventsChanged();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="fixed inset-4 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 w-full md:w-96 overflow-hidden"
      data-testid="create-event-modal"
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
            {term ? term.label : 'School Break'}
          </p>
          <h3 className="text-base font-bold text-slate-900">{dateLabel}</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors mt-0.5">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* SA 2026 named events */}
        {namedEvents.length > 0 && (
          <div className="space-y-2">
            {namedEvents.map((evt, i) => {
              const s = EVENT_STYLE[evt.type];
              return (
                <div key={i} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border ${s.bg} ${s.border}`}>
                  <span className={`mt-0.5 shrink-0 ${s.text}`}>{s.icon}</span>
                  <div>
                    <p className={`text-xs font-bold ${s.text}`}>{evt.name}</p>
                    {evt.note && <p className="text-[10px] text-slate-400 mt-0.5">{evt.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* User events */}
        {userEvents.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Events</p>
            {userEvents.map(evt => {
              const s = CATEGORY_STYLE[evt.category];
              return (
                <div key={evt.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${s.bg} ${s.border}`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                  <p className={`text-xs font-bold flex-1 ${s.text}`}>{evt.eventName}</p>
                  <button onClick={() => handleDelete(evt.id)} className="p-1 hover:bg-white/60 rounded-lg transition-colors">
                    <Trash2 className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t border-slate-100" />

        {/* Create event form */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">Add Event</label>
          <input
            type="text"
            value={label_text}
            onChange={e => setLabelText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            data-testid="event-description"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all"
            placeholder="e.g. Maths exam, Assignment due..."
          />
          <div className="flex gap-1.5">
            {(['exam', 'deadline', 'other', 'holiday'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all ${
                  category === cat
                    ? `${CATEGORY_STYLE[cat].bg} ${CATEGORY_STYLE[cat].border} ${CATEGORY_STYLE[cat].text}`
                    : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-widest border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleCreate}
            disabled={!label_text.trim() || saving}
            data-testid="create-event-btn"
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {saved ? 'Saved ✓' : <><Plus className="w-3 h-3" /> Add</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main CalendarPage ─────────────────────────────────────────────────────────

function buildUserEventMap(events: UserCalendarEvent[]): Map<string, UserCalendarEvent[]> {
  const map = new Map<string, UserCalendarEvent[]>();
  for (const evt of events) {
    if (!map.has(evt.eventDate)) map.set(evt.eventDate, []);
    map.get(evt.eventDate)!.push(evt);
  }
  return map;
}

function CalendarPage({ user, onNavigate }: AuthedProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [userEventsByDate, setUserEventsByDate] = useState<Map<string, UserCalendarEvent[]>>(() =>
    buildUserEventMap(calendarStorage.getEvents())
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const reloadUserEvents = () => {
    setUserEventsByDate(buildUserEventMap(calendarStorage.getEvents()));
  };

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const totalDays   = daysInMonth(year, month);
  const firstOffset = firstDayOffset(year, month);
  const todayIso    = toIso(today.getFullYear(), today.getMonth(), today.getDate());
  const monthKey    = `${year}-${pad(month + 1)}`;

  // Sidebar: named events this month
  const thisMonthNamedEvents = useMemo(() => {
    const seen = new Set<string>();
    const out: SA2026Event[] = [];
    for (let d = 1; d <= totalDays; d++) {
      for (const e of getEventsForDate(toIso(year, month, d)).filter(e => e.type !== 'term')) {
        const key = e.date + e.name;
        if (!seen.has(key)) { seen.add(key); out.push(e); }
      }
    }
    return out;
  }, [year, month, totalDays]);

  const currentTerm = useMemo(() => getTermForDate(toIso(year, month, 15)), [year, month]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentPage="calendar" user={user} onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-slate-900/5">
            <Calendar className="w-4 h-4 text-slate-900" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900">
              Academic Year 2026
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
            Study Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">Track terms, exams, holidays and your personal events.</p>
        </div>

        {/* Upcoming strip */}
        <UpcomingStrip />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Year mini-picker */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 sticky top-24" data-testid="year-calendar">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Year {year}</p>
              <div className="grid grid-cols-3 gap-1">
                {MONTH_NAMES.map((name, i) => {
                  const isActive = i === month;
                  const mk = `${year}-${pad(i + 1)}`;
                  return (
                    <button
                      key={i}
                      onClick={() => setMonth(i)}
                      data-testid="month-selector-btn"
                      className={`relative p-2 text-xs font-semibold rounded-lg transition-all ${
                        isActive ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {name.slice(0, 3)}
                      {!isActive && hasNamedEvents(mk) && (
                        <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Term status */}
            {currentTerm ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">School in session</p>
                </div>
                <p className="text-sm font-bold text-emerald-900">{currentTerm.label}</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">
                  {formatShortDate(currentTerm.start)} – {formatShortDate(currentTerm.end)}
                </p>
              </div>
            ) : (
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sun className="w-3.5 h-3.5 text-sky-600" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sky-700">School Holiday</p>
                </div>
                <p className="text-sm font-bold text-sky-900">Break period</p>
              </div>
            )}

            {/* This month events list */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                {MONTH_NAMES[month]} events
              </p>
              {thisMonthNamedEvents.length === 0 ? (
                <p className="text-xs text-slate-400">No key events this month</p>
              ) : (
                <ul className="space-y-2.5">
                  {thisMonthNamedEvents.map((evt, i) => {
                    const s = EVENT_STYLE[evt.type];
                    return (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                        <div>
                          <p className="text-xs font-semibold text-slate-700 leading-tight">{evt.shortName ?? evt.name}</p>
                          <p className="text-[10px] text-slate-400">{formatShortDate(evt.date)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Legend</p>
              <div className="space-y-2">
                {(Object.entries(EVENT_STYLE) as [EventType, typeof EVENT_STYLE[EventType]][]).map(([, s]) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                    <span className="text-xs text-slate-500">{s.label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-indigo-400" />
                  <span className="text-xs text-slate-500">Your Events</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Calendar ── */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

              {/* Month nav header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900" data-testid="current-month">
                    {MONTH_NAMES[month]} {year}
                  </h2>
                  {currentTerm && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{currentTerm.label}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500" aria-label="Previous month">
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
                    className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
                  >
                    Today
                  </button>
                  <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500" aria-label="Next month">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 border-b border-slate-100">
                {WEEK_DAYS.map(d => (
                  <div key={d} className="py-2.5 text-center text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7">
                {/* Empty offset */}
                {Array.from({ length: firstOffset }).map((_, i) => (
                  <div key={`off-${i}`} className="border-r border-b border-slate-50 min-h-18" />
                ))}

                {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
                  const iso        = toIso(year, month, day);
                  const allEvts    = getEventsForDate(iso);
                  const userEvts   = userEventsByDate.get(iso) ?? [];
                  const isToday    = iso === todayIso;
                  const isSelected = iso === selectedDate;
                  const isWeekend  = (firstOffset + day - 1) % 7 >= 5;

                  const top = allEvts[0];
                  const namedEvt = allEvts.find(e => e.type !== 'term');
                  const tintClass = top ? CELL_TINT[top.type] : '';

                  return (
                    <button
                      key={iso}
                      onClick={() => setSelectedDate(iso === selectedDate ? null : iso)}
                      data-testid="calendar-day"
                      className={`relative border-r border-b border-slate-100 min-h-18 p-2 text-left transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-600 ${
                        tintClass || (isWeekend ? 'bg-slate-50/50' : 'bg-white')
                      } ${isSelected ? 'ring-2 ring-inset ring-slate-800 z-10' : ''}`}
                    >
                      <span className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold ${
                        isToday
                          ? 'bg-slate-900 text-white'
                          : isWeekend ? 'text-slate-400' : 'text-slate-700'
                      }`}>
                        {day}
                      </span>

                      {namedEvt && (
                        <p className={`mt-0.5 text-[9px] font-bold leading-tight truncate ${EVENT_STYLE[namedEvt.type].text}`}>
                          {namedEvt.shortName ?? namedEvt.name}
                        </p>
                      )}

                      {/* User event dots */}
                      {userEvts.length > 0 && (
                        <div className="absolute bottom-1.5 left-2 flex gap-0.5">
                          {userEvts.slice(0, 3).map((evt, i) => (
                            <span key={i} className={`w-1.5 h-1.5 rounded-full ${CATEGORY_STYLE[evt.category].dot}`} />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Term overview strip */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">2026 School Terms</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {TERM_SPANS.map(t => {
                  const isActive = monthKey >= t.start.slice(0, 7) && monthKey <= t.end.slice(0, 7);
                  return (
                    <div
                      key={t.term}
                      className={`rounded-xl p-3 border transition-all ${
                        isActive ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {t.label}{isActive ? ' · Now' : ''}
                      </p>
                      <p className={`text-xs font-semibold ${isActive ? 'text-emerald-900' : 'text-slate-600'}`}>
                        {formatShortDate(t.start)}
                      </p>
                      <p className="text-[10px] text-slate-400">to {formatShortDate(t.end)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Modal overlay */}
      <AnimatePresence>
        {selectedDate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDate(null)}
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            />
            <DayModal
              dateIso={selectedDate}
              sa2026Events={getEventsForDate(selectedDate)}
              userEvents={userEventsByDate.get(selectedDate) ?? []}
              onClose={() => setSelectedDate(null)}
              onEventsChanged={reloadUserEvents}
              userId={user.id}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default withAuth(CalendarPage);
