import { Zap, Droplet, TrendingDown, BarChart3, BookOpen, ChevronRight } from 'lucide-react';
import AppHeader from '../../components/shell/AppHeader';
import type { AppPage } from '../../lib/withAuth';

function CommunityPage({ onNavigate }: { onNavigate: (page: AppPage) => void }) {
  const mainItems = [
    {
      id: 'load-shedding',
      title: 'Load Shedding Status',
      description: 'Real-time electricity stage forecast. Plan study time around power outages.',
      icon: Zap,
    },
    {
      id: 'water-dashboard',
      title: 'Water Availability',
      description: 'Dam levels by province. Water alerts and infrastructure maintenance updates.',
      icon: Droplet,
    },
    {
      id: 'cost-of-living',
      title: 'Cost of Living',
      description: 'Provincial pricing data and budget planning tools.',
      icon: TrendingDown,
    },
  ];

  const secondaryItems = [
    { id: 'tax-budget', label: 'Tax Calculator',  description: 'Understand PAYE, UIF, and build a monthly budget.', icon: BarChart3 },
    { id: 'civics',     label: 'Civics Guide',    description: 'Step-by-step guides for government procedures.', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-white">
      <AppHeader mode="community" onNavigate={onNavigate} currentPage="community" />

      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <h1
              className="text-3xl sm:text-4xl font-black text-slate-900 mb-4"
              style={{ letterSpacing: '-0.025em' }}
            >
              Civic Awareness
            </h1>
            <p className="text-[15px] leading-[1.65] text-slate-500 max-w-lg">
              Understand the systems shaping your opportunities. Track utilities, costs, and civic procedures.
            </p>
          </div>

          {/* Main list */}
          <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100 mb-8">
            {mainItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as any)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-900 transition-colors">
                    <Icon className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-black text-slate-900 leading-tight">{item.title}</p>
                    <p className="text-[14px] text-slate-500 mt-0.5 leading-snug">{item.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-slate-600 transition-colors" />
                </button>
              );
            })}
          </div>

          {/* Secondary list */}
          <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
            {secondaryItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as any)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-900 transition-colors">
                    <Icon className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-black text-slate-900 leading-tight">{item.label}</p>
                    <p className="text-[14px] text-slate-500 mt-0.5 leading-snug">{item.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-slate-600 transition-colors" />
                </button>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}

export default CommunityPage;
