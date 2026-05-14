import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, Briefcase, ChevronDown } from 'lucide-react';
import { allCareersFullData } from '../../data/careersFullData';
import { TVETCareerCard } from '../../components/careers/TVETCareerCard';
import { withAuth, type AuthedProps } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';
import { TVETSubNav } from '../../components/tvet/TVETSubNav';
import { getUserBookmarks, saveBookmark, removeBookmark } from '../../services/bookmarkService';
import type { CareerFull } from '../../data/careersTypes';
import { CareerDetailModal } from '../../components/careers/CareerDetailModal';

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

  // Filter to TVET careers only
  const tvetCareers = useMemo(() => allCareersFullData.filter((c) => c.category === 'tvet'), []);

  // Fetch saved careers on mount
  useEffect(() => {
    const loadSavedCareers = async () => {
      setIsLoadingSaves(true);
      const bookmarks = await getUserBookmarks(user.id);
      const careerIds = bookmarks.careers;
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
      await saveBookmark(user.id, 'career', careerId);
      setSavedCareers([...savedCareers, careerId]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="tvet" user={user} onNavigate={onNavigate} mode="career" />
      <TVETSubNav currentPage="careers" onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-10 pt-2">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 mb-3">TVET</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900" style={{ letterSpacing: '-0.025em' }}>Careers</h1>
        </div>

        {/* Sticky search + filters */}
        <div
          className="mb-8 sm:mb-12 sticky top-20 z-40 py-4 -mx-4 px-4"
          style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search careers, trades, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors min-h-11 text-slate-900"
                style={{ fontSize: '16px' }}
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors border ${
                isFilterOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
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
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400">Trade Type</h4>
                      <div className="flex flex-wrap gap-2">
                        {tradeTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setSelectedTradeType(selectedTradeType === type ? null : type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border ${
                              selectedTradeType === type
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400">Province</h4>
                      <div className="flex flex-wrap gap-2">
                        {provinces.map((prov) => (
                          <button
                            key={prov}
                            onClick={() => setSelectedProvince(selectedProvince === prov ? null : prov)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border ${
                              selectedProvince === prov
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {prov}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400">Job Demand</h4>
                      <div className="flex flex-wrap gap-2">
                        {demandLevels.map((level) => (
                          <button
                            key={level}
                            onClick={() => setSelectedDemand(selectedDemand === level ? null : level)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border ${
                              selectedDemand === level
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400">Entry Salary Range</h4>
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
                        <p className="text-xs font-bold text-slate-700">
                          R{salaryRange[0].toLocaleString()} – R{salaryRange[1].toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={clearFilters}
                    className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity text-slate-400"
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
                transition={{ delay: Math.min(index, 7) * 0.04 }}
              >
                <TVETCareerCard career={career} onCardClick={() => handleCareerClick(career)} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-sm font-bold text-slate-900 mb-1">No careers found</p>
              <p className="text-xs text-slate-400 mb-6">Try adjusting your search or filters.</p>
              <button onClick={clearFilters} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">
                Clear filters
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
              className="px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest text-white flex items-center gap-2 transition-opacity hover:opacity-90 bg-slate-900"
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

