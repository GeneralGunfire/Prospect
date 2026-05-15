import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ArrowRight, ChevronLeft, ChevronRight,
  Calculator, Atom, FlaskConical, Briefcase, TrendingUp,
  Monitor, Pencil, Languages, BookOpen, type LucideIcon,
} from 'lucide-react';
import { subjects } from '../../data/subjects';
import { withAuth, type AuthedProps, type AppPage } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';

type Step = 'subject' | 'grade' | 'term' | 'content';

interface SubjectMeta {
  Icon: LucideIcon;
  accentCls: string;
  labelCls: string;
}

const SUBJECT_META: Record<string, SubjectMeta> = {
  'algebra':           { Icon: Calculator,   accentCls: 'bg-blue-50 text-blue-700',   labelCls: 'text-blue-600' },
  'geometry':          { Icon: Calculator,   accentCls: 'bg-blue-50 text-blue-700',   labelCls: 'text-blue-600' },
  'phys-sci':          { Icon: Atom,         accentCls: 'bg-blue-50 text-blue-700',   labelCls: 'text-blue-600' },
  'life-sci':          { Icon: FlaskConical, accentCls: 'bg-emerald-50 text-emerald-700', labelCls: 'text-emerald-600' },
  'accounting':        { Icon: Calculator,   accentCls: 'bg-amber-50 text-amber-700', labelCls: 'text-amber-600' },
  'business-studies':  { Icon: Briefcase,    accentCls: 'bg-slate-100 text-slate-600', labelCls: 'text-slate-500' },
  'economics':         { Icon: TrendingUp,   accentCls: 'bg-slate-100 text-slate-600', labelCls: 'text-slate-500' },
  'cat':               { Icon: Monitor,      accentCls: 'bg-slate-100 text-slate-600', labelCls: 'text-slate-500' },
  'egd':               { Icon: Pencil,       accentCls: 'bg-slate-100 text-slate-600', labelCls: 'text-slate-500' },
  'english-hl':        { Icon: Languages,    accentCls: 'bg-red-50 text-red-700',     labelCls: 'text-red-600' },
  'default':           { Icon: BookOpen,     accentCls: 'bg-slate-100 text-slate-500', labelCls: 'text-slate-400' },
};

const subjectsWithContent = new Set(['algebra', 'geometry', 'phys-sci', 'accounting']);

const ALGEBRA_G10_TOPICS: Record<number, string[]> = {
  1: ['Linear Equations', 'Number Systems', 'Exponents'],
};

function StudyLibraryPage({ user, onNavigate }: AuthedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [step, setStep] = useState<Step>('subject');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentSubjectName = subjects.find(s => s.id === selectedSubject)?.name;
  const coreSubjects = filteredSubjects.filter(s => s.category === 'Core');
  const electiveSubjects = filteredSubjects.filter(s => s.category === 'Elective');

  const goBack = () => {
    if (step === 'grade') { setStep('subject'); }
    else if (step === 'term') { setStep('grade'); }
    else if (step === 'content') { setStep('term'); }
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="library" user={user} onNavigate={onNavigate} />

      <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6">

        <AnimatePresence mode="wait">

          {/* ── Subject selection ── */}
          {step === 'subject' && (
            <motion.div
              key="subject"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {/* Header */}
              <div className="pt-4 mb-10">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-3">Study Library</p>
                <h1
                  className="text-3xl sm:text-4xl font-black text-slate-900 mb-3"
                  style={{ letterSpacing: '-0.025em' }}
                >
                  Library
                </h1>
                <p className="text-[15px] text-slate-500 leading-[1.65]">
                  {subjects.length} subjects — select one to browse lessons by grade and term.
                </p>
              </div>

              {/* Search */}
              <div className="relative mb-10 max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 transition-colors bg-white"
                  style={{ fontSize: '16px' }}
                />
              </div>

              {/* Subject list — grouped by category */}
              {filteredSubjects.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-[14px] font-black text-slate-900 mb-1">No subjects found</p>
                  <p className="text-[13px] text-slate-400">Try a different search term.</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {[
                    { label: 'Core Subjects', list: coreSubjects },
                    { label: 'Elective Subjects', list: electiveSubjects },
                  ].map(({ label, list }) => list.length > 0 && (
                    <section key={label}>
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-4">{label}</p>
                      <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                        {list.map((subject) => {
                          const hasContent = subjectsWithContent.has(subject.id);
                          const meta = SUBJECT_META[subject.id] ?? SUBJECT_META['default'];
                          const Icon = meta.Icon;
                          return (
                            <motion.button
                              key={subject.id}
                              onClick={() => {
                                if (!hasContent) return;
                                setSelectedSubject(subject.id);
                                setStep('grade');
                              }}
                              disabled={!hasContent}
                              whileHover={hasContent ? { x: 2 } : {}}
                              transition={{ duration: 0.15 }}
                              className={`w-full flex items-center gap-5 px-5 py-4 text-left transition-colors ${
                                hasContent
                                  ? 'hover:bg-slate-50 cursor-pointer group'
                                  : 'cursor-default'
                              }`}
                            >
                              {/* Icon */}
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                hasContent ? meta.accentCls : 'bg-slate-50 text-slate-300'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>

                              {/* Name + category */}
                              <div className="flex-1 min-w-0">
                                <p className={`text-[15px] font-bold leading-snug ${
                                  hasContent ? 'text-slate-900' : 'text-slate-400'
                                }`}>
                                  {subject.name}
                                </p>
                                <p className={`text-[11px] font-black uppercase tracking-[0.14em] mt-0.5 ${
                                  hasContent ? meta.labelCls : 'text-slate-300'
                                }`}>
                                  {hasContent ? 'Lessons available' : 'Coming soon'}
                                </p>
                              </div>

                              {/* Arrow or soon badge */}
                              {hasContent ? (
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
                              ) : (
                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 shrink-0">
                                  Soon
                                </span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Grade selection ── */}
          {step === 'grade' && (
            <motion.div
              key="grade"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="max-w-lg mx-auto"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors mb-10"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Subjects
              </button>

              <div className="mb-10">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-2">
                  {currentSubjectName}
                </p>
                <h2
                  className="text-3xl font-black text-slate-900"
                  style={{ letterSpacing: '-0.025em' }}
                >
                  Select your grade
                </h2>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                {[10, 11, 12].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => { setSelectedGrade(grade); setStep('term'); }}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div>
                      <p className="text-[20px] font-black text-slate-900" style={{ letterSpacing: '-0.02em' }}>
                        Grade {grade}
                      </p>
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400 mt-0.5">
                        CAPS Curriculum · 4 Terms
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Term selection ── */}
          {step === 'term' && (
            <motion.div
              key="term"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="max-w-lg mx-auto"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors mb-10"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Grade {selectedGrade}
              </button>

              <div className="mb-10">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-2">
                  {currentSubjectName} · Grade {selectedGrade}
                </p>
                <h2
                  className="text-3xl font-black text-slate-900"
                  style={{ letterSpacing: '-0.025em' }}
                >
                  Select a term
                </h2>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                {[1, 2, 3, 4].map((term) => {
                  const isLive = selectedSubject === 'algebra' && selectedGrade === 10 && term === 1;
                  const topics = isLive ? (ALGEBRA_G10_TOPICS[term] ?? []) : [];
                  return (
                    <button
                      key={term}
                      onClick={() => {
                        if (isLive) {
                          onNavigate('learning-algebra-g10-t1-linear-equations' as AppPage);
                        } else {
                          setSelectedTerm(term);
                          setStep('content');
                        }
                      }}
                      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-[17px] font-black text-slate-900" style={{ letterSpacing: '-0.016em' }}>
                            Term {term}
                          </p>
                          {isLive && (
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                              Live
                            </span>
                          )}
                        </div>
                        {topics.length > 0 && (
                          <p className="text-[12px] text-slate-400 leading-snug">
                            {topics.join(' · ')}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0 ml-4" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Content / coming soon ── */}
          {step === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="max-w-lg mx-auto"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors mb-10"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Term {selectedTerm}
              </button>

              <div className="mb-12">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-2">
                  {currentSubjectName} · Grade {selectedGrade} · Term {selectedTerm}
                </p>
                <h2
                  className="text-3xl font-black text-slate-900"
                  style={{ letterSpacing: '-0.025em' }}
                >
                  Coming soon
                </h2>
              </div>

              <div className="border border-slate-100 rounded-xl p-8">
                <p className="text-[15px] text-slate-600 leading-[1.65] mb-6">
                  Study materials for {currentSubjectName} Grade {selectedGrade} Term {selectedTerm} are being developed. Check back soon.
                </p>
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 mb-1">While you wait</p>
                  <button
                    onClick={() => onNavigate('school-assist-chat' as AppPage)}
                    className="flex items-center justify-between px-5 py-3 border border-slate-200 rounded-lg hover:border-slate-400 transition-colors group text-left"
                  >
                    <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900">Ask School Assist for help</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </button>
                  <button
                    onClick={() => setStep('subject')}
                    className="flex items-center justify-between px-5 py-3 border border-slate-200 rounded-lg hover:border-slate-400 transition-colors group text-left"
                  >
                    <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900">Browse other subjects</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default withAuth(StudyLibraryPage);
