import { useRef, useEffect } from 'react';
import { LayoutGrid, Briefcase, Building2, Wallet, ClipboardList } from 'lucide-react';

interface TVETSubNavProps {
  currentPage: 'overview' | 'careers' | 'colleges' | 'funding' | 'requirements';
  onNavigate: (page: string) => void;
}

const LINKS = [
  { label: 'Overview',         page: 'tvet',              key: 'overview',     icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { label: 'Browse Careers',   page: 'tvet-careers',      key: 'careers',      icon: <Briefcase className="w-3.5 h-3.5" /> },
  { label: 'Find Colleges',    page: 'tvet-colleges',     key: 'colleges',     icon: <Building2 className="w-3.5 h-3.5" /> },
  { label: 'Funding & Support',page: 'tvet-funding',      key: 'funding',      icon: <Wallet className="w-3.5 h-3.5" /> },
  { label: 'Matric Req.',      page: 'tvet-requirements', key: 'requirements', icon: <ClipboardList className="w-3.5 h-3.5" /> },
];

export function TVETSubNav({ currentPage, onNavigate }: TVETSubNavProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  // Scroll active pill into view on mount / page change
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="sticky top-[60px] z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="flex gap-1.5 py-3 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {LINKS.map((link) => {
            const isActive = currentPage === link.key;
            return (
              <button
                key={link.key}
                ref={isActive ? activeRef : undefined}
                onClick={() => onNavigate(link.page)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest whitespace-nowrap shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1e293b] text-white shadow-sm'
                    : 'bg-slate-100/80 text-slate-500 hover:bg-slate-200/80 hover:text-slate-800'
                }`}
              >
                <span className={isActive ? 'text-white/80' : 'text-slate-400'}>
                  {link.icon}
                </span>
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
