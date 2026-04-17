import type { TopicStatus } from '../data/demoLearningPath'

interface TopicData {
  attempts: number
  correctAnswers: number
  hintsUsed: number
}

export function calculateTopicStatus(data: TopicData): TopicStatus {
  if (data.attempts === 0) return 'not-started'
  const accuracy = data.correctAnswers / data.attempts
  if (accuracy > 0.8 && data.hintsUsed === 0) return 'mastered'
  if (accuracy > 0.5) return 'needs-practice'
  return 'struggling'
}

export function calculateDiagnosticLevel(
  correct: number,
  total: number
): 'strong' | 'medium' | 'weak' {
  const pct = (correct / total) * 100
  if (pct >= 70) return 'strong'
  if (pct >= 40) return 'medium'
  return 'weak'
}

export function getStatusLabel(status: TopicStatus): string {
  switch (status) {
    case 'mastered':       return 'Mastered'
    case 'needs-practice': return 'Needs Practice'
    case 'struggling':     return 'Struggling'
    case 'in-progress':    return 'In Progress'
    default:               return 'Not Started'
  }
}

export function getStatusIcon(status: TopicStatus): string {
  switch (status) {
    case 'mastered':       return '✅'
    case 'needs-practice': return '⚠️'
    case 'struggling':     return '❌'
    case 'in-progress':    return '📖'
    default:               return '🔒'
  }
}

export function getStatusColor(status: TopicStatus): string {
  switch (status) {
    case 'mastered':       return 'text-green-600'
    case 'needs-practice': return 'text-amber-600'
    case 'struggling':     return 'text-red-500'
    case 'in-progress':    return 'text-blue-600'
    default:               return 'text-slate-400'
  }
}
