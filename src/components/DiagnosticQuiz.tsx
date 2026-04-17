import { useState } from 'react'
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react'
import type { DiagnosticQuestion } from '../data/demoLearningPath'
import { calculateDiagnosticLevel } from '../utils/trackingLogic'

interface Props {
  topicTitle: string
  questions: DiagnosticQuestion[]
  onComplete: (level: 'strong' | 'medium' | 'weak') => void
}

export function DiagnosticQuiz({ topicTitle, questions, onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(0)

  const q = questions[current]
  const isLast = current === questions.length - 1

  function handleSelect(idx: number) {
    if (revealed) return
    setSelected(idx)
    setRevealed(true)
    if (idx === q.correctIndex) setCorrect(c => c + 1)
  }

  function handleNext() {
    if (isLast) {
      onComplete(calculateDiagnosticLevel(correct, questions.length))
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Quick Diagnostic</p>
        <h3 className="text-lg font-bold text-slate-800">{topicTitle}</h3>
        <p className="text-sm text-slate-500">Question {current + 1} of {questions.length}</p>
        <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <p className="text-base font-medium text-slate-800 mb-4">{q.question}</p>

      <div className="space-y-2 mb-4">
        {q.options.map((opt, idx) => {
          let cls = 'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors'
          if (!revealed) {
            cls += selected === idx
              ? ' border-blue-400 bg-blue-50 text-blue-800'
              : ' border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
          } else if (idx === q.correctIndex) {
            cls += ' border-green-400 bg-green-50 text-green-800'
          } else if (idx === selected && selected !== q.correctIndex) {
            cls += ' border-red-300 bg-red-50 text-red-700'
          } else {
            cls += ' border-slate-200 text-slate-400'
          }
          return (
            <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
              <span className="mr-2 font-bold">{['A', 'B', 'C', 'D'][idx]}.</span>
              {opt}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className={`flex items-start gap-2 p-3 rounded-xl mb-4 text-sm ${selected === q.correctIndex ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'}`}>
          {selected === q.correctIndex
            ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            : <XCircle size={16} className="shrink-0 mt-0.5" />}
          <span>{q.explanation}</span>
        </div>
      )}

      {revealed && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors"
        >
          {isLast ? 'See Results' : 'Next Question'}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}
