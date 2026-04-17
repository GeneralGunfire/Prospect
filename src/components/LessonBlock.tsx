import { BookOpen } from 'lucide-react'
import type { ConceptBlock } from '../data/demoLearningPath'

interface Props {
  conceptBlock: ConceptBlock
  onContinue: () => void
}

export function LessonBlock({ conceptBlock, onContinue }: Props) {
  return (
    <div className="space-y-5">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={18} className="text-blue-600" />
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Concept Block</p>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{conceptBlock.title}</h3>
        <p className="text-sm text-slate-700 leading-relaxed">{conceptBlock.explanation}</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Worked Example</p>
        <p className="font-semibold text-slate-800 mb-4">{conceptBlock.workedExample.problem}</p>
        <div className="space-y-3">
          {conceptBlock.workedExample.steps.map(step => (
            <div key={step.step} className="flex gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
                {step.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{step.instruction}</p>
                <p className="text-sm text-slate-500">{step.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors"
      >
        Start Guided Practice →
      </button>
    </div>
  )
}
