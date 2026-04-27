import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Lightbulb, CheckSquare, Award, BookMarked, ChevronLeft, Home } from 'lucide-react';
import { ConceptExplanation } from './ConceptExplanation';
import { WorkedExampleComponent } from './WorkedExample';
import { PracticeQuestionComponent } from './PracticeQuestion';
import { TopicQuizComponent } from './TopicQuiz';
import { PracticeExamComponent } from './PracticeExam';
import type { Topic } from '../../data/studyLibrary';

type ContentStep = 'concept' | 'examples' | 'practice' | 'quiz' | 'exam';

interface TopicViewerProps {
  topic: Topic;
  onBack: () => void;
}

const stepConfig = [
  { id: 'concept' as ContentStep, label: 'Concept', icon: Lightbulb, color: 'bg-blue-100 text-blue-700' },
  { id: 'examples' as ContentStep, label: 'Examples', icon: CheckSquare, color: 'bg-blue-100 text-blue-700' },
  { id: 'practice' as ContentStep, label: 'Practice', icon: BookOpen, color: 'bg-green-100 text-green-700' },
  { id: 'quiz' as ContentStep, label: 'Quiz', icon: Award, color: 'bg-yellow-100 text-yellow-700' },
  { id: 'exam' as ContentStep, label: 'Exam', icon: BookMarked, color: 'bg-red-100 text-red-700' }
];

export const TopicViewer: React.FC<TopicViewerProps> = ({ topic, onBack }) => {
  const [currentStep, setCurrentStep] = useState<ContentStep>('concept');
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<ContentStep>>(new Set());

  const handleStepComplete = (step: ContentStep) => {
    setCompletedSteps(prev => new Set([...prev, step]));
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'concept':
        return (
          <motion.div
            key="concept"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ConceptExplanation
              title={topic.conceptExplanation.title}
              content={topic.conceptExplanation.content}
              visualizations={topic.visualizations}
            />
            <button
              onClick={() => {
                handleStepComplete('concept');
                setCurrentStep('examples');
              }}
              className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Got It! See Examples →
            </button>
          </motion.div>
        );

      case 'examples':
        return (
          <motion.div
            key="examples"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <WorkedExampleComponent
              example={topic.workedExamples[currentExampleIndex]}
            />

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setCurrentExampleIndex(Math.max(0, currentExampleIndex - 1))}
                disabled={currentExampleIndex === 0}
                className="px-4 py-2 border-2 border-slate-200 text-slate-900 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                ← Previous
              </button>

              <div className="flex-1 text-center">
                <p className="text-sm text-slate-600">
                  Example {currentExampleIndex + 1} of {topic.workedExamples.length}
                </p>
                <div className="flex gap-1 justify-center mt-2">
                  {topic.workedExamples.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentExampleIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === currentExampleIndex ? 'bg-blue-600 w-6' : 'bg-slate-300'}`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (currentExampleIndex === topic.workedExamples.length - 1) {
                    handleStepComplete('examples');
                    setCurrentStep('practice');
                  } else {
                    setCurrentExampleIndex(Math.min(topic.workedExamples.length - 1, currentExampleIndex + 1));
                  }
                }}
                className="px-4 py-2 border-2 border-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                {currentExampleIndex === topic.workedExamples.length - 1 ? 'Practice Problems →' : 'Next →'}
              </button>
            </div>
          </motion.div>
        );

      case 'practice':
        return (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <PracticeQuestionComponent
              question={topic.practiceQuestions[currentPracticeIndex]}
              onAnswered={() => {}}
            />

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setCurrentPracticeIndex(Math.max(0, currentPracticeIndex - 1))}
                disabled={currentPracticeIndex === 0}
                className="px-4 py-2 border-2 border-slate-200 text-slate-900 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                ← Previous
              </button>

              <div className="flex-1 text-center">
                <p className="text-sm text-slate-600">
                  Question {currentPracticeIndex + 1} of {topic.practiceQuestions.length}
                </p>
                <div className="flex gap-1 justify-center mt-2">
                  {topic.practiceQuestions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPracticeIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === currentPracticeIndex ? 'bg-green-600 w-6' : 'bg-slate-300'}`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (currentPracticeIndex === topic.practiceQuestions.length - 1) {
                    handleStepComplete('practice');
                    setCurrentStep('quiz');
                  } else {
                    setCurrentPracticeIndex(Math.min(topic.practiceQuestions.length - 1, currentPracticeIndex + 1));
                  }
                }}
                className="px-4 py-2 border-2 border-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                {currentPracticeIndex === topic.practiceQuestions.length - 1 ? 'Take Quiz →' : 'Next →'}
              </button>
            </div>
          </motion.div>
        );

      case 'quiz':
        return (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TopicQuizComponent
              quiz={topic.topicQuiz}
              onComplete={(passed, score) => {
                if (passed) {
                  handleStepComplete('quiz');
                }
              }}
            />
          </motion.div>
        );

      case 'exam':
        return (
          <motion.div
            key="exam"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PracticeExamComponent
              exam={topic.practiceExam}
              onComplete={(score, percentage) => {
                handleStepComplete('exam');
              }}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-slate-900">{topic.title}</h1>
            <div className="w-12" />
          </div>

          {/* Step Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {stepConfig.map(step => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.has(step.id);

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : isCompleted
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {step.label}
                  {isCompleted && !isActive && '✓'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  );
};
