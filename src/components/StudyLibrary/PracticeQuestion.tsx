import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import type { PracticeQuestion } from '../../data/studyLibrary';

interface PracticeQuestionProps {
  question: PracticeQuestion;
  onAnswered?: (correct: boolean) => void;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

export const PracticeQuestionComponent: React.FC<PracticeQuestionProps> = ({ question, onAnswered }) => {
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleMultipleChoice = (option: string) => {
    setSelectedAnswer(option);
    const isCorrect = option === question.correctAnswer;
    setCorrect(isCorrect);
    setAnswered(true);
    onAnswered?.(isCorrect);
  };

  const handleFillBlank = () => {
    if (!userInput.trim()) return;

    const correctAnswers = question.correctAnswers || [question.correctAnswer];
    const normalizedInput = userInput.toLowerCase().trim();
    const isCorrect = correctAnswers.some(ans =>
      normalizedInput === ans.toLowerCase() ||
      normalizedInput === ans.toLowerCase().replace(/\s+/g, '')
    );

    setCorrect(isCorrect);
    setAnswered(true);
    onAnswered?.(isCorrect);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex-1">{question.question}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex-shrink-0 ml-4 ${difficultyColors[question.difficulty]}`}>
          {question.difficulty}
        </span>
      </div>

      {/* Multiple Choice */}
      {question.type === 'multiple-choice' && (
        <div className="space-y-2 mb-4">
          {question.options?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !answered && handleMultipleChoice(option)}
              disabled={answered}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswer === option
                  ? correct
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">{option}</span>
                {selectedAnswer === option && (
                  answered ? (
                    correct ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )
                  ) : null
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Fill in the Blank */}
      {question.type === 'fill-blank' && (
        <div className="mb-4 space-y-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !answered && handleFillBlank()}
            placeholder="Type your answer..."
            disabled={answered}
            className={`w-full p-4 border-2 rounded-lg outline-none transition-all ${
              answered
                ? correct
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-slate-200 focus:border-blue-500'
            }`}
          />
          {!answered && (
            <button
              onClick={handleFillBlank}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Submit Answer
            </button>
          )}
          {answered && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-100">
              {correct ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-semibold ${correct ? 'text-green-700' : 'text-red-700'}`}>
                {correct ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hint */}
      {answered && !correct && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
        >
          <HelpCircle className="w-4 h-4" />
          {showHint ? 'Hide' : 'Show'} Hint
        </button>
      )}

      {/* Feedback */}
      {answered && (
        <div className={`rounded-lg p-4 ${correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`font-semibold mb-2 ${correct ? 'text-green-900' : 'text-red-900'}`}>
            {correct ? '✓ Well done!' : '✗ Not quite'}
          </p>
          <p className={`text-sm ${correct ? 'text-green-800' : 'text-red-800'}`}>
            {question.explanation}
          </p>
          {!correct && showHint && question.correctAnswer && (
            <p className="text-sm mt-2 pt-2 border-t border-red-200 text-red-800">
              <strong>Correct answer:</strong> {question.correctAnswer}
            </p>
          )}
        </div>
      )}

      {answered && (
        <button
          onClick={() => {
            setAnswered(false);
            setSelectedAnswer(null);
            setUserInput('');
            setShowHint(false);
          }}
          className="mt-4 w-full px-4 py-2 border-2 border-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
