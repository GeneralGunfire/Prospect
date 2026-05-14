import { Zap, Droplet, TrendingDown, BarChart3, BookOpen } from 'lucide-react';
import { withAuth, type AuthedProps } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';

function CommunityPageInner({ onNavigate, user }: AuthedProps) {
  const features = [
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

  const alsoIncluded = [
    { id: 'tax-budget', label: 'Tax Calculator', icon: BarChart3 },
    { id: 'civics',     label: 'Civics Guide',   icon: BookOpen  },
  ];

  return (
    <div className="min-h-screen bg-white">
      <AppHeader mode="community" onNavigate={onNavigate} currentPage="community" user={user} />

      <main className="pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 mb-3">Community</p>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Civic Awareness & Planning
            </h1>
            <p className="text-base text-slate-500 leading-relaxed max-w-xl">
              Understand the systems that shape your opportunities. Track utilities, costs, and civic participation.
            </p>
          </div>

          {/* Three main feature cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {features.map(feature => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  onClick={() => onNavigate(feature.id as any)}
                  className="group border border-slate-200 rounded-xl p-6 hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-5 group-hover:bg-slate-900 transition-colors">
                    <Icon className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mb-2 tracking-tight">{feature.title}</h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{feature.description}</p>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 group-hover:text-slate-900 transition-colors">
                    View →
                  </span>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 mb-10" />

          {/* Also included */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-5">Also in this section</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {alsoIncluded.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id as any)}
                    className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all text-left min-h-11"
                  >
                    <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default withAuth(CommunityPageInner);
