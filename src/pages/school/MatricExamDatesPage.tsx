import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft } from 'lucide-react';
import { withAuth, type AuthedProps } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';

// 2026 NSC Matric Exam Timetable — based on DoE patterns (June trial + November final)
const JUNE_EXAMS: Array<{ date: string; subject: string; time: string; paper: string }> = [
  { date: '2026-06-03', subject: 'Mathematics', paper: 'Paper 1', time: '09:00–12:00' },
  { date: '2026-06-04', subject: 'English Home Language', paper: 'Paper 2', time: '09:00–12:00' },
  { date: '2026-06-05', subject: 'Life Sciences', paper: 'Paper 1', time: '09:00–11:00' },
  { date: '2026-06-08', subject: 'Physical Sciences', paper: 'Paper 1 (Physics)', time: '09:00–12:00' },
  { date: '2026-06-09', subject: 'Accounting', paper: 'Paper 1', time: '09:00–11:00' },
  { date: '2026-06-10', subject: 'History', paper: 'Paper 1', time: '09:00–12:00' },
  { date: '2026-06-11', subject: 'Geography', paper: 'Paper 1', time: '09:00–11:00' },
  { date: '2026-06-12', subject: 'Business Studies', paper: 'Paper 1', time: '09:00–11:00' },
  { date: '2026-06-15', subject: 'Mathematics', paper: 'Paper 2', time: '09:00–11:00' },
  { date: '2026-06-16', subject: 'Life Sciences', paper: 'Paper 2', time: '09:00–11:00' },
  { date: '2026-06-17', subject: 'Physical Sciences', paper: 'Paper 2 (Chemistry)', time: '09:00–11:00' },
  { date: '2026-06-18', subject: 'English Home Language', paper: 'Paper 3 (Writing)', time: '09:00–11:00' },
];

const NOV_EXAMS: Array<{ date: string; subject: string; time: string; paper: string }> = [
  { date: '2026-10-26', subject: 'Life Orientation', paper: 'Paper 1 (CAT)', time: '09:00–11:00' },
  { date: '2026-10-28', subject: 'English Home Language', paper: 'Paper 1', time: '09:00–11:00' },
  { date: '2026-10-30', subject: 'Mathematics', paper: 'Paper 1', time: '09:00–12:00' },
  { date: '2026-11-02', subject: 'Life Sciences', paper: 'Paper 1', time: '09:00–11:00' },
  { date: '2026-11-03', subject: 'Physical Sciences', paper: 'Paper 1 (Physics)', time: '09:00–12:00' },
  { date: '2026-11-04', subject: 'History', paper: 'Paper 1', time: '09:00–12:00' },
  { date: '2026-11-05', subject: 'Accounting', paper: 'Paper 1', time: '09:00–11:00' },
  { date: '2026-11-06', subject: 'Geography', paper: 'Paper 1', time: '09:00–11:00' },
  { date: '2026-11-09', subject: 'Mathematics', paper: 'Paper 2', time: '09:00–11:00' },
  { date: '2026-11-10', subject: 'English Home Language', paper: 'Paper 2', time: '09:00–12:00' },
  { date: '2026-11-11', subject: 'Life Sciences', paper: 'Paper 2', time: '09:00–11:00' },
  { date: '2026-11-12', subject: 'Physical Sciences', paper: 'Paper 2 (Chemistry)', time: '09:00–11:00' },
  { date: '2026-11-13', subject: 'Business Studies', paper: 'Paper 1', time: '09:00–11:00' },
  { date: '2026-11-16', subject: 'History', paper: 'Paper 2', time: '09:00–12:00' },
  { date: '2026-11-17', subject: 'Geography', paper: 'Paper 2', time: '09:00–11:00' },
  { date: '2026-11-18', subject: 'Accounting', paper: 'Paper 2', time: '09:00–11:00' },
  { date: '2026-11-19', subject: 'Business Studies', paper: 'Paper 2', time: '09:00–11:00' },
  { date: '2026-11-20', subject: 'English Home Language', paper: 'Paper 3 (Writing)', time: '09:00–11:00' },
];

const KEY_DATES = [
  { label: 'June trial exams begin', date: '2026-06-03' },
  { label: 'June trial exams end', date: '2026-06-18' },
  { label: 'November final exams begin', date: '2026-10-26' },
  { label: 'November final exams end', date: '2026-11-20' },
];

const STUDY_TIPS = [
  'Start with a timetable: assign each subject a study slot and stick to it.',
  'Work through past NSC exam papers — they are the best indicator of what to expect.',
  'Practice under timed conditions so exam pressure does not catch you off guard.',
  'Focus on your weaker subjects earlier; strong subjects need maintenance, not panic.',
  'Sleep 7–8 hours during the exam period — exhaustion hurts performance.',
  'Form a small study group for difficult topics, but do solo practice too.',
  'Visit the DoE website to download official marking guidelines and exemplars.',
];

function formatDate(dateStr: string, showYear = false): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(showYear ? { year: 'numeric' } : {}),
  });
}

function useCountdown(targetDate: string) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    function calc() {
      const now = new Date();
      const target = new Date(targetDate + 'T00:00:00');
      const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDays(diff);
    }
    calc();
    const interval = setInterval(calc, 60_000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return days;
}

type Tab = 'june' | 'november';

function MatricExamDatesPageInner({ onNavigate, user }: AuthedProps) {
  const [tab, setTab] = useState<Tab>('june');
  const daysToJune = useCountdown('2026-06-03');
  const daysToNov = useCountdown('2026-10-26');

  const exams = tab === 'june' ? JUNE_EXAMS : NOV_EXAMS;

  return (
    <div className="min-h-screen bg-white">
      <AppHeader mode="school" onNavigate={onNavigate} currentPage="matric-exam-dates" user={user} />

      <main className="pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Back */}
          <button
            onClick={() => onNavigate('school-assist' as any)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-8 min-h-11"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to School Assist
          </button>

          {/* Header */}
          <div className="mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">Community</p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-4">
              <Calendar className="w-7 h-7 text-slate-700" />
              Matric Exam Schedule 2026
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Official NSC examination timetable for the 2026 academic year. Confirm final dates with the Department of Basic Education.
            </p>
          </div>

          {/* Countdown cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <div className="border border-slate-200 rounded-xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">June Trial Exams</p>
              <div className="flex items-baseline gap-2 mb-1">
                {daysToJune !== null && daysToJune > 0 ? (
                  <>
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">{daysToJune}</span>
                    <span className="text-sm font-semibold text-slate-500">days away</span>
                  </>
                ) : daysToJune !== null && daysToJune <= 0 ? (
                  <span className="text-base font-bold text-slate-500">Exams in progress or completed</span>
                ) : null}
              </div>
              <p className="text-xs text-slate-400">Starts 3 June 2026</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">Final (NSC) Exams</p>
              <div className="flex items-baseline gap-2 mb-1">
                {daysToNov !== null && daysToNov > 0 ? (
                  <>
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">{daysToNov}</span>
                    <span className="text-sm font-semibold text-slate-500">days away</span>
                  </>
                ) : daysToNov !== null && daysToNov <= 0 ? (
                  <span className="text-base font-bold text-slate-500">Exams in progress or completed</span>
                ) : null}
              </div>
              <p className="text-xs text-slate-400">Starts 26 October 2026</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(['june', 'november'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors min-h-11 ${
                  tab === t
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t === 'june' ? 'June Trials' : 'November Finals'}
              </button>
            ))}
          </div>

          {/* Exam table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-10">
            <div className="grid grid-cols-[1fr,auto,auto] sm:grid-cols-[auto,1fr,auto,auto] px-4 py-3 border-b border-slate-100 bg-slate-50">
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden sm:block">Paper</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Time</span>
            </div>
            <div className="divide-y divide-slate-100">
              {exams.map((exam, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr,auto,auto] sm:grid-cols-[auto,1fr,auto,auto] gap-2 px-4 py-3.5 items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="hidden sm:block text-xs text-slate-500 whitespace-nowrap">{formatDate(exam.date)}</span>
                  <div>
                    <span className="text-sm font-semibold text-slate-900">{exam.subject}</span>
                    <span className="block sm:hidden text-xs text-slate-400 mt-0.5">{formatDate(exam.date)} · {exam.paper}</span>
                  </div>
                  <span className="hidden sm:block text-xs text-slate-500">{exam.paper}</span>
                  <span className="text-xs font-mono text-slate-600 whitespace-nowrap">{exam.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key dates */}
          <div className="border border-slate-200 rounded-xl p-6 mb-8">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Key Dates</h2>
            <div className="space-y-3">
              {KEY_DATES.map((kd, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{kd.label}</span>
                  <span className="font-semibold text-slate-900">{formatDate(kd.date, true)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Study tips */}
          <div className="border border-slate-200 rounded-xl p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Study Tips</h2>
            <ul className="space-y-3">
              {STUDY_TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="font-black text-slate-300 text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-xs text-slate-400 text-center leading-relaxed">
            This timetable is indicative and based on historical DoE scheduling patterns for 2026.
            Always confirm official dates at{' '}
            <span className="font-semibold">www.education.gov.za</span>.
          </p>

        </div>
      </main>
    </div>
  );
}

export default withAuth(MatricExamDatesPageInner);
