import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  ArrowRight,
  GraduationCap,
  Wallet,
  CheckCircle2,
  Clock,
  Briefcase,
  BookOpen,
  Star,
  X,
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
    <div className="min-h-screen bg-gray-50">
      <AppHeader currentPage="dashboard" user={user} onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(30,41,59,0.05)' }}>
              <LayoutDashboard className="w-4 h-4" style={{ color: '#1e293b' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1e293b' }}>Student Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ color: '#1e293b' }}>
              Welcome back, <span className="text-[#3B5A7F]">{firstName}</span>
            </h1>
          </div>
          <button
            onClick={() => onNavigate('quiz')}
            className="px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all"
            style={{ backgroundColor: '#1e293b' }}
          >
            Retake Quiz
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Current APS', value: isLoading ? '-' : (latestApsScore ?? '-'), icon: GraduationCap, bg: 'bg-blue-100', iconStyle: { color: '#1e293b' } },
            { label: 'Saved Careers', value: isLoading ? '-' : savedCareers.length, icon: Briefcase, bg: 'bg-slate-100', iconStyle: { color: '#1e293b' } },
            { label: 'Saved Bursaries', value: isLoading ? '-' : savedBursaries.length, icon: Wallet, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Status', value: isLoading ? 'Loading...' : 'Active', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
            >
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className={`w-5 h-5 ${stat.color ?? ''}`} style={stat.iconStyle} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>{stat.label}</p>
              <p className="text-2xl font-bold" style={{ color: '#1e293b' }}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Educational Videos */}
        <DashboardVideoGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Saved Careers */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: '#1e293b' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#64748b' }} />
                  Saved Careers
                </h3>
                <button
                  onClick={() => onNavigate('careers')}
                  className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
                  style={{ color: '#64748b' }}
                >
                  Browse More <ArrowRight className="w-4 h-4" />
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
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
                  <Briefcase className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm mb-4" style={{ color: '#64748b' }}>You haven't saved any careers yet.</p>
                  <button
                    onClick={() => onNavigate('careers')}
                    className="text-xs font-bold uppercase tracking-widest border border-slate-200 px-6 py-2 rounded-xl hover:bg-slate-50 transition-all"
                    style={{ color: '#1e293b' }}
                  >
                    Start Exploring
                  </button>
                </div>
              )}
            </section>

            {/* Saved Bursaries */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: '#1e293b' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#64748b' }} />
                  Saved Bursaries
                </h3>
                <button
                  onClick={() => onNavigate('bursaries')}
                  className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
                  style={{ color: '#64748b' }}
                >
                  Find More <ArrowRight className="w-4 h-4" />
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
                          <h4 className="text-sm font-bold group-hover:text-[#3B5A7F] transition-colors" style={{ color: '#1e293b' }}>{bursary.name}</h4>
                          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>{bursary.provider} • Closes {bursary.deadline}</p>
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
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
                  <Wallet className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm" style={{ color: '#64748b' }}>No saved bursaries yet.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: '#1e293b' }}>Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('careers')}
                  className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-300 transition-all group"
                >
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1e293b' }}>Explore Careers</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </button>

                <button
                  onClick={() => onNavigate('bursaries')}
                  className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-300 transition-all group"
                >
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1e293b' }}>Find Bursaries</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </button>

                <button
                  onClick={() => onNavigate('library')}
                  className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-300 transition-all group"
                >
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1e293b' }}>Study Library</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </button>
              </div>
            </section>

            <div className="rounded-2xl p-7 text-white relative overflow-hidden" style={{ backgroundColor: '#1e293b' }}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: '#64748b' }}>Tip</h3>
              <p className="text-xs leading-relaxed mb-4">Save careers and bursaries to track opportunities that match your interests and qualifications.</p>
              <p className="text-xs" style={{ color: '#94a3b8' }}>Bookmarks sync across all your devices automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);
