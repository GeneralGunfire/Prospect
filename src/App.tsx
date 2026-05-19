import { useState, useEffect, type ReactNode, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { restoreSessionFromStorage } from './lib/auth';
import { runMigrations } from './utils/migrationScript';
import { syncUserDataOnLogin, startBackgroundSync, stopBackgroundSync } from './services/supabaseSync';
import { Hero as AnimatedHero } from './components/marketing/animated-hero';
import { LogoCloud } from './components/marketing/logo-cloud-2';
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
  Zap,
} from 'lucide-react';

// Lazy-load all page-level components
const AuthPage           = lazy(() => import('./pages/auth/AuthPage'));
const DashboardPage      = lazy(() => import('./pages/school/DashboardPage'));
const StudyLibraryPage   = lazy(() => import('./pages/school/StudyLibraryPage'));
const CalendarPageNew    = lazy(() => import('./pages/school/CalendarPageNew'));
const SchoolAssistPage   = lazy(() => import('./pages/school/SchoolAssistPage'));
const SchoolAssistChatPage = lazy(() => import('./pages/school/SchoolAssistChatPage'));
const CareersPageNew     = lazy(() => import('./pages/careers/CareersPageNew'));
const BursariesPage      = lazy(() => import('./pages/careers/BursariesPage'));
const BursaryDetailPage  = lazy(() => import('./pages/careers/BursaryDetailPage'));
const QuizPage           = lazy(() => import('./pages/careers/QuizPage'));
const MapPage            = lazy(() => import('./pages/careers/MapPage'));
const TVETPage           = lazy(() => import('./pages/tvet/TVETPage'));
const TVETCareersPage    = lazy(() => import('./pages/tvet/TVETCareersPage'));
const TVETCollegesPage   = lazy(() => import('./pages/tvet/TVETCollegesPage'));
const TVETFundingPage    = lazy(() => import('./pages/tvet/TVETFundingPage'));
const TVETRequirementsPage = lazy(() => import('./pages/tvet/TVETRequirementsPage'));
const LinearEquationsPage = lazy(() => import('./pages/learning/Algebra/Grade10/Term1/LinearEquations'));
const SimultaneousEquationsPage = lazy(() => import('./pages/learning/Algebra/Grade10/Term1/SimultaneousEquations'));
const WavesSoundLightPage = lazy(() => import('./pages/learning/PhysicalSciences/Grade10/Term1/WavesSoundLight'));
const AtomsSubatomicParticlesPage = lazy(() => import('./pages/learning/PhysicalSciences/Grade10/Term1/AtomsSubatomicParticles'));
const ClassificationOfMatterPage = lazy(() => import('./pages/learning/PhysicalSciences/Grade10/Term1/ClassificationOfMatter'));
const PeriodicTableTrendsPage = lazy(() => import('./pages/learning/PhysicalSciences/Grade10/Term1/PeriodicTableTrends'));
const ChemicalBondingPage = lazy(() => import('./pages/learning/PhysicalSciences/Grade10/Term1/ChemicalBonding'));
const BiodiversityAndClassificationPage = lazy(() => import('./pages/learning/LifeSciences/Grade10/Term1/BiodiversityAndClassification'));
const FiveKingdomsPage = lazy(() => import('./pages/learning/LifeSciences/Grade10/Term1/FiveKingdoms'));
const TaxonomyAndBinomialNomenclaturePage = lazy(() => import('./pages/learning/LifeSciences/Grade10/Term1/TaxonomyAndBinomialNomenclature'));
const SpeciesConceptPage = lazy(() => import('./pages/learning/LifeSciences/Grade10/Term1/SpeciesConcept'));
const IntroductionToAccountingPage = lazy(() => import('./pages/learning/Accounting/Grade10/Term1/IntroductionToAccounting'));
const AccountingEquationPage = lazy(() => import('./pages/learning/Accounting/Grade10/Term1/AccountingEquation'));
const DoubleEntrySystemPage = lazy(() => import('./pages/learning/Accounting/Grade10/Term1/DoubleEntrySystem'));
const SourceDocumentsPage = lazy(() => import('./pages/learning/Accounting/Grade10/Term1/SourceDocuments'));
const JournalsInAccountingPage = lazy(() => import('./pages/learning/Accounting/Grade10/Term1/JournalsInAccounting'));
const GeneralLedgerPage = lazy(() => import('./pages/learning/Accounting/Grade10/Term1/GeneralLedger'));
const BusinessEnvironmentPage = lazy(() => import('./pages/learning/BusinessStudies/Grade10/Term1/BusinessEnvironment'));
const BusinessSectorsPage = lazy(() => import('./pages/learning/BusinessStudies/Grade10/Term1/BusinessSectors'));
const BusinessStakeholdersPage = lazy(() => import('./pages/learning/BusinessStudies/Grade10/Term1/BusinessStakeholders'));
const BusinessOperationsPage = lazy(() => import('./pages/learning/BusinessStudies/Grade10/Term1/BusinessOperations'));
const EconomicProblemPage = lazy(() => import('./pages/learning/Economics/Grade10/Term1/EconomicProblem'));
const ProductionPossibilityCurvePage = lazy(() => import('./pages/learning/Economics/Grade10/Term1/ProductionPossibilityCurve'));
const EconomicSystemsPage = lazy(() => import('./pages/learning/Economics/Grade10/Term1/EconomicSystems'));
const CircularFlowModelPage = lazy(() => import('./pages/learning/Economics/Grade10/Term1/CircularFlowModel'));
const FactorsOfProductionPage = lazy(() => import('./pages/learning/Economics/Grade10/Term1/FactorsOfProduction'));
const ComputerSystemsPage = lazy(() => import('./pages/learning/CAT/Grade10/Term1/ComputerSystems'));
const FileManagementPage = lazy(() => import('./pages/learning/CAT/Grade10/Term1/FileManagement'));
const WordProcessingPage = lazy(() => import('./pages/learning/CAT/Grade10/Term1/WordProcessing'));
const SpreadsheetsPage = lazy(() => import('./pages/learning/CAT/Grade10/Term1/Spreadsheets'));
const DrawingInstrumentsPage = lazy(() => import('./pages/learning/EGD/Grade10/Term1/DrawingInstruments'));
const WaterDashboardPage = lazy(() => import('./pages/community/WaterDashboardPage'));
// NewsPage removed — SA News feature discontinued
const TaxBudgetPage      = lazy(() => import('./pages/community/TaxBudgetPage'));
const CostOfLivingPage   = lazy(() => import('./pages/community/CostOfLivingPage'));
const CivicsPage         = lazy(() => import('./pages/community/CivicsPage'));
const CommunityImpactPage = lazy(() => import('./pages/community/CommunityPage'));
const LoadSheddingPage   = lazy(() => import('./pages/community/LoadSheddingPage'));
const MatricExamDatesPage = lazy(() => import('./pages/school/MatricExamDatesPage'));
const ImpactAuthPage     = lazy(() => import('./pages/auth/ImpactAuthPage'));
import LoadingScreen from './components/shell/LoadingScreen';
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
    { name: 'Community', page: 'community' as Page },
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
                className="text-[13px] font-bold text-slate-600 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 whitespace-nowrap"
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
              className="fixed top-0 right-0 h-full w-72 bg-white z-120 flex flex-col"
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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-left text-[14px] font-bold text-slate-700 transition-colors"
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
    icon: <div className="w-20 h-20 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-4xl mx-auto mb-6">P</div>,
  },
  {
    title: "Discover Your Career",
    description: "Take our free RIASEC career quiz to find careers that match your personality and interests. Browse 400+ SA careers with salary data, APS requirements, university pathways, bursaries, and a job demand map by province.",
    icon: <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-6"><Compass className="w-10 h-10 text-slate-700" /></div>,
  },
  {
    title: "School Assist",
    description: "Your personal study hub. Access curriculum-aligned content for Grades 10–12, stay on top of SA school terms and exam dates, and build a personalised study schedule — all behind a free account.",
    icon: <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-6"><BookOpen className="w-10 h-10 text-slate-700" /></div>,
  },
  {
    title: "Community & Civic Hub",
    description: "Stay informed and make your community's voice count. Track water outages, explore tax & budget explainers, cost-of-living tools, and civics content.",
    icon: <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-6"><Newspaper className="w-10 h-10 text-slate-700" /></div>,
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
          className="fixed bottom-6 right-6 z-[115] flex items-center gap-2 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="How it works"
        >
          <HelpCircle className="w-4 h-4" />
          How it works
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[201] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[201] w-full -translate-x-1/2 -translate-y-1/2 gap-4 border border-slate-200 bg-white p-10 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-[640px] rounded-xl">

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
              <p className="text-[15px] text-slate-500 leading-[1.65] max-w-md mx-auto">
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
              className="text-[13px] text-slate-400 hover:text-slate-600 font-bold transition-colors"
            >
              Skip
            </button>
            <button
              onClick={() => {
                if (step < TUTORIAL_STEPS.length - 1) setStep(step + 1);
                else handleClose();
              }}
              className="flex items-center gap-1.5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
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
  const isAuth = user && !user.is_anonymous;

  const features = [
    { icon: <Compass className="w-5 h-5" />, title: "Career Guide", sub: "Quiz, careers, bursaries, job map", page: 'quiz' as Page },
    { icon: <BookOpen className="w-5 h-5" />, title: "School Assist", sub: "Study library, AI tutor, calendar", page: isAuth ? 'dashboard' as Page : 'auth' as Page },
    { icon: <GraduationCap className="w-5 h-5" />, title: "TVET", sub: "Trade careers, 26 colleges, funding", page: 'tvet' as Page },
    { icon: <Users className="w-5 h-5" />, title: "Community", sub: "Utilities, costs, civics, impact", page: 'community' as Page },
  ];

  return (
    <section className="py-24 lg:py-36 px-4 sm:px-6 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 lg:mb-20"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-5">Four pillars</p>
          <h2
            className="font-black text-slate-900 max-w-2xl"
            style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)", lineHeight: 1.05, letterSpacing: '-0.03em' }}
          >
            Everything a South African student needs.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              onClick={() => onNavigate(f.page)}
              className="group flex flex-col bg-white p-6 sm:p-8 lg:p-10 cursor-pointer hover:bg-slate-900 transition-colors duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors duration-300 shrink-0 text-slate-500 group-hover:text-white">
                {f.icon}
              </div>
              <p className="font-black text-slate-900 group-hover:text-white text-[1rem] leading-tight mb-2 transition-colors duration-300" style={{ letterSpacing: '-0.015em' }}>
                {f.title}
              </p>
              <p className="text-[13px] text-slate-400 group-hover:text-white/50 leading-snug transition-colors duration-300">
                {f.sub}
              </p>
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
    <section className="relative flex min-h-[60vh] sm:min-h-[75vh] flex-col items-center justify-center overflow-hidden bg-[#0f172a] w-full py-20 sm:py-28">
      {/* Lamp glow — purely decorative, sits at the top */}
      <div className="absolute top-0 left-0 right-0 h-64 sm:h-80 flex items-start justify-center isolate pointer-events-none">
        <motion.div
          initial={{ opacity: 0.5, width: '10rem' }}
          whileInView={{ opacity: 1, width: '20rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{ backgroundImage: 'conic-gradient(var(--conic-position), var(--tw-gradient-stops))' }}
          className="absolute inset-auto right-1/2 h-48 overflow-visible w-[20rem] bg-gradient-conic from-slate-400 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-full left-0 bg-[#0f172a] h-32 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-32 h-full left-0 bg-[#0f172a] bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: '10rem' }}
          whileInView={{ opacity: 1, width: '20rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{ backgroundImage: 'conic-gradient(var(--conic-position), var(--tw-gradient-stops))' }}
          className="absolute inset-auto left-1/2 h-48 w-[20rem] bg-gradient-conic from-transparent via-transparent to-slate-400 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-32 h-full right-0 bg-[#0f172a] bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-full right-0 bg-[#0f172a] h-32 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute inset-auto z-50 h-36 w-64 sm:w-md rounded-full bg-slate-300 opacity-10 blur-3xl top-0" />
        <motion.div
          initial={{ width: '6rem' }}
          whileInView={{ width: '12rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-30 h-24 rounded-full bg-slate-200 blur-2xl opacity-25 top-0"
        />
        <motion.div
          initial={{ width: '10rem' }}
          whileInView={{ width: '20rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-50 h-0.5 bg-slate-300 opacity-50 top-0"
        />
      </div>

      {/* Content — centered in section */}
      <div className="relative z-10 flex flex-col items-center px-5 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <blockquote
            className="font-black text-white leading-tight mb-6 sm:mb-8"
            style={{ fontSize: "clamp(1.25rem, 4vw, 2.5rem)", letterSpacing: '-0.025em', lineHeight: 1.15 }}
          >
            "Education is the most powerful weapon which you can use to change the world."
          </blockquote>
          <footer className="flex flex-col items-center gap-1 mb-6 sm:mb-8">
            <div className="w-8 h-px bg-slate-600 mb-3" />
            <cite className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 not-italic">
              Nelson Mandela
            </cite>
          </footer>
          <p className="text-[15px] text-slate-400 leading-[1.65] max-w-md mx-auto">
            Arm yourself with the knowledge to shape your own future.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// ── What's Inside Section ─────────────────────────────────────────────────────

const CareerGuideSection = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const sections = [
    {
      eyebrow: 'No sign-in required',
      heading: 'Career Guide',
      desc: 'Discover the right path and find the funding to make it happen.',
      cta: { label: 'Start Career Quiz', page: 'quiz' as Page },
      tools: [
        { icon: <Compass className="w-4 h-4" />, title: 'RIASEC Career Quiz', page: 'quiz' as Page },
        { icon: <Briefcase className="w-4 h-4" />, title: 'Career Browser', page: 'careers' as Page },
        { icon: <Award className="w-4 h-4" />, title: 'Bursary Finder', page: 'bursaries' as Page },
        { icon: <MapPin className="w-4 h-4" />, title: 'Job Demand Map', page: 'map' as Page },
        { icon: <GraduationCap className="w-4 h-4" />, title: 'TVET Pathways', page: 'tvet' as Page },
      ],
    },
    {
      eyebrow: 'Free account required',
      heading: 'School Assist',
      desc: 'Your personal study hub for the South African matric curriculum.',
      cta: { label: 'Sign in to Access', page: 'auth' as Page },
      tools: [
        { icon: <BookOpen className="w-4 h-4" />, title: 'Study Library', page: 'library' as Page },
        { icon: <Rocket className="w-4 h-4" />, title: 'School Assist AI', page: 'school-assist-chat' as Page },
        { icon: <CalendarDays className="w-4 h-4" />, title: 'Academic Calendar', page: 'calendar' as Page },
        { icon: <Navigation className="w-4 h-4" />, title: 'Dashboard', page: 'dashboard' as Page },
      ],
    },
  ];

  return (
    <section className="py-24 lg:py-36 px-4 sm:px-6 bg-slate-50 border-y border-slate-100">
      <div className="max-w-6xl mx-auto space-y-24 lg:space-y-32">
        {sections.map((sec, si) => (
          <motion.div
            key={sec.heading}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: si * 0.05 }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start"
          >
            {/* Left: heading + desc + CTA */}
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">{sec.eyebrow}</p>
              <h2
                className="font-black text-slate-900 mb-5"
                style={{ fontSize: "clamp(1.75rem, 4.5vw, 3rem)", lineHeight: 1.05, letterSpacing: '-0.03em' }}
              >
                {sec.heading}
              </h2>
              <p className="text-[15px] text-slate-500 leading-[1.65] mb-8 max-w-[38ch]">
                {sec.desc}
              </p>
              <button
                onClick={() => onNavigate(sec.cta.page)}
                className="inline-flex items-center gap-2 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                {sec.cta.label} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right: scannable tool list */}
            <div className="divide-y divide-slate-200">
              {sec.tools.map((tool, i) => (
                <motion.button
                  key={tool.title}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                  onClick={() => onNavigate(tool.page)}
                  className="group w-full flex items-center gap-4 py-4 text-left hover:pl-2 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300">
                    {tool.icon}
                  </div>
                  <span className="font-bold text-slate-700 text-[15px] group-hover:text-slate-900 transition-colors duration-200" style={{ letterSpacing: '-0.01em' }}>
                    {tool.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-900 ml-auto shrink-0 transition-colors duration-200" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ── Community Section ─────────────────────────────────────────────────────────

const CommunitySection = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const tools = [
    { icon: <Zap className="w-4 h-4" />, title: 'Electricity Status', page: 'load-shedding' as Page },
    { icon: <Newspaper className="w-4 h-4" />, title: 'Water Dashboard', page: 'water-dashboard' as Page },
    { icon: <Award className="w-4 h-4" />, title: 'Cost of Living', page: 'cost-of-living' as Page },
    { icon: <Target className="w-4 h-4" />, title: 'Tax & Budget', page: 'tax-budget' as Page },
    { icon: <BookOpen className="w-4 h-4" />, title: 'Civics Guide', page: 'civics' as Page },
    { icon: <Users className="w-4 h-4" />, title: 'Community Impact', page: 'community' as Page },
  ];

  return (
    <section className="py-24 lg:py-36 px-4 sm:px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start"
        >
          {/* Left */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 mb-4">No sign-in required</p>
            <h2
              className="font-black text-white mb-5"
              style={{ fontSize: "clamp(1.75rem, 4.5vw, 3rem)", lineHeight: 1.05, letterSpacing: '-0.03em' }}
            >
              Community
            </h2>
            <p className="text-[15px] text-slate-400 leading-[1.65] mb-8 max-w-[38ch]">
              Understand the systems that shape your opportunities — utilities, costs, rights, and civic participation.
            </p>
            <button
              onClick={() => onNavigate('community')}
              className="inline-flex items-center gap-2 bg-white text-slate-900 text-[11px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Open Community <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: tool list */}
          <div className="divide-y divide-slate-800">
            {tools.map((tool, i) => (
              <motion.button
                key={tool.title}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                onClick={() => onNavigate(tool.page)}
                className="group w-full flex items-center gap-4 py-4 text-left hover:pl-2 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-white group-hover:text-slate-900 group-hover:border-white transition-all duration-300">
                  {tool.icon}
                </div>
                <span className="font-bold text-slate-300 text-[15px] group-hover:text-white transition-colors duration-200" style={{ letterSpacing: '-0.01em' }}>
                  {tool.title}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white ml-auto shrink-0 transition-colors duration-200" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ── How It Works ──────────────────────────────────────────────────────────────

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Find your direction',
      desc: 'Take the free RIASEC quiz. In 10 minutes you get a list of careers matched to your personality and interests — no account needed.',
    },
    {
      number: 2,
      title: 'Understand your options',
      desc: 'Dig into any career: what it pays, which provinces are hiring, what APS score you need, which university or TVET college to target, and how to fund it.',
    },
    {
      number: 3,
      title: 'Build toward it',
      desc: 'Create a free account to access the study library, track your academic calendar, use the AI tutor, and save the careers and bursaries that matter to you.',
    },
  ];

  return (
    <section className="py-24 lg:py-36 px-4 sm:px-6 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 lg:mb-20"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">How it works</p>
          <h2
            className="font-black text-slate-900"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", lineHeight: 1.05, letterSpacing: '-0.03em' }}
          >
            Three steps, one free app.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start"
            >
              <span
                className="font-black text-slate-100 mb-6 select-none"
                style={{ fontSize: "clamp(3rem, 7vw, 5rem)", lineHeight: 1, letterSpacing: "-0.04em" }}
              >
                {String(step.number).padStart(2, "0")}
              </span>
              <h3 className="font-black text-slate-900 mb-3 text-[1.0625rem]" style={{ letterSpacing: '-0.01em' }}>
                {step.title}
              </h3>
              <p className="text-[15px] text-slate-500 leading-[1.65]">
                {step.desc}
              </p>
            </motion.div>
          ))}
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
    <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 bg-slate-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-12"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">Career paths</p>
          <h2
            className="font-black text-slate-900"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", lineHeight: 1.05, letterSpacing: '-0.03em' }}
          >
            Every path has a place to start.
          </h2>
          <p className="text-[15px] text-slate-500 mt-4 leading-[1.65]" style={{ maxWidth: "42ch" }}>
            Engineering, healthcare, education, trades — explore the careers South Africa needs, with real salary and demand data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
              whileHover={{ y: -5 }}
              className="relative rounded-xl overflow-hidden cursor-pointer group aspect-4/3 sm:aspect-3/4 will-change-transform"
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
                <h3 className="font-black text-[14px] leading-tight" style={{ letterSpacing: '-0.01em' }}>{item.title}</h3>
                <p className="text-white/60 text-[12px] mt-1 leading-snug hidden sm:block">{item.description}</p>
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
        { label: 'Career Quiz', page: 'quiz' },
        { label: 'Explore Careers', page: 'careers' },
        { label: 'Bursary Finder', page: 'bursaries' },
        { label: 'Job Demand Map', page: 'map' },
        { label: 'TVET Pathways', page: 'tvet' },
      ],
    },
    {
      title: 'School Assist',
      links: [
        { label: isAuth ? 'Dashboard' : 'Sign In / Register', page: isAuth ? 'dashboard' : 'auth' },
        { label: 'Study Library', page: isAuth ? 'library' : 'auth' },
        { label: 'Academic Calendar', page: isAuth ? 'calendar' : 'auth' },
        { label: 'School Assist AI', page: 'school-assist-chat' },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'Electricity Status', page: 'load-shedding' },
        { label: 'Water Dashboard', page: 'water-dashboard' },
        { label: 'Cost of Living', page: 'cost-of-living' },
        { label: 'Tax & Budget', page: 'tax-budget' },
        { label: 'Civics Guide', page: 'civics' },
        { label: 'Community Impact', page: 'community' },
      ],
    },
  ];

  return (
    <footer className="bg-white text-slate-500 py-20 lg:py-24 px-4 sm:px-6 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-lg">P</div>
              <span className="text-xl font-black text-slate-900" style={{ letterSpacing: '-0.02em' }}>Prospect SA</span>
            </div>
            <p className="text-[15px] text-slate-500 leading-[1.65] max-w-[30ch] mb-8">
              Free career discovery, matric study support, and civic tools — built for South African students.
            </p>
            <div className="flex gap-3">
              {[{ icon: <Facebook size={16} />, label: 'Facebook' }, { icon: <Instagram size={16} />, label: 'Instagram' }, { icon: <Twitter size={16} />, label: 'Twitter' }].map((social, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all" aria-label={social.label}>
                  {social.icon}
                </button>
              ))}
            </div>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-5">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button onClick={() => onNavigate(link.page as Page)} className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors text-left">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-slate-400">© 2026 Prospect South Africa. Free, always.</p>
          <p className="text-[13px] text-slate-400">Built for Grade 10–12 students across all 9 provinces.</p>
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
  const [authChecked, setAuthChecked] = useState(false);

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
      setAuthChecked(true);
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
      setAuthChecked(true);
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

      {isAssetsLoaded && authChecked && (
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
              {page === 'library' && <PageTransition pageKey="library"><StudyLibraryPage {...protectedPageProps} /></PageTransition>}
              {page === 'calendar' && <PageTransition pageKey="calendar"><CalendarPageNew {...protectedPageProps} /></PageTransition>}
              {page === 'school-assist' && <PageTransition pageKey="school-assist"><SchoolAssistPage onNavigate={navigate} onNavigateHome={() => setPage('home')} /></PageTransition>}
              {page === 'school-assist-chat' && <PageTransition pageKey="school-assist-chat"><SchoolAssistChatPage onNavigate={navigate} onNavigateHome={() => setPage('home')} /></PageTransition>}
              {page === 'learning-algebra-g10-t1-linear-equations' && <PageTransition pageKey="learning-algebra-g10-t1-linear-equations"><LinearEquationsPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-algebra-g10-t1-simultaneous' && <PageTransition pageKey="learning-algebra-g10-t1-simultaneous"><SimultaneousEquationsPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-physci-g10-t1-waves' && <PageTransition pageKey="learning-physci-g10-t1-waves"><WavesSoundLightPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-physci-g10-t1-atoms' && <PageTransition pageKey="learning-physci-g10-t1-atoms"><AtomsSubatomicParticlesPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-physci-g10-t1-classification' && <PageTransition pageKey="learning-physci-g10-t1-classification"><ClassificationOfMatterPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-physci-g10-t1-periodic-table' && <PageTransition pageKey="learning-physci-g10-t1-periodic-table"><PeriodicTableTrendsPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-physci-g10-t1-bonding' && <PageTransition pageKey="learning-physci-g10-t1-bonding"><ChemicalBondingPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-lifesci-g10-t1-biodiversity' && <PageTransition pageKey="learning-lifesci-g10-t1-biodiversity"><BiodiversityAndClassificationPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-lifesci-g10-t1-five-kingdoms' && <PageTransition pageKey="learning-lifesci-g10-t1-five-kingdoms"><FiveKingdomsPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-lifesci-g10-t1-taxonomy' && <PageTransition pageKey="learning-lifesci-g10-t1-taxonomy"><TaxonomyAndBinomialNomenclaturePage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-lifesci-g10-t1-species' && <PageTransition pageKey="learning-lifesci-g10-t1-species"><SpeciesConceptPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-accounting-g10-t1-intro' && <PageTransition pageKey="learning-accounting-g10-t1-intro"><IntroductionToAccountingPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-accounting-g10-t1-equation' && <PageTransition pageKey="learning-accounting-g10-t1-equation"><AccountingEquationPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-accounting-g10-t1-double-entry' && <PageTransition pageKey="learning-accounting-g10-t1-double-entry"><DoubleEntrySystemPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-accounting-g10-t1-source-documents' && <PageTransition pageKey="learning-accounting-g10-t1-source-documents"><SourceDocumentsPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-accounting-g10-t1-journals' && <PageTransition pageKey="learning-accounting-g10-t1-journals"><JournalsInAccountingPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-accounting-g10-t1-ledger' && <PageTransition pageKey="learning-accounting-g10-t1-ledger"><GeneralLedgerPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-bizstudies-g10-t1-environment' && <PageTransition pageKey="learning-bizstudies-g10-t1-environment"><BusinessEnvironmentPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-bizstudies-g10-t1-sectors' && <PageTransition pageKey="learning-bizstudies-g10-t1-sectors"><BusinessSectorsPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-bizstudies-g10-t1-stakeholders' && <PageTransition pageKey="learning-bizstudies-g10-t1-stakeholders"><BusinessStakeholdersPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-bizstudies-g10-t1-operations' && <PageTransition pageKey="learning-bizstudies-g10-t1-operations"><BusinessOperationsPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-economics-g10-t1-problem' && <PageTransition pageKey="learning-economics-g10-t1-problem"><EconomicProblemPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-economics-g10-t1-ppc' && <PageTransition pageKey="learning-economics-g10-t1-ppc"><ProductionPossibilityCurvePage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-economics-g10-t1-systems' && <PageTransition pageKey="learning-economics-g10-t1-systems"><EconomicSystemsPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-economics-g10-t1-circular-flow' && <PageTransition pageKey="learning-economics-g10-t1-circular-flow"><CircularFlowModelPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-economics-g10-t1-factors' && <PageTransition pageKey="learning-economics-g10-t1-factors"><FactorsOfProductionPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-cat-g10-t1-computer-systems' && <PageTransition pageKey="learning-cat-g10-t1-computer-systems"><ComputerSystemsPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-cat-g10-t1-file-management' && <PageTransition pageKey="learning-cat-g10-t1-file-management"><FileManagementPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-cat-g10-t1-word-processing' && <PageTransition pageKey="learning-cat-g10-t1-word-processing"><WordProcessingPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-cat-g10-t1-spreadsheets' && <PageTransition pageKey="learning-cat-g10-t1-spreadsheets"><SpreadsheetsPage {...protectedPageProps} /></PageTransition>}
              {page === 'learning-egd-g10-t1-drawing-instruments' && <PageTransition pageKey="learning-egd-g10-t1-drawing-instruments"><DrawingInstrumentsPage {...protectedPageProps} /></PageTransition>}
              {page === 'water-dashboard' && <PageTransition pageKey="water-dashboard"><WaterDashboardPage onNavigate={navigate} /></PageTransition>}
              {page === 'tax-budget' && <PageTransition pageKey="tax-budget"><TaxBudgetPage onNavigate={navigate} /></PageTransition>}
              {page === 'cost-of-living' && <PageTransition pageKey="cost-of-living"><CostOfLivingPage onNavigate={navigate} /></PageTransition>}
              {page === 'civics' && <PageTransition pageKey="civics"><CivicsPage onNavigate={navigate} /></PageTransition>}
              {page === 'community' && <PageTransition pageKey="community-impact"><CommunityImpactPage onNavigate={navigate} /></PageTransition>}
              {page === 'load-shedding' && <PageTransition pageKey="load-shedding"><LoadSheddingPage onNavigate={navigate} /></PageTransition>}
              {page === 'matric-exam-dates' && <PageTransition pageKey="matric-exam-dates"><MatricExamDatesPage {...protectedPageProps} /></PageTransition>}
              {page === 'impact-auth' && <PageTransition pageKey="impact-auth"><ImpactAuthPage onNavigateHome={() => setPage('home')} onNavigate={navigate} /></PageTransition>}

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
                      <CommunitySection onNavigate={setPage} />
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
