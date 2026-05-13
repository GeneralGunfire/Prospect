import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, ArrowRight, ChevronLeft, Calculator, Atom, FlaskConical, Briefcase, TrendingUp, Monitor, Pencil, Languages, Play, type LucideIcon } from 'lucide-react';
import { subjects } from '../../data/subjects';
import { withAuth, type AuthedProps, type AppPage } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';

type Step = 'subject' | 'grade' | 'term' | 'content';

// Color-coded subject icons — approved semantic colors only, white card base preserved
interface SubjectIconConfig {
  Icon: LucideIcon;
  bg: string;
  iconColor: string;
  labelColor: string;
}

const SUBJECT_ICON_CONFIG: Record<string, SubjectIconConfig> = {
  'algebra':           { Icon: Calculator,  bg: 'bg-blue-100',    iconColor: 'text-blue-700',    labelColor: 'text-blue-500' },
  'geometry':          { Icon: Calculator,  bg: 'bg-blue-100',    iconColor: 'text-blue-700',    labelColor: 'text-blue-500' },
  'phys-sci':          { Icon: Atom,        bg: 'bg-blue-100',  iconColor: 'text-blue-700',  labelColor: 'text-blue-500' },
  'life-sci':          { Icon: FlaskConical,bg: 'bg-blue-100', iconColor: 'text-blue-700', labelColor: 'text-blue-500' },
  'accounting':        { Icon: Calculator,  bg: 'bg-amber-100',   iconColor: 'text-amber-700',   labelColor: 'text-amber-500' },
  'business-studies':  { Icon: Briefcase,   bg: 'bg-slate-100',  iconColor: 'text-slate-700',  labelColor: 'text-slate-500' },
  'economics':         { Icon: TrendingUp,  bg: 'bg-slate-100',    iconColor: 'text-slate-600',    labelColor: 'text-slate-500' },
  'cat':               { Icon: Monitor,     bg: 'bg-blue-100',    iconColor: 'text-blue-700',    labelColor: 'text-blue-500' },
  'egd':               { Icon: Pencil,      bg: 'bg-blue-100',  iconColor: 'text-blue-700',  labelColor: 'text-blue-500' },
  'english-hl':        { Icon: Languages,   bg: 'bg-red-100',    iconColor: 'text-red-700',    labelColor: 'text-red-500' },
  'default':           { Icon: BookOpen,    bg: 'bg-slate-100',   iconColor: 'text-slate-600',   labelColor: 'text-slate-400' },
};

// Subjects with active modules
const subjectsWithContent = new Set(['algebra', 'geometry', 'phys-sci', 'accounting']);

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

  const goBack = () => {
    if (step === 'grade') setStep('subject');
    else if (step === 'term') setStep('grade');
    else if (step === 'content') setStep('term');
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="library" user={user} onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
        <div className="mb-10 pt-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Study Library</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900" style={{ letterSpacing: '-0.025em' }}>Library</h1>
        </div>

        <AnimatePresence mode="wait">
          {step === 'subject' && (
            <motion.div key="subject" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="max-w-2xl mx-auto mb-16 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for a subject (e.g. Mathematics, History)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 min-h-11 text-base text-slate-900 outline-none focus:border-slate-400 transition-colors"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSubjects.map((subject) => {
                  const hasContent = subjectsWithContent.has(subject.id);
                  const iconConfig = SUBJECT_ICON_CONFIG[subject.id] ?? SUBJECT_ICON_CONFIG['default'];
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
                        className={`w-full bg-white border border-slate-200 rounded-xl p-5 transition-colors duration-150 flex flex-col text-left min-h-11 ${
                          hasContent
                            ? 'hover:border-slate-300 cursor-pointer'
                            : 'opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-4 ${
                          hasContent ? iconConfig.bg : 'bg-slate-100'
                        }`}>
                          <iconConfig.Icon className={`w-5 h-5 ${hasContent ? iconConfig.iconColor : 'text-slate-400'}`} />
                        </div>

                        <h3 className="text-sm font-bold mb-1 leading-snug text-slate-900">{subject.name}</h3>
                        <p className={`text-xs font-bold uppercase tracking-widest mb-5 ${hasContent ? iconConfig.labelColor : 'text-slate-400'}`}>
                          {subject.category}
                        </p>

                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <Play className="w-3 h-3" />
                            {hasContent ? 'Lessons Available' : 'Coming Soon'}
                          </div>
                          <ArrowRight className={`w-3.5 h-3.5 transition-all duration-200 ${
                            hasContent ? `text-slate-300 group-hover:${iconConfig.iconColor} group-hover:translate-x-0.5` : 'text-slate-200'
                          }`} />
                        </div>
                      </button>
                      {!hasContent && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-xs font-black uppercase tracking-widest bg-amber-100 text-amber-800">
                          Soon
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 'grade' && (
            <motion.div key="grade" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto">
              <button onClick={goBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity text-slate-900">
                <ChevronLeft className="w-4 h-4" /> Back to Subjects
              </button>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Step 1 of 2</p>
              <h2 className="text-2xl font-black mb-1 text-slate-900" style={{ letterSpacing: '-0.01em' }}>Select Your Grade</h2>
              <p className="text-xs font-bold uppercase tracking-widest mb-10 text-slate-500">Subject: {currentSubjectName}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[10, 11, 12].map((grade) => (
                  <button key={grade} onClick={() => { setSelectedGrade(grade); setStep('term'); }}
                    className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-900 transition-colors text-left"
                  >
                    <h3 className="text-2xl font-black text-slate-900" style={{ letterSpacing: '-0.02em' }}>Grade {grade}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mt-1">CAPS Curriculum</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'term' && (
            <motion.div key="term" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto">
              <button onClick={goBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity text-slate-900">
                <ChevronLeft className="w-4 h-4" /> Back to Grade Selection
              </button>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Step 2 of 2</p>
              <h2 className="text-2xl font-black mb-1 text-slate-900" style={{ letterSpacing: '-0.01em' }}>Select Term</h2>
              <p className="text-xs font-bold uppercase tracking-widest mb-10 text-slate-500">
                {currentSubjectName} · Grade {selectedGrade}
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((term) => (
                  <button key={term} onClick={() => {
                    if (selectedSubject === 'algebra' && selectedGrade === 10 && term === 1) {
                      onNavigate('learning-algebra-g10-t1-linear-equations' as AppPage);
                    } else {
                      setSelectedTerm(term);
                      setStep('content');
                    }
                  }}
                    className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-900 transition-colors text-left"
                  >
                    <h3 className="text-lg font-black text-slate-900" style={{ letterSpacing: '-0.01em' }}>Term {term}</h3>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'content' && (
            <motion.div key="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto text-center">
               <button onClick={goBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity text-slate-900">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="bg-white border border-dashed border-slate-200 rounded-xl p-10 sm:p-20 text-center">
                <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-8" />
                <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">Coming Soon</h2>
                <p className="text-slate-500 max-w-md mx-auto">Study materials for {currentSubjectName} Grade {selectedGrade} Term {selectedTerm} are currently being developed.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default withAuth(StudyLibraryPage);
