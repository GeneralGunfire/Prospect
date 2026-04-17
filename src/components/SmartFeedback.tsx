import { CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react'
import type { TopicStatus } from '../data/demoLearningPath'

interface Props {
  topicTitle: string
  correct: number
  total: number
  hintsUsed: number
  status: TopicStatus
  onContinue: () => void
  onRetry: () => void
}

export function SmartFeedback({ topicTitle, correct, total, hintsUsed, status, onContinue, onRetry }: Props) {
  const pct = Math.round((correct / total) * 100)

  const summary = getSummary(topicTitle, correct, total, hintsUsed, status)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Results</p>
        <h3 className="text-xl font-bold text-slate-800">{topicTitle}</h3>
      </div>

      {/* Score bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-slate-700">Score</span>
          <span className="text-sm font-bold text-slate-800">{correct}/{total} ({pct}%)</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Narrative feedback */}
      <div className="space-y-2">
        {summary.map((line, i) => (
          <div key={i} className={`flex items-start gap-2 p-3 rounded-xl text-sm ${line.type === 'good' ? 'bg-green-50 text-green-800' : line.type === 'warn' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800'}`}>
            {line.type === 'good'
              ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              : line.type === 'warn'
              ? <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              : <XCircle size={16} className="shrink-0 mt-0.5" />}
            <span>{line.text}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex gap-3">
        {status !== 'mastered' && (
          <button
            onClick={onRetry}
            className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
          >
            Try Again
          </button>
        )}
        <button
          onClick={onContinue}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors"
        >
          {status === 'mastered' ? 'Next Topic' : 'Continue Anyway'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

type FeedbackLine = { type: 'good' | 'warn' | 'bad'; text: string }

function getSummary(title: string, correct: number, total: number, hintsUsed: number, status: TopicStatus): FeedbackLine[] {
  const lines: FeedbackLine[] = []
  const pct = (correct / total) * 100

  if (status === 'mastered') {
    lines.push({ type: 'good', text: `You've mastered ${title}! All answers correct without hints.` })
  } else if (status === 'needs-practice') {
    lines.push({ type: 'good', text: `You understand the basics of ${title}.` })
    lines.push({ type: 'warn', text: `You got ${total - correct} question${total - correct !== 1 ? 's' : ''} wrong — review those concepts before moving on.` })
  } else {
    lines.push({ type: 'bad', text: `${title} needs more work — you got ${correct}/${total} correct (${Math.round(pct)}%).` })
    lines.push({ type: 'warn', text: 'Recommended: re-read the concept block and try again.' })
  }

  if (hintsUsed > 0) {
    lines.push({ type: 'warn', text: `You used ${hintsUsed} hint${hintsUsed !== 1 ? 's' : ''}. Try without hints next time to confirm mastery.` })
  }

  return lines
}
