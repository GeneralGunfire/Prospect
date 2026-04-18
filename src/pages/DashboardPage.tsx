import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen, CalendarDays, ArrowRight,
  Clock, Target, Play, ChevronRight,
  TrendingUp, GraduationCap, Zap, Trophy,
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import { studyProgressStorage, learningPathStorage } from '../services/storageService';
import { algebraLearningPath } from '../data/demoLearningPath';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';

// ── Deadlines ─────────────────────────────────────────────────────────────────
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

function urgencyBadge(days: number): { variant: 'error' | 'warning' | 'info'; label: string } {
  if (days <= 14)  return { variant: 'error',   label: `${days}d left` };
  if (days <= 60)  return { variant: 'warning',  label: `${days}d left` };
  const months = Math.round(days / 30);
  return { variant: 'info', label: `${months}mo` };
}

function urgencyBar(days: number) {
  if (days <= 14) return 'bg-red-500';
  if (days <= 60) return 'bg-amber-500';
  return 'bg-blue-400';
}

// ── Component ─────────────────────────────────────────────────────────────────

function DashboardPage({ user, onNavigate }: AuthedProps) {
  const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? 'Student';

  const [subjectProgress, setSubjectProgress] = useState<
    { subject: string; completed: number; total: number; lastTopic: string | null }[]
  >([]);

  useEffect(() => {
    const algebraPath = learningPathStorage.getPathProgress('grade10-algebra');
    if (algebraPath) {
      const statuses = Object.values(algebraPath.topicStatuses);
      const mastered = statuses.filter(s => s.status === 'mastered').length;
      const total = algebraLearningPath.totalTopics;
      const lastTouched = statuses
        .filter(s => s.lastActivity)
        .sort((a, b) => (b.lastActivity ?? '').localeCompare(a.lastActivity ?? ''))[0];
      const lastTopicId = lastTouched?.topicId ?? null;
      const lastTopic = lastTopicId
        ? (algebraLearningPath.topics.find(t => t.id === lastTopicId)?.title ?? null)
        : null;
      setSubjectProgress([{ subject: 'Mathematics (Algebra)', completed: mastered, total, lastTopic }]);
    } else {
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

  const upcomingDeadlines = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return DEADLINES
      .map(d => ({ ...d, days: daysUntil(d.iso) }))
      .filter(d => d.days >= 0)
      .slice(0, 4);
  }, []);

  const nextDeadline = upcomingDeadlines[0] ?? null;

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

  const todayLabel = new Date().toLocaleDateString('en-ZA', { weekday: 'long', month: 'long', day: 'numeric' });

  const overallPct = subjectProgress.length > 0
    ? Math.round((subjectProgress.reduce((s, p) => s + p.completed, 0) /
        Math.max(1, subjectProgress.reduce((s, p) => s + p.total, 0))) * 100)
    : 0;

  // Stats for the top row
  const stats = [
    {
      label: 'Topics Mastered',
      value: subjectProgress.reduce((s, p) => s + p.completed, 0),
      icon: <Trophy className="w-5 h-5" />,
      accent: 'card-accent-blue',
      iconBg: 'bg-blue-50 text-blue-600',
      trend: overallPct > 0 ? `${overallPct}% complete` : 'Get started',
    },
    {
      label: 'Days to Next Deadline',
      value: nextDeadline ? nextDeadline.days : '—',
      icon: <CalendarDays className="w-5 h-5" />,
      accent: nextDeadline && nextDeadline.days <= 14 ? 'card-accent-orange' : 'card-accent-teal',
      iconBg: nextDeadline && nextDeadline.days <= 14 ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-600',
      trend: nextDeadline?.title ?? 'No upcoming',
    },
    {
      label: 'Active Subjects',
      value: subjectProgress.length || '—',
      icon: <BookOpen className="w-5 h-5" />,
      accent: 'card-accent-purple',
      iconBg: 'bg-purple-50 text-purple-600',
      trend: subjectProgress.length > 0 ? 'In progress' : 'Start learning',
    },
    {
      label: 'Study Streak',
      value: '—',
      icon: <Zap className="w-5 h-5" />,
      accent: 'card-accent-amber',
      iconBg: 'bg-amber-50 text-amber-600',
      trend: 'Keep it up!',
    },
  ];

  return (
    <div className="min-h-screen bg-bg-light">
      <AppHeader currentPage="dashboard" user={user} onNavigate={onNavigate} />

      <div className="pt-20 pb-16 px-4 md:px-8 max-w-6xl mx-auto">

        {/* Welcome */}
        <div className="pt-8 mb-8">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1">{todayLabel}</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
            Good {getGreeting()}, <span className="text-[#1E3A5F]">{firstName}</span>
          </h1>
        </div>

        {/* ── Stats row ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-white rounded-xl border border-border p-5 shadow-sm ${stat.accent}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${stat.iconBg}`}>
                {stat.icon}
              </div>
              <p className="text-xs font-medium text-text-secondary mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-text-primary tabular-nums leading-none mb-1.5">{stat.value}</p>
              <p className="text-xs text-text-tertiary truncate">{stat.trend}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Today's Focus ─────────────────────────────────────────────────── */}
        <section data-testid="dashboard-today-focus" className="mb-8">
          <SectionLabel text="Today's Focus" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Next deadline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-border shadow-sm p-5 flex flex-col gap-3 card-accent-orange"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-red-500" />
                </div>
                {nextDeadline && (
                  <Badge variant={urgencyBadge(nextDeadline.days).variant} dot>
                    {urgencyBadge(nextDeadline.days).label}
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Next Deadline</p>
                {nextDeadline ? (
                  <>
                    <p className="text-sm font-bold text-text-primary leading-snug mb-0.5">{nextDeadline.title}</p>
                    <p className="text-xs text-text-tertiary">{nextDeadline.date} · {nextDeadline.cat}</p>
                  </>
                ) : (
                  <p className="text-sm text-text-secondary">No upcoming deadlines</p>
                )}
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="mt-auto text-xs font-semibold text-[#1E3A5F] hover:text-prospect-green-dark flex items-center gap-1 transition-colors min-h-11 -mb-1"
              >
                View calendar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Next study topic */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-xl border border-border shadow-sm p-5 flex flex-col gap-3 card-accent-blue"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                {hasActivePath && <Badge variant="info">In progress</Badge>}
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  {hasActivePath ? 'Continue Studying' : 'Study'}
                </p>
                {nextTopicToStudy ? (
                  <>
                    <p className="text-sm font-bold text-text-primary leading-snug mb-0.5">Mathematics</p>
                    <p className="text-xs text-text-secondary">{nextTopicToStudy.title}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-text-primary leading-snug mb-0.5">Start a subject</p>
                    <p className="text-xs text-text-secondary">Pick a topic from the library</p>
                  </>
                )}
              </div>
              <button
                onClick={() => onNavigate('demo-learning')}
                className="mt-auto text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors min-h-11 -mb-1"
              >
                {hasActivePath ? 'Resume' : 'Start'} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Recommended session */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#1E3A5F] rounded-xl shadow-sm p-5 flex flex-col gap-3"
            >
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">Recommended</p>
                <p className="text-3xl font-bold text-white leading-none mb-1">45 min</p>
                <p className="text-xs text-white/60">Study session today</p>
              </div>
              <button
                onClick={() => onNavigate('library')}
                className="mt-auto flex items-center gap-2 px-4 py-2.5 bg-white text-[#1E3A5F] rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors w-fit min-h-11"
              >
                <Play className="w-3.5 h-3.5" /> Start session
              </button>
            </motion.div>

          </div>
        </section>

        {/* ── Progress + Deadlines ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

          {/* Study Progress */}
          <section data-testid="dashboard-progress" className="lg:col-span-3">
            <SectionLabel text="Study Progress" />
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 card-accent-teal">
              {subjectProgress.length > 0 ? (
                <div className="space-y-5">
                  {subjectProgress.map((sp, i) => {
                    const pct = sp.total > 0 ? Math.round((sp.completed / sp.total) * 100) : 0;
                    const color = pct >= 80 ? 'success' : pct >= 40 ? 'primary' : 'warning';
                    return (
                      <motion.div
                        key={sp.subject}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-text-primary">{sp.subject}</p>
                            {sp.lastTopic && (
                              <p className="text-xs text-text-tertiary">Last: {sp.lastTopic}</p>
                            )}
                          </div>
                          <Badge variant={color === 'success' ? 'success' : color === 'warning' ? 'warning' : 'info'}>
                            {pct}%
                          </Badge>
                        </div>
                        <Progress value={pct} size="sm" color={color} />
                        <p className="text-xs text-text-tertiary mt-1.5">{sp.completed} of {sp.total} topics mastered</p>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={<TrendingUp className="w-6 h-6 text-blue-400" />}
                  title="No progress tracked yet"
                  message="Start a study session to see your progress here."
                  action="Go to Library"
                  onAction={() => onNavigate('library')}
                />
              )}

              {subjectProgress.length > 0 && (
                <button
                  onClick={() => onNavigate('library')}
                  className="mt-5 w-full flex items-center justify-center gap-1 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors pt-4 border-t border-border min-h-11"
                >
                  View study library <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </section>

          {/* Upcoming Deadlines */}
          <section data-testid="dashboard-deadlines" className="lg:col-span-2">
            <SectionLabel text="Upcoming Deadlines" />
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 h-full card-accent-orange">
              <div className="space-y-1">
                {upcomingDeadlines.map((d, i) => {
                  const { variant, label } = urgencyBadge(d.days);
                  return (
                    <motion.div
                      key={d.iso}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className={`w-1 h-10 rounded-full shrink-0 ${urgencyBar(d.days)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary leading-snug truncate">{d.title}</p>
                        <p className="text-xs text-text-tertiary">{d.date}</p>
                      </div>
                      <Badge variant={variant}>{label}</Badge>
                    </motion.div>
                  );
                })}
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="mt-4 w-full flex items-center justify-center gap-1 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors pt-4 border-t border-border min-h-11"
              >
                Full calendar <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>

        </div>

        {/* ── Continue Learning + Quick Actions ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Continue Learning */}
          <section className="lg:col-span-3">
            <SectionLabel text="Continue Learning" />
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-border shadow-sm p-5 card-accent-green"
            >
              {hasActivePath && nextTopicToStudy ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1E3A5F] rounded-xl flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-secondary mb-0.5 uppercase tracking-wider">Mathematics · Algebra</p>
                    <p className="text-sm font-bold text-text-primary leading-snug">{nextTopicToStudy.title}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">Continue where you left off</p>
                  </div>
                  <button
                    onClick={() => onNavigate('demo-learning')}
                    className="flex items-center gap-2 px-5 py-3 bg-[#1E3A5F] text-white rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-prospect-green-dark transition-colors shrink-0 min-h-11"
                  >
                    Resume <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-text-primary leading-snug mb-0.5">Start your learning path</p>
                    <p className="text-xs text-text-secondary">Gr 10–12 study materials across all subjects</p>
                  </div>
                  <button
                    onClick={() => onNavigate('library')}
                    className="flex items-center gap-2 px-5 py-3 bg-[#1E3A5F] text-white rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-prospect-green-dark transition-colors shrink-0 min-h-11"
                  >
                    Browse <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {hasActivePath && subjectProgress[0] && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Overall Progress</p>
                    <p className="text-xs font-semibold text-text-primary">
                      {subjectProgress[0].completed}/{subjectProgress[0].total} topics
                    </p>
                  </div>
                  <Progress
                    value={subjectProgress[0].completed}
                    max={subjectProgress[0].total}
                    size="xs"
                    color="primary"
                  />
                </div>
              )}
            </motion.div>
          </section>

          {/* Quick Actions */}
          <section data-testid="dashboard-quick-actions" className="lg:col-span-2">
            <SectionLabel text="Quick Actions" />
            <div className="flex flex-col gap-3">
              {[
                {
                  label: 'Start Study Session',
                  desc: 'Jump into learning',
                  icon: <Play className="w-4 h-4" />,
                  page: 'library' as const,
                  primary: true,
                },
                {
                  label: 'View Full Calendar',
                  desc: 'All terms & deadlines',
                  icon: <CalendarDays className="w-4 h-4" />,
                  page: 'calendar' as const,
                  primary: false,
                },
                {
                  label: 'Go to Library',
                  desc: 'All subjects & topics',
                  icon: <BookOpen className="w-4 h-4" />,
                  page: 'library' as const,
                  primary: false,
                },
              ].map(({ label, desc, icon, page, primary }, i) => (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  onClick={() => onNavigate(page)}
                  className={`flex items-center gap-3 p-4 rounded-xl shadow-sm transition-all text-left min-h-14 ${
                    primary
                      ? 'bg-[#1E3A5F] text-white hover:bg-prospect-green-dark'
                      : 'bg-white border border-border text-text-primary hover:bg-slate-50 hover:shadow-md'
                  }`}
                >
                  <div className={`shrink-0 ${primary ? 'text-white' : 'text-text-secondary'}`}>{icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider leading-none mb-0.5">{label}</p>
                    <p className={`text-xs ${primary ? 'text-white/60' : 'text-text-tertiary'}`}>{desc}</p>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${primary ? 'text-white/50' : 'text-text-tertiary'}`} />
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

function SectionLabel({ text }: { text: string }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
      {text}
    </h2>
  );
}

function EmptyState({
  icon,
  title,
  message,
  action,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
      <div className="w-12 h-12 bg-slate-50 border border-border rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-text-primary mb-1">{title}</p>
        <p className="text-xs text-text-secondary max-w-50 mx-auto leading-relaxed">{message}</p>
      </div>
      {action && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2.5 bg-[#1E3A5F] text-white rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-prospect-green-dark transition-colors min-h-11"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export default withAuth(DashboardPage);
