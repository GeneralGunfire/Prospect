import { useState, useEffect, type ReactNode, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { restoreSessionFromStorage } from './lib/auth';
import { runMigrations } from './utils/migrationScript';
import { syncUserDataOnLogin, startBackgroundSync, stopBackgroundSync } from './services/supabaseSync';
import { Hero as AnimatedHero } from '../components/ui/animated-hero';
import { LogoCloud } from '../components/ui/logo-cloud-2';
import { NeoMinimalFooter } from '../components/ui/neo-minimal-footer';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  MapPin,
  Award,
  Compass,
  Target,
  Rocket,
  ArrowRight,
  CalendarDays,
  Newspaper,
  Users,
  Navigation,
  Menu,
  X,
  ChevronDown,
  Facebook,
  Instagram,
  Twitter,
  HelpCircle,
} from 'lucide-react';

// Lazy-load all page-level components
const AuthPage           = lazy(() => import('./pages/AuthPage'));
const DashboardPage      = lazy(() => import('./pages/DashboardPage'));
const Grade10SubjectSelectorPage = lazy(() => import('./pages/Grade10SubjectSelectorPage'));
const StudyLibraryPage   = lazy(() => import('./pages/StudyLibraryPage'));
const CareersPageNew     = lazy(() => import('./pages/CareersPageNew'));
const BursariesPage      = lazy(() => import('./pages/BursariesPage'));
const BursaryDetailPage  = lazy(() => import('./pages/BursaryDetailPage'));
const QuizPage           = lazy(() => import('./pages/QuizPage'));
const MapPage            = lazy(() => import('./pages/MapPage'));
const TVETPage           = lazy(() => import('./pages/TVETPage'));
const TVETCareersPage    = lazy(() => import('./pages/TVETCareersPage'));
const TVETCollegesPage   = lazy(() => import('./pages/TVETCollegesPage'));
const TVETFundingPage    = lazy(() => import('./pages/TVETFundingPage'));
const TVETRequirementsPage = lazy(() => import('./pages/TVETRequirementsPage'));
const CalendarPageNew    = lazy(() => import('./pages/CalendarPageNew'));
const SchoolAssistPage   = lazy(() => import('./pages/SchoolAssistPage'));
const ImpactAuthPage     = lazy(() => import('./pages/ImpactAuthPage'));
const DemoLearningPage   = lazy(() => import('./pages/DemoLearningPage'));
const CommunityImpactPage = lazy(() => import('./pages/CommunityImpactPage'));
const PotholeMapPage     = lazy(() => import('./pages/PotholeMapPage'));
const FlagPotholePage    = lazy(() => import('./pages/FlagPotholePage'));
const MyContributionsPage = lazy(() => import('./pages/MyContributionsPage'));
const WaterDashboardPage = lazy(() => import('./pages/WaterDashboardPage'));
const APSCalculatorPage  = lazy(() => import('./pages/APSCalculatorPage'));
const SchoolAssistChatPage = lazy(() => import('./pages/SchoolAssistChatPage'));
// NewsPage removed — SA News feature discontinued
const TaxBudgetPage      = lazy(() => import('./pages/TaxBudgetPage'));
const CostOfLivingPage   = lazy(() => import('./pages/CostOfLivingPage'));
const CivicsPage         = lazy(() => import('./pages/CivicsPage'));
import LoadingScreen from './components/LoadingScreen';
import type { AppPage } from './lib/withAuth';

type Page = AppPage;

// ── Animated Nav ──────────────────────────────────────────────────────────────

const EXPAND_SCROLL_THRESHOLD = 80;

// No variant objects — animations driven inline per element

const AnimatedNav = ({ onNavigate, user }: { onNavigate: (page: Page) => void, user: User | null }) => {
  const [isExpanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const scrollPositionOnCollapse = useRef(0);

  const navItems = [
    { name: 'Career Guide', page: 'quiz' as Page },
    { name: 'School Assist', page: user && !user.is_anonymous ? 'dashboard' as Page : 'auth' as Page },
    { name: 'Community', page: 'community-impact' as Page },
  ];

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

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) { e.preventDefault(); setExpanded(true); }
  };

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[120]">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1, width: isExpanded ? 'auto' : '3rem' }}
          transition={{ y: { duration: 0.4, ease: 'easeOut' }, opacity: { duration: 0.3 }, width: { type: 'spring', damping: 28, stiffness: 260 } }}
          whileHover={!isExpanded ? { scale: 1.08 } : {}}
          whileTap={!isExpanded ? { scale: 0.95 } : {}}
          onClick={handleNavClick}
          className={`flex items-center overflow-hidden rounded-full border border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm h-12 ${!isExpanded ? 'cursor-pointer justify-center' : ''}`}
        >
          <motion.div
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            className="shrink-0 flex items-center font-black pl-4 pr-2 gap-2"
          >
            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white font-black text-xs">P</div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-900 hidden sm:block">Prospect</span>
          </motion.div>

          <motion.div
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            className={`flex items-center gap-1 sm:gap-3 pr-4 ${!isExpanded ? 'pointer-events-none' : ''}`}
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={(e) => { e.stopPropagation(); onNavigate(item.page); }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 whitespace-nowrap"
              >
                {item.name}
              </button>
            ))}
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ opacity: isExpanded ? 0 : 1 }}
              transition={{ duration: 0.18 }}
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </motion.div>
          </div>
        </motion.nav>
      </div>

      {/* Mobile drawer for smaller screens when nav is expanded */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-110 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed top-0 right-0 h-full w-72 bg-white z-120 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <span className="font-black text-sm uppercase text-slate-900" style={{ letterSpacing: '0.18em' }}>Prospect</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-4">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => { setMobileOpen(false); onNavigate(item.page); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-left text-sm font-semibold text-slate-700 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Tutorial Dialog ───────────────────────────────────────────────────────────

const TUTORIAL_STEPS = [
  {
    title: "Welcome to Prospect SA",
    description: "Your free, all-in-one platform for career discovery, academic support, and civic awareness — built for South African students. Everything you need to plan, study, and succeed is right here.",
    icon: <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-4xl mx-auto mb-6">P</div>,
  },
  {
    title: "Discover Your Career",
    description: "Take our free RIASEC career quiz to find careers that match your personality and interests. Browse 400+ SA careers with salary data, APS requirements, university pathways, bursaries, and a job demand map by province.",
    icon: <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6"><Compass className="w-10 h-10 text-slate-700" /></div>,
  },
  {
    title: "School Assist",
    description: "Your personal study hub. Access curriculum-aligned content for Grades 10–12, stay on top of SA school terms and exam dates, and build a personalised study schedule — all behind a free account.",
    icon: <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6"><BookOpen className="w-10 h-10 text-slate-700" /></div>,
  },
  {
    title: "Community & Civic Hub",
    description: "Stay informed and make your community's voice count. Flag potholes, track water outages, explore tax & budget explainers, cost-of-living tools, and civics content. Help build a national opportunity map.",
    icon: <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6"><Newspaper className="w-10 h-10 text-slate-700" /></div>,
  },
];

const TutorialDialog = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const handleClose = () => { setOpen(false); setStep(0); };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          className="fixed bottom-6 right-6 z-[115] flex items-center gap-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full shadow-xl hover:bg-slate-700 transition-colors"
          aria-label="How it works"
        >
          <HelpCircle className="w-4 h-4" />
          How it works
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[201] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[201] w-full -translate-x-1/2 -translate-y-1/2 gap-4 border border-slate-200 bg-white p-10 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-[640px] rounded-2xl">

          {/* Close button */}
          <DialogPrimitive.Close className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors outline-none">
            <Cross2Icon width={16} height={16} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="text-center"
            >
              {TUTORIAL_STEPS[step].icon}
              <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                {TUTORIAL_STEPS[step].title}
              </h2>
              <p className="text-base text-slate-500 leading-relaxed max-w-md mx-auto">
                {TUTORIAL_STEPS[step].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-8">
            {TUTORIAL_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-200'}`}
              />
            ))}
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleClose}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
            >
              Skip
            </button>
            <button
              onClick={() => {
                if (step < TUTORIAL_STEPS.length - 1) setStep(step + 1);
                else handleClose();
              }}
              className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-slate-700 transition-colors"
            >
              {step < TUTORIAL_STEPS.length - 1 ? 'Next' : 'Get Started'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

// ── Features Section ──────────────────────────────────────────────────────────

const FeaturesSection = ({ onNavigate, user }: { onNavigate: (page: Page) => void, user: User | null }) => {
  const features = [
    {
      icon: <Users className="w-7 h-7 text-slate-700" />,
      title: "Community",
      description: "Flag potholes, track water outages, explore tax & budget explainers, cost-of-living tools, civics content, and help build a national opportunity map.",
      cta: "Get Involved",
      page: 'community-impact' as Page,
    },
    {
      icon: <BookOpen className="w-7 h-7 text-slate-700" />,
      title: "School Assist",
      description: "Your personal study hub. Access curriculum-aligned content for Grades 10–12, track school terms, and plan your study schedule.",
      cta: user && !user.is_anonymous ? "Go to Dashboard" : "Start Learning",
      page: user && !user.is_anonymous ? 'dashboard' as Page : 'auth' as Page,
    },
    {
      icon: <Briefcase className="w-7 h-7 text-slate-700" />,
      title: "Careers",
      description: "Explore 400+ South African careers. Take our RIASEC quiz, find bursaries, check APS requirements, and map your path forward.",
      cta: "Explore Careers",
      page: 'quiz' as Page,
    },
  ];

  return (
    <section className="py-20 px-4 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">What We Offer</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
            Everything you need to thrive.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => onNavigate(f.page)}
              className="group flex flex-col items-center text-center bg-white border border-slate-200 rounded-2xl p-8 cursor-pointer hover:shadow-xl hover:border-slate-300 transition-all duration-300 relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-2xl" />

              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-5 group-hover:bg-slate-100 transition-colors">
                {f.icon}
              </div>

              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-3">
                {f.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-6">
                {f.description}
              </p>

              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 transition-colors inline-flex items-center gap-1.5">
                {f.cta}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Lamp Section ──────────────────────────────────────────────────────────────

const LampSection = () => {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-[#0f172a] w-full">
      {/* Lamp effect */}
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{ backgroundImage: 'conic-gradient(var(--conic-position), var(--tw-gradient-stops))' }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-slate-400 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-full left-0 bg-[#0f172a] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-full left-0 bg-[#0f172a] bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{ backgroundImage: 'conic-gradient(var(--conic-position), var(--tw-gradient-stops))' }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-slate-400 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-40 h-full right-0 bg-[#0f172a] bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-full right-0 bg-[#0f172a] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-[#0f172a] blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-slate-300 opacity-20 blur-3xl" />
        <motion.div
          initial={{ width: '8rem' }}
          whileInView={{ width: '16rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-slate-200 blur-2xl opacity-30"
        />
        <motion.div
          initial={{ width: '15rem' }}
          whileInView={{ width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-slate-300 opacity-60"
        />
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-[#0f172a]" />
      </div>

      {/* Content */}
      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Mandela quote */}
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-6">
            Nelson Mandela
          </p>
          <blockquote className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}>
            "Education is the most powerful weapon which you can use to change the world."
          </blockquote>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Arm yourself with the knowledge and tools to empower yourself through life.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// ── Career Guide Section ──────────────────────────────────────────────────────

const CareerGuideSection = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const tools = [
    { icon: <Compass className="w-5 h-5" />, title: 'RIASEC Career Quiz', desc: 'Answer 42 questions and get matched to careers that fit your personality and interests.', cta: 'Take the Quiz', page: 'quiz' as Page },
    { icon: <Briefcase className="w-5 h-5" />, title: 'Career Browser', desc: 'Browse 200+ SA careers with salary ranges, APS requirements, and university pathways.', cta: 'Explore Careers', page: 'careers' as Page },
    { icon: <GraduationCap className="w-5 h-5" />, title: 'TVET Pathways', desc: 'Discover vocational careers and the 50 public TVET colleges across all SA provinces.', cta: 'Explore TVET', page: 'tvet' as Page },
    { icon: <Award className="w-5 h-5" />, title: 'Bursary Finder', desc: '200+ bursaries searchable by career field and province. Includes NSFAS eligibility check.', cta: 'Find Funding', page: 'bursaries' as Page },
    { icon: <MapPin className="w-5 h-5" />, title: 'Job Demand Map', desc: 'See which careers are in demand by province and where employers are hiring across SA.', cta: 'View Map', page: 'map' as Page },
    { icon: <Target className="w-5 h-5" />, title: 'APS Calculator', desc: 'Enter your report card marks and see which careers and universities you qualify for.', cta: 'Calculate APS', page: 'quiz' as Page },
  ];

  return (
    <section className="py-20 px-4 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">No sign-in required</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Career Guide</h2>
            <p className="text-slate-500 text-lg leading-relaxed mt-4 max-w-lg">
              Discover the right career path, understand how to get there, and find the funding to make it happen.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('quiz')}
            className="inline-flex items-center gap-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest px-7 py-3.5 rounded-full shadow-lg hover:bg-slate-700 transition-all shrink-0"
          >
            Start Career Quiz <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool, i) => (
            <motion.button
              key={tool.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              whileHover={{ y: -5 }}
              onClick={() => onNavigate(tool.page)}
              className="group flex flex-col items-start text-left p-7 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-5 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                {tool.icon}
              </div>
              <h3 className="font-black text-slate-900 text-sm mb-2 tracking-tight">{tool.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed flex-1">{tool.desc}</p>
              <span className="mt-5 text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors inline-flex items-center gap-1.5">
                {tool.cta} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── How It Works ──────────────────────────────────────────────────────────────

const HowItWorks = () => {
  const steps = [
    { number: 1, title: 'Take the Career Quiz', desc: 'Answer our RIASEC quiz questions about your interests and strengths to discover which career paths suit your personality best.' },
    { number: 2, title: 'Explore Your Options', desc: 'Browse 400+ South African careers with salary data, job demand by province, university requirements, and TVET pathways.' },
    { number: 3, title: 'Secure Your Future', desc: 'Find bursaries and scholarships that match your field, then use our study resources to achieve the marks you need.' },
  ];

  return (
    <section className="py-16 bg-slate-50 sm:py-20 border-b border-slate-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">How does it work?</h2>
          <p className="max-w-lg mx-auto mt-4 text-sm text-slate-500 leading-relaxed">
            From discovering your ideal career to securing funding and acing your exams — Prospect guides you every step of the way.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-20">
          <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
            <img className="w-full" src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg" alt="" aria-hidden="true" />
          </div>
          <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className="flex items-center justify-center w-14 h-14 mx-auto bg-slate-900 rounded-full shadow-lg">
                  <span className="text-lg font-black text-white">{step.number}</span>
                </div>
                <h3 className="mt-6 text-base font-black text-slate-900 md:mt-10 tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Discovery Grid ────────────────────────────────────────────────────────────

const DiscoveryGrid = () => {
  const items = [
    { webp: '/images/engineer.webp', jpg: '/images/engineer.jpg', title: 'Engineering', description: 'Build the future of SA infrastructure' },
    { webp: '/images/nurse.webp', jpg: '/images/nurse.jpg', title: 'Healthcare', description: 'Care for communities across the country' },
    { webp: '/images/teacher.webp', jpg: '/images/teacher.jpg', title: 'Education', description: 'Shape the next generation of leaders' },
    { webp: '/images/electrician.webp', jpg: '/images/electrician.jpg', title: 'Trades & Technical', description: 'High-demand skills SA needs now' },
    { webp: '/images/students.webp', jpg: '/images/students.jpg', title: 'Keep Learning', description: 'Your journey starts with the right knowledge' },
  ];

  return (
    <section className="py-20 px-4 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Career Library</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Explore Top SA Careers</h2>
          <p className="text-slate-500 text-base mt-4 max-w-xl mx-auto">
            Learn about salary ranges, job demand, and entry requirements for South Africa's most popular career paths.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[3/4] shadow-sm hover:shadow-xl transition-shadow duration-300 will-change-transform"
            >
              <picture>
                <source srcSet={item.webp} type="image/webp" />
                <img
                  src={item.jpg} alt={item.title}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  decoding="async" width={400} height={533}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-black text-sm lg:text-base leading-tight uppercase tracking-wide">{item.title}</h3>
                <p className="text-white/70 text-xs mt-1.5 leading-snug hidden sm:block">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Footer ────────────────────────────────────────────────────────────────────

const Footer = ({ onNavigate, user }: { onNavigate: (page: Page) => void, user: User | null }) => {
  const isAuth = user && !user.is_anonymous;
  const sections = [
    {
      title: 'Career Guide',
      links: [
        { label: 'Career Quiz', page: 'quiz' }, { label: 'Explore Careers', page: 'careers' },
        { label: 'TVET Pathways', page: 'tvet' }, { label: 'Bursary Finder', page: 'bursaries' }, { label: 'Job Map', page: 'map' },
      ],
    },
    {
      title: 'School Assist',
      links: [
        { label: isAuth ? 'Dashboard' : 'Sign In / Register', page: isAuth ? 'dashboard' : 'auth' }, 
        { label: 'Study Library', page: isAuth ? 'library' : 'auth' },
        { label: 'School Calendar', page: isAuth ? 'calendar' : 'auth' }, 
        { label: 'Grade 10 Tools', page: 'subject-selector' },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'Community Impact', page: 'community-impact' }, { label: 'Pothole Map', page: 'pothole-map' },
        { label: 'Water Dashboard', page: 'water-dashboard' }, { label: 'Tax & Budget', page: 'tax-budget' },
        { label: 'Cost of Living', page: 'cost-of-living' }, { label: 'Civics', page: 'civics' },
      ],
    },
  ];

  return (
    <footer className="bg-white text-slate-500 py-20 px-4 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-sm">P</div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">Prospect</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-8">
              Prospect is South Africa's leading free platform for career discovery and independent learning. We help students navigate their future with data-driven guidance and curriculum-aligned resources.
            </p>
            <div className="flex gap-4">
              {[{ icon: <Facebook size={18} />, label: 'Facebook' }, { icon: <Instagram size={18} />, label: 'Instagram' }, { icon: <Twitter size={18} />, label: 'Twitter' }].map((social, i) => (
                <button key={i} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300" aria-label={social.label}>
                  {social.icon}
                </button>
              ))}
            </div>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button onClick={() => onNavigate(link.page as Page)} className="text-sm text-slate-500 hover:text-slate-900 transition-colors text-left">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-slate-400 text-xs">© 2026 Prospect South Africa. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('home')} className="text-slate-400 hover:text-slate-900 text-xs transition-colors">Accessibility</button>
            <button onClick={() => onNavigate('home')} className="text-slate-400 hover:text-slate-900 text-xs transition-colors">Cookie Settings</button>
            <button onClick={() => onNavigate('home')} className="text-slate-400 hover:text-slate-900 text-xs transition-colors">South Africa (EN)</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────────

const PageTransition = ({ children, pageKey }: { children: ReactNode; pageKey: string }) => (
  <motion.div
    key={pageKey}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);

  useEffect(() => {
    // Preload images in the background — doesn't control when loading screen ends
    const images = ['/images/engineer.webp', '/images/nurse.webp', '/images/teacher.webp', '/images/electrician.webp', '/images/students.webp'];
    images.forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  const navigate = (p: Page) => setPage(p);
  const handleSignOut = async () => { await supabase.auth.signOut(); setUser(null); setPage('home'); };

  useEffect(() => { runMigrations(); }, []);

  useEffect(() => {
    const isTestMode =
      (window as any).__PLAYWRIGHT_TEST__ ||
      sessionStorage.getItem('__test_mode__') === 'true' ||
      localStorage.getItem('__playwright_test_mode__') ||
      new URLSearchParams(window.location.search).get('__test_mode') === 'true';

    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');

    if (isTestMode && pageParam) {
      setPage(pageParam as Page);
      setUser({ id: 'test-user-' + Math.random().toString(36).substr(2, 9), email: 'test@example.com', email_confirmed_at: new Date().toISOString(), phone: null, last_sign_in_at: new Date().toISOString(), app_metadata: { provider: 'email', providers: ['email'] }, user_metadata: { name: 'Test User' }, identities: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), is_anonymous: false } as any);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user); syncUserDataOnLogin(session.user.id); startBackgroundSync(session.user.id);
        if (pageParam) setPage(pageParam as Page); else setPage('dashboard');
      } else {
        const restored = await restoreSessionFromStorage();
        if (restored?.user) {
          setUser(restored.user as any); syncUserDataOnLogin(restored.user.id); startBackgroundSync(restored.user.id);
          if (pageParam) setPage(pageParam as Page); else setPage('dashboard');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) { syncUserDataOnLogin(session.user.id); startBackgroundSync(session.user.id); }
      else { stopBackgroundSync(); setPage('home'); }
    });

    return () => { subscription.unsubscribe(); stopBackgroundSync(); };
  }, []);

  const protectedPageProps = { onNavigateAuth: () => setPage('home'), onSignOut: handleSignOut, onNavigate: navigate };
  const careerPageProps = { onNavigateAuth: () => setPage('auth'), onSignOut: handleSignOut, onNavigate: navigate, guestMode: true };

  return (
    <>
      <AnimatePresence>
        {!isAssetsLoaded && <LoadingScreen onComplete={() => setIsAssetsLoaded(true)} />}
      </AnimatePresence>

      {isAssetsLoaded && (
        <div className="relative min-h-screen bg-white">
          <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-6 h-6 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" /></div>}>
            <AnimatePresence mode="wait">

              {page === 'auth' && <PageTransition pageKey="auth"><AuthPage onNavigateHome={() => setPage('home')} onAuthSuccess={(u) => { setUser(u); setPage('dashboard'); }} /></PageTransition>}
              {page === 'dashboard' && <PageTransition pageKey="dashboard"><DashboardPage {...protectedPageProps} /></PageTransition>}
              {page === 'careers' && <PageTransition pageKey="careers"><CareersPageNew {...careerPageProps} /></PageTransition>}
              {page === 'quiz' && <PageTransition pageKey="quiz"><QuizPage {...careerPageProps} /></PageTransition>}
              {page === 'bursaries' && <PageTransition pageKey="bursaries"><BursariesPage {...careerPageProps} /></PageTransition>}
              {page === 'bursary' && <PageTransition pageKey="bursary"><BursaryDetailPage {...careerPageProps} /></PageTransition>}
              {page === 'map' && <PageTransition pageKey="map"><MapPage {...careerPageProps} /></PageTransition>}
              {page === 'tvet' && <PageTransition pageKey="tvet"><TVETPage {...careerPageProps} /></PageTransition>}
              {page === 'tvet-careers' && <PageTransition pageKey="tvet-careers"><TVETCareersPage {...careerPageProps} /></PageTransition>}
              {page === 'tvet-colleges' && <PageTransition pageKey="tvet-colleges"><TVETCollegesPage {...careerPageProps} /></PageTransition>}
              {page === 'tvet-funding' && <PageTransition pageKey="tvet-funding"><TVETFundingPage {...careerPageProps} /></PageTransition>}
              {page === 'tvet-requirements' && <PageTransition pageKey="tvet-requirements"><TVETRequirementsPage {...careerPageProps} /></PageTransition>}
              {page === 'subject-selector' && <PageTransition pageKey="subject-selector"><Grade10SubjectSelectorPage {...careerPageProps} /></PageTransition>}
              {page === 'library' && <PageTransition pageKey="library"><StudyLibraryPage {...protectedPageProps} /></PageTransition>}
              {page === 'calendar' && <PageTransition pageKey="calendar"><CalendarPageNew {...protectedPageProps} /></PageTransition>}
              {page === 'school-assist' && <PageTransition pageKey="school-assist"><SchoolAssistPage onNavigate={navigate} onNavigateHome={() => setPage('home')} /></PageTransition>}
              {page === 'school-assist-chat' && <PageTransition pageKey="school-assist-chat"><SchoolAssistChatPage onNavigate={navigate} onNavigateHome={() => setPage('home')} /></PageTransition>}
              {page === 'aps-calculator' && <PageTransition pageKey="aps-calculator"><APSCalculatorPage onNavigate={navigate} onNavigateHome={() => setPage('home')} /></PageTransition>}
              {page === 'impact-auth' && <PageTransition pageKey="impact-auth"><ImpactAuthPage onNavigateHome={() => setPage('home')} onNavigate={navigate} /></PageTransition>}
              {page === 'demo-learning' && <PageTransition pageKey="demo-learning"><DemoLearningPage {...protectedPageProps} /></PageTransition>}
              {page === 'community-impact' && <PageTransition pageKey="community-impact"><CommunityImpactPage {...careerPageProps} /></PageTransition>}
              {page === 'pothole-map' && <PageTransition pageKey="pothole-map"><PotholeMapPage {...careerPageProps} /></PageTransition>}
              {page === 'flag-pothole' && <PageTransition pageKey="flag-pothole"><FlagPotholePage {...protectedPageProps} /></PageTransition>}
              {page === 'my-pothole-contributions' && <PageTransition pageKey="my-pothole-contributions"><MyContributionsPage {...protectedPageProps} /></PageTransition>}
              {page === 'water-dashboard' && <PageTransition pageKey="water-dashboard"><WaterDashboardPage {...protectedPageProps} /></PageTransition>}

              {page === 'tax-budget' && <PageTransition pageKey="tax-budget"><TaxBudgetPage {...careerPageProps} /></PageTransition>}
              {page === 'cost-of-living' && <PageTransition pageKey="cost-of-living"><CostOfLivingPage {...careerPageProps} /></PageTransition>}
              {page === 'civics' && <PageTransition pageKey="civics"><CivicsPage {...careerPageProps} /></PageTransition>}

              {page === 'home' && (
                <PageTransition pageKey="home">
                  <div className="relative">
                    <AnimatedNav onNavigate={setPage} user={user} />
                    <TutorialDialog />
                    <main id="main-content">
                      <AnimatedHero onNavigate={(p) => setPage(p as Page)} />
                      <FeaturesSection onNavigate={setPage} user={user} />
                      <LogoCloud />
                      <CareerGuideSection onNavigate={setPage} />
                      <HowItWorks />
                      <DiscoveryGrid />
                      <LampSection />
                    </main>
                    <Footer onNavigate={setPage} user={user} />
                  </div>
                </PageTransition>
              )}

            </AnimatePresence>
          </Suspense>
        </div>
      )}
    </>
  );
}
