import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, ChevronRight, Info, ArrowLeft, TrendingUp, GraduationCap, BookOpen } from 'lucide-react';
import type { AppPage } from '../lib/withAuth';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Props {
  onNavigate: (page: AppPage) => void;
  onNavigateHome: () => void;
}

interface SubjectMark {
  subject: string;
  mark: number | '';
}

// ── Constants ──────────────────────────────────────────────────────────────────

const DEFAULT_SUBJECTS: SubjectMark[] = [
  { subject: 'English Home Language / First Additional', mark: '' },
  { subject: 'Mathematics / Mathematical Literacy', mark: '' },
  { subject: 'Life Orientation', mark: '' },
  { subject: 'Physical Sciences', mark: '' },
  { subject: 'Life Sciences', mark: '' },
  { subject: 'Accounting', mark: '' },
  { subject: 'History / Geography / Business Studies', mark: '' },
];

const CAREER_APS_TABLE = [
  { title: 'Medicine (MBChB)', institution: 'UCT / Wits / Stellenbosch', minAps: 36, category: 'university' },
  { title: 'Dentistry (BChD)', institution: 'UWC / Wits', minAps: 34, category: 'university' },
  { title: 'Pharmacy (BPharm)', institution: 'Multiple universities', minAps: 30, category: 'university' },
  { title: 'Law (LLB)', institution: 'UCT / UP / Stellenbosch', minAps: 28, category: 'university' },
  { title: 'Engineering (BEng)', institution: 'UCT / Wits / Stellenbosch', minAps: 30, category: 'university' },
  { title: 'Civil Engineering', institution: 'Multiple universities', minAps: 28, category: 'university' },
  { title: 'Electrical Engineering', institution: 'Multiple universities', minAps: 28, category: 'university' },
  { title: 'Computer Science (BSc)', institution: 'Multiple universities', minAps: 26, category: 'university' },
  { title: 'Chartered Accountancy (BCom Accounting)', institution: 'Multiple universities', minAps: 26, category: 'university' },
  { title: 'Architecture (BArch)', institution: 'UCT / Wits / TUT', minAps: 26, category: 'university' },
  { title: 'Psychology (BA / BSc)', institution: 'Multiple universities', minAps: 24, category: 'university' },
  { title: 'Teaching (BEd)', institution: 'Multiple universities', minAps: 22, category: 'university' },
  { title: 'Social Work (BSocWork)', institution: 'Multiple universities', minAps: 20, category: 'university' },
  { title: 'Nursing (Bridging Programme)', institution: 'UNISA / Multiple', minAps: 20, category: 'university' },
  { title: 'Data Science / Analytics', institution: 'UNISA / Wits', minAps: 24, category: 'digital' },
  { title: 'Software Development (Diploma)', institution: 'TUT / CPUT / DUT', minAps: 20, category: 'digital' },
  { title: 'Graphic Design (Diploma)', institution: 'VEGA / CPUT / TUT', minAps: 18, category: 'creative' },
  { title: 'Electrical Installation (N-Diploma)', institution: 'TVET Colleges', minAps: 0, category: 'trade' },
  { title: 'Plumbing (N-Diploma)', institution: 'TVET Colleges', minAps: 0, category: 'trade' },
  { title: 'Motor Mechanics (N-Diploma)', institution: 'TVET Colleges', minAps: 0, category: 'trade' },
  { title: 'Welding & Fabrication', institution: 'TVET Colleges', minAps: 0, category: 'trade' },
  { title: 'Carpentry & Joinery', institution: 'TVET Colleges', minAps: 0, category: 'trade' },
  { title: 'Hairdressing (NQF 4)', institution: 'TVET Colleges', minAps: 0, category: 'trade' },
  { title: 'Beauty Therapy (NQF 4)', institution: 'TVET Colleges', minAps: 0, category: 'trade' },
  { title: 'Business Management (ND)', institution: 'TVET Colleges', minAps: 16, category: 'university' },
  { title: 'Tourism (ND)', institution: 'TVET Colleges', minAps: 16, category: 'university' },
  { title: 'Hospitality & Catering (ND)', institution: 'TVET Colleges', minAps: 14, category: 'trade' },
  { title: 'Agricultural Management', institution: 'Elsenburg / LUT', minAps: 18, category: 'agriculture' },
  { title: 'Journalism (Diploma / BA)', institution: 'Multiple', minAps: 20, category: 'creative' },
];

const CATEGORY_LABELS: Record<string, string> = {
  university: 'University',
  digital: 'Digital / Tech',
  creative: 'Creative',
  trade: 'Trade / TVET',
  agriculture: 'Agriculture',
};

const CATEGORY_COLORS: Record<string, string> = {
  university: 'bg-blue-100 text-blue-700',
  digital: 'bg-blue-100 text-blue-700',
  creative: 'bg-slate-100 text-slate-600',
  trade: 'bg-slate-100 text-slate-700',
  agriculture: 'bg-lime-100 text-lime-700',
};

// ── APS Calculation ────────────────────────────────────────────────────────────

function markToPoints(mark: number): number {
  if (mark >= 90) return 7;
  if (mark >= 80) return 6;
  if (mark >= 70) return 5;
  if (mark >= 60) return 4;
  if (mark >= 50) return 3;
  if (mark >= 40) return 2;
  return 1;
}

function calculateAPS(subjects: SubjectMark[]): number {
  const validMarks = subjects
    .filter((s) => s.mark !== '' && s.mark >= 0 && s.mark <= 100)
    .map((s) => markToPoints(s.mark as number))
    .sort((a, b) => b - a)
    .slice(0, 6);
  return validMarks.reduce((sum, pts) => sum + pts, 0);
}

function getInterpretation(aps: number): { label: string; color: string; desc: string } {
  if (aps >= 36) return { label: 'Excellent', color: 'text-green-700', desc: 'You qualify for top university programmes including Medicine, Engineering, and Law.' };
  if (aps >= 30) return { label: 'Strong', color: 'text-blue-700', desc: 'Most university degree programmes are within reach.' };
  if (aps >= 24) return { label: 'Good', color: 'text-blue-700', desc: 'Many university and college programmes are accessible to you.' };
  if (aps >= 18) return { label: 'Average', color: 'text-amber-700', desc: 'Diploma and TVET programmes are a great fit. Some universities accept lower APS with conditional entry.' };
  if (aps >= 14) return { label: 'Below Average', color: 'text-slate-700', desc: 'TVET colleges offer strong career paths. Consider N-Diplomas in trades or business.' };
  return { label: 'Entry Level', color: 'text-red-700', desc: 'TVET trade certificates require no minimum APS. You can still build a successful career.' };
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function APSCalculatorPage({ onNavigate, onNavigateHome }: Props) {
  const [subjects, setSubjects] = useState<SubjectMark[]>(DEFAULT_SUBJECTS);
  const [calculated, setCalculated] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filledCount = subjects.filter((s) => s.mark !== '').length;
  const aps = calculated ? calculateAPS(subjects) : 0;
  const interpretation = calculated ? getInterpretation(aps) : null;

  const eligibleCareers = calculated
    ? CAREER_APS_TABLE.filter((c) => c.minAps <= aps)
    : [];

  const filteredCareers =
    filterCategory === 'all'
      ? eligibleCareers
      : eligibleCareers.filter((c) => c.category === filterCategory);

  const categories = ['all', ...Array.from(new Set(eligibleCareers.map((c) => c.category)))];

  function handleMarkChange(index: number, value: string) {
    const num = value === '' ? '' : Math.min(100, Math.max(0, parseInt(value) || 0));
    setSubjects((prev) => prev.map((s, i) => (i === index ? { ...s, mark: num } : s)));
    setCalculated(false);
  }

  function handleCalculate() {
    if (filledCount < 4) return;
    setCalculated(true);
    setFilterCategory('all');
  }

  function handleReset() {
    setSubjects(DEFAULT_SUBJECTS);
    setCalculated(false);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple sticky header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3 h-14 px-4 max-w-2xl mx-auto">
          <button
            onClick={onNavigateHome}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <Calculator className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-navy text-sm uppercase tracking-tight">APS Calculator</span>
          </div>
        </div>
      </header>

      <div className="pb-16 px-4 max-w-2xl mx-auto pt-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-navy uppercase tracking-tight mb-1">APS Calculator</h1>
          <p className="text-sm text-slate-500">Admission Point Score for South African matric</p>
        </div>

        {/* Info box */}
        <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            <span className="font-bold">How APS works:</span> Each subject mark (0–100%) converts to a point value (1–7). Your APS is the sum of your best 6 subjects. Life Orientation counts at half value at most institutions.
          </p>
        </div>

        {/* Subject inputs */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-6">
          <h2 className="text-sm font-black text-navy uppercase tracking-widest mb-5">Enter Your Marks</h2>

          <div className="space-y-3">
            {subjects.map((s, i) => {
              const pts = s.mark !== '' ? markToPoints(s.mark as number) : null;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <label className="text-xs text-slate-500 font-medium truncate block mb-1">{s.subject}</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={s.mark}
                      onChange={(e) => handleMarkChange(i, e.target.value)}
                      placeholder="0–100"
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 placeholder:text-slate-300"
                    />
                  </div>
                  {pts !== null && (
                    <div className="shrink-0 text-center w-12">
                      <p className="text-xs text-slate-400 uppercase tracking-wider">pts</p>
                      <p className={`text-xl font-black ${pts >= 5 ? 'text-green-600' : pts >= 3 ? 'text-amber-600' : 'text-red-500'}`}>{pts}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCalculate}
              disabled={filledCount < 4}
              className="flex-1 flex items-center justify-center gap-2 h-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Calculator className="w-4 h-4" />
              Calculate APS
            </button>
            {calculated && (
              <button
                onClick={handleReset}
                className="px-4 h-12 border border-slate-200 text-slate-500 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {filledCount > 0 && filledCount < 4 && (
            <p className="text-xs text-amber-600 text-center mt-3">Enter at least 4 subjects to calculate</p>
          )}
        </div>

        {/* Results */}
        <AnimatePresence>
          {calculated && interpretation && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* APS Score card */}
              <div className="bg-navy rounded-3xl p-8 text-center text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60 mb-2">Your APS Score</p>
                <p className="text-7xl font-black mb-1">{aps}</p>
                <p className="text-sm text-white/60 mb-4">out of 42</p>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(aps / 42) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <p className={`text-lg font-black ${interpretation.color.replace('text-', 'text-').replace('-700', '-300')}`}>
                  {interpretation.label}
                </p>
                <p className="text-sm text-white/70 mt-2 leading-relaxed max-w-xs mx-auto">
                  {interpretation.desc}
                </p>
              </div>

              {/* Per-subject breakdown */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xs font-black text-navy uppercase tracking-widest mb-4">Subject Breakdown</h3>
                <div className="space-y-2">
                  {subjects
                    .filter((s) => s.mark !== '')
                    .sort((a, b) => markToPoints(b.mark as number) - markToPoints(a.mark as number))
                    .slice(0, 6)
                    .map((s, i) => {
                      const pts = markToPoints(s.mark as number);
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-slate-600 truncate">{s.subject}</span>
                              <span className="text-xs font-bold text-slate-800 ml-2 shrink-0">{s.mark}% → {pts} pts</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${pts >= 5 ? 'bg-green-500' : pts >= 3 ? 'bg-amber-400' : 'bg-red-400'}`}
                                style={{ width: `${(pts / 7) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Eligible careers */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-navy" />
                  <h3 className="text-xs font-black text-navy uppercase tracking-widest">
                    Programmes You Qualify For ({eligibleCareers.length})
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">Based on your APS of {aps}</p>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        filterCategory === cat
                          ? 'bg-navy text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'all' ? 'All' : CATEGORY_LABELS[cat] ?? cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {filteredCareers.map((career, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{career.title}</p>
                        <p className="text-xs text-slate-500 truncate">{career.institution}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[career.category] ?? 'bg-gray-100 text-gray-600'}`}>
                          {CATEGORY_LABELS[career.category] ?? career.category}
                        </span>
                        {career.minAps > 0 && (
                          <span className="text-xs text-slate-400">APS {career.minAps}+</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate('quiz')}
                  className="mt-4 w-full flex items-center justify-center gap-2 h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Take Career Quiz to Find Your Best Fit
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* NSFAS note */}
                <div className="mt-4 flex gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <TrendingUp className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <span className="font-bold">NSFAS tip:</span> If your household earns under R350k/year, you may qualify for full funding. Apply at nsfas.org.za before September each year.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
