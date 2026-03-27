export interface LessonStep {
  duration: number
  title: string
  visual: string
  narration: string
}

export interface AnimationData {
  title: string
  duration: number
  description: string
  steps: LessonStep[]
}

export interface ExplanationSection {
  heading: string
  content: string
  diagram?: string
}

export interface WorkedExampleStep {
  step: string
  result: string
  color?: string
}

export interface WorkedExample {
  level: 'basic' | 'intermediate' | 'advanced'
  question: string
  solution: WorkedExampleStep[]
  explanation: string
}

export interface PracticeQuestion {
  id: string
  question: string
  answer: string
  type: 'short-answer' | 'multiple-choice'
  options?: string[]
  hint: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface TestQuestion {
  id: string
  question: string
  type: 'short-answer' | 'multiple-choice'
  options?: string[]
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface LessonData {
  id: string
  subject: string
  subjectId: string
  grade: number
  term: number
  topic: string
  topicId: string
  duration: number
  learningObjectives: string[]
  animation: AnimationData
  explanation: {
    title: string
    sections: ExplanationSection[]
  }
  workedExamples: WorkedExample[]
  practiceQuestions: PracticeQuestion[]
  quiz: {
    passingScore: number
    questions: QuizQuestion[]
  }
  test: {
    questions: TestQuestion[]
  }
  misconceptions: {
    misconception: string
    correction: string
  }[]
  relatedTopics: string[]
  capsCodes: string[]
  estimatedTime: number
}

export interface StudyProgress {
  id: string
  user_id: string
  subject_id: string
  grade: number
  term: number
  topic_id: string
  quiz_score?: number
  test_score?: number
  completed_at?: string
  last_accessed: string
  created_at: string
  updated_at: string
}
