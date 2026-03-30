import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2, Info, RefreshCw, ArrowRight, Star, Copy, Zap, Award, SkipForward } from 'lucide-react';
import { quizQuestions } from '../data/quizQuestions';
import { computeQuizResults, type QuizResults } from '../data/quizScoringLogic';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import { saveQuizResults } from '../services/quizService';
import AppHeader from '../components/AppHeader';
import { SkippedQuestionsPanel } from '../components/SkippedQuestionsPanel';
import type { User } from '@supabase/supabase-js';

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuizAnswer {
  questionId: string;
  value: number;
}

// ── Quiz Page ─────────────────────────────────────────────────────────────────

const likertOptions = [
  { label: 'Strongly Dislike', value: 1, color: 'bg-red-500' },
  { label: 'Dislike', value: 2, color: 'bg-orange-400' },
  { label: 'Neutral', value: 3, color: 'bg-slate-300' },
  { label: 'Like', value: 4, color: 'bg-green-400' },
  { label: 'Strongly Like', value: 5, color: 'bg-green-600' },
];

function QuizPhase({
  onComplete,
  onNavigate,
  user,
}: {
  onComplete: (answers: QuizAnswer[], skipped: number) => void;
  onNavigate: (page: string) => void;
  user: User;
}) {
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showSkipReminder, setShowSkipReminder] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id)?.value;
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  const isLast = currentQuestionIndex === quizQuestions.length - 1;
  const isComplete = answers.length === quizQuestions.length;
  const hasSkipped = skippedQuestions.length > 0;

  const skippedQuestionDetails = skippedQuestions
    .map((id) => {
      const q = quizQuestions.find((q) => q.id === id);
      const idx = quizQuestions.findIndex((q) => q.id === id);
      return q ? { id, question: q.question, index: idx } : null;
    })
    .filter(Boolean) as { id: string; question: string; index: number }[];

  const handleAnswer = (value: number) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === currentQuestion.id);
      if (existing) {
        return prev.map((a) => (a.questionId === currentQuestion.id ? { ...a, value } : a));
      }
      return [...prev, { questionId: currentQuestion.id, value }];
    });
    // Remove from skipped if answering a previously skipped question
    setSkippedQuestions((prev) => prev.filter((id) => id !== currentQuestion.id));
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 300);
    }
  };

  const handleSkip = () => {
    // Mark current question as skipped
    if (!skippedQuestions.includes(currentQuestion.id)) {
      setSkippedQuestions((prev) => [...prev, currentQuestion.id]);
    }
    // Move to next question
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 300);
    }
  };

  const handleJumpToQuestion = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setIsPanelOpen(false);
  };

  const handleFinish = () => {
    if (isComplete && hasSkipped) {
      setShowSkipReminder(true);
    } else if (isComplete) {
      onComplete(answers, 0);
    }
  };

  const handleConfirmFinish = () => {
    setShowSkipReminder(false);
    onComplete(answers, skippedQuestions.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="quiz" user={user} onNavigate={onNavigate} />
      <div className="pt-24 pb-16 px-4 flex flex-col items-center">
        <div className="max-w-2xl w-full">
          {/* Header & Progress */}
          <div className="mb-12">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 text-navy hover:text-secondary transition-colors mb-6 font-bold text-[10px] uppercase tracking-widest"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
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

        {/* Question Card & Skip Button */}
        <div className="relative mb-8">
          {/* Skip Button */}
          {hasSkipped && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsPanelOpen(true)}
              className="absolute -right-20 md:right-0 md:-top-12 top-1/2 -translate-y-1/2 md:translate-y-0 bg-secondary text-white px-4 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap z-10"
            >
              <SkipForward className="w-4 h-4" />
              Skipped ({skippedQuestions.length})
            </motion.button>
          )}

          <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[120px] flex flex-col justify-center"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-navy leading-tight text-center">
                {currentQuestion.question}
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
                <div
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all ${
                    currentAnswer === option.value
                      ? `${option.color} shadow-lg`
                      : 'bg-slate-50 border border-slate-100'
                  }`}
                >
                  {currentAnswer === option.value && <CheckCircle2 className="w-6 h-6 text-white" />}
                </div>
                <span
                  className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-center leading-tight ${
                    currentAnswer === option.value ? 'text-navy' : 'text-secondary'
                  }`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-navy hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-secondary hover:bg-secondary/10 transition-all border border-secondary/30"
          >
            <SkipForward className="w-4 h-4" />
            Skip
          </button>

          {isLast ? (
            <button
              onClick={handleFinish}
              disabled={!isComplete}
              className="bg-secondary text-white px-10 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:shadow-lg active:scale-95 disabled:opacity-50 transition-all"
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              disabled={!currentAnswer}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-navy hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
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

      {/* Skipped Questions Panel */}
      <SkippedQuestionsPanel
        isOpen={isPanelOpen}
        skippedQuestions={skippedQuestionDetails}
        onClose={() => setIsPanelOpen(false)}
        onSelectQuestion={handleJumpToQuestion}
      />

      {/* Skip Reminder Modal */}
      <AnimatePresence>
        {showSkipReminder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSkipReminder(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 bg-white rounded-3xl p-8 z-50 max-w-lg shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-6">
                  <SkipForward className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-navy mb-2 uppercase tracking-tight">
                  Skipped Questions
                </h2>
                <p className="text-sm text-navy/70">
                  You skipped <span className="font-bold">{skippedQuestions.length}</span> question{skippedQuestions.length !== 1 ? 's' : ''}. Go back and answer them now?
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSkipReminder(false);
                  }}
                  className="w-full bg-secondary text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:shadow-lg transition-all"
                >
                  Go Back & Answer
                </button>
                <button
                  onClick={handleConfirmFinish}
                  className="w-full bg-slate-100 text-navy px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  View Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Results Page ──────────────────────────────────────────────────────────────

// ── Supabase Save ─────────────────────────────────────────────────────────────

async function saveQuizResultsToSupabase(results: QuizResults, userId: string) {
  try {
    // Extract top 15 career IDs from career matches
    const topCareerId = results.topCareerMatches.slice(0, 15).map(c => c.id);

    // Build subject recommendations object
    const subjectRecommendations: Record<string, string[]> = {};
    if (results.subjectRecommendations && results.subjectRecommendations.length > 0) {
      results.subjectRecommendations.forEach(subject => {
        const key = subject.importance || 'Recommended';
        if (!subjectRecommendations[key]) {
          subjectRecommendations[key] = [];
        }
        subjectRecommendations[key].push(subject.subject);
      });
    }

    await saveQuizResults(
      userId,
      results.percentages, // RIASEC scores
      topCareerId, // Top 15 career IDs
      undefined, // APS score (not available from quiz)
      undefined, // Matric subjects (not available from quiz)
      subjectRecommendations
    );
  } catch (err) {
    // Silent fail — results already displayed in UI
    console.error('Failed to save quiz results:', err);
  }
}

// ── Results Page ──────────────────────────────────────────────────────────────

function ResultsPhase({
  results,
  onRetake,
  onNavigate,
  user,
}: {
  results: QuizResults;
  onRetake: () => void;
  onNavigate: (page: string) => void;
  user: User;
}) {
  const topCode = results.topCodes[0];
  const topCodeLabel = {
    R: 'Realistic',
    I: 'Investigative',
    A: 'Artistic',
    S: 'Social',
    E: 'Enterprising',
    C: 'Conventional',
  }[topCode] || topCode;

  const scoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-600';
    if (score >= 40) return 'bg-yellow-400';
    return 'bg-blue-400';
  };

  const compatibilityColor = (score: number) => {
    if (score >= 80) return 'bg-green-600 text-white';
    if (score >= 60) return 'bg-yellow-400 text-navy';
    return 'bg-blue-400 text-white';
  };

  const generateShareUrl = () => {
    const encoded = btoa(JSON.stringify({
      topCodes: results.topCodes,
      percentages: results.percentages,
    }));
    return `${window.location.origin}?quiz-results=${encoded}`;
  };

  const handleShare = async () => {
    const url = generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      alert('Share link copied to clipboard! 📋');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const subjectsByImportance = {
    Essential: results.subjectRecommendations.filter((s) => s.importance === 'Essential'),
    Recommended: results.subjectRecommendations.filter((s) => s.importance === 'Recommended'),
    Useful: results.subjectRecommendations.filter((s) => s.importance === 'Useful'),
  };

  const topCareers = results.topCareerMatches.slice(0, 15);

  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="quiz" user={user} onNavigate={onNavigate} />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-navy hover:text-secondary transition-colors mb-8 font-bold text-[10px] uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

        {/* Section 1: Header & RIASEC Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Assessment Complete</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4 uppercase tracking-tight">
            Your RIASEC Profile
          </h1>
          <p className="text-base text-navy/70 mb-8 max-w-3xl">
            {results.profileDescription}
          </p>
        </motion.div>

        {/* RIASEC Bars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm mb-20"
        >
          <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-12">Your Scores Across All Dimensions</h3>
          <div className="space-y-8">
            {Object.entries(results.percentages)
              .sort(([, a], [, b]) => b - a)
              .map(([code, score], index) => {
                const isTop3 = results.topCodes.includes(code);
                const codeLabel = {
                  R: 'Realistic',
                  I: 'Investigative',
                  A: 'Artistic',
                  S: 'Social',
                  E: 'Enterprising',
                  C: 'Conventional',
                }[code] || code;

                return (
                  <motion.div
                    key={code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
                            scoreColor(score)
                          }`}
                        >
                          {code}
                        </span>
                        <span className={`text-sm font-bold uppercase ${isTop3 ? 'text-navy' : 'text-navy/60'}`}>
                          {codeLabel}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${isTop3 ? 'text-secondary' : 'text-navy/60'}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ delay: 0.15 + index * 0.1, duration: 1 }}
                        className={`h-full ${scoreColor(score)} transition-all`}
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>

        {/* Section 3: Top 15 Careers */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-20">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-navy uppercase tracking-tight mb-2">Your Best Career Matches</h2>
            <p className="text-navy/70 text-sm">
              Ranked by compatibility with your profile ({results.topCodes.join(', ')})
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCareers.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Compatibility Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-1">{career.title}</h3>
                    <span className="inline-block text-xs font-bold bg-navy/10 text-navy px-2 py-1 rounded">
                      {career.category}
                    </span>
                  </div>
                  <div className={`text-sm font-bold px-3 py-1 rounded-lg ${compatibilityColor(career.compatibilityScore || 0)}`}>
                    {career.compatibilityScore}%
                  </div>
                </div>

                {/* Why It Fits */}
                <p className="text-sm text-navy/70 mb-4 line-clamp-2">{career.whyItFits}</p>

                {/* Job Demand & Path */}
                <div className="space-y-3 mb-4 pb-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-navy/60">Job Demand:</span>
                    <span className="font-bold text-navy">{career.jobDemand}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-navy/60">Path:</span>
                    <span className="font-bold text-navy">{career.educationPath} ({career.studyYears})</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-navy/60">Salary:</span>
                    <span className="font-bold text-secondary">{career.salaryRange}</span>
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => onNavigate('careers')}
                  className="w-full py-2 text-sm font-bold text-navy bg-navy/5 hover:bg-navy/10 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section 4: Subject Recommendations */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-20">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-navy uppercase tracking-tight mb-2">Subjects to Focus On</h2>
            <p className="text-navy/70 text-sm">
              These subjects will prepare you best for your matched careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Essential */}
            {subjectsByImportance.Essential.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-green-900 uppercase text-xs tracking-wider">Essential</h3>
                </div>
                <ul className="space-y-3">
                  {subjectsByImportance.Essential.map((sub) => (
                    <li key={sub.subject} className="text-sm">
                      <p className="font-bold text-navy mb-1">{sub.subject}</p>
                      <p className="text-xs text-navy/60">{sub.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended */}
            {subjectsByImportance.Recommended.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-bold text-yellow-900 uppercase text-xs tracking-wider">Recommended</h3>
                </div>
                <ul className="space-y-3">
                  {subjectsByImportance.Recommended.map((sub) => (
                    <li key={sub.subject} className="text-sm">
                      <p className="font-bold text-navy mb-1">{sub.subject}</p>
                      <p className="text-xs text-navy/60">{sub.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Useful */}
            {subjectsByImportance.Useful.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-blue-900 uppercase text-xs tracking-wider">Useful</h3>
                </div>
                <ul className="space-y-3">
                  {subjectsByImportance.Useful.map((sub) => (
                    <li key={sub.subject} className="text-sm">
                      <p className="font-bold text-navy mb-1">{sub.subject}</p>
                      <p className="text-xs text-navy/60">{sub.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>

        {/* Section 5: Next Steps */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-navy uppercase tracking-tight mb-10">What's Next?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => onNavigate('careers')}
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:shadow-lg"
            >
              <ArrowRight className="w-5 h-5" />
              Explore All Careers
            </button>
            <button
              onClick={() => onNavigate('bursaries')}
              className="bg-amber-400 hover:bg-amber-500 text-navy px-8 py-6 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:shadow-lg"
            >
              <Star className="w-5 h-5" />
              Find Bursaries
            </button>
            <button
              onClick={() => onNavigate('library')}
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:shadow-lg"
            >
              <ArrowRight className="w-5 h-5" />
              Study Resources
            </button>
            <button
              onClick={handleShare}
              className="bg-amber-400 hover:bg-amber-500 text-navy px-8 py-6 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:shadow-lg"
            >
              <Copy className="w-5 h-5" />
              Share Results
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="border-2 border-navy text-navy hover:bg-navy/5 px-8 py-6 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
            >
              <ArrowRight className="w-5 h-5" />
              Back to Dashboard
            </button>
            <button
              onClick={onRetake}
              className="border-2 border-navy text-navy hover:bg-navy/5 px-8 py-6 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Retake Quiz
            </button>
          </div>
        </motion.div>

        {/* Section 6: Disclaimer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-navy/5 border border-navy/10 rounded-2xl p-8 text-center">
          <p className="text-sm text-navy/70 leading-relaxed italic">
            This assessment is based on Holland's RIASEC model, validated by over 70 years of career research. Your results reflect
            your current interests — they can change as you grow and learn. Use these insights as a starting point for exploration,
            not a final verdict. Talk to your teacher, parents, or a career advisor for personalized guidance.
          </p>
        </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Root Component ────────────────────────────────────────────────────────────

function QuizPage({ user, onNavigate }: AuthedProps) {
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

  const handleComplete = (answers: QuizAnswer[], skipped: number = 0) => {
    const results = computeQuizResults(answers);
    setQuizResults(results);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Fire-and-forget save to Supabase
    saveQuizResultsToSupabase(results, user.id);
  };

  const handleRetake = () => {
    setQuizResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence mode="wait">
      {!quizResults ? (
        <motion.div
          key="quiz"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <QuizPhase onComplete={handleComplete} onNavigate={onNavigate} user={user} />
        </motion.div>
      ) : (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ResultsPhase results={quizResults} onRetake={handleRetake} onNavigate={onNavigate} user={user} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default withAuth(QuizPage);
