import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Play, CheckCircle2, Star, Clock, ArrowRight, Library, ChevronLeft, GraduationCap, Calendar } from 'lucide-react';
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

      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(30,41,59,0.05)' }}>
            <Library className="w-4 h-4" style={{ color: '#1e293b' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#1e293b' }}>Digital Study Library</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight" style={{ color: '#1e293b' }}>
            Master Your <span style={{ color: '#64748b' }}>Subjects</span>
          </h1>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: '#475569' }}>
            Access high-quality study materials and practice questions for all South African CAPS subjects.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'subject' && (
            <motion.div key="subject" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="max-w-2xl mx-auto mb-16 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search for a subject (e.g. Mathematics, History)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none shadow-sm focus:border-slate-400 transition-all"
                  style={{ color: '#1e293b' }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSubjects.map((subject) => {
                  const hasContent = subjectsWithContent.has(subject.id);
                  return (
                    <div key={subject.id} className="relative group">
                      <button
                        onClick={() => {
                          if (hasContent) {
                            setSelectedSubject(subject.id);
                            setStep('grade');
                          }
                        }}
                        disabled={!hasContent}
                        className={`w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-sm transition-all duration-300 flex flex-col text-left ${
                          hasContent
                            ? 'hover:shadow-xl hover:border-slate-300 cursor-pointer'
                            : 'opacity-70 cursor-not-allowed'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors" style={{
                          background: 'rgba(30,41,59,0.05)',
                          ...(hasContent && { '--group-hover': 'bg-slate-100' })
                        }}>
                          <BookOpen className="w-6 h-6 transition-colors" style={{ color: '#1e293b' }} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 transition-colors" style={{ color: '#1e293b' }}>{subject.name}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-6" style={{ color: '#64748b' }}>{subject.category} Subject</p>
                        <div className="mt-auto space-y-4">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(30,41,59,0.4)' }}>
                            <div className="flex items-center gap-2"><Play className="w-3 h-3" style={{ color: '#64748b' }} />12 Lessons</div>
                            <div className="flex items-center gap-2"><Clock className="w-3 h-3" style={{ color: '#64748b' }} />4.5 Hours</div>
                          </div>
                          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(30,41,59,0.4)' }}>
                              {hasContent ? 'Select Subject' : 'Coming Soon'}
                            </span>
                            <ArrowRight className="w-4 h-4 transition-transform" style={{ color: '#64748b' }} />
                          </div>
                        </div>
                      </button>

                      {!hasContent && (
                        <div
                          className="absolute top-4 right-4 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-900"
                          style={{ backgroundColor: '#F9A825' }}
                          title="This subject will be available soon!"
                        >
                          Coming Soon
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Featured */}
              <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="rounded-3xl p-10 text-white relative overflow-hidden" style={{ backgroundColor: '#1e293b' }}>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-6">
                      <Star className="w-3 h-3 fill-current" style={{ color: '#64748b' }} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Featured Course</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 uppercase tracking-tight leading-tight">Mathematics Paper 1 Masterclass</h2>
                    <p className="text-white/60 text-sm leading-relaxed mb-8">Covers Algebra, Calculus, and Functions in detail.</p>
                    <button className="px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2 text-white" style={{ backgroundColor: '#64748b' }}>
                      Enroll Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-bold uppercase tracking-tight" style={{ color: '#1e293b' }}>Recent Study Guides</h3>
                  {[
                    { title: 'English HL: Poetry Analysis', type: 'PDF Guide', date: '2 days ago' },
                    { title: "Physical Sciences: Newton's Laws", type: 'Video Lesson', date: '5 days ago' },
                    { title: 'Accounting: Financial Statements', type: 'Practice Quiz', date: '1 week ago' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 transition-all group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(30,41,59,0.05)' }}>
                          <CheckCircle2 className="w-5 h-5" style={{ color: '#1e293b' }} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold group-hover:text-slate-500 transition-colors" style={{ color: '#1e293b' }}>{item.title}</h4>
                          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>{item.type} • {item.date}</p>
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
            <motion.div key="grade" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto">
              <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity" style={{ color: '#1e293b' }}>
                <ChevronLeft className="w-4 h-4" /> Back to Subjects
              </button>
              <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight" style={{ color: '#1e293b' }}>Select Your Grade</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-12" style={{ color: '#64748b' }}>Subject: {currentSubjectName}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[10, 11, 12].map((grade) => (
                  <button key={grade} onClick={() => { setSelectedGrade(grade); setStep('term'); }}
                    className="group bg-white border border-slate-100 rounded-3xl p-10 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-100 transition-colors" style={{ background: 'rgba(30,41,59,0.05)' }}>
                      <GraduationCap className="w-8 h-8" style={{ color: '#1e293b' }} />
                    </div>
                    <h3 className="text-3xl font-bold mb-2 group-hover:text-slate-500 transition-colors" style={{ color: '#1e293b' }}>Grade {grade}</h3>
                    <p className="text-xs font-medium" style={{ color: '#475569' }}>CAPS Curriculum</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'term' && (
            <motion.div key="term" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto">
              <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity" style={{ color: '#1e293b' }}>
                <ChevronLeft className="w-4 h-4" /> Back to Grade Selection
              </button>
              <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight" style={{ color: '#1e293b' }}>Select Term</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-12" style={{ color: '#64748b' }}>
                {currentSubjectName} • Grade {selectedGrade}
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((term) => (
                  <button key={term} onClick={() => { setSelectedTerm(term); setStep('content'); }}
                    className="group bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col items-center text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-100 transition-colors" style={{ background: 'rgba(30,41,59,0.05)' }}>
                      <Calendar className="w-6 h-6" style={{ color: '#1e293b' }} />
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-slate-500 transition-colors" style={{ color: '#1e293b' }}>Term {term}</h3>
                    <p className="text-[10px] font-medium uppercase tracking-wider mt-1" style={{ color: '#475569' }}>Quarter {term}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'content' && (
            <motion.div key="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto">
              <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity" style={{ color: '#1e293b' }}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#1e293b' }}>{currentSubjectName} — Grade {selectedGrade}, Term {selectedTerm}</h2>

              {/* Show topics for Grade 10 Term 1 */}
              {selectedGrade === 10 && selectedTerm === 1 && selectedSubject && subjectsWithContent.has(selectedSubject) ? (
                <div>
                  <p className="text-sm mb-8" style={{ color: '#64748b' }}>Select a topic to begin learning:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subjectTopicsMap[selectedSubject as keyof typeof subjectTopicsMap]?.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          setSelectedTopic(topic);
                          setStep('topic-viewer');
                        }}
                        className="group bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col text-left"
                      >
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-100 transition-colors" style={{ background: 'rgba(30,41,59,0.05)' }}>
                          <BookOpen className="w-6 h-6 transition-colors" style={{ color: '#1e293b' }} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-slate-600 transition-colors" style={{ color: '#1e293b' }}>{topic.title}</h3>
                        <p className="text-xs font-medium mb-4 flex-1" style={{ color: '#475569' }}>{topic.description}</p>
                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(30,41,59,0.4)' }}>Start Learning</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: '#64748b' }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-16 text-center">
                  <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-sm" style={{ color: '#64748b' }}>Study materials for {currentSubjectName} Grade {selectedGrade} Term {selectedTerm} are coming soon.</p>
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
