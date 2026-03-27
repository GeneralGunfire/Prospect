import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  Database, 
  Users, 
  ShieldCheck, 
  Quote, 
  Globe, 
  LayoutDashboard, 
  Network, 
  FileText, 
  Mail,
  BrainCircuit,
  BarChart3,
  Compass,
  Zap,
  User,
  BookOpen,
  Play,
  Smile,
  Waves,
  Settings2,
  Headphones,
  Smartphone,
  Lock,
  ShoppingBag,
  TrendingUp,
  Star,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Github as GithubIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { useDataSaver } from './contexts/DataSaverContext';
import { useAuth } from './contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { dataSaverMode, setMode } = useDataSaver();
  const { isAuthenticated, continueAsGuest, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const navLinks = [
    { name: 'Home', path: '#home' },
    { name: 'About', path: '#about' },
    { name: 'Features', path: '#features' },
    { name: 'How it work', path: '#how-it-work' },
    { name: 'Pricing', path: '#pricing' },
    { name: 'Contact', path: '#contact' },
  ];

  const handleGuest = () => {
    continueAsGuest();
    navigate('/quiz');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    if (isDrawerOpen) setIsDrawerOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isScrolled ? "bg-white/40 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
        )}
      >
        <div className="flex justify-between items-center px-4 md:px-8 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <button
              onClick={toggleDrawer}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors md:hidden"
            >
              <Menu className="w-6 h-6 text-black" />
            </button>
            <Link to="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">P</div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight leading-none text-black">Prospect</span>
                <span className="text-[9px] font-medium uppercase tracking-widest text-gray-600">Career Architecture</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.path)}
                className={cn(
                  "font-bold text-[11px] uppercase tracking-widest transition-colors relative group",
                  "text-gray-700 hover:text-black"
                )}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setMode(!dataSaverMode)}
              className="p-2 rounded-full transition-colors hover:bg-black/5 text-gray-600 hover:text-black"
            >
              {dataSaverMode ? <ShieldCheck className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
            </button>

            <Link
              to="/signup"
              className="hidden lg:block px-8 py-2.5 bg-blue-600 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleDrawer}
              className="fixed inset-0 bg-black/20 z-[55] backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-[60] w-[85%] max-w-sm bg-white shadow-2xl border-r border-gray-100"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">P</div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight leading-none text-black">Prospect</span>
                    <span className="text-[8px] font-medium uppercase tracking-widest text-gray-600">Career Architecture</span>
                  </div>
                </div>
                <button onClick={toggleDrawer} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-black" />
                </button>
              </div>
              <div className="flex flex-col py-4 overflow-y-auto max-h-[calc(100vh-80px)]">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.path)}
                    className="flex items-center justify-between px-8 py-5 transition-all text-xs font-bold uppercase tracking-widest text-gray-700 hover:text-black hover:bg-gray-100 text-left border-b border-gray-100 last:border-0"
                  >
                    {link.name}
                    <ChevronRight size={14} className="text-gray-400" />
                  </button>
                ))}
                {!isAuthenticated && (
                  <button
                    onClick={handleGuest}
                    className="flex items-center justify-between px-8 py-5 transition-all text-xs font-bold uppercase tracking-widest text-blue-600 hover:bg-blue-50 text-left"
                  >
                    Continue as Guest
                    <User size={16} />
                  </button>
                )}
                <div className="mt-auto p-8 space-y-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex items-center justify-center w-full py-4 text-xs font-bold uppercase tracking-widest text-black border border-gray-300 rounded-xl hover:bg-gray-100 transition-all"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsDrawerOpen(false);
                        }}
                        className="w-full py-4 text-xs font-bold uppercase tracking-widest text-white bg-red-600 rounded-xl shadow-md active:scale-[0.98] transition-all"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/signup"
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex items-center justify-center w-full py-4 text-xs font-bold uppercase tracking-widest text-black border border-gray-300 rounded-xl hover:bg-gray-100 transition-all"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex items-center justify-center w-full py-4 text-xs font-bold uppercase tracking-widest text-white bg-blue-600 rounded-xl shadow-md active:scale-[0.98] transition-all"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const DrawerLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <Link to={to} className="flex items-center gap-4 px-6 py-4 transition-all text-sm font-semibold tracking-widest uppercase text-on-surface-variant hover:bg-slate-50">
    {icon} {label}
  </Link>
);

const Hero = () => (
  <section id="home" className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-white">
    {/* Background Grid & Atmosphere */}
    <div className="absolute inset-0 grid-bg opacity-5" />
    <div className="absolute inset-0 noise-bg opacity-50" />
    <motion.div
      animate={{
        opacity: [0.03, 0.08, 0.03],
        scale: [1, 1.05, 1]
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-gradient-to-b from-blue-300/10 via-transparent to-transparent"
    />
    
    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 py-1.5 px-4 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-6 md:mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Empowering the Next Generation
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-black via-black to-gray-700 leading-[1.2] mb-6 md:mb-8 tracking-tight"
          >
            Leveling the <br className="hidden md:block" /> playing field.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-sm md:text-base text-gray-600 mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Prospect is a non-profit organization dedicated to bridging the educational gap. We provide data-driven career pathing and academic resources to ensure every student has a fair shot at success.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
          >
            <Link to="/signup" className="w-full sm:w-auto px-10 py-3 bg-blue-600 text-white font-bold rounded-full shadow-md hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px] md:text-xs text-center">
              Start Your Journey
            </Link>
            <button className="flex items-center gap-3 text-black font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs group">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-400 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                <Play className="w-3 h-3 fill-current" />
              </div>
              Watch Our Story
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>

    {/* Wave Shape */}
    <div className="absolute bottom-0 left-0 w-full leading-none z-10">
      <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.47,105.1,123.61,105.54,182.2,92.25,240.8,78.96,281.2,65.13,321.39,56.44Z" className="fill-white"></path>
      </svg>
    </div>
  </section>
);

const Features = () => (
  <section id="about" className="py-16 md:py-24 bg-white relative overflow-hidden">
    <div className="absolute inset-0 blueprint-bg opacity-50" />
    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose Prospect?</h2>
        <p className="text-sm md:text-base text-slate-500">We are more than just a career platform. We are a dedicated non-profit committed to providing the resources needed to level the playing field for all students.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <FeatureCard 
          icon={<Smile className="w-8 h-8 text-black" />}
          title="Easy To Use"
          description="Our platform is built with accessibility in mind. Whether you're on a high-end PC or a basic mobile device, navigating your path is simple."
          delay={0.1}
        />
        <FeatureCard 
          icon={<Waves className="w-8 h-8 text-black" />}
          title="Modern Design"
          description="A clean, distraction-free environment that prioritizes your learning and growth. We focus on clarity so you can focus on your future."
          delay={0.2}
        />
        <FeatureCard 
          icon={<Settings2 className="w-8 h-8 text-blue-600" />}
          title="Customizable"
          description="Every student's journey is unique. Tailor your learning dashboard to track your specific goals, from APS improvements to career milestones."
          delay={0.3}
          highlighted
        />
        <FeatureCard 
          icon={<Headphones className="w-8 h-8 text-blue-600" />}
          title="24/7 Support"
          description="Our community of mentors and career architects are always available to provide guidance and answer your critical questions."
          delay={0.4}
        />
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description, delay, highlighted }: { icon: React.ReactNode, title: string, description: string, delay: number, highlighted?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className={cn(
      "p-6 md:p-10 rounded-xl text-center border transition-all duration-300 group",
      highlighted ? "border-blue-600 shadow-2xl shadow-blue-600/10" : "border-slate-100 hover:border-blue-600 hover:shadow-xl"
    )}
  >
    <div className="flex justify-center mb-4 md:mb-6">{icon}</div>
    <h3 className={cn("text-lg md:text-xl font-bold mb-3 md:mb-4", highlighted ? "text-blue-600" : "text-slate-900")}>{title}</h3>
    <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">{description}</p>
    <button className={cn("text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors", highlighted ? "text-blue-600" : "text-slate-900 group-hover:text-blue-600")}>
      Read More
    </button>
  </motion.div>
);

const AppFeatures = () => (
  <section id="features" className="py-24 md:py-40 bg-white relative overflow-hidden">
    <div className="absolute inset-0 blueprint-bg opacity-20" />
    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
        <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase font-headline">Powerful Tools for Your Journey</h2>
        <p className="text-base md:text-xl text-slate-500 leading-relaxed font-medium">
          Advanced tools designed to give you a competitive edge and clear direction in your academic and professional life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        <AppFeatureCard 
          icon={<Smartphone className="w-8 h-8" />}
          title="School Tutorials"
          description="Access a massive library of school tutorials that make complex subjects easy to understand."
        />
        <AppFeatureCard 
          icon={<Waves className="w-8 h-8" />}
          title="Career Explainer"
          description="In-depth insights into various industries to help you find the career path that truly resonates."
        />
        <AppFeatureCard 
          icon={<Users className="w-8 h-8" />}
          title="Community Support"
          description="Connect with a network of students and mentors who share insights and support each other."
        />
        <AppFeatureCard 
          icon={<Zap className="w-8 h-8" />}
          title="APS Calculator"
          description="Quickly calculate your Admission Point Score to see exactly where you stand for university entry."
        />
        <AppFeatureCard 
          icon={<Smartphone className="w-8 h-8" />}
          title="Career Finder"
          description="Advanced matching algorithms to connect your unique skills and interests with opportunities."
        />
        <AppFeatureCard 
          icon={<Headphones className="w-8 h-8" />}
          title="Expert Guidance"
          description="Direct access to career architects who can help you navigate complex decisions and challenges."
        />
      </div>
    </div>
  </section>
);

const AppFeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-6 md:p-10 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/5 transition-all group"
  >
    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white flex items-center justify-center text-blue-600 mb-8 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase font-headline">{title}</h3>
    <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium">{description}</p>
  </motion.div>
);

const HowItWorks = () => (
  <section id="how-it-work" className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
    <div className="absolute inset-0 blueprint-bg opacity-30" />
    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
        <p className="text-sm md:text-base text-slate-500">Simple steps to get started with Prospect and transform your professional journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-black/10 via-slate-400/10 to-black/10 -translate-y-1/2 z-0" />
        
        <StepCard 
          number="01"
          title="Sign Up"
          description="Create your Prospect account in seconds to begin your personalized career journey."
          icon={<User className="w-5 h-5 md:w-6 h-6" />}
        />
        <StepCard 
          number="02"
          title="Take Quiz"
          description="Complete our comprehensive assessment to discover your strengths and ideal career paths."
          icon={<BrainCircuit className="w-5 h-5 md:w-6 h-6" />}
        />
        <StepCard 
          number="03"
          title="Learn and Grow"
          description="Access tailored resources, courses, and tools to build your future with confidence."
          icon={<TrendingUp className="w-5 h-5 md:w-6 h-6" />}
        />
      </div>
    </div>
  </section>
);

const StepCard = ({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) => (
  <div className="relative z-10 flex flex-col items-center text-center">
    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-xl flex items-center justify-center mb-4 md:mb-6 relative group">
      <div className="absolute inset-0 bg-blue-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
      <div className="text-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold border-2 md:border-4 border-white">
        {number}
      </div>
    </div>
    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-4">{title}</h3>
    <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xs">{description}</p>
  </div>
);

const Pricing = () => (
  <section id="pricing" className="py-16 md:py-24 bg-white relative overflow-hidden">
    <div className="absolute inset-0 blueprint-bg opacity-50" />
    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">Our Commitment</h2>
        <p className="text-sm md:text-base text-slate-500 mb-6">As a Non-Profit Organization (NPO), our primary goal is to provide high-quality career guidance to everyone who needs it, completely free of charge.</p>
        <div className="inline-block px-4 py-2 bg-slate-100 rounded-full text-[10px] md:text-xs font-bold text-black uppercase tracking-widest">Always Free • Always Helping</div>
      </div>

      <div className="max-w-sm mx-auto">
        <PricingCard 
          title="Community Access"
          price="Free"
          features={[
            'Full Platform Access', 
            'Career Assessment Quiz', 
            'Course Library & Tutorials', 
            'APS Calculator',
            'Community Support'
          ]}
          highlighted
          delay={0.1}
        />
      </div>
    </div>
  </section>
);

const PricingCard = ({ title, price, period, features, highlighted, delay }: { title: string, price: string, period?: string, features: string[], highlighted?: boolean, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className={cn(
      "p-6 md:p-8 rounded-3xl border transition-all duration-500 flex flex-col relative group",
      highlighted ? "border-blue-600 shadow-[0_32px_64px_-16px_rgba(37,99,235,0.1)] md:scale-105 z-10 bg-white" : "border-slate-100 hover:border-blue-600"
    )}
  >
    {highlighted && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] md:text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl">
        NPO Commitment
      </div>
    )}
    
    <div className="mb-8 md:mb-10 text-center">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 md:mb-4">{title}</h3>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">{price}</span>
        {period && <span className="text-slate-400 font-medium text-xs md:text-sm">{period}</span>}
      </div>
      <div className="mt-4 w-8 h-1 bg-blue-600 mx-auto rounded-full opacity-20 group-hover:opacity-100 transition-opacity" />
    </div>

    <ul className="space-y-4 md:space-y-5 mb-8 md:mb-12 flex-grow">
      {features.map(feature => (
        <li key={feature} className="flex items-start gap-3 md:gap-4 text-xs md:text-sm text-slate-600 group/item">
          <div className="mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
            <ShieldCheck className="w-2.5 h-2.5 md:w-3 h-3" />
          </div>
          <span className="leading-tight">{feature}</span>
        </li>
      ))}
    </ul>

    <button className={cn(
      "w-full py-3.5 md:py-4 rounded-2xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300",
      highlighted ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/10 hover:shadow-blue-600/20" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
    )}>
      Join the Movement
    </button>
  </motion.div>
);

const PlatformFeatures = () => (
  <section id="platform-features" className="relative py-16 md:py-24 bg-gray-900 overflow-hidden">
    <div className="absolute inset-0 grid-bg opacity-10" />
    <div className="absolute inset-0 noise-bg" />
    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="text-center max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-black text-white mb-6 md:mb-8 tracking-tighter"
        >
          Leveling the Playing Field
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-lg text-gray-300 mb-12 md:mb-16 leading-relaxed font-medium"
        >
          We believe that success shouldn't be reserved for a select few. Our mission is to empower disadvantaged individuals by providing the tools and knowledge needed to bridge the gap.
        </motion.p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-left">
          <FeatureItem 
            icon={<BookOpen className="w-6 h-6" />} 
            title="Courses & Tutorials" 
            description="A massive, ever-growing library of school tutorials and professional courses." 
          />
          <FeatureItem 
            icon={<Compass className="w-6 h-6" />} 
            title="Career Explainer" 
            description="In-depth insights into various industries to help you find the career path that resonates." 
          />
          <FeatureItem 
            icon={<BarChart3 className="w-6 h-6" />} 
            title="APS Calculator" 
            description="Quickly calculate your Admission Point Score to see exactly where you stand." 
          />
          <FeatureItem 
            icon={<Users className="w-6 h-6" />} 
            title="Career Finder" 
            description="Advanced matching algorithms to connect your skills with real-world opportunities." 
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 md:mt-24"
        >
          <Link to="/signup" className="px-12 py-5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-600/20">
            Start Learning Now
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex gap-4">
    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white">{icon}</div>
    <div>
      <h3 className="text-base md:text-lg font-bold mb-1 text-white">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

const ImpactStats = () => (
  <section className="py-10 md:py-16 bg-gray-900 relative overflow-hidden">
    <div className="absolute inset-0 grid-bg opacity-10" />
    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
        <StatItem number="50k+" label="Students Empowered" />
        <StatItem number="200+" label="Career Explanations" />
        <StatItem number="100%" label="Free Access" />
        <StatItem number="15+" label="Partner Schools" />
      </div>
    </div>
  </section>
);

const StatItem = ({ number, label }: { number: string, label: string }) => (
  <div className="text-center">
    <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 md:mb-2 tracking-tight">{number}</div>
    <div className="text-[8px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</div>
  </div>
);

const Testimonials = () => (
  <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
    <div className="absolute inset-0 blueprint-bg opacity-20" />
    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">Voices of Success</h2>
        <p className="text-sm md:text-base text-slate-500">Hear from the students and educators who have transformed their journeys with Prospect.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <TestimonialCard 
          quote="Prospect gave me the clarity I needed when I felt lost. The career finder matched me with a path I never considered."
          author="Thabo Mokoena"
          role="University Student"
        />
        <TestimonialCard 
          quote="As a teacher, I've seen firsthand how the tutorials help my students grasp difficult concepts. It's an invaluable resource."
          author="Sarah Jenkins"
          role="High School Educator"
        />
        <TestimonialCard 
          quote="The APS calculator saved me so much stress. I knew exactly what I needed to achieve to get into my dream course."
          author="Lerato Dlamini"
          role="Grade 12 Student"
        />
      </div>
    </div>
  </section>
);

const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <div className="p-6 md:p-8 bg-white rounded-2xl shadow-xl border border-slate-100 relative">
    <Quote className="absolute top-4 right-4 md:top-6 md:right-6 w-6 h-6 md:w-8 md:h-8 text-slate-100" />
    <p className="text-sm md:text-base text-slate-600 italic mb-4 md:mb-6 relative z-10">"{quote}"</p>
    <div>
      <div className="font-bold text-slate-900 text-sm md:text-base">{author}</div>
      <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest">{role}</div>
    </div>
  </div>
);

const MissionStatement = () => (
  <section className="py-24 md:py-40 bg-white relative overflow-hidden">
    <div className="absolute inset-0 blueprint-bg opacity-30" />
    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter uppercase font-headline">Our Vision for the Future</h2>
        <p className="text-base md:text-2xl text-slate-600 mb-16 md:mb-24 leading-relaxed font-medium">
          At Prospect, we envision a world where every student, regardless of their socioeconomic background, has access to the highest quality career guidance. Our platform is constantly evolving, with new tutorials and mentorship opportunities being added every month.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xl shadow-blue-600/20">
              <ShieldCheck className="w-6 h-6 md:w-8 h-8" />
            </div>
            <div className="text-left">
              <div className="font-black text-slate-900 text-lg md:text-xl uppercase font-headline">Verified Impact</div>
              <div className="text-sm md:text-base text-slate-500 font-medium">Over 50,000 students helped since 2019.</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-xl shadow-slate-900/20">
              <Globe className="w-6 h-6 md:w-8 h-8" />
            </div>
            <div className="text-left">
              <div className="font-black text-slate-900 text-lg md:text-xl uppercase font-headline">Global Reach</div>
              <div className="text-sm md:text-base text-slate-500 font-medium">Expanding to 15+ partner schools.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Partners = () => (
  <section className="py-12 md:py-20 bg-slate-50 border-y border-slate-100">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center mb-8 md:mb-12">
        <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Our Trusted Partners</div>
        <div className="w-10 h-0.5 bg-black mx-auto rounded-full" />
      </div>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
        <BrandLogo name="EDU-TECH" slogan="FUTURE OF LEARNING" icon={<BookOpen className="w-6 h-6 md:w-8 h-8 text-black" />} />
        <BrandLogo name="CAREER-PATH" slogan="NAVIGATE SUCCESS" icon={<Compass className="w-6 h-6 md:w-8 h-8 text-black" />} />
        <BrandLogo name="NPO-GLOBAL" slogan="MAKING A DIFFERENCE" icon={<Globe className="w-6 h-6 md:w-8 h-8 text-black" />} />
        <BrandLogo name="SKILL-BUILD" slogan="EMPOWERING YOUTH" icon={<Zap className="w-6 h-6 md:w-8 h-8 text-black" />} />
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="py-16 md:py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="p-6 md:p-10 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Enter Your Message</h2>
          <div className="w-10 h-0.5 bg-blue-600 mb-6 md:mb-8 rounded-full" />
          <p className="text-slate-500 mb-6 md:mb-8 text-xs md:text-sm">Have questions about your career architecture? Send us a message and our experts will get back to you.</p>
          
          <form className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full px-4 md:px-6 py-2.5 md:py-3 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all text-xs md:text-sm" />
            <input type="email" placeholder="Email ID" className="w-full px-4 md:px-6 py-2.5 md:py-3 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all text-xs md:text-sm" />
            <textarea placeholder="Your Message" rows={4} className="w-full px-4 md:px-6 py-2.5 md:py-3 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all resize-none text-xs md:text-sm" />
            <button className="w-full md:w-auto px-10 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 text-[10px] md:text-xs uppercase tracking-widest">
              Send
            </button>
          </form>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 relative group h-[300px] md:h-auto">
          <img src="https://picsum.photos/seed/map/800/600" alt="Map" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-2xl text-center min-w-[120px] md:min-w-[150px]">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                <MapPin className="w-4 h-4 md:w-5 h-5" />
              </div>
              <div className="text-[10px] md:text-xs font-bold text-slate-900 mb-1">Prospect</div>
              <button className="text-[9px] md:text-[10px] font-bold text-blue-600 uppercase tracking-widest">Get Direction</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-20 flex flex-wrap justify-center gap-8 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <BrandLogo name="BRANDNAME" slogan="AWESOME SLOGAN" icon={<Smartphone className="w-6 h-6 md:w-8 h-8 text-blue-600" />} />
        <BrandLogo name="BRAND NAMES" slogan="AWESOME SLOGAN" icon={<Waves className="w-6 h-6 md:w-8 h-8 text-blue-600" />} />
        <BrandLogo name="BRANDNAME" slogan="AWESOME SLOGAN" icon={<Zap className="w-6 h-6 md:w-8 h-8 text-blue-600" />} />
        <BrandLogo name="BRANDNAME" slogan="AWESOME SLOGAN" icon={<TrendingUp className="w-6 h-6 md:w-8 h-8 text-blue-600" />} />
      </div>
    </div>
  </section>
);

const BrandLogo = ({ name, slogan, icon }: { name: string, slogan: string, icon: React.ReactNode }) => (
  <div className="flex items-center gap-2 md:gap-3">
    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center shrink-0">{icon}</div>
    <div className="text-left">
      <div className="text-xs md:text-sm font-black tracking-tighter text-slate-900 leading-none">{name}</div>
      <div className="text-[7px] md:text-[8px] font-bold text-slate-400 tracking-widest mt-0.5">{slogan}</div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-slate-900 pt-8 md:pt-12 pb-4 md:pb-6 text-white relative overflow-hidden">
    <div className="absolute inset-0 grid-bg opacity-5" />
    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 mb-6 md:mb-8">
        <div className="space-y-4 md:space-y-6 text-center sm:text-left">
          <Link to="/" className="flex items-center justify-center sm:justify-start gap-2 group cursor-pointer">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg md:text-xl shadow-lg shadow-blue-600/10">P</div>
            <div className="flex flex-col text-left">
              <span className="text-lg md:text-xl font-bold tracking-tight text-white leading-none">Prospect</span>
              <span className="text-[7px] md:text-[9px] font-medium text-slate-500 uppercase tracking-widest mt-1">Career Architecture</span>
            </div>
          </Link>
          <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed max-w-xs mx-auto sm:mx-0">
            Prospect is a registered Non-Profit Organization (NPO) dedicated to providing equitable career guidance and educational resources to students across the globe.
          </p>
          <div className="flex justify-center sm:justify-start gap-3">
            <SocialIcon icon={<Facebook className="w-3.5 h-3.5 md:w-4 h-4" />} />
            <SocialIcon icon={<Twitter className="w-3.5 h-3.5 md:w-4 h-4" />} />
            <SocialIcon icon={<Instagram className="w-3.5 h-3.5 md:w-4 h-4" />} />
            <SocialIcon icon={<GithubIcon className="w-3.5 h-3.5 md:w-4 h-4" />} />
          </div>
        </div>

        <div className="text-center sm:text-left">
          <FooterNav 
            title="Quick Links" 
            links={[
              { name: 'Home', path: '#home' },
              { name: 'About Us', path: '#about' },
              { name: 'Our Tools', path: '#features' },
              { name: 'How It Works', path: '#how-it-work' },
              { name: 'Our Commitment', path: '#pricing' }
            ]} 
          />
        </div>
        
        <div className="text-center sm:text-left">
          <FooterNav 
            title="Resources" 
            links={[
              { name: 'School Tutorials', path: '#' },
              { name: 'Career Finder', path: '#' },
              { name: 'APS Calculator', path: '#' },
              { name: 'Mentorship Program', path: '#' },
              { name: 'Success Stories', path: '#' }
            ]} 
          />
        </div>
        
        <div className="space-y-4 md:space-y-6 text-center sm:text-left">
          <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-blue-500">Get in Touch</h4>
          <div className="space-y-3 md:space-y-4">
            <ContactInfo icon={<Phone className="w-3.5 h-3.5 md:w-4 h-4" />} text="+27 12 345 6789" />
            <ContactInfo icon={<MapPin className="w-3.5 h-3.5 md:w-4 h-4" />} text="123 Innovation Way, Tech Park, JHB, SA" />
            <ContactInfo icon={<Mail className="w-3.5 h-3.5 md:w-4 h-4" />} text="hello@prospect-npo.org" />
          </div>
        </div>
      </div>

      <div className="pt-6 md:pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <div className="text-slate-500 text-[9px] md:text-[10px] font-medium text-center md:text-left">
          © {new Date().getFullYear()} Prospect NPO. All Rights Reserved.
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          <Link to="#" className="text-[9px] md:text-[10px] text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="#" className="text-[9px] md:text-[10px] text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
          <Link to="#" className="text-[9px] md:text-[10px] text-slate-500 hover:text-white transition-colors">NPO Certification</Link>
        </div>
      </div>
    </div>
  </footer>
);

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <a href="#" className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
    {icon}
  </a>
);

const FooterNav = ({ title, links }: { title: string, links: { name: string, path: string }[] }) => (
  <div className="space-y-4 md:space-y-6">
    <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-blue-500">{title}</h4>
    <ul className="space-y-2 md:space-y-3">
      {links.map(link => (
        <li key={link.name}>
          <a href={link.path} className="text-slate-400 text-[11px] md:text-xs hover:text-blue-600 transition-colors flex items-center gap-2 group">
            <div className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-blue-600 transition-colors" />
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const ContactInfo = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex gap-3 items-center">
    <div className="text-slate-500 shrink-0">{icon}</div>
    <p className="text-slate-400 text-[11px] md:text-xs">{text}</p>
  </div>
);

export default function AppContent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white"
    >
      <Navbar />
      <Hero />
      <Partners />
      <Features />
      <ImpactStats />
      <MissionStatement />
      <AppFeatures />
      <PlatformFeatures />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />
    </motion.div>
  );
}
