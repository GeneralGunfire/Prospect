import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  ArrowRight,
  GraduationCap,
  Wallet,
  CheckCircle2,
  Briefcase,
  BookOpen,
  Trash2,
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import { careers } from '../data/careers';
import { bursaries } from '../data/bursaries';
import { CareerCard } from '../components/CareerCard';
import { DashboardVideoGrid } from '../components/DashboardVideoGrid';
import AppHeader from '../components/AppHeader';
import { getUserBookmarks, removeBookmark, type BookmarkState } from '../services/bookmarkService';
import { getLatestQuizResult } from '../services/quizService';
import { learningPathStorage } from '../services/storageService';
import { AlgebraProgressCard } from '../components/AlgebraProgressCard';
import { EmptyState } from '../components/EmptyState';

function DashboardPage({ user, onNavigate }: AuthedProps) {
  const [savedCareers, setSavedCareers] = useState<string[]>([]);
  const [savedBursaries, setSavedBursaries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestApsScore, setLatestApsScore] = useState<number | undefined>(undefined);

  // Fetch bookmarks and quiz results on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const bookmarks = await getUserBookmarks(user.id);
      setSavedCareers(bookmarks.careers);
      setSavedBursaries(bookmarks.bursaries);

      // Load latest quiz result for APS score
      const latestResult = await getLatestQuizResult(user.id);
      if (latestResult?.aps_score) {
        setLatestApsScore(latestResult.aps_score);
      }

      setIsLoading(false);
    };

    loadData();
  }, [user.id]);

  // Get career and bursary data
  const savedCareerData = useMemo(
    () => careers.filter(c => savedCareers.includes(c.id)),
    [savedCareers]
  );

  const savedBursaryData = useMemo(
    () => bursaries.filter(b => savedBursaries.includes(b.id)),
    [savedBursaries]
  );

  const handleRemoveCareer = async (careerId: string) => {
    await removeBookmark(user.id, 'career', careerId);
    setSavedCareers(savedCareers.filter(id => id !== careerId));
  };

  const handleRemoveBursary = async (bursaryId: string) => {
    await removeBookmark(user.id, 'bursary', bursaryId);
    setSavedBursaries(savedBursaries.filter(id => id !== bursaryId));
  };

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
            { label: 'Current APS',     value: isLoading ? '—' : (latestApsScore ?? '—'), icon: GraduationCap, iconBg: 'bg-blue-50',    iconCls: 'text-blue-600',    accentCls: 'bg-blue-400' },
            { label: 'Saved Careers',   value: isLoading ? '—' : savedCareers.length,       icon: Briefcase,    iconBg: 'bg-slate-100',   iconCls: 'text-slate-700',   accentCls: 'bg-slate-400' },
            { label: 'Saved Bursaries', value: isLoading ? '—' : savedBursaries.length,     icon: Wallet,       iconBg: 'bg-green-50',    iconCls: 'text-green-600',   accentCls: 'bg-green-400' },
            { label: 'Status',          value: isLoading ? '...' : 'Active',                icon: CheckCircle2, iconBg: 'bg-emerald-50',  iconCls: 'text-emerald-600', accentCls: 'bg-emerald-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm overflow-hidden relative"
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-50 ${stat.accentCls}`} />
              <div className={`w-9 h-9 ${stat.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-4 h-4 ${stat.iconCls}`} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold tabular-nums text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Section 2: Study Progress — only shown when user has activity */}
        {learningPathStorage.getPathProgress('grade10-algebra') && (
          <div className="py-8 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Study Progress
            </h2>
            <AlgebraProgressCard onNavigate={onNavigate} />
          </div>
        )}

        {/* Section 3: Learning Resources */}
        <div className="py-8 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Learning Resources
          </h2>
          <DashboardVideoGrid />
        </div>

        {/* Section 4: Saved Items */}
        <div className="py-8 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Saved Items
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {/* Saved Careers */}
              <section>
                <div className="flex justify-between items-center mb-5" data-stat-card>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    Saved Careers
                  </h3>
                  <button
                    onClick={() => onNavigate('careers')}
                    className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 hover:translate-x-1 transition-transform text-slate-500"
                  >
                    Browse More <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map(i => (
                      <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : savedCareerData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedCareerData.map(career => (
                      <div key={career.id} className="relative group">
                        <CareerCard career={career} />
                        <button
                          onClick={() => handleRemoveCareer(career.id)}
                          className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg lg:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Briefcase}
                    title="No saved careers yet"
                    description="Discover careers that match your interests and APS score."
                    actions={[
                      { label: 'Start Career Quiz', onClick: () => onNavigate('quiz'), primary: true },
                      { label: 'Browse Careers', onClick: () => onNavigate('careers') },
                    ]}
                  />
                )}
              </section>

              {/* Saved Bursaries */}
              <section>
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-slate-400" />
                    Saved Bursaries
                  </h3>
                  <button
                    onClick={() => onNavigate('bursaries')}
                    className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 hover:translate-x-1 transition-transform text-slate-500"
                  >
                    Find More <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : savedBursaryData.length > 0 ? (
                  <div className="space-y-3">
                    {savedBursaryData.map(bursary => (
                      <div key={bursary.id} className="bg-white border border-slate-100 rounded-xl p-5 flex items-center justify-between group hover:border-slate-300 transition-all">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-prospect-blue-accent transition-colors">{bursary.name}</h4>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{bursary.provider} • Closes {bursary.deadline}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveBursary(bursary.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all ml-2"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Wallet}
                    title="No saved bursaries yet"
                    description="Find funding opportunities that match your field and province."
                    actions={[
                      { label: 'Find Funding', onClick: () => onNavigate('bursaries'), primary: true },
                    ]}
                  />
                )}
              </section>
            </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-slate-400">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Explore Careers', icon: Briefcase, page: 'careers' as const },
                  { label: 'Find Bursaries',  icon: Wallet,    page: 'bursaries' as const },
                  { label: 'Study Library',   icon: BookOpen,  page: 'library' as const },
                ].map(({ label, icon: Icon, page }) => (
                  <button
                    key={page}
                    onClick={() => onNavigate(page)}
                    className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-300 group-hover:text-prospect-green transition-colors" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-900">{label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </section>

            <div className="bg-slate-900 rounded-2xl p-7 text-white relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 -left-4 w-32 h-32 rounded-full bg-white/[0.03]" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Pro Tip</h3>
                </div>
                <p className="text-sm font-medium leading-relaxed mb-3 text-slate-200">
                  Save careers and bursaries to track opportunities that match your goals.
                </p>
                <p className="text-xs leading-relaxed text-slate-500">
                  Bookmarks sync across all your devices automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default withAuth(DashboardPage);
