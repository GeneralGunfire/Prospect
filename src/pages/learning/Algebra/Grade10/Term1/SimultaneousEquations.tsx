import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronLeft, ChevronRight, ArrowRight, Lightbulb, RotateCcw,
  Award, AlertCircle, Info, PenLine, Eraser, Trash2, Undo2, X, NotebookPen
} from 'lucide-react'
import AppHeader from '../../../../../components/AppHeader'
import { withAuth, type AuthedProps } from '../../../../../lib/withAuth'
import { supabase } from '../../../../../lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

type TopicStatus = 'not-started' | 'mastered' | 'needs-practice'
type ViewState = 'interactive-lesson' | 'guided-practice' | 'practice' | 'remediation' | 'feedback' | 'practice-more'

interface Question {
  id: string; question: string; math?: string; options: string[]; correctIndex: number; hint: string; explanation: string
}

// ── Data ──────────────────────────────────────────────────────────────────────

const TOPIC = {
  id: 'simultaneous',
  title: 'Simultaneous Equations',
  description: 'Solve two equations with two unknowns using the substitution method.',
  interactiveSteps: [
    {
      id: 'sim-1',
      title: 'Two Unknowns, Two Clues',
      content: 'When you have two mystery numbers, you need two equations to find both.',
      equations: ['x + y = 7', 'x − y = 1'],
      bubbleTexts: ['I have TWO mystery numbers (x and y) and TWO clues! I need to find both!'],
      colors: ['blue' as const]
    },
    {
      id: 'sim-2',
      title: 'The Substitution Method',
      content: 'Isolate one variable in the first equation, then substitute it into the second.',
      equations: ['From eq. 1:  y = 7 − x', 'Into eq. 2:  x − (7 − x) = 1', '→  2x − 7 = 1  →  x = 4'],
      bubbleTexts: [
        'First, isolate y from equation 1',
        'Then substitute into equation 2',
        'Solve for x, then find y'
      ],
      colors: ['blue' as const, 'green' as const, 'yellow' as const]
    },
    {
      id: 'sim-3',
      title: 'Both Answers Found!',
      content: 'We solved for x first, then substituted back to find y.',
      equations: ['x = 4', 'y = 3'],
      bubbleTexts: ['Check: 4 + 3 = 7 ✓   and   4 − 3 = 1 ✓'],
      colors: ['green' as const]
    }
  ],
  guidedItem: {
    problem: 'Solve: x + y = 10  and  x − y = 2',
    steps: [
      { id: 1, instruction: 'Isolate y in equation 1', math: 'y = 10 − x', explanation: 'Rearrange equation 1 to express y on its own.' },
      { id: 2, instruction: 'Substitute into equation 2', math: 'x − (10 − x) = 2', explanation: 'Replace y with (10 − x) in the second equation.' },
      { id: 3, instruction: 'Expand the brackets', math: 'x − 10 + x = 2', explanation: 'Distribute the negative sign across the brackets.' },
      { id: 4, instruction: 'Combine like terms', math: '2x − 10 = 2', explanation: 'Add the x terms on the left side.' },
      { id: 5, instruction: 'Solve for x', math: '2x = 12  →  x = 6', explanation: 'Add 10 to both sides, then divide by 2.' },
      { id: 6, instruction: 'Find y using x = 6', math: 'y = 10 − 6 = 4', explanation: 'Substitute x = 6 back into y = 10 − x.' }
    ]
  },
  initialQuestions: [
    { id: 'sq1', question: 'What is x?', math: '2x + y = 8  and  x + y = 5', options: ['1', '2', '3', '4'], correctIndex: 2, hint: 'From equation 2, y = 5 − x. Substitute into equation 1.', explanation: 'y = 5 − x → 2x + (5 − x) = 8 → x + 5 = 8 → x = 3.' },
    { id: 'sq2', question: 'What is y?', math: 'x + 2y = 7  and  x − y = 1', options: ['1', '2', '3', '4'], correctIndex: 1, hint: 'From equation 2, x = 1 + y. Substitute into equation 1.', explanation: 'x = 1 + y → (1 + y) + 2y = 7 → 1 + 3y = 7 → y = 2.' },
    { id: 'sq3', question: 'What is x?', math: '3x + y = 11  and  2x − y = 4', options: ['2', '3', '4', '5'], correctIndex: 1, hint: 'Try adding both equations together to eliminate y.', explanation: 'Adding the equations: 5x = 15 → x = 3. Then y = 11 − 9 = 2.' }
  ],
  remediationQuestions: [
    { id: 'sr1', question: 'What is x?', math: 'x + y = 6  and  x − y = 2', options: ['x = 4', 'x = 3', 'x = 2', 'x = 5'], correctIndex: 0, hint: 'Add both equations to eliminate y.', explanation: 'Adding: 2x = 8 → x = 4. Then y = 6 − 4 = 2.' },
    { id: 'sr2', question: 'What is x?', math: '2x + y = 9  and  x + y = 6', options: ['x = 1', 'x = 2', 'x = 3', 'x = 4'], correctIndex: 2, hint: 'Subtract equation 2 from equation 1.', explanation: 'Subtracting: x = 3. Then y = 6 − 3 = 3.' }
  ],
  hardQuestions: [
    { id: 'sh1', question: 'Solve for x:', math: '3x + 2y = 12  and  x − y = 4', options: ['x = 2', 'x = 4', 'x = 3', 'x = 5'], correctIndex: 1, hint: 'Isolate y in eq 2 (y = x − 4) and substitute.', explanation: '3x + 2(x − 4) = 12 → 3x + 2x − 8 = 12 → 5x = 20 → x = 4.' },
    { id: 'sh2', question: 'Solve for y:', math: '2x + 3y = 13  and  3x − y = 3', options: ['y = 1', 'y = 2', 'y = 3', 'y = 4'], correctIndex: 2, hint: 'Isolate y in eq 2 (y = 3x − 3) and substitute.', explanation: '2x + 3(3x − 3) = 13 → 2x + 9x − 9 = 13 → 11x = 22 → x = 2. Then y = 3(2) − 3 = 3.' },
    { id: 'sh3', question: 'Solve for x:', math: '4x + y = 14  and  3x + 2y = 13', options: ['x = 2', 'x = 3', 'x = 4', 'x = 1'], correctIndex: 1, hint: 'Isolate y in eq 1 (y = 14 − 4x) and substitute.', explanation: '3x + 2(14 − 4x) = 13 → 3x + 28 − 8x = 13 → −5x = −15 → x = 3.' }
  ]
}

// ── Sub-components ─────────────────────────────────────────────────────────────

const colorMap = {
  blue: 'bg-blue-50 border-blue-200 text-blue-900',
  green: 'bg-green-50 border-green-200 text-green-900',
  yellow: 'bg-amber-50 border-amber-200 text-amber-900'
}

const EquationBubble = ({ text, color, delay }: { text: string; color: 'blue' | 'green' | 'yellow'; delay: number }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay }}
    className={`rounded-2xl border-2 px-5 py-3 text-sm font-semibold ${colorMap[color]}`}>
    {text}
  </motion.div>
)

const InteractiveLesson = ({ onComplete }: { onComplete: () => void }) => {
  const [current, setCurrent] = useState(0)
  const step = TOPIC.interactiveSteps[current]
  const isLast = current === TOPIC.interactiveSteps.length - 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Slide {current + 1} of {TOPIC.interactiveSteps.length}</p>
        <div className="flex gap-1">{TOPIC.interactiveSteps.map((_, i) => <div key={i} className={`h-1 w-8 rounded-full transition-all ${i <= current ? 'bg-blue-600' : 'bg-slate-200'}`} />)}</div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
          className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm min-h-80 flex flex-col justify-center gap-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{step.title}</h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto">{step.content}</p>
          </div>
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl bg-slate-50 border border-slate-200 px-8 py-6 font-mono text-lg md:text-xl font-black text-slate-900 space-y-2">
              {step.equations.map((eq, i) => <div key={i} className="whitespace-nowrap">{eq}</div>)}
            </div>
            <div className="space-y-2">
              {step.bubbleTexts.map((bt, i) => (
                <EquationBubble key={i} text={bt} color={step.colors[i] ?? 'blue'} delay={i * 0.15} />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button onClick={() => isLast ? onComplete() : setCurrent(c => c + 1)}
        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]">
        {isLast ? 'Continue' : 'Next Tip'} <ArrowRight size={18} />
      </button>
    </div>
  )
}

const GuidedPracticeModule = ({ onComplete }: { onComplete: () => void }) => {
  const [stepIndex, setStepIndex] = useState(0)
  const { steps, problem } = TOPIC.guidedItem
  const isLast = stepIndex === steps.length - 1

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step-by-Step Guide</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Step {stepIndex + 1} of {steps.length}</p>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 text-center tracking-tight">{problem}</h2>
        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= stepIndex ? 'bg-blue-600' : 'bg-slate-100'}`} />)}
        </div>
        <div className="space-y-4 mb-8">
          {steps.slice(0, stepIndex + 1).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
              className={`flex gap-5 p-5 rounded-2xl border ${i === stepIndex ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${i === stepIndex ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>{i + 1}</div>
              <div className="min-w-0">
                <p className="text-base font-black text-slate-900">{s.instruction}</p>
                <p className="text-slate-500 text-sm mt-0.5 mb-3 leading-relaxed">{s.explanation}</p>
                <div className="overflow-x-auto -mx-1 px-1"><div className="inline-block whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-xl text-lg font-mono font-black text-blue-600 shadow-sm">{s.math}</div></div>
              </div>
            </motion.div>
          ))}
        </div>
        <button onClick={() => isLast ? onComplete() : setStepIndex(s => s + 1)}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]">
          {isLast ? 'Now You Try' : 'Show Next Step'} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ── Scratchpad ────────────────────────────────────────────────────────────────

const STORAGE_KEY_PREFIX = 'scratchpad_simultaneous_'

const ScratchpadModal = ({ question, math, storageKey, onClose }: { question: string; math?: string; storageKey: string; onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [history, setHistory] = useState<ImageData[]>([])
  const drawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getCtx = () => canvasRef.current?.getContext('2d') ?? null

  const saveSnapshot = useCallback(() => {
    const ctx = getCtx()
    const c = canvasRef.current
    if (!ctx || !c) return
    const snap = ctx.getImageData(0, 0, c.width, c.height)
    setHistory(h => [...h.slice(-29), snap])
    localStorage.setItem(storageKey, c.toDataURL())
  }, [storageKey])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const dpr = window.devicePixelRatio || 1
    const rect = c.getBoundingClientRect()
    c.width = rect.width * dpr
    c.height = rect.height * dpr
    const ctx = c.getContext('2d')!
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height)
      img.src = saved
    }
  }, [storageKey])

  const getPos = (e: React.PointerEvent) => {
    const c = canvasRef.current!
    const rect = c.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = true
    lastPos.current = getPos(e)
    const ctx = getCtx()!
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return
    const pos = getPos(e)
    const ctx = getCtx()!
    ctx.lineWidth = tool === 'pen' ? 3 : 24
    ctx.strokeStyle = tool === 'pen' ? '#1e293b' : '#f8fafc'
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    lastPos.current = pos
  }

  const onPointerUp = () => {
    if (!drawing.current) return
    drawing.current = false
    lastPos.current = null
    saveSnapshot()
  }

  const undo = () => {
    const c = canvasRef.current
    const ctx = getCtx()
    if (!ctx || !c) return
    setHistory(h => {
      const next = h.slice(0, -1)
      ctx.clearRect(0, 0, c.width, c.height)
      if (next.length > 0) ctx.putImageData(next[next.length - 1], 0, 0)
      localStorage.setItem(storageKey, c.toDataURL())
      return next
    })
  }

  const clearAll = () => {
    const c = canvasRef.current
    const ctx = getCtx()
    if (!ctx || !c) return
    ctx.clearRect(0, 0, c.width, c.height)
    setHistory([])
    localStorage.removeItem(storageKey)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: '90dvh' }}
        >
          <div className="px-5 pt-5 pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Working Space</p>
                <p className="text-sm font-black text-slate-900 leading-snug">{question}</p>
                {math && (
                  <div className="overflow-x-auto mt-1 -mx-1 px-1">
                    <span className="whitespace-nowrap font-mono text-sm font-black text-blue-700">{math}</span>
                  </div>
                )}
              </div>
              <button onClick={onClose} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-100 shrink-0 bg-slate-50/60">
            <button onClick={() => setTool('pen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${tool === 'pen' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
              <PenLine size={13} /> Pen
            </button>
            <button onClick={() => setTool('eraser')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${tool === 'eraser' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
              <Eraser size={13} /> Eraser
            </button>
            <div className="flex-1" />
            <button onClick={undo} disabled={history.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all">
              <Undo2 size={13} /> Undo
            </button>
            <button onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-rose-500 hover:bg-rose-50 transition-all">
              <Trash2 size={13} /> Clear
            </button>
          </div>
          <div className="relative flex-1 min-h-0 bg-slate-50" style={{ touchAction: 'none' }}>
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
              style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair', touchAction: 'none' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            />
            {history.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-xs text-slate-300 font-semibold select-none">Draw your working here…</p>
              </div>
            )}
          </div>
          <div className="px-5 py-3 border-t border-slate-100 shrink-0">
            <button onClick={onClose}
              className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98]">
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const PracticeModule = ({ questions, onComplete }: { questions: Question[]; onComplete: (res: { correct: number; total: number }) => void }) => {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [scratchpadOpen, setScratchpadOpen] = useState(false)

  const q = questions[current]
  const isLast = current === questions.length - 1

  const handleSelect = (i: number) => {
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    if (i === q.correctIndex) setCorrectCount(c => c + 1)
  }

  const handleNext = () => {
    if (isLast) onComplete({ correct: correctCount, total: questions.length })
    else { setCurrent(c => c + 1); setSelected(null); setRevealed(false); setHintVisible(false) }
  }

  const getOptionStyle = (i: number) => {
    if (!revealed) return selected === i ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50 cursor-pointer'
    if (i === q.correctIndex) return 'border-emerald-500 bg-emerald-50 text-emerald-900'
    if (i === selected) return 'border-rose-500 bg-rose-50 text-rose-900'
    return 'border-slate-100 bg-white text-slate-300'
  }

  return (
    <>
    {scratchpadOpen && <ScratchpadModal question={q.question} math={q.math} storageKey={`${STORAGE_KEY_PREFIX}${current}`} onClose={() => setScratchpadOpen(false)} />}
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question {current + 1} of {questions.length}</p>
          <div className="flex gap-1">{questions.map((_, i) => <div key={i} className={`w-8 h-1 rounded-full transition-all ${i <= current ? 'bg-blue-600' : 'bg-slate-100'}`} />)}</div>
        </div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="text-xl md:text-2xl font-black text-slate-900 leading-snug">{q.question}</p>
          <button onClick={() => setScratchpadOpen(true)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all">
            <NotebookPen size={13} /> Scratch
          </button>
        </div>
        {q.math && (
          <div className="overflow-x-auto mb-8 -mx-2 px-2">
            <div className="whitespace-nowrap inline-block bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 font-mono text-lg font-black text-blue-700 min-w-0">
              {q.math}
            </div>
          </div>
        )}
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <motion.button key={i} whileTap={{ scale: revealed ? 1 : 0.98 }} onClick={() => handleSelect(i)}
              className={`w-full text-left p-5 rounded-2xl border-2 text-base font-semibold transition-all ${getOptionStyle(i)}`}>
              <span className="mr-3 font-black opacity-40">{String.fromCharCode(65 + i)}</span>{opt}
            </motion.button>
          ))}
        </div>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-5 rounded-2xl flex gap-4 text-sm font-semibold ${selected === q.correctIndex ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
            <Info size={20} className="shrink-0 mt-0.5" /> {q.explanation}
          </motion.div>
        )}
        {hintVisible && !revealed && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="mt-5 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-amber-900">
            <Lightbulb size={20} className="shrink-0 text-amber-500 mt-0.5" />
            <p className="text-sm font-semibold">{q.hint}</p>
          </motion.div>
        )}
        <div className="mt-8 flex justify-between items-center">
          {!revealed
            ? <button onClick={() => setHintVisible(true)} className="text-xs font-black text-amber-600 uppercase tracking-widest px-4 py-3 hover:bg-amber-50 rounded-xl transition-all">{hintVisible ? 'Hint Visible' : 'Need a Hint?'}</button>
            : <div />}
          {revealed && (
            <button onClick={handleNext}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-[0.98]">
              {isLast ? 'See Results' : 'Next Question'} <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

const FeedbackModule = ({ correct, total, onRetry, onPracticeMore, onContinue, hidePracticeMore = false }: { correct: number; total: number; onRetry: () => void; onPracticeMore: () => void; onContinue: () => void; hidePracticeMore?: boolean }) => {
  const pct = Math.round((correct / total) * 100)
  const mastered = correct / total >= 2 / 3
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border border-slate-200 p-10 md:p-14 text-center space-y-8 shadow-sm">
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl ${mastered ? 'bg-emerald-500' : 'bg-slate-900'}`}>
        {mastered ? <Award size={40} /> : <RotateCcw size={40} />}
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${mastered ? 'text-emerald-600' : 'text-slate-400'}`}>{mastered ? '✦ Mastered' : 'Keep Practising'}</p>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Your Results</h2>
        <p className="text-sm text-slate-400 font-semibold mt-1">{TOPIC.title}</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-6xl font-black text-slate-900">{correct} <span className="text-slate-300 text-4xl">/</span> {total}</p>
        <div className="w-full max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 }}
            className={`h-full rounded-full ${mastered ? 'bg-emerald-500' : 'bg-blue-500'}`} />
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-2">
        <div className={`grid grid-cols-1 ${hidePracticeMore ? '' : 'sm:grid-cols-2'} gap-3`}>
          <button onClick={onRetry} className="w-full py-5 bg-slate-100 text-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">Try Again</button>
          {!hidePracticeMore && (
            <button onClick={onPracticeMore} className="w-full py-5 bg-blue-50 text-blue-700 border border-blue-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center justify-center gap-3">
              Practice More <NotebookPen size={18} />
            </button>
          )}
        </div>
        <button onClick={onContinue} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl">
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  )
}

// ── Supabase progress helpers (copy-paste to every topic file, change TOPIC_ID only) ──

const SUBJECT = 'Algebra'
const GRADE = 10
const TOPIC_ID = 'simultaneous-equations'

async function loadTopicProgress(userId: string): Promise<TopicStatus> {
  const { data } = await supabase
    .from('study_progress')
    .select('mastery_level')
    .eq('user_id', userId)
    .eq('subject', SUBJECT)
    .eq('grade', GRADE)
    .eq('topic', TOPIC_ID)
    .single()
  if (!data) return 'not-started'
  const m = data.mastery_level as string
  if (m === 'mastered') return 'mastered'
  if (m === 'needs_practice') return 'needs-practice'
  return 'not-started'
}

async function saveTopicProgress(userId: string, status: TopicStatus, correct: number, total: number, attempts: number) {
  const masteryLevel = status === 'mastered' ? 'mastered' : status === 'needs-practice' ? 'needs_practice' : 'not_started'
  await supabase.from('study_progress').upsert({
    user_id: userId,
    subject: SUBJECT,
    grade: GRADE,
    topic: TOPIC_ID,
    mastery_level: masteryLevel,
    last_attempt_score: `${correct}/${total}`,
    total_attempts: attempts,
    last_accessed: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,subject,grade,topic' })
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function SimultaneousEquationsPage({ user, onNavigate }: AuthedProps) {
  const [view, setView] = useState<ViewState>('interactive-lesson')
  const [previousView, setPreviousView] = useState<ViewState | null>(null)
  const [status, setStatus] = useState<TopicStatus>('not-started')
  const [practiceResult, setPracticeResult] = useState<{ correct: number; total: number } | null>(null)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (!user) return
    loadTopicProgress(user.id).then(s => setStatus(s))
  }, [user])

  const saveProgress = async (newStatus: TopicStatus, res: { correct: number; total: number }) => {
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    if (user) await saveTopicProgress(user.id, newStatus, res.correct, res.total, nextAttempts)
  }

  const handlePracticeComplete = async (res: { correct: number; total: number }) => {
    setPracticeResult(res)
    setPreviousView('practice')
    if (res.correct === 0) {
      setView('remediation')
    } else {
      const newStatus: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'
      setStatus(newStatus)
      await saveProgress(newStatus, res)
      setView('feedback')
    }
  }

  const handleRemediationComplete = async (res: { correct: number; total: number }) => {
    setPracticeResult(res)
    setPreviousView('remediation')
    const newStatus: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'
    setStatus(newStatus)
    await saveProgress(newStatus, res)
    setView('feedback')
  }

  const handlePracticeMoreComplete = async (res: { correct: number; total: number }) => {
    setPracticeResult(res)
    setPreviousView('practice-more')
    const newStatus: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'
    setStatus(newStatus)
    await saveProgress(newStatus, res)
    setView('feedback')
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100">
      <AppHeader currentPage="library" user={user} onNavigate={onNavigate} />
      <main className="pt-28 pb-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <button onClick={() => onNavigate('learning-algebra-g10-t1-linear-equations' as any)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
                <ChevronLeft size={18} /> Back
              </button>
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Algebra · Grade 10
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={view} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                {view === 'interactive-lesson' && <InteractiveLesson onComplete={() => setView('guided-practice')} />}
                {view === 'guided-practice' && <GuidedPracticeModule onComplete={() => setView('practice')} />}
                {view === 'practice' && <PracticeModule questions={TOPIC.initialQuestions} onComplete={handlePracticeComplete} />}
                {view === 'practice-more' && <PracticeModule questions={TOPIC.hardQuestions} onComplete={handlePracticeMoreComplete} />}
                {view === 'remediation' && (
                  <div className="space-y-6">
                    <div className="bg-rose-50 border border-rose-200 rounded-4xl p-8 flex gap-5 items-start">
                      <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={24} />
                      <div>
                        <p className="text-base font-black text-rose-900 uppercase tracking-tight mb-1">Let's Try Again</p>
                        <p className="text-rose-700 text-sm leading-relaxed">It's okay! Let's work through two extra questions to build your confidence.</p>
                      </div>
                    </div>
                    <PracticeModule questions={TOPIC.remediationQuestions} onComplete={handleRemediationComplete} />
                  </div>
                )}
                {view === 'feedback' && (
                  <FeedbackModule
                    correct={practiceResult?.correct ?? 0}
                    total={practiceResult?.total ?? (previousView === 'practice-more' ? TOPIC.hardQuestions.length : TOPIC.initialQuestions.length)}
                    onRetry={() => setView('interactive-lesson')}
                    onPracticeMore={() => setView('practice-more')}
                    onContinue={() => onNavigate('learning-algebra-g10-t1-linear-equations' as any)}
                    hidePracticeMore={previousView === 'practice-more'}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}

export default withAuth(SimultaneousEquationsPage)
