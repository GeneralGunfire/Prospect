import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ArrowRight, 
  Wallet, 
  GraduationCap, 
  Building2,
  HelpCircle,
  FileText
} from 'lucide-react';
import { bursaries, Bursary } from '../data/bursaries';
import { cn } from '../lib/utils';

export const BursaryEligibilityPage: React.FC = () => {
  const [householdIncome, setHouseholdIncome] = useState<number | ''>('');
  const [isCitizen, setIsCitizen] = useState<boolean | null>(null);
  const [isDisability, setIsDisability] = useState<boolean | null>(null);
  const [academicAverage, setAcademicAverage] = useState<number | ''>('');

  const nsfasEligible = useMemo(() => {
    if (householdIncome === '' || isCitizen === null) return null;
    
    // NSFAS basic criteria: SA Citizen + Household Income < R350,000 (R600,000 for students with disabilities)
    const incomeLimit = isDisability ? 600000 : 350000;
    return isCitizen && householdIncome <= incomeLimit;
  }, [householdIncome, isCitizen, isDisability]);

  const recommendedBursaries = useMemo(() => {
    if (academicAverage === '') return [];
    return bursaries.filter(b => {
      const minReq = b.requirements.find(r => r.includes('% Average'));
      if (!minReq) return true;
      const reqVal = parseInt(minReq.replace('% Average', ''));
      return academicAverage >= reqVal;
    }).slice(0, 3);
  }, [academicAverage]);

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Eligibility Checker</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6 uppercase tracking-tight">
          Funding <span className="text-secondary">Eligibility</span>
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base leading-relaxed font-normal">
          Check if you qualify for NSFAS and other major bursaries in South Africa based on your financial and academic profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm mb-8">
            <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-10">Your Profile</h3>
            
            <div className="space-y-8">
              {/* Household Income */}
              <div>
                <label className="block text-[10px] font-bold text-navy uppercase tracking-widest mb-4">Annual Household Income (R)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy font-bold">R</span>
                  <input
                    type="number"
                    placeholder="e.g. 150000"
                    value={householdIncome}
                    onChange={(e) => setHouseholdIncome(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-4 text-sm font-bold text-navy focus:border-secondary transition-all outline-none"
                  />
                </div>
                <p className="mt-2 text-[9px] text-secondary font-medium italic">Include combined income of parents/guardians.</p>
              </div>

              {/* SA Citizen */}
              <div>
                <label className="block text-[10px] font-bold text-navy uppercase tracking-widest mb-4">Are you a South African Citizen?</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsCitizen(true)}
                    className={cn(
                      "flex-grow py-4 rounded-2xl border font-bold text-[10px] uppercase tracking-widest transition-all",
                      isCitizen === true ? "bg-navy border-navy text-white" : "bg-white border-slate-100 text-navy hover:border-secondary"
                    )}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setIsCitizen(false)}
                    className={cn(
                      "flex-grow py-4 rounded-2xl border font-bold text-[10px] uppercase tracking-widest transition-all",
                      isCitizen === false ? "bg-navy border-navy text-white" : "bg-white border-slate-100 text-navy hover:border-secondary"
                    )}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Disability */}
              <div>
                <label className="block text-[10px] font-bold text-navy uppercase tracking-widest mb-4">Do you have a disability?</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsDisability(true)}
                    className={cn(
                      "flex-grow py-4 rounded-2xl border font-bold text-[10px] uppercase tracking-widest transition-all",
                      isDisability === true ? "bg-navy border-navy text-white" : "bg-white border-slate-100 text-navy hover:border-secondary"
                    )}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setIsDisability(false)}
                    className={cn(
                      "flex-grow py-4 rounded-2xl border font-bold text-[10px] uppercase tracking-widest transition-all",
                      isDisability === false ? "bg-navy border-navy text-white" : "bg-white border-slate-100 text-navy hover:border-secondary"
                    )}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Academic Average */}
              <div>
                <label className="block text-[10px] font-bold text-navy uppercase tracking-widest mb-4">Academic Average (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g. 75"
                    value={academicAverage}
                    onChange={(e) => setAcademicAverage(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-navy focus:border-secondary transition-all outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-8 bg-navy/5 rounded-3xl flex gap-6 border border-navy/10">
            <Info className="w-6 h-6 text-navy shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-navy mb-2 uppercase tracking-tight">Important Note</h4>
              <p className="text-xs text-navy/70 leading-relaxed">
                This tool provides an estimate based on current public criteria. Official eligibility is determined by the respective funding bodies (NSFAS, ISFAP, etc.) upon formal application.
              </p>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            {/* NSFAS Status */}
            <div className={cn(
              "rounded-3xl p-8 text-white shadow-xl transition-all duration-500",
              nsfasEligible === null ? "bg-navy" : nsfasEligible ? "bg-green-600 shadow-green-600/20" : "bg-red-600 shadow-red-600/20"
            )}>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-8">NSFAS Status</h3>
              
              <AnimatePresence mode="wait">
                {nsfasEligible === null ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <HelpCircle className="w-12 h-12 text-white/20 mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">Complete the form to see status</p>
                  </div>
                ) : nsfasEligible ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2 uppercase tracking-tight">Likely Eligible</h4>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-8">You meet the financial criteria</p>
                    <a href="https://www.nsfas.org.za" target="_blank" rel="noopener noreferrer" className="w-full bg-white text-green-600 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-navy hover:text-white transition-all flex items-center justify-center gap-2">
                      Apply on NSFAS Portal
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2 uppercase tracking-tight">Not Eligible</h4>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-8">Income exceeds threshold</p>
                    <Link to="/bursaries" className="w-full bg-white text-red-600 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-navy hover:text-white transition-all flex items-center justify-center gap-2">
                      View Private Bursaries
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Recommended Bursaries */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-[10px] font-bold text-navy uppercase tracking-[0.2em] mb-8">Academic Matches</h3>
              <div className="space-y-6">
                {recommendedBursaries.length > 0 ? (
                  recommendedBursaries.map(bursary => (
                    <div key={bursary.id} className="group cursor-pointer">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Wallet className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-navy group-hover:text-secondary transition-colors">{bursary.name}</h4>
                          <p className="text-[9px] text-secondary font-bold uppercase tracking-widest">{bursary.provider}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <GraduationCap className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs text-secondary font-medium">Enter your average to see matches.</p>
                  </div>
                )}
              </div>
              {recommendedBursaries.length > 0 && (
                <Link to="/bursaries" className="w-full mt-8 py-4 border border-slate-100 rounded-xl text-[10px] font-bold text-navy uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  Explore All Bursaries
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Required Documents */}
            <div className="bg-navy/5 border border-navy/10 rounded-3xl p-8">
              <h3 className="text-[10px] font-bold text-navy uppercase tracking-[0.2em] mb-6">Required Documents</h3>
              <ul className="space-y-4">
                {[
                  'Certified Copy of ID',
                  'Latest Academic Results',
                  'Proof of Residence',
                  'Parents/Guardians ID Copies',
                  'Proof of Household Income'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-medium text-navy/70">
                    <FileText className="w-4 h-4 text-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
