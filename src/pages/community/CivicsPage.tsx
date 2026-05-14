import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  IdCard, Landmark, GraduationCap, Briefcase,
  Search, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Clock, Banknote, BarChart2, FileText, Phone, ExternalLink,
  CheckCircle2, AlertCircle, Shield, Share2, Filter, X,
  Building2
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';

// ── Types ───────────────────────────────────────────────────────────────────

interface Step {
  step_number: number;
  title: string;
  description: string;
  tips: string[];
  documents_needed: string[];
}

interface Form {
  form_name: string;
  where_to_get: string;
  notes: string;
}

interface Contact {
  organization: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Procedure {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  eligibility: string[];
  time_to_complete: string;
  cost: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  overview: string;
  steps: Step[];
  required_documents: string[];
  forms: Form[];
  contacts: Contact[];
  provinces_involved: string[];
  alternative_methods: string;
  common_mistakes: string[];
  timeline: string;
  faq: FAQ[];
}

type View = 'landing' | 'browse' | 'detail';

// ── Config ──────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string; desc: string }> = {
  Identity: {
    icon: <IdCard className="w-5 h-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    desc: 'IDs, passports, licenses, birth & marriage certificates',
  },
  Finance: {
    icon: <Landmark className="w-5 h-5" />,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    desc: 'NSFAS, SASSA grants, UIF, tax returns, banking',
  },
  Education: {
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    desc: 'Student rights, funding, school enrolment',
  },
  Employment: {
    icon: <Briefcase className="w-5 h-5" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    desc: 'Workers rights, CCMA, labour disputes',
  },
};

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'bg-slate-100 text-slate-600',
  Medium: 'bg-slate-100 text-slate-600',
  Hard: 'bg-slate-100 text-slate-600',
};

// ── Landing view ────────────────────────────────────────────────────────────

function LandingView({ procedures, onBrowse, onSelectCategory, onSelectProcedure }: {
  procedures: Procedure[];
  onBrowse: () => void;
  onSelectCategory: (cat: string) => void;
  onSelectProcedure: (id: string) => void;
}) {
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    procedures.forEach(p => { m[p.category] = (m[p.category] ?? 0) + 1; });
    return m;
  }, [procedures]);

  const popular = procedures.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-xl p-6 text-white"
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-slate-300" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">SA Civics Guide</span>
        </div>
        <h2 className="font-black text-xl mb-2 leading-tight">Know How to Get Things Done in South Africa</h2>
        <p className="text-[15px] leading-[1.65] text-slate-300 mb-4">
          Step-by-step guides for government procedures — IDs, grants, licenses, tax returns, and more. In plain language.
        </p>
        <button
          onClick={onBrowse}
          className="flex items-center gap-2 bg-white text-slate-900 font-black text-sm px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors min-h-11"
        >
          Browse all procedures
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Categories */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className="bg-white border border-slate-200 rounded-xl p-4 text-left hover:border-slate-400 transition-colors"
            >
              <p className="font-black text-sm text-slate-900 mb-0.5">{cat}</p>
              <p className="text-xs text-slate-500 leading-tight">{cfg.desc}</p>
              {counts[cat] && (
                <p className="text-[10px] font-black mt-2 text-slate-400 uppercase tracking-widest">{counts[cat]} guides</p>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Popular procedures */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Most Useful Guides</h2>
        <div className="space-y-2">
          {popular.map((p, i) => {
            const cfg = CATEGORY_CONFIG[p.category] ?? CATEGORY_CONFIG.Identity;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
              >
                <PopularCard procedure={p} cfg={cfg} onSelect={() => onSelectProcedure(p.id)} />
              </motion.div>
            );
          })}
        </div>
        <button
          onClick={onBrowse}
          className="w-full mt-3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors min-h-11"
        >
          View all {procedures.length} procedures
        </button>
      </motion.div>

      {/* Emergency contacts strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-4 h-4 text-slate-300" />
          <h2 className="font-black text-xs uppercase tracking-wider text-white">Key Helplines</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Home Affairs', number: '0800 60 11 90' },
            { label: 'SASSA', number: '0800 60 10 11' },
            { label: 'NSFAS', number: '0800 067 327' },
            { label: 'SARS', number: '0800 00 7277' },
          ].map(({ label, number }) => (
            <div key={label} className="bg-white/10 rounded-xl p-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
              <p className="font-black text-white text-sm">{number}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function PopularCard({ procedure, cfg, onSelect }: {
  procedure: Procedure;
  cfg: typeof CATEGORY_CONFIG[string];
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3.5 text-left hover:border-slate-300 hover:shadow-sm transition-all"
    >
      <div className={`w-8 h-8 rounded-lg ${cfg.bg} ${cfg.border} border flex items-center justify-center shrink-0 ${cfg.color}`}>
        {cfg.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm leading-tight truncate">{procedure.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{procedure.time_to_complete} · {procedure.cost}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
    </button>
  );
}

// ── Browse view ─────────────────────────────────────────────────────────────

function BrowseView({ procedures, initialCategory, onSelect, onBack }: {
  procedures: Procedure[];
  initialCategory?: string;
  onSelect: (id: string) => void;
  onBack: () => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory ?? '');
  const [difficulty, setDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => [...new Set(procedures.map(p => p.category))], [procedures]);
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return procedures.filter(p => {
      if (category && p.category !== category) return false;
      if (difficulty && p.difficulty !== difficulty) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.overview.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [procedures, query, category, difficulty]);

  const hasFilters = category || difficulty;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div>
          <h2 className="font-black text-lg text-slate-900">All Procedures</h2>
          <p className="text-xs text-slate-500">{filtered.length} of {procedures.length} guides</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search procedures..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Filter toggle */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all
            ${showFilters || hasFilters
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200'}`}
        >
          <Filter className="w-3 h-3" />
          Filters{hasFilters ? ' (active)' : ''}
        </button>
        {category && (
          <button
            onClick={() => setCategory('')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"
          >
            {category} <X className="w-3 h-3" />
          </button>
        )}
        {difficulty && (
          <button
            onClick={() => setDifficulty('')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"
          >
            {difficulty} <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Category</p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(category === cat ? '' : cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all
                        ${category === cat
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Difficulty</p>
                <div className="flex gap-1.5">
                  {difficulties.map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(difficulty === d ? '' : d)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all
                        ${difficulty === d
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No procedures found</p>
            <button onClick={() => { setQuery(''); setCategory(''); setDifficulty(''); }} className="mt-2 text-xs text-blue-600 font-bold min-h-11 px-3">
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((p, i) => {
            const cfg = CATEGORY_CONFIG[p.category] ?? CATEGORY_CONFIG.Identity;
            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => onSelect(p.id)}
                className="w-full flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4 text-left hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className={`w-9 h-9 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0 ${cfg.color} mt-0.5`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm leading-tight">{p.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{p.overview}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`text-xs font-black px-1.5 py-0.5 rounded-md ${DIFFICULTY_COLOR[p.difficulty]}`}>{p.difficulty}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{p.time_to_complete}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-0.5"><Banknote className="w-2.5 h-2.5" />{p.cost}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Detail view ─────────────────────────────────────────────────────────────

function DetailView({ procedure, onBack }: { procedure: Procedure; onBack: () => void }) {
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const cfg = CATEGORY_CONFIG[procedure.category] ?? CATEGORY_CONFIG.Identity;

  const share = async () => {
    const text = `${procedure.title} — SA Civics Guide\n${procedure.overview}`;
    if (navigator.share) {
      try { await navigator.share({ title: procedure.title, text }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={onBack} className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div className="flex-1">
          <p className={`text-xs font-black uppercase tracking-wider ${cfg.color} mb-0.5`}>{procedure.category} · {procedure.subcategory}</p>
          <h2 className="font-black text-lg text-slate-900 leading-tight">{procedure.title}</h2>
        </div>
        <button onClick={share} className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
          <Share2 className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: <BarChart2 className="w-3.5 h-3.5" />, label: 'Difficulty', value: procedure.difficulty, extra: DIFFICULTY_COLOR[procedure.difficulty] },
          { icon: <Clock className="w-3.5 h-3.5" />, label: 'Time', value: procedure.time_to_complete, extra: '' },
          { icon: <Banknote className="w-3.5 h-3.5" />, label: 'Cost', value: procedure.cost, extra: '' },
        ].map(({ icon, label, value, extra }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
            <div className="flex justify-center text-slate-400 mb-1">{icon}</div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
            <p className={`text-xs font-black mt-0.5 ${extra ? '' : 'text-slate-900'}`}>
              {extra ? <span className={`px-1.5 py-0.5 rounded-md ${extra}`}>{value}</span> : value}
            </p>
          </div>
        ))}
      </div>

      {/* Overview */}
      <div className={`${cfg.bg} ${cfg.border} border rounded-xl p-4`}>
        <p className={`text-xs font-black uppercase tracking-wider ${cfg.color} mb-2`}>Overview</p>
        <p className="text-[15px] leading-[1.65] text-slate-700">{procedure.overview}</p>
      </div>

      {/* Steps */}
      <div>
        <h3 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-3">Step-by-Step Guide</h3>
        <div className="space-y-2">
          {procedure.steps.map((step, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenStep(openStep === i ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
              >
                <span className={`w-6 h-6 rounded-full ${cfg.bg} border ${cfg.border} ${cfg.color} text-xs font-black flex items-center justify-center shrink-0`}>
                  {step.step_number}
                </span>
                <span className="font-bold text-sm text-slate-900 flex-1">{step.title}</span>
                {openStep === i
                  ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              <AnimatePresence>
                {openStep === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
                      <p className="text-[15px] leading-[1.65] text-slate-700">{step.description}</p>

                      {step.documents_needed.length > 0 && step.documents_needed[0] !== 'No additional documents' && (
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Documents Needed</p>
                          <ul className="space-y-1">
                            {step.documents_needed.map((doc, j) => (
                              <li key={j} className="flex gap-2 text-xs text-slate-600">
                                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.tips.length > 0 && (
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Tips</p>
                          <ul className="space-y-1">
                            {step.tips.map((tip, j) => (
                              <li key={j} className="flex gap-2 text-xs text-slate-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Required documents */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <h3 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-3">All Required Documents</h3>
        <ul className="space-y-2">
          {procedure.required_documents.map((doc, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700">
              <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              {doc}
            </li>
          ))}
        </ul>
      </div>

      {/* Common mistakes */}
      {procedure.common_mistakes.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-black text-xs uppercase tracking-wider text-red-600 mb-3">Common Mistakes to Avoid</h3>
          <ul className="space-y-2">
            {procedure.common_mistakes.map((m, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Forms */}
      {procedure.forms.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-3">Forms Required</h3>
          <div className="space-y-3">
            {procedure.forms.map((form, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-sm text-slate-900">{form.form_name}</p>
                <p className="text-xs text-slate-500 mt-0.5">Get it: {form.where_to_get}</p>
                {form.notes && <p className="text-xs text-slate-500 mt-0.5 italic">{form.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Timeline</h3>
        <p className="text-[15px] leading-[1.65] text-slate-700">{procedure.timeline}</p>
      </div>

      {/* Contacts */}
      {procedure.contacts.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-3">Contact Information</h3>
          <div className="space-y-3">
            {procedure.contacts.map((c, i) => (
              <div key={i}>
                <p className="font-bold text-sm text-slate-900 mb-1.5">{c.organization}</p>
                <div className="space-y-1">
                  <p className="text-xs text-slate-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{c.phone}</p>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-slate-400" />{c.website}</p>
                  <p className="text-xs text-slate-500">{c.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {procedure.faq.length > 0 && (
        <div>
          <h3 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-3">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {procedure.faq.map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-sm text-slate-900 pr-4">{item.question}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-[15px] leading-[1.65] text-slate-600 border-t border-slate-100 pt-3">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

function CivicsPage({ user, onNavigate }: AuthedProps) {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('landing');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [browseCategory, setBrowseCategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch('/data/civics-procedures.json')
      .then(r => r.json())
      .then(d => setProcedures(d.civics_procedures ?? []))
      .catch(() => setProcedures([]))
      .finally(() => setLoading(false));
  }, []);

  const selectedProcedure = useMemo(
    () => procedures.find(p => p.id === selectedId) ?? null,
    [procedures, selectedId]
  );

  const handleSelectCategory = (cat: string) => {
    setBrowseCategory(cat);
    setView('browse');
  };

  const handleSelectProcedure = (id: string) => {
    setSelectedId(id);
    setView('detail');
  };

  const handleBack = () => {
    if (view === 'detail') {
      setView('browse');
    } else {
      setView('landing');
      setBrowseCategory(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="civics" user={user} onNavigate={onNavigate} mode="community" />

      <main className="max-w-3xl mx-auto px-4 pt-24 pb-8 sm:pb-12 lg:pb-16">
        {/* Page title */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 mb-3">Community</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900" style={{ letterSpacing: '-0.025em' }}>Civics Guide</h1>
        </motion.div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {view === 'landing' && (
              <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LandingView
                  procedures={procedures}
                  onBrowse={() => setView('browse')}
                  onSelectCategory={handleSelectCategory}
                  onSelectProcedure={handleSelectProcedure}
                />
              </motion.div>
            )}
            {view === 'browse' && (
              <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <BrowseView
                  procedures={procedures}
                  initialCategory={browseCategory}
                  onSelect={handleSelectProcedure}
                  onBack={handleBack}
                />
              </motion.div>
            )}
            {view === 'detail' && selectedProcedure && (
              <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DetailView procedure={selectedProcedure} onBack={handleBack} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

export default withAuth(CivicsPage);
