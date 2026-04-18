import type { Key } from 'react';
import { ArrowRight, GraduationCap, Wallet } from 'lucide-react';
import type { Career } from '../data/careers';
import type { CareerFull } from '../data/careersTypes';
import { Badge } from '../../components/ui/badge';

interface CareerCardProps {
  key?: Key;
  career: Career | CareerFull;
  onCardClick?: () => void;
}

// RIASEC code → colored badge
const RIASEC_COLORS: Record<string, string> = {
  R: 'bg-red-100 text-red-700',
  I: 'bg-blue-100 text-blue-700',
  A: 'bg-purple-100 text-purple-700',
  S: 'bg-emerald-100 text-emerald-700',
  E: 'bg-amber-100 text-amber-700',
  C: 'bg-cyan-100 text-cyan-700',
};

const DEMAND_BADGE: Record<string, { variant: 'success' | 'warning' | 'error'; label: string }> = {
  high:   { variant: 'success', label: 'High Demand' },
  medium: { variant: 'warning', label: 'Med Demand'  },
  low:    { variant: 'error',   label: 'Low Demand'  },
};

// Category → left-border accent class
const CATEGORY_ACCENT: Record<string, string> = {
  Engineering:  'card-accent-blue',
  Health:       'card-accent-green',
  Business:     'card-accent-amber',
  Technology:   'card-accent-cyan',
  Education:    'card-accent-purple',
  Law:          'card-accent-orange',
  Arts:         'card-accent-purple',
  Agriculture:  'card-accent-green',
};

// Category → emoji icon
const CATEGORY_EMOJI: Record<string, string> = {
  Engineering:  '⚙️',
  Health:       '🏥',
  Business:     '💼',
  Technology:   '💻',
  Education:    '📚',
  Law:          '⚖️',
  Arts:         '🎨',
  Agriculture:  '🌿',
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
  if ('matricRequirements' in career) return (career as CareerFull).matricRequirements.minimumAps;
  return (career as Career).aps || 0;
}

function getDemandLevel(career: Career | CareerFull): string | null {
  if ('jobDemand' in career && typeof (career as any).jobDemand === 'object') {
    return (career as CareerFull).jobDemand?.level ?? null;
  }
  return null;
}

export function CareerCard({ career, onCardClick }: CareerCardProps) {
  const riasecCodes  = getRiasecCodes(career);
  const salaryDisplay = getSalaryDisplay(career);
  const apsDisplay    = getAPSDisplay(career);
  const demandLevel   = getDemandLevel(career);
  const demandCfg     = demandLevel ? DEMAND_BADGE[demandLevel] : null;
  const accentClass   = CATEGORY_ACCENT[career.category] ?? 'card-accent-navy';
  const emoji         = CATEGORY_EMOJI[career.category] ?? '🎯';

  return (
    <div
      onClick={onCardClick}
      data-testid="career-card"
      className={`group bg-white border border-border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-150 flex flex-col h-full cursor-pointer overflow-hidden ${accentClass}`}
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Icon + RIASEC codes */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl" role="img" aria-hidden="true">{emoji}</span>
          <div className="flex gap-1 shrink-0">
            {riasecCodes.map((code) => (
              <span
                key={code}
                title={`RIASEC: ${code}`}
                className={`w-6 h-6 text-xs font-bold flex items-center justify-center rounded-md ${RIASEC_COLORS[code] ?? 'bg-slate-100 text-slate-600'}`}
              >
                {code}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-text-primary mb-1.5 group-hover:text-[#1E3A5F] transition-colors leading-snug">
          {career.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-2 flex-1">
          {career.description}
        </p>

        {/* Meta row */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <Wallet className="w-3.5 h-3.5" />
                {salaryDisplay}
              </span>
              <span className="flex items-center gap-1 text-xs text-text-secondary">
                <GraduationCap className="w-3.5 h-3.5" />
                APS {apsDisplay}+
              </span>
            </div>
            {demandCfg && (
              <Badge variant={demandCfg.variant} size="sm">{demandCfg.label}</Badge>
            )}
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-tertiary group-hover:text-[#1E3A5F] transition-colors font-medium">
              View Details
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-[#1E3A5F] group-hover:translate-x-0.5 transition-all duration-150" />
          </div>
        </div>
      </div>
    </div>
  );
}
