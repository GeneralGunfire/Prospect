import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Share2, Download, RefreshCw, ArrowRight, CheckCircle2, Star, Bookmark } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';
import { calculateRIASEC, RIASECScore } from '../lib/riasec';
import { careers, Career } from '../data/careers';
import { CareerCard } from '../components/CareerCard';
import { useDataSaver } from '../contexts/DataSaverContext';

export const QuizResultsPage: React.FC = () => {
  const { answers, resetQuiz } = useQuiz();
  const { dataSaverMode } = useDataSaver();
  const navigate = useNavigate();

  const scores = useMemo(() => calculateRIASEC(answers), [answers]);
  const primaryType = scores[0];

  const matchedCareers = useMemo(() => {
    return careers.filter(career => 
      career.riasec.some(type => type === primaryType.type)
    ).slice(0, 3);
  }, [primaryType]);

  const handleRetake = () => {
    resetQuiz();
    navigate('/quiz');
  };

  if (answers.length < 42) {
    return (
      <div className="pt-32 pb-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-navy mb-4">Quiz Incomplete</h2>
        <p className="text-secondary mb-8">Please complete all 42 questions to see your results.</p>
        <Link to="/quiz" className="bg-navy text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest">
          Go to Quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <motion.div
          initial={dataSaverMode ? {} : { opacity: 0, x: -20 }}
          animate={dataSaverMode ? {} : { opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Assessment Complete</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-navy leading-tight mb-6 uppercase tracking-tight">
            You are a <span className="text-secondary">{primaryType.label}</span>
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed mb-8 max-w-lg">
            {primaryType.description} Your profile suggests you thrive in environments that value {primaryType.label.toLowerCase()} traits.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-navy text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button className="bg-white border border-slate-200 text-navy px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:border-secondary transition-all flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Results
            </button>
          </div>
        </motion.div>

        {/* Score Visualization */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-8">RIASEC Profile Breakdown</h3>
          <div className="space-y-6">
            {scores.map((score, index) => (
              <div key={score.type}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-navy/5 text-navy text-[10px] font-bold flex items-center justify-center rounded-md">
                      {score.type}
                    </span>
                    <span className="text-xs font-bold text-navy uppercase tracking-wider">{score.label}</span>
                  </div>
                  <span className="text-xs font-bold text-secondary">{score.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${score.score}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className={`h-full ${index === 0 ? 'bg-secondary' : 'bg-navy/20'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Matched Careers */}
      <div className="mb-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy uppercase tracking-tight mb-2">Recommended Careers</h2>
            <p className="text-secondary text-xs font-medium">Based on your primary interest: {primaryType.label}</p>
          </div>
          <Link to="/careers" className="text-secondary font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
            View All Careers
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {matchedCareers.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight">What's Next?</h2>
            <div className="space-y-6">
              {[
                { title: 'Calculate your APS', desc: 'See which universities you qualify for.', link: '/aps-calculator' },
                { title: 'Find Bursaries', desc: 'Discover funding for your matched careers.', link: '/bursaries' },
                { title: 'Explore Subjects', desc: 'Choose the right subjects for Grade 10.', link: '/subject-selector' },
              ].map((step, i) => (
                <Link 
                  key={i} 
                  to={step.link}
                  className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-secondary font-bold shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 group-hover:text-secondary transition-colors">{step.title}</h4>
                    <p className="text-white/60 text-xs">{step.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-center justify-center text-center p-12 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
            <RefreshCw className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Not feeling it?</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Interests change! You can retake the assessment anytime to see how your profile evolves.
            </p>
            <button 
              onClick={handleRetake}
              className="bg-white text-navy px-10 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all"
            >
              Retake Assessment
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -mr-48 -mt-48" />
      </div>
    </div>
  );
};
