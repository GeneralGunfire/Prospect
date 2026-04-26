import { useState, useEffect, type ReactNode, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { restoreSessionFromStorage } from './lib/auth';
import { runMigrations } from './utils/migrationScript';
import { syncUserDataOnLogin, startBackgroundSync, stopBackgroundSync } from './services/supabaseSync';
import { Hero as AnimatedHero } from '../components/ui/animated-hero';
import { LogoCloud } from '../components/ui/logo-cloud-2';
import { CategoryList } from '../components/ui/category-list';
import { NeoMinimalFooter } from '../components/ui/neo-minimal-footer';
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
  Users,
  Globe,
  Lock,
} from 'lucide-react';
// Lazy-load all page-level components to enable code splitting
const AuthPage           = lazy(() => import('./pages/AuthPage'));
const DashboardPage      = lazy(() => import('./pages/DashboardPage'));
const Grade10SubjectSelectorPage = lazy(() => import('./pages/Grade10SubjectSelectorPage'));
const StudyLibraryPage   = lazy(() => import('./pages/StudyLibraryPage'));
const CareersPageNew     = lazy(() => import('./pages/CareersPageNew'));
const BursariesPage      = lazy(() => import('./pages/BursariesPage'));
const BursaryDetailPage  = lazy(() => import('./pages/BursaryDetailPage'));
const DisadvantagedGuide = lazy(() => import('./pages/DisadvantagedGuide'));
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
const DemoLearningPage       = lazy(() => import('./pages/DemoLearningPage'));
const CommunityImpactPage    = lazy(() => import('./pages/CommunityImpactPage'));
const PotholeMapPage         = lazy(() => import('./pages/PotholeMapPage'));
const FlagPotholePage        = lazy(() => import('./pages/FlagPotholePage'));
const MyContributionsPage    = lazy(() => import('./pages/MyContributionsPage'));
const WaterDashboardPage     = lazy(() => import('./pages/WaterDashboardPage'));
const APSCalculatorPage      = lazy(() => import('./pages/APSCalculatorPage'));
const SchoolAssistChatPage   = lazy(() => import('./pages/SchoolAssistChatPage'));
const NewsPage               = lazy(() => import('./pages/NewsPage'));
const TaxBudgetPage          = lazy(() => import('./pages/TaxBudgetPage'));
const CostOfLivingPage       = lazy(() => import('./pages/CostOfLivingPage'));
const CivicsPage             = lazy(() => import('./pages/CivicsPage'));
const NewsAuthPage           = lazy(() => import('./pages/NewsAuthPage'));
import LoadingScreen from './components/LoadingScreen';
import { VideoPlayer } from './components/VideoPlayer';
import type { AppPage } from './lib/withAuth';
import {
  Menu,
  X,
  ChevronDown,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';

// --- Components ---

const InteractiveBackground = () => {
  // Static background — no continuous animations to keep scrolling smooth
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-white">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(#1e293b 0.5px, transparent 0.5px)`,
        backgroundSize: '40px 40px',
      }} />
      {/* Static colour blobs — no animation, pure CSS */}
      <div className="absolute opacity-[0.07]" style={{ top: '0%', left: '-5%', width: '50%', height: '40%', background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)', filter: 'blur(60px)', borderRadius: '50%' }} />
      <div className="absolute opacity-[0.05]" style={{ top: '15%', right: '-10%', width: '45%', height: '35%', background: 'radial-gradient(circle, rgba(79,70,229,0.5) 0%, transparent 70%)', filter: 'blur(70px)', borderRadius: '50%' }} />
    </div>
  );
};

const Header = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Career Guide', page: 'quiz' as Page, desc: 'No sign-in required', accent: 'text-blue-600', dot: 'bg-blue-500' },
    { label: 'School Assist', page: 'auth' as Page, desc: 'Sign in required', accent: 'text-indigo-600', dot: 'bg-indigo-500' },
    { label: 'Community', page: 'impact-auth' as Page, desc: 'Impact · Potholes · Water', accent: 'text-emerald-600', dot: 'bg-emerald-500' },
    { label: 'News & Info', page: 'news-auth' as Page, desc: 'News · Tax · Civics · Costs', accent: 'text-amber-600', dot: 'bg-amber-500' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[120] transition-all duration-300 ${
          isScrolled
            ? 'h-16 bg-white/85 backdrop-blur-md shadow-sm border-b border-slate-200/50'
            : 'h-20 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 lg:px-10">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 shrink-0 rounded-lg bg-navy flex items-center justify-center font-black text-lg text-white shadow-sm">
              P
            </div>
            <span className="font-black text-sm uppercase text-navy" style={{ letterSpacing: '0.2em' }}>
              Prospect
            </span>
          </button>

          {/* Desktop nav — 3 paths */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.page)}
                className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isScrolled
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${item.dot} opacity-70 group-hover:opacity-100 transition-opacity`} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
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
                <span className="font-black text-sm uppercase text-navy" style={{ letterSpacing: '0.18em' }}>Prospect</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-4 flex-1">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { setMobileOpen(false); onNavigate(item.page); }}
                    className="flex items-start gap-3 px-4 py-4 rounded-2xl hover:bg-slate-50 text-left transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full ${item.dot} mt-1.5 shrink-0`} />
                    <div>
                      <p className={`text-sm font-black uppercase tracking-wider ${item.accent}`}>{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
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

const ValueProps = () => {
  const props = [
    {
      title: "Career Discovery",
      description: "Take our RIASEC quiz and get matched to careers that fit your unique strengths, interests, and personality.",
      link: "Take the Quiz",
      gradient: "from-sky-400 to-blue-600",
      icon: <Compass className="w-6 h-6 text-white" />
    },
    {
      title: "Career Roadmap",
      description: "Explore universities, TVET colleges, bursaries, and understand SA job demand for hundreds of careers.",
      link: "Explore Careers",
      gradient: "from-indigo-400 to-blue-700",
      icon: <Target className="w-6 h-6 text-white" />
    },
    {
      title: "Learning Library",
      description: "Access free study content for Grades 10–12 across all major subjects to boost your marks and future options.",
      link: "Start Learning",
      gradient: "from-blue-400 to-cyan-600",
      icon: <Rocket className="w-6 h-6 text-white" />
    }
  ];

  return (
    <section className="py-20 md:py-28 px-4 bg-bg-light border-y border-border content-visibility-auto contain-intrinsic-size-[auto_600px]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center lg:text-left"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4">What We Offer</p>
          <h2 className="text-h2 text-text-primary tracking-tighter leading-tight">
            We're here to guide your future.
          </h2>
          <p className="text-text-secondary text-lg mt-6 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
            From choosing the right subjects in Grade 10 to finding your dream career and securing a bursary, Prospect provides all the tools you need in one unified platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {props.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-start group cursor-pointer bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-8 hover:bg-white/90 hover:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.1)] transition-all duration-500 relative overflow-hidden will-change-transform"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${prop.gradient} flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500 will-change-transform`}>
                {prop.icon}
              </div>

              <h3 className="text-2xl font-black text-text-primary mb-4 group-hover:text-blue-600 transition-colors tracking-tight">
                {prop.title}
              </h3>
              <p className="text-text-secondary text-base leading-relaxed mb-8 font-medium">
                {prop.description}
              </p>
              <span className="mt-auto text-[11px] font-black uppercase tracking-[0.25em] text-slate-950 group-hover:text-blue-600 transition-colors inline-flex items-center gap-2">
                {prop.link}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Take the Career Quiz',
      desc: 'Answer our RIASEC quiz questions about your interests and strengths to discover which career paths suit your personality best.',
    },
    {
      number: 2,
      title: 'Explore Your Options',
      desc: 'Browse 400+ South African careers with salary data, job demand by province, university requirements, and TVET pathways.',
    },
    {
      number: 3,
      title: 'Secure Your Future',
      desc: 'Find bursaries and scholarships that match your field, then use our study resources to achieve the marks you need.',
    },
  ];

  return (
    <section className="py-10 bg-white sm:py-16 lg:py-24 content-visibility-auto contain-intrinsic-size-[auto_400px]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">How does it work?</h2>
          <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">
            From discovering your ideal career to securing funding and acing your exams — Prospect guides you every step of the way.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-20">
          <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
            <img
              className="w-full"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg"
              alt=""
              aria-hidden="true"
            />
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
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                  <span className="text-xl font-semibold text-gray-700">{step.number}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">{step.title}</h3>
                <p className="mt-4 text-base text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StarIcon = () => (
  <svg className="w-5 h-5 text-[#FDB241]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Testimonials = () => {
  const reviews = [
    {
      quote: "I had no idea what to study after matric. Prospect's quiz matched me to Industrial Engineering — I'm now in my second year at Wits and absolutely loving it.",
      name: 'Thabo Nkosi',
      role: 'Engineering Student, Wits University',
      avatar: 'TN',
      avatarBg: 'bg-blue-600',
    },
    {
      quote: "The bursary finder helped me secure funding through Sasol. Without Prospect I wouldn't have known where to look. It's completely changed my trajectory.",
      name: 'Ayanda Dlamini',
      role: 'Chemical Engineering, UCT',
      avatar: 'AD',
      avatarBg: 'bg-emerald-600',
    },
    {
      quote: "The study library for Physical Sciences saved my matric year. The explanations are clear and the practice questions actually match what came out in the exams.",
      name: 'Lerato Mokoena',
      role: 'Grade 12 Student, Soweto',
      avatar: 'LM',
      avatarBg: 'bg-indigo-600',
    },
  ];

  return (
    <section className="py-12 bg-gray-50 sm:py-16 lg:py-20 content-visibility-auto contain-intrinsic-size-[auto_500px]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-600">South African students share their experience</p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl">What our students say</h2>
          </div>

          <div className="mt-8 text-center md:mt-16 md:order-3">
            <a href="#" className="pb-2 text-base font-bold leading-7 text-gray-900 transition-all duration-200 border-b-2 border-gray-900 hover:border-gray-600 hover:text-gray-600 focus:outline-none">
              Read more student stories
            </a>
          </div>

          <div className="relative mt-10 md:mt-24 md:order-2">
            <div className="absolute -inset-x-1 inset-y-16 md:-inset-x-2 md:-inset-y-6">
              <div className="w-full h-full max-w-5xl mx-auto rounded-3xl opacity-30 blur-lg filter" style={{ background: 'linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)' }} />
            </div>

            <div className="relative grid max-w-lg grid-cols-1 gap-6 mx-auto md:max-w-none lg:gap-10 md:grid-cols-3">
              {reviews.map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col overflow-hidden shadow-xl"
                >
                  <div className="flex flex-col justify-between flex-1 p-6 bg-white lg:py-8 lg:px-7">
                    <div className="flex-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
                      </div>
                      <blockquote className="flex-1 mt-8">
                        <p className="text-lg leading-relaxed text-gray-900">"{review.quote}"</p>
                      </blockquote>
                    </div>
                    <div className="flex items-center mt-8">
                      <div className={`flex-shrink-0 w-11 h-11 rounded-full ${review.avatarBg} flex items-center justify-center text-white font-bold text-sm`}>
                        {review.avatar}
                      </div>
                      <div className="ml-4">
                        <p className="text-base font-bold text-gray-900">{review.name}</p>
                        <p className="mt-0.5 text-sm text-gray-600">{review.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DiscoveryGrid = () => {
  const items = [
    { webp: '/images/engineer.webp', jpg: '/images/engineer.jpg', title: 'Engineering', description: 'Build the future of SA infrastructure' },
    { webp: '/images/nurse.webp', jpg: '/images/nurse.jpg', title: 'Healthcare', description: 'Care for communities across the country' },
    { webp: '/images/teacher.webp', jpg: '/images/teacher.jpg', title: 'Education', description: 'Shape the next generation of leaders' },
    { webp: '/images/electrician.webp', jpg: '/images/electrician.jpg', title: 'Trades & Technical', description: 'High-demand skills SA needs now' },
    { webp: '/images/students.webp', jpg: '/images/students.jpg', title: 'Keep Learning', description: 'Your journey starts with the right knowledge' },
  ];

  return (
    <section className="py-20 px-4 bg-bg-light border-t border-border content-visibility-auto contain-intrinsic-size-[auto_500px]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-text-tertiary mb-3">Career Library</p>
          <h2 className="text-h2 text-text-primary tracking-tighter">
            Explore Top SA Careers
          </h2>
          <p className="text-text-secondary text-base mt-4 font-medium">
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
              whileHover={{ y: -6, scale: 1.02 }} // Subtle lift and scale on hover
              className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-3/4 shadow-sm hover:shadow-xl transition-shadow duration-300 will-change-transform" // Promote to GPU
            >
              <picture>
                <source srcSet={item.webp} type="image/webp" />
                <img
                  src={item.jpg}
                  alt={item.title}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  decoding="async"
                  width={400}
                  height={533}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
                />
              </picture>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              {/* Hover tint */}
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-black text-sm lg:text-base leading-tight uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>{item.title}</h3>
                <p className="text-white/70 text-[10px] mt-1.5 leading-snug hidden sm:block font-medium">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What is Prospect?",
      answer: "Prospect is a free career guidance and independent learning platform built for South African students. We help you discover the right career path, understand how to get there, and access study resources for Grades 10–12 — all in one place."
    },
    {
      question: "How does the career quiz work?",
      answer: "Our quiz is based on the RIASEC career model. You answer a set of questions about your interests, strengths, and work preferences, and we match you to careers that suit your profile — along with the qualifications and institutions you'll need."
    },
    {
      question: "Is Prospect really free?",
      answer: "Yes, Prospect is completely free for all South African students. Our mission is to make quality career guidance and learning resources accessible to every student, regardless of their background or location."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-4 bg-white border-t border-border">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">FAQ</p>
          <h2 className="text-h3 text-text-primary" style={{ letterSpacing: '-0.015em' }}>
            Common questions.
          </h2>
        </motion.div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <button
                className="w-full py-6 flex items-start justify-between text-left gap-6 group"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`text-base font-bold transition-colors leading-snug ${
                  openIndex === index ? 'text-blue-600' : 'text-text-primary group-hover:text-blue-600'
                }`}>
                  {faq.question}
                </span>
                <span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 mt-0.5 ${
                  openIndex === index
                    ? 'border-blue-600 bg-blue-600/5'
                    : 'border-slate-200 group-hover:border-slate-300'
                }`}>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-blue-600' : 'text-slate-400'
                  }`} />
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-text-secondary text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const sections = [
    {
      title: "Career Guide",
      links: [
        { label: "Career Quiz", page: "quiz" },
        { label: "Explore Careers", page: "careers" },
        { label: "TVET Pathways", page: "tvet" },
        { label: "Bursary Finder", page: "bursaries" },
        { label: "Job Map", page: "map" }
      ]
    },
    {
      title: "School Assist",
      links: [
        { label: "Sign In / Register", page: "auth" },
        { label: "Study Library", page: "auth" },
        { label: "School Calendar", page: "auth" },
        { label: "Grade 10 Tools", page: "subject-selector" }
      ]
    },
    {
      title: "Community",
      links: [
        { label: "Community Impact", page: "impact-auth" },
        { label: "Pothole Map", page: "impact-auth" },
        { label: "Water Dashboard", page: "impact-auth" },
        { label: "Get Involved", page: "impact-auth" }
      ]
    }
  ];

  return (
    <footer className="bg-[#0f172a] text-slate-400 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">P</div>
              <span className="text-2xl font-black text-white tracking-tight">Prospect</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
              Prospect is South Africa's leading free platform for career discovery and independent learning. We help students navigate their future with data-driven guidance and curriculum-aligned resources.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Facebook size={18} />, label: 'Facebook' },
                { icon: <Instagram size={18} />, label: 'Instagram' },
                { icon: <Twitter size={18} />, label: 'Twitter' }
              ].map((social, i) => (
                <button
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-6">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => onNavigate(link.page as Page)}
                      className="text-sm hover:text-blue-600 transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-xs font-medium">
            © 2026 Prospect South Africa. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('home')} className="text-slate-500 hover:text-white text-xs transition-colors">Accessibility</button>
            <button onClick={() => onNavigate('home')} className="text-slate-500 hover:text-white text-xs transition-colors">Cookie Settings</button>
            <button onClick={() => onNavigate('home')} className="text-slate-500 hover:text-white text-xs transition-colors">South Africa (EN)</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Career Guide Section ---

const CareerGuideSection = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const tools = [
    {
      icon: <Compass className="w-5 h-5 text-blue-600" />,
      title: 'RIASEC Career Quiz',
      desc: 'Answer 42 questions and get matched to careers that fit your personality and interests.',
      cta: 'Take the Quiz',
      page: 'quiz' as Page,
      accent: 'bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-50',
    },
    {
      icon: <Briefcase className="w-5 h-5 text-slate-700" />,
      title: 'Career Browser',
      desc: 'Browse 200+ SA careers with salary ranges, APS requirements, and university pathways.',
      cta: 'Explore Careers',
      page: 'careers' as Page,
      accent: 'bg-slate-50 border-slate-200',
      iconBg: 'bg-slate-100',
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-indigo-600" />,
      title: 'TVET Pathways',
      desc: 'Discover vocational careers and the 50 public TVET colleges across all SA provinces.',
      cta: 'Explore TVET',
      page: 'tvet' as Page,
      accent: 'bg-indigo-50 border-indigo-100',
      iconBg: 'bg-indigo-50',
    },
    {
      icon: <Award className="w-5 h-5 text-amber-600" />,
      title: 'Bursary Finder',
      desc: '200+ bursaries searchable by career field and province. Includes NSFAS eligibility check.',
      cta: 'Find Funding',
      page: 'bursaries' as Page,
      accent: 'bg-amber-50 border-amber-100',
      iconBg: 'bg-amber-50',
    },
    {
      icon: <MapPin className="w-5 h-5 text-rose-600" />,
      title: 'Job Demand Map',
      desc: 'See which careers are in demand by province and where employers are hiring across SA.',
      cta: 'View Map',
      page: 'map' as Page,
      accent: 'bg-rose-50 border-rose-100',
      iconBg: 'bg-rose-50',
    },
    {
      icon: <Target className="w-5 h-5 text-emerald-600" />,
      title: 'APS Calculator',
      desc: 'Enter your report card marks and see which careers and universities you qualify for.',
      cta: 'Calculate APS',
      page: 'quiz' as Page,
      accent: 'bg-emerald-50 border-emerald-100',
      iconBg: 'bg-emerald-50',
    },
  ];

  return (
    <section className="py-20 px-4 bg-white border-y border-border content-visibility-auto contain-intrinsic-size-[auto_600px]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center lg:text-left flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600">No sign-in required</p>
            </div>
            <h2 className="text-h2 text-navy tracking-tight">
              Career Guide
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mt-4 max-w-lg">
              Discover the right career path, understand how to get there, and find the funding to make it happen — all for free, no account needed.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('quiz')}
            className="inline-flex items-center gap-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest px-7 py-3.5 rounded-xl shadow-lg hover:bg-slate-800 transition-all shrink-0"
          >
            Start Career Quiz
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Tool grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <motion.button
              key={tool.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              whileHover={{ y: -5 }}
              onClick={() => onNavigate(tool.page as Page)}
              className="group flex flex-col items-start text-left p-8 rounded-[16px] bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-sm hover:bg-white hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 shrink-0">
                {/* Simplified Icon Color */}
                <div className="text-blue-600">{tool.icon}</div>
              </div>
              <h3 className="font-bold text-text-primary text-sm mb-3 group-hover:text-blue-600 transition-all duration-300">
                {tool.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed flex-1">{tool.desc}</p>
              <span className="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-all duration-300 inline-flex items-center gap-2">
                {tool.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- School Assist Section ---

const SchoolAssistSection = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const features = [
    { icon: <CalendarDays className="w-5 h-5 text-indigo-600" />, title: 'School Term Calendar', desc: 'Stay on top of SA school terms, exam dates, and application deadlines.' },
    { icon: <BookOpen className="w-5 h-5 text-indigo-600" />, title: 'Subject Learning Library', desc: 'Grade 10–12 study content for all major matric subjects, free and curriculum-aligned.' },
    { icon: <Target className="w-5 h-5 text-indigo-600" />, title: 'Study Planner', desc: 'Build a personal study schedule around your timetable and upcoming tests.' },
  ];

  return (
    <section className="py-20 px-4 bg-bg-light content-visibility-auto contain-intrinsic-size-[auto_500px]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Sign-in required</p>
            </div>
            <h2 className="text-h2 text-navy mb-6" style={{ letterSpacing: '-0.02em' }}>
              School Assist
            </h2>
            <p className="text-text-secondary text-base leading-relaxed mb-10 max-w-md">
              A focused study space for SA students. Access your school term calendar, browse the subject learning library for Grades 10–12, and track your progress — all behind a free account.
            </p>
            <div className="mb-10 space-y-4">
               <p className="text-slate-400 text-sm italic">• Personalised dashboard for every student</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('auth')}
              className="inline-flex items-center gap-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
            >
              Get Started — It's Free
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Right — feature cards */}
          <div className="flex flex-col gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-start gap-4 bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-5 hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-sm mb-1">{f.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Community Impact Section ---

const CommunityImpactSection = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const points = [
    { icon: <Globe className="w-4 h-4 text-emerald-600" />, text: 'Share what your community needs — schools, colleges, jobs, services.' },
    { icon: <Users className="w-4 h-4 text-emerald-600" />, text: 'Help build a national opportunity map used by students and researchers.' },
    { icon: <Lock className="w-4 h-4 text-emerald-600" />, text: 'Completely optional and privacy-conscious — you control what you share.' },
  ];

  return (
    <section className="py-20 px-4 bg-white content-visibility-auto contain-intrinsic-size-[auto_500px]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-linear-to-br from-[#0f172a] to-[#1e3a5f] p-10 md:p-16"
        >
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — text */}
            <div>
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-4">
                Optional Community Contribution
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-5" style={{ letterSpacing: '-0.02em' }}>
                Help Map Opportunities in South Africa
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">
                You know your community better than any dataset. By sharing what your area needs — whether it's more TVET colleges, apprenticeship programmes, or internet access — you help shape a national map of opportunity gaps that benefits every SA student.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('impact-auth')}
                className="inline-flex items-center gap-2.5 bg-emerald-500 text-white text-xs font-black uppercase tracking-widest px-7 py-3.5 rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/30"
              >
                Get Involved
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Right — bullet points */}
            <div className="flex flex-col gap-4">
              {points.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    {p.icon}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{p.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Main App ---

type Page = AppPage;

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

  // Preload critical images during loading screen
  useEffect(() => {
    const images = [
      '/images/engineer.webp', '/images/nurse.webp', '/images/teacher.webp',
      '/images/electrician.webp', '/images/students.webp',
    ];

    const loadAssets = Promise.all(images.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // Continue even if an image fails to load
      });
    }));

    // Ensure the loading screen stays visible long enough for its animations to play
    const minDuration = new Promise(resolve => setTimeout(resolve, 2600));

    Promise.all([loadAssets, minDuration]).then(() => setIsAssetsLoaded(true));
  }, []);

  const navigate = (p: Page) => setPage(p);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPage('home');
  };

  // Run localStorage migrations once on mount
  useEffect(() => {
    runMigrations();
  }, []);

  // Restore session on mount and listen for auth changes
  useEffect(() => {
    // Check for test mode first
    const isTestMode =
      (window as any).__PLAYWRIGHT_TEST__ ||
      sessionStorage.getItem('__test_mode__') === 'true' ||
      localStorage.getItem('__playwright_test_mode__') ||
      new URLSearchParams(window.location.search).get('__test_mode') === 'true';

    // Check URL params for page
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');

    // In test mode, allow navigation without a session
    if (isTestMode && pageParam) {
      setPage(pageParam as Page);
      // Create a mock user for test mode
      setUser({
        id: 'test-user-' + Math.random().toString(36).substr(2, 9),
        email: 'test@example.com',
        email_confirmed_at: new Date().toISOString(),
        phone: null,
        last_sign_in_at: new Date().toISOString(),
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: { name: 'Test User' },
        identities: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_anonymous: false,
      } as any);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        syncUserDataOnLogin(session.user.id);
        startBackgroundSync(session.user.id);
        if (pageParam) {
          setPage(pageParam as Page);
        } else {
          setPage('dashboard');
        }
      } else {
        // No active Supabase session — try restoring from localStorage
        const restored = await restoreSessionFromStorage();
        if (restored?.user) {
          // setSession above re-authenticates the client; onAuthStateChange fires and sets user
          // But set user here too in case the event doesn't fire synchronously
          setUser(restored.user as any);
          syncUserDataOnLogin(restored.user.id);
          startBackgroundSync(restored.user.id);
          if (pageParam) {
            setPage(pageParam as Page);
          } else {
            setPage('dashboard');
          }
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        syncUserDataOnLogin(session.user.id);
        startBackgroundSync(session.user.id);
      } else {
        stopBackgroundSync();
        setPage('home');
      }
    });

    return () => {
      subscription.unsubscribe();
      stopBackgroundSync();
    };
  }, []);

  // School Assist pages — require sign in (dashboard, library, calendar)
  const protectedPageProps = {
    onNavigateAuth: () => setPage('auth'),
    onSignOut: handleSignOut,
    onNavigate: navigate,
  };

  // Career pages — no sign in required, guest users welcome
  const careerPageProps = {
    onNavigateAuth: () => setPage('auth'),
    onSignOut: handleSignOut,
    onNavigate: navigate,
    guestMode: true,
  };

  return (
    <>
      {/* Initial loading screen — shown once on app launch */}
      <AnimatePresence>
        {!isAssetsLoaded && <LoadingScreen onComplete={() => {}} />}
      </AnimatePresence>

      {/* Page content — hidden under loading screen until complete */}
      {isAssetsLoaded && (
        <div className="relative min-h-screen bg-white">
          {/* Background is shown throughout the site EXCEPT for the login pages */}
          {page !== 'auth' && page !== 'impact-auth' && <InteractiveBackground />}

          <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" /></div>}>
          <AnimatePresence mode="wait">
            {page === 'auth' && (
              <PageTransition pageKey="auth">
                <AuthPage
                  onNavigateHome={() => setPage('home')}
                  onAuthSuccess={(u) => { setUser(u); setPage('dashboard'); }}
                />
              </PageTransition>
            )}

            {page === 'dashboard' && (
              <PageTransition pageKey="dashboard">
                <DashboardPage {...protectedPageProps} />
              </PageTransition>
            )}

            {/* ── Career pages — no sign in required ── */}
            {page === 'quiz' && (
              <PageTransition pageKey="quiz">
                <QuizPage {...careerPageProps} />
              </PageTransition>
            )}

            {page === 'careers' && (
              <PageTransition pageKey="careers">
                <CareersPageNew {...careerPageProps} />
              </PageTransition>
            )}

            {page === 'bursaries' && (
              <PageTransition pageKey="bursaries">
                <BursariesPage {...careerPageProps} />
              </PageTransition>
            )}

            {page === 'bursary' && (
              <PageTransition pageKey="bursary">
                <BursaryDetailPage {...careerPageProps} />
              </PageTransition>
            )}

            {page === 'disadvantaged-guide' && (
              <PageTransition pageKey="disadvantaged-guide">
                <DisadvantagedGuide {...careerPageProps} />
              </PageTransition>
            )}

            {page === 'map' && (
              <PageTransition pageKey="map">
                <MapPage {...careerPageProps} />
              </PageTransition>
            )}

            {page === 'tvet' && (
              <PageTransition pageKey="tvet">
                <TVETPage {...careerPageProps} />
              </PageTransition>
            )}

            {page === 'tvet-careers' && (
              <PageTransition pageKey="tvet-careers">
                <TVETCareersPage {...careerPageProps} />
              </PageTransition>
            )}

            {page === 'tvet-colleges' && (
              <PageTransition pageKey="tvet-colleges">
                <TVETCollegesPage {...careerPageProps} />
              </PageTransition>
            )}

            {page === 'tvet-funding' && (
              <PageTransition pageKey="tvet-funding">
                <TVETFundingPage {...careerPageProps} />
              </PageTransition>
            )}

            {page === 'tvet-requirements' && (
              <PageTransition pageKey="tvet-requirements">
                <TVETRequirementsPage {...careerPageProps} />
              </PageTransition>
            )}

            {page === 'subject-selector' && (
              <PageTransition pageKey="subject-selector">
                <Grade10SubjectSelectorPage {...careerPageProps} />
              </PageTransition>
            )}

            {/* ── School Assist pages — require sign in ── */}
            {page === 'library' && (
              <PageTransition pageKey="library">
                <StudyLibraryPage {...protectedPageProps} />
              </PageTransition>
            )}

            {page === 'calendar' && (
              <PageTransition pageKey="calendar">
                <CalendarPageNew {...protectedPageProps} />
              </PageTransition>
            )}

            {page === 'school-assist' && (
              <PageTransition pageKey="school-assist">
                <SchoolAssistPage onNavigate={navigate} onNavigateHome={() => setPage('home')} />
              </PageTransition>
            )}

            {page === 'school-assist-chat' && (
              <PageTransition pageKey="school-assist-chat">
                <SchoolAssistChatPage onNavigate={navigate} onNavigateHome={() => setPage('home')} />
              </PageTransition>
            )}

            {page === 'aps-calculator' && (
              <PageTransition pageKey="aps-calculator">
                <APSCalculatorPage onNavigate={navigate} onNavigateHome={() => setPage('home')} />
              </PageTransition>
            )}

            {page === 'impact-auth' && (
              <PageTransition pageKey="impact-auth">
                <ImpactAuthPage onNavigateHome={() => setPage('home')} onNavigate={navigate} />
              </PageTransition>
            )}

            {page === 'demo-learning' && (
              <PageTransition pageKey="demo-learning">
                <DemoLearningPage {...protectedPageProps} />
              </PageTransition>
            )}

            {page === 'community-impact' && (
              <PageTransition pageKey="community-impact">
                <CommunityImpactPage {...careerPageProps} />
              </PageTransition>
            )}

            {page === 'pothole-map' && (
              <PageTransition pageKey="pothole-map">
                <PotholeMapPage {...careerPageProps} />
              </PageTransition>
            )}

            {page === 'flag-pothole' && (
              <PageTransition pageKey="flag-pothole">
                <FlagPotholePage {...protectedPageProps} />
              </PageTransition>
            )}

            {page === 'my-pothole-contributions' && (
              <PageTransition pageKey="my-pothole-contributions">
                <MyContributionsPage {...protectedPageProps} />
              </PageTransition>
            )}

            {page === 'water-dashboard' && (
              <PageTransition pageKey="water-dashboard">
                <WaterDashboardPage {...protectedPageProps} />
              </PageTransition>
            )}

            {page === 'news' && (
              <PageTransition pageKey="news">
                <NewsPage {...protectedPageProps} />
              </PageTransition>
            )}

            {page === 'tax-budget' && (
              <PageTransition pageKey="tax-budget">
                <TaxBudgetPage {...protectedPageProps} />
              </PageTransition>
            )}

            {page === 'cost-of-living' && (
              <PageTransition pageKey="cost-of-living">
                <CostOfLivingPage {...protectedPageProps} />
              </PageTransition>
            )}

            {page === 'civics' && (
              <PageTransition pageKey="civics">
                <CivicsPage {...protectedPageProps} />
              </PageTransition>
            )}

            {page === 'news-auth' && (
              <PageTransition pageKey="news-auth">
                <NewsAuthPage
                  onNavigateHome={() => setPage('home')}
                  onNavigate={navigate}
                />
              </PageTransition>
            )}

            {page === 'home' && (
              <PageTransition pageKey="home">
                <div className="relative">
                  <Header onNavigate={setPage} />
                  <main id="main-content">
                    <AnimatedHero onNavigate={setPage} />
                    <LogoCloud />
                    {/* ── Section 1: Career Guide ── */}
                    <CareerGuideSection onNavigate={setPage} />
                    {/* ── Section 1.5: How it Works ── */}
                    <HowItWorks />
                    {/* ── Section 2: Career Image Grid ── */}
                    <DiscoveryGrid />
                    {/* ── Section 3: School Assist ── */}
                    <SchoolAssistSection onNavigate={setPage} />
                    {/* ── Section 4: Community ── */}
                    <CommunityImpactSection onNavigate={setPage} />
                    {/* ── Section 5: Testimonials ── */}
                    <Testimonials />
                    <FAQ />
                  </main>
                  <Footer onNavigate={setPage} />
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
