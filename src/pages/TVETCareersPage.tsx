import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, Briefcase, ChevronDown } from 'lucide-react';
import { tvetCareers } from '../data/tvetCareers';
import { TVETCareerCard } from '../components/TVETCareerCard';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import { TVETSubNav } from '../components/TVETSubNav';
import { getBookmarks, saveBookmark, removeBookmark } from '../services/dashboardService';
import type { CareerFull } from '../data/careersTypes';
import { CareerDetailModal } from '../components/CareerDetailModal';

function TVETCareersPage({ user, onNavigate }: AuthedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTradeType, setSelectedTradeType] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDemand, setSelectedDemand] = useState<string | null>(null);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 70000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerFull | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [savedCareers, setSavedCareers] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(30);
  const [isLoadingSaves, setIsLoadingSaves] = useState(true);
  const LOAD_MORE_INCREMENT = 30;

  // Fetch saved careers on mount
  useEffect(() => {
    const loadSavedCareers = async () => {
      setIsLoadingSaves(true);
      const bookmarks = await getBookmarks(user.id);
      const careerIds = bookmarks
        .filter((b) => b.bookmark_type === 'career')
        .map((b) => b.item_id);
      setSavedCareers(careerIds);
      setIsLoadingSaves(false);
    };

    loadSavedCareers();
  }, [user.id]);

  // Extract unique trade types from careers (based on industry/description keywords)
  const tradeTypes = [
    'Electrical & Energy',
    'Plumbing',
    'Construction',
    'Automotive',
    'Welding & Metal',
    'Engineering',
    'Hospitality',
    'Beauty',
    'IT & Digital',
    'Services',
  ];

  const provinces = Array.from(
    new Set(tvetCareers.flatMap((c) => c.jobLocations.provinces))
  ).sort();

  const demandLevels = ['high', 'medium', 'low'];

  const allFilteredCareers = useMemo(() => {
    let results = tvetCareers;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    if (selectedTradeType) {
      results = results.filter((c) => c.industryType.includes(selectedTradeType));
    }

    if (selectedProvince) {
      results = results.filter((c) => c.jobLocations.provinces.includes(selectedProvince));
    }

    if (selectedDemand) {
      results = results.filter((c) => c.jobDemand.level === selectedDemand);
    }

    results = results.filter(
      (c) => c.salary.entryLevel >= salaryRange[0] && c.salary.entryLevel <= salaryRange[1]
    );

    return results;
  }, [searchQuery, selectedTradeType, selectedProvince, selectedDemand, salaryRange]);

  const displayedCareers = useMemo(() => {
    return allFilteredCareers.slice(0, displayCount);
  }, [allFilteredCareers, displayCount]);

  const hasMoreCareers = allFilteredCareers.length > displayCount;
  const remainingCareers = allFilteredCareers.length - displayCount;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTradeType(null);
    setSelectedProvince(null);
    setSelectedDemand(null);
    setSalaryRange([0, 70000]);
    setDisplayCount(30);
  };

  const handleCareerClick = (career: CareerFull) => {
    setSelectedCareer(career);
    setShowDetailModal(true);
  };

  const toggleSaveCareer = async (careerId: string) => {
    if (savedCareers.includes(careerId)) {
      await removeBookmark(user.id, 'career', careerId);
      setSavedCareers(savedCareers.filter((s) => s !== careerId));
    } else {
      const career = tvetCareers.find((c) => c.id === careerId);
      await saveBookmark(user.id, 'career', careerId, career?.title);
      setSavedCareers([...savedCareers, careerId]);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader currentPage="careers" user={user} onNavigate={onNavigate} />
      <TVETSubNav currentPage="careers" onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(27,94,32,0.05)' }}
          >
            <Briefcase className="w-4 h-4" style={{ color: '#1B5E20' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1B5E20' }}>
              TVET Career Explorer
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight" style={{ color: '#1B5E20' }}>
            Explore <span style={{ color: '#64748b' }}>TVET Careers</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
            Browse {allFilteredCareers.length} TVET careers. Filter by trade type, location, or salary range.
          </p>
        </div>

        {/* Sticky search + filters */}
        <div
          className="mb-12 sticky top-20 z-40 py-4 -mx-4 px-4"
          style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search careers, trades, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none shadow-sm focus:border-slate-400 transition-all"
                style={{ color: '#1e293b' }}
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm border ${
                isFilterOpen ? 'text-white border-transparent' : 'bg-white border-slate-200 hover:border-slate-400'
              }`}
              style={isFilterOpen ? { backgroundColor: '#1B5E20', color: 'white' } : { color: '#1B5E20' }}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(selectedTradeType ||
                selectedProvince ||
                selectedDemand ||
                salaryRange[0] > 0 ||
                salaryRange[1] < 70000) && (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#64748b', color: 'white' }}>
                  {(selectedTradeType ? 1 : 0) + (selectedProvince ? 1 : 0) + (selectedDemand ? 1 : 0) + ((salaryRange[0] > 0 || salaryRange[1] < 70000) ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 space-y-6 border-t border-slate-100 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#1B5E20' }}>
                        Trade Type
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tradeTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setSelectedTradeType(selectedTradeType === type ? null : type)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border`}
                            style={
                              selectedTradeType === type
                                ? { backgroundColor: '#1B5E20', color: 'white', borderColor: '#1B5E20' }
                                : { backgroundColor: 'white', color: '#1B5E20', borderColor: '#e2e8f0' }
                            }
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#1B5E20' }}>
                        Province
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {provinces.map((prov) => (
                          <button
                            key={prov}
                            onClick={() => setSelectedProvince(selectedProvince === prov ? null : prov)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border`}
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#1B5E20' }}>
                        Job Demand
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {demandLevels.map((level) => (
                          <button
                            key={level}
                            onClick={() => setSelectedDemand(selectedDemand === level ? null : level)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border`}
                            style={
                              selectedDemand === level
                                ? {
                                    backgroundColor: level === 'high' ? '#10B981' : level === 'medium' ? '#F59E0B' : '#EF4444',
                                    color: 'white',
                                    borderColor: level === 'high' ? '#10B981' : level === 'medium' ? '#F59E0B' : '#EF4444',
                                  }
                                : { backgroundColor: 'white', color: '#1B5E20', borderColor: '#e2e8f0' }
                            }
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#1B5E20' }}>
                        Entry Salary Range
                      </h4>
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="0"
                          max="70000"
                          step="5000"
                          value={salaryRange[1]}
                          onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value)])}
                          className="w-full"
                        />
                        <p className="text-xs font-bold" style={{ color: '#1B5E20' }}>
                          R{salaryRange[0].toLocaleString()} - R{salaryRange[1].toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={clearFilters}
                    className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"
                    style={{ color: '#64748b' }}
                  >
                    <X className="w-4 h-4" /> Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Career Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {displayedCareers.length > 0 ? (
            displayedCareers.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TVETCareerCard career={career} onCardClick={() => handleCareerClick(career)} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(27,94,32,0.05)' }}>
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight" style={{ color: '#1B5E20' }}>
                No TVET Careers Found
              </h3>
              <p className="text-sm mb-8" style={{ color: '#64748b' }}>
                Try adjusting your search or filters.
              </p>
              <button onClick={clearFilters} className="text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest" style={{ backgroundColor: '#1B5E20' }}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {hasMoreCareers && (
          <div className="flex justify-center mb-8">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setDisplayCount(displayCount + LOAD_MORE_INCREMENT)}
              className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white flex items-center gap-2 transition-all hover:opacity-90"
              style={{ backgroundColor: '#1B5E20' }}
            >
              Load More Careers ({remainingCareers} more)
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Career Detail Modal */}
      <CareerDetailModal
        career={selectedCareer}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onNavigate={(page: string) => {
          setShowDetailModal(false);
          onNavigate(page as any);
        }}
        isSaved={selectedCareer ? savedCareers.includes(selectedCareer.id) : false}
        onToggleSave={toggleSaveCareer}
      />
    </div>
  );
}

export default withAuth(TVETCareersPage);
