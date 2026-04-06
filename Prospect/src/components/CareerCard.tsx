import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, GraduationCap, Wallet } from 'lucide-react';
import { Career } from '../data/careers';

interface CareerCardProps {
  career: Career;
}

export const CareerCard: React.FC<CareerCardProps> = ({ career }) => {
  return (
    <Link 
      to={`/careers/${career.id}`}
      className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-secondary transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-navy/5 text-navy text-[9px] font-bold uppercase tracking-widest rounded-full">
          {career.category}
        </span>
        <div className="flex gap-1">
          {career.riasec.map((type) => (
            <span key={type} className="w-5 h-5 bg-secondary/10 text-secondary text-[10px] font-bold flex items-center justify-center rounded-md">
              {type}
            </span>
          ))}
        </div>
      </div>

      <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-secondary transition-colors">
        {career.title}
      </h3>
      
      <p className="text-on-surface-variant text-xs leading-relaxed mb-6 line-clamp-2">
        {career.description}
      </p>

      <div className="mt-auto space-y-3">
        <div className="flex items-center gap-3 text-secondary">
          <Wallet className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{career.salary}</span>
        </div>
        <div className="flex items-center gap-3 text-secondary">
          <GraduationCap className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">APS: {career.aps}+</span>
        </div>
        
        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[9px] font-bold text-navy/40 uppercase tracking-widest">View Details</span>
          <ArrowRight className="w-4 h-4 text-secondary group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
