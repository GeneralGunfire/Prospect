import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { tvetColleges } from '../../data/tvetColleges';
import { withAuth, type AuthedProps } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';
import { TVETSubNav } from '../../components/tvet/TVETSubNav';

function TVETCollegesPage({ user, onNavigate }: AuthedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);

  const provinces = Array.from(new Set(tvetColleges.map((c) => c.province))).sort();
  const specializations = Array.from(
    new Set(tvetColleges.flatMap((c) => c.specializations))
  ).sort();

  const filteredColleges = useMemo(() => {
    let results = tvetColleges;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.specializations.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (selectedProvince) {
      results = results.filter((c) => c.province === selectedProvince);
    }

    if (selectedSpecialization) {
      results = results.filter((c) => c.specializations.includes(selectedSpecialization));
    }

    return results;
  }, [searchQuery, selectedProvince, selectedSpecialization]);

  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="tvet" user={user} onNavigate={onNavigate} mode="career" />
      <TVETSubNav currentPage="colleges" onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 pt-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">TVET</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900" style={{ letterSpacing: '-0.025em' }}>Colleges</h1>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 sm:mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search college name, city, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors text-slate-900 min-h-11"
              style={{ fontSize: '16px' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400">
                Province
              </h3>
              <div className="flex flex-wrap gap-2">
                {provinces.map((prov) => (
                  <button
                    key={prov}
                    onClick={() => setSelectedProvince(selectedProvince === prov ? null : prov)}
                    className={`px-3 py-1.5 min-h-11 sm:min-h-0 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border`}
                    style={
                      selectedProvince === prov
                        ? { backgroundColor: '#1e293b', color: 'white', borderColor: '#1e293b' }
                        : { backgroundColor: 'white', color: '#1e293b', borderColor: '#e2e8f0' }
                    }
                  >
                    {prov}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400">
                Specialization
              </h3>
              <select
                value={selectedSpecialization || ''}
                onChange={(e) => setSelectedSpecialization(e.target.value || null)}
                className="w-full px-4 py-2 rounded-xl text-xs font-bold uppercase border outline-none"
                style={{
                  borderColor: selectedSpecialization ? '#1e293b' : '#e2e8f0',
                  color: '#1e293b',
                  backgroundColor: selectedSpecialization ? '#1e293b' + '10' : 'white',
                }}
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
            {filteredColleges.length} college{filteredColleges.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Colleges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 sm:mb-12">
          {filteredColleges.length > 0 ? (
            filteredColleges.map((college, idx) => (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors"
              >
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{college.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{college.city}, {college.province}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {college.specializations.slice(0, 3).map((spec) => (
                      <span key={spec} className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold rounded text-slate-600">
                        {spec}
                      </span>
                    ))}
                    {college.specializations.length > 3 && (
                      <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold rounded text-slate-600">
                        +{college.specializations.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      {college.nsfasAccredited ? 'NSFAS Accredited' : 'Limited NSFAS'}
                    </p>
                    {college.phone && <p className="text-[10px] text-slate-400">{college.phone}</p>}
                  </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-sm font-bold text-slate-900 mb-1">No colleges found</p>
              <p className="text-xs text-slate-400">Try adjusting your search filters.</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="rounded-xl border border-slate-100 p-6 mb-8 sm:mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">About TVET Colleges</p>
          <div className="divide-y divide-slate-100">
            {[
              '50 public TVET colleges across all 9 provinces',
              'National Certificates (NC(V)) at NQF Levels 2–4',
              'Most are NSFAS accredited — low or no cost',
              'No minimum matric grades required for most programs',
              'Apprenticeships pay you while you study (R8–15k/mo)',
            ].map((fact, i) => (
              <div key={i} className="flex gap-4 py-3">
                <span className="text-[10px] font-black text-slate-300 shrink-0 w-4">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-sm text-slate-600">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(TVETCollegesPage);
