import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { GuidedPracticeItem } from '../data/demoLearningPath'

interface Props {
  items: GuidedPracticeItem[]
  onComplete: () => void
}

export function GuidedPractice({ items, onComplete }: Props) {
  const [itemIndex, setItemIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [done, setDone] = useState(false)

  const item = items[itemIndex]
  const step = item.steps[stepIndex]
  const isLastStep = stepIndex === item.steps.length - 1
  const isLastItem = itemIndex === items.length - 1

  function handleNext() {
    if (!isLastStep) {
      setStepIndex(s => s + 1)
    } else if (!isLastItem) {
      setItemIndex(i => i + 1)
      setStepIndex(0)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <CheckCircle2 size={32} className="text-green-600 mx-auto mb-3" />
        <p className="font-bold text-green-800 mb-1">Guided Practice Complete!</p>
        <p className="text-sm text-green-700 mb-4">You followed all the steps. Now try on your own.</p>
        <button
          onClick={onComplete}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors"
        >
          Start Independent Practice →
        </button>
      </div>
    )
  }

  const progress = ((itemIndex * item.steps.length + stepIndex + 1) /
    items.reduce((sum, i) => sum + i.steps.length, 0)) * 100

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1">Guided Practice</p>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <p className="text-sm font-semibold text-slate-500 mb-2">Problem:</p>
        <p className="font-bold text-slate-800 mb-5">{item.problem}</p>

        <div className="space-y-3 mb-5">
          {item.steps.slice(0, stepIndex + 1).map((s, i) => (
            <div key={i} className={`flex gap-3 ${i < stepIndex ? 'opacity-60' : ''}`}>
              <div className={`shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${i < stepIndex ? 'bg-green-500 text-white' : 'bg-slate-800 text-white'}`}>
                {i < stepIndex ? '✓' : s.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{s.instruction}</p>
                {i <= stepIndex && <p className="text-sm text-slate-500">{s.explanation}</p>}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors"
        >
          {isLastStep && isLastItem ? 'Finish Guided Practice' : 'Show Next Step →'}
        </button>
      </div>
    </div>
  )
}
