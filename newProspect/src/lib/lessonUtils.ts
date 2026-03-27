import { LessonData } from '../types/lesson'

/**
 * Calculate quiz percentage from answers
 */
export function calculateQuizScore(correctCount: number, totalQuestions: number): number {
  return Math.round((correctCount / totalQuestions) * 100)
}

/**
 * Calculate test percentage from answers
 */
export function calculateTestScore(correctCount: number, totalQuestions: number): number {
  return Math.round((correctCount / totalQuestions) * 100)
}

/**
 * Check if quiz passing score is met (70% by default)
 */
export function isQuizPassed(score: number, passingScore: number = 70): boolean {
  return score >= passingScore
}

/**
 * Get learning objective summary for display
 */
export function getObjectiveSummary(lesson: LessonData): string {
  return lesson.learningObjectives.slice(0, 3).join(' • ')
}

/**
 * Format duration in seconds to human-readable string
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  return `${minutes}m`
}

/**
 * Convert topic name to URL-safe ID
 */
export function topicNameToId(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

/**
 * Shuffle array for randomizing quiz/test questions
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Get difficulty badge color
 */
export function getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'hard':
      return 'bg-red-100 text-red-800'
  }
}

/**
 * Check if answer is correct (for short-answer questions)
 */
export function isAnswerCorrect(userAnswer: string, correctAnswer: string, tolerance = 0.05): boolean {
  const normalized = userAnswer.trim().toLowerCase()
  const correctNormalized = correctAnswer.trim().toLowerCase()

  // Exact match
  if (normalized === correctNormalized) return true

  // Try to parse as numbers for numeric answers
  const userNum = parseFloat(normalized)
  const correctNum = parseFloat(correctNormalized)

  if (!isNaN(userNum) && !isNaN(correctNum)) {
    const difference = Math.abs(userNum - correctNum)
    const percentDifference = difference / Math.abs(correctNum)
    return percentDifference <= tolerance
  }

  return false
}

/**
 * Group questions by difficulty
 */
export function groupByDifficulty(questions: any[]) {
  return {
    easy: questions.filter(q => q.difficulty === 'easy'),
    medium: questions.filter(q => q.difficulty === 'medium'),
    hard: questions.filter(q => q.difficulty === 'hard'),
  }
}
