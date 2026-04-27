import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, Briefcase, ChevronDown } from 'lucide-react';
import { allCareersComplete } from '../data/careers400Final';
import { CareerCard } from '../components/CareerCard';
import { CareerDetailModal } from '../components/CareerDetailModal';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import { findSimilarCareers } from '../lib/careersService';
import { getUserBookmarks, saveBookmark, removeBookmark } from '../services/bookmarkService';
import type { CareerFull } from '../data/careersTypes';

function CareersPageNew({ user, onNavigate }: AuthedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRIASEC, setSelectedRIASEC] = useState<string | null>(null);
  const [selectedDemand, setSelectedDemand] = useState<string | null>(null);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 100000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerFull | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [relatedCareers, setRelatedCareers] = useState<CareerFull[]>([]);
  const [savedCareers, setSavedCareers] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(25);
  const [isLoadingSaves, setIsLoadingSaves] = useState(true);
  const LOAD_MORE_INCREMENT = 25;

  // Fetch saved careers from Supabase on mount
  useEffect(() => {
    const loadSavedCareers = async () => {
      setIsLoadingSaves(true);
      const bookmarks = await getUserBookmarks(user.id);
      setSavedCareers(bookmarks.careers);
      setIsLoadingSaves(false);
    };

    loadSavedCareers();
  }, [user.id]);

  const categories = useMemo(() => Array.from(new Set(allCareersComplete.map((c) => c.category))).sort(), []);
  const riasecTypes = ['R', 'I', 'A', 'S', 'E', 'C'];
  const demandLevels = ['high', 'medium', 'low'];

  const allFilteredCareers = useMemo(() => {
    let results = allCareersComplete;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) results = results.filter((c) => c.category === selectedCategory);

    if (selectedRIASEC) {
      results = results.filter((c) => {
        const codeKey = selectedRIASEC.toLowerCase() as keyof typeof c.riasecMatch;
        return c.riasecMatch[codeKey] > 50;
      });
    }

    if (selectedDemand) {
      results = results.filter((c) => c.jobDemand.level === selectedDemand);
    }

    results = results.filter((c) => c.salary.entryLevel >= salaryRange[0] && c.salary.entryLevel <= salaryRange[1]);

    return results;
  }, [searchQuery, selectedCategory, selectedRIASEC, selectedDemand, salaryRange]);

  // Display only the first `displayCount` careers (lazy loading)
  const displayedCareers = useMemo(() => {
    return allFilteredCareers.slice(0, displayCount);
  }, [allFilteredCareers, displayCount]);

  const hasMoreCareers = allFilteredCareers.length > displayCount;
  const remainingCareers = allFilteredCareers.length - displayCount;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedRIASEC(null);
    setSelectedDemand(null);
    setSalaryRange([0, 100000]);
    setDisplayCount(25); // Reset to initial display count
  };

  const handleCareerClick = (career: CareerFull) => {
    setSelectedCareer(career);
    const related = findSimilarCareers(career.id, allCareersComplete);
    setRelatedCareers(related);
    setShowDetailModal(true);
  };

  const toggleSaveCareer = async (careerId: string) => {
    if (savedCareers.includes(careerId)) {
      // Remove from saved
      const success = await removeBookmark(user.id, 'career', careerId);
      if (success) {
        setSavedCareers(savedCareers.filter((s) => s !== careerId));
      }
    } else {
      // Add to saved
      const success = await saveBookmark(user.id, 'career', careerId);
      if (success) {
        setSavedCareers([...savedCareers, careerId]);
      }
    }
  };

  const handleModalNavigate = (page: string) => {
    setShowDetailModal(false);
    if (page === 'library' || page === 'bursaries') {
      onNavigate(page as any);
    }
  };

  const handleSelectRelatedCareer = (career: CareerFull) => {
    setSelectedCareer(career);
    const related = findSimilarCareers(career.id, allCareersComplete);
    setRelatedCareers(related);
  };

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader currentPage="careers" user={user} onNavigate={onNavigate} mode="career" />

      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-slate-900/5">
            <Briefcase className="w-4 h-4 text-slate-900" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900">
              Career Explorer
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight text-slate-900">
            Explore <span className="text-slate-500">Your Future</span>
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            Browse {allFilteredCareers.length} careers. Filter by interest, category, or personality type.
          </p>
        </div>

        {/* Sticky search + filters */}
        <div className="mb-12 sticky top-16 z-40 py-4 -mx-4 px-4 bg-white/90 backdrop-blur-xl border-b border-slate-100/80">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search careers, skills, or industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-slate-900 outline-none shadow-sm focus:border-slate-400 transition-all"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm border ${
                isFilterOpen
                  ? 'bg-slate-900 text-white border-transparent'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-slate-400'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(selectedCategory || selectedRIASEC || selectedDemand || (salaryRange[0] > 0 || salaryRange[1] < 100000)) && (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-slate-500 text-white">
                  {(selectedCategory ? 1 : 0) + (selectedRIASEC ? 1 : 0) + (selectedDemand ? 1 : 0) + ((salaryRange[0] > 0 || salaryRange[1] < 100000) ? 1 : 0)}
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
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-slate-900">
                        Career Categories
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                              selectedCategory === cat
                                ? 'bg-slate-600 text-white border-slate-600'
                                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-slate-900">
                        RIASEC Interests
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {riasecTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setSelectedRIASEC(selectedRIASEC === type ? null : type)}
                            className={`w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all border ${
                              selectedRIASEC === type
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-slate-900">
                        Job Demand
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {demandLevels.map((level) => (
                          <button
                            key={level}
                            onClick={() => setSelectedDemand(selectedDemand === level ? null : level)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                              selectedDemand === level
                                ? level === 'high'
                                  ? 'bg-blue-500 text-white border-blue-500'
                                  : level === 'medium'
                                    ? 'bg-amber-500 text-white border-amber-500'
                                    : 'bg-red-500 text-white border-red-500'
                                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-slate-900">
                        Entry Salary Range
                      </h4>
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="0"
                          max="100000"
                          step="5000"
                          value={salaryRange[1]}
                          onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value)])}
                          className="w-full"
                        />
                        <p className="text-xs font-bold text-slate-900">
                          R{salaryRange[0].toLocaleString()} - R{salaryRange[1].toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={clearFilters} className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity text-slate-500">
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
                data-career-card
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index, 7) * 0.04 }}
              >
                <CareerCard career={career} onCardClick={() => handleCareerClick(career)} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight text-slate-900">
                No Careers Found
              </h3>
              <p className="text-sm mb-8 text-slate-500">
                Try adjusting your search or filters.
              </p>
              <button onClick={clearFilters} className="text-white bg-slate-900 hover:bg-slate-800 px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
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
              data-load-more-btn
              className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 flex items-center gap-2 transition-all shadow-sm"
            >
              Load More Careers ({remainingCareers} more)
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>
        )}

        {/* All careers loaded */}
        {!hasMoreCareers && allFilteredCareers.length > 0 && (
          <div className="text-center mb-8 text-sm text-slate-400">
            Showing all {allFilteredCareers.length} careers
          </div>
        )}
      </div>

      {/* Career Detail Modal */}
      <CareerDetailModal
        career={selectedCareer}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onNavigate={handleModalNavigate}
        onSelectCareer={handleSelectRelatedCareer}
        relatedCareers={relatedCareers}
        isSaved={selectedCareer ? savedCareers.includes(selectedCareer.id) : false}
        onToggleSave={toggleSaveCareer}
      />
    </div>
  );
}

export default withAuth(CareersPageNew);
