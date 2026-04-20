import { Globe, Construction, Droplets } from 'lucide-react';
import type { AppPage } from '../lib/withAuth';

interface CommunityNavProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

const TABS: { page: AppPage; label: string; icon: React.ReactNode }[] = [
  { page: 'community-impact',  label: 'Community Impact', icon: <Globe className="w-4 h-4" /> },
  { page: 'pothole-map',       label: 'Pothole Map',      icon: <Construction className="w-4 h-4" /> },
  { page: 'water-dashboard',   label: 'Water Dashboard',  icon: <Droplets className="w-4 h-4" /> },
];

export default function CommunityNav({ currentPage, onNavigate }: CommunityNavProps) {
  const active = TABS.find((t) => {
    if (t.page === 'pothole-map') {
      return currentPage === 'pothole-map' || currentPage === 'flag-pothole' || currentPage === 'my-pothole-contributions';
    }
    return t.page === currentPage;
  });

  return (
    <div className="bg-white border-b border-slate-200 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => {
          const isActive = active?.page === tab.page;
          return (
            <button
              key={tab.page}
              onClick={() => onNavigate(tab.page)}
              className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                isActive
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{tab.icon}</span>
              <span className="uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
