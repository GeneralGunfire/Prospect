import type { Key } from 'react';
import { ArrowRight, GraduationCap, Wallet } from 'lucide-react';
import type { Career } from '../data/careers';
import type { CareerFull } from '../data/careersTypes';

interface CareerCardProps {
  key?: Key;
  career: Career | CareerFull;
  onCardClick?: () => void;
}

const RIASEC_COLORS: Record<string, string> = {
  R: '#EF4444',
  I: '#3B82F6',
  A: '#A855F7',
  S: '#10B981',
  E: '#F59E0B',
  C: '#06B6D4',
};

function getRiasecCodes(career: Career | CareerFull): string[] {
  if ('riasecMatch' in career) {
    // CareerFull type
    const entries = Object.entries(career.riasecMatch)
      .map(([code, score]) => ({ code: code[0].toUpperCase(), score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    return entries.map(e => e.code);
  } else {
    // Career type
    return (career as Career).riasec.slice(0, 3);
  }
}

function getSalaryDisplay(career: Career | CareerFull): string {
  if ('salary' in career && typeof (career as any).salary === 'object') {
    // CareerFull type
    const c = career as CareerFull;
    return `R${(c.salary.entryLevel / 1000).toFixed(0)}k`;
  } else {
    // Career type
    return (career as Career).salary || 'TBD';
  }
}

function getAPSDisplay(career: Career | CareerFull): number {
  if ('matricRequirements' in career) {
    // CareerFull type
    return (career as CareerFull).matricRequirements.minimumAps;
  } else {
    // Career type
    return (career as Career).aps || 0;
  }
}

export function CareerCard({ career, onCardClick }: CareerCardProps) {
  const riasecCodes = getRiasecCodes(career);
  const salaryDisplay = getSalaryDisplay(career);
  const apsDisplay = getAPSDisplay(career);

  return (
    <div onClick={onCardClick} className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-prospect-green transition-all duration-300 flex flex-col h-full cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-prospect-green/10 text-prospect-green text-[9px] font-bold uppercase tracking-widest rounded-full">
          {career.category}
        </span>
        <div className="flex gap-1">
          {riasecCodes.map((type) => (
            <span
              key={type}
              className="w-5 h-5 text-white text-[10px] font-bold flex items-center justify-center rounded-md"
              style={{ backgroundColor: RIASEC_COLORS[type] || '#64748b' }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-prospect-green transition-colors">
        {career.title}
      </h3>

      <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-2">
        {career.description}
      </p>

      <div className="mt-auto space-y-3">
        <div className="flex items-center gap-3 text-prospect-green">
          <Wallet className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{salaryDisplay}</span>
        </div>
        <div className="flex items-center gap-3 text-prospect-green">
          <GraduationCap className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">APS: {apsDisplay}+</span>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">View Details</span>
          <ArrowRight className="w-4 h-4 text-prospect-green group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
