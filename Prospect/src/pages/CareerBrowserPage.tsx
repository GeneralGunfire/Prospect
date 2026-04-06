import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, SlidersHorizontal, ArrowRight, X, Briefcase, GraduationCap, Wallet, Star } from 'lucide-react';
import { careers, Career } from '../data/careers';
import { CareerCard } from '../components/CareerCard';
import { cn } from '../lib/utils';
import Fuse from 'fuse.js';

export const CareerBrowserPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRIASEC, setSelectedRIASEC] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(careers.map(c => c.category));
    return Array.from(cats).sort();
  }, []);

  const riasecTypes = ['R', 'I', 'A', 'S', 'E', 'C'];

  const fuse = useMemo(() => new Fuse(careers, {
    keys: ['title', 'category', 'description', 'subjects'],
    threshold: 0.3,
  }), []);

  const filteredCareers = useMemo(() => {
    let results = searchQuery 
      ? fuse.search(searchQuery).map(r => r.item)
      : careers;

    if (selectedCategory) {
      results = results.filter(c => c.category === selectedCategory);
    }

    if (selectedRIASEC) {
      results = results.filter(c => c.riasec.includes(selectedRIASEC as any));
    }

    return results;
  }, [searchQuery, selectedCategory, selectedRIASEC, fuse]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedRIASEC(null);
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy/5 rounded-full mb-6">
          <Briefcase className="w-4 h-4 text-navy" />
          <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Career Explorer</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6 uppercase tracking-tight">
          Discover Your <span className="text-secondary">Future</span>
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base leading-relaxed font-normal">
          Explore over 200+ career paths in South Africa. Filter by interest, category, or required subjects to find your perfect match.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-12 sticky top-20 z-40 bg-surface/80 backdrop-blur-xl py-4 -mx-4 px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              placeholder="Search careers, subjects, or industries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-navy focus:border-secondary transition-all outline-none shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm border",
              isFilterOpen ? "bg-navy text-white border-navy" : "bg-white text-navy border-slate-200 hover:border-secondary"
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
            {(selectedCategory || selectedRIASEC) && (
              <span className="w-5 h-5 bg-secondary text-white rounded-full flex items-center justify-center text-[8px]">
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
                  <h4 className="text-[10px] font-bold text-navy uppercase tracking-[0.2em] mb-4">Industries</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                          selectedCategory === cat 
                            ? "bg-secondary text-white border-secondary" 
                            : "bg-white text-navy border-slate-200 hover:border-secondary"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-navy uppercase tracking-[0.2em] mb-4">RIASEC Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {riasecTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedRIASEC(selectedRIASEC === type ? null : type)}
                        className={cn(
                          "w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all border",
                          selectedRIASEC === type 
                            ? "bg-navy text-white border-navy" 
                            : "bg-white text-navy border-slate-200 hover:border-secondary"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button 
                  onClick={clearFilters}
                  className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCareers.length > 0 ? (
          filteredCareers.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CareerCard career={career} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-navy/20" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2 uppercase tracking-tight">No Careers Found</h3>
            <p className="text-secondary text-sm mb-8">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={clearFilters}
              className="bg-navy text-white px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
