import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react'
import { PracticeQuestion as IPracticeQuestion } from '../../types/lesson'
import { isAnswerCorrect } from '../../lib/lessonUtils'
import { cn } from '../../lib/utils'

interface PracticeQuestionProps {
  question: IPracticeQuestion
  currentIndex: number
  totalQuestions: number
  onNext: () => void
  onPrev: () => void
}

export const PracticeQuestion: React.FC<PracticeQuestionProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onNext,
  onPrev,
}) => {
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)

  const handleCheckAnswer = () => {
    if (question.type === 'short-answer') {
      const isCorrect = isAnswerCorrect(userAnswer, question.answer)
      setFeedback(isCorrect ? 'correct' : 'incorrect')
    } else if (question.type === 'multiple-choice' && selectedOption !== null) {
      const options = question.options || []
      const isCorrect = options[selectedOption] === question.answer
      setFeedback(isCorrect ? 'correct' : 'incorrect')
    }
  }

  const handleNext = () => {
    setUserAnswer('')
    setSelectedOption(null)
    setShowHint(false)
    setFeedback(null)
    onNext()
  }

  const handlePrev = () => {
    setUserAnswer('')
    setSelectedOption(null)
    setShowHint(false)
    setFeedback(null)
    onPrev()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-lg font-bold text-navy uppercase tracking-tight">Practice Question</h2>
            <span className={cn(
              'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest',
              getDifficultyColor(question.difficulty)
            )}>
              {question.difficulty}
            </span>
          </div>
          <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">
            Question {currentIndex + 1} of {totalQuestions}
          </p>
        </div>
      </div>

      {/* Question */}
      <div className="bg-navy/5 rounded-2xl p-6 mb-8 border-l-4 border-secondary">
        <p className="text-lg font-bold text-navy">{question.question}</p>
      </div>

      {/* Answer Input/Options */}
      <div className="mb-8">
        {question.type === 'short-answer' ? (
          <div>
            <label className="text-[10px] font-bold text-navy uppercase tracking-widest mb-3 block">
              Your Answer
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !feedback && handleCheckAnswer()}
              disabled={feedback !== null}
              placeholder="Type your answer..."
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl font-medium text-navy focus:outline-none focus:border-secondary transition-colors disabled:bg-slate-50"
            />
          </div>
        ) : (
          <div>
            <label className="text-[10px] font-bold text-navy uppercase tracking-widest mb-3 block">
              Select an Option
            </label>
            <div className="space-y-3">
              {(question.options || []).map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => !feedback && setSelectedOption(idx)}
                  disabled={feedback !== null}
                  className={cn(
                    'w-full p-4 rounded-2xl text-left font-medium transition-all border',
                    selectedOption === idx
                      ? feedback === 'correct'
                        ? 'border-green-400 bg-green-50 text-green-900'
                        : feedback === 'incorrect'
                          ? 'border-red-400 bg-red-50 text-red-900'
                          : 'border-secondary bg-secondary/10 text-navy'
                      : feedback === 'incorrect' && question.options![idx] === question.answer
                        ? 'border-green-400 bg-green-50 text-green-900'
                        : 'border-slate-200 hover:border-secondary text-navy'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                      selectedOption === idx
                        ? feedback === 'correct'
                          ? 'border-green-500 bg-green-500'
                          : feedback === 'incorrect'
                            ? 'border-red-500 bg-red-500'
                            : 'border-secondary bg-secondary'
                        : 'border-slate-300'
                    )}>
                      {selectedOption === idx && feedback && (
                        feedback === 'correct' ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-white" />
                        )
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hint */}
      {!feedback && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-secondary font-bold text-[10px] uppercase tracking-widest mb-6 hover:text-secondary/80 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
      )}

      {showHint && !feedback && (
        <div className="bg-secondary/10 border border-secondary/30 rounded-2xl p-4 mb-8">
          <p className="text-sm text-navy font-medium">{question.hint}</p>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={cn(
          'rounded-2xl p-6 mb-8 border',
          feedback === 'correct'
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
        )}>
          <div className="flex items-start gap-3">
            {feedback === 'correct' ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
            )}
            <div>
              <p className={cn(
                'font-bold text-lg mb-2',
                feedback === 'correct' ? 'text-green-900' : 'text-red-900'
              )}>
                {feedback === 'correct' ? 'Excellent!' : 'Not quite right'}
              </p>
              <p className={cn(
                'text-sm',
                feedback === 'correct' ? 'text-green-800' : 'text-red-800'
              )}>
                {feedback === 'correct'
                  ? 'Great job! You understood this concept correctly.'
                  : `The correct answer is: ${question.answer}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 pt-8 border-t border-slate-200">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all',
            currentIndex === 0
              ? 'bg-slate-100 text-navy/30 cursor-not-allowed'
              : 'bg-navy text-white hover:shadow-lg'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {!feedback ? (
          <button
            onClick={handleCheckAnswer}
            disabled={
              (question.type === 'short-answer' && !userAnswer) ||
              (question.type === 'multiple-choice' && selectedOption === null)
            }
            className={cn(
              'px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all',
              (question.type === 'short-answer' && !userAnswer) ||
              (question.type === 'multiple-choice' && selectedOption === null)
                ? 'bg-slate-100 text-navy/30 cursor-not-allowed'
                : 'bg-secondary text-white hover:shadow-lg'
            )}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={currentIndex === totalQuestions - 1}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all',
              currentIndex === totalQuestions - 1
                ? 'bg-slate-100 text-navy/30 cursor-not-allowed'
                : 'bg-navy text-white hover:shadow-lg'
            )}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
