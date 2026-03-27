import React, { useState } from 'react'
import { CheckCircle2, AlertCircle, Lock, Loader } from 'lucide-react'
import { LessonData, TestQuestion } from '../../types/lesson'
import { calculateTestScore, shuffleArray } from '../../lib/lessonUtils'
import { cn } from '../../lib/utils'

interface TestComponentProps {
  test: { questions: TestQuestion[] }
  lesson: LessonData
  onComplete: (finalScore: number) => void
  onSaveProgress?: (quizScore?: number, testScore?: number) => Promise<void>
}

export const TestComponent: React.FC<TestComponentProps> = ({
  test,
  lesson,
  onComplete,
  onSaveProgress,
}) => {
  const shuffledQuestions = React.useMemo(() => shuffleArray(test.questions), [test.questions])
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  const currentQuestion = shuffledQuestions[currentQuestionIdx]
  const isAnswered = answers[currentQuestion.id] !== undefined && answers[currentQuestion.id].trim() !== ''
  const isLastQuestion = currentQuestionIdx === shuffledQuestions.length - 1

  const handleAnswerChange = (answer: string) => {
    if (!submitted) {
      setAnswers({
        ...answers,
        [currentQuestion.id]: answer,
      })
    }
  }

  const handleNext = () => {
    if (currentQuestionIdx < shuffledQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1)
    }
  }

  const handleSubmitTest = async () => {
    // Calculate score
    let correctCount = 0
    shuffledQuestions.forEach(question => {
      const userAnswer = answers[question.id] || ''
      if (question.type === 'multiple-choice') {
        // For MC, user answer should match one of the options
        const options = question.options || []
        if (options.includes(userAnswer)) {
          const correctOptionIdx = options.indexOf(question.answer)
          const userOptionIdx = options.indexOf(userAnswer)
          if (correctOptionIdx === userOptionIdx) {
            correctCount++
          }
        }
      } else {
        // For short answer, simple string match (you might want more sophisticated matching)
        if (userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase()) {
          correctCount++
        }
      }
    })

    const finalScore = calculateTestScore(correctCount, shuffledQuestions.length)
    setScore(finalScore)
    setSubmitted(true)
    onComplete(finalScore)

    // Save to Supabase if callback provided
    if (onSaveProgress) {
      setIsSaving(true)
      try {
        await onSaveProgress(undefined, finalScore)
      } catch (error) {
        console.error('Error saving test progress:', error)
      }
      setIsSaving(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Results Card */}
        <div className={cn(
          'rounded-3xl p-12 border-2 mb-8',
          score >= 70
            ? 'bg-green-50 border-green-300'
            : 'bg-yellow-50 border-yellow-300'
        )}>
          <div className="text-center">
            <div className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-bold',
              score >= 70
                ? 'bg-green-200 text-green-700'
                : 'bg-yellow-200 text-yellow-700'
            )}>
              {score}%
            </div>

            <h2 className={cn(
              'text-2xl font-bold mb-4',
              score >= 70 ? 'text-green-900' : 'text-yellow-900'
            )}>
              {score >= 70 ? 'Test Passed! 🎉' : 'Test Completed'}
            </h2>

            <p className={cn(
              'text-sm mb-8',
              score >= 70 ? 'text-green-700' : 'text-yellow-700'
            )}>
              {score >= 70
                ? 'Excellent work! You have successfully completed this lesson.'
                : 'You can retake the test to try for a higher score. Review the lesson material for areas you found challenging.'}
            </p>

            {isSaving && (
              <div className="flex items-center justify-center gap-2 text-navy mb-8">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Saving your progress...</span>
              </div>
            )}
          </div>
        </div>

        {/* Answer Review */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 mb-8">
          <h3 className="text-lg font-bold text-navy uppercase tracking-tight mb-6">Test Review</h3>
          <div className="space-y-6">
            {shuffledQuestions.map((question, idx) => {
              const userAnswer = answers[question.id] || ''
              let isCorrect = false

              if (question.type === 'multiple-choice') {
                const options = question.options || []
                const correctOptionIdx = options.indexOf(question.answer)
                const userOptionIdx = options.indexOf(userAnswer)
                isCorrect = correctOptionIdx === userOptionIdx && userAnswer !== ''
              } else {
                isCorrect = userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase()
              }

              return (
                <div
                  key={question.id}
                  className={cn(
                    'p-6 rounded-2xl border-2',
                    isCorrect
                      ? 'bg-green-50 border-green-300'
                      : 'bg-red-50 border-red-300'
                  )}
                >
                  <div className="flex items-start gap-3 mb-4">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                    )}
                    <div className="flex-grow">
                      <p className="font-bold text-navy mb-2">Q{idx + 1}: {question.question}</p>

                      {question.type === 'multiple-choice' ? (
                        <div className="space-y-2 text-sm mb-4">
                          {(question.options || []).map((option, optIdx) => (
                            <p
                              key={optIdx}
                              className={cn(
                                'p-2 rounded',
                                option === question.answer
                                  ? 'bg-green-200 text-green-900 font-bold'
                                  : option === userAnswer && !isCorrect
                                    ? 'bg-red-200 text-red-900'
                                    : 'text-navy/60'
                              )}
                            >
                              {option === question.answer && '✓ '}
                              {option === userAnswer && !isCorrect && '✗ '}
                              {option}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm mb-4">
                          <p className={cn(
                            'p-2 rounded mb-2',
                            isCorrect
                              ? 'bg-green-200 text-green-900'
                              : 'bg-red-200 text-red-900'
                          )}>
                            {isCorrect ? '✓ ' : '✗ '}
                            Your answer: {userAnswer || '(no answer)'}
                          </p>
                          {!isCorrect && (
                            <p className="p-2 rounded bg-green-200 text-green-900">
                              ✓ Correct answer: {question.answer}
                            </p>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-navy/60 italic">
                        Difficulty: <span className="font-bold">{question.difficulty}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action */}
        <div className="text-center space-y-3">
          <button
            onClick={() => {
              setSubmitted(false)
              setAnswers({})
              setCurrentQuestionIdx(0)
            }}
            className="px-8 py-4 bg-navy text-white rounded-xl font-bold uppercase tracking-widest hover:shadow-lg transition-all"
          >
            Retake Test
          </button>
        </div>
      </div>
    )
  }

  // Test in progress
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-navy uppercase tracking-tight">
            Question {currentQuestionIdx + 1} of {shuffledQuestions.length}
          </h2>
          <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">
            {Object.keys(answers).filter(k => answers[k].trim() !== '').length} / {shuffledQuestions.length} Answered
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-secondary transition-all duration-300"
            style={{ width: `${((currentQuestionIdx + 1) / shuffledQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-8">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-bold text-navy flex-grow">{currentQuestion.question}</h3>
          <span className={cn(
            'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 ml-4',
            currentQuestion.difficulty === 'easy'
              ? 'bg-green-100 text-green-800'
              : currentQuestion.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          )}>
            {currentQuestion.difficulty}
          </span>
        </div>

        {/* Answer Input */}
        {currentQuestion.type === 'short-answer' ? (
          <div className="mb-8">
            <label className="text-[10px] font-bold text-navy uppercase tracking-widest mb-3 block">
              Your Answer
            </label>
            <input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && isLastQuestion && isAnswered && handleSubmitTest()}
              placeholder="Type your answer..."
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl font-medium text-navy focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        ) : (
          <div className="mb-8">
            <label className="text-[10px] font-bold text-navy uppercase tracking-widest mb-3 block">
              Select an Option
            </label>
            <div className="space-y-3">
              {(currentQuestion.options || []).map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerChange(option)}
                  className={cn(
                    'w-full p-4 rounded-2xl text-left font-medium transition-all border-2',
                    answers[currentQuestion.id] === option
                      ? 'border-secondary bg-secondary/10 text-navy'
                      : 'border-slate-200 hover:border-secondary text-navy'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                      answers[currentQuestion.id] === option
                        ? 'border-secondary bg-secondary'
                        : 'border-slate-300'
                    )}>
                      {answers[currentQuestion.id] === option && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 pt-8 border-t border-slate-200">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIdx === 0}
            className={cn(
              'px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all',
              currentQuestionIdx === 0
                ? 'bg-slate-100 text-navy/30 cursor-not-allowed'
                : 'bg-navy text-white hover:shadow-lg'
            )}
          >
            Previous
          </button>

          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={cn(
                'px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all',
                !isAnswered
                  ? 'bg-slate-100 text-navy/30 cursor-not-allowed'
                  : 'bg-navy text-white hover:shadow-lg'
              )}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmitTest}
              disabled={Object.keys(answers).filter(k => answers[k].trim() !== '').length < shuffledQuestions.length}
              className={cn(
                'flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all',
                Object.keys(answers).filter(k => answers[k].trim() !== '').length < shuffledQuestions.length
                  ? 'bg-slate-100 text-navy/30 cursor-not-allowed'
                  : 'bg-secondary text-white hover:shadow-lg'
              )}
            >
              <Lock className="w-4 h-4" />
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
