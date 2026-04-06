import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { getStudyEvents, getSchoolCalendarEvents } from '../services/calendarService';
import AppHeader from '../components/AppHeader';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import EventScheduler from '../../components/ui/event-scheduler';

interface StudyEventRow {
  event_date: string;
  subject: string;
  start_time: string;
  duration_hours: number;
  color?: string;
}

interface SchoolEventRow {
  date: string;
  event_type: string;
  name: string;
}

function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const EVENT_COLORS: Record<string, string> = {
  term: 'bg-green-100 border-green-300',
  holiday: 'bg-blue-100 border-blue-300',
  exam_week: 'bg-red-100 border-red-300',
  public_holiday: 'bg-amber-100 border-amber-300',
};

function CalendarPage({ user, onNavigate }: AuthedProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [allStudyEvents, setAllStudyEvents] = useState<Map<string, StudyEventRow[]>>(new Map());
  const [allSchoolEvents, setAllSchoolEvents] = useState<SchoolEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const startDate = formatDateStr(year, 0, 1);
      const endDate = formatDateStr(year, 11, 31);
      const [events, calendar] = await Promise.all([
        getStudyEvents(startDate, endDate),
        getSchoolCalendarEvents(year),
      ]);

      const eventsByMonth = new Map<string, StudyEventRow[]>();
      for (let m = 0; m < 12; m++) {
        eventsByMonth.set(
          `${year}-${String(m + 1).padStart(2, '0')}`,
          (events as StudyEventRow[]).filter(e =>
            e.event_date.startsWith(`${year}-${String(m + 1).padStart(2, '0')}`)
          )
        );
      }

      setAllStudyEvents(eventsByMonth);
      setAllSchoolEvents(calendar as SchoolEventRow[]);
    } finally {
      setLoading(false);
    }
  };

  const getStudyEventsForCurrentMonth = () => {
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    return allStudyEvents.get(monthKey) || [];
  };

  const getSchoolEventsForCurrentMonth = () => {
    return allSchoolEvents.filter(e =>
      e.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)
    );
  };

  const prevMonth = () => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else {
      setMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else {
      setMonth(m => m + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDateStr(year, month, day);
    setSelectedDate(dateStr);
    setShowCreateModal(true);
  };

  const handleCreateEvent = () => {
    if (description.trim() && selectedDate) {
      console.log('Creating event:', { date: selectedDate, description });
      setDescription('');
      setShowCreateModal(false);
    }
  };

  const getSchoolEventsForDate = (dateStr: string) =>
    allSchoolEvents.filter(e => e.date === dateStr);

  const getStudyEventsForDate = (dateStr: string) => {
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    return (allStudyEvents.get(monthKey) || []).filter(e => e.event_date === dateStr);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOfWeek(year, month);
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const todayStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader currentPage="calendar" user={user} onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(30,41,59,0.05)' }}>
            <Calendar className="w-4 h-4" style={{ color: '#1e293b' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1e293b' }}>Study Calendar</span>
          </div>
          <h1 className="text-4xl font-bold uppercase tracking-tight" style={{ color: '#1e293b' }}>
            Study <span style={{ color: '#64748b' }}>Calendar</span>
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading calendar...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Year Calendar - Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 sticky top-24">
                <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-slate-700">Year {year}</h3>
                <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: 12 }, (_, i) => {
                    const isSelected = i === month;
                    return (
                      <button
                        key={i}
                        onClick={() => setMonth(i)}
                        className={`p-2 text-xs font-semibold rounded transition-all ${
                          isSelected
                            ? 'bg-slate-800 text-white'
                            : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                        }`}
                      >
                        {MONTH_NAMES[i].substring(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Calendar */}
            <div className="lg:col-span-3 space-y-6">
              {/* Month Calendar */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                {/* Month navigation */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: '#1e293b' }}>
                    {MONTH_NAMES[month]} {year}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Previous month"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Next month"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map(day => (
                    <div key={day} className="text-center font-semibold py-2 text-xs text-slate-500 uppercase tracking-wider">
                      {day}
                    </div>
                  ))}

                  {/* Empty offset cells */}
                  {Array.from({ length: firstDayOffset }).map((_, i) => (
                    <div key={`offset-${i}`} className="p-1 min-h-16" />
                  ))}

                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dateStr = formatDateStr(year, month, day);
                    const schoolEvts = getSchoolEventsForDate(dateStr);
                    const studyEvts = getStudyEventsForDate(dateStr);
                    const isToday = dateStr === todayStr;
                    const primaryEvent = schoolEvts[0];
                    const bgClass = primaryEvent ? EVENT_COLORS[primaryEvent.event_type] || 'bg-gray-100' : '';

                    return (
                      <button
                        key={dateStr}
                        onClick={() => handleDateClick(day)}
                        data-calendar-day
                        className={`p-1 border rounded-lg min-h-16 text-sm transition-all hover:shadow-md cursor-pointer ${
                          bgClass || 'border-slate-100 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className={`font-bold text-xs mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-slate-800 text-white' : 'text-slate-700'}`}>
                          {day}
                        </div>

                        {schoolEvts.map((evt, i) => (
                          <div key={i} className="text-xs text-slate-600 leading-tight mb-0.5 truncate" title={evt.name}>
                            {evt.name}
                          </div>
                        ))}

                        {studyEvts.map((evt, i) => (
                          <div key={i} className="text-xs text-blue-700 leading-tight mb-0.5 truncate" title={evt.subject}>
                            {evt.subject}
                          </div>
                        ))}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Month Events */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Legend */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-base font-bold mb-4 uppercase tracking-wider" style={{ color: '#1e293b' }}>Legend</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                      <span className="text-sm text-slate-600">School Term</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded" />
                      <span className="text-sm text-slate-600">Holiday</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
                      <span className="text-sm text-slate-600">Exam Week</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded" />
                      <span className="text-sm text-slate-600">Public Holiday</span>
                    </div>
                  </div>
                </div>

                {/* This month's school events */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-base font-bold mb-4 uppercase tracking-wider" style={{ color: '#1e293b' }}>
                    {MONTH_NAMES[month]} Events
                  </h3>
                  {getSchoolEventsForCurrentMonth().length === 0 ? (
                    <p className="text-sm text-slate-500">No school events this month</p>
                  ) : (
                    <div className="space-y-2">
                      {getSchoolEventsForCurrentMonth().map((evt, i) => (
                        <div key={i} className={`text-sm px-3 py-2 rounded-lg border ${EVENT_COLORS[evt.event_type] || 'bg-gray-100 border-gray-200'}`}>
                          <p className="font-medium text-slate-700">{evt.name}</p>
                          <p className="text-xs text-slate-500">{evt.date}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Study events */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-base font-bold mb-4 uppercase tracking-wider" style={{ color: '#1e293b' }}>Your Study Events</h3>
                {getStudyEventsForCurrentMonth().length === 0 ? (
                  <p className="text-sm text-slate-500">No study events this month</p>
                ) : (
                  <div className="space-y-2">
                    {getStudyEventsForCurrentMonth().slice(0, 5).map((evt, i) => (
                      <div key={i} className="text-sm border-l-4 pl-3 py-1" style={{ borderColor: evt.color || '#3b82f6' }}>
                        <p className="font-medium text-slate-700">{evt.subject}</p>
                        <p className="text-xs text-slate-500">{evt.event_date} at {evt.start_time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Event Scheduler */}
              <EventScheduler />
            </div>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Create Study Event</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setDescription('');
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-3">
                {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Select a date'}
              </p>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                placeholder="What do you plan to study? Any notes?"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setDescription('');
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                disabled={!description.trim()}
                className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(CalendarPage);
