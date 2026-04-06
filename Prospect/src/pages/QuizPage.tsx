import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2, Info } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';
import { quizQuestions } from '../data/quizQuestions';
import { useDataSaver } from '../contexts/DataSaverContext';

export const QuizPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { answers, setAnswer, isComplete } = useQuiz();
  const { dataSaverMode } = useDataSaver();
  const navigate = useNavigate();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id)?.value;

  const handleAnswer = (value: number) => {
    setAnswer(currentQuestion.id, value);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1 && currentAnswer) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleFinish = () => {
    if (isComplete) {
      navigate('/quiz-results');
    }
  };

  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const likertOptions = [
    { label: 'Strongly Dislike', value: 1, color: 'bg-red-500' },
    { label: 'Dislike', value: 2, color: 'bg-orange-400' },
    { label: 'Neutral', value: 3, color: 'bg-slate-300' },
    { label: 'Like', value: 4, color: 'bg-green-400' },
    { label: 'Strongly Like', value: 5, color: 'bg-green-600' },
  ];

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Header & Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-navy uppercase tracking-tight mb-1">Career Quiz</h1>
              <p className="text-secondary text-[10px] font-bold uppercase tracking-widest">RIASEC Assessment</p>
            </div>
            <div className="text-right">
              <span className="text-navy font-bold text-lg">{currentQuestionIndex + 1}</span>
              <span className="text-secondary text-xs font-medium"> / {quizQuestions.length}</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-secondary"
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm mb-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={dataSaverMode ? {} : { opacity: 0, x: 20 }}
              animate={dataSaverMode ? {} : { opacity: 1, x: 0 }}
              exit={dataSaverMode ? {} : { opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[120px] flex flex-col justify-center"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-navy leading-tight text-center">
                How much would you like to <span className="text-secondary">{currentQuestion.text.toLowerCase()}</span>?
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Likert Scale */}
          <div className="mt-12 grid grid-cols-5 gap-2 md:gap-4">
            {likertOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`group flex flex-col items-center gap-3 transition-all ${
                  currentAnswer === option.value ? 'scale-105' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all ${
                  currentAnswer === option.value 
                    ? `${option.color} shadow-lg shadow-${option.color.split('-')[1]}/20` 
                    : 'bg-slate-50 border border-slate-100'
                }`}>
                  {currentAnswer === option.value && <CheckCircle2 className="w-6 h-6 text-white" />}
                </div>
                <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-center leading-tight ${
                  currentAnswer === option.value ? 'text-navy' : 'text-secondary'
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-navy hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentQuestionIndex === quizQuestions.length - 1 ? (
            <button
              onClick={handleFinish}
              disabled={!isComplete}
              className="bg-secondary text-white px-10 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-secondary/20 active:scale-95 disabled:opacity-50 transition-all"
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!currentAnswer}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-navy hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-navy/5 rounded-2xl flex gap-4 border border-navy/10">
          <Info className="w-5 h-5 text-navy shrink-0" />
          <p className="text-xs text-navy/70 leading-relaxed">
            Be honest! There are no right or wrong answers. This assessment helps identify your natural interests to match you with careers you'll actually enjoy.
          </p>
        </div>
      </div>
    </div>
  );
};
