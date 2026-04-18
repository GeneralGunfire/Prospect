import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Play, CheckCircle2, Star, ArrowRight, Library, ChevronLeft, GraduationCap, Calendar, Calculator, Atom, FlaskConical, Briefcase, TrendingUp, Monitor, Pencil, Languages, type LucideIcon } from 'lucide-react';
import { subjects } from '../data/subjects';
import { getStudyProgress, markLessonComplete } from '../services/dashboardService';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import {
  grade10Term1MathTopics,
  grade10Term1PhysicalScienceTopics,
  grade10Term1LifeSciencesTopics,
  grade10Term1AccountingTopics,
  grade10Term1BusinessStudiesTopics,
  grade10Term1EconomicsTopics,
  grade10Term1CATTopics,
  grade10Term1EGDTopics,
  grade10Term1EnglishTopics,
} from '../data/studyLibrary';
import { TopicViewer } from '../components/StudyLibrary';

type Step = 'subject' | 'grade' | 'term' | 'content' | 'topic-viewer';

// Color-coded subject icons — approved semantic colors only, white card base preserved
interface SubjectIconConfig {
  Icon: LucideIcon;
  bg: string;
  iconColor: string;
  labelColor: string;
  accent: string;       // card-accent-* CSS class
}

const SUBJECT_ICON_CONFIG: Record<string, SubjectIconConfig> = {
  'maths':             { Icon: Calculator,  bg: 'bg-blue-50',    iconColor: 'text-blue-600',    labelColor: 'text-blue-500',   accent: 'card-accent-blue' },
  'phys-sci':          { Icon: Atom,        bg: 'bg-indigo-50',  iconColor: 'text-indigo-600',  labelColor: 'text-indigo-500', accent: 'card-accent-purple' },
  'life-sci':          { Icon: FlaskConical,bg: 'bg-emerald-50', iconColor: 'text-emerald-600', labelColor: 'text-emerald-500',accent: 'card-accent-green' },
  'accounting':        { Icon: Calculator,  bg: 'bg-amber-50',   iconColor: 'text-amber-600',   labelColor: 'text-amber-500',  accent: 'card-accent-amber' },
  'business-studies':  { Icon: Briefcase,   bg: 'bg-orange-50',  iconColor: 'text-orange-600',  labelColor: 'text-orange-500', accent: 'card-accent-orange' },
  'economics':         { Icon: TrendingUp,  bg: 'bg-teal-50',    iconColor: 'text-teal-600',    labelColor: 'text-teal-500',   accent: 'card-accent-teal' },
  'cat':               { Icon: Monitor,     bg: 'bg-sky-50',     iconColor: 'text-sky-600',     labelColor: 'text-sky-500',    accent: 'card-accent-cyan' },
  'egd':               { Icon: Pencil,      bg: 'bg-violet-50',  iconColor: 'text-violet-600',  labelColor: 'text-violet-500', accent: 'card-accent-purple' },
  'english-hl':        { Icon: Languages,   bg: 'bg-rose-50',    iconColor: 'text-rose-600',    labelColor: 'text-rose-500',   accent: 'card-accent-orange' },
  'default':           { Icon: BookOpen,    bg: 'bg-slate-100',  iconColor: 'text-slate-600',   labelColor: 'text-slate-400',  accent: 'card-accent-navy' },
};

// Mapping of subject IDs to topic arrays for Grade 10 Term 1
const subjectTopicsMap: Record<string, typeof grade10Term1MathTopics> = {
  'maths': grade10Term1MathTopics,
  'phys-sci': grade10Term1PhysicalScienceTopics,
  'life-sci': grade10Term1LifeSciencesTopics,
  'accounting': grade10Term1AccountingTopics,
  'business-studies': grade10Term1BusinessStudiesTopics,
  'economics': grade10Term1EconomicsTopics,
  'cat': grade10Term1CATTopics,
  'egd': grade10Term1EGDTopics,
  'english-hl': grade10Term1EnglishTopics,
};

// Subjects with content for Grade 10 Term 1
const subjectsWithContent = new Set(['maths', 'phys-sci', 'life-sci', 'accounting', 'business-studies', 'economics', 'cat', 'egd', 'english-hl']);

function StudyLibraryPage({ user, onNavigate }: AuthedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [step, setStep] = useState<Step>('subject');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<typeof grade10Term1MathTopics[0] | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  // Fetch completed lessons from Supabase on mount
  useEffect(() => {
    const loadCompletedLessons = async () => {
      setIsLoadingProgress(true);
      const progress = await getStudyProgress(user.id);
      const completedTopicIds = new Set(progress.map(p => p.topic_id));
      setCompletedLessons(completedTopicIds);
      setIsLoadingProgress(false);
    };

    loadCompletedLessons();
  }, [user.id]);

  // Helper function to mark a lesson as complete
  const handleCompleteLesson = async (topicId: string) => {
    await markLessonComplete(user.id, topicId);
    setCompletedLessons(prev => new Set([...prev, topicId]));
  };

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentSubjectName = subjects.find(s => s.id === selectedSubject)?.name;

  const goBack = () => {
    if (step === 'grade') setStep('subject');
    else if (step === 'term') setStep('grade');
    else if (step === 'content') setStep('term');
    else if (step === 'topic-viewer') {
      setSelectedTopic(null);
      setStep('content');
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader currentPage="library" user={user} onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 bg-[#1E3A5F]/8">
            <Library className="w-3.5 h-3.5 text-[#1E3A5F]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#1E3A5F]">Study Library</span>
          </div>
          <h1 className="text-h2 text-text-primary mb-3">
            Master Your Subjects
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-xl">
            High-quality CAPS-aligned study materials and practice questions for Grades 10–12.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'subject' && (
            <motion.div key="subject" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="max-w-xl mb-8 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search subjects…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-base pl-10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSubjects.map((subject) => {
                  const hasContent = subjectsWithContent.has(subject.id);
                  const cfg = SUBJECT_ICON_CONFIG[subject.id] ?? SUBJECT_ICON_CONFIG['default'];
                  return (
                    <div key={subject.id} className="relative group">
                      <button
                        onClick={() => {
                          if (hasContent) {
                            if (subject.id === 'maths') { onNavigate('demo-learning'); return; }
                            setSelectedSubject(subject.id);
                            setStep('grade');
                          }
                        }}
                        disabled={!hasContent}
                        className={`w-full bg-white border border-border rounded-xl shadow-sm transition-all duration-200 flex flex-col text-left overflow-hidden ${
                          hasContent
                            ? `hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${cfg.accent}`
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="p-5">
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-200 ${
                            hasContent ? `${cfg.bg} group-hover:scale-105` : 'bg-slate-100'
                          }`}>
                            <cfg.Icon className={`w-5 h-5 ${hasContent ? cfg.iconColor : 'text-slate-400'}`} />
                          </div>

                          <h3 className="text-sm font-semibold mb-0.5 leading-snug text-text-primary">{subject.name}</h3>
                          <p className={`text-xs mb-4 ${hasContent ? cfg.labelColor : 'text-text-tertiary'}`}>
                            {subject.category}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                              <Play className="w-3 h-3" />
                              {hasContent ? '12 Lessons' : 'Coming Soon'}
                            </div>
                            <ArrowRight className={`w-3.5 h-3.5 transition-all duration-200 ${
                              hasContent ? `text-text-tertiary group-hover:${cfg.iconColor} group-hover:translate-x-0.5` : 'text-text-tertiary opacity-30'
                            }`} />
                          </div>
                        </div>
                      </button>

                      {!hasContent && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-700">
                          Soon
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Featured */}
              <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-6">
                      <Star className="w-3 h-3 fill-current text-slate-300" />
                      <span className="text-xs font-bold uppercase tracking-widest">Featured Course</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 uppercase tracking-tight leading-tight">Mathematics Paper 1 Masterclass</h2>
                    <p className="text-white/60 text-sm leading-relaxed mb-8">Covers Algebra, Calculus, and Functions in detail.</p>
                    <button className="px-8 py-4 bg-slate-600 hover:bg-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2 text-white">
                      Enroll Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900">Recent Study Guides</h3>
                  {[
                    { title: 'English HL: Poetry Analysis', type: 'PDF Guide', date: '2 days ago' },
                    { title: "Physical Sciences: Newton's Laws", type: 'Video Lesson', date: '5 days ago' },
                    { title: 'Accounting: Financial Statements', type: 'Practice Quiz', date: '1 week ago' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-sm transition-all duration-200 group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50">
                          <CheckCircle2 className="w-5 h-5 text-slate-700" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-slate-600 transition-colors">{item.title}</h4>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.type} • {item.date}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'grade' && (
            <motion.div key="grade" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto">
              <button onClick={goBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity text-navy">
                <ChevronLeft className="w-4 h-4" /> Back to Subjects
              </button>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Step 1 of 2</p>
              <h2 className="text-2xl font-black mb-1 text-navy" style={{ letterSpacing: '-0.01em' }}>Select Your Grade</h2>
              <p className="text-xs font-bold uppercase tracking-widest mb-10 text-secondary">Subject: {currentSubjectName}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[10, 11, 12].map((grade) => (
                  <button key={grade} onClick={() => { setSelectedGrade(grade); setStep('term'); }}
                    className="group bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-slate-900 group-hover:bg-prospect-blue-accent transition-colors duration-200">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-1 text-navy group-hover:text-prospect-blue-accent transition-colors">Grade {grade}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">CAPS Curriculum</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'term' && (
            <motion.div key="term" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto">
              <button onClick={goBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity text-navy">
                <ChevronLeft className="w-4 h-4" /> Back to Grade Selection
              </button>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Step 2 of 2</p>
              <h2 className="text-2xl font-black mb-1 text-navy" style={{ letterSpacing: '-0.01em' }}>Select Term</h2>
              <p className="text-xs font-bold uppercase tracking-widest mb-10 text-secondary">
                {currentSubjectName} · Grade {selectedGrade}
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((term) => (
                  <button key={term} onClick={() => { setSelectedTerm(term); setStep('content'); }}
                    className="group bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-slate-900 group-hover:bg-prospect-blue-accent transition-colors duration-200">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-navy group-hover:text-prospect-blue-accent transition-colors">Term {term}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-400">Quarter {term}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'content' && (
            <motion.div key="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto">
              <button onClick={goBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity text-slate-900">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-2xl font-bold mb-2 text-slate-900">{currentSubjectName} — Grade {selectedGrade}, Term {selectedTerm}</h2>

              {/* Show topics for Grade 10 Term 1 */}
              {selectedGrade === 10 && selectedTerm === 1 && selectedSubject && subjectsWithContent.has(selectedSubject) ? (
                <div>
                  <p className="text-sm mb-8 text-slate-500">Select a topic to begin learning:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjectTopicsMap[selectedSubject as keyof typeof subjectTopicsMap]?.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          setSelectedTopic(topic);
                          setStep('topic-viewer');
                        }}
                        className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-5">
                          <BookOpen className="w-5 h-5 text-slate-700" />
                        </div>
                        <h3 className="text-sm font-bold mb-2 text-slate-900 group-hover:text-slate-600 transition-colors">{topic.title}</h3>
                        <p className="text-xs text-slate-500 mb-4 flex-1 leading-relaxed">{topic.description}</p>
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 group-hover:text-prospect-blue-accent transition-colors">Start Learning</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-prospect-blue-accent group-hover:translate-x-0.5 transition-all duration-200" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center">
                  <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-sm text-slate-500">Study materials for {currentSubjectName} Grade {selectedGrade} Term {selectedTerm} are coming soon.</p>
                </div>
              )}
            </motion.div>
          )}

          {step === 'topic-viewer' && selectedTopic && (
            <motion.div key="topic-viewer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-6xl mx-auto">
              <TopicViewer
                topic={selectedTopic}
                onBack={() => setStep('content')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default withAuth(StudyLibraryPage);
