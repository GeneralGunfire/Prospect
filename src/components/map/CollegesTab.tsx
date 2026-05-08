import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ExternalLink, Building2 } from 'lucide-react';
import { getUniversitiesByProvince, getTVETCollegesByProvince } from '../../services/mapService';

interface CollegesTabProps {
  province: string;
  searchQuery: string;
}

export default function CollegesTab({ province, searchQuery }: CollegesTabProps) {
  const [activeSubtab, setActiveSubtab] = useState<'universities' | 'tvet'>('universities');

  const universities = getUniversitiesByProvince(province);
  const tvetColleges = getTVETCollegesByProvince(province);

  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return universities;
    const lower = searchQuery.toLowerCase();
    return universities.filter(
      (u) => u.name.toLowerCase().includes(lower) || u.city.toLowerCase().includes(lower)
    );
  }, [universities, searchQuery]);

  const filteredTVET = useMemo(() => {
    if (!searchQuery.trim()) return tvetColleges;
    const lower = searchQuery.toLowerCase();
    return tvetColleges.filter(
      (c) => c.name.toLowerCase().includes(lower) || c.city.toLowerCase().includes(lower)
    );
  }, [tvetColleges, searchQuery]);

  const activeList = activeSubtab === 'universities' ? filteredUniversities : filteredTVET;

  if (universities.length === 0 && tvetColleges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Building2 className="w-10 h-10 text-slate-300 mb-4" />
        <p className="text-lg font-semibold text-slate-900">No colleges found</p>
        <p className="text-sm text-slate-600 mt-2">This province has limited educational institutions</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          Universities & Colleges in {province}
        </h3>
        <p className="text-sm text-slate-600">Find institutions and explore programs</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b-2 border-slate-200">
        <motion.button
          onClick={() => setActiveSubtab('universities')}
          className={`px-4 py-3 font-semibold text-sm transition ${
            activeSubtab === 'universities'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          style={{
            borderBottom: activeSubtab === 'universities' ? '2px solid #1B5E20' : 'none',
            color: activeSubtab === 'universities' ? '#1B5E20' : undefined,
          }}
        >
          🎓 Universities ({universities.length})
        </motion.button>
        <motion.button
          onClick={() => setActiveSubtab('tvet')}
          className={`px-4 py-3 font-semibold text-sm transition ${
            activeSubtab === 'tvet'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          style={{
            borderBottom: activeSubtab === 'tvet' ? '2px solid #1B5E20' : 'none',
            color: activeSubtab === 'tvet' ? '#1B5E20' : undefined,
          }}
        >
          🏗️ TVET ({tvetColleges.length})
        </motion.button>
      </div>

      {/* College List */}
      <motion.div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {activeList.length === 0 ? (
            <p className="text-center text-slate-600 py-8">No results match your search</p>
          ) : (
            activeList.map((college, idx) => (
              <motion.div
                key={`${college.name}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border-2 border-slate-100 rounded-2xl p-4 hover:border-slate-900 hover:shadow-lg transition group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 group-hover:text-slate-900 transition line-clamp-2">
                      {college.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                      <MapPin size={14} />
                      <span>{college.city}</span>
                    </div>
                  </div>

                  {/* Directions Link */}
                  <motion.a
                    href={`https://maps.google.com/?q=${encodeURIComponent(college.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white transition shrink-0"
                  >
                    <ExternalLink size={16} />
                  </motion.a>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
