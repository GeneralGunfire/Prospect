import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Bookmark, 
  History, 
  Settings, 
  ArrowRight, 
  Star, 
  GraduationCap, 
  Wallet, 
  CheckCircle2, 
  Clock,
  Briefcase,
  BookOpen,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { careers } from '../data/careers';
import { bursaries } from '../data/bursaries';
import { CareerCard } from '../components/CareerCard';
import { useDataSaver } from '../contexts/DataSaverContext';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { dataSaverMode } = useDataSaver();
  const [savedCareers] = useLocalStorage<string[]>('prospect_sa_saved_careers', []);
  const [savedBursaries] = useLocalStorage<string[]>('prospect_sa_saved_bursaries', []);
  const [completedLessons] = useLocalStorage<string[]>('prospect_sa_completed_lessons', []);
  const [apsMarks] = useLocalStorage<any[]>('prospect_sa_aps_marks', []);

  const savedCareerData = useMemo(() => 
    careers.filter(c => savedCareers.includes(c.id)), 
  [savedCareers]);

  const savedBursaryData = useMemo(() => 
    bursaries.filter(b => savedBursaries.includes(b.id)), 
  [savedBursaries]);

  const totalAPS = useMemo(() => {
    const calculatePoints = (mark: number) => {
      if (mark >= 80) return 7;
      if (mark >= 70) return 6;
      if (mark >= 60) return 5;
      if (mark >= 50) return 4;
      if (mark >= 40) return 3;
      if (mark >= 30) return 2;
      if (mark >= 0) return 1;
      return 0;
    };
    return apsMarks.reduce((acc, curr) => acc + calculatePoints(curr.mark), 0);
  }, [apsMarks]);

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy/5 rounded-full mb-4">
            <LayoutDashboard className="w-4 h-4 text-navy" />
            <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Student Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-5xl font-bold text-navy uppercase tracking-tight leading-tight">
            Welcome, <br className="md:hidden" /><span className="text-secondary">{user?.name.split(' ')[0]}</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={logout}
            className="p-3 bg-white border border-slate-100 rounded-xl hover:border-red-500 hover:text-red-500 transition-all flex items-center gap-2"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline text-[10px] font-bold uppercase tracking-widest">Logout</span>
          </button>
          <Link to="/settings" className="p-3 bg-white border border-slate-100 rounded-xl hover:border-secondary transition-all">
            <Settings className="w-5 h-5 text-navy" />
          </Link>
          <Link to="/quiz" className="bg-navy text-white px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary transition-all">
            Retake Quiz
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Current APS', value: totalAPS || '0', icon: GraduationCap, color: 'text-secondary', bg: 'bg-secondary/10' },
          { label: 'Saved Careers', value: savedCareers.length, icon: Briefcase, color: 'text-navy', bg: 'bg-navy/5' },
          { label: 'Saved Bursaries', value: savedBursaries.length, icon: Wallet, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Lessons Done', value: completedLessons.length, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-navy">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Saved Careers */}
          <section>
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                Saved Careers
              </h3>
              <Link to="/careers" className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                Browse More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {savedCareerData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedCareerData.map(career => (
                  <CareerCard key={career.id} career={career} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-sm text-secondary font-medium mb-6">You haven't saved any careers yet.</p>
                <Link to="/careers" className="text-[10px] font-bold text-navy uppercase tracking-widest border border-slate-100 px-6 py-3 rounded-xl hover:bg-slate-50 transition-all">
                  Start Exploring
                </Link>
              </div>
            )}
          </section>

          {/* Saved Bursaries */}
          <section>
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                Saved Bursaries
              </h3>
              <Link to="/bursaries" className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                Find More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {savedBursaryData.length > 0 ? (
                savedBursaryData.map(bursary => (
                  <div key={bursary.id} className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between group hover:border-secondary transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-navy group-hover:text-secondary transition-colors">{bursary.name}</h4>
                        <p className="text-[9px] text-secondary font-bold uppercase tracking-widest">{bursary.provider} • Closes {bursary.deadline}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-navy/20 group-hover:text-secondary transition-colors" />
                  </div>
                ))
              ) : (
                <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center">
                  <Wallet className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-sm text-secondary font-medium">No saved bursaries found.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-12">
          {/* Recent Activity */}
          <section>
            <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-8">Recent Activity</h3>
            <div className="space-y-6">
              {[
                { title: 'Completed Quiz', time: '2 hours ago', icon: Star, color: 'text-secondary', bg: 'bg-secondary/10' },
                { title: 'Updated APS Marks', time: 'Yesterday', icon: GraduationCap, color: 'text-navy', bg: 'bg-navy/5' },
                { title: 'Saved Software Engineer', time: '2 days ago', icon: Bookmark, color: 'text-orange-600', bg: 'bg-orange-50' },
                { title: 'Joined Platform', time: '3 days ago', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-8 h-8 ${activity.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy mb-1">{activity.title}</h4>
                    <p className="text-[10px] text-secondary font-bold uppercase tracking-widest flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <div className="bg-navy rounded-3xl p-8 text-white relative overflow-hidden">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-8">Quick Actions</h3>
            <div className="space-y-4 relative z-10">
              {[
                { label: 'Check NSFAS Eligibility', path: '/bursary-eligibility' },
                { label: 'Subject Selection Tool', path: '/subject-selector' },
                { label: 'Browse Study Library', path: '/library' },
              ].map((link, i) => (
                <Link 
                  key={i} 
                  to={link.path}
                  className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                >
                  <span className="text-xs font-bold uppercase tracking-wider">{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-secondary group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 rounded-full blur-[80px] -mr-24 -mt-24" />
          </div>
        </div>
      </div>
    </div>
  );
};
