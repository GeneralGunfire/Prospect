interface TVETSubNavProps {
  currentPage: 'overview' | 'careers' | 'colleges' | 'funding' | 'requirements';
  onNavigate: (page: string) => void;
}

export function TVETSubNav({ currentPage, onNavigate }: TVETSubNavProps) {
  const links = [
    { label: 'Overview', page: 'tvet', key: 'overview' },
    { label: 'Browse Careers', page: 'tvet-careers', key: 'careers' },
    { label: 'Find Colleges', page: 'tvet-colleges', key: 'colleges' },
    { label: 'Funding & Support', page: 'tvet-funding', key: 'funding' },
    { label: 'Matric Requirements', page: 'tvet-requirements', key: 'requirements' },
  ];

  return (
    <div className="border-b border-slate-200 bg-white sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 justify-center flex-wrap">
          {links.map((link) => (
            <button
              key={link.key}
              onClick={() => onNavigate(link.page)}
              className={`px-4 py-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${
                currentPage === link.key
                  ? 'border-[#1B5E20] text-[#1B5E20]'
                  : 'border-transparent text-[#64748b] hover:text-[#1B5E20]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
