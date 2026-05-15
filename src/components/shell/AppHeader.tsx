import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import {
  Menu, X, User, LogOut, LayoutDashboard,
  BrainCircuit, Briefcase, BookOpen, Wallet,
  Map, Calendar, GraduationCap, BookMarked,
  Target, Heart, Droplets,
  Search, BookText, HelpCircle, ArrowRight, Loader2,
  Newspaper, Calculator, MapPin, Building2, MessageCircle,
  ChevronDown,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import type { AppPage } from '../../lib/withAuth';
import { searchTopics, searchQuestion, type TopicResult, type QuestionResult } from '../../services/schoolAssistService';

interface AppHeaderProps {
  currentPage: AppPage;
  user?: SupabaseUser | null;
  onNavigate: (page: AppPage) => void;
  /** 'school' = Dashboard/Library/Calendar. 'career' = Quiz/Careers/etc. 'community' = Impact/Water/Tax/Civics. Defaults to 'school'. */
  mode?: 'school' | 'career' | 'community';
  /** Called when Sign In is clicked (guest users in career mode) */
  onNavigateAuth?: () => void;
}

interface NavItem {
  name: string;
  page: AppPage;
  icon: React.ReactNode;
}

const SCHOOL_NAV: NavItem[] = [
  { name: 'Dashboard',    page: 'dashboard',          icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  { name: 'Library',      page: 'library',            icon: <BookOpen className="w-3.5 h-3.5" /> },
  { name: 'Calendar',     page: 'calendar',           icon: <Calendar className="w-3.5 h-3.5" /> },
  { name: 'Chat',         page: 'school-assist-chat', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  { name: 'Exam Dates',   page: 'matric-exam-dates',  icon: <BookMarked className="w-3.5 h-3.5" /> },
];

const COMMUNITY_NAV: NavItem[] = [
  { name: 'Load Shedding',    page: 'load-shedding',     icon: <Newspaper className="w-3.5 h-3.5" /> },
  { name: 'Water Dashboard',  page: 'water-dashboard',   icon: <Droplets className="w-3.5 h-3.5" /> },
  { name: 'Tax & Budget',     page: 'tax-budget',        icon: <Calculator className="w-3.5 h-3.5" /> },
  { name: 'Cost of Living',   page: 'cost-of-living',    icon: <MapPin className="w-3.5 h-3.5" /> },
  { name: 'Civics',           page: 'civics',            icon: <Building2 className="w-3.5 h-3.5" /> },
];

const CAREER_NAV: NavItem[] = [
  { name: 'Quiz',       page: 'quiz',               icon: <BrainCircuit className="w-3.5 h-3.5" /> },
  { name: 'Careers',    page: 'careers',             icon: <Briefcase className="w-3.5 h-3.5" /> },
  { name: 'TVET',       page: 'tvet',                icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { name: 'Bursaries',  page: 'bursaries',           icon: <Wallet className="w-3.5 h-3.5" /> },
  { name: 'Job Map',    page: 'map',                 icon: <Map className="w-3.5 h-3.5" /> },
];

const EXPAND_SCROLL_THRESHOLD = 80;

export default function AppHeader({
  currentPage,
  user,
  onNavigate,
  mode = 'school',
  onNavigateAuth,
}: AppHeaderProps) {
  const isGuest = !user || user?.id === 'guest' || user?.is_anonymous === true;

  const NAV = mode === 'career' ? CAREER_NAV : mode === 'community' ? COMMUNITY_NAV : SCHOOL_NAV;

  const [isExpanded, setExpanded] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTvetMenuOpen, setIsTvetMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const scrollPositionOnCollapse = useRef(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current;
    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (!isExpanded && latest < previous && (scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD)) {
      setExpanded(true);
    }
    lastScrollY.current = latest;
  });

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
    document.body.style.overflow = isDrawerOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isDrawerOpen]);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsDrawerOpen(false);
    await supabase.auth.signOut();
    onNavigate('home' as AppPage);
  };

  const handleLogoClick = () => onNavigate('home' as AppPage);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Student';
  const email = user?.email ?? '';

  const handlePillClick = (e: React.MouseEvent) => {
    if (!isExpanded) { e.preventDefault(); setExpanded(true); }
    setIsTvetMenuOpen(false);
  };

  return (
    <>
      {/* Floating pill nav */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)] min-w-0">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1, width: isExpanded ? 'auto' : '3rem' }}
          transition={{
            y: { duration: 0.4, ease: 'easeOut' },
            opacity: { duration: 0.3 },
            width: { type: 'spring', damping: 28, stiffness: 260 },
          }}
          whileHover={!isExpanded ? { scale: 1.08 } : {}}
          whileTap={!isExpanded ? { scale: 0.95 } : {}}
          onClick={handlePillClick}
          className={`flex items-center overflow-hidden rounded-full border border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm h-12 ${!isExpanded ? 'cursor-pointer justify-center' : ''}`}
        >
          {/* Logo */}
          <motion.div
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            className="shrink-0 flex items-center pl-4 pr-2 gap-2"
          >
            <button onClick={(e) => { e.stopPropagation(); handleLogoClick(); }} className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white font-black text-xs group-hover:scale-105 transition-transform">P</div>
              <span className="text-sm font-black tracking-[0.05em] text-slate-900 hidden sm:block">PROSPECT</span>
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            className="w-px h-5 bg-slate-200 shrink-0"
          />

          {/* Nav items */}
          <motion.div
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            className={`flex items-center gap-0.5 px-2 ${!isExpanded ? 'pointer-events-none' : ''}`}
          >
            {/* Mobile: hamburger to open drawer */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsDrawerOpen(true); }}
              className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Desktop nav items */}
            {NAV.map((item) => {
              const isActive = currentPage === item.page ||
                (item.page === 'tvet' && ['tvet-careers','tvet-colleges','tvet-funding','tvet-requirements'].includes(currentPage as string));

              if (item.page === 'tvet') {
                return (
                  <div key={item.page} className="hidden md:flex items-center relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); onNavigate(item.page); }}
                      className={`flex items-center text-sm px-2.5 py-1.5 rounded-l-lg transition-all duration-150 whitespace-nowrap ${
                        isActive ? 'text-slate-900 font-black' : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {item.name}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsTvetMenuOpen(v => !v); setIsUserMenuOpen(false); }}
                      className={`flex items-center px-1 py-1.5 rounded-r-lg transition-all duration-150 ${
                        isTvetMenuOpen ? 'text-slate-900 bg-slate-100' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      aria-label="TVET sub-pages"
                    >
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isTvetMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={item.page}
                  onClick={(e) => { e.stopPropagation(); onNavigate(item.page); }}
                  className={`hidden md:flex items-center text-sm px-2.5 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'text-slate-900 font-black'
                      : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </motion.div>

          {/* Right actions: search + user */}
          <motion.div
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            className={`flex items-center gap-1 pr-2 ${!isExpanded ? 'pointer-events-none' : ''}`}
          >
            {mode === 'school' && (
              <button
                onClick={(e) => { e.stopPropagation(); setSearchOpen(true); }}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                aria-label="Search (Ctrl+K)"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {!isGuest && mode !== 'career' && (
              <div className="relative flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsUserMenuOpen(v => !v); }}
                  className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  aria-label="User menu"
                >
                  <User className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Collapsed state: menu icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ opacity: isExpanded ? 0 : 1 }}
              transition={{ duration: 0.18 }}
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </motion.div>
          </div>
        </motion.nav>

        {/* TVET Sub-menu Dropdown */}
        <AnimatePresence>
          {isTvetMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={(e) => { e.stopPropagation(); setIsTvetMenuOpen(false); }}
                className="fixed inset-0 z-200"
              />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.13, ease: 'easeOut' }}
                className="absolute left-1/2 -translate-x-1/2 top-13 w-52 bg-[#0f172a] rounded-xl border border-white/10 z-201 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">TVET</p>
                </div>
                <div className="p-1.5">
                  {[
                    { label: 'Overview',     page: 'tvet' },
                    { label: 'Careers',      page: 'tvet-careers' },
                    { label: 'Colleges',     page: 'tvet-colleges' },
                    { label: 'Funding',      page: 'tvet-funding' },
                    { label: 'Requirements', page: 'tvet-requirements' },
                  ].map(({ label, page }) => {
                    const isActive = currentPage === page;
                    return (
                      <button
                        key={page}
                        onClick={() => { setIsTvetMenuOpen(false); onNavigate(page as AppPage); }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all text-left ${
                          isActive
                            ? 'text-white bg-white/10'
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {label}
                        {isActive && <span className="w-1 h-1 rounded-full bg-white/60" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* User Menu Dropdown placed outside nav to escape overflow-hidden */}
        <AnimatePresence>
          {isUserMenuOpen && !isGuest && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={(e) => { e.stopPropagation(); setIsUserMenuOpen(false); }}
                className="fixed inset-0 z-200"
              />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.13, ease: 'easeOut' }}
                className="absolute right-0 top-13 w-48 max-w-[calc(100vw-2rem)] bg-[#0f172a] rounded-xl border border-white/10 z-201 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-[11px] font-black uppercase tracking-widest text-white">{firstName}</p>
                  <p className="text-[10px] truncate mt-0.5 text-white/40">{email}</p>
                </div>
                <div className="p-1.5">
                  {mode !== 'career' && (
                    <button
                      onClick={() => { setIsUserMenuOpen(false); onNavigate('dashboard'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all text-left"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-all text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 z-200 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-201 w-72 bg-white flex flex-col"
              role="navigation"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
                  <span className="text-sm font-black tracking-[0.05em] text-slate-900">PROSPECT</span>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors" aria-label="Close menu">
                  <X className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              {!isGuest && mode !== 'career' && (
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

              <div className="flex-1 overflow-y-auto p-3">
                {NAV.map(item => {
                  const isActive = currentPage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => { setIsDrawerOpen(false); onNavigate(item.page); }}
                      className={`w-full flex items-center gap-3 text-xs font-semibold min-h-11 py-3 px-4 rounded-xl text-left transition-all uppercase tracking-wider mb-0.5 ${
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                      {item.name}
                      {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
                    </button>
                  );
                })}
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-black/50 z-200 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl z-201 px-4"
            >
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="flex gap-1 p-3 border-b border-slate-100">
                  <button
                    onClick={() => { setSearchMode('topic'); setSearched(false); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${searchMode === 'topic' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    <BookText className="w-3 h-3" /> Topics
                  </button>
                  <button
                    onClick={() => { setSearchMode('question'); setSearched(false); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${searchMode === 'question' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    <HelpCircle className="w-3 h-3" /> Questions
                  </button>
                  <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="ml-auto w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors shrink-0">
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                <div className="flex items-center gap-3 px-4 min-h-12">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && runSearch()}
                    placeholder={searchMode === 'topic' ? 'Search a topic… e.g. Quadratic equations' : 'Ask a question… e.g. How do I solve x²+5x+6=0?'}
                    className="flex-1 w-full bg-transparent text-base text-slate-800 placeholder:text-slate-400 outline-none"
                    style={{ fontSize: '16px' }}
                  />
                  <button
                    onClick={runSearch}
                    disabled={!searchQuery.trim() || searchLoading}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-widest disabled:opacity-40 hover:bg-slate-700 transition-all flex items-center gap-1.5"
                  >
                    {searchLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                    Go
                  </button>
                </div>

                {searched && !searchLoading && (
                  <div className="border-t border-slate-100 max-h-80 overflow-y-auto">
                    {searchMode === 'topic' && topicResults.length === 0 && (
                      <p className="text-center text-xs text-slate-400 py-8">No topics found for "{searchQuery}"</p>
                    )}
                    {searchMode === 'topic' && topicResults.map(t => (
                      <button
                        key={t.id}
                        onClick={() => { setSearchOpen(false); onNavigate('library'); }}
                        className="w-full text-left px-4 py-3 min-h-11 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
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
                          className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
                        >
                          Submit your question on School Assist →
                        </button>
                      </div>
                    )}
                    {searchMode === 'question' && questionResults.map(r => (
                      <button
                        key={r.id}
                        onClick={() => { setSearchOpen(false); onNavigate('library'); }}
                        className="w-full text-left px-4 py-3 min-h-11 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
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
                    className="text-[9px] text-blue-500 font-semibold hover:text-blue-700 uppercase tracking-widest"
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
