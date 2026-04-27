import type { Key } from 'react';
import { ArrowRight, GraduationCap, Wallet, TrendingUp } from 'lucide-react';
import type { Career } from '../data/careers';
import type { CareerFull } from '../data/careersTypes';

interface CareerCardProps {
  key?: Key;
  career: Career | CareerFull;
  onCardClick?: () => void;
}

// RIASEC badge colors — using approved semantic palette only
const RIASEC_COLORS: Record<string, string> = {
  R: '#EF4444', // red-500
  I: '#3B82F6', // blue-500
  A: '#A855F7', // blue-500
  S: '#10B981', // blue-500
  E: '#F59E0B', // amber-500
  C: '#06B6D4', // blue-500
};

const DEMAND_CONFIG: Record<string, { label: string; cls: string }> = {
  high:   { label: 'High Demand',   cls: 'demand-high' },
  medium: { label: 'Med Demand',    cls: 'demand-medium' },
  low:    { label: 'Low Demand',    cls: 'demand-low' },
};

// Category badge — using slate tones only (no new colors)
const CATEGORY_CONFIG: Record<string, string> = {
  Engineering:  'bg-blue-50 text-blue-700',
  Health:       'bg-blue-50 text-blue-700',
  Business:     'bg-amber-50 text-amber-700',
  Technology:   'bg-slate-100 text-slate-700',
  Education:    'bg-blue-50 text-blue-700',
  Law:          'bg-red-50 text-red-700',
  Arts:         'bg-blue-50 text-blue-700',
  Agriculture:  'bg-green-50 text-green-700',
};

function getRiasecCodes(career: Career | CareerFull): string[] {
  if ('riasecMatch' in career) {
    return Object.entries(career.riasecMatch)
      .map(([code, score]) => ({ code: code[0].toUpperCase(), score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(e => e.code);
  }
  return (career as Career).riasec.slice(0, 3);
}

function getSalaryDisplay(career: Career | CareerFull): string {
  if ('salary' in career && typeof (career as any).salary === 'object') {
    return `R${((career as CareerFull).salary.entryLevel / 1000).toFixed(0)}k`;
  }
  return (career as Career).salary || 'TBD';
}

function getAPSDisplay(career: Career | CareerFull): number {
  if ('matricRequirements' in career) {
    return (career as CareerFull).matricRequirements.minimumAps;
  }
  return (career as Career).aps || 0;
}

function getDemandLevel(career: Career | CareerFull): string | null {
  if ('jobDemand' in career && typeof (career as any).jobDemand === 'object') {
    return (career as CareerFull).jobDemand?.level ?? null;
  }
  return null;
}

export function CareerCard({ career, onCardClick }: CareerCardProps) {
  const riasecCodes = getRiasecCodes(career);
  const salaryDisplay = getSalaryDisplay(career);
  const apsDisplay = getAPSDisplay(career);
  const demandLevel = getDemandLevel(career);
  const demandCfg = demandLevel ? DEMAND_CONFIG[demandLevel] : null;
  const categoryClass = CATEGORY_CONFIG[career.category] ?? 'bg-slate-100 text-slate-600';

  return (
    <div
      onClick={onCardClick}
      data-testid="career-card"
      className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full cursor-pointer"
    >
      {/* Top row: category badge + RIASEC chips */}
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full leading-none ${categoryClass}`}>
          {career.category}
        </span>
        <div className="flex gap-1 shrink-0">
          {riasecCodes.map((code) => (
            <span
              key={code}
              title={code}
              className="w-5 h-5 text-white text-[10px] font-bold flex items-center justify-center rounded-md"
              style={{ backgroundColor: RIASEC_COLORS[code] ?? '#64748b' }}
            >
              {code}
            </span>
          ))}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-prospect-blue-accent transition-colors leading-snug">
        {career.title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
        {career.description}
      </p>

      {/* Meta row */}
      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              {salaryDisplay}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              APS {apsDisplay}+
            </span>
          </div>
          {demandCfg && (
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${demandCfg.cls}`}>
              {demandCfg.label}
            </span>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-prospect-blue-accent transition-colors">
            View Details
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-prospect-blue-accent group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
      </div>
    </div>
  );
}
