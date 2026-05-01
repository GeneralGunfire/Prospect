import { useRef, useEffect } from 'react';
import { LayoutGrid, Briefcase, Building2, Wallet, ClipboardList } from 'lucide-react';

interface TVETSubNavProps {
  currentPage: 'overview' | 'careers' | 'colleges' | 'funding' | 'requirements';
  onNavigate: (page: string) => void;
}

const LINKS = [
  { label: 'Overview',         page: 'tvet',              key: 'overview',     icon: <LayoutGrid className="w-3.5 h-3.5" /> },
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
    <div className="sticky top-[60px] z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm pt-4">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="flex gap-2 pb-4 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {LINKS.map((link) => {
            const isActive = currentPage === link.key;
            return (
              <button
                key={link.key}
                ref={isActive ? activeRef : undefined}
                onClick={() => onNavigate(link.page)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest whitespace-nowrap shrink-0 transition-all duration-200 border ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
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
