import React, { createContext, useContext, useState } from 'react';

interface QuizAnswer {
  questionId: number;
  value: number; // 1-5 Likert scale
}

interface QuizContextType {
  answers: QuizAnswer[];
  setAnswer: (questionId: number, value: number) => void;
  resetQuiz: () => void;
  isComplete: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const setAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) => (a.questionId === questionId ? { ...a, value } : a));
      }
      return [...prev, { questionId, value }];
    });
  };

  const resetQuiz = () => {
    setAnswers([]);
  };

  const isComplete = answers.length === 42;

  return (
    <QuizContext.Provider value={{ answers, setAnswer, resetQuiz, isComplete }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
