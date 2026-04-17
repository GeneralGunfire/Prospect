import { Clock, ChevronRight } from 'lucide-react'
import { algebraLearningPath } from '../data/demoLearningPath'
import { learningPathStorage } from '../services/storageService'
import { getStatusIcon, getStatusColor, getStatusLabel } from '../utils/trackingLogic'
import type { AppPage } from '../lib/withAuth'

interface Props {
  onNavigate: (page: AppPage) => void
}

export function AlgebraProgressCard({ onNavigate }: Props) {
  const pathProgress = learningPathStorage.getPathProgress('grade10-algebra')

  // Compute overall progress %
  const total = algebraLearningPath.topics.length
  const mastered = algebraLearningPath.topics.filter(t => {
    const p = pathProgress?.topicStatuses[t.id]
    return p?.status === 'mastered'
  }).length
  const pct = Math.round((mastered / total) * 100)

  // Last activity
  const lastActivity = pathProgress?.lastActivity
  const lastActivityLabel = lastActivity
    ? formatRelative(new Date(lastActivity))
    : null

  // Find current topic (first not mastered)
  const currentTopic = algebraLearningPath.topics.find(t => {
    const p = pathProgress?.topicStatuses[t.id]
    return !p || p.status !== 'mastered'
  })

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Algebra Learning Path</p>
          <p className="text-sm text-slate-500">Mathematics · Grade 10</p>
        </div>
        {lastActivityLabel && (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} />
            {lastActivityLabel}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-600">Progress</span>
          <span className="text-xs font-bold text-slate-800">{pct}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Topic list */}
      <div className="space-y-2 mb-4" data-topic-list>
        {algebraLearningPath.topics.map(topic => {
          const p = pathProgress?.topicStatuses[topic.id]
          const status = p?.status ?? 'not-started'
          return (
            <div key={topic.id} className="flex items-center gap-3 py-1" data-topic-card>
              <span className="text-base">{getStatusIcon(status)}</span>
              <span className="text-sm font-medium text-slate-700 flex-1">{topic.title}</span>
              <span className={`text-xs font-semibold ${getStatusColor(status)}`}>
                {getStatusLabel(status)}
              </span>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => onNavigate('demo-learning' as AppPage)}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors"
      >
        {currentTopic ? `Continue: ${currentTopic.title}` : 'Review Learning Path'}
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

function formatRelative(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffHours < 48) return 'Yesterday'
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
}
