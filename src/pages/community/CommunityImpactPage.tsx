import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap, BookOpen, Briefcase, Heart, Users,
  MapPin, Globe, CheckCircle2, Clock, AlertCircle,
  Plus, ArrowRight, ChevronDown, X, Search,
  Building2, Handshake,
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';
import {
  fetchSubmissions, createSubmission, checkDuplicate, getUserSubmissions,
  getSubmissionStats, type Submission, type SubmissionType, type SubmissionFilters,
} from '../../services/communityImpactService';

// ── Constants ──────────────────────────────────────────────────────────────────

const SA_PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
  'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape',
];

const TYPES: { value: SubmissionType; label: string; icon: React.ReactNode; color: string; bg: string; desc: string }[] = [
  { value: 'school',  label: 'School',         icon: <GraduationCap className="w-6 h-6" />, color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200',   desc: 'Primary, secondary or special needs' },
  { value: 'college', label: 'College',         icon: <BookOpen className="w-6 h-6" />,      color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200', desc: 'TVET, community or private college' },
  { value: 'job',     label: 'Job / Learnership', icon: <Briefcase className="w-6 h-6" />,  color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200', desc: 'Apprenticeship, internship or opening' },
  { value: 'service', label: 'Support Service', icon: <Heart className="w-6 h-6" />,         color: 'text-red-500',     bg: 'bg-red-50 border-red-200',     desc: 'Youth, health, food, skills or legal' },
];

const CATEGORIES: Record<SubmissionType, string[]> = {
  school:  ['Primary School', 'Secondary School', 'Special Needs', 'Alternative', 'Independent'],
  college: ['TVET College', 'Community College', 'Private College', 'University'],
  job:     ['Learnership', 'Apprenticeship', 'Graduate Programme', 'Internship', 'Part-time', 'Full-time'],
  service: ['Youth Development', 'Mental Health', 'Food Security', 'Skills Training', 'Legal Aid', 'Healthcare', 'Housing'],
};

const TYPE_META: Record<SubmissionType, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  school:  { icon: <GraduationCap className="w-4 h-4" />, color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-100',     label: 'School' },
  college: { icon: <BookOpen className="w-4 h-4" />,      color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-100', label: 'College' },
  job:     { icon: <Briefcase className="w-4 h-4" />,     color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100', label: 'Job' },
  service: { icon: <Heart className="w-4 h-4" />,         color: 'text-red-500',     bg: 'bg-red-50 border-red-100',       label: 'Service' },
};

// ── Types ──────────────────────────────────────────────────────────────────────

type Tab = 'discover' | 'add' | 'my-contributions';
type AddStep = 'type' | 'form' | 'success';

interface FormState {
  name: string;
  category: string;
  province: string;
  city: string;
  description: string;
  website: string;
  submittedBy: string;
  email: string;
}

const EMPTY_FORM: FormState = {
  name: '', category: '', province: '', city: '',
  description: '', website: '', submittedBy: '', email: '',
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'unverified' | 'verified' | 'pending' | 'approved' | 'rejected' }) {
  const map = {
    verified:   { label: 'Verified',   icon: <CheckCircle2 className="w-3 h-3" />, cls: 'text-blue-700 bg-blue-50 border-blue-200' },
    approved:   { label: 'Approved',   icon: <CheckCircle2 className="w-3 h-3" />, cls: 'text-blue-700 bg-blue-50 border-blue-200' },
    unverified: { label: 'Unverified', icon: <Clock className="w-3 h-3" />,        cls: 'text-amber-700  bg-amber-50  border-amber-200' },
    pending:    { label: 'Pending',    icon: <Clock className="w-3 h-3" />,        cls: 'text-amber-700  bg-amber-50  border-amber-200' },
    rejected:   { label: 'Rejected',  icon: <AlertCircle className="w-3 h-3" />,   cls: 'text-red-700    bg-red-50    border-red-200' },
  };
  const { label, icon, cls } = map[status] ?? map.unverified;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${cls}`}>
      {icon}{label}
    </span>
  );
}

function SubmissionCard({ item, index }: { item: Submission; index: number }) {
  const meta = TYPE_META[item.submission_type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(0,0,0,0.08)' }}
      className="bg-white rounded-xl border border-slate-200  overflow-hidden transition-shadow group"
    >
      <div className="flex items-stretch">
        {/* Left accent bar */}
        <div className={`w-1 shrink-0 ${
          item.submission_type === 'school'  ? 'bg-blue-500' :
          item.submission_type === 'college' ? 'bg-blue-500' :
          item.submission_type === 'job'     ? 'bg-blue-500' :
          'bg-red-400'
        }`} />

        <div className="flex-1 p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} border`}>
              <span className={meta.color}>{meta.icon}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h3 className="text-sm font-black text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                  {item.name}
                </h3>
                <StatusBadge status={item.verification_status} />
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2.5">
                <span className={`text-xs font-black uppercase tracking-widest ${meta.color}`}>
                  {meta.label}
                </span>
                {item.category && (
                  <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full font-medium">
                    {item.category}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3 h-3" />
                  {item.city}, {item.province}
                </span>
              </div>

              {item.description && (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2">
                  {item.description}
                </p>
              )}

              {item.website_url && (
                <a
                  href={item.website_url.startsWith('http') ? item.website_url : `https://${item.website_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  Visit website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

function CommunityImpactPage({ user, onNavigate }: AuthedProps) {
  const isGuest = user?.is_anonymous === true || user?.id === 'guest';
  const [activeTab, setActiveTab] = useState<Tab>('discover');

  // Discover state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<SubmissionType | 'all'>('all');
  const [filterProvince, setFilterProvince] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // My contributions
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [myLoading, setMyLoading] = useState(false);

  // Add flow
  const [addStep, setAddStep] = useState<AddStep>('type');
  const [selectedType, setSelectedType] = useState<SubmissionType | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [isDuplicateWarning, setIsDuplicateWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSubmission, setNewSubmission] = useState<Submission | null>(null);

  // Load submissions on mount
  useEffect(() => {
    loadSubmissions();
  }, []);

  // Pre-fill email if logged in
  useEffect(() => {
    if (!isGuest && user.email) {
      setForm(f => ({
        ...f,
        email: user.email ?? '',
        submittedBy: user.user_metadata?.full_name ?? '',
      }));
    }
  }, [user, isGuest]);

  async function loadSubmissions(filters?: SubmissionFilters) {
    setIsLoading(true);
    const data = await fetchSubmissions(filters);
    setSubmissions(data);
    setIsLoading(false);
  }

  async function loadMySubmissions() {
    if (!form.email && isGuest) return;
    setMyLoading(true);
    const email = isGuest ? form.email : (user.email ?? '');
    const userId = isGuest ? undefined : user.id;
    const data = await getUserSubmissions(email, userId);
    setMySubmissions(data);
    setMyLoading(false);
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    if (tab === 'my-contributions') loadMySubmissions();
  }

  // Discover: filtered list
  const filteredSubmissions = useMemo(() => {
    let result = submissions;
    if (filterType !== 'all') result = result.filter(s => s.submission_type === filterType);
    if (filterProvince !== 'all') result = result.filter(s => s.province === filterProvince);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        (s.description ?? '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [submissions, filterType, filterProvince, searchQuery]);

  const stats = useMemo(() => getSubmissionStats(submissions), [submissions]);

  // Add flow handlers
  function handleTypeSelect(type: SubmissionType) {
    setSelectedType(type);
    setAddStep('form');
    setIsDuplicateWarning(false);
    setFormError('');
  }

  function setField(key: keyof FormState, value: string) {
    setForm(f => ({ ...f, [key]: value }));
    setFormError('');
    setIsDuplicateWarning(false);
  }

  async function handleSubmit() {
    if (!selectedType) return;
    setFormError('');

    // Validate required fields
    if (!form.name.trim()) return setFormError('Name is required.');
    if (!form.city.trim()) return setFormError('City is required.');
    if (!form.province) return setFormError('Province is required.');
    if (!form.email.trim()) return setFormError('Email is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setFormError('Enter a valid email address.');

    setIsSubmitting(true);

    // Duplicate check
    const isDuplicate = await checkDuplicate(form.name, form.city, selectedType);
    if (isDuplicate && !isDuplicateWarning) {
      setIsDuplicateWarning(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const created = await createSubmission({
        user_id: isGuest ? null : user.id,
        submitted_by: form.submittedBy.trim() || 'Anonymous',
        submitted_email: form.email.trim().toLowerCase(),
        submission_type: selectedType,
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        province: form.province,
        city: form.city.trim(),
        website_url: form.website.trim(),
      });

      // Optimistic: add to discover immediately
      setSubmissions(prev => [created, ...prev]);
      setNewSubmission(created);
      setAddStep('success');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleAddAnother() {
    setAddStep('type');
    setSelectedType(null);
    setForm(f => ({ ...EMPTY_FORM, email: f.email, submittedBy: f.submittedBy }));
    setNewSubmission(null);
    setIsDuplicateWarning(false);
    setFormError('');
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="community-impact" user={user} onNavigate={onNavigate} mode="community" />

      <div className="pt-16 sm:pt-20 pb-12 sm:pb-20 px-4 sm:px-6 max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8 pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Community</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-1" style={{ letterSpacing: '-0.025em' }}>Opportunities</h1>
          <p className="text-sm text-slate-500">Schools, colleges, jobs, and support services across South Africa.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white rounded-xl border border-slate-200  mb-6 sm:mb-8 w-full sm:w-fit overflow-x-auto">
          {(['discover', 'add', 'my-contributions'] as Tab[]).map(tab => {
            const labels: Record<Tab, string> = {
              discover: 'Discover',
              add: 'Add Opportunity',
              'my-contributions': 'My Contributions',
            };
            return (
              <button
                key={tab}
                data-testid={`ci-tab-${tab}`}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2.5 min-h-11 rounded-lg text-xs font-black uppercase tracking-widest transition-all shrink-0 ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white '
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab === 'add' && <Plus className="w-3 h-3 inline mr-1 -mt-0.5" />}
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* ── DISCOVER TAB ── */}
        {activeTab === 'discover' && (
          <div>
            {/* CTA Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Missing something?</p>
                <p className="text-white font-black text-base md:text-lg">
                  Is your school or local opportunity here?
                </p>
                <p className="text-slate-400 text-xs mt-1">Add it in under 60 seconds — no account needed.</p>
              </div>
              <button
                onClick={() => handleTabChange('add')}
                className="shrink-0 flex items-center gap-2 px-5 py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors min-h-11"
              >
                Add it now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden mb-6 sm:mb-8">
              {[
                { label: 'Total',    value: stats.total   },
                { label: 'Schools',  value: stats.school  },
                { label: 'Colleges', value: stats.college },
                { label: 'Jobs',     value: stats.job     },
                { label: 'Services', value: stats.service },
              ].map((s, i) => (
                <div key={s.label} className="bg-white p-4 text-center">
                  <p className="text-2xl font-black tabular-nums text-slate-900 leading-none mb-1">{s.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or city…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Type pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'school', 'college', 'job', 'service'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                      filterType === t
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t === 'all' ? 'All' : TYPE_META[t].label}
                  </button>
                ))}
              </div>

              {/* Province dropdown */}
              <div className="relative">
                <select
                  value={filterProvince}
                  onChange={e => setFilterProvince(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all cursor-pointer"
                >
                  <option value="all">All Provinces</option>
                  {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Results count */}
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              {isLoading ? 'Loading…' : `${filteredSubmissions.length} ${filteredSubmissions.length === 1 ? 'opportunity' : 'opportunities'} found`}
            </p>

            {/* List */}
            {isLoading ? (
              <div className="grid gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-100 p-5 h-24 animate-pulse" />
                ))}
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-black text-slate-700 mb-1">No opportunities found</p>
                <p className="text-xs text-slate-400 mb-6">Be the first to add one in this area.</p>
                <button
                  onClick={() => handleTabChange('add')}
                  className="px-6 py-3 min-h-11 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
                >
                  Add an opportunity
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredSubmissions.map((item, i) => (
                  <SubmissionCard key={item.id} item={item} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ADD TAB ── */}
        {activeTab === 'add' && (
          <div className="max-w-lg mx-auto">
            <AnimatePresence mode="wait">
              {/* Step 1: Type selection */}
              {addStep === 'type' && (
                <motion.div
                  key="type"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Step 1 of 2</p>
                  <h2 className="text-xl font-black text-slate-900 mb-1">What are you adding?</h2>
                  <p className="text-sm text-slate-500 mb-6">Pick a category to get started.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TYPES.map(t => (
                      <motion.button
                        key={t.value}
                        data-testid={`ci-type-${t.value}`}
                        onClick={() => handleTypeSelect(t.value)}
                        whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-col items-start p-5 rounded-xl border-2 bg-white text-left transition-all hover:border-slate-300 group ${t.bg}`}
                      >
                        <span className={`mb-3 ${t.color}`}>{t.icon}</span>
                        <p className={`text-sm font-black mb-1 ${t.color}`}>{t.label}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
                        <ArrowRight className={`w-3.5 h-3.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity ${t.color}`} />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Form */}
              {addStep === 'form' && selectedType && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => { setAddStep('type'); setFormError(''); setIsDuplicateWarning(false); }}
                      className="text-slate-400 hover:text-slate-700 transition-colors"
                      data-testid="ci-form-back"
                      aria-label="Back"
                    >
                      ← Back
                    </button>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black ${TYPE_META[selectedType].bg} ${TYPE_META[selectedType].color}`}>
                      {TYPE_META[selectedType].icon}
                      {TYPE_META[selectedType].label}
                    </div>
                  </div>

                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Step 2 of 2</p>
                  <h2 className="text-xl font-black text-slate-900 mb-6">Quick details</h2>

                  {/* Duplicate warning */}
                  <AnimatePresence>
                    {isDuplicateWarning && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200"
                      >
                        <p className="text-xs font-black text-amber-800 mb-1">This might already exist</p>
                        <p className="text-xs text-amber-700">We found a similar entry for "{form.name}" in {form.city}. Submit anyway to add more details or a different location.</p>
                        <button
                          onClick={handleSubmit}
                          className="mt-3 text-xs font-black text-amber-800 underline hover:no-underline"
                        >
                          Submit anyway →
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    {/* Basic */}
                    <FormField label="Name" required>
                      <input
                        data-testid="ci-form-name"
                        type="text"
                        placeholder={`e.g. Southview ${TYPE_META[selectedType].label}`}
                        value={form.name}
                        onChange={e => setField('name', e.target.value)}
                        className="input-base"
                        maxLength={120}
                      />
                    </FormField>

                    <FormField label="Category" hint="Optional">
                      <div className="relative">
                        <select
                          value={form.category}
                          onChange={e => setField('category', e.target.value)}
                          className="input-base appearance-none pr-8"
                        >
                          <option value="">Select category (optional)</option>
                          {CATEGORIES[selectedType].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </FormField>

                    {/* Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormField label="Province" required>
                        <div className="relative">
                          <select
                            data-testid="ci-form-province"
                            value={form.province}
                            onChange={e => setField('province', e.target.value)}
                            className="input-base appearance-none pr-8"
                          >
                            <option value="">Select…</option>
                            {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </FormField>
                      <FormField label="City" required>
                        <input
                          type="text"
                          placeholder="e.g. Soweto"
                          value={form.city}
                          onChange={e => setField('city', e.target.value)}
                          className="input-base"
                          maxLength={80}
                        />
                      </FormField>
                    </div>

                    {/* Quick info */}
                    <FormField label="Short description" hint="Optional — max 150 chars">
                      <textarea
                        placeholder="One sentence about this opportunity…"
                        value={form.description}
                        onChange={e => setField('description', e.target.value.slice(0, 150))}
                        rows={2}
                        className="input-base resize-none"
                      />
                      <p className="text-right text-xs text-slate-400 mt-1">{form.description.length}/150</p>
                    </FormField>

                    <FormField label="Website" hint="Optional">
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="url"
                          placeholder="https://…"
                          value={form.website}
                          onChange={e => setField('website', e.target.value)}
                          className="input-base pl-9"
                        />
                      </div>
                    </FormField>

                    {/* Contributor */}
                    <div className="border-t border-slate-100 pt-4 mt-2">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Your details</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Your name" hint="Optional">
                          <input
                            type="text"
                            placeholder="Anonymous"
                            value={form.submittedBy}
                            onChange={e => setField('submittedBy', e.target.value)}
                            className="input-base"
                            maxLength={60}
                            disabled={!isGuest && !!user.user_metadata?.full_name}
                          />
                        </FormField>
                        <FormField label="Email" required>
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => setField('email', e.target.value)}
                            className="input-base"
                            disabled={!isGuest && !!user.email}
                          />
                        </FormField>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Email is used for verification only, not displayed publicly.</p>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {formError && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-red-600 font-medium flex items-center gap-1.5"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />{formError}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <button
                      data-testid="ci-submit-btn"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>Submit — goes live immediately <ArrowRight className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {addStep === 'success' && newSubmission && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Your contribution is live</h2>
                  <p className="text-sm text-slate-500 mb-2 max-w-sm mx-auto">
                    <strong className="text-slate-800">{newSubmission.name}</strong> has been added and is visible to everyone immediately.
                  </p>
                  <p className="text-xs text-slate-400 mb-8 max-w-xs mx-auto">
                    It's tagged as Unverified until confirmed. Help others by adding more opportunities in your area.
                  </p>

                  {/* Preview card */}
                  <div className="text-left mb-8 max-w-sm mx-auto">
                    <SubmissionCard item={newSubmission} index={0} />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => { handleTabChange('discover'); }}
                      className="px-6 py-3 min-h-11 border border-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors"
                    >
                      View in Discover
                    </button>
                    <button
                      onClick={handleAddAnother}
                      className="px-6 py-3 min-h-11 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add another
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── MY CONTRIBUTIONS TAB ── */}
        {activeTab === 'my-contributions' && (
          <div>
            {/* If guest and no email yet, prompt */}
            {isGuest && !form.email ? (
              <div className="max-w-sm mx-auto text-center py-12">
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-black text-slate-800 mb-2">Enter your email to see your submissions</h3>
                <p className="text-xs text-slate-500 mb-5">We track your contributions by email.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setField('email', e.target.value)}
                    className="input-base flex-1"
                  />
                  <button
                    onClick={loadMySubmissions}
                    className="px-4 py-2.5 min-h-11 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            ) : myLoading ? (
              <div className="grid gap-3">
                {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl border border-slate-100 p-5 h-24 animate-pulse" />)}
              </div>
            ) : mySubmissions.length === 0 ? (
              <div className="text-center py-14">
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-black text-slate-700 mb-1">No contributions yet</p>
                <p className="text-xs text-slate-400 mb-6">Add a school, college, job or service to your community.</p>
                <button
                  onClick={() => handleTabChange('add')}
                  className="px-6 py-3 min-h-11 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
                >
                  Add your first contribution
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                  {mySubmissions.length} contribution{mySubmissions.length !== 1 ? 's' : ''}
                </p>
                <div className="grid gap-3">
                  {mySubmissions.map((item, i) => (
                    <div key={item.id} className="relative">
                      <SubmissionCard item={item} index={i} />
                      <div className="absolute top-4 right-4 flex items-center gap-1.5">
                        <StatusBadge status={item.approval_status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ── Form field helper ──────────────────────────────────────────────────────────

function FormField({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {hint && <span className="text-slate-400 normal-case tracking-normal font-normal ml-1.5">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

export default withAuth(CommunityImpactPage);
