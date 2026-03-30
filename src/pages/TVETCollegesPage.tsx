import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Phone, Globe } from 'lucide-react';
import { tvetColleges } from '../data/tvetColleges';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import { TVETSubNav } from '../components/TVETSubNav';

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
      <AppHeader currentPage="careers" user={user} onNavigate={onNavigate} />
      <TVETSubNav currentPage="colleges" onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight" style={{ color: '#1B5E20' }}>
            Find <span style={{ color: '#64748b' }}>TVET Colleges</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
            Browse all {tvetColleges.length} public TVET colleges in South Africa. Filter by province or specialization to find the right college for your TVET career.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-12 space-y-6 bg-slate-50 rounded-xl p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search college name, city, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none shadow-sm focus:border-slate-400 transition-all"
              style={{ color: '#1e293b' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#1B5E20' }}>
                Province
              </h3>
              <div className="flex flex-wrap gap-2">
                {provinces.map((prov) => (
                  <button
                    key={prov}
                    onClick={() => setSelectedProvince(selectedProvince === prov ? null : prov)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border`}
                    style={
                      selectedProvince === prov
                        ? { backgroundColor: '#1B5E20', color: 'white', borderColor: '#1B5E20' }
                        : { backgroundColor: 'white', color: '#1B5E20', borderColor: '#e2e8f0' }
                    }
                  >
                    {prov}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#1B5E20' }}>
                Specialization
              </h3>
              <select
                value={selectedSpecialization || ''}
                onChange={(e) => setSelectedSpecialization(e.target.value || null)}
                className="w-full px-4 py-2 rounded-xl text-[10px] font-bold uppercase border outline-none"
                style={{
                  borderColor: selectedSpecialization ? '#1B5E20' : '#e2e8f0',
                  color: '#1B5E20',
                  backgroundColor: selectedSpecialization ? '#1B5E20' + '10' : 'white',
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
        <div className="mb-8">
          <p className="text-sm font-bold" style={{ color: '#1B5E20' }}>
            Showing {filteredColleges.length} college{filteredColleges.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Colleges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredColleges.length > 0 ? (
            filteredColleges.map((college, idx) => (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Header with demand indicator */}
                <div
                  className="h-2"
                  style={{
                    backgroundColor: '#1B5E20',
                  }}
                ></div>

                <div className="p-6">
                  {/* College Name */}
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#1B5E20' }}>
                    {college.name}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 mb-4" style={{ color: '#64748b' }}>
                    <MapPin className="w-4 h-4" style={{ color: '#1B5E20' }} />
                    <span className="text-sm font-medium">{college.city}, {college.province}</span>
                  </div>

                  {/* District */}
                  <p className="text-[11px] uppercase tracking-widest mb-4" style={{ color: '#64748b' }}>
                    District: {college.district}
                  </p>

                  {/* Specializations */}
                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#1B5E20' }}>
                      Specializations
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {college.specializations.slice(0, 4).map((spec) => (
                        <span
                          key={spec}
                          className="px-2 py-1 bg-slate-100 text-[9px] font-bold rounded text-gray-700"
                        >
                          {spec}
                        </span>
                      ))}
                      {college.specializations.length > 4 && (
                        <span className="px-2 py-1 bg-slate-100 text-[9px] font-bold rounded text-gray-700">
                          +{college.specializations.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* NSFAS */}
                  <div className="mb-4 pb-4 border-t border-slate-200 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#1B5E20' }}>
                      {college.nsfasAccredited ? '✓ NSFAS Accredited' : 'Limited NSFAS Support'}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    {college.phone && (
                      <div className="flex items-center gap-2 text-[11px]" style={{ color: '#64748b' }}>
                        <Phone className="w-3 h-3" style={{ color: '#1B5E20' }} />
                        <span>{college.phone}</span>
                      </div>
                    )}
                    {college.website && (
                      <div className="flex items-center gap-2 text-[11px]" style={{ color: '#64748b' }}>
                        <Globe className="w-3 h-3" style={{ color: '#1B5E20' }} />
                        <span>Website available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <button
                    className="w-full py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all text-white"
                    style={{ backgroundColor: '#1B5E20' }}
                  >
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <Search className="w-16 h-16 mx-auto mb-6 text-slate-200" />
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight" style={{ color: '#1B5E20' }}>
                No Colleges Found
              </h3>
              <p className="text-sm" style={{ color: '#64748b' }}>
                Try adjusting your search filters.
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div
          className="rounded-xl p-8 mb-12"
          style={{ backgroundColor: '#1B5E20' }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">About South African TVET Colleges</h2>
          <div className="text-white space-y-3 text-sm">
            <p>
              • South Africa has <strong>50 public TVET colleges</strong> spread across all 9 provinces
            </p>
            <p>
              • Colleges offer <strong>National Certificates (NC(V))</strong> at NQF Levels 2-4
            </p>
            <p>
              • Most are <strong>NSFAS accredited</strong>, making qualifications accessible to disadvantaged students
            </p>
            <p>
              • <strong>Admission requirements</strong> are flexible - National Senior Certificate (Grade 12) required, no minimum grades for most programs
            </p>
            <p>
              • <strong>Apprenticeships</strong> are available - earn money while learning a trade
            </p>
            <p>
              • <strong>Graduation rates</strong> are high because skills are immediately applicable to jobs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(TVETCollegesPage);
