import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import Grade10SubjectSelectorPage from './pages/Grade10SubjectSelectorPage';
import StudyLibraryPage from './pages/StudyLibraryPage';
import CareersPageNew from './pages/CareersPageNew';
import BursariesPage from './pages/BursariesPage';
import BursaryDetailPage from './pages/BursaryDetailPage';
import DisadvantagedGuide from './pages/DisadvantagedGuide';
import QuizPage from './pages/QuizPage';
import MapPage from './pages/MapPage';
import TVETPage from './pages/TVETPage';
import TVETCareersPage from './pages/TVETCareersPage';
import TVETCollegesPage from './pages/TVETCollegesPage';
import TVETFundingPage from './pages/TVETFundingPage';
import TVETRequirementsPage from './pages/TVETRequirementsPage';
import LoadingScreen from './components/LoadingScreen';
import { VideoPlayer } from './components/VideoPlayer';
import type { AppPage } from './lib/withAuth';
import {
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Facebook,
  Instagram,
  Twitter,
  Quote
} from 'lucide-react';

// --- Components ---

const Header = ({ onNavigateAuth }: { onNavigateAuth: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 lg:h-20 flex items-center px-4 lg:px-10 backdrop-blur-md ${
        isScrolled ? 'bg-white/70 shadow-md' : 'calm-header-gradient'
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 lg:w-11 lg:h-11 shrink-0 rounded-xl flex items-center justify-center text-white font-semibold text-xl lg:text-2xl shadow-lg" style={{ backgroundColor: '#1e293b' }}>P</div>
          <span className={`hidden lg:block font-bold text-lg tracking-tight transition-colors duration-300 ${
            isScrolled ? 'text-calm-dark-blue' : 'text-white'
          }`}>
            Prospect
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNavigateAuth}
          className="font-bold text-sm lg:text-base px-6 py-2 lg:py-3 rounded-full transition-colors shadow-sm"
          style={{ backgroundColor: '#1B5E20', color: 'white' }}
        >
          Login
        </motion.button>
      </div>
    </header>
  );
};

const Hero = ({ onNavigateAuth }: { onNavigateAuth: () => void }) => {
  return (
    <section className="relative h-150 lg:h-200 flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/students.jpg"
          alt="Students discovering their career paths"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
        >
          Find Your Career. <br /> Know Your Path.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg lg:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
        >
          Discover the right career path based on your strengths, explore top SA careers, and learn exactly how to get there.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNavigateAuth}
            className="px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-xl"
            style={{ backgroundColor: '#1B5E20', color: 'white' }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

const BrandSlogan = () => (
  <section className="py-12 px-4 bg-white flex flex-col items-center gap-4">
    <motion.div
      className="w-20 h-20 rounded-3xl flex items-center justify-center text-white font-semibold text-5xl shadow-xl"
      style={{ backgroundColor: '#1e293b' }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >P</motion.div>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="text-xl font-bold text-[#1B5E20]"
    >
      Know your path. Own your future.
    </motion.p>
  </section>
);

const ValueProps = () => {
  const props = [
    {
      title: "Career Discovery.",
      description: "Take our RIASEC quiz and get matched to careers that fit your unique strengths, interests, and personality.",
      link: "Find Your Path",
      icon: (
        <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#75F0F0] to-[#7575F0] flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 56 56" fill="none" className="text-white">
            <path d="M28 8C17 8 8 17 8 28s9 20 20 20 20-9 20-20S39 8 28 8zm0 6a14 14 0 0 1 0 28A14 14 0 0 1 28 14zm0 4a10 10 0 1 0 0 20A10 10 0 0 0 28 18zm0 4a6 6 0 1 1 0 12A6 6 0 0 1 28 22z" fill="currentColor" />
          </svg>
        </div>
      )
    },
    {
      title: "Career Roadmap.",
      description: "Explore universities, TVET colleges, bursaries, and understand SA job demand for hundreds of careers.",
      link: "Explore Careers",
      icon: (
        <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#9191FF] to-[#F075C7] flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 56 56" fill="none" className="text-white">
            <path d="M10 44V20l18-8 18 8v24l-18 8-18-8zm4-4.5 14 6.2V24.8L14 18.6v20.9zm32 0V18.6l-14 6.2v20.9l14-6.2z" fill="currentColor" />
          </svg>
        </div>
      )
    },
    {
      title: "Learning Library.",
      description: "Access free study content for Grades 10–12 across all major subjects to boost your marks and future options.",
      link: "Learn Now",
      icon: (
        <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#75F094] to-[#75B2F0] flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 56 56" fill="none" className="text-white">
            <path d="M10 14h36v4H10zm0 10h36v4H10zm0 10h24v4H10zm28 2l10 8-10 8V36z" fill="currentColor" />
          </svg>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl lg:text-4xl font-bold text-calm-dark-blue mb-16"
        >
          We're here to guide your future.
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-12">
          {props.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              {prop.icon}
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-calm-blue transition-colors">
                {prop.title}
              </h3>
              <p className="text-gray-600 leading-relaxed max-w-xs">
                {prop.description}
              </p>
              <motion.span
                whileHover={{ x: 5 }}
                className="mt-6 text-gray-800 font-semibold underline underline-offset-4 group-hover:text-calm-blue transition-colors inline-flex items-center gap-2"
              >
                {prop.link}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Banner = () => {
  const careers = [
    { image: '/images/engineer.jpg', title: 'Engineering', description: 'Build the future of SA infrastructure' },
    { image: '/images/nurse.jpg', title: 'Healthcare', description: 'Care for communities across the country' },
    { image: '/images/teacher.jpg', title: 'Education', description: 'Shape the next generation of leaders' },
    { image: '/images/electrician.jpg', title: 'Trades & Technical', description: 'High-demand skills SA needs now' },
    { image: '/images/students.jpg', title: 'Keep Learning', description: 'Your journey starts with the right knowledge' },
  ];

  return (
    <section className="py-20 px-4 bg-calm-bg">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl lg:text-4xl font-bold text-calm-dark-blue text-center mb-12"
        >
          Explore Top SA Careers
        </motion.h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {careers.map((career, index) => (
            <motion.div
              key={career.title}
              initial={{ opacity: 0, scale: 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-3/4"
            >
              <img
                src={career.image}
                alt={career.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-base lg:text-lg leading-tight">{career.title}</h3>
                <p className="text-white/80 text-xs lg:text-sm mt-1 leading-snug">{career.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Reviews = () => {
  const reviews = [
    {
      quote: "I found my career path through the quiz and now know exactly what to study. Prospect changed everything for me.",
      author: "Lerato, Grade 12 — Johannesburg"
    },
    {
      quote: "I never knew what TVET colleges offered until I used Prospect. Now I have a clear plan and I'm applying for bursaries.",
      author: "Sipho, Matric Graduate — Durban"
    },
    {
      quote: "The study library helped me improve my Maths mark by 15%. I recommend Prospect to every student I know.",
      author: "Amahle, Grade 11 — Cape Town"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % reviews.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl lg:text-4xl font-bold text-calm-dark-blue mb-12"
        >
          Students finding their path.
        </motion.h2>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="review-gradient p-10 lg:p-16 rounded-3xl text-left text-white shadow-xl relative overflow-hidden"
            >
              <Quote className="absolute top-8 left-8 opacity-20 w-16 h-16" />
              <blockquote className="text-xl lg:text-2xl font-medium mb-6 relative z-10">
                "{reviews[activeIndex].quote}"
              </blockquote>
              <p className="text-white/80 mb-6">{reviews[activeIndex].author}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={20} fill="#F8D22D" className="text-[#F8D22D]" />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center lg:justify-end gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors"
            >
              <ChevronLeft />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
            >
              <ChevronRight />
            </motion.button>
          </div>
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
    <section className="py-20 px-4 faq-gradient">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl lg:text-4xl font-bold text-center text-calm-dark-blue mb-12"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border-t border-black/10"
            >
              <button
                className="w-full py-6 flex items-center justify-between text-left group"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-calm-blue' : 'text-gray-800 group-hover:text-calm-blue'}`}>
                  {faq.question}
                </span>
                <ChevronDown className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-gray-700 leading-relaxed">
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

const Footer = () => {
  const sections = [
    {
      title: "Company",
      links: ["About", "Careers", "Contact"]
    },
    {
      title: "Guidance",
      links: ["Career Quiz", "Explore Careers", "TVET Guide", "Bursaries"]
    },
    {
      title: "Learning",
      links: ["Study Library", "Grade 10", "Grade 11", "Grade 12"]
    },
    {
      title: "Help",
      links: ["FAQ", "Contact Us", "Terms", "Privacy Policy"]
    }
  ];

  return (
    <footer className="bg-calm-footer pt-20 pb-10 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-xl opacity-90" style={{ backgroundColor: '#1e293b' }}>P</div>
            <span className="text-2xl font-bold tracking-tight">Prospect</span>
          </div>
          <p className="text-white/60 text-sm max-w-xs">Free career guidance and learning platform for South African students.</p>
          <a href="mailto:hello@prospect.co.za" className="text-white/60 hover:text-white transition-colors text-sm mt-2 block">hello@prospect.co.za</a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-lg mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/70 hover:text-white transition-colors text-sm lg:text-base">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between pt-8 border-t border-white/10 gap-8">
          <div className="flex gap-6">
            <a href="#" className="text-white/70 hover:text-white transition-colors"><Facebook size={20} /></a>
            <a href="#" className="text-white/70 hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-white/70 hover:text-white transition-colors"><Twitter size={20} /></a>
          </div>
          <p className="text-white/40 text-sm">
            © 2026 Prospect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
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
  const [loading, setLoading] = useState(true);

  const navigate = (p: Page) => setPage(p);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPage('home');
  };

  // Restore session on mount and listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        // Check URL params for page
        const params = new URLSearchParams(window.location.search);
        const pageParam = params.get('page');
        if (pageParam) {
          setPage(pageParam as Page);
        } else {
          setPage('dashboard');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setPage('home');
    });

    return () => subscription.unsubscribe();
  }, []);

  const protectedPageProps = {
    onNavigateAuth: () => setPage('auth'),
    onSignOut: handleSignOut,
    onNavigate: navigate,
  };

  return (
    <>
      {/* Initial loading screen — shown once on app launch */}
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Page content — hidden under loading screen until complete */}
      {!loading && (
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

          {page === 'quiz' && (
            <PageTransition pageKey="quiz">
              <QuizPage {...protectedPageProps} />
            </PageTransition>
          )}

          {page === 'subject-selector' && (
            <PageTransition pageKey="subject-selector">
              <Grade10SubjectSelectorPage {...protectedPageProps} />
            </PageTransition>
          )}

          {page === 'library' && (
            <PageTransition pageKey="library">
              <StudyLibraryPage {...protectedPageProps} />
            </PageTransition>
          )}

          {page === 'careers' && (
            <PageTransition pageKey="careers">
              <CareersPageNew {...protectedPageProps} />
            </PageTransition>
          )}

          {page === 'bursaries' && (
            <PageTransition pageKey="bursaries">
              <BursariesPage {...protectedPageProps} />
            </PageTransition>
          )}

          {page === 'bursary' && (
            <PageTransition pageKey="bursary">
              <BursaryDetailPage {...protectedPageProps} />
            </PageTransition>
          )}

          {page === 'disadvantaged-guide' && (
            <PageTransition pageKey="disadvantaged-guide">
              <DisadvantagedGuide {...protectedPageProps} />
            </PageTransition>
          )}

          {page === 'map' && (
            <PageTransition pageKey="map">
              <MapPage {...protectedPageProps} />
            </PageTransition>
          )}

          {page === 'tvet' && (
            <PageTransition pageKey="tvet">
              <TVETPage {...protectedPageProps} />
            </PageTransition>
          )}

          {page === 'tvet-careers' && (
            <PageTransition pageKey="tvet-careers">
              <TVETCareersPage {...protectedPageProps} />
            </PageTransition>
          )}

          {page === 'tvet-colleges' && (
            <PageTransition pageKey="tvet-colleges">
              <TVETCollegesPage {...protectedPageProps} />
            </PageTransition>
          )}

          {page === 'tvet-funding' && (
            <PageTransition pageKey="tvet-funding">
              <TVETFundingPage {...protectedPageProps} />
            </PageTransition>
          )}

          {page === 'tvet-requirements' && (
            <PageTransition pageKey="tvet-requirements">
              <TVETRequirementsPage {...protectedPageProps} />
            </PageTransition>
          )}

          {page === 'home' && (
            <PageTransition pageKey="home">
              <div className="min-h-screen">
                <Header onNavigateAuth={() => setPage('auth')} />
                <main id="main-content">
                  <Hero onNavigateAuth={() => setPage('auth')} />
                  <BrandSlogan />
                  <VideoPlayer
                    src="/videos/video1.mp4"
                    title="How Prospect Works"
                    description="Discover your perfect career in 15 minutes"
                    startTime={40}
                    poster="/thumbnails/video1-poster.png"
                  />
                  <ValueProps />
                  <Banner />
                  <Reviews />
                  <FAQ />
                </main>
                <Footer />
              </div>
            </PageTransition>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
