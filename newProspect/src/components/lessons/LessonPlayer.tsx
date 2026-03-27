import React from 'react'
import { motion } from 'motion/react'
import {
  Book,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  BarChart3,
} from 'lucide-react'
import { LessonData } from '../../types/lesson'
import { useLesson } from '../../hooks/useLesson'
import { cn } from '../../lib/utils'
import { AnimatedExplainer } from './AnimatedExplainer'
import { WorkedExample } from './WorkedExample'
import { PracticeQuestion } from './PracticeQuestion'
import { QuizComponent } from './QuizComponent'
import { TestComponent } from './TestComponent'

interface LessonPlayerProps {
  lesson: LessonData
  onSaveProgress?: (quizScore?: number, testScore?: number) => Promise<void>
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, onSaveProgress }) => {
  const {
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
  } = useLesson(lesson)

  const tabs: Array<{ id: typeof state.activeTab; label: string; icon: React.ReactNode; locked: boolean }> = [
    { id: 'learn', label: 'Learn', icon: <Book className="w-4 h-4" />, locked: false },
    { id: 'practice', label: 'Practice', icon: <CheckCircle2 className="w-4 h-4" />, locked: false },
    { id: 'quiz', label: 'Quiz', icon: <BarChart3 className="w-4 h-4" />, locked: false },
    {
      id: 'test',
      label: 'Test',
      icon: state.quizPassed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />,
      locked: !state.quizPassed,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-navy uppercase tracking-tight mb-2">
                {lesson.topic}
              </h1>
              <p className="text-secondary text-[10px] font-bold uppercase tracking-widest">
                {lesson.subject} • Grade {lesson.grade} • Term {lesson.term}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">
                Estimated Time
              </p>
              <p className="text-2xl font-bold text-navy">{lesson.estimatedTime} min</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => !tab.locked && setActiveTab(tab.id)}
                disabled={tab.locked}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest whitespace-nowrap transition-all',
                  state.activeTab === tab.id
                    ? 'bg-navy text-white'
                    : tab.locked
                      ? 'bg-slate-100 text-navy/30 cursor-not-allowed'
                      : 'bg-slate-100 text-navy hover:bg-secondary/20'
                )}
              >
                {tab.icon}
                {tab.label}
                {tab.locked && <Lock className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          key={state.activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* LEARN TAB */}
          {state.activeTab === 'learn' && (
            <div className="space-y-12">
              {/* Learning Objectives */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-navy uppercase tracking-tight mb-6">
                  Learning Objectives
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.learningObjectives.map((objective, i) => (
                    <li key={i} className="flex gap-4">
                      <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-1" />
                      <span className="text-sm text-navy">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Animated Explainer */}
              <AnimatedExplainer
                animation={lesson.animation}
                currentStep={state.currentAnimationStep}
                onNextStep={nextAnimationStep}
                onPrevStep={prevAnimationStep}
                onTogglePlayback={toggleAnimationPlayback}
                onReset={resetAnimation}
                isPlaying={state.isAnimationPlaying}
                totalSteps={lesson.animation.steps.length}
              />

              {/* Explanation */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-navy uppercase tracking-tight mb-8">
                  {lesson.explanation.title}
                </h2>
                <div className="space-y-8">
                  {lesson.explanation.sections.map((section, i) => (
                    <div key={i}>
                      <h3 className="text-lg font-bold text-navy mb-4">{section.heading}</h3>
                      <p className="text-sm text-navy/70 leading-relaxed mb-6">{section.content}</p>
                      {section.diagram && (
                        <div className="bg-navy/5 rounded-2xl p-6 mb-6 text-center text-navy/40 text-sm">
                          {section.diagram}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Worked Examples */}
              <div>
                <h2 className="text-lg font-bold text-navy uppercase tracking-tight mb-6">
                  Worked Examples
                </h2>
                <WorkedExample
                  example={lesson.workedExamples[state.currentExampleIndex]}
                  currentIndex={state.currentExampleIndex}
                  totalExamples={lesson.workedExamples.length}
                  onNext={nextExample}
                  onPrev={prevExample}
                />
              </div>

              {/* Misconceptions */}
              {lesson.misconceptions.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
                  <h2 className="text-lg font-bold text-red-700 uppercase tracking-tight mb-6">
                    Common Misconceptions
                  </h2>
                  <div className="space-y-6">
                    {lesson.misconceptions.map((item, i) => (
                      <div key={i}>
                        <h3 className="font-bold text-red-700 mb-2">❌ {item.misconception}</h3>
                        <p className="text-sm text-red-600">✅ {item.correction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PRACTICE TAB */}
          {state.activeTab === 'practice' && (
            <div>
              <h2 className="text-lg font-bold text-navy uppercase tracking-tight mb-8">
                Practice Questions
              </h2>
              <PracticeQuestion
                question={lesson.practiceQuestions[state.currentPracticeIndex]}
                currentIndex={state.currentPracticeIndex}
                totalQuestions={lesson.practiceQuestions.length}
                onNext={nextPracticeQuestion}
                onPrev={prevPracticeQuestion}
              />
            </div>
          )}

          {/* QUIZ TAB */}
          {state.activeTab === 'quiz' && (
            <QuizComponent
              quiz={lesson.quiz}
              onComplete={submitQuiz}
            />
          )}

          {/* TEST TAB */}
          {state.activeTab === 'test' && (
            <TestComponent
              test={lesson.test}
              lesson={lesson}
              onComplete={submitTest}
              onSaveProgress={onSaveProgress}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}
