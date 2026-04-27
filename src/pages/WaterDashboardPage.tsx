import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  ChevronDown, AlertTriangle, Droplets, Wrench,
  TrendingUp, TrendingDown, Minus, RefreshCw,
  ChevronLeft, ExternalLink, X,
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import {
  getWaterDataByProvince, getLastFetchLabel,
  SA_PROVINCES,
  type WaterAlert, type DamLevel, type MaintenanceSchedule,
} from '../services/waterService';

// ── Constants ──────────────────────────────────────────────────────────────────

const PROVINCE_STORAGE_KEY = 'water_dashboard_province';

const URGENCY_CONFIG = {
  critical: { label: 'Critical', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', bar: 'bg-red-500', dot: 'bg-red-500' },
  high:     { label: 'High',     bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', bar: 'bg-slate-500', dot: 'bg-slate-500' },
  medium:   { label: 'Medium',   bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', bar: 'bg-amber-500', dot: 'bg-amber-400' },
  low:      { label: 'Low',      bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', bar: 'bg-green-500', dot: 'bg-green-500' },
};

const TREND_CONFIG = {
  rising:  { icon: <TrendingUp className="w-4 h-4" />,   label: 'Rising',  color: 'text-green-600' },
  stable:  { icon: <Minus className="w-4 h-4" />,        label: 'Stable',  color: 'text-blue-600' },
  falling: { icon: <TrendingDown className="w-4 h-4" />, label: 'Falling', color: 'text-slate-500' },
};

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
      className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5 relative`}
    >
      <button
        onClick={() => onDismiss(alert.id)}
        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-black/10 transition-colors"
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

          <div className={`rounded-xl p-3 ${cfg.bg} border ${cfg.border} bg-white/40`}>
            <p className="text-xs font-bold text-slate-700 mb-0.5">What to do:</p>
            <p className="text-sm text-slate-700">{alert.recommendation}</p>
          </div>

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

function DamCard({ dam }: { dam: DamLevel }) {
  const trend = TREND_CONFIG[dam.trend];
  const level = Math.min(100, Math.max(0, dam.levelPercent));
  const isCritical = level < 20;

  const barColor = isCritical
    ? 'bg-red-500'
    : level < 40
    ? 'bg-slate-500'
    : level < 60
    ? 'bg-amber-500'
    : 'bg-blue-500';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">{dam.damName}</h4>
        </div>
        {isCritical && (
          <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">Critical</span>
        )}
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-2xl font-black text-slate-900">{level.toFixed(1)}%</span>
          <span className={`flex items-center gap-1 text-xs font-semibold ${trend.color}`}>
            {trend.icon}
            {trend.label}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-700`}
            style={{ width: `${level}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-2">
        Updated {dam.lastUpdated.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
      </p>
    </div>
  );
}

function MaintenanceCard({ item }: { item: MaintenanceSchedule }) {
  const fmt = (d: Date) => d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  const isUpcoming = item.startDate > new Date();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
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

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">{title}</h2>
      {count > 0 && (
        <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{count}</span>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <p className="text-sm text-slate-400 font-medium">{message}</p>
    </div>
  );
}

// ── Province Selector ──────────────────────────────────────────────────────────

function ProvinceSelector({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (p: string) => void;
}) {
  return (
    <div className="relative inline-block">
      <select
        value={selected}
        onChange={e => onChange(e.target.value)}
        className="appearance-none pl-4 pr-9 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 shadow-sm hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
      >
        {SA_PROVINCES.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

interface WaterDashboardPageProps extends AuthedProps {}

function WaterDashboardPageComponent({ user, onNavigate, onSignOut }: WaterDashboardPageProps) {
  const [province, setProvince] = useState<string>(
    () => localStorage.getItem(PROVINCE_STORAGE_KEY) ?? 'Gauteng'
  );
  const [alerts, setAlerts] = useState<WaterAlert[]>([]);
  const [damLevels, setDamLevels] = useState<DamLevel[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceSchedule[]>([]);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const load = useCallback(async (prov: string) => {
    setLoading(true);
    const data = await getWaterDataByProvince(prov);
    setAlerts(data.alerts);
    setDamLevels(data.damLevels);
    setMaintenance(data.maintenance);
    setLastFetched(data.lastFetched);
    setLoading(false);
    setDismissed(new Set());
  }, []);

  useEffect(() => { load(province); }, [province, load]);

  const handleProvinceChange = (p: string) => {
    setProvince(p);
    localStorage.setItem(PROVINCE_STORAGE_KEY, p);
  };

  const handleDismiss = (id: string) => setDismissed(prev => new Set([...prev, id]));

  const visibleAlerts = alerts.filter(a => !dismissed.has(a.id));

  const criticalCount = visibleAlerts.filter(a => a.urgency === 'critical').length;

  return (
    <div className="min-h-screen bg-bg-light">
      <AppHeader currentPage="water-dashboard" user={user} onNavigate={onNavigate} mode="community" />

      <main className="max-w-4xl mx-auto px-4 pt-20 pb-16">
        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-h3 text-text-primary leading-tight">Water Dashboard</h1>
                <p className="text-sm text-slate-500 font-medium">South Africa water status &amp; dam levels</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ProvinceSelector selected={province} onChange={handleProvinceChange} />
            <button
              onClick={() => load(province)}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all disabled:opacity-40"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* ── Critical banner ── */}
        {criticalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 rounded-2xl bg-red-600 text-white px-5 py-4 flex items-center gap-3 shadow-lg shadow-red-500/20"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">
              {criticalCount} critical water alert{criticalCount > 1 ? 's' : ''} active in {province}. Take action immediately.
            </p>
          </motion.div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {/* ── Alerts ── */}
            <section>
              <SectionHeader title="Active Alerts" count={visibleAlerts.length} />
              {visibleAlerts.length === 0 ? (
                <EmptyState message={`No active water alerts in ${province}`} />
              ) : (
                <div className="space-y-4">
                  {[...visibleAlerts]
                    .sort((a, b) => {
                      const order = { critical: 0, high: 1, medium: 2, low: 3 };
                      return order[a.urgency] - order[b.urgency];
                    })
                    .map(alert => (
                      <AlertCard key={alert.id} alert={alert} onDismiss={handleDismiss} />
                    ))}
                </div>
              )}
            </section>

            {/* ── Dam Levels ── */}
            <section>
              <SectionHeader title="Dam Levels" count={damLevels.length} />
              {damLevels.length === 0 ? (
                <EmptyState message={`No dam data available for ${province}`} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {damLevels.map(dam => (
                    <DamCard key={dam.id} dam={dam} />
                  ))}
                </div>
              )}
            </section>

            {/* ── Maintenance ── */}
            <section>
              <SectionHeader title="Scheduled Maintenance" count={maintenance.length} />
              {maintenance.length === 0 ? (
                <EmptyState message={`No scheduled maintenance in ${province}`} />
              ) : (
                <div className="space-y-4">
                  {[...maintenance]
                    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                    .map(item => (
                      <MaintenanceCard key={item.id} item={item} />
                    ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-400">
          <span>
            Last updated:{' '}
            <span className="font-semibold text-slate-600">{getLastFetchLabel(lastFetched)}</span>
            {lastFetched === null && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">Demo data</span>
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
