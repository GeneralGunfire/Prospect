import { useState, useEffect } from 'react';
import { Zap, RefreshCw, ChevronLeft } from 'lucide-react';
import { withAuth, type AuthedProps } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';
import { fetchLoadShedding, getStageInfo, type LoadSheddingData } from '../../services/loadshedding';

const STUDY_TIPS = [
  'Charge all devices — laptop, phone, and power bank — before outage blocks begin.',
  'Download lecture notes, textbooks, and past papers before load shedding starts.',
  'Plan your heavy study sessions around times when power will be on.',
  'Use mobile data as a hotspot backup when WiFi routers go offline.',
  'Invest in a small LED lamp or headlamp for reading during outages.',
  'Set alarms to remind yourself when power is expected to return.',
];

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

function formatUpdated(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

function LoadSheddingPageInner({ onNavigate, user }: AuthedProps) {
  const [data, setData] = useState<LoadSheddingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load(refresh = false) {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try {
      const result = await fetchLoadShedding();
      setData(result);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  const stageInfo = data ? getStageInfo(data.currentStage) : null;

  const stageImpacts: Record<number, string[]> = {
    0: ['No scheduled power cuts today.'],
    1: ['One outage block of about 1 hour.', 'Minor disruption — plan one short offline session.'],
    2: ['Two outage blocks totalling about 2 hours.', 'Charge all devices in the morning.'],
    3: ['Multiple blocks adding up to 2–3 hours.', 'Plan study sessions carefully around cuts.'],
    4: ['Multiple blocks — roughly 2 hours per day.', 'Keep a fully charged power bank at hand.'],
    5: ['Heavy cuts — approximately 3 hours per day.', 'Significant disruption; download all materials.'],
    6: ['Severe cuts — 3–4 hours or more per day.', 'Internet and WiFi will be down repeatedly.', 'Offline study is essential.'],
    7: ['Extreme load shedding — roughly 4 hours per day.', 'Plan all study offline. Charge overnight.'],
    8: ['Maximum shedding — 4+ hours per day.', 'Effectively no reliable electricity window. Prepare extensively offline.'],
  };

  const impacts = data ? (stageImpacts[data.currentStage] ?? stageImpacts[0]) : [];

  return (
    <div className="min-h-screen bg-white">
      <AppHeader mode="community" onNavigate={onNavigate} currentPage="load-shedding" user={user} />

      <main className="pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Back */}
          <button
            onClick={() => onNavigate('community' as any)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-8 min-h-11"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Community
          </button>

          {/* Page header */}
          <div className="flex items-start justify-between gap-4 mb-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">Community</p>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Zap className="w-7 h-7 text-slate-700" />
                Load Shedding Status
              </h1>
            </div>
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2 hover:border-slate-400 transition-all mt-6 min-h-11"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
            </div>
          ) : data && stageInfo ? (
            <div className="space-y-8">

              {/* Current stage hero */}
              <div className={`rounded-2xl border p-8 ${stageInfo.colorBg}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">Current Stage</p>
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-6xl font-black text-slate-900 tracking-tighter">
                    {data.currentStage === 0 ? 'None' : data.currentStage}
                  </span>
                </div>
                <p className={`text-lg font-bold mb-1 ${stageInfo.colorText}`}>{stageInfo.name}</p>
                <p className="text-sm text-slate-600">{stageInfo.hours}</p>
                <p className="text-xs text-slate-400 mt-4">Last updated: {formatUpdated(data.updatedAt)}</p>
              </div>

              {/* What this means */}
              <div className="border border-slate-200 rounded-xl p-6">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">What This Means for You</h2>
                <ul className="space-y-2">
                  {impacts.map((impact, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-1 h-1 rounded-full bg-slate-400 mt-2 shrink-0" />
                      {impact}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 7-day forecast */}
              {data.forecast.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Forecast</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {data.forecast.slice(0, 7).map((item, i) => {
                      const info = getStageInfo(item.stage);
                      return (
                        <div key={i} className="flex items-center justify-between px-6 py-3">
                          <span className="text-sm text-slate-700">{formatDate(item.date)}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${info.colorBg} ${info.colorText}`}>
                            {info.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {data.forecast.length === 0 && (
                <div className="border border-slate-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-slate-500">No forecast data available. Eskom forecast API may be temporarily unavailable.</p>
                </div>
              )}

              {/* Study tips */}
              <div className="border border-slate-200 rounded-xl p-6">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Tips for Students</h2>
                <ul className="space-y-3">
                  {STUDY_TIPS.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="font-black text-slate-300 text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            <div className="text-center py-24 text-slate-500 text-sm">
              Unable to load data. Please try again.
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default withAuth(LoadSheddingPageInner);
