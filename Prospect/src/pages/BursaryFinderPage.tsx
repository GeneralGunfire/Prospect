import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Wallet, Calendar, CheckCircle2, ExternalLink, ArrowRight, Bookmark, X, Info } from 'lucide-react';
import { bursaries, Bursary } from '../data/bursaries';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { cn } from '../lib/utils';
import Fuse from 'fuse.js';

export const BursaryFinderPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [savedBursaries, setSavedBursaries] = useLocalStorage<string[]>('prospect_sa_saved_bursaries', []);

  const categories = useMemo(() => {
    const cats = new Set(bursaries.map(b => b.category));
    return Array.from(cats).sort();
  }, []);

  const fuse = useMemo(() => new Fuse(bursaries, {
    keys: ['name', 'provider', 'category', 'description', 'requirements'],
    threshold: 0.3,
  }), []);

  const filteredBursaries = useMemo(() => {
    let results = searchQuery 
      ? fuse.search(searchQuery).map(r => r.item)
      : bursaries;

    if (selectedCategory) {
      results = results.filter(b => b.category === selectedCategory);
    }

    return results;
  }, [searchQuery, selectedCategory, fuse]);

  const toggleSave = (id: string) => {
    if (savedBursaries.includes(id)) {
      setSavedBursaries(savedBursaries.filter(s => s !== id));
    } else {
      setSavedBursaries([...savedBursaries, id]);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
          <Wallet className="w-4 h-4 text-secondary" />
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Financial Aid</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6 uppercase tracking-tight">
          Fund Your <span className="text-secondary">Education</span>
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base leading-relaxed font-normal">
          Browse 245+ active bursaries, scholarships, and grants for South African students. Filter by industry or search for specific providers.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-12 sticky top-20 z-40 bg-surface/80 backdrop-blur-xl py-4 -mx-4 px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              placeholder="Search bursaries, providers, or fields of study..."
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
            {selectedCategory && (
              <span className="w-5 h-5 bg-secondary text-white rounded-full flex items-center justify-center text-[8px]">1</span>
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
              <div className="pt-6 border-t border-slate-100 mt-6">
                <h4 className="text-[10px] font-bold text-navy uppercase tracking-[0.2em] mb-4">Industries & Categories</h4>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {filteredBursaries.length > 0 ? (
          filteredBursaries.map((bursary, index) => (
            <motion.div
              key={bursary.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-secondary transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <Wallet className="w-8 h-8 text-navy group-hover:text-secondary transition-colors" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-navy/5 text-navy text-[9px] font-bold uppercase tracking-widest rounded-full">
                      {bursary.category}
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Closes: {bursary.deadline}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-secondary transition-colors">
                    {bursary.name}
                  </h3>
                  <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-4">
                    Provided by {bursary.provider}
                  </p>
                  
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6 max-w-2xl">
                    {bursary.description}
                  </p>

                  <div className="flex flex-wrap gap-6">
                    {bursary.requirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-navy/60">
                        <CheckCircle2 className="w-4 h-4 text-secondary" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
                  <a 
                    href={bursary.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-grow md:flex-grow-0 bg-navy text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary transition-all flex items-center justify-center gap-2"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => toggleSave(bursary.id)}
                    className={cn(
                      "p-4 rounded-xl border transition-all flex items-center justify-center",
                      savedBursaries.includes(bursary.id) 
                        ? "bg-secondary border-secondary text-white" 
                        : "bg-white border-slate-200 text-navy hover:border-secondary"
                    )}
                  >
                    <Bookmark className={cn("w-4 h-4", savedBursaries.includes(bursary.id) ? "fill-white" : "")} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-navy/20" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2 uppercase tracking-tight">No Bursaries Found</h3>
            <p className="text-secondary text-sm mb-8">Try adjusting your search or filters to find funding opportunities.</p>
          </div>
        )}
      </div>

      {/* NSFAS Info */}
      <div className="mt-20 p-8 md:p-12 bg-navy rounded-3xl text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight">NSFAS Funding</h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              The National Student Financial Aid Scheme (NSFAS) provides full funding for South African students from poor and working-class backgrounds. If your household income is less than R350,000 per year, you likely qualify.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/bursary-eligibility" className="bg-secondary text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2">
                Check Eligibility
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://www.nsfas.org.za" target="_blank" rel="noopener noreferrer" className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
                Official Website
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h4 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-6">What NSFAS Covers</h4>
              <ul className="space-y-4">
                {[
                  'Full Tuition Fees',
                  'Accommodation & Meals',
                  'Personal Care Allowance',
                  'Learning Materials (Books/Laptop)',
                  'Transport Allowance'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -mr-48 -mt-48" />
      </div>
    </div>
  );
};
