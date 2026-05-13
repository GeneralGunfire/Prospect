import type { Key } from 'react';
import { ArrowRight, GraduationCap, Wallet, TrendingUp } from 'lucide-react';
import type { Career } from '../../data/careers';
import type { CareerFull } from '../../data/careersTypes';

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
      className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors duration-150 flex flex-col h-full cursor-pointer"
    >
      {/* Top row: category + RIASEC */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
          {career.category}
        </span>
        <div className="flex gap-1 shrink-0">
          {riasecCodes.map((code) => (
            <span
              key={code}
              title={code}
              className="text-[9px] font-black text-slate-400 leading-none"
            >
              {code}
            </span>
          ))}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug" style={{ letterSpacing: '-0.01em' }}>
        {career.title}
      </h3>

      {/* Description */}
      <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
        {career.description}
      </p>

      {/* Meta row */}
      <div className="mt-auto space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-slate-500">{salaryDisplay}/mo</span>
          <span className="text-slate-200">·</span>
          <span className="text-xs font-semibold text-slate-500">APS {apsDisplay}+</span>
          {demandCfg && (
            <>
              <span className="text-slate-200">·</span>
              <span className={`text-[10px] font-black uppercase tracking-wide ${demandCfg.cls.includes('high') ? 'text-blue-600' : demandCfg.cls.includes('medium') ? 'text-amber-600' : 'text-slate-400'}`}>
                {demandLevel === 'high' ? 'High demand' : demandLevel === 'medium' ? 'Med demand' : 'Low demand'}
              </span>
            </>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between min-h-9">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-300 group-hover:text-slate-700 transition-colors">
            View Details
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all duration-150" />
        </div>
      </div>
    </div>
  );
}
