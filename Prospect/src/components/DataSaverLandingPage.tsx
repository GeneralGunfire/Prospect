import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
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
  User
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useDataSaver } from '../contexts/DataSaverContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', path: '#features' },
    { name: 'Gallery', path: '#gallery' },
    { name: 'Articles', path: '#articles' },
    { name: 'Contact', path: '#contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsDrawerOpen(false);
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 py-4 md:py-6",
        isScrolled ? "bg-soft-black/90 backdrop-blur-md shadow-xl py-3 md:py-4" : "bg-transparent"
      )}>
        <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">P</div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight leading-none text-white">Prospect</span>
                <span className="text-[9px] font-medium uppercase tracking-widest text-slate-400">Career Architecture</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => scrollToSection(link.path)}
                className="text-white/80 font-bold tracking-widest text-[11px] uppercase hover:text-white transition-colors"
              >
                {link.name}
              </button>
            ))}
            <Link to="/auth" className="px-8 py-2.5 bg-blue-600 text-white font-bold text-[11px] uppercase tracking-widest rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
              Get Started
            </Link>
          </div>

          <div className="flex items-center gap-6 md:hidden">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
          >
            <div className="absolute inset-0 bg-soft-black/60 backdrop-blur-md" onClick={() => setIsDrawerOpen(false)} />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-y-0 right-0 w-full sm:w-[350px] bg-soft-black shadow-2xl flex flex-col border-l border-white/10"
            >
              <div className="flex items-center justify-between p-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/20">P</div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight leading-none text-white">Prospect</span>
                    <span className="text-[8px] font-medium uppercase tracking-widest text-slate-500">Career Architecture</span>
                  </div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="flex flex-col py-8 px-4 overflow-y-auto">
                {navLinks.map((link) => (
                  <button 
                    key={link.name}
                    onClick={() => scrollToSection(link.path)}
                    className="flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left"
                  >
                    {link.name}
                  </button>
                ))}
                
                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4 px-4">
                  <Link 
                    to="/auth" 
                    state={{ isLogin: true }}
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full text-center py-4 text-xs font-bold tracking-[0.2em] uppercase text-white border border-white/20 rounded-xl hover:bg-white/5 transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/auth" 
                    state={{ isLogin: false }}
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full text-center py-4 text-xs font-bold tracking-[0.2em] uppercase text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const DrawerLink = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <a href="#" className={cn(
    "flex items-center gap-4 px-6 py-4 text-sm font-semibold tracking-widest uppercase",
    active ? "bg-slate-50 text-secondary border-l-4 border-secondary" : "text-on-surface-variant hover:bg-slate-50"
  )}>
    {icon} {label}
  </a>
);

const Hero = () => (
  <section className="pt-32 pb-20 md:pt-56 md:pb-40 relative overflow-hidden bg-soft-black">
    {/* Background Atmosphere */}
    <div className="absolute inset-0 opacity-40 pointer-events-none">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
      <div className="absolute inset-0 grid-bg opacity-10" />
    </div>
    
    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.1] mb-8 font-headline uppercase">
            Precision <br/> Career <br/> Architecture
          </h1>
          <p className="text-base md:text-xl text-white/60 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
            We build careers with the same rigor used in industrial engineering. Leveling the playing field for the next generation of leaders.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/quiz" className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white font-black rounded-full uppercase tracking-[0.2em] text-xs flex items-center justify-center hover:bg-blue-500 transition-all hover:-translate-y-1 active:scale-95 shadow-2xl shadow-blue-600/20">
              Begin Assessment
            </Link>
            <button className="w-full sm:w-auto px-12 py-5 bg-white/5 text-white font-black rounded-full uppercase tracking-[0.2em] text-xs flex items-center justify-center hover:bg-white/10 transition-all border border-white/10">
              Our Mission
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Stats = () => (
  <section className="bg-navy py-12 md:py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-12 gap-x-4 md:gap-x-8">
        <StatItem value="250k+" label="Profiles Guided" />
        <StatItem value="98.4%" label="Accuracy Rate" />
        <StatItem value="12k+" label="Industry Partners" />
        <StatItem value="45%" label="Average Salary Lift" />
      </div>
    </div>
  </section>
);

const StatItem = ({ value, label }: { value: string, label: string }) => (
  <div className="text-center md:text-left">
    <div className="text-3xl md:text-5xl font-semibold text-white mb-1 md:mb-2 tracking-tight">{value}</div>
    <div className="text-[9px] md:text-xs uppercase tracking-[0.15em] font-semibold text-slate-400">{label}</div>
  </div>
);

const Features = () => (
  <section id="features" className="py-20 md:py-32 bg-white relative overflow-hidden">
    <div className="absolute inset-0 blueprint-bg opacity-10 pointer-events-none" />
    <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
      <h2 className="text-xs font-bold tracking-[0.3em] text-blue-600 uppercase mb-4">Features</h2>
      <h3 className="text-3xl md:text-5xl font-black text-soft-black mb-16 uppercase font-headline">What we offer</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <FeatureItem 
          icon={<Zap className="w-8 h-8" />} 
          title="Fast Performance" 
          description="Optimized for low data usage without compromising on speed or quality." 
        />
        <FeatureItem 
          icon={<ShieldCheck className="w-8 h-8" />} 
          title="Secure Data" 
          description="Your personal information and career data are protected with enterprise-grade security." 
        />
        <FeatureItem 
          icon={<Globe className="w-8 h-8" />} 
          title="Global Reach" 
          description="Access career insights and educational resources from anywhere in the world." 
        />
      </div>
    </div>
  </section>
);

const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex flex-col items-center group">
    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-2 shadow-sm">
      {icon}
    </div>
    <h4 className="text-xl font-bold mb-4 text-soft-black uppercase tracking-tight">{title}</h4>
    <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{description}</p>
  </div>
);

const Gallery = () => (
  <section id="gallery" className="py-20 md:py-32 bg-soft-black text-white relative overflow-hidden">
    <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
    <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
      <h2 className="text-xs font-bold tracking-[0.3em] text-blue-400 uppercase mb-4">Gallery</h2>
      <h3 className="text-3xl md:text-5xl font-black mb-16 uppercase font-headline">Our Impact</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-video bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative group cursor-pointer">
            <img 
              src={`https://picsum.photos/seed/gallery${i}/800/600`} 
              alt={`Gallery ${i}`} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/40 transition-all duration-300 flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <ArrowRight className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Articles = () => (
  <section id="articles" className="py-20 md:py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <h2 className="text-xs font-bold tracking-[0.3em] text-blue-600 uppercase mb-4">Articles</h2>
      <h3 className="text-3xl md:text-5xl font-black text-soft-black mb-16 uppercase font-headline">Latest Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col md:flex-row gap-6 p-6 rounded-3xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
            <div className="w-full md:w-48 h-48 bg-slate-100 rounded-2xl flex-shrink-0 overflow-hidden">
              <img 
                src={`https://picsum.photos/seed/article${i}/400/400`} 
                alt="Article" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Career Guidance</div>
              <h4 className="text-xl font-bold text-soft-black mb-3 group-hover:text-blue-600 transition-colors">Navigating the Future of Work in the AI Era</h4>
              <p className="text-slate-500 text-sm mb-4">Discover how emerging technologies are reshaping career paths and what skills you need to stay ahead.</p>
              <button className="text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Read more <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="py-20 md:py-32 bg-soft-black text-white relative overflow-hidden">
    <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
    <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
      <h2 className="text-xs font-bold tracking-[0.3em] text-blue-400 uppercase mb-4">Contact</h2>
      <h3 className="text-3xl md:text-5xl font-black mb-12 uppercase font-headline">Get in touch</h3>
      
      <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Name</label>
            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white" placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Email</label>
            <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white" placeholder="Your email" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Message</label>
          <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white" placeholder="Your message" />
        </div>
        <button className="w-full py-4 bg-blue-600 text-white font-black rounded-xl uppercase tracking-[0.2em] text-xs hover:bg-blue-500 transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20">
          Send Message
        </button>
      </form>
    </div>
  </section>
);

const CareerPathways = () => (
  <section className="py-16 md:py-32 bg-slate-50 border-y border-slate-100">
    <div className="max-w-7xl mx-auto px-6 mb-8 md:mb-12 flex items-center justify-between">
      <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-navy font-headline">
        High-Growth Pathways
      </h2>
    </div>
    <div className="flex md:grid md:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto overflow-x-auto md:overflow-visible pb-8 md:pb-0 hide-scrollbar snap-x snap-mandatory">
      <CareerCard 
        tag="High Growth" 
        salary="$145k Avg." 
        title="Quantitative Strategist" 
        description="Bridging high-frequency trading data with long-term investment architecture."
        alumni="840 Alumni Active"
        images={[
          "https://picsum.photos/seed/exec1/100/100",
          "https://picsum.photos/seed/exec2/100/100"
        ]}
      />
      <CareerCard 
        tag="Emerging Sector" 
        salary="$110k Avg." 
        title="Energy Architect" 
        description="Designing sustainable infrastructure for the next generation of power grids."
        alumni="1.2k Alumni Active"
        images={[
          "https://picsum.photos/seed/exec3/100/100",
          "https://picsum.photos/seed/exec4/100/100"
        ]}
      />
      <CareerCard 
        tag="Global Demand" 
        salary="$168k Avg." 
        title="Forensics Director" 
        description="Leading the defense of institutional digital assets in the AI era."
        alumni="450 Alumni Active"
        images={[
          "https://picsum.photos/seed/exec5/100/100",
          "https://picsum.photos/seed/exec6/100/100"
        ]}
      />
    </div>
  </section>
);

const CareerCard = ({ tag, salary, title, description, alumni, images }: any) => (
  <div className="min-w-[75vw] sm:min-w-[380px] md:min-w-full snap-center bg-white p-6 md:p-10 rounded-2xl border border-slate-100">
    <div className="flex justify-between items-start mb-6 md:mb-8">
      <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-semibold tracking-widest uppercase rounded">{tag}</span>
      <span className="text-navy text-sm font-semibold tracking-tight">{salary}</span>
    </div>
    <h3 className="text-xl md:text-3xl font-semibold mb-3 tracking-tight text-navy font-headline">{title}</h3>
    <p className="text-on-surface-variant text-sm md:text-base font-normal mb-8 md:mb-10 leading-relaxed">{description}</p>
    <div className="flex items-center gap-3 mb-8 md:mb-10 p-3 bg-slate-50 rounded-xl">
      <div className="flex -space-x-3">
        {images.map((src: string, i: number) => (
          <img key={i} className="w-10 h-10 rounded-full border-2 border-white object-cover" src={src} alt="Alumni" referrerPolicy="no-referrer" />
        ))}
      </div>
      <span className="text-[11px] text-navy font-semibold uppercase tracking-wider">{alumni}</span>
    </div>
    <Link className="text-secondary font-semibold text-sm inline-flex items-center gap-2 tracking-widest uppercase py-2" to="/careers">
      Explore Path <ArrowRight className="w-4 h-4" />
    </Link>
  </div>
);

const BentoGrid = () => (
  <section id="mission" className="py-16 md:py-40 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-24 gap-8">
        <div className="max-w-2xl">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary mb-4">The Prospect Advantage</div>
          <h2 className="text-3xl md:text-6xl font-semibold tracking-tight text-navy leading-[1.05] mb-6 md:mb-8 font-headline">
            Precision Engineering <br/> for Your Career.
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg font-normal leading-relaxed max-w-lg">
            We go beyond simple suggestions. We build careers with the same rigor used in industrial engineering and mathematical modeling.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <div className="md:col-span-2 md:row-span-2 bg-slate-50 p-6 md:p-12 rounded-3xl flex flex-col justify-between border border-slate-100">
          <div>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-8 md:mb-10">
              <Database className="text-secondary w-6 h-6" />
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 tracking-tight text-navy font-headline">Proprietary Labor Databank</h3>
            <p className="text-on-surface-variant font-normal text-base leading-relaxed max-w-md">
              Access exclusive hiring trends and salary benchmarks not found on public job boards. We see where the market is moving 18 months ahead.
            </p>
          </div>
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-50 bg-slate-200 overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Updated Hourly</div>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-navy text-white p-8 md:p-10 rounded-3xl flex flex-col justify-between">
          <div>
            <Users className="text-secondary w-10 h-10 mb-6" />
            <h3 className="text-2xl font-semibold mb-4 tracking-tight font-headline">Global Alumni Network</h3>
            <p className="text-slate-400 font-normal leading-relaxed text-sm max-w-sm">
              Connect directly with alumni in top-tier positions at McKinsey, SpaceX, and Goldman Sachs.
            </p>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <div className="w-24 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
               <div className="text-2xl font-semibold text-secondary">2.5k+</div>
            </div>
            <div className="flex -space-x-2">
              {[5,6,7].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border border-navy bg-slate-800 overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-3xl flex flex-col justify-between">
          <ShieldCheck className="text-secondary w-10 h-10 mb-6" />
          <div>
            <h3 className="text-xl font-semibold mb-2 tracking-tight text-navy font-headline">Certified Verification</h3>
            <p className="text-on-surface-variant font-normal text-xs leading-relaxed">
              A verified standard recognized by premier recruiting firms.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <Globe className="text-secondary w-10 h-10 mb-6" />
            <h3 className="text-xl font-semibold mb-2 tracking-tight font-headline">Enterprise Scale</h3>
            <p className="text-slate-400 font-normal text-xs leading-relaxed">
              Deployed across 40+ university career centers and top corporate programs.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Testimonial = () => (
  <section id="testimonials" className="py-16 md:py-32 bg-slate-50 border-t border-slate-100">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <Quote className="text-secondary/30 w-12 h-12 md:w-16 md:h-16 mb-8 md:mb-10 mx-auto" />
      <blockquote className="text-xl md:text-4xl font-light italic text-navy leading-snug mb-10 md:mb-12">
        "Prospect SA didn't just give me a list of jobs; they gave me a mathematical model for my growth. Two years later, I'm exactly where they predicted I would thrive."
      </blockquote>
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <img className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" src="https://picsum.photos/seed/marcus/200/200" alt="Marcus Thorne" referrerPolicy="no-referrer" />
        </div>
        <div className="font-semibold text-xl text-navy tracking-tight mb-1">Marcus Thorne</div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-secondary font-semibold">Director of Product, FinStream</div>
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="py-16 md:py-40 bg-white">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <h2 className="text-3xl md:text-7xl font-semibold tracking-tight text-navy mb-6 md:mb-8 leading-[1.1] font-headline">
        Your Architecture <br/> Awaits.
      </h2>
      <p className="text-on-surface-variant font-normal text-base md:text-lg mb-10 md:mb-16 max-w-xl mx-auto">
        Join thousands of high-performers who have already mapped their journey with Prospect SA.
      </p>
      <Link to="/quiz" className="min-h-[50px] md:min-h-[60px] px-10 py-4 md:px-14 md:py-6 bg-secondary text-on-secondary text-sm font-semibold rounded-xl uppercase tracking-widest inline-flex items-center justify-center">
        Begin Assessment
      </Link>
    </div>
  </section>
);

const Footer = () => {
  const { toggleMode } = useDataSaver();

  return (
    <footer className="bg-white py-12 px-6 border-t border-slate-100">
      <div className="max-w-7xl mx-auto text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">P</div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold tracking-tight leading-none text-soft-black">Prospect</span>
            <span className="text-[9px] font-medium uppercase tracking-widest text-slate-400">Career Architecture</span>
          </div>
        </Link>
        
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <Link className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors" to="/about">About</Link>
          <Link className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors" to="/careers">Careers</Link>
          <Link className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors" to="/quiz">Quiz</Link>
          <Link className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors" to="/about">Privacy</Link>
          <Link className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors" to="/about">Terms</Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-100 gap-4">
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            © 2026 PROSPECT. ALL RIGHTS RESERVED.
          </div>
          <button 
            onClick={toggleMode}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <Zap size={12} className="text-blue-600" />
            Data Saver Mode
          </button>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }: { title: string, links: {name: string, path: string}[] }) => (
  <div className="space-y-3">
    <h4 className="text-[8px] font-semibold uppercase tracking-widest text-secondary">{title}</h4>
    <ul className="space-y-1.5">
      {links.map(link => (
        <li key={link.name}>
          <Link className="text-[10px] text-white/40 hover:text-white transition-colors" to={link.path}>{link.name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export const DataSaverLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Gallery />
      <Articles />
      <Contact />
      <Footer />
    </div>
  );
};
