import React, { useState, useMemo } from 'react'
import { CheckCircle2, AlertCircle, BarChart3, Lock, Unlock } from 'lucide-react'
import { Quiz } from '../../types/lesson'
import { calculateQuizScore, isQuizPassed, shuffleArray } from '../../lib/lessonUtils'
import { cn } from '../../lib/utils'

interface QuizComponentProps {
  quiz: Quiz
  onComplete: (finalScore: number, passed: boolean) => void
}

interface Quiz {
  passingScore: number
  questions: Array<{
    id: string
    question: string
    options: string[]
    correct: number
    explanation: string
  }>
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, onComplete }) => {
  const shuffledQuestions = useMemo(() => shuffleArray(quiz.questions), [quiz.questions])
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [passed, setPassed] = useState(false)

  const currentQuestion = shuffledQuestions[currentQuestionIdx]
  const isAnswered = answers[currentQuestion.id] !== undefined
  const isLastQuestion = currentQuestionIdx === shuffledQuestions.length - 1

  const handleSelectAnswer = (optionIndex: number) => {
    if (!submitted) {
      setAnswers({
        ...answers,
        [currentQuestion.id]: optionIndex,
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

  const handleSubmitQuiz = () => {
    // Calculate score
    let correctCount = 0
    shuffledQuestions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correctCount++
      }
    })

    const finalScore = calculateQuizScore(correctCount, shuffledQuestions.length)
    const quizPassed = isQuizPassed(finalScore, quiz.passingScore)

    setScore(finalScore)
    setPassed(quizPassed)
    setSubmitted(true)

    // Callback to parent
    onComplete(finalScore, quizPassed)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Results Card */}
        <div className={cn(
          'rounded-3xl p-12 border-2 mb-8',
          passed
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
        )}>
          <div className="text-center">
            {passed ? (
              <Unlock className="w-16 h-16 text-green-600 mx-auto mb-6" />
            ) : (
              <Lock className="w-16 h-16 text-red-600 mx-auto mb-6" />
            )}

            <h2 className={cn(
              'text-4xl font-bold mb-2',
              passed ? 'text-green-900' : 'text-red-900'
            )}>
              {score}%
            </h2>

            <p className={cn(
              'text-xl font-bold mb-6',
              passed ? 'text-green-800' : 'text-red-800'
            )}>
              {passed ? 'Quiz Passed! ✅' : 'Quiz Not Passed ❌'}
            </p>

            <p className={cn(
              'text-sm mb-8',
              passed ? 'text-green-700' : 'text-red-700'
            )}>
              {passed
                ? `Excellent! You've unlocked the graded test. You need to score 70% or higher to pass, and you got ${score}%. Ready to test your knowledge?`
                : `You need at least ${quiz.passingScore}% to pass, but you got ${score}%. Please review the lesson material and try again.`}
            </p>

            {passed && (
              <div className="bg-white rounded-2xl p-6 border-2 border-green-300 inline-block">
                <p className="text-sm font-bold text-green-800">
                  📝 Graded Test is now available!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100">
          <h3 className="text-lg font-bold text-navy uppercase tracking-tight mb-6">Quiz Review</h3>
          <div className="space-y-6">
            {shuffledQuestions.map((question, idx) => {
              const userAnswerIdx = answers[question.id]
              const isCorrect = userAnswerIdx === question.correct
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
                      <p className="font-bold text-navy mb-3">Q{idx + 1}: {question.question}</p>
                      <div className="space-y-2 text-sm mb-4">
                        {question.options.map((option, optIdx) => (
                          <p
                            key={optIdx}
                            className={cn(
                              'p-2 rounded',
                              optIdx === question.correct
                                ? 'bg-green-200 text-green-900 font-bold'
                                : optIdx === userAnswerIdx && !isCorrect
                                  ? 'bg-red-200 text-red-900'
                                  : 'text-navy/60'
                            )}
                          >
                            {optIdx === question.correct && '✓ '}
                            {optIdx === userAnswerIdx && !isCorrect && '✗ '}
                            {option}
                          </p>
                        ))}
                      </div>
                      <p className="text-xs text-navy/60 italic">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action */}
        {!passed && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setSubmitted(false)
                setAnswers({})
                setCurrentQuestionIdx(0)
              }}
              className="px-8 py-4 bg-navy text-white rounded-xl font-bold uppercase tracking-widest hover:shadow-lg transition-all"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    )
  }

  // Quiz in progress
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-navy uppercase tracking-tight">
            Question {currentQuestionIdx + 1} of {shuffledQuestions.length}
          </h2>
          <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">
            {Object.keys(answers).length} / {shuffledQuestions.length} Answered
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
        <h3 className="text-lg font-bold text-navy mb-8">{currentQuestion.question}</h3>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectAnswer(idx)}
              disabled={submitted}
              className={cn(
                'w-full p-4 rounded-2xl text-left font-medium transition-all border-2',
                answers[currentQuestion.id] === idx
                  ? 'border-secondary bg-secondary/10 text-navy'
                  : 'border-slate-200 hover:border-secondary text-navy'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  answers[currentQuestion.id] === idx
                    ? 'border-secondary bg-secondary'
                    : 'border-slate-300'
                )}>
                  {answers[currentQuestion.id] === idx && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

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
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length < shuffledQuestions.length}
              className={cn(
                'flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all',
                Object.keys(answers).length < shuffledQuestions.length
                  ? 'bg-slate-100 text-navy/30 cursor-not-allowed'
                  : 'bg-secondary text-white hover:shadow-lg'
              )}
            >
              <BarChart3 className="w-4 h-4" />
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
