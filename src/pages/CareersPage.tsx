import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, Briefcase, ChevronDown } from 'lucide-react';
import { allCareers400 } from '../data/careers400';
import { CareerCard } from '../components/CareerCard';
import { CareerDetailModal } from '../components/CareerDetailModal';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import { findSimilarCareers } from '../lib/careersService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CareerFull } from '../data/careersTypes';

function CareersPage({ user, onNavigate }: AuthedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRIASEC, setSelectedRIASEC] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerFull | null>(null);
  const [savedCareers, setSavedCareers] = useState<string[]>(() => {
    const saved = localStorage.getItem('savedCareers');
    return saved ? JSON.parse(saved) : [];
  });
  const [displayCount, setDisplayCount] = useState(30); // Start with 30 visible

  const categories = useMemo(() => Array.from(new Set(allCareers400.map((c) => c.category))).sort(), []);
  const riasecTypes = ['R', 'I', 'A', 'S', 'E', 'C'];

  const filteredCareers = useMemo(() => {
    let results = allCareers400;
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
    return results;
  }, [searchQuery, selectedCategory, selectedRIASEC]);

  // Only display the first displayCount careers (lazy loading)
  const displayedCareers = useMemo(() => {
    return filteredCareers.slice(0, displayCount);
  }, [filteredCareers, displayCount]);

  const hasMoreCareers = filteredCareers.length > displayCount;
  const remainingCareers = filteredCareers.length - displayCount;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedRIASEC(null);
    setDisplayCount(30);
  };

  const handleCardClick = (career: CareerFull) => {
    setSelectedCareer(career);
  };

  const handleCloseModal = () => {
    setSelectedCareer(null);
  };

  const handleToggleSave = (careerId: string) => {
    setSavedCareers((prev) => {
      const updated = prev.includes(careerId)
        ? prev.filter((id) => id !== careerId)
        : [...prev, careerId];
      localStorage.setItem('savedCareers', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectRelatedCareer = (career: CareerFull) => {
    setSelectedCareer(career);
  };

  const relatedCareers = selectedCareer ? findSimilarCareers(selectedCareer.id, allCareers400) : [];

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader currentPage="careers" user={user} onNavigate={onNavigate} mode="career" />

      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(30,41,59,0.05)' }}>
            <Briefcase className="w-4 h-4" style={{ color: '#1e293b' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1e293b' }}>Career Explorer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight" style={{ color: '#1e293b' }}>
            Discover Your <span style={{ color: '#64748b' }}>Future</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
            Explore {filteredCareers.length} careers in South Africa. Filter by interest, category, or personality type.
          </p>
        </div>

        {/* Sticky search + filters */}
        <div className="mb-12 sticky top-20 z-40 py-4 -mx-4 px-4" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)' }}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search careers, skills, or industries..."
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
              style={isFilterOpen ? { backgroundColor: '#1e293b', color: 'white' } : { color: '#1e293b' }}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(selectedCategory || selectedRIASEC) && (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#64748b', color: 'white' }}>
                  {(selectedCategory ? 1 : 0) + (selectedRIASEC ? 1 : 0)}
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
                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 mt-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#1e293b' }}>
                      Career Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border`}
                          style={
                            selectedCategory === cat
                              ? { backgroundColor: '#64748b', color: 'white', borderColor: '#64748b' }
                              : { backgroundColor: 'white', color: '#1e293b', borderColor: '#e2e8f0' }
                          }
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#1e293b' }}>
                      RIASEC Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {riasecTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedRIASEC(selectedRIASEC === type ? null : type)}
                          className="w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all border"
                          style={
                            selectedRIASEC === type
                              ? { backgroundColor: '#1e293b', color: 'white', borderColor: '#1e293b' }
                              : { backgroundColor: 'white', color: '#1e293b', borderColor: '#e2e8f0' }
                          }
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={clearFilters} className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: '#64748b' }}>
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
              <motion.div key={career.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 7) * 0.04 }}>
                <CareerCard career={career} onCardClick={() => handleCardClick(career)} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(30,41,59,0.05)' }}>
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight" style={{ color: '#1e293b' }}>
                No Careers Found
              </h3>
              <p className="text-sm mb-8" style={{ color: '#64748b' }}>
                Try adjusting your search or filters.
              </p>
              <button onClick={clearFilters} className="text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest" style={{ backgroundColor: '#1e293b' }}>
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
              onClick={() => setDisplayCount(displayCount + 30)}
              className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white flex items-center gap-2 transition-all hover:opacity-90"
              style={{ backgroundColor: '#1e293b' }}
            >
              Load More Careers ({remainingCareers} more available)
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Career Detail Modal */}
      <CareerDetailModal
        career={selectedCareer}
        isOpen={!!selectedCareer}
        onClose={handleCloseModal}
        onNavigate={() => {}}
        onSelectCareer={handleSelectRelatedCareer}
        relatedCareers={relatedCareers}
        isSaved={selectedCareer ? savedCareers.includes(selectedCareer.id) : false}
        onToggleSave={handleToggleSave}
      />
    </div>
  );
}

export default withAuth(CareersPage);
