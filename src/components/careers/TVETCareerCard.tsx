import type { Key } from 'react';
import { ArrowRight, Zap, Briefcase, DollarSign } from 'lucide-react';
import type { CareerFull } from '../../data/careersTypes';

interface TVETCareerCardProps {
  key?: Key;
  career: CareerFull;
  onCardClick?: () => void;
}

const DEMAND_COLORS: Record<string, string> = {
  high: '#10B981',
  medium: '#F59E0B',
  low: '#EF4444',
};

export function TVETCareerCard({ career, onCardClick }: TVETCareerCardProps) {
  const demandColor = DEMAND_COLORS[career.jobDemand.level] || '#64748b';

  // Extract qualification duration from studyPath
  const duration = career.studyPath.timeToQualify;

  // Format salary range
  const salaryDisplay = `R${(career.salary.entryLevel / 1000).toFixed(0)}k - R${(career.salary.midLevel / 1000).toFixed(0)}k`;

  return (
    <div
      onClick={onCardClick}
      className="group bg-white border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl hover:border-[#1E3A5F] transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-[#1E3A5F]/10 text-[#1E3A5F] text-xs font-bold uppercase tracking-widest rounded-full">
          TVET Career
        </span>
        <div
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{ backgroundColor: demandColor + '20', color: demandColor }}
        >
          {career.jobDemand.level} Demand
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1E3A5F] transition-colors">
        {career.title}
      </h3>

      <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-2">
        {career.description}
      </p>

      <div className="mt-auto space-y-3">
        <div className="flex items-center gap-3" style={{ color: '#1E3A5F' }}>
          <DollarSign className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">{salaryDisplay}/month</span>
        </div>

        <div className="flex items-center gap-3" style={{ color: '#1E3A5F' }}>
          <Briefcase className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">{duration}</span>
        </div>

        <div className="flex items-center gap-3" style={{ color: '#1E3A5F' }}>
          <Zap className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {career.jobDemand.growthPercentage}% growth
          </span>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between min-h-11">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">View Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: '#1E3A5F' }} />
        </div>
      </div>
    </div>
  );
}
