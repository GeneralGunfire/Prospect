import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  ArrowRight,
  GraduationCap,
  Wallet,
  CheckCircle2,
  Briefcase,
  BookOpen,
  CalendarDays,
  Bell,
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import { DashboardVideoGrid } from '../components/DashboardVideoGrid';
import AppHeader from '../components/AppHeader';
import { getUserBookmarks } from '../services/bookmarkService';
import { getLatestQuizResult } from '../services/quizService';
import { learningPathStorage } from '../services/storageService';
import { AlgebraProgressCard } from '../components/AlgebraProgressCard';

// Upcoming key dates (matches CalendarPageNew DEADLINES)
const UPCOMING = [
  { title: 'UP Applications Open',  date: '1 Apr',  color: 'bg-amber-50 border-amber-100 text-amber-700' },
  { title: 'Wits Early Applications', date: '30 Jun', color: 'bg-red-50 border-red-100 text-red-700' },
  { title: 'NSFAS 2027 Opens',       date: '1 Sep',  color: 'bg-blue-50 border-blue-100 text-blue-700' },
  { title: 'Matric Finals Begin',    date: '20 Oct', color: 'bg-orange-50 border-orange-100 text-orange-700' },
];

function DashboardPage({ user, onNavigate }: AuthedProps) {
  const [savedCareers, setSavedCareers] = useState<string[]>([]);
  const [savedBursaries, setSavedBursaries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestApsScore, setLatestApsScore] = useState<number | undefined>(undefined);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const bookmarks = await getUserBookmarks(user.id);
      setSavedCareers(bookmarks.careers);
      setSavedBursaries(bookmarks.bursaries);
      const latestResult = await getLatestQuizResult(user.id);
      if (latestResult?.aps_score) setLatestApsScore(latestResult.aps_score);
      setIsLoading(false);
    };
    loadData();
  }, [user.id]);

  const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? 'Student';

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentPage="dashboard" user={user} onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-slate-900/5">
              <LayoutDashboard className="w-4 h-4 text-slate-900" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Student Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
              Welcome back, <span className="text-prospect-blue-accent">{firstName}</span>
            </h1>
          </div>
          <button
            onClick={() => onNavigate('quiz')}
            className="px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm"
          >
            Retake Quiz
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Current APS',     value: isLoading ? '—' : (latestApsScore ?? '—'), sub: 'out of 210',      icon: GraduationCap, iconBg: 'bg-blue-600',    stripe: 'border-l-blue-500' },
            { label: 'Saved Careers',   value: isLoading ? '—' : savedCareers.length,     sub: 'career paths',    icon: Briefcase,    iconBg: 'bg-slate-800',   stripe: 'border-l-slate-400' },
            { label: 'Saved Bursaries', value: isLoading ? '—' : savedBursaries.length,   sub: 'funding options', icon: Wallet,       iconBg: 'bg-green-600',   stripe: 'border-l-green-500' },
            { label: 'Status',          value: isLoading ? '...' : 'Active',               sub: 'account',         icon: CheckCircle2, iconBg: 'bg-emerald-600', stripe: 'border-l-emerald-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              className={`bg-white border-l-4 ${stat.stripe} rounded-2xl p-5 shadow-sm overflow-hidden`}
            >
              <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-slate-400">{stat.label}</p>
              <p className="text-3xl font-black tabular-nums text-slate-900 leading-none mb-1">{stat.value}</p>
              <p className="text-[10px] text-slate-400">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Study Progress — conditional */}
        {learningPathStorage.getPathProgress('grade10-algebra') && (
          <div className="py-8 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Study Progress
            </h2>
            <AlgebraProgressCard onNavigate={onNavigate} />
          </div>
        )}

        {/* Learning Resources */}
        <div className="py-8 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Learning Resources
          </h2>
          <DashboardVideoGrid />
        </div>

        {/* Quick Actions + Upcoming Deadlines */}
        <div className="py-8 border-t border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Explore Careers',  desc: 'Browse 400+ SA career paths',        icon: Briefcase,    page: 'careers' as const,   iconBg: 'bg-blue-600',    bg: 'bg-blue-50   border-blue-100' },
                  { label: 'Find Bursaries',   desc: 'Discover funding opportunities',     icon: Wallet,       page: 'bursaries' as const,  iconBg: 'bg-green-600',   bg: 'bg-green-50  border-green-100' },
                  { label: 'Study Library',    desc: 'Gr 10–12 study materials',           icon: BookOpen,     page: 'library' as const,    iconBg: 'bg-amber-500',   bg: 'bg-amber-50  border-amber-100' },
                  { label: 'Study Calendar',   desc: 'Track terms & deadlines',            icon: CalendarDays, page: 'calendar' as const,   iconBg: 'bg-violet-600',  bg: 'bg-violet-50 border-violet-100' },
                ].map(({ label, desc, icon: Icon, page, iconBg, bg }) => (
                  <motion.button
                    key={page}
                    onClick={() => onNavigate(page)}
                    whileHover={{ y: -2, boxShadow: '0 6px 18px rgba(0,0,0,0.07)' }}
                    className={`flex items-center gap-4 p-5 rounded-2xl border ${bg} transition-all text-left group`}
                  >
                    <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-900 mb-0.5">{label}</p>
                      <p className="text-[10px] text-slate-500">{desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Upcoming Key Dates */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Upcoming Deadlines
              </h2>
              <div className="space-y-2">
                {UPCOMING.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border ${item.color}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      <span className="text-xs font-bold">{item.title}</span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-white/60 ml-2 shrink-0">{item.date}</span>
                  </motion.div>
                ))}
                <button
                  onClick={() => onNavigate('calendar')}
                  className="w-full mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 transition-colors"
                >
                  View full calendar <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);
