import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { AppPage } from '../lib/withAuth';

interface AppHeaderProps {
  currentPage: AppPage;
  user: SupabaseUser;
  onNavigate: (page: AppPage) => void;
}

export default function AppHeader({ currentPage, user, onNavigate }: AppHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsDrawerOpen(false);
    await supabase.auth.signOut();
    onNavigate('home' as AppPage);
  };

  const navLinks: { name: string; page: AppPage }[] = [
    { name: 'Dashboard', page: 'dashboard' },
    { name: 'Quiz', page: 'quiz' },
    { name: 'Job Map', page: 'map' },
    { name: 'Careers', page: 'careers' },
    { name: 'TVET Pathways', page: 'tvet' },
    { name: 'Bursaries', page: 'bursaries' },
    { name: 'Library', page: 'library' },
  ];

  const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? 'Student';
  const email = user.email ?? '';

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm py-1.5'
          : 'bg-white/40 backdrop-blur-md py-3 border-b border-slate-100/50'
      }`}
    >
      <div className="flex justify-between items-center px-4 md:px-8 w-full max-w-7xl mx-auto">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-1.5 hover:bg-slate-100/50 rounded-lg transition-colors md:hidden"
          >
            <Menu className="w-5 h-5" style={{ color: '#1e293b' }} />
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 group"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-semibold text-base shadow-lg transition-colors duration-300"
              style={{ backgroundColor: '#1e293b' }}
            >
              P
            </div>
            <span className="text-xs font-bold tracking-[0.1em] uppercase hidden sm:block" style={{ color: '#1e293b' }}>
              Prospect
            </span>
          </button>
        </div>

        {/* Center: nav links */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className={`font-semibold tracking-wider text-[11px] uppercase transition-colors ${
                currentPage === link.page
                  ? 'text-prospect-green'
                  : 'hover:text-prospect-green'
              }`}
              style={{ color: currentPage === link.page ? undefined : '#1e293b' }}
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Right: user dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-3 rounded-full transition-colors hover:bg-slate-100/60"
            style={{ background: 'rgba(30,41,59,0.05)' }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block" style={{ color: '#1e293b' }}>
              {firstName}
            </span>
            <div className="w-7 h-7 text-white rounded-full flex items-center justify-center" style={{ backgroundColor: '#1e293b' }}>
              <User className="w-4 h-4" />
            </div>
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsUserMenuOpen(false)}
                  className="fixed inset-0 z-40"
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-50">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#1e293b' }}>
                      {firstName}
                    </p>
                    <p className="text-[10px] truncate" style={{ color: '#64748b' }}>{email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { setIsUserMenuOpen(false); onNavigate('dashboard'); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium hover:bg-slate-50 rounded-lg transition-colors text-left"
                      style={{ color: '#1e293b' }}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 z-55 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-70 w-72 bg-white shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: '#1e293b' }}>
                  Prospect
                </span>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X className="w-5 h-5" style={{ color: '#1e293b' }} />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => { setIsDrawerOpen(false); onNavigate(link.page); }}
                    className={`text-lg font-semibold py-4 border-b border-slate-100 text-left transition-colors ${
                      currentPage === link.page ? 'text-prospect-green' : 'hover:text-prospect-green'
                    }`}
                    style={{ color: currentPage === link.page ? undefined : '#1e293b' }}
                  >
                    {link.name}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="mt-6 flex items-center gap-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl px-3 py-3 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
