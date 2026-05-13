import { useRef, useEffect } from 'react';

interface TVETSubNavProps {
  currentPage: 'overview' | 'careers' | 'colleges' | 'funding' | 'requirements';
  onNavigate: (page: string) => void;
}

const LINKS = [
  { label: 'Overview',     page: 'tvet',              key: 'overview'     },
  { label: 'Colleges',     page: 'tvet-colleges',     key: 'colleges'     },
  { label: 'Funding',      page: 'tvet-funding',      key: 'funding'      },
  { label: 'Requirements', page: 'tvet-requirements', key: 'requirements' },
];

export function TVETSubNav({ currentPage, onNavigate }: TVETSubNavProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="sticky top-[60px] z-30 bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div
          className="flex gap-1 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {LINKS.map((link) => {
            const isActive = currentPage === link.key;
            return (
              <button
                key={link.key}
                ref={isActive ? activeRef : undefined}
                onClick={() => onNavigate(link.page)}
                className={`px-3 py-3 text-xs font-bold whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                  isActive
                    ? 'text-slate-900 font-black border-slate-900'
                    : 'text-slate-500 hover:text-slate-900 border-transparent'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
