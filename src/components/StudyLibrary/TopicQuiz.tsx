import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import type { Quiz } from '../../data/studyLibrary';
import { PracticeQuestionComponent } from './PracticeQuestion';

interface TopicQuizProps {
  quiz: Quiz;
  onComplete?: (passed: boolean, score: number) => void;
}

export const TopicQuizComponent: React.FC<TopicQuizProps> = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScore(score + 1);
    }
    setAnswered(answered + 1);
    setAnswers([...answers, correct]);

    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleQuizComplete(correct);
      }
    }, 1500);
  };

  const handleQuizComplete = (lastWasCorrect: boolean) => {
    const finalScore = score + (lastWasCorrect ? 1 : 0);
    const percentage = (finalScore / quiz.questions.length) * 100;
    const passed = percentage >= quiz.passingScore;
    setQuizComplete(true);
    onComplete?.(passed, percentage);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(0);
    setQuizComplete(false);
    setAnswers([]);
  };

  const percentage = (score / quiz.questions.length) * 100;
  const passed = percentage >= quiz.passingScore && answered === quiz.questions.length;

  if (quizComplete) {
    const finalPercentage = (score / quiz.questions.length) * 100;
    const passed = finalPercentage >= quiz.passingScore;

    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
            {passed ? (
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${passed ? 'text-green-900' : 'text-red-900'}`}>
            {passed ? 'Excellent!' : 'Keep Trying'}
          </h2>

          <p className="text-5xl font-bold text-slate-900 mb-2">
            {Math.round(finalPercentage)}%
          </p>

          <p className="text-slate-600 mb-8">
            You scored {score} out of {quiz.questions.length} questions
          </p>

          {passed ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-green-900 font-semibold">✓ You've passed this quiz!</p>
              <p className="text-green-800 text-sm mt-1">
                You scored {finalPercentage.toFixed(1)}% (required: {quiz.passingScore}%)
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-yellow-900 font-semibold">
                Keep practicing to reach {quiz.passingScore}%
              </p>
              <p className="text-yellow-800 text-sm mt-1">
                You need just {Math.ceil((quiz.passingScore / 100) * quiz.questions.length)} correct answers to pass
              </p>
            </div>
          )}
        </div>

        {/* Performance Breakdown */}
        <div className="mb-8">
          <h3 className="font-bold text-slate-900 mb-4">Question Review:</h3>
          <div className="space-y-2">
            {answers.map((correct, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${correct ? 'bg-green-600' : 'bg-red-600'}`}>
                  {idx + 1}
                </div>
                <span className="text-sm text-slate-700">
                  Question {idx + 1}: <span className={correct ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {correct ? 'Correct' : 'Incorrect'}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={resetQuiz}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Try Quiz Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-900">{quiz.title}</h3>
          <span className="text-sm font-semibold text-slate-600">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Passing score: {quiz.passingScore}%
        </p>
      </div>

      {/* Current Question */}
      <PracticeQuestionComponent
        question={quiz.questions[currentQuestion]}
        onAnswered={handleAnswer}
      />

      {/* Score Tracker */}
      {answered > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            Current score: <span className="font-bold">{score}/{answered}</span> correct
          </p>
        </div>
      )}
    </div>
  );
};
