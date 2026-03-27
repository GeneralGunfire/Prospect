import { useState, useCallback } from 'react'
import { LessonData } from '../types/lesson'

export type LessonTab = 'learn' | 'practice' | 'quiz' | 'test'

interface UseLessonState {
  activeTab: LessonTab
  currentAnimationStep: number
  currentExampleIndex: number
  currentPracticeIndex: number
  currentQuizIndex: number
  currentTestIndex: number
  quizScore: number
  testScore: number
  quizAnswers: Record<string, number>
  testAnswers: Record<string, string>
  quizPassed: boolean
  testSubmitted: boolean
  isAnimationPlaying: boolean
}

export function useLesson(lesson: LessonData) {
  const [state, setState] = useState<UseLessonState>({
    activeTab: 'learn',
    currentAnimationStep: 0,
    currentExampleIndex: 0,
    currentPracticeIndex: 0,
    currentQuizIndex: 0,
    currentTestIndex: 0,
    quizScore: 0,
    testScore: 0,
    quizAnswers: {},
    testAnswers: {},
    quizPassed: false,
    testSubmitted: false,
    isAnimationPlaying: true,
  })

  // Animation controls
  const setActiveTab = useCallback((tab: LessonTab) => {
    setState(s => ({ ...s, activeTab: tab }))
  }, [])

  const nextAnimationStep = useCallback(() => {
    setState(s => ({
      ...s,
      currentAnimationStep: Math.min(
        s.currentAnimationStep + 1,
        lesson.animation.steps.length - 1
      ),
    }))
  }, [lesson.animation.steps.length])

  const prevAnimationStep = useCallback(() => {
    setState(s => ({
      ...s,
      currentAnimationStep: Math.max(s.currentAnimationStep - 1, 0),
    }))
  }, [])

  const toggleAnimationPlayback = useCallback(() => {
    setState(s => ({ ...s, isAnimationPlaying: !s.isAnimationPlaying }))
  }, [])

  const resetAnimation = useCallback(() => {
    setState(s => ({
      ...s,
      currentAnimationStep: 0,
      isAnimationPlaying: true,
    }))
  }, [])

  // Worked examples navigation
  const nextExample = useCallback(() => {
    setState(s => ({
      ...s,
      currentExampleIndex: Math.min(
        s.currentExampleIndex + 1,
        lesson.workedExamples.length - 1
      ),
    }))
  }, [lesson.workedExamples.length])

  const prevExample = useCallback(() => {
    setState(s => ({
      ...s,
      currentExampleIndex: Math.max(s.currentExampleIndex - 1, 0),
    }))
  }, [])

  // Practice questions
  const nextPracticeQuestion = useCallback(() => {
    setState(s => ({
      ...s,
      currentPracticeIndex: Math.min(
        s.currentPracticeIndex + 1,
        lesson.practiceQuestions.length - 1
      ),
    }))
  }, [lesson.practiceQuestions.length])

  const prevPracticeQuestion = useCallback(() => {
    setState(s => ({
      ...s,
      currentPracticeIndex: Math.max(s.currentPracticeIndex - 1, 0),
    }))
  }, [])

  // Quiz handling
  const answerQuizQuestion = useCallback((questionId: string, optionIndex: number) => {
    setState(s => ({
      ...s,
      quizAnswers: {
        ...s.quizAnswers,
        [questionId]: optionIndex,
      },
    }))
  }, [])

  const nextQuizQuestion = useCallback(() => {
    setState(s => ({
      ...s,
      currentQuizIndex: Math.min(
        s.currentQuizIndex + 1,
        lesson.quiz.questions.length - 1
      ),
    }))
  }, [lesson.quiz.questions.length])

  const prevQuizQuestion = useCallback(() => {
    setState(s => ({
      ...s,
      currentQuizIndex: Math.max(s.currentQuizIndex - 1, 0),
    }))
  }, [])

  const submitQuiz = useCallback((finalScore: number, passed: boolean) => {
    setState(s => ({
      ...s,
      quizScore: finalScore,
      quizPassed: passed,
    }))
  }, [])

  // Test handling
  const answerTestQuestion = useCallback((questionId: string, answer: string) => {
    setState(s => ({
      ...s,
      testAnswers: {
        ...s.testAnswers,
        [questionId]: answer,
      },
    }))
  }, [])

  const nextTestQuestion = useCallback(() => {
    setState(s => ({
      ...s,
      currentTestIndex: Math.min(
        s.currentTestIndex + 1,
        lesson.test.questions.length - 1
      ),
    }))
  }, [lesson.test.questions.length])

  const prevTestQuestion = useCallback(() => {
    setState(s => ({
      ...s,
      currentTestIndex: Math.max(s.currentTestIndex - 1, 0),
    }))
  }, [])

  const submitTest = useCallback((finalScore: number) => {
    setState(s => ({
      ...s,
      testScore: finalScore,
      testSubmitted: true,
    }))
  }, [])

  return {
    state,
    setActiveTab,
    nextAnimationStep,
    prevAnimationStep,
    toggleAnimationPlayback,
    resetAnimation,
    nextExample,
    prevExample,
    nextPracticeQuestion,
    prevPracticeQuestion,
    answerQuizQuestion,
    nextQuizQuestion,
    prevQuizQuestion,
    submitQuiz,
    answerTestQuestion,
    nextTestQuestion,
    prevTestQuestion,
    submitTest,
  }
}
