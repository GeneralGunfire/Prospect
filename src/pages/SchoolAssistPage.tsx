import { motion } from 'motion/react';
import {
  ArrowLeft,
  CalendarDays,
  BookOpen,
  Target,
  Clock,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import type { AppPage } from '../lib/withAuth';

interface Props {
  onNavigate: (page: AppPage) => void;
  onNavigateHome: () => void;
}

const TERMS = [
  { term: 'Term 1', dates: '15 Jan – 27 Mar', status: 'past' },
  { term: 'Term 2', dates: '7 Apr – 19 Jun', status: 'current' },
  { term: 'Term 3', dates: '15 Jul – 25 Sep', status: 'upcoming' },
  { term: 'Term 4', dates: '6 Oct – 4 Dec', status: 'upcoming' },
];

const SUBJECTS = [
  { name: 'Mathematics', grades: ['Gr 10', 'Gr 11', 'Gr 12'], color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Physical Sciences', grades: ['Gr 10', 'Gr 11', 'Gr 12'], color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Life Sciences', grades: ['Gr 10', 'Gr 11', 'Gr 12'], color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'English Home Language', grades: ['Gr 10', 'Gr 11', 'Gr 12'], color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'Accounting', grades: ['Gr 10', 'Gr 11', 'Gr 12'], color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { name: 'Geography', grades: ['Gr 10', 'Gr 11', 'Gr 12'], color: 'bg-sky-50 text-sky-700 border-sky-200' },
];

const PLAN_ITEMS = [
  { subject: 'Mathematics — Algebra', time: '08:00 – 09:30', done: true },
  { subject: 'Physical Sciences — Waves', time: '10:00 – 11:00', done: true },
  { subject: 'Life Sciences — Genetics', time: '13:00 – 14:30', done: false },
  { subject: 'English — Essay Practice', time: '15:00 – 16:00', done: false },
];

export default function SchoolAssistPage({ onNavigate, onNavigateHome }: Props) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Prospect
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">S</div>
          <span className="font-black text-sm text-[#1e293b] uppercase tracking-wider">School Assist</span>
        </div>
        <div className="w-24" /> {/* spacer for centering */}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">Your Study Companion</p>
          <h1 className="text-3xl lg:text-4xl font-black text-[#1e293b]" style={{ letterSpacing: '-0.02em' }}>
            School Assist Dashboard
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Track your school calendar, access subject content, and manage your study plan — all in one place.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Column 1: School Calendar ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="font-black text-slate-900 text-sm uppercase tracking-wide">School Calendar</h2>
            </div>

            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-4">2025 School Year</p>
            <div className="space-y-3">
              {TERMS.map((t) => (
                <div
                  key={t.term}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 border text-sm ${
                    t.status === 'current'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : t.status === 'past'
                      ? 'bg-slate-50 text-slate-400 border-slate-200'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="font-bold">{t.term}</span>
                  <span className={`text-xs ${t.status === 'current' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {t.dates}
                  </span>
                  {t.status === 'current' && (
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                      Now
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">Upcoming</p>
              {[
                { label: 'Mid-year exams start', date: 'Jun 2' },
                { label: 'NSFAS applications open', date: 'Jul 1' },
                { label: 'UCT applications close', date: 'Jul 31' },
              ].map((e) => (
                <div key={e.label} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-slate-600">{e.label}</span>
                  <span className="text-xs font-bold text-indigo-600">{e.date}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Column 2: Study Library ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="font-black text-slate-900 text-sm uppercase tracking-wide">Subject Library</h2>
            </div>

            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-4">Browse by Subject</p>
            <div className="flex flex-col gap-3">
              {SUBJECTS.map((s) => (
                <button
                  key={s.name}
                  onClick={() => onNavigate('library')}
                  className="flex items-center justify-between group rounded-xl border px-4 py-3 text-sm hover:shadow-sm transition-all duration-200 text-left"
                >
                  <div>
                    <p className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {s.name}
                    </p>
                    <div className="flex gap-1 mt-1">
                      {s.grades.map((g) => (
                        <span key={g} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${s.color}`}>
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigate('library')}
              className="mt-5 w-full text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors py-2 flex items-center justify-center gap-1"
            >
              View full library <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.section>

          {/* ── Column 3: Study Planner ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="font-black text-slate-900 text-sm uppercase tracking-wide">Study Planner</h2>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Today's Plan</p>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                2 / 4 done
              </span>
            </div>

            <div className="flex flex-col gap-3 flex-1">
              {PLAN_ITEMS.map((item) => (
                <div
                  key={item.subject}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                    item.done
                      ? 'bg-slate-50 border-slate-100 opacity-60'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <CheckCircle2
                    className={`w-5 h-5 mt-0.5 shrink-0 ${item.done ? 'text-emerald-500' : 'text-slate-200'}`}
                  />
                  <div>
                    <p className={`text-sm font-semibold ${item.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {item.subject}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Placeholder CTA */}
            <div className="mt-6 rounded-2xl bg-indigo-50 border border-indigo-100 px-5 py-4 text-center">
              <p className="text-xs font-bold text-indigo-700 mb-1">Custom Study Plans</p>
              <p className="text-xs text-indigo-500 mb-3">
                Personalised schedules coming soon. Sign in to be notified.
              </p>
              <button
                onClick={() => onNavigate('auth')}
                className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Sign In →
              </button>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
