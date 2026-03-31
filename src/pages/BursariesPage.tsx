import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Wallet, Calendar, CheckCircle2, ExternalLink, ArrowRight, Bookmark, X, BookOpen } from 'lucide-react';
import { bursaries } from '../data/bursaries';
import { getUserBookmarks, saveBookmark, removeBookmark } from '../services/bookmarkService';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';

function BursariesPage({ user, onNavigate }: AuthedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedIncome, setSelectedIncome] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [savedBursaries, setSavedBursaries] = useState<string[]>([]);
  const [isLoadingSaves, setIsLoadingSaves] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  // Fetch saved bursaries from Supabase on mount
  useEffect(() => {
    const loadSavedBursaries = async () => {
      setIsLoadingSaves(true);
      const bookmarks = await getUserBookmarks(user.id);
      setSavedBursaries(bookmarks.bursaries);
      setIsLoadingSaves(false);
    };

    loadSavedBursaries();
  }, [user.id]);

  const categories = useMemo(() => Array.from(new Set(bursaries.map(b => b.category))).sort(), []);

  const fields = useMemo(() => {
    const allFields = new Set<string>();
    bursaries.forEach(b => b.studyOptions.fields.forEach(f => allFields.add(f)));
    return Array.from(allFields).sort();
  }, []);

  const incomeRanges = [
    { value: 'low', label: 'R0 - R200k' },
    { value: 'mid-low', label: 'R200k - R350k' },
    { value: 'mid', label: 'R350k - R450k' },
    { value: 'any', label: 'No income limit' },
  ];

  const filteredBursaries = useMemo(() => {
    let results = bursaries;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.provider.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory) {
      results = results.filter(b => b.category === selectedCategory);
    }

    // Field filter
    if (selectedField) {
      results = results.filter(b => b.studyOptions.fields.includes(selectedField));
    }

    // Income filter
    if (selectedIncome) {
      results = results.filter(b => {
        const maxIncome = b.requirements.maxIncome;
        if (!maxIncome || maxIncome.includes('No limit') || maxIncome.includes('Merit')) return selectedIncome === 'any';
        if (selectedIncome === 'low') return maxIncome.includes('200') || maxIncome.includes('250');
        if (selectedIncome === 'mid-low') return maxIncome.includes('300') || maxIncome.includes('350');
        if (selectedIncome === 'mid') return maxIncome.includes('380') || maxIncome.includes('400');
        return true;
      });
    }

    return results;
  }, [searchQuery, selectedCategory, selectedField, selectedIncome]);

  const toggleSave = async (id: string) => {
    if (savedBursaries.includes(id)) {
      // Remove from saved
      const success = await removeBookmark(user.id, 'bursary', id);
      if (success) {
        setSavedBursaries(savedBursaries.filter(s => s !== id));
      }
    } else {
      // Add to saved
      const success = await saveBookmark(user.id, 'bursary', id);
      if (success) {
        setSavedBursaries([...savedBursaries, id]);
      }
    }
  };

  const handleViewDetail = (bursaryId: string) => {
    // Store bursary ID in sessionStorage and navigate
    sessionStorage.setItem('selectedBursaryId', bursaryId);
    onNavigate('bursary');
  };

  const activeFilters = [selectedCategory, selectedField, selectedIncome].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader currentPage="bursaries" user={user} onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(100,116,139,0.1)' }}>
            <Wallet className="w-4 h-4" style={{ color: '#64748b' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Financial Aid</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight" style={{ color: '#1e293b' }}>
            Fund Your <span style={{ color: '#64748b' }}>Education</span>
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#475569' }}>
            Browse active bursaries, scholarships, and grants for South African students. Find the perfect bursary for your situation.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
              style={{ backgroundColor: '#1E3A5F', color: 'white' }}
            >
              Browse Bursaries
            </button>
            <button
              onClick={() => onNavigate('disadvantaged-guide')}
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
              style={{ backgroundColor: 'white', color: '#1e293b', border: '1px solid #e2e8f0' }}
            >
              <BookOpen className="w-4 h-4" /> Student Guide
            </button>
          </div>
        </div>

        {/* Sticky search and filters */}
            <div className="mb-12 sticky top-20 z-40 py-4 -mx-4 px-4" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)' }}>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative grow w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="Search bursaries, providers, or fields of study..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none shadow-sm focus:border-slate-400 transition-all"
                    style={{ color: '#1e293b' }}
                  />
                </div>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm border"
                  style={isFilterOpen
                    ? { backgroundColor: '#1e293b', color: 'white', borderColor: '#1e293b' }
                    : { backgroundColor: 'white', color: '#1e293b', borderColor: '#e2e8f0' }}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilters > 0 && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#f59e0b', color: '#1e293b' }}>{activeFilters}</span>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#1e293b' }}>Category</h4>
                          <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                              <button
                                key={cat}
                                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border"
                                style={selectedCategory === cat
                                  ? { backgroundColor: '#64748b', color: 'white', borderColor: '#64748b' }
                                  : { backgroundColor: 'white', color: '#1e293b', borderColor: '#e2e8f0' }}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Field of Study */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#1e293b' }}>Field of Study</h4>
                          <div className="flex flex-wrap gap-2">
                            {fields.slice(0, 6).map(field => (
                              <button
                                key={field}
                                onClick={() => setSelectedField(selectedField === field ? null : field)}
                                className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border"
                                style={selectedField === field
                                  ? { backgroundColor: '#64748b', color: 'white', borderColor: '#64748b' }
                                  : { backgroundColor: 'white', color: '#1e293b', borderColor: '#e2e8f0' }}
                              >
                                {field}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Income */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#1e293b' }}>Income Level</h4>
                          <div className="flex flex-wrap gap-2">
                            {incomeRanges.map(range => (
                              <button
                                key={range.value}
                                onClick={() => setSelectedIncome(selectedIncome === range.value ? null : range.value)}
                                className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border"
                                style={selectedIncome === range.value
                                  ? { backgroundColor: '#64748b', color: 'white', borderColor: '#64748b' }
                                  : { backgroundColor: 'white', color: '#1e293b', borderColor: '#e2e8f0' }}
                              >
                                {range.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-6">
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>
                          {filteredBursaries.length} bursaries found
                        </span>
                        <button
                          onClick={() => {
                            setSelectedCategory(null);
                            setSelectedField(null);
                            setSelectedIncome(null);
                          }}
                          className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"
                          style={{ color: '#64748b' }}
                        >
                          <X className="w-4 h-4" /> Clear All
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {filteredBursaries.length > 0 ? (
                filteredBursaries.map((bursary, index) => (
                  <motion.div
                    key={bursary.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index, 7) * 0.04 }}
                    className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group cursor-pointer"
                    onClick={() => handleViewDetail(bursary.id)}
                  >
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-slate-100 transition-colors" style={{ background: 'rgba(30,41,59,0.05)' }}>
                        <Wallet className="w-8 h-8" style={{ color: '#1e293b' }} />
                      </div>

                      <div className="grow">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full" style={{ background: 'rgba(30,41,59,0.05)', color: '#1e293b' }}>
                            {bursary.category}
                          </span>
                          <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {bursary.applicationProcess.deadline}
                          </span>
                          <div className="flex items-center gap-1 ml-auto">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-xs" style={{ color: i < Math.floor(bursary.rating) ? '#f59e0b' : '#e5e7eb' }}>★</span>
                            ))}
                            <span className="text-xs ml-1" style={{ color: '#64748b' }}>({bursary.reviews})</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-slate-500 transition-colors" style={{ color: '#1e293b' }}>{bursary.name}</h3>
                        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#64748b' }}>Provided by {bursary.provider}</p>
                        <p className="text-sm leading-relaxed mb-6" style={{ color: '#475569' }}>{bursary.description}</p>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2" style={{ color: 'rgba(30,41,59,0.6)' }}>
                            <CheckCircle2 className="w-4 h-4" style={{ color: '#22c55e' }} />
                            <span className="text-xs font-bold uppercase tracking-wider">Min marks: {bursary.requirements.minMarks}</span>
                          </div>
                          <div className="flex items-center gap-2" style={{ color: 'rgba(30,41,59,0.6)' }}>
                            <CheckCircle2 className="w-4 h-4" style={{ color: '#22c55e' }} />
                            <span className="text-xs font-bold uppercase tracking-wider">{bursary.studyOptions.fields.slice(0, 2).join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(bursary.id);
                          }}
                          className="grow md:grow-0 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-all flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#1e293b' }}
                        >
                          View Details <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSave(bursary.id);
                          }}
                          className="p-4 rounded-xl border transition-all flex items-center justify-center"
                          style={savedBursaries.includes(bursary.id)
                            ? { backgroundColor: '#64748b', borderColor: '#64748b', color: 'white' }
                            : { backgroundColor: 'white', borderColor: '#e2e8f0', color: '#1e293b' }}
                        >
                          <Bookmark className={`w-4 h-4 ${savedBursaries.includes(bursary.id) ? 'fill-white' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(30,41,59,0.05)' }}>
                    <Search className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 uppercase tracking-tight" style={{ color: '#1e293b' }}>No Bursaries Found</h3>
                  <p className="text-sm mb-6" style={{ color: '#64748b' }}>Try adjusting your search or filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                      setSelectedField(null);
                      setSelectedIncome(null);
                    }}
                    className="px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest"
                    style={{ backgroundColor: '#1e293b', color: 'white' }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* NSFAS banner */}
            <div className="mt-20 p-8 md:p-12 rounded-3xl text-white relative overflow-hidden" style={{ backgroundColor: '#1e293b' }}>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight">NSFAS Funding</h2>
                  <p className="text-white/70 text-sm leading-relaxed mb-8">
                    NSFAS provides full funding for South African students from poor and working-class backgrounds. If your household income is less than R350,000 per year, you likely qualify. It's free, government-backed, and covers everything you need.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://www.nsfas.org.za"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-all flex items-center gap-2 text-white"
                      style={{ backgroundColor: '#f59e0b' }}
                    >
                      Official Website <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => onNavigate('disadvantaged-guide')}
                      className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-all flex items-center gap-2"
                      style={{ backgroundColor: '#64748b' }}
                    >
                      <BookOpen className="w-4 h-4" /> Get Help
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: '#f59e0b' }}>What NSFAS Covers</h4>
                    <ul className="space-y-4">
                      {['Full Tuition Fees', 'Accommodation & Meals', 'Personal Care Allowance', 'Learning Materials (Books/Laptop)', 'Transport Allowance'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-medium">
                          <CheckCircle2 className="w-5 h-5" style={{ color: '#f59e0b' }} /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
            </div>
      </div>
    </div>
  );
}

export default withAuth(BursariesPage);
