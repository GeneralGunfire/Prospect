import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { Exam } from '../../data/studyLibrary';
import { PracticeQuestionComponent } from './PracticeQuestion';

interface PracticeExamProps {
  exam: Exam;
  onComplete?: (score: number, percentage: number) => void;
}

export const PracticeExamComponent: React.FC<PracticeExamProps> = ({ exam, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ correct: boolean; marks: number }[]>([]);
  const [examComplete, setExamComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(exam.timeLimit);
  const [timerActive, setTimerActive] = useState(true);

  // Timer
  useEffect(() => {
    if (!timerActive || examComplete) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleExamTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, examComplete]);

  const handleExamTimeUp = () => {
    setTimerActive(false);
    completeExam();
  };

  const handleAnswer = (correct: boolean) => {
    const question = exam.questions[currentQuestion];
    const newScore = correct ? score + question.marks : score;
    setScore(newScore);
    setAnswers([...answers, { correct, marks: question.marks }]);

    setTimeout(() => {
      if (currentQuestion < exam.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        completeExam();
      }
    }, 1500);
  };

  const completeExam = () => {
    setTimerActive(false);
    setExamComplete(true);
    const percentage = (score / exam.totalMarks) * 100;
    onComplete?.(score, percentage);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (examComplete) {
    const percentage = (score / exam.totalMarks) * 100;
    const totalMarks = answers.reduce((sum, a) => sum + a.marks, 0);
    const correctMarks = answers.reduce((sum, a, i) => sum + (a.correct ? exam.questions[i].marks : 0), 0);

    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-blue-600" />
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">Exam Complete!</h2>

          <p className="text-5xl font-bold text-blue-600 mb-2">
            {Math.round(percentage)}%
          </p>

          <p className="text-slate-600 mb-8">
            You scored {score} out of {exam.totalMarks} marks
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left mb-6">
            <h3 className="font-bold text-slate-900 mb-4">Score Breakdown:</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Total Questions:</span>
                <span className="font-bold text-slate-900">{exam.questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Correct:</span>
                <span className="font-bold text-green-600">
                  {answers.filter(a => a.correct).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Incorrect:</span>
                <span className="font-bold text-red-600">
                  {answers.filter(a => !a.correct).length}
                </span>
              </div>
              <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
                <span className="text-slate-700 font-semibold">Total Marks Earned:</span>
                <span className="font-bold text-lg text-blue-600">{score}/{exam.totalMarks}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-slate-900 mb-4 text-left">Question Performance:</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {answers.map((answer, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${answer.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-3">
                    {answer.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-slate-900">
                      Question {idx + 1}
                    </span>
                  </div>
                  <span className={`text-sm font-bold ${answer.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {answer.correct ? '+' : '0'}{answer.marks}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Return to Study Library
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Timer */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">{exam.title}</h2>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'} font-bold`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Question {currentQuestion + 1} of {exam.questions.length}</span>
          <span>Total Marks: {exam.totalMarks}</span>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-4">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / exam.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <div className="mb-4 inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
          {exam.questions[currentQuestion].marks} marks
        </div>
        <PracticeQuestionComponent
          question={exam.questions[currentQuestion]}
          onAnswered={handleAnswer}
        />
      </div>

      {/* Progress */}
      {answers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-900">
              Progress: <span className="font-bold">{answers.length}/{exam.questions.length}</span> answered
            </p>
            <p className="text-sm text-blue-900">
              Current score: <span className="font-bold">{score}/{exam.totalMarks}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
