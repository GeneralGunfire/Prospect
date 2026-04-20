import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, Plus, List, Filter, X, Flag,
  CheckCircle2, AlertTriangle, ChevronDown, Loader2, ArrowRight,
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import {
  getAllPotholes, flagPothole, markPotholeAsFixed, hasUserFlaggedPothole,
  type Pothole, type PotholeFilters,
} from '../services/potholeService';
import { SA_PROVINCES } from '../data/saLocations';

const SA_CENTER: [number, number] = [-28.5, 25.5];

function makePinIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:20px;height:20px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

const ICONS = {
  needs_fixing:   makePinIcon('#ef4444'),
  needs_attention: makePinIcon('#f59e0b'),
  fixed:          makePinIcon('#10b981'),
};

function SeverityBadge({ severity }: { severity: Pothole['severity'] }) {
  const cls = { low: 'bg-emerald-50 text-emerald-700 border-emerald-200', medium: 'bg-amber-50 text-amber-700 border-amber-200', high: 'bg-red-50 text-red-700 border-red-200' }[severity];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${cls}`}>{severity[0].toUpperCase() + severity.slice(1)}</span>;
}

function StatusBadge({ pothole }: { pothole: Pothole }) {
  if (pothole.status === 'fixed')
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" />Fixed</span>;
  if (pothole.needs_fixing)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200"><AlertTriangle className="w-3 h-3" />Needs Fixing</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200"><Flag className="w-3 h-3" />Reported</span>;
}

interface PotholeMapPageProps extends AuthedProps {}

function PotholeMapPageComponent({ user, onNavigate }: PotholeMapPageProps) {
  const [potholes, setPotholes]       = useState<Pothole[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filters, setFilters]         = useState<PotholeFilters>({});
  const [streetSearch, setStreetSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected]       = useState<Pothole | null>(null);
  const [flagging, setFlagging]       = useState(false);
  const [alreadyFlagged, setAlreadyFlagged] = useState(false);
  const [flagMsg, setFlagMsg]         = useState('');
  const [fixing, setFixing]           = useState(false);
  const [fixConfirm, setFixConfirm]   = useState(false);
  const [mapReady, setMapReady]       = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAllPotholes(filters);
    const filtered = streetSearch
      ? data.filter((p) =>
          p.street_name?.toLowerCase().includes(streetSearch.toLowerCase()) ||
          p.address.toLowerCase().includes(streetSearch.toLowerCase())
        )
      : data;
    setPotholes(filtered);
    setLoading(false);
  }, [filters, streetSearch]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setTimeout(() => setMapReady(true), 100); }, []);

  async function openDetail(pothole: Pothole) {
    setSelected(pothole);
    setFlagMsg('');
    setFixConfirm(false);
    setAlreadyFlagged(false);
    if (user.id !== 'guest') {
      const flagged = await hasUserFlaggedPothole(pothole.id, user.id);
      setAlreadyFlagged(flagged);
    }
  }

  function closeDetail() { setSelected(null); setFlagMsg(''); setFixConfirm(false); }

  async function handleFlag() {
    if (!selected || user.id === 'guest') { onNavigate('auth'); return; }
    setFlagging(true);
    const result = await flagPothole(selected.id, user.id);
    if (result.error === 'already_flagged') {
      setAlreadyFlagged(true);
      setFlagMsg("You've already flagged this pothole.");
    } else if (result.success) {
      setFlagMsg(`Thank you! Flag count: ${result.flagCount}`);
      setAlreadyFlagged(true);
      const update = { flag_count: result.flagCount, needs_fixing: result.needsFixing };
      setPotholes((prev) => prev.map((p) => p.id === selected.id ? { ...p, ...update } : p));
      setSelected((prev) => prev ? { ...prev, ...update } : prev);
    } else {
      setFlagMsg(result.error ?? 'Failed to flag. Try again.');
    }
    setFlagging(false);
  }

  async function handleMarkFixed() {
    if (!selected) return;
    setFixing(true);
    const result = await markPotholeAsFixed(selected.id, user.id);
    if (result.success) {
      setPotholes((prev) => prev.map((p) => p.id === selected.id ? { ...p, status: 'fixed' } : p));
      setSelected((prev) => prev ? { ...prev, status: 'fixed' } : prev);
      setFixConfirm(false);
    }
    setFixing(false);
  }

  const canMarkFixed = selected?.user_id === user.id && selected?.status !== 'fixed';

  // ── Legend ────────────────────────────────────────────────────────────────────
  const Legend = () => (
    <div className="absolute bottom-4 left-4 z-[400] bg-white rounded-xl shadow-lg border border-slate-200 px-3 py-2.5 text-xs space-y-1.5">
      {[
        { color: '#ef4444', label: 'Needs Fixing (3+ flags)' },
        { color: '#f59e0b', label: 'Reported' },
        { color: '#10b981', label: 'Fixed' },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full shrink-0 border-2 border-white shadow-sm" style={{ background: color }} />
          <span className="text-slate-600">{label}</span>
        </div>
      ))}
    </div>
  );

  // ── Pothole list item ─────────────────────────────────────────────────────────
  const PotholeItem = ({ p }: { p: Pothole }) => (
    <button
      onClick={() => openDetail(p)}
      className="w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
    >
      <p className="font-bold text-sm text-slate-800 truncate">{p.street_name ?? p.address}</p>
      <p className="text-xs text-slate-400 mt-0.5 truncate">{p.municipality ? `${p.municipality}, ` : ''}{p.province}</p>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <SeverityBadge severity={p.severity} />
        <StatusBadge pothole={p} />
        <span className="text-[10px] text-slate-400">{p.flag_count} flag{p.flag_count !== 1 ? 's' : ''}</span>
      </div>
    </button>
  );

  return (
    <div className="flex flex-col bg-slate-50" style={{ height: '100dvh' }}>
      {/* Fixed header */}
      <AppHeader currentPage="pothole-map" user={user} onNavigate={onNavigate} mode="community" />

      {/* Page body — fills remaining height below fixed header */}
      <div className="flex flex-col flex-1 min-h-0 pt-16">

        {/* ── Toolbar ── */}
        <div className="shrink-0 bg-white border-b border-slate-200 px-3 py-2.5 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate('flag-pothole')}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Report
          </button>

          <input
            type="text"
            placeholder="Search street or address…"
            value={streetSearch}
            onChange={(e) => setStreetSearch(e.target.value)}
            className="flex-1 min-w-0 h-8 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-slate-400"
          />

          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors shrink-0 ${
              showFilters || filters.province || filters.needsFixingOnly
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile: toggle list panel */}
          <button
            onClick={() => setShowMobileList((v) => !v)}
            className="lg:hidden flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 text-slate-600 shrink-0"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigate('my-pothole-contributions')}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:border-slate-300 transition-colors shrink-0"
          >
            <List className="w-3.5 h-3.5" /> My Reports
          </button>
        </div>

        {/* ── Filter bar ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="shrink-0 overflow-hidden bg-white border-b border-slate-200"
            >
              <div className="px-3 py-2.5 flex flex-wrap gap-3 items-center">
                <select
                  value={filters.province ?? ''}
                  onChange={(e) => setFilters((f) => ({ ...f, province: e.target.value || undefined }))}
                  className="h-8 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                >
                  <option value="">All provinces</option>
                  {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>

                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!filters.needsFixingOnly}
                    onChange={(e) => setFilters((f) => ({ ...f, needsFixingOnly: e.target.checked || undefined }))}
                    className="rounded"
                  />
                  Needs Fixing only
                </label>

                {(filters.province || filters.needsFixingOnly) && (
                  <button onClick={() => setFilters({})} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main content: map + sidebar ── */}
        <div className="flex-1 flex min-h-0 overflow-hidden">

          {/* Map — isolated so Leaflet z-indices don't bleed */}
          <div className="flex-1 relative min-w-0" style={{ isolation: 'isolate' }}>
            {mapReady && (
              <MapContainer
                center={SA_CENTER}
                zoom={6}
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {potholes.map((p) => {
                  if (!p.latitude && !p.longitude) return null;
                  return (
                    <Marker
                      key={p.id}
                      position={[p.latitude, p.longitude]}
                      icon={ICONS[p.status] ?? ICONS.needs_attention}
                      eventHandlers={{ click: () => openDetail(p) }}
                    >
                      <Popup>
                        <div className="text-xs space-y-1 min-w-[160px]">
                          <p className="font-bold text-slate-800">{p.street_name ?? p.address}</p>
                          <p className="text-slate-500">{p.municipality ? `${p.municipality}, ` : ''}{p.province}</p>
                          <div className="flex gap-1 flex-wrap">
                            <SeverityBadge severity={p.severity} />
                            <StatusBadge pothole={p} />
                          </div>
                          <p className="text-slate-400">{p.flag_count} flag{p.flag_count !== 1 ? 's' : ''}</p>
                          <button onClick={() => openDetail(p)} className="flex items-center gap-1 text-blue-600 font-semibold mt-1">
                            View Details <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}

            <Legend />

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-[500]">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            )}
          </div>

          {/* Desktop sidebar — always visible on lg+ */}
          <div className="hidden lg:flex flex-col w-80 xl:w-96 bg-white border-l border-slate-200 min-h-0">
            <div className="shrink-0 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {potholes.length} pothole{potholes.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {potholes.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <MapPin className="w-8 h-8 text-slate-200 mb-3" />
                  <p className="text-sm text-slate-500 mb-3">No potholes found.</p>
                  <button onClick={() => onNavigate('flag-pothole')} className="text-xs text-blue-600 font-semibold">
                    Report the first one →
                  </button>
                </div>
              ) : (
                <div>
                  {potholes.map((p) => <PotholeItem key={p.id} p={p} />)}
                </div>
              )}
            </div>
          </div>

          {/* Mobile sliding list panel */}
          <AnimatePresence>
            {showMobileList && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowMobileList(false)}
                  className="lg:hidden fixed inset-0 bg-black/30 z-[600]"
                />
                <motion.div
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                  className="lg:hidden fixed top-0 right-0 bottom-0 w-72 bg-white z-[700] flex flex-col shadow-2xl"
                >
                  <div className="shrink-0 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {potholes.length} pothole{potholes.length !== 1 ? 's' : ''}
                    </p>
                    <button onClick={() => setShowMobileList(false)} className="p-1 rounded-lg hover:bg-slate-100">
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {potholes.map((p) => <PotholeItem key={p.id} p={p} />)}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Detail slide-out panel ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeDetail}
              className="fixed inset-0 bg-black/40 z-[800]"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[900] flex flex-col shadow-2xl"
            >
              <div className="shrink-0 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-black text-slate-800 text-base">Pothole Details</h2>
                <button onClick={closeDetail} className="p-1.5 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {selected.image_url && (
                  <img src={selected.image_url} alt="Pothole" className="w-full h-48 object-cover rounded-2xl border border-slate-200" />
                )}

                <div>
                  <h3 className="text-xl font-black text-slate-800">{selected.street_name ?? selected.address}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {selected.municipality ? `${selected.municipality}, ` : ''}{selected.province}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <SeverityBadge severity={selected.severity} />
                  <StatusBadge pothole={selected} />
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    <Flag className="w-3 h-3" /> {selected.flag_count} flag{selected.flag_count !== 1 ? 's' : ''}
                  </span>
                </div>

                {selected.description && (
                  <p className="text-sm text-slate-600 leading-relaxed">{selected.description}</p>
                )}

                <p className="text-xs text-slate-400">
                  Reported {new Date(selected.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                {/* Flag action */}
                {selected.status !== 'fixed' && (
                  <div>
                    {flagMsg ? (
                      <p className="text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">{flagMsg}</p>
                    ) : alreadyFlagged ? (
                      <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">You've already flagged this pothole.</p>
                    ) : (
                      <button
                        onClick={handleFlag}
                        disabled={flagging}
                        className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-2xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {flagging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
                        Flag This Pothole
                      </button>
                    )}
                  </div>
                )}

                {/* Mark as fixed */}
                {canMarkFixed && (
                  <div>
                    {!fixConfirm ? (
                      <button
                        onClick={() => setFixConfirm(true)}
                        className="w-full h-11 border-2 border-emerald-400 text-emerald-700 font-bold text-sm rounded-2xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark as Fixed
                      </button>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                        <p className="text-sm font-semibold text-emerald-800 mb-3">Confirm this pothole has been fixed?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleMarkFixed}
                            disabled={fixing}
                            className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                          >
                            {fixing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Fixed'}
                          </button>
                          <button onClick={() => setFixConfirm(false)} className="px-4 h-10 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export const PotholeMapPage = withAuth(PotholeMapPageComponent);
export default PotholeMapPage;
