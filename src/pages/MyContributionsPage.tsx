import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  MapPin, Flag, CheckCircle2, AlertTriangle, ChevronLeft,
  Plus, Map, Loader2,
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import {
  getUserReportedPotholes, getUserFlaggedPotholes,
  type Pothole,
} from '../services/potholeService';

function severityBadge(severity: Pothole['severity']) {
  const map = {
    low: 'bg-blue-50 text-blue-700 border-blue-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${map[severity]}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

function statusBadge(pothole: Pothole) {
  if (pothole.status === 'fixed') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
        <CheckCircle2 className="w-3 h-3" /> Fixed
      </span>
    );
  }
  if (pothole.needs_fixing) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
        <AlertTriangle className="w-3 h-3" /> Needs Fixing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
      <Flag className="w-3 h-3" /> Reported
    </span>
  );
}

function PotholeCard({ pothole, onViewOnMap }: { pothole: Pothole; onViewOnMap: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
    >
      {pothole.image_url && (
        <img
          src={pothole.image_url}
          alt="Pothole"
          className="w-full h-32 object-cover rounded-xl mb-3 border border-slate-100"
          loading="lazy"
        />
      )}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-bold text-sm text-slate-800 truncate">
            {pothole.street_name ?? pothole.address}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {pothole.province}{pothole.municipality ? ` · ${pothole.municipality}` : ''}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {severityBadge(pothole.severity)}
        {statusBadge(pothole)}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
          <Flag className="w-3 h-3" /> {pothole.flag_count} flag{pothole.flag_count !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {new Date(pothole.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
        <button
          onClick={onViewOnMap}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Map className="w-3.5 h-3.5" /> View on Map
        </button>
      </div>
    </motion.div>
  );
}

interface MyContributionsPageProps extends AuthedProps {}

function MyContributionsPageComponent({ user, onNavigate }: MyContributionsPageProps) {
  const [reported, setReported] = useState<Pothole[]>([]);
  const [flagged, setFlagged] = useState<Pothole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [r, f] = await Promise.all([
        getUserReportedPotholes(user.id),
        getUserFlaggedPotholes(user.id),
      ]);
      setReported(r);
      // Exclude potholes user both reported and flagged (avoid duplication)
      const reportedIds = new Set(r.map((p) => p.id));
      setFlagged(f.filter((p) => !reportedIds.has(p.id)));
      setLoading(false);
    }
    load();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentPage="my-pothole-contributions" user={user} onNavigate={onNavigate} mode="community" />

      <div className="pt-20 max-w-2xl mx-auto px-4 py-8 pb-24">
        <button
          onClick={() => onNavigate('pothole-map')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Map
        </button>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900">My Contributions</h1>
            <p className="text-sm text-slate-500 mt-1">Potholes you've reported and flagged</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('flag-pothole')}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Report
            </button>
            <button
              onClick={() => onNavigate('pothole-map')}
              className="flex items-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Map className="w-4 h-4" /> View All
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Reported section */}
            <section>
              <h2 className="text-xs font-black text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Potholes I Reported
                <span className="font-normal text-slate-400 normal-case tracking-normal">({reported.length})</span>
              </h2>
              {reported.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                  <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 mb-3">You haven't reported any potholes yet.</p>
                  <button
                    onClick={() => onNavigate('flag-pothole')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto"
                  >
                    Start Reporting <Plus className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {reported.map((p) => (
                    <PotholeCard
                      key={p.id}
                      pothole={p}
                      onViewOnMap={() => onNavigate('pothole-map')}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Flagged section */}
            <section>
              <h2 className="text-xs font-black text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Flag className="w-4 h-4 text-amber-500" /> Potholes I've Flagged
                <span className="font-normal text-slate-400 normal-case tracking-normal">({flagged.length})</span>
              </h2>
              {flagged.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                  <Flag className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 mb-3">You haven't flagged any potholes yet.</p>
                  <button
                    onClick={() => onNavigate('pothole-map')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto"
                  >
                    Explore Map <Map className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {flagged.map((p) => (
                    <PotholeCard
                      key={p.id}
                      pothole={p}
                      onViewOnMap={() => onNavigate('pothole-map')}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export const MyContributionsPage = withAuth(MyContributionsPageComponent);
export default MyContributionsPage;
