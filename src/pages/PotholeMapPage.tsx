import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Plus, Filter, X, Flag,
  CheckCircle2, AlertTriangle, ChevronDown, Loader2, ArrowRight,
  TrendingUp
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import {
  getAllPotholes, flagPothole, markPotholeAsFixed, hasUserFlaggedPothole,
  type Pothole, type PotholeFilters,
} from '../services/potholeService';
import { SA_PROVINCES } from '../data/saLocations';

function SeverityBadge({ severity }: { severity: Pothole['severity'] }) {
  const cls = { low: 'bg-blue-50 text-blue-700 border-blue-200', medium: 'bg-amber-50 text-amber-700 border-amber-200', high: 'bg-red-50 text-red-700 border-red-200' }[severity];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${cls}`}>{severity[0].toUpperCase() + severity.slice(1)}</span>;
}

function StatusBadge({ pothole }: { pothole: Pothole }) {
  if (pothole.status === 'fixed')
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200"><CheckCircle2 className="w-3 h-3" />Fixed</span>;
  if (pothole.needs_fixing)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200"><AlertTriangle className="w-3 h-3" />Needs Fixing</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><Flag className="w-3 h-3" />Reported</span>;
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

  // Stats calculation
  const totalCount = potholes.length;
  const fixedCount = potholes.filter(p => p.status === 'fixed').length;
  const urgentCount = potholes.filter(p => p.flag_count >= 3 && p.status !== 'fixed').length;

  const PotholeItem = ({ p }: { p: Pothole }) => {
    const isPriority = p.flag_count >= 3 && p.status !== 'fixed';
    return (
      <div
        className={`w-full flex items-center justify-between p-5 transition-all bg-white border-b border-slate-100 last:border-0 hover:bg-slate-50 group cursor-pointer ${
          isPriority ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''
        }`}
        onClick={() => openDetail(p)}
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
           <div className={`p-3 rounded-xl shrink-0 ${p.status === 'fixed' ? 'bg-green-100 text-green-700' : isPriority ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
              <MapPin className="w-6 h-6" />
           </div>
           <div className="flex-1 min-w-0">
             {isPriority && (
               <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-700 uppercase tracking-widest mb-1.5">
                 <AlertTriangle className="w-3 h-3" /> Priority Report
               </span>
             )}
             <h3 className={`text-base truncate ${isPriority ? 'font-black text-slate-900' : 'font-bold text-slate-800'}`}>
               {p.street_name || p.address || 'Unknown Location'}
             </h3>
             <p className="text-xs text-slate-500 mt-1 truncate">{p.municipality ? `${p.municipality}, ` : ''}{p.province}</p>
             <div className="flex items-center gap-2 mt-3 flex-wrap">
               <SeverityBadge severity={p.severity} />
               <StatusBadge pothole={p} />
               <span className={`text-xs font-semibold ${p.status === 'fixed' ? 'text-green-600' : isPriority ? 'text-red-600' : 'text-slate-500'}`}>
                 {p.flag_count} flag{p.flag_count !== 1 ? 's' : ''}
               </span>
             </div>
           </div>
        </div>
        <div className="shrink-0 pl-4 hidden sm:block">
           <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              View <ArrowRight className="w-3.5 h-3.5" />
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      <AppHeader currentPage="pothole-map" user={user} onNavigate={onNavigate} mode="community" />

      <div className="flex flex-col flex-1 pt-20">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Community Potholes</h1>
               <p className="text-slate-500 text-sm max-w-lg">Track, report, and stay updated on road issues in your community. Flag priority problems so they get attention.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
               <button
                 onClick={() => onNavigate('my-pothole-contributions')}
                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest hover:border-slate-300 bg-white transition-all shadow-sm"
               >
                 My Reports
               </button>
               <button
                 onClick={() => onNavigate('flag-pothole')}
                 className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-lg shadow-slate-900/20 transition-all shrink-0"
               >
                 <Plus className="w-4 h-4" /> Report Issue
               </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
             <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                   <TrendingUp className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                   <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Total Reports</p>
                   <p className="text-2xl font-black text-slate-900">{totalCount}</p>
                </div>
             </div>
             <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                   <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                   <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Priority Action</p>
                   <p className="text-2xl font-black text-red-600">{urgentCount}</p>
                </div>
             </div>
             <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                   <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                   <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Fixed Issues</p>
                   <p className="text-2xl font-black text-green-600">{fixedCount}</p>
                </div>
             </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input
                   type="text"
                   placeholder="Search street name or address..."
                   value={streetSearch}
                   onChange={(e) => setStreetSearch(e.target.value)}
                   className="w-full h-11 pl-10 pr-4 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 bg-slate-50 transition-colors"
                 />
              </div>
              <button
                onClick={() => setShowFilters(v => !v)}
                className={`flex items-center gap-2 h-11 px-4 rounded-xl border font-bold text-xs uppercase tracking-widest transition-colors shrink-0 w-full sm:w-auto justify-center ${showFilters || filters.province || filters.needsFixingOnly ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <Filter className="w-4 h-4" /> Filters <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center">
                    <div>
                      <select
                        value={filters.province ?? ''}
                        onChange={(e) => setFilters(f => ({ ...f, province: e.target.value || undefined }))}
                        className="h-10 px-4 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none bg-white text-slate-700 appearance-none pr-8 cursor-pointer relative"
                      >
                        <option value="">All Provinces</option>
                        {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>

                    <label className="flex items-center gap-2 bg-red-50 text-red-700 px-4 h-10 rounded-xl cursor-pointer border border-red-100 hover:bg-red-100 transition-colors select-none">
                      <input
                        type="checkbox"
                        checked={!!filters.needsFixingOnly}
                        onChange={(e) => setFilters(f => ({ ...f, needsFixingOnly: e.target.checked || undefined }))}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-red-300"
                      />
                      <span className="text-xs font-black uppercase tracking-wider">Unfixed Issues Only</span>
                    </label>

                    {(filters.province || filters.needsFixingOnly) && (
                      <button onClick={() => setFilters({})} className="text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-widest flex items-center gap-1.5 ml-auto">
                        <X className="w-3.5 h-3.5" /> Clear Filters
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* List Content */}
          <div className="relative min-h-[400px]">
             {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
                   <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
             ) : potholes.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-12 text-center flex flex-col items-center">
                   <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                      <MapPin className="w-8 h-8 text-slate-300" />
                   </div>
                   <h3 className="text-lg font-black text-slate-800 mb-2">No Reports Found</h3>
                   <p className="text-slate-500 max-w-sm mb-6 text-sm">We couldn't find any potholes matching your criteria. Be the first to report an issue in this area.</p>
                   <button
                     onClick={() => onNavigate('flag-pothole')}
                     className="bg-slate-900 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg"
                   >
                     Report Issue
                   </button>
                </div>
             ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transform-gpu">
                   {[...potholes]
                      .sort((a, b) => (b.flag_count >= 3 && b.status !== 'fixed' ? 1 : 0) - (a.flag_count >= 3 && a.status !== 'fixed' ? 1 : 0))
                      .map(p => <PotholeItem key={p.id} p={p} />)}
                </div>
             )}
          </div>
        </div>
      </div>

      {/* ── Detail slide-out panel ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeDetail}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[800]"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[900] flex flex-col shadow-2xl"
            >
              <div className="shrink-0 px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur">
                <h2 className="font-black text-slate-900 text-lg tracking-tight">Report Details</h2>
                <button onClick={closeDetail} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {selected.flag_count >= 3 && selected.status !== 'fixed' && (
                  <div className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 shadow-sm">
                    <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-black text-red-900 uppercase tracking-widest mb-1">Priority Report</p>
                      <p className="text-xs text-red-700 leading-relaxed">This report has {selected.flag_count} flags and requires urgent attention from the municipality.</p>
                    </div>
                  </div>
                )}

                {selected.image_url ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <img src={selected.image_url} alt="Pothole" className="w-full h-64 object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-slate-100 rounded-2xl border border-slate-200 border-dashed flex items-center justify-center text-slate-400">
                    No image provided
                  </div>
                )}

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{selected.street_name ?? selected.address}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4 font-medium">
                    <MapPin className="w-4 h-4" />
                    {selected.municipality ? `${selected.municipality}, ` : ''}{selected.province}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                    <SeverityBadge severity={selected.severity} />
                    <StatusBadge pothole={selected} />
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-600 border border-slate-200 shadow-sm">
                      <Flag className="w-3.5 h-3.5" /> {selected.flag_count} flag{selected.flag_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {selected.description && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</h4>
                    <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 border border-slate-100 rounded-2xl shadow-sm">{selected.description}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-2">
                  <span>ID: {selected.id.slice(0,8)}...</span>
                  <span>Reported {new Date(selected.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>

                {/* Actions */}
                <div className="pt-4 space-y-3">
                  {selected.status !== 'fixed' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1">
                      {flagMsg ? (
                        <p className="text-sm font-bold text-blue-700 bg-blue-50 rounded-xl px-5 py-4">{flagMsg}</p>
                      ) : alreadyFlagged ? (
                        <p className="text-sm font-bold text-slate-600 bg-slate-50 rounded-xl px-5 py-4 flex items-center gap-2">
                           <CheckCircle2 className="w-5 h-5 text-slate-400" /> You flagged this
                        </p>
                      ) : (
                        <button
                          onClick={handleFlag}
                          disabled={flagging}
                          className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {flagging ? <Loader2 className="w-5 h-5 animate-spin" /> : <Flag className="w-5 h-5" />}
                          Upvote/Flag Issue
                        </button>
                      )}
                    </div>
                  )}

                  {canMarkFixed && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1">
                      {!fixConfirm ? (
                        <button
                          onClick={() => setFixConfirm(true)}
                          className="w-full h-12 border-2 border-green-500 text-green-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" /> Mark as Fixed
                        </button>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                          <p className="text-sm font-black text-green-900 mb-4 text-center">Confirm this is fixed?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={handleMarkFixed}
                              disabled={fixing}
                              className="flex-1 h-11 bg-green-500 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              {fixing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Fixed'}
                            </button>
                            <button onClick={() => setFixConfirm(false)} className="px-5 h-11 border border-slate-300 bg-white text-slate-600 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
