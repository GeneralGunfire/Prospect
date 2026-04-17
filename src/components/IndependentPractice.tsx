import { useState } from 'react'
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import type { IndependentQuestion } from '../data/demoLearningPath'
import { calculateTopicStatus } from '../utils/trackingLogic'
import type { TopicStatus } from '../data/demoLearningPath'

interface Props {
  questions: IndependentQuestion[]
  onComplete: (result: { correct: number; total: number; hintsUsed: number; status: TopicStatus }) => void
}

export function IndependentPractice({ questions, onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [hintsVisible, setHintsVisible] = useState(false)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [totalHints, setTotalHints] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)

  const q = questions[current]
  const isLast = current === questions.length - 1

  function handleSelect(idx: number) {
    if (revealed) return
    setSelected(idx)
    setRevealed(true)
    setTotalAttempts(a => a + 1)
    if (idx === q.correctIndex) {
      setCorrect(c => c + 1)
    } else {
      const newWrong = wrongAttempts + 1
      setWrongAttempts(newWrong)
      // Auto-show hint after 3 wrong attempts
      if (newWrong >= 3 && !hintsVisible) {
        setHintsVisible(true)
        setTotalHints(h => h + 1)
      }
    }
  }

  function handleShowHint() {
    setHintsVisible(true)
    setTotalHints(h => h + 1)
  }

  function handleNext() {
    if (isLast) {
      const finalCorrect = correct + (selected === q.correctIndex ? 0 : 0) // already counted
      const status = calculateTopicStatus({
        attempts: questions.length,
        correctAnswers: correct,
        hintsUsed: totalHints,
      })
      onComplete({ correct, total: questions.length, hintsUsed: totalHints, status })
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
      setHintsVisible(false)
      setWrongAttempts(0)
    }
  }

  const progress = ((current + 1) / questions.length) * 100

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600">Independent Practice</p>
          <p className="text-xs text-slate-500">{current + 1} / {questions.length}</p>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <p className="font-semibold text-slate-800 mb-4" data-independent-question>{q.question}</p>

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
              <button key={idx} className={cls} onClick={() => handleSelect(idx)} data-answer={idx}>
                <span className="mr-2 font-bold">{['A', 'B', 'C', 'D'][idx]}.</span>
                {opt}
              </button>
            )
          })}
        </div>

        {/* Hint */}
        {!revealed && (
          <button
            onClick={handleShowHint}
            className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold hover:text-amber-700 mb-3"
          >
            <Lightbulb size={14} />
            {hintsVisible ? 'Hint shown' : 'Show hint'}
          </button>
        )}
        {hintsVisible && !revealed && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 mb-3">
            <Lightbulb size={14} className="shrink-0 mt-0.5" />
            {q.hint}
          </div>
        )}

        {/* Explanation after answer */}
        {revealed && (
          <div className={`flex items-start gap-2 p-3 rounded-xl mb-4 text-sm ${selected === q.correctIndex ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {selected === q.correctIndex
              ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              : <XCircle size={16} className="shrink-0 mt-0.5" />}
            <span>{q.explanation}</span>
          </div>
        )}

        {revealed && (
          <button
            onClick={handleNext}
            className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors"
          >
            {isLast ? 'See My Results' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  )
}
