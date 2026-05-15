import { useState, useEffect } from 'react';
import { Zap, RefreshCw, ChevronLeft, ExternalLink, AlertTriangle, Wrench, MapPin, X, ChevronDown } from 'lucide-react';
import { withAuth, type AuthedProps } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';
import {
  fetchLoadShedding, getStageInfo, type LoadSheddingData, type PowerAlert,
  ALERT_TYPE_LABELS, SA_PROVINCES,
} from '../../services/loadshedding';

// ── Constants ─────────────────────────────────────────────────────────────────

const URGENCY_CONFIG = {
  critical: { label: 'Critical', bg: 'bg-red-50',    text: 'text-red-700',   border: 'border-red-200',   dot: 'bg-red-500'    },
  high:     { label: 'High',     bg: 'bg-orange-50', text: 'text-orange-700',border: 'border-orange-200',dot: 'bg-orange-400' },
  medium:   { label: 'Medium',   bg: 'bg-amber-50',  text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400'  },
  low:      { label: 'Low',      bg: 'bg-green-50',  text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500'  },
};

const STATUS_CONFIG = {
  active:   { label: 'Active',    cls: 'text-red-700 bg-red-50 border-red-200'       },
  upcoming: { label: 'Upcoming',  cls: 'text-blue-700 bg-blue-50 border-blue-200'    },
  resolved: { label: 'Resolved',  cls: 'text-green-700 bg-green-50 border-green-200' },
};

type Tab = 'alerts' | 'loadshedding';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch { return dateStr; }
}

function fmtDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
  } catch { return dateStr; }
}

// ── Alert Card ────────────────────────────────────────────────────────────────

function AlertCard({ alert, onDismiss }: { alert: PowerAlert; onDismiss: (id: string) => void }) {
  const u = URGENCY_CONFIG[alert.urgency];
  const s = STATUS_CONFIG[alert.status];

  return (
    <div className={`rounded-xl border ${u.border} ${u.bg} p-5 relative`}>
      <button
        onClick={() => onDismiss(alert.id)}
        className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/10 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4 text-slate-500" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${u.border} ${u.bg}`}>
          <AlertTriangle className={`w-4 h-4 ${u.text}`} />
        </div>

        <div className="min-w-0 flex-1">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${u.bg} ${u.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${u.dot}`} />
              {u.label}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${s.cls}`}>
              {s.label}
            </span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {ALERT_TYPE_LABELS[alert.type]}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{alert.title}</h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{alert.municipality ? `${alert.municipality}, ` : ''}{alert.province}</span>
            {alert.area && <span className="text-slate-400">· {alert.area}</span>}
          </div>

          <p className="text-sm text-slate-600 mb-3 leading-relaxed">{alert.description}</p>

          {/* Dates */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
            <span>Started: {fmt(alert.startDate)}</span>
            {alert.estimatedRestoration && (
              <span>Est. restoration: {fmt(alert.estimatedRestoration)}</span>
            )}
          </div>

          {alert.sourceUrl && (
            <a
              href={alert.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mt-3"
            >
              Eskom source <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function LoadSheddingPageInner({ onNavigate, user }: AuthedProps) {
  const [data, setData] = useState<LoadSheddingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<Tab>('alerts');
  const [province, setProvince] = useState('All Provinces');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  async function load(refresh = false) {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    const result = await fetchLoadShedding();
    setData(result);
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => { load(); }, []);

  const stageInfo = data ? getStageInfo(data.currentStage) : null;

  const filteredAlerts = (data?.alerts ?? []).filter(a =>
    !dismissed.has(a.id) &&
    (province === 'All Provinces' || a.province === province)
  );

  const activeAlerts   = filteredAlerts.filter(a => a.status === 'active');
  const upcomingAlerts = filteredAlerts.filter(a => a.status === 'upcoming');

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

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">Community</p>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Zap className="w-7 h-7 text-slate-700" />
                Electricity Status
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
            <div className="space-y-6">

              {/* Load shedding stage banner — always visible */}
              <div className={`rounded-2xl border p-6 ${stageInfo.colorBg}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">Load Shedding</p>
                    <p className={`text-2xl font-black tracking-tight ${stageInfo.colorText}`}>{data.statusText}</p>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{data.statusNote}</p>
                  </div>
                  <a
                    href="https://loadshedding.eskom.co.za"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
                  >
                    Eskom <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-400 mt-4">Updated: {fmt(data.scrapedAt)}</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-slate-100 pb-0">
                {([
                  { id: 'alerts' as Tab,       label: 'Power Alerts', count: activeAlerts.length },
                  { id: 'loadshedding' as Tab,  label: 'Stage Reference', count: null },
                ]).map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors -mb-px min-h-11 ${
                      tab === t.id
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {t.label}
                    {t.count !== null && t.count > 0 && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                        {t.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Province filter — alerts tab only */}
              {tab === 'alerts' && (
                <div className="relative w-48">
                  <select
                    value={province}
                    onChange={e => setProvince(e.target.value)}
                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
                  >
                    {SA_PROVINCES.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              )}

              {/* Alerts tab */}
              {tab === 'alerts' && (
                <div className="space-y-4">
                  {activeAlerts.length === 0 && upcomingAlerts.length === 0 ? (
                    <div className="border border-slate-200 rounded-xl p-10 text-center">
                      <Zap className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-500">No electricity alerts for {province}.</p>
                      <p className="text-xs text-slate-400 mt-1">Check back later or select a different province.</p>
                    </div>
                  ) : (
                    <>
                      {activeAlerts.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Active Now</p>
                          <div className="space-y-3">
                            {activeAlerts.map(a => (
                              <AlertCard key={a.id} alert={a} onDismiss={id => setDismissed(prev => new Set([...prev, id]))} />
                            ))}
                          </div>
                        </div>
                      )}
                      {upcomingAlerts.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 mt-6">Upcoming</p>
                          <div className="space-y-3">
                            {upcomingAlerts.map(a => (
                              <AlertCard key={a.id} alert={a} onDismiss={id => setDismissed(prev => new Set([...prev, id]))} />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Stage reference tab */}
              {tab === 'loadshedding' && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {[0,1,2,3,4,5,6,7,8].map(stage => {
                      const info = getStageInfo(stage);
                      const isActive = stage === data.currentStage;
                      return (
                        <div key={stage} className={`flex items-center justify-between px-6 py-3.5 ${isActive ? 'bg-slate-50' : ''}`}>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${info.colorBg} ${info.colorText}`}>
                              {info.name}
                            </span>
                            {isActive && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current</span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">{info.hours}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-24 text-slate-500 text-sm">Unable to load data. Please try again.</div>
          )}

        </div>
      </main>
    </div>
  );
}

export default withAuth(LoadSheddingPageInner);
