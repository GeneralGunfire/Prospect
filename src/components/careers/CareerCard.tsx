import type { Key } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Career } from '../../data/careers';
import type { CareerFull } from '../../data/careersTypes';

interface CareerCardProps {
  key?: Key;
  career: Career | CareerFull;
  onCardClick?: () => void;
}

function getRiasecCodes(career: Career | CareerFull): string[] {
  if ('riasecMatch' in career) {
    return Object.entries(career.riasecMatch)
      .map(([code, score]) => ({ code: code[0].toUpperCase(), score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(e => e.code);
  }
  return (career as Career).riasec.slice(0, 2);
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

  return (
    <div
      onClick={onCardClick}
      data-testid="career-card"
      className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-400 transition-colors duration-150 flex flex-col h-full cursor-pointer"
    >
      {/* Category label */}
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
        {career.category}
      </p>

      {/* Title — dominant */}
      <h3
        className="text-base font-black text-slate-900 mb-3 leading-snug"
        style={{ letterSpacing: '-0.02em' }}
      >
        {career.title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-slate-500 line-clamp-2 flex-1">
        {career.description}
      </p>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
          <span>{salaryDisplay}/mo</span>
          <span className="text-slate-200">·</span>
          <span>APS {apsDisplay}+</span>
          {demandLevel === 'high' && (
            <>
              <span className="text-slate-200">·</span>
              <span className="text-blue-600 font-bold">High demand</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {riasecCodes.map((code) => (
            <span key={code} className="text-[9px] font-black text-slate-300">{code}</span>
          ))}
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all duration-150 ml-1" />
        </div>
      </div>
    </div>
  );
}
