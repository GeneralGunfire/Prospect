import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  GraduationCap, 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  ExternalLink,
  ChevronRight,
  BookOpen,
  Building2,
  Briefcase
} from 'lucide-react';
import { careers, Career } from '../data/careers';
import { universities } from '../data/universities';
import { CareerCard } from '../components/CareerCard';
import { useDataSaver } from '../contexts/DataSaverContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const CareerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dataSaverMode } = useDataSaver();
  const [savedCareers, setSavedCareers] = useLocalStorage<string[]>('prospect_sa_saved_careers', []);

  const career = useMemo(() => careers.find(c => c.id === id), [id]);

  const relatedCareers = useMemo(() => {
    if (!career) return [];
    return careers
      .filter(c => c.id !== career.id && c.category === career.category)
      .slice(0, 3);
  }, [career]);

  const isSaved = savedCareers.includes(id || '');

  const toggleSave = () => {
    if (!id) return;
    if (isSaved) {
      setSavedCareers(savedCareers.filter(s => s !== id));
    } else {
      setSavedCareers([...savedCareers, id]);
    }
  };

  if (!career) {
    return (
      <div className="pt-32 pb-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-navy mb-4">Career Not Found</h2>
        <button onClick={() => navigate('/careers')} className="text-secondary font-bold uppercase tracking-widest">
          Back to Careers
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-8 text-[10px] font-bold uppercase tracking-widest text-navy/40">
        <Link to="/careers" className="hover:text-secondary transition-colors">Careers</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-navy">{career.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-secondary">{career.title}</span>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-4 py-1.5 bg-navy/5 text-navy text-[10px] font-bold uppercase tracking-widest rounded-full">
              {career.category}
            </span>
            {career.riasec.map(type => (
              <span key={type} className="w-7 h-7 bg-secondary/10 text-secondary text-xs font-bold flex items-center justify-center rounded-lg">
                {type}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-navy mb-8 uppercase tracking-tight leading-tight">
            {career.title}
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed mb-10 font-normal">
            {career.description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={toggleSave}
              className={`px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                isSaved ? 'bg-secondary text-white' : 'bg-navy text-white hover:bg-secondary'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              {isSaved ? 'Saved to Profile' : 'Save Career'}
            </button>
            <button className="bg-white border border-slate-200 text-navy px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:border-secondary transition-all flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Wallet className="text-secondary w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Avg. Salary</p>
                <p className="text-lg font-bold text-navy">{career.salary}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-navy/5 rounded-2xl flex items-center justify-center shrink-0">
                <TrendingUp className="text-navy w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Market Growth</p>
                <p className="text-lg font-bold text-navy">{career.growth}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                <GraduationCap className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Required APS</p>
                <p className="text-lg font-bold text-navy">{career.aps}+</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs/Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          {/* Education Path */}
          <section>
            <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
              Education Path
            </h3>
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-12 h-12 bg-navy rounded-2xl flex items-center justify-center text-white font-bold shrink-0">1</div>
                <div>
                  <h4 className="text-lg font-bold text-navy mb-2">High School Subjects</h4>
                  <p className="text-sm text-on-surface-variant mb-4">Focus on these subjects to qualify for university entry:</p>
                  <div className="flex flex-wrap gap-2">
                    {career.subjects.map(s => (
                      <span key={s} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-navy uppercase tracking-wider">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-navy rounded-2xl flex items-center justify-center text-white font-bold shrink-0">2</div>
                <div>
                  <h4 className="text-lg font-bold text-navy mb-2">Tertiary Qualification</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {career.education}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Universities */}
          <section>
            <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
              Where to Study
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {career.universities.map(uniId => {
                const uni = universities.find(u => u.id.toLowerCase() === uniId.toLowerCase());
                return (
                  <div key={uniId} className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between hover:border-secondary transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-navy">{uni?.name || uniId}</h4>
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">{uni?.location || 'South Africa'}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-navy/20 group-hover:text-secondary transition-colors" />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bursaries */}
          <section>
            <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
              Available Funding
            </h3>
            <div className="space-y-4">
              {career.bursaries.map(bursary => (
                <div key={bursary} className="bg-navy/5 border border-navy/10 rounded-2xl p-6 flex items-center justify-between group hover:bg-navy/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary shadow-sm">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy">{bursary} Bursary</h4>
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Full Coverage • Applications Open</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-navy uppercase tracking-widest flex items-center gap-2 group-hover:text-secondary transition-colors">
                    Apply Now
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-12">
          {/* Related Careers */}
          <section>
            <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-8">Related Careers</h3>
            <div className="space-y-6">
              {relatedCareers.map(c => (
                <CareerCard key={c.id} career={c} />
              ))}
            </div>
          </section>

          {/* CTA Box */}
          <div className="bg-secondary rounded-3xl p-8 text-white">
            <h4 className="text-xl font-bold mb-4 uppercase tracking-tight">Need Guidance?</h4>
            <p className="text-white/80 text-xs leading-relaxed mb-8">
              Chat with our career advisors to learn more about the day-to-day life of a {career.title}.
            </p>
            <button className="w-full bg-white text-secondary py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-navy hover:text-white transition-all">
              Book a Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
