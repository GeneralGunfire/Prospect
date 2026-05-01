import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen, CalendarDays, ArrowRight,
  Clock, Target, Play, ChevronRight,
  TrendingUp, Briefcase, Wallet,
  MessageSquare, Trash2, ChevronDown, ChevronUp,
  X, Star, GraduationCap, User, MoreHorizontal,
  Tag, FileText, Paperclip, Plus, Download,
  CheckCircle2, Circle, AlertCircle,
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import { studyProgressStorage, learningPathStorage } from '../services/storageService';
import { algebraLearningPath } from '../data/demoLearningPath';
import { getUserQuestions, deleteQuestion, type UnansweredQuestion } from '../services/unansweredQuestionService';
import { getUserBookmarks, removeBookmark, type BookmarkState } from '../services/bookmarkService';
import { getAPSMarks, getQuizResults } from '../services/dashboardService';
import { careers } from '../data/careers';
import { bursaries } from '../data/bursaries';

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
  return Math.ceil((new Date(iso).getTime() - today.getTime()) / 86_400_000);
}

function urgencyStyle(days: number) {
  if (days <= 14)  return { bar: 'bg-red-400',   pill: 'bg-red-50 border-red-200 text-red-700',       dot: 'bg-red-400',   label: `${days}d left`,           status: 'Urgent'      as const };
  if (days <= 60)  return { bar: 'bg-amber-400', pill: 'bg-amber-50 border-amber-200 text-amber-700', dot: 'bg-amber-400', label: `${days}d left`,           status: 'Upcoming'    as const };
  const months = Math.round(days / 30);
  return           { bar: 'bg-blue-400',  pill: 'bg-blue-50 border-blue-200 text-blue-700',   dot: 'bg-blue-400',  label: `${months} mo`,            status: 'Planned'     as const };
}

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 120, damping: 16 } },
};

// ── Status badge ──────────────────────────────────────────────────────────────
type DeadlineStatus = 'Urgent' | 'Upcoming' | 'Planned' | 'Done';

function StatusBadge({ status }: { status: DeadlineStatus }) {
  const styles: Record<DeadlineStatus, string> = {
    Done:     'bg-blue-50 text-blue-700 border-blue-200',
    Urgent:   'bg-red-50 text-red-700 border-red-200',
    Upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
    Planned:  'bg-blue-50 text-blue-700 border-blue-200',
  };
  const dots: Record<DeadlineStatus, string> = {
    Done: 'bg-blue-400', Urgent: 'bg-red-400', Upcoming: 'bg-amber-400', Planned: 'bg-blue-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
function DashboardPage({ user, onNavigate }: AuthedProps) {
  const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? 'Student';
  const fullName  = user.user_metadata?.full_name ?? 'Student';
  const email     = user.email ?? '';

  // Study progress
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
      setSubjectProgress(Object.entries(bySubject).map(([subject, v]) => ({ subject, ...v })));
    }
  }, []);

  // Deadlines
  const upcomingDeadlines = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return DEADLINES.map(d => ({ ...d, days: daysUntil(d.iso) })).filter(d => d.days >= 0);
  }, []);
  const nextDeadline = upcomingDeadlines[0] ?? null;

  // Active learning path
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

  // APS + RIASEC
  const [apsScore, setApsScore] = useState<number | null>(null);
  const [riasecType, setRiasecType] = useState<string | null>(null);

  useEffect(() => {
    if (user.id === 'guest') return;
    getAPSMarks(user.id).then(data => { if (data?.calculated_aps) setApsScore(data.calculated_aps); });
    getQuizResults(user.id).then(data => { if (data?.top_codes?.length) setRiasecType(data.top_codes.slice(0, 2).join('')); });
  }, [user.id]);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<BookmarkState>({ careers: [], bursaries: [] });
  useEffect(() => { getUserBookmarks(user.id).then(setBookmarks); }, [user.id]);

  const savedCareers   = useMemo(() => bookmarks.careers.map(id => careers.find(c => c.id === id)).filter(Boolean) as typeof careers, [bookmarks.careers]);
  const savedBursaries = useMemo(() => bookmarks.bursaries.map(id => bursaries.find(b => b.id === id)).filter(Boolean) as typeof bursaries, [bookmarks.bursaries]);

  async function handleRemoveCareer(id: string) {
    await removeBookmark(user.id, 'career', id);
    setBookmarks(prev => ({ ...prev, careers: prev.careers.filter(c => c !== id) }));
  }
  async function handleRemoveBursary(id: string) {
    await removeBookmark(user.id, 'bursary', id);
    setBookmarks(prev => ({ ...prev, bursaries: prev.bursaries.filter(b => b !== id) }));
  }

  // My Questions
  const [questions, setQuestions] = useState<UnansweredQuestion[]>([]);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user.id === 'guest') { setQuestionsLoaded(true); return; }
    getUserQuestions(user.id).then(q => { setQuestions(q); setQuestionsLoaded(true); });
  }, [user.id]);

  async function handleDeleteQuestion(id: string) {
    const ok = await deleteQuestion(id, user.id);
    if (ok) setQuestions(prev => prev.filter(q => q.id !== id));
  }
  function toggleAnswer(id: string) {
    setExpandedAnswers(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const todayLabel = new Date().toLocaleDateString('en-ZA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const totalBookmarks = savedCareers.length + savedBursaries.length;
  const totalQuestionsAnswered = questions.filter(q => q.status === 'answered').length;
  const overallStudyPct = subjectProgress.length > 0
    ? Math.round((subjectProgress.reduce((s, p) => s + p.completed, 0) / subjectProgress.reduce((s, p) => s + p.total, 0)) * 100)
    : 0;

  const studyStatus = hasActivePath ? 'In Progress' : subjectProgress.length > 0 ? 'In Progress' : 'Not Started';
  const studyStatusStyle = studyStatus === 'In Progress'
    ? 'bg-amber-50 border-amber-200 text-amber-700'
    : 'bg-slate-50 border-slate-200 text-slate-500';
  const studyStatusDot = studyStatus === 'In Progress' ? 'bg-amber-400 animate-pulse' : 'bg-slate-300';

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentPage="dashboard" user={user} onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden"
        >

          {/* ── Top bar: breadcrumb + actions ──────────────────────────────── */}
          <motion.div variants={item} className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="font-semibold text-slate-600">School Assist</span>
              <span>/</span>
              <span>Dashboard</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onNavigate('school-assist-chat')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Ask AI
              </button>
            </div>
          </motion.div>

          <div className="p-6 md:p-8 space-y-8">

            {/* ── Title ──────────────────────────────────────────────────────── */}
            <motion.div variants={item}>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">{todayLabel}</p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                Good {getGreeting()}, {firstName}
              </h1>
            </motion.div>

            {/* ── Meta grid ──────────────────────────────────────────────────── */}
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">

              {/* Study Status */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <MoreHorizontal className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${studyStatusStyle}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${studyStatusDot}`} />
                    {studyStatus}
                  </span>
                </div>
              </div>

              {/* Student */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Student</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-black">
                      {fullName.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{fullName}</span>
                  </div>
                  {email && <p className="text-xs text-slate-400 mt-0.5">{email}</p>}
                </div>
              </div>

              {/* Next deadline */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CalendarDays className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Next Deadline</p>
                  {nextDeadline ? (
                    <>
                      <p className="text-sm font-semibold text-slate-800 leading-snug">{nextDeadline.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDateLong(nextDeadline.iso)} · {nextDeadline.cat}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-400">No upcoming deadlines</p>
                  )}
                </div>
              </div>

              {/* RIASEC */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Star className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Career Type</p>
                  {riasecType ? (
                    <p className="text-xl font-black text-slate-900 leading-none">{riasecType}</p>
                  ) : (
                    <button
                      onClick={() => onNavigate('quiz')}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      Take the quiz →
                    </button>
                  )}
                </div>
              </div>

              {/* Saved items */}
              <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-1">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Tag className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Saved Items</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-700">
                      <Briefcase className="w-3 h-3" /> {savedCareers.length} career{savedCareers.length !== 1 ? 's' : ''}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-700">
                      <Wallet className="w-3 h-3" /> {savedBursaries.length} bursar{savedBursaries.length !== 1 ? 'ies' : 'y'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description / summary */}
              {(hasActivePath || subjectProgress.length > 0) && (
                <div className="flex items-start gap-3 col-span-1 sm:col-span-2 lg:col-span-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Progress Summary</p>
                    <p className="text-sm text-slate-600">
                      {hasActivePath && nextTopicToStudy
                        ? `Currently working through Mathematics (Algebra). Next up: ${nextTopicToStudy.title}. Overall study progress is at ${overallStudyPct}%.`
                        : subjectProgress.length > 0
                        ? `You have ${subjectProgress.reduce((s, p) => s + p.completed, 0)} topics mastered across ${subjectProgress.length} subject${subjectProgress.length !== 1 ? 's' : ''}.`
                        : 'No study sessions started yet. Head to the Library to begin.'}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* ── Learning Paths (like Attachments) ────────────────────────── */}
            <motion.div variants={item} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-slate-400" />
                  Active Learning Paths
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-xs font-black text-slate-600">
                    {subjectProgress.length}
                  </span>
                </h3>
                <button
                  onClick={() => onNavigate('library')}
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" /> View Library
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {subjectProgress.map(sp => {
                  const pct = sp.total > 0 ? Math.round((sp.completed / sp.total) * 100) : 0;
                  const color = pct >= 80 ? 'bg-blue-500' : pct >= 40 ? 'bg-blue-500' : 'bg-amber-500';
                  const bgColor = pct >= 80 ? 'bg-blue-50 border-blue-100' : pct >= 40 ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100';
                  const iconColor = pct >= 80 ? 'text-blue-500' : pct >= 40 ? 'text-blue-600' : 'text-amber-600';
                  return (
                    <div key={sp.subject} className={`flex items-start gap-3 p-4 border rounded-2xl ${bgColor}`}>
                      <div className={`w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 ${iconColor}`}>
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate">{sp.subject}</p>
                        {sp.lastTopic && <p className="text-xs text-slate-500 truncate">Last: {sp.lastTopic}</p>}
                        <div className="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                            className={`h-full rounded-full ${color}`}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{sp.completed}/{sp.total} topics · {pct}%</p>
                      </div>
                    </div>
                  );
                })}

                {/* Start new / resume CTA card */}
                {hasActivePath && nextTopicToStudy ? (
                  <button
                    onClick={() => onNavigate('demo-learning')}
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-blue-200 rounded-2xl text-blue-600 hover:bg-blue-50 transition-colors group"
                  >
                    <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black">Resume</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('library')}
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-xs font-black">New subject</span>
                  </button>
                )}
              </div>
            </motion.div>

            {/* ── Deadlines table ───────────────────────────────────────────── */}
            <motion.div variants={item} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">Upcoming Deadlines</h3>
                <button
                  onClick={() => onNavigate('calendar')}
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <CalendarDays className="w-3.5 h-3.5" /> Full Calendar
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      <th className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-3 w-10">#</th>
                      <th className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-3">Event</th>
                      <th className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-3">Category</th>
                      <th className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-3">Status</th>
                      <th className="text-right text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingDeadlines.slice(0, 6).map((d, i) => {
                      const { status } = urgencyStyle(d.days);
                      return (
                        <motion.tr
                          key={d.iso}
                          variants={item}
                          className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-800 text-xs">{d.title}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              d.cat === 'Funding' ? 'bg-blue-50 text-blue-700'
                              : d.cat === 'Exams' ? 'bg-red-50 text-red-700'
                              : 'bg-blue-50 text-blue-700'
                            }`}>{d.cat}</span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={status} />
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-slate-500">{formatDateShort(d.iso)}</td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* ── My Questions ──────────────────────────────────────────────── */}
            {questionsLoaded && questions.length > 0 && (
              <motion.div variants={item} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    My Questions
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-xs font-black text-blue-600">
                      {questions.length}
                    </span>
                  </h3>
                  <button
                    onClick={() => onNavigate('school-assist')}
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    Ask a question <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden">
                  {questions.map((q, i) => (
                    <motion.div key={q.id} variants={item} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                          {q.status === 'answered'
                            ? <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            : <Circle className="w-4 h-4 text-amber-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <QuestionStatusBadge status={q.status} />
                            {q.subject && <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{q.subject}</span>}
                            {q.grade && <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Gr {q.grade}</span>}
                            <span className="text-xs text-slate-400">{formatDateShort(q.created_at)}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800 leading-snug">{q.question}</p>

                          {q.status === 'answered' && q.answer_text && (
                            <>
                              <AnimatePresence>
                                {expandedAnswers.has(q.id) && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <p className="text-xs text-slate-600 leading-relaxed mt-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
                                      {q.answer_text}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <button
                                onClick={() => toggleAnswer(q.id)}
                                className="mt-1.5 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-blue-500 hover:text-blue-800 transition-colors"
                              >
                                {expandedAnswers.has(q.id)
                                  ? <><ChevronUp className="w-3 h-3" /> Hide Answer</>
                                  : <><ChevronDown className="w-3 h-3" /> View Answer</>}
                              </button>
                            </>
                          )}
                        </div>
                        {q.status === 'pending' && (
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Saved Careers + Bursaries ────────────────────────────────── */}
            {totalBookmarks > 0 && (
              <motion.div variants={item} className="space-y-4">
                <h3 className="text-base font-bold text-slate-800">Saved Items</h3>
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60">
                        <th className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-3">#</th>
                        <th className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-3">Name</th>
                        <th className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-3">Type</th>
                        <th className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-3">Category</th>
                        <th className="text-right text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedCareers.map((career, i) => (
                        <motion.tr key={career.id} variants={item} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800 text-xs">{career.title}</td>
                          <td className="px-4 py-3"><span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Career</span></td>
                          <td className="px-4 py-3 text-xs text-slate-500">{career.category}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => onNavigate('careers')} className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors px-2 py-1">View</button>
                              <button onClick={() => handleRemoveCareer(career.id)} className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"><X className="w-3 h-3" /></button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                      {savedBursaries.map((bursary, i) => (
                        <motion.tr key={bursary.id} variants={item} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3 text-slate-400 text-xs">{savedCareers.length + i + 1}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800 text-xs">{bursary.name}</td>
                          <td className="px-4 py-3"><span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Bursary</span></td>
                          <td className="px-4 py-3 text-xs text-slate-500">{bursary.provider}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => onNavigate('bursaries')} className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors px-2 py-1">View</button>
                              <button onClick={() => handleRemoveBursary(bursary.id)} className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"><X className="w-3 h-3" /></button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Empty state quick actions ──────────────────────────────────── */}
            {totalBookmarks === 0 && !hasActivePath && subjectProgress.length === 0 && (
              <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { label: 'Start Studying', desc: 'Browse the library', icon: <BookOpen className="w-4 h-4" />, page: 'library' as const, color: 'bg-blue-50 border-blue-100 text-blue-700' },
                  { label: 'Take Quiz', desc: 'Discover your career type', icon: <Target className="w-4 h-4" />, page: 'quiz' as const, color: 'bg-blue-50 border-blue-100 text-blue-700' },
                  { label: 'View Calendar', desc: 'All deadlines & terms', icon: <CalendarDays className="w-4 h-4" />, page: 'calendar' as const, color: 'bg-slate-100 border-slate-200 text-slate-700' },
                ].map(({ label, desc, icon, page, color }) => (
                  <button
                    key={label}
                    onClick={() => onNavigate(page)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border text-left hover:opacity-80 transition-opacity ${color}`}
                  >
                    <div className="shrink-0">{icon}</div>
                    <div>
                      <p className="text-xs font-black">{label}</p>
                      <p className="text-xs opacity-70">{desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto shrink-0 opacity-50" />
                  </button>
                ))}
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function QuestionStatusBadge({ status }: { status: UnansweredQuestion['status'] }) {
  if (status === 'pending') return <span className="text-xs font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">Pending</span>;
  if (status === 'answered') return <span className="text-xs font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">Answered</span>;
  return <span className="text-xs font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">Resolved</span>;
}

export default withAuth(DashboardPage);
