import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown, AlertTriangle, Droplets, Wrench,
  TrendingUp, TrendingDown, Minus, RefreshCw,
  ChevronLeft, ExternalLink, X, ShieldCheck, BookOpen, Lightbulb,
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';
import { PreparednessSection } from '../../components/water/PreparednessSection';
import { ResearchSection } from '../../components/water/ResearchSection';
import { RestrictionLevelGuide } from '../../components/water/RestrictionLevelGuide';
import { DamTrendsChart } from '../../components/water/DamTrendsChart';
import {
  getWaterDataByProvince,
  getWaterNews,
  getLastFetchLabel,
  SA_PROVINCES,
  type WaterAlert,
  type DamLevel,
  type MaintenanceSchedule,
  type WaterRestriction,
  type WaterNewsItem,
} from '../../services/waterService';

// ── Constants ────────────────────────────────────────────────────���─────────────

const PROVINCE_STORAGE_KEY = 'water_dashboard_province';

const URGENCY_CONFIG = {
  critical: { label: 'Critical', bg: 'bg-red-100',    text: 'text-red-700',   border: 'border-red-200',   dot: 'bg-red-500' },
  high:     { label: 'High',     bg: 'bg-slate-100',  text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' },
  medium:   { label: 'Medium',   bg: 'bg-amber-100',  text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  low:      { label: 'Low',      bg: 'bg-green-100',  text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
};

const TREND_CONFIG = {
  rising:  { icon: <TrendingUp className="w-4 h-4" />,   label: 'Rising',  color: 'text-green-600' },
  stable:  { icon: <Minus className="w-4 h-4" />,        label: 'Stable',  color: 'text-blue-600' },
  falling: { icon: <TrendingDown className="w-4 h-4" />, label: 'Falling', color: 'text-slate-500' },
};

type TabId = 'alerts' | 'dams' | 'restrictions' | 'maintenance' | 'preparedness' | 'research';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'alerts',       label: 'Alerts',        icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  { id: 'dams',         label: 'Dam Levels',    icon: <Droplets className="w-3.5 h-3.5" /> },
  { id: 'restrictions', label: 'Restrictions',  icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { id: 'maintenance',  label: 'Maintenance',   icon: <Wrench className="w-3.5 h-3.5" /> },
  { id: 'preparedness', label: 'Preparedness',  icon: <Lightbulb className="w-3.5 h-3.5" /> },
  { id: 'research',     label: 'History',       icon: <BookOpen className="w-3.5 h-3.5" /> },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function UrgencyBadge({ urgency }: { urgency: WaterAlert['urgency'] }) {
  const cfg = URGENCY_CONFIG[urgency];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function AlertCard({ alert, onDismiss }: { alert: WaterAlert; onDismiss: (id: string) => void }) {
  const cfg = URGENCY_CONFIG[alert.urgency];
  const fmt = (d: Date) => d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`rounded-xl border ${cfg.border} ${cfg.bg} p-5 relative`}
    >
      <button
        onClick={() => onDismiss(alert.id)}
        className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/10 transition-colors"
        aria-label="Dismiss alert"
      >
        <X className="w-4 h-4 text-slate-500" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg} border ${cfg.border}`}>
          <AlertTriangle className={`w-4 h-4 ${cfg.text}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <UrgencyBadge urgency={alert.urgency} />
            {alert.municipality && (
              <span className="text-xs text-slate-500 font-medium">{alert.municipality}</span>
            )}
          </div>
          <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{alert.title}</h3>
          <p className="text-sm text-slate-600 mb-3">{alert.description}</p>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500 mb-3">
            <span>
              <span className="font-semibold text-slate-700">From:</span>{' '}
              {fmt(alert.startDate)}
              {alert.endDate && <> — {fmt(alert.endDate)}</>}
            </span>
          </div>

          {alert.affectedAreas.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-700 mb-1">Affected areas:</p>
              <div className="flex flex-wrap gap-1.5">
                {alert.affectedAreas.map(area => (
                  <span key={area} className="text-xs px-2 py-0.5 bg-white/60 rounded-lg border border-white/80 text-slate-600">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {alert.recommendation && (
            <div className={`rounded-xl p-3 ${cfg.bg} border ${cfg.border} bg-white/40`}>
              <p className="text-xs font-bold text-slate-700 mb-0.5">What to do:</p>
              <p className="text-sm text-slate-700">{alert.recommendation}</p>
            </div>
          )}

          {alert.sourceUrl && (
            <a
              href={alert.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 mt-3 text-xs font-semibold ${cfg.text} hover:underline`}
            >
              Learn more <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MaintenanceCard({ item }: { item: MaintenanceSchedule }) {
  const fmt = (d: Date) => d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  const isUpcoming = item.startDate > new Date();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
          <Wrench className="w-4 h-4 text-slate-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
            {isUpcoming && (
              <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Upcoming</span>
            )}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {fmt(item.startDate)} — {fmt(item.endDate)}
          </p>
          {item.affectedAreas.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-700 mb-1">Affected areas:</p>
              <div className="flex flex-wrap gap-1.5">
                {item.affectedAreas.map(area => (
                  <span key={area} className="text-xs px-2 py-0.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
          {item.expectedImpact.length > 0 && (
            <ul className="space-y-0.5">
              {item.expectedImpact.map((impact, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                  {impact}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 sm:p-8 text-center">
      <p className="text-sm text-slate-400 font-medium">{message}</p>
    </div>
  );
}

function ProvinceSelector({ selected, onChange }: { selected: string; onChange: (p: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 group"
      >
        <div className="flex flex-col items-start">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Select Region</span>
          <span className="text-sm font-black text-slate-900 leading-none">{selected}</span>
        </div>
        <div className={`ml-2 w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-slate-900 transition-colors ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4 transition-transform duration-300" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-md shadow-slate-900/5 p-2 z-50 overflow-hidden"
            >
              <div className="px-3 py-2 mb-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">South African Provinces</p>
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-hide">
                {SA_PROVINCES.map(p => {
                  const isActive = selected === p;
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        onChange(p);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive 
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {p}
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


// ── Main Page ─────────────────────────────────────────────────────────���────────

interface WaterDashboardPageProps extends AuthedProps {}

function WaterDashboardPageComponent({ user, onNavigate, onSignOut }: WaterDashboardPageProps) {
  const [province, setProvince] = useState<string>(
    () => localStorage.getItem(PROVINCE_STORAGE_KEY) ?? 'Gauteng'
  );
  const [activeTab, setActiveTab] = useState<TabId>('alerts');
  const [alerts, setAlerts] = useState<WaterAlert[]>([]);
  const [damLevels, setDamLevels] = useState<DamLevel[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceSchedule[]>([]);
  const [restrictions, setRestrictions] = useState<WaterRestriction[]>([]);
  const [news, setNews] = useState<WaterNewsItem[]>([]);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<'live' | 'seed'>('seed');
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const load = useCallback(async (prov: string) => {
    setLoading(true);
    const [data, newsData] = await Promise.all([
      getWaterDataByProvince(prov),
      getWaterNews(prov),
    ]);
    setAlerts(data.alerts);
    setDamLevels(data.damLevels);
    setMaintenance(data.maintenance);
    setRestrictions(data.restrictions);
    setNews(newsData);
    setLastFetched(data.lastFetched);
    setDataSource(data.source);
    setLoading(false);
    setDismissed(new Set());
  }, []);

  useEffect(() => { load(province); }, [province, load]);

  const handleProvinceChange = (p: string) => {
    setProvince(p);
    localStorage.setItem(PROVINCE_STORAGE_KEY, p);
  };

  const visibleAlerts = alerts.filter(a => !dismissed.has(a.id));
  const criticalCount = visibleAlerts.filter(a => a.urgency === 'critical').length;
  const criticalDams = damLevels.filter(d => d.levelPercent < 20);

  const tabCounts: Record<TabId, number> = {
    alerts: visibleAlerts.length,
    dams: damLevels.length,
    restrictions: restrictions.length,
    maintenance: maintenance.length,
    preparedness: 0,
    research: news.length,
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="water-dashboard" user={user} onNavigate={onNavigate} mode="community" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-12 sm:pb-16">
        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 mb-3">Community</p>
              <h1 className="text-3xl font-black text-slate-900" style={{ letterSpacing: '-0.025em' }}>Water Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ProvinceSelector selected={province} onChange={handleProvinceChange} />
            <button
              onClick={() => load(province)}
              disabled={loading}
              className="p-2 min-h-11 min-w-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all disabled:opacity-40"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* ── Critical banners ── */}
        <AnimatePresence>
          {criticalCount > 0 && (
            <motion.div
              key="critical-alerts"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-3 rounded-xl bg-red-600 text-white px-5 py-4 flex items-center gap-3 shadow-lg shadow-red-500/20"
            >
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-bold">
                {criticalCount} critical water alert{criticalCount > 1 ? 's' : ''} active in {province}. Take action immediately.
              </p>
            </motion.div>
          )}
          {criticalDams.length > 0 && (
            <motion.div
              key="critical-dams"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-3 rounded-xl bg-amber-500 text-white px-5 py-4 flex items-center gap-3 shadow-lg shadow-amber-400/20"
            >
              <Droplets className="w-5 h-5 shrink-0" />
              <p className="text-sm font-bold">
                {criticalDams.map(d => d.damName).join(', ')} {criticalDams.length === 1 ? 'is' : 'are'} critically low (&lt;20%).
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="space-y-4 mt-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* ── Tab nav ── */}
            <div className="flex gap-1 overflow-x-auto pb-1 mb-6 -mx-1 px-1 scrollbar-hide">
              {TABS.map(tab => {
                const count = tabCounts[tab.id];
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {count > 0 && tab.id !== 'preparedness' && (
                      <span className={`ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Tab content ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                {activeTab === 'alerts' && (
                  visibleAlerts.length === 0
                    ? <EmptyState message={`No active water alerts in ${province}`} />
                    : (
                      <div className="space-y-4">
                        {[...visibleAlerts]
                          .sort((a, b) => {
                            const order = { critical: 0, high: 1, medium: 2, low: 3 };
                            return order[a.urgency] - order[b.urgency];
                          })
                          .map(alert => (
                            <AlertCard key={alert.id} alert={alert} onDismiss={id => setDismissed(p => new Set([...p, id]))} />
                          ))}
                      </div>
                    )
                )}

                {activeTab === 'dams' && (
                  damLevels.length === 0
                    ? <EmptyState message={`No dam data available for ${province}`} />
                    : <DamTrendsChart dams={damLevels} />
                )}

                {activeTab === 'restrictions' && (
                  <RestrictionLevelGuide restrictions={restrictions} province={province} />
                )}

                {activeTab === 'maintenance' && (
                  maintenance.length === 0
                    ? <EmptyState message={`No scheduled maintenance in ${province}`} />
                    : (
                      <div className="space-y-4">
                        {[...maintenance]
                          .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                          .map(item => (
                            <MaintenanceCard key={item.id} item={item} />
                          ))}
                      </div>
                    )
                )}

                {activeTab === 'preparedness' && <PreparednessSection />}

                {activeTab === 'research' && (
                  <ResearchSection news={news} province={province} />
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {/* ── Footer ── */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-400">
          <span>
            Last updated:{' '}
            <span className="font-semibold text-slate-600">{getLastFetchLabel(lastFetched)}</span>
            {dataSource === 'seed' && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">Demo data</span>
            )}
            {dataSource === 'live' && (
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">Live</span>
            )}
          </span>
          <a
            href="https://www.dws.gov.za"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 font-semibold transition-colors"
          >
            Source: DWS <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </main>
    </div>
  );
}

export const WaterDashboardPage = withAuth(WaterDashboardPageComponent);
export default WaterDashboardPage;
