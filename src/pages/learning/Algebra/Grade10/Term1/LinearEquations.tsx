import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  ChevronLeft, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Lightbulb, 
  RotateCcw, 
  Layout,
  Clock,
  Check,
  Award,
  ArrowDown,
  AlertCircle,
  RefreshCw,
  XCircle,
  ChevronRight,
  MessageCircle,
  Info,
  Play
} from 'lucide-react'
import AppHeader from '../../../../../components/AppHeader'
import { withAuth, type AuthedProps } from '../../../../../lib/withAuth'

// ── Types ─────────────────────────────────────────────────────────────────────

type TopicStatus = 'not-started' | 'in-progress' | 'mastered' | 'needs-practice' | 'struggling'
type ViewState = 'overview' | 'interactive-lesson' | 'guided-practice' | 'practice' | 'remediation' | 'feedback'

interface Question {
  id: string; question: string; options: string[]; correctIndex: number; hint: string; explanation: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const LINEAR_EQUATIONS_PATH = {
  id: 'linear-equations',
  title: 'Linear Equations',
  topics: [
    {
      id: 'intro',
      title: 'Intro to Equations',
      interactiveSteps: [
        {
          id: 'step-1',
          title: 'Meet the Variable',
          content: 'In algebra, letters like "x" are just mystery boxes for numbers.',
          math: ['x'],
          bubbles: [{ target: 'x', text: "I'm the mystery number!", pos: 'top' }]
        },
        {
          id: 'step-2',
          title: 'The Equation',
          content: 'An equation is a statement that two sides are exactly equal.',
          math: ['x', '+', '5', '=', '12'],
          bubbles: [
            { target: 'x', text: 'Mystery number...', pos: 'top' },
            { target: '5', text: '...plus five...', pos: 'bottom' },
            { target: '12', text: '...is twelve!', pos: 'top' }
          ]
        }
      ],
      guidedItems: [
        {
          id: 'g1',
          problem: 'Solve: x + 8 = 20',
          steps: [
            { id: 1, instruction: 'Identify the +8', math: 'x + 8 = 20', explanation: 'The 8 is being added to x.' },
            { id: 2, instruction: 'Subtract 8 from both sides', math: 'x + 8 - 8 = 20 - 8', explanation: 'Whatever we do to the left, we must do to the right.' },
            { id: 3, instruction: 'Simplify to find x', math: 'x = 12', explanation: '12 is the final answer because 12 + 8 = 20.' }
          ]
        }
      ],
      initialQuestions: [
        { id: 'q1', question: 'In x + 4 = 10, what is the first step?', options: ['Add 4', 'Subtract 4', 'Multiply by 4', 'Divide by 4'], correctIndex: 1, hint: 'Opposite of +4.', explanation: 'Subtract 4 from both sides.' },
        { id: 'q2', question: 'If x - 2 = 8, then x is:', options: ['6', '8', '10', '2'], correctIndex: 2, hint: 'Opposite of -2.', explanation: '8 + 2 = 10.' }
      ],
      remediationQuestions: [
        { id: 'r1', question: 'Solve: x + 3 = 11', options: ['x = 8', 'x = 14', 'x = 3', 'x = 11'], correctIndex: 0, hint: 'Subtract 3 from 11.', explanation: '11 - 3 = 8.' },
        { id: 'r2', question: 'Solve: x - 4 = 4', options: ['x = 0', 'x = 8', 'x = 4', 'x = 16'], correctIndex: 1, hint: 'Add 4 to 4.', explanation: '4 + 4 = 8.' }
      ]
    }
  ]
}

// ── Components ─────────────────────────────────────────────────────────────

const SpeechBubble = ({ text, pos }: { text: string, pos: 'top' | 'bottom' }) => (
  <motion.div 
    initial={{ scale: 0, opacity: 0, y: pos === 'top' ? 10 : -10 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    className={`absolute ${pos === 'top' ? '-top-12' : '-bottom-12'} left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg z-20`}
  >
    {text}
    <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45 ${pos === 'top' ? '-bottom-1' : '-top-1'}`} />
  </motion.div>
)

const InteractiveLesson = ({ steps, onComplete }: { steps: any[], onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Explanation Step {currentStep + 1} of {steps.length}</p>
        <div className="flex gap-1">{steps.map((_, i) => (<div key={i} className={`w-8 h-1 rounded-full ${i <= currentStep ? 'bg-blue-600' : 'bg-slate-200'}`} />))}</div>
      </div>
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-sm min-h-[400px] flex flex-col justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{step.title}</h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto">{step.content}</p>
            <div className="flex items-center justify-center gap-6 py-16 relative">
              {step.math.map((char: string, i: number) => {
                const bubble = step.bubbles.find((b: any) => b.target === char);
                return (
                  <motion.div key={i} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }} className="relative text-5xl font-mono font-black text-slate-900">
                    {char}{bubble && <SpeechBubble text={bubble.text} pos={bubble.pos} />}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <button onClick={() => isLast ? onComplete() : setCurrentStep(s => s + 1)} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95">{isLast ? 'Continue' : 'Next Tip'} <ArrowRight size={20} /></button>
    </div>
  )
}

const GuidedPracticeModule = ({ item, onComplete }: { item: any, onComplete: () => void }) => {
  const [stepIndex, setStepIndex] = useState(0)
  const isLast = stepIndex === item.steps.length - 1

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Step-by-Step Guide</p>
        <h2 className="text-4xl font-black text-slate-900 mb-10 text-center tracking-tight">{item.problem}</h2>
        <div className="space-y-6 mb-12">
          {item.steps.slice(0, stepIndex + 1).map((s: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black ${i === stepIndex ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-200 text-slate-400'}`}>{i + 1}</div>
              <div>
                <p className="text-lg font-black text-slate-900">{s.instruction}</p>
                <p className="text-slate-500 mt-1 mb-4 leading-relaxed">{s.explanation}</p>
                <div className="inline-block px-5 py-2 bg-white border border-slate-200 rounded-xl text-2xl font-mono font-black text-blue-600 shadow-sm">{s.math}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <button onClick={() => isLast ? onComplete() : setStepIndex(s => s + 1)} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95">{isLast ? 'Now You Try' : 'Show Next Step'} <ArrowRight size={20} /></button>
      </div>
    </div>
  )
}

const PracticeModule = ({ questions, onComplete }: { questions: Question[], onComplete: (res: any) => void }) => {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [hintsVisible, setHintsVisible] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const q = questions[current]
  const isLast = current === questions.length - 1

  const handleNext = () => isLast ? onComplete({ correct: correctCount, total: questions.length, hints: 0 }) : (setCurrent(c => c + 1), setSelected(null), setRevealed(false), setHintsVisible(false))

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question {current + 1} of {questions.length}</p>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
        </div>
        <p className="text-2xl font-bold text-slate-900 mb-8 leading-tight">{q.question}</p>
        <div className="space-y-4">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => !revealed && (setSelected(i), setRevealed(true), i === q.correctIndex && setCorrectCount(c => c + 1))} className={`w-full text-left p-6 rounded-2xl border-2 text-lg font-bold transition-all ${!revealed ? (selected === i ? 'border-blue-500 bg-blue-50' : 'border-slate-50 hover:border-slate-100') : (i === q.correctIndex ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : (i === selected ? 'border-rose-500 bg-rose-50 text-rose-800' : 'border-slate-50 text-slate-300'))}`}>
              <span className="mr-4 opacity-30">{String.fromCharCode(65 + i)}</span>{opt}
            </button>
          ))}
        </div>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-8 p-6 rounded-2xl flex gap-4 text-base font-medium ${selected === q.correctIndex ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
            <Info size={24} className="shrink-0" /> {q.explanation}
          </motion.div>
        )}
        {hintsVisible && !revealed && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4 text-amber-900">
             <Lightbulb size={24} className="shrink-0 text-amber-500" />
             <p className="text-lg font-bold">{q.hint}</p>
          </motion.div>
        )}
        <div className="mt-10 flex justify-between items-center">
          <button onClick={() => !revealed && setHintsVisible(true)} className="text-xs font-black text-amber-600 uppercase tracking-widest px-6 py-3 hover:bg-amber-50 rounded-xl transition-all">{revealed ? '' : (hintsVisible ? 'Hint Visible' : 'Need a Hint?')}</button>
          {revealed && <button onClick={handleNext} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-95">{isLast ? 'See Results' : 'Next Question'} <ArrowRight size={20} /></button>}
        </div>
      </div>
    </div>
  )
}

const FeedbackModule = ({ title, correct, total, onRetry, onContinue }: any) => {
  const pct = Math.round((correct / total) * 100)
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-16 text-center space-y-10 shadow-sm animate-fade-up">
      <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-2xl">{pct >= 80 ? <Award size={48} /> : <RotateCcw size={48} />}</div>
      <div><h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Your Results</h2><p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">{title}</p></div>
      <div className="flex flex-col items-center gap-4">
        <p className="text-6xl font-black text-slate-900">{correct} / {total}</p>
        <div className="w-full max-w-md h-3 bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className={`h-full ${pct >= 80 ? 'bg-emerald-500' : 'bg-blue-600'}`} /></div>
      </div>
      <div className="flex flex-col gap-4 pt-4">
        <button onClick={onRetry} className="w-full py-6 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3">Try Again</button>
        <button onClick={onContinue} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-2xl">Continue Anyway <ArrowRight size={20} /></button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function LinearEquationsPage({ user, onNavigate }: AuthedProps) {
  const [view, setView] = useState<ViewState>('overview')
  const [status, setStatus] = useState<TopicStatus>('not-started')
  const [practiceResult, setPracticeResult] = useState<{correct: number, total: number, hints: number} | null>(null)

  const topic = LINEAR_EQUATIONS_PATH.topics[0]

  const handlePracticeComplete = (res: any) => {
    setPracticeResult(res)
    if (res.correct === 0 && res.total === 2) setView('remediation')
    else { setView('feedback'); setStatus(res.correct / res.total >= 1 ? 'mastered' : 'needs-practice') }
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100">
      <AppHeader currentPage="library" user={user} onNavigate={onNavigate} />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {view === 'overview' ? (
            <div className="space-y-12 animate-fade-up">
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">Topics List</h3>
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 flex items-center justify-between group cursor-pointer hover:border-slate-300 hover:shadow-2xl transition-all" onClick={() => setView('interactive-lesson')}>
                  <div className="flex items-center gap-8">
                    <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-3xl font-black ${status === 'mastered' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20'}`}>{status === 'mastered' ? '✓' : '1'}</div>
                    <div className="text-left"><p className="text-2xl font-black text-slate-900 tracking-tight">{topic.title}</p><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Status: {status === 'mastered' ? 'Mastered' : 'Not Started'}</p></div>
                  </div>
                  <ChevronRight size={32} className="text-slate-200 group-hover:text-slate-900 transition-colors" />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <button onClick={() => setView('overview')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"><ChevronLeft size={20} /> Back</button>
                <div className="px-5 py-2 bg-white border border-slate-200 rounded-full text-xs font-black text-slate-500 uppercase tracking-widest">Algebra · Grade 10</div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={view} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  {view === 'interactive-lesson' && <InteractiveLesson steps={topic.interactiveSteps} onComplete={() => setView('guided-practice')} />}
                  {view === 'guided-practice' && <GuidedPracticeModule item={topic.guidedItems[0]} onComplete={() => setView('practice')} />}
                  {view === 'practice' && <PracticeModule questions={topic.initialQuestions} onComplete={handlePracticeComplete} />}
                  {view === 'remediation' && (
                    <div className="space-y-8">
                      <div className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-10 flex gap-6 items-start"><AlertCircle className="text-rose-500 shrink-0 mt-1" size={32} /><div><p className="text-lg font-black text-rose-900 uppercase tracking-tight mb-2">Let's Try Again</p><p className="text-rose-700 leading-relaxed text-lg">It's okay! Algebra can be tricky. Let's work through these two extra examples together to build your confidence.</p></div></div>
                      <PracticeModule questions={topic.remediationQuestions} onComplete={handlePracticeComplete} />
                    </div>
                  )}
                  {view === 'feedback' && <FeedbackModule title={topic.title} correct={practiceResult?.correct || 0} total={practiceResult?.total || 2} onRetry={() => setView('interactive-lesson')} onContinue={() => setView('overview')} />}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default withAuth(LinearEquationsPage);
