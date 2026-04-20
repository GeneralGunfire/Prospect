import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, X, User, LogOut, LayoutDashboard,
  BrainCircuit, Briefcase, BookOpen, Wallet,
  Map, Calendar, GraduationCap, BookMarked,
  Target, Heart, Globe, Construction, Droplets,
  Search, BookText, HelpCircle, ArrowRight, Loader2,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { AppPage } from '../lib/withAuth';
import { searchTopics, searchQuestion, type TopicResult, type QuestionResult } from '../services/schoolAssistService';

interface AppHeaderProps {
  currentPage: AppPage;
  user: SupabaseUser;
  onNavigate: (page: AppPage) => void;
  /** 'school' = Dashboard/Library/Calendar. 'career' = Quiz/Careers/etc. 'community' = Impact/Potholes/Water. Defaults to 'school'. */
  mode?: 'school' | 'career' | 'community';
  /** Called when Sign In is clicked (guest users in career mode) */
  onNavigateAuth?: () => void;
}

interface NavItem {
  name: string;
  page: AppPage;
  icon: React.ReactNode;
}

// School Assist nav — auth-required pages only
const SCHOOL_NAV: NavItem[] = [
  { name: 'Dashboard', page: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { name: 'Library',   page: 'library',   icon: <BookOpen className="w-4 h-4" /> },
  { name: 'Calendar',  page: 'calendar',  icon: <Calendar className="w-4 h-4" /> },
];

// Community nav — shown on all community pages
const COMMUNITY_NAV: NavItem[] = [
  { name: 'Community Impact', page: 'community-impact', icon: <Globe className="w-4 h-4" /> },
  { name: 'Pothole Map',      page: 'pothole-map',      icon: <Construction className="w-4 h-4" /> },
  { name: 'Water Dashboard',  page: 'water-dashboard',  icon: <Droplets className="w-4 h-4" /> },
];

// Career Guide nav — all public career pages, flat
const CAREER_NAV: NavItem[] = [
  { name: 'Quiz',       page: 'quiz',               icon: <BrainCircuit className="w-4 h-4" /> },
  { name: 'Careers',    page: 'careers',             icon: <Briefcase className="w-4 h-4" /> },
  { name: 'TVET',       page: 'tvet',                icon: <GraduationCap className="w-4 h-4" /> },
  { name: 'Bursaries',  page: 'bursaries',           icon: <Wallet className="w-4 h-4" /> },
  { name: 'Job Map',    page: 'map',                 icon: <Map className="w-4 h-4" /> },
  { name: 'APS Calc',   page: 'subject-selector',    icon: <Target className="w-4 h-4" /> },
  { name: 'Guide',      page: 'disadvantaged-guide', icon: <Heart className="w-4 h-4" /> },
];

export default function AppHeader({
  currentPage,
  user,
  onNavigate,
  mode = 'school',
  onNavigateAuth,
}: AppHeaderProps) {
  const isGuest = user?.id === 'guest' || user?.is_anonymous === true;
  const NAV = mode === 'career' ? CAREER_NAV : mode === 'community' ? COMMUNITY_NAV : SCHOOL_NAV;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Search overlay (school mode only)
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<'topic' | 'question'>('topic');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [topicResults, setTopicResults] = useState<TopicResult[]>([]);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [searched, setSearched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 80);
    else { setSearchQuery(''); setTopicResults([]); setQuestionResults([]); setSearched(false); }
  }, [searchOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(v => !v); }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  const runSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearched(true);
    if (searchMode === 'topic') {
      const r = await searchTopics(searchQuery);
      setTopicResults(r);
      setQuestionResults([]);
    } else {
      const r = await searchQuestion(searchQuery);
      setQuestionResults(r);
      setTopicResults([]);
    }
    setSearchLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isDrawerOpen]);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsDrawerOpen(false);
    await supabase.auth.signOut();
    onNavigate('home' as AppPage);
  };

  const handleLogoClick = () => {
    onNavigate('home' as AppPage);
  };

  const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? 'Student';
  const email = user.email ?? '';

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = currentPage === item.page;
    return (
      <button
        onClick={() => onNavigate(item.page)}
        title={item.name}
        className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all duration-150 group/nav ${
          isActive
            ? 'text-prospect-blue-accent bg-prospect-blue-accent/10'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <span className={`shrink-0 transition-colors ${isActive ? 'text-prospect-blue-accent' : 'text-slate-400 group-hover/nav:text-slate-600'}`}>
          {item.icon}
        </span>
        <span className="hidden lg:inline whitespace-nowrap">{item.name}</span>
        {isActive && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-prospect-blue-accent" />
        )}
      </button>
    );
  };

  return (
    <>
      <header className="fixed top-0 w-full z-100 transition-all duration-300 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="flex justify-between items-center px-4 md:px-8 w-full max-w-7xl mx-auto h-16">

          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 group"
              aria-label="Go to home"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-slate-900 shadow-sm transition-all duration-200 group-hover:scale-105">
                P
              </div>
              <span className="text-xs font-black tracking-[0.18em] uppercase hidden sm:block text-slate-900">
                Prospect
              </span>
            </button>
          </div>

          {/* Center: nav — icon+label at lg+, icon-only at md */}
          <nav className="hidden md:flex items-center gap-1 mx-6">
            {NAV.map(item => <NavLink key={item.page} item={item} />)}
          </nav>

          {/* Search button — school mode only */}
          {mode === 'school' && (
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-600 mr-3"
              aria-label="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold tracking-widest uppercase">Search</span>
              <kbd className="hidden lg:inline text-[9px] bg-white border border-slate-200 rounded px-1 py-0.5 text-slate-400 font-mono">⌘K</kbd>
            </button>
          )}

          {/* Right: user menu or Sign In (Sign In only shown in school mode) */}
          <div className="relative">
            {!isGuest && (
              <>
                <button
                  onClick={() => setIsUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 group p-0.5 rounded-full transition-all"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center ring-2 ring-transparent group-hover:ring-slate-200 transition-all">
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
                        className="fixed inset-0 z-30"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 z-110 overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-50">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-800">
                            {firstName}
                          </p>
                          <p className="text-xs truncate mt-0.5 text-slate-500">{email}</p>
                        </div>
                        <div className="p-2">
                          {mode !== 'career' && (
                            <button
                              onClick={() => { setIsUserMenuOpen(false); onNavigate('dashboard'); }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium hover:bg-slate-50 rounded-xl transition-colors text-left text-slate-800"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Dashboard
                            </button>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col"
              role="navigation"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    P
                  </div>
                  <span className="text-sm font-black tracking-[0.18em] uppercase text-slate-900">
                    Prospect
                  </span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              {/* User info */}
              {!isGuest && (
                <div className="px-5 py-4 bg-slate-50/60 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center text-white shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-wider truncate text-slate-800">{firstName}</p>
                      <p className="text-xs truncate text-slate-500">{email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Search button — school mode */}
              {mode === 'school' && (
                <div className="px-3 pt-3 pb-1">
                  <button
                    onClick={() => { setIsDrawerOpen(false); setSearchOpen(true); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-widest">Search topics & questions</span>
                  </button>
                </div>
              )}

              {/* Nav links — flat, no sections */}
              <div className="flex-1 overflow-y-auto p-3">
                {NAV.map(item => {
                  const isActive = currentPage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => { setIsDrawerOpen(false); onNavigate(item.page); }}
                      className={`w-full flex items-center gap-3 text-xs font-semibold py-3 px-3 rounded-xl text-left transition-all uppercase tracking-wider mb-0.5 ${
                        isActive
                          ? 'bg-prospect-blue-accent/8 text-prospect-blue-accent'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className={isActive ? 'text-prospect-blue-accent' : 'text-slate-400'}>{item.icon}</span>
                      {item.name}
                      {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-prospect-blue-accent shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Bottom actions */}
              <div className="p-3 border-t border-slate-100 flex flex-col gap-1">
                {!isGuest && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-xl px-3 py-3 transition-colors uppercase tracking-wider"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search overlay — school mode only */}
      <AnimatePresence>
        {searchOpen && mode === 'school' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl z-[210] px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                {/* Mode toggle */}
                <div className="flex gap-1 p-3 border-b border-slate-100">
                  <button
                    onClick={() => { setSearchMode('topic'); setSearched(false); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${searchMode === 'topic' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    <BookText className="w-3 h-3" /> Topics
                  </button>
                  <button
                    onClick={() => { setSearchMode('question'); setSearched(false); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${searchMode === 'question' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    <HelpCircle className="w-3 h-3" /> Questions
                  </button>
                  <button onClick={() => setSearchOpen(false)} className="ml-auto p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && runSearch()}
                    placeholder={searchMode === 'topic' ? 'Search a topic… e.g. Quadratic equations' : 'Ask a question… e.g. How do I solve x²+5x+6=0?'}
                    className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                  />
                  <button
                    onClick={runSearch}
                    disabled={!searchQuery.trim() || searchLoading}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest disabled:opacity-40 hover:bg-slate-700 transition-all flex items-center gap-1.5"
                  >
                    {searchLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                    Go
                  </button>
                </div>

                {/* Results */}
                {searched && !searchLoading && (
                  <div className="border-t border-slate-100 max-h-80 overflow-y-auto">
                    {searchMode === 'topic' && topicResults.length === 0 && (
                      <p className="text-center text-xs text-slate-400 py-8">No topics found for "{searchQuery}"</p>
                    )}
                    {searchMode === 'topic' && topicResults.map(t => (
                      <button
                        key={t.id}
                        onClick={() => { setSearchOpen(false); onNavigate('library'); }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black text-slate-800">{t.title}</span>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">Gr {t.grade}</span>
                          <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">{t.subject}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{t.snippet}</p>
                      </button>
                    ))}
                    {searchMode === 'question' && questionResults.length === 0 && (
                      <div className="px-4 py-6 text-center">
                        <p className="text-xs text-slate-400 mb-3">No answers found for "{searchQuery}"</p>
                        <button
                          onClick={() => { setSearchOpen(false); onNavigate('school-assist' as AppPage); }}
                          className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
                        >
                          Submit your question on School Assist →
                        </button>
                      </div>
                    )}
                    {searchMode === 'question' && questionResults.map(r => (
                      <button
                        key={r.id}
                        onClick={() => { setSearchOpen(false); onNavigate('library'); }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                      >
                        <p className="text-xs font-black text-slate-800 mb-1">{r.question ?? r.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-2">{r.answer ?? r.snippet}</p>
                        {r.subject && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold mt-1 inline-block">{r.subject}</span>}
                      </button>
                    ))}
                  </div>
                )}

                <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest">Press Enter to search · Esc to close</span>
                  <button
                    onClick={() => { setSearchOpen(false); onNavigate('school-assist' as AppPage); }}
                    className="text-[9px] text-indigo-500 font-semibold hover:text-indigo-700 uppercase tracking-widest"
                  >
                    Full School Assist →
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
