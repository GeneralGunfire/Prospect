import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen, CalendarDays, ArrowRight,
  Flame, Clock, Target, Play, ChevronRight,
  AlertTriangle, CheckCircle2, TrendingUp,
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import { studyProgressStorage, learningPathStorage } from '../services/storageService';
import { algebraLearningPath } from '../data/demoLearningPath';

// ── Deadlines (mirrors CalendarPageNew) ───────────────────────────────────────
const DEADLINES = [
  { title: 'UCT Applications Open',     date: '1 Mar',  iso: '2026-03-01', cat: 'University' },
  { title: 'UP Applications Open',      date: '1 Apr',  iso: '2026-04-01', cat: 'University' },
  { title: 'UNISA Semester 2 Reg',      date: '15 May', iso: '2026-05-15', cat: 'University' },
  { title: 'Wits Early Applications',   date: '30 Jun', iso: '2026-06-30', cat: 'University' },
  { title: 'Stellenbosch Applications', date: '31 Jul', iso: '2026-07-31', cat: 'University' },
  { title: 'NSFAS 2027 Applications',   date: '1 Sep',  iso: '2026-09-01', cat: 'Funding'    },
  { title: 'UJ Applications Close',     date: '30 Sep', iso: '2026-09-30', cat: 'University' },
  { title: 'NSF Bursary Closes',        date: '15 Oct', iso: '2026-10-15', cat: 'Funding'    },
  { title: 'Matric Finals Begin',       date: '20 Oct', iso: '2026-10-20', cat: 'Exams'      },
  { title: 'Sasol Bursary Deadline',    date: '15 Nov', iso: '2026-11-15', cat: 'Funding'    },
  { title: 'Matric Results Released',   date: '6 Jan',  iso: '2027-01-06', cat: 'Exams'      },
];

function daysUntil(iso: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

function urgencyStyle(days: number) {
  if (days <= 14)  return { bar: 'bg-red-500',    pill: 'bg-red-50 border-red-200 text-red-700',    label: `${days}d` };
  if (days <= 60)  return { bar: 'bg-amber-500',  pill: 'bg-amber-50 border-amber-200 text-amber-700', label: `${days}d` };
  const months = Math.round(days / 30);
  return { bar: 'bg-blue-400', pill: 'bg-blue-50 border-blue-200 text-blue-700', label: `${months}mo` };
}

// ── Component ─────────────────────────────────────────────────────────────────

function DashboardPage({ user, onNavigate }: AuthedProps) {
  const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? 'Student';

  // ── Data ────────────────────────────────────────────────────────────────────
  const [subjectProgress, setSubjectProgress] = useState<
    { subject: string; completed: number; total: number; lastTopic: string | null }[]
  >([]);

  useEffect(() => {
    // Algebra learning path progress
    const algebraPath = learningPathStorage.getPathProgress('grade10-algebra');
    if (algebraPath) {
      const statuses = Object.values(algebraPath.topicStatuses);
      const mastered = statuses.filter(s => s.status === 'mastered').length;
      const total = algebraLearningPath.totalTopics;
      // Find last touched topic
      const lastTouched = statuses
        .filter(s => s.lastActivity)
        .sort((a, b) => (b.lastActivity ?? '').localeCompare(a.lastActivity ?? ''))[0];
      const lastTopicId = lastTouched?.topicId ?? null;
      const lastTopic = lastTopicId
        ? (algebraLearningPath.topics.find(t => t.id === lastTopicId)?.title ?? null)
        : null;
      setSubjectProgress([{ subject: 'Mathematics (Algebra)', completed: mastered, total, lastTopic }]);
    } else {
      // Raw study progress grouped by subject
      const all = studyProgressStorage.getAllProgress();
      const bySubject: Record<string, { completed: number; total: number; lastTopic: string | null }> = {};
      Object.values(all).forEach(p => {
        if (!bySubject[p.subjectId]) bySubject[p.subjectId] = { completed: 0, total: 0, lastTopic: null };
        bySubject[p.subjectId].total++;
        if (p.status === 'mastered') bySubject[p.subjectId].completed++;
        if (!bySubject[p.subjectId].lastTopic) bySubject[p.subjectId].lastTopic = p.topicId;
      });
      setSubjectProgress(
        Object.entries(bySubject).map(([subject, v]) => ({ subject, ...v }))
      );
    }
  }, []);

  // ── Deadlines ───────────────────────────────────────────────────────────────
  const upcomingDeadlines = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return DEADLINES
      .map(d => ({ ...d, days: daysUntil(d.iso) }))
      .filter(d => d.days >= 0)
      .slice(0, 4);
  }, []);

  const nextDeadline = upcomingDeadlines[0] ?? null;

  // ── Active learning path ─────────────────────────────────────────────────
  const algebraPath = learningPathStorage.getPathProgress('grade10-algebra');
  const hasActivePath = !!algebraPath;
  const nextTopicToStudy = useMemo(() => {
    if (!algebraPath) return null;
    const done = new Set(
      Object.entries(algebraPath.topicStatuses)
        .filter(([, s]) => s.status === 'mastered')
        .map(([id]) => id)
    );
    return algebraLearningPath.topics.find(t => !done.has(t.id)) ?? null;
  }, [algebraPath]);

  // ── Today date label ────────────────────────────────────────────────────────
  const todayLabel = new Date().toLocaleDateString('en-ZA', { weekday: 'long', month: 'long', day: 'numeric' });

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentPage="dashboard" user={user} onNavigate={onNavigate} />

      <div className="pt-20 pb-16 px-4 md:px-8 max-w-6xl mx-auto">

        {/* Welcome row */}
        <div className="flex items-end justify-between mb-8 pt-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{todayLabel}</p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              Good {getGreeting()}, <span className="text-prospect-blue-accent">{firstName}</span>
            </h1>
          </div>
        </div>

        {/* ── 1. TODAY'S FOCUS ─────────────────────────────────────────────── */}
        <section className="mb-8">
          <SectionLabel dot="bg-orange-400" text="Today's Focus" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {/* Next deadline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-red-500" />
                </div>
                {nextDeadline && (
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${urgencyStyle(nextDeadline.days).pill}`}>
                    {urgencyStyle(nextDeadline.days).label} left
                  </span>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Next Deadline</p>
                {nextDeadline ? (
                  <>
                    <p className="text-sm font-black text-slate-900 leading-snug mb-0.5">{nextDeadline.title}</p>
                    <p className="text-xs text-slate-400">{nextDeadline.date} · {nextDeadline.cat}</p>
                  </>
                ) : (
                  <p className="text-sm text-slate-400">No upcoming deadlines</p>
                )}
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="mt-auto text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                View calendar <ChevronRight className="w-3 h-3" />
              </button>
            </motion.div>

            {/* Next study topic */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                {hasActivePath && (
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full border bg-blue-50 border-blue-100 text-blue-600">
                    In progress
                  </span>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                  {hasActivePath ? 'Continue Studying' : 'Study'}
                </p>
                {nextTopicToStudy ? (
                  <>
                    <p className="text-sm font-black text-slate-900 leading-snug mb-0.5">Mathematics</p>
                    <p className="text-xs text-slate-500">{nextTopicToStudy.title}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-black text-slate-900 leading-snug mb-0.5">Start a subject</p>
                    <p className="text-xs text-slate-400">Pick a topic from the library</p>
                  </>
                )}
              </div>
              <button
                onClick={() => onNavigate('demo-learning')}
                className="mt-auto text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                {hasActivePath ? 'Resume' : 'Start'} <ChevronRight className="w-3 h-3" />
              </button>
            </motion.div>

            {/* Recommended session */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-slate-900 rounded-2xl shadow-sm p-5 flex flex-col gap-3"
            >
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Recommended</p>
                <p className="text-2xl font-black text-white leading-none mb-1">45 min</p>
                <p className="text-xs text-slate-400">Study session today</p>
              </div>
              <button
                onClick={() => onNavigate('library')}
                className="mt-auto flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors w-fit"
              >
                <Play className="w-3 h-3" /> Start session
              </button>
            </motion.div>

          </div>
        </section>

        {/* ── 2 + 4. PROGRESS + DEADLINES (two column) ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

          {/* Study Progress */}
          <section className="lg:col-span-3">
            <SectionLabel dot="bg-blue-500" text="Study Progress" />
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              {subjectProgress.length > 0 ? (
                <div className="space-y-5">
                  {subjectProgress.map((sp, i) => {
                    const pct = sp.total > 0 ? Math.round((sp.completed / sp.total) * 100) : 0;
                    return (
                      <motion.div
                        key={sp.subject}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <p className="text-xs font-black text-slate-900">{sp.subject}</p>
                            {sp.lastTopic && (
                              <p className="text-[10px] text-slate-400">Last: {sp.lastTopic}</p>
                            )}
                          </div>
                          <span className="text-xs font-black text-slate-700 tabular-nums">{pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              pct >= 80 ? 'bg-emerald-500' : pct >= 40 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-[10px] text-slate-400">{sp.completed} of {sp.total} topics mastered</p>
                          {pct < 100 && (
                            <p className="text-[10px] text-slate-400">{sp.total - sp.completed} remaining</p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-sm font-black text-slate-700 mb-1">No progress tracked yet</p>
                  <p className="text-xs text-slate-400 mb-4 max-w-50">Start a study session to see your progress here.</p>
                  <button
                    onClick={() => onNavigate('library')}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors"
                  >
                    Go to Library
                  </button>
                </div>
              )}

              {subjectProgress.length > 0 && (
                <button
                  onClick={() => onNavigate('library')}
                  className="mt-5 w-full flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors pt-4 border-t border-slate-100"
                >
                  View study library <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </section>

          {/* Mini Calendar / Upcoming Deadlines */}
          <section className="lg:col-span-2">
            <SectionLabel dot="bg-red-400" text="Upcoming Deadlines" />
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-full">
              <div className="space-y-2">
                {upcomingDeadlines.map((d, i) => {
                  const { bar, pill } = urgencyStyle(d.days);
                  return (
                    <motion.div
                      key={d.iso}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className={`w-1 h-10 rounded-full shrink-0 ${bar}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-800 leading-snug truncate">{d.title}</p>
                        <p className="text-[10px] text-slate-400">{d.date}</p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${pill}`}>
                        {urgencyStyle(d.days).label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="mt-4 w-full flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors pt-4 border-t border-slate-100"
              >
                Full calendar <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </section>

        </div>

        {/* ── 3 + 5. CONTINUE LEARNING + QUICK ACTIONS ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Continue Learning */}
          <section className="lg:col-span-3">
            <SectionLabel dot="bg-emerald-500" text="Continue Learning" />
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
            >
              {hasActivePath && nextTopicToStudy ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Mathematics · Algebra</p>
                    <p className="text-sm font-black text-slate-900 leading-snug">{nextTopicToStudy.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Continue where you left off</p>
                  </div>
                  <button
                    onClick={() => onNavigate('demo-learning')}
                    className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors shrink-0"
                  >
                    Resume <Play className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900 leading-snug mb-0.5">Start your learning path</p>
                    <p className="text-xs text-slate-400">Gr 10–12 study materials across all subjects</p>
                  </div>
                  <button
                    onClick={() => onNavigate('library')}
                    className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors shrink-0"
                  >
                    Browse <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {hasActivePath && subjectProgress[0] && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Overall Progress</p>
                    <p className="text-[10px] font-black text-slate-600">
                      {subjectProgress[0].completed}/{subjectProgress[0].total} topics
                    </p>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round((subjectProgress[0].completed / subjectProgress[0].total) * 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </section>

          {/* Quick Actions */}
          <section className="lg:col-span-2">
            <SectionLabel dot="bg-slate-400" text="Quick Actions" />
            <div className="flex flex-col gap-2">
              {[
                { label: 'Start Study Session', desc: 'Jump into learning',          icon: <Play className="w-4 h-4" />,         page: 'library' as const,   bg: 'bg-slate-900 text-white hover:bg-slate-800',          arrow: 'text-white/50' },
                { label: 'View Full Calendar',  desc: 'All terms & deadlines',       icon: <CalendarDays className="w-4 h-4" />, page: 'calendar' as const,  bg: 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50', arrow: 'text-slate-300' },
                { label: 'Go to Library',       desc: 'All subjects & topics',       icon: <BookOpen className="w-4 h-4" />,     page: 'library' as const,   bg: 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50', arrow: 'text-slate-300' },
              ].map(({ label, desc, icon, page, bg, arrow }, i) => (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  onClick={() => onNavigate(page)}
                  whileHover={{ y: -1 }}
                  className={`flex items-center gap-3 p-4 rounded-xl shadow-sm transition-all text-left ${bg}`}
                >
                  <div className="shrink-0">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase tracking-widest leading-none mb-0.5">{label}</p>
                    <p className={`text-[10px] ${i === 0 ? 'text-white/50' : 'text-slate-400'}`}>{desc}</p>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${arrow}`} />
                </motion.button>
              ))}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function SectionLabel({ dot, text }: { dot: string; text: string }) {
  return (
    <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {text}
    </h2>
  );
}

export default withAuth(DashboardPage);
