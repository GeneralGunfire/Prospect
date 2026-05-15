import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  IdCard, Landmark, GraduationCap, Briefcase,
  Search, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Clock, Banknote, BarChart2, FileText, Phone, ExternalLink,
  CheckCircle2, AlertCircle, Shield, Share2, Filter, X,
} from 'lucide-react';
import type { AppPage } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Config ────────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; desc: string }> = {
  Identity: {
    icon: <IdCard className="w-5 h-5" />,
    desc: 'IDs, passports, licenses, birth & marriage certificates',
  },
  Finance: {
    icon: <Landmark className="w-5 h-5" />,
    desc: 'NSFAS, SASSA grants, UIF, tax returns, banking',
  },
  Education: {
    icon: <GraduationCap className="w-5 h-5" />,
    desc: 'Student rights, funding, school enrolment',
  },
  Employment: {
    icon: <Briefcase className="w-5 h-5" />,
    desc: 'Workers rights, CCMA, labour disputes',
  },
};

// ── Landing view ──────────────────────────────────────────────────────────────

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
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-xl p-6 text-white"
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-slate-300" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">SA Civics Guide</span>
        </div>
        <h2
          className="font-black text-xl mb-2 leading-tight"
          style={{ letterSpacing: '-0.025em' }}
        >
          Know How to Get Things Done in South Africa
        </h2>
        <p className="text-[15px] leading-[1.65] text-slate-300 mb-4">
          Step-by-step guides for government procedures — IDs, grants, licenses, tax returns, and more. In plain language.
        </p>
        <button
          onClick={onBrowse}
          className="flex items-center gap-2 bg-white text-slate-900 font-black text-[11px] uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors min-h-11"
        >
          Browse all procedures
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Categories — divide-y list */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Browse by Category</h2>
        <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
          {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-[15px] text-slate-900">{cat}</p>
                <p className="text-[14px] text-slate-500 leading-snug">{cfg.desc}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {counts[cat] && (
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{counts[cat]} guides</span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Popular procedures */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Most Useful Guides</h2>
        <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
          {popular.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectProcedure(p.id)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="font-black text-[15px] text-slate-900 leading-tight">{p.title}</p>
                <p className="text-[14px] text-slate-500 mt-0.5">{p.time_to_complete} · {p.cost}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-slate-600 transition-colors" />
            </button>
          ))}
        </div>
        <button
          onClick={onBrowse}
          className="w-full mt-3 py-3 rounded-xl border border-slate-100 text-slate-600 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-colors min-h-11"
        >
          View all {procedures.length} procedures
        </button>
      </motion.div>

      {/* Key Helplines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-4 h-4 text-slate-300" />
          <h2 className="font-black text-[11px] uppercase tracking-[0.2em] text-white">Key Helplines</h2>
        </div>
        <div className="divide-y divide-white/10">
          {[
            { label: 'Home Affairs', number: '0800 60 11 90' },
            { label: 'SASSA',        number: '0800 60 10 11' },
            { label: 'NSFAS',        number: '0800 067 327' },
            { label: 'SARS',         number: '0800 00 7277' },
          ].map(({ label, number }) => (
            <div key={label} className="flex items-center justify-between py-3">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</p>
              <p className="font-black text-white text-[14px]">{number}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── Browse view ───────────────────────────────────────────────────────────────

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
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors min-h-11"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div>
        <h2 className="font-black text-xl text-slate-900" style={{ letterSpacing: '-0.025em' }}>All Procedures</h2>
        <p className="text-[14px] text-slate-500">{filtered.length} of {procedures.length} guides</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search procedures..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest border transition-all ${
            showFilters || hasFilters
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200'
          }`}
        >
          <Filter className="w-3 h-3" />
          Filters{hasFilters ? ' (active)' : ''}
        </button>
        {category && (
          <button
            onClick={() => setCategory('')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-black border bg-slate-100 text-slate-700 border-slate-200"
          >
            {category} <X className="w-3 h-3" />
          </button>
        )}
        {difficulty && (
          <button
            onClick={() => setDifficulty('')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-black border bg-slate-100 text-slate-700 border-slate-200"
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
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Category</p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(category === cat ? '' : cat)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest border transition-all ${
                        category === cat
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Difficulty</p>
                <div className="flex gap-1.5">
                  {difficulties.map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(difficulty === d ? '' : d)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest border transition-all ${
                        difficulty === d
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
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
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-[14px]">No procedures found</p>
          <button
            onClick={() => { setQuery(''); setCategory(''); setDifficulty(''); }}
            className="mt-2 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 min-h-11 px-3"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
          {filtered.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onSelect(p.id)}
              className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="font-black text-[15px] text-slate-900 leading-tight">{p.title}</p>
                <p className="text-[14px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{p.overview}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 px-2 py-0.5 rounded-lg">
                    {p.difficulty}
                  </span>
                  <span className="text-[14px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{p.time_to_complete}
                  </span>
                  <span className="text-[14px] text-slate-400 flex items-center gap-1">
                    <Banknote className="w-3 h-3" />{p.cost}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-1 group-hover:text-slate-600 transition-colors" />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Detail view ───────────────────────────────────────────────────────────────

function DetailView({ procedure, onBack }: { procedure: Procedure; onBack: () => void }) {
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const share = async () => {
    const text = `${procedure.title} — SA Civics Guide\n${procedure.overview}`;
    if (navigator.share) {
      try { await navigator.share({ title: procedure.title, text }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors min-h-11 mt-0.5"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex-1">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
            {procedure.category} · {procedure.subcategory}
          </p>
          <h2
            className="font-black text-xl text-slate-900 leading-tight"
            style={{ letterSpacing: '-0.025em' }}
          >
            {procedure.title}
          </h2>
        </div>
        <button
          onClick={share}
          className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 hover:bg-slate-200 transition-colors"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Quick stats — divide-y list */}
      <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
        {[
          { icon: <BarChart2 className="w-4 h-4" />, label: 'Difficulty', value: procedure.difficulty },
          { icon: <Clock className="w-4 h-4" />,     label: 'Time',       value: procedure.time_to_complete },
          { icon: <Banknote className="w-4 h-4" />,  label: 'Cost',       value: procedure.cost },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2 text-slate-400">
              {icon}
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            </div>
            <span className="font-black text-[14px] text-slate-900">{value}</span>
          </div>
        ))}
      </div>

      {/* Overview */}
      <div className="border border-slate-100 rounded-xl p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Overview</p>
        <p className="text-[15px] leading-[1.65] text-slate-700">{procedure.overview}</p>
      </div>

      {/* Steps */}
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Step-by-Step Guide</h3>
        <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
          {procedure.steps.map((step, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenStep(openStep === i ? null : i)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                  {step.step_number}
                </span>
                <span className="font-black text-[14px] text-slate-900 flex-1">{step.title}</span>
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
                    <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                      <p className="text-[15px] leading-[1.65] text-slate-700">{step.description}</p>

                      {step.documents_needed.length > 0 && step.documents_needed[0] !== 'No additional documents' && (
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Documents Needed</p>
                          <ul className="space-y-1.5">
                            {step.documents_needed.map((doc, j) => (
                              <li key={j} className="flex gap-2 text-[14px] text-slate-600">
                                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.tips.length > 0 && (
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Tips</p>
                          <ul className="space-y-1.5">
                            {step.tips.map((tip, j) => (
                              <li key={j} className="flex gap-2 text-[14px] text-slate-600">
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
      <div className="border border-slate-100 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">All Required Documents</h3>
        </div>
        <ul className="divide-y divide-slate-100">
          {procedure.required_documents.map((doc, i) => (
            <li key={i} className="flex gap-3 px-5 py-3 text-[14px] text-slate-700">
              <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              {doc}
            </li>
          ))}
        </ul>
      </div>

      {/* Common mistakes */}
      {procedure.common_mistakes.length > 0 && (
        <div className="border border-red-200 rounded-xl overflow-hidden bg-red-50">
          <div className="px-5 py-4 border-b border-red-200">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600">Common Mistakes to Avoid</h3>
          </div>
          <ul className="divide-y divide-red-100">
            {procedure.common_mistakes.map((m, i) => (
              <li key={i} className="flex gap-3 px-5 py-3 text-[14px] text-slate-700">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Forms */}
      {procedure.forms.length > 0 && (
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Forms Required</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {procedure.forms.map((form, i) => (
              <div key={i} className="px-5 py-4">
                <p className="font-black text-[14px] text-slate-900">{form.form_name}</p>
                <p className="text-[14px] text-slate-500 mt-0.5">Get it: {form.where_to_get}</p>
                {form.notes && <p className="text-[14px] text-slate-400 mt-0.5 italic">{form.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="border border-slate-100 rounded-xl p-5">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Timeline</h3>
        <p className="text-[15px] leading-[1.65] text-slate-700">{procedure.timeline}</p>
      </div>

      {/* Contacts */}
      {procedure.contacts.length > 0 && (
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Contact Information</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {procedure.contacts.map((c, i) => (
              <div key={i} className="px-5 py-4">
                <p className="font-black text-[14px] text-slate-900 mb-2">{c.organization}</p>
                <div className="space-y-1">
                  <p className="text-[14px] text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />{c.phone}
                  </p>
                  <p className="text-[14px] text-slate-600 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />{c.website}
                  </p>
                  <p className="text-[14px] text-slate-400">{c.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {procedure.faq.length > 0 && (
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Frequently Asked Questions</h3>
          <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
            {procedure.faq.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-black text-[14px] text-slate-900 pr-4">{item.question}</span>
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
                      <p className="px-5 pb-4 text-[15px] leading-[1.65] text-slate-600 border-t border-slate-100 pt-3">
                        {item.answer}
                      </p>
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

// ── Main page ─────────────────────────────────────────────────────────────────

function CivicsPage({ onNavigate }: { onNavigate: (page: AppPage) => void }) {
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
      <AppHeader currentPage="civics" onNavigate={onNavigate} mode="community" />

      <main className="max-w-3xl mx-auto px-4 pt-24 pb-8 sm:pb-12 lg:pb-16">
        {/* Page title */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Community</p>
          <h1
            className="text-3xl md:text-4xl font-black text-slate-900"
            style={{ letterSpacing: '-0.025em' }}
          >
            Civics Guide
          </h1>
        </motion.div>

        {loading ? (
          <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse bg-slate-50" />
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

export default CivicsPage;
