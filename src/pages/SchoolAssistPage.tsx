import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Search,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Loader2,
  X,
  CheckCircle2,
  SendHorizonal,
  MessageCircle,
} from 'lucide-react';
import type { AppPage } from '../lib/withAuth';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { searchTopics, searchQuestion, type TopicResult, type QuestionResult } from '../services/schoolAssistService';
import { submitQuestion } from '../services/unansweredQuestionService';
import AppHeader from '../components/AppHeader';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  onNavigate: (page: AppPage) => void;
  onNavigateHome: () => void;
}

type SearchMode = 'topic' | 'question';

const SUBJECTS = [
  'Mathematics',
  'Physical Sciences',
  'Life Sciences',
  'English',
  'Accounting',
  'Geography',
  'Business Studies',
  'Economics',
  'History',
  'Other',
] as const;

const GRADES = [10, 11, 12] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function SchoolAssistPage({ onNavigate, onNavigateHome }: Props) {
  // Auth state
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Check auth once on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
      setUser(session?.user ?? null);
    });
  }, []);

  // Search state
  const [searchMode, setSearchMode] = useState<SearchMode>('topic');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [topicResults, setTopicResults] = useState<TopicResult[]>([]);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);

  // Submit form state
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formSubject, setFormSubject] = useState('');
  const [formGrade, setFormGrade] = useState<number | ''>('');
  const [formDetails, setFormDetails] = useState('');

  // Expanded answers state (for qa results)
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(new Set());

  const inputRef = useRef<HTMLInputElement>(null);

  const hasResults =
    searchMode === 'topic'
      ? topicResults.length > 0
      : questionResults.length > 0;

  // ── Handlers ─────────────────────────────────────────────────────────────────

  async function handleSearch() {
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setSearched(false);
    setShowSubmitForm(false);
    setSubmitSuccess(false);
    setTopicResults([]);
    setQuestionResults([]);

    try {
      if (searchMode === 'topic') {
        const results = await searchTopics(q);
        setTopicResults(results);
      } else {
        const results = await searchQuestion(q);
        setQuestionResults(results);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
  }

  function handleModeChange(mode: SearchMode) {
    setSearchMode(mode);
    setSearched(false);
    setTopicResults([]);
    setQuestionResults([]);
    setShowSubmitForm(false);
    setSubmitSuccess(false);
    inputRef.current?.focus();
  }

  function toggleAnswer(id: string) {
    setExpandedAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmitQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    const q = query.trim();
    if (!q) return;

    setSubmitLoading(true);
    try {
      const result = await submitQuestion({
        userId,
        question: q,
        subject: formSubject || undefined,
        grade: formGrade !== '' ? Number(formGrade) : undefined,
        details: formDetails.trim() || undefined,
      });

      if (result) {
        setSubmitSuccess(true);
        setShowSubmitForm(false);
        setFormSubject('');
        setFormGrade('');
        setFormDetails('');
      }
    } catch (err) {
      console.error('Error submitting question:', err);
    } finally {
      setSubmitLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-bg-light">
      {user && (
        <AppHeader currentPage="school-assist" user={user} onNavigate={onNavigate} mode="school" />
      )}
      {/* fallback slim bar when user not yet loaded */}
      {!user && (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Prospect
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">S</div>
          <span className="font-black text-sm text-[#1e293b] uppercase tracking-wider">School Assist</span>
        </div>
        <button
          onClick={() => onNavigate('school-assist-chat')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Chat
        </button>
      </header>
      )}

      <main className="max-w-3xl mx-auto px-4 py-10" style={{ paddingTop: user ? '5.5rem' : undefined }}>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Your Study Companion</p>
          <h1 className="text-3xl lg:text-4xl font-black text-[#1e293b]" style={{ letterSpacing: '-0.02em' }}>
            School Assist
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
            Search study topics or ask a question — get answers from our library and submit anything we haven't covered yet.
          </p>
        </motion.div>

        {/* Quick tools */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-6"
        >
          <button
            onClick={() => onNavigate('school-assist-chat')}
            className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-4 text-left transition-colors"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Guidance Chat</p>
              <p className="text-xs text-blue-200 mt-0.5">Get answers on APS, subjects, bursaries, TVET & more</p>
            </div>
          </button>
        </motion.div>

        {/* Search section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 mb-6"
        >
          {/* Mode toggle */}
          <div className="flex gap-2 mb-5 p-1 bg-slate-100 rounded-xl w-fit mx-auto">
            <button
              onClick={() => handleModeChange('topic')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                searchMode === 'topic'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Search Topic
            </button>
            <button
              onClick={() => handleModeChange('question')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                searchMode === 'question'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Ask a Question
            </button>
          </div>

          {/* Search input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  searchMode === 'topic'
                    ? 'e.g. Algebraic Expressions, Waves, Photosynthesis…'
                    : 'e.g. How do I solve quadratic equations?'
                }
                className="w-full h-11 pl-9 pr-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 px-5 h-11 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-16 gap-3 text-slate-400"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Searching…</span>
            </motion.div>
          )}

          {!loading && searched && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Submit success banner */}
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-sm font-black text-blue-800">Question submitted!</p>
                    <p className="text-xs text-blue-500">We'll get back to you. Check your dashboard for updates.</p>
                  </div>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="ml-auto text-blue-400 hover:text-blue-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Topic results */}
              {searchMode === 'topic' && (
                <>
                  {topicResults.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                        {topicResults.length} topic{topicResults.length !== 1 ? 's' : ''} found
                      </p>
                      {topicResults.map((topic, i) => (
                        <motion.div
                          key={topic.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-xs font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                  {topic.subject}
                                </span>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                  Gr {topic.grade}
                                </span>
                              </div>
                              <h3 className="text-sm font-black text-slate-900">{topic.title}</h3>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed mb-3">{topic.snippet}</p>
                          <button
                            onClick={() => onNavigate('library')}
                            className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            View Full Lesson <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <NoResultsCard
                      searchMode={searchMode}
                      query={query}
                      userId={userId}
                      showSubmitForm={showSubmitForm}
                      setShowSubmitForm={setShowSubmitForm}
                      onNavigate={onNavigate}
                    />
                  )}
                </>
              )}

              {/* Question results */}
              {searchMode === 'question' && (
                <>
                  {questionResults.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                        {questionResults.length} result{questionResults.length !== 1 ? 's' : ''} found
                      </p>
                      {questionResults.map((result, i) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5"
                        >
                          {result.type === 'qa' ? (
                            <>
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                {result.subject && (
                                  <span className="text-xs font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                    {result.subject}
                                  </span>
                                )}
                                {result.grade && (
                                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                    Gr {result.grade}
                                  </span>
                                )}
                                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                                  Answered
                                </span>
                              </div>
                              <p className="text-sm font-black text-slate-900 mb-2">{result.question}</p>
                              {result.answer && (
                                <>
                                  <AnimatePresence>
                                    {expandedAnswers.has(result.id) && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <p className="text-xs text-slate-600 leading-relaxed mb-3 bg-slate-50 rounded-xl p-3">
                                          {result.answer}
                                        </p>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                  <button
                                    onClick={() => toggleAnswer(result.id)}
                                    className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                                  >
                                    {expandedAnswers.has(result.id) ? 'Hide Answer' : 'View Answer'}
                                    <ChevronRight
                                      className={`w-3.5 h-3.5 transition-transform ${expandedAnswers.has(result.id) ? 'rotate-90' : ''}`}
                                    />
                                  </button>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                {result.subject && (
                                  <span className="text-xs font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                    {result.subject}
                                  </span>
                                )}
                                {result.grade && (
                                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                    Gr {result.grade}
                                  </span>
                                )}
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                  Topic
                                </span>
                              </div>
                              <p className="text-sm font-black text-slate-900 mb-1">{result.title}</p>
                              {result.snippet && (
                                <p className="text-xs text-slate-500 leading-relaxed mb-3">{result.snippet}</p>
                              )}
                              <button
                                onClick={() => onNavigate('library')}
                                className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                View Full Lesson <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <NoResultsCard
                      searchMode={searchMode}
                      query={query}
                      userId={userId}
                      showSubmitForm={showSubmitForm}
                      setShowSubmitForm={setShowSubmitForm}
                      onNavigate={onNavigate}
                    />
                  )}
                </>
              )}

              {/* Submit question form */}
              <AnimatePresence>
                {showSubmitForm && (
                  <motion.div
                    key="submit-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 bg-white rounded-3xl border border-blue-100 shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-0.5">Submit Your Question</p>
                        <p className="text-xs text-slate-500">We'll research and add an answer to our library.</p>
                      </div>
                      <button
                        onClick={() => setShowSubmitForm(false)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {!userId ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-slate-600 mb-3">Sign in to submit questions.</p>
                        <button
                          onClick={() => onNavigate('auth')}
                          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors"
                        >
                          Sign In
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitQuestion} className="space-y-4">
                        {/* Question (pre-filled) */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Your Question <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={query}
                            onChange={(e) => {}}
                            readOnly
                            rows={2}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 resize-none focus:outline-none"
                          />
                        </div>

                        {/* Subject + Grade row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
                            <select
                              value={formSubject}
                              onChange={(e) => setFormSubject(e.target.value)}
                              className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                            >
                              <option value="">Select subject</option>
                              {SUBJECTS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Grade</label>
                            <select
                              value={formGrade}
                              onChange={(e) => setFormGrade(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                            >
                              <option value="">Select grade</option>
                              {GRADES.map((g) => (
                                <option key={g} value={g}>Grade {g}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Details */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Additional Details <span className="text-slate-400 font-normal">(optional)</span>
                          </label>
                          <textarea
                            value={formDetails}
                            onChange={(e) => setFormDetails(e.target.value)}
                            rows={3}
                            placeholder="Add any extra context that would help us answer better…"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={submitLoading}
                            className="flex items-center gap-2 px-5 h-11 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {submitLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <SendHorizonal className="w-4 h-4" />
                            )}
                            Submit Question
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowSubmitForm(false)}
                            className="px-5 h-11 border border-slate-200 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

// ── No Results Card ───────────────────────────────────────────────────────────

function NoResultsCard({
  searchMode,
  query,
  userId,
  showSubmitForm,
  setShowSubmitForm,
  onNavigate,
}: {
  searchMode: SearchMode;
  query: string;
  userId: string | null;
  showSubmitForm: boolean;
  setShowSubmitForm: (v: boolean) => void;
  onNavigate: (page: AppPage) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8 text-center"
    >
      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <HelpCircle className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-sm font-black text-slate-800 mb-1">No answers found</p>
      <p className="text-xs text-slate-500 mb-5 max-w-xs mx-auto">
        We couldn't find anything matching "{query}".{' '}
        {searchMode === 'question'
          ? "Submit your question and we'll research it for you."
          : 'Try searching in a different way or browse the full library.'}
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {searchMode === 'question' && !showSubmitForm && (
          <button
            onClick={() => setShowSubmitForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all"
          >
            <SendHorizonal className="w-3.5 h-3.5" />
            Submit Your Question
          </button>
        )}
        <button
          onClick={() => onNavigate('library')}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
        >
          Browse Library <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      {!userId && searchMode === 'question' && (
        <p className="text-xs text-slate-400 mt-4">
          <button
            onClick={() => onNavigate('auth')}
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign in
          </button>{' '}
          to submit questions and track your answers.
        </p>
      )}
    </motion.div>
  );
}
