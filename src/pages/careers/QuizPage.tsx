import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2, Info, RefreshCw, ArrowRight, Star, Copy, Zap, Award, SkipForward } from 'lucide-react';
import { quizQuestions } from '../../data/quizQuestions';
import { computeQuizResults, type QuizResults } from '../../data/quizScoringLogic';
import { withAuth, type AuthedProps } from '../../lib/withAuth';
import { saveQuizResults } from '../../services/quizService';
import AppHeader from '../../components/shell/AppHeader';
import { SkippedQuestionsPanel } from '../../components/quiz/SkippedQuestionsPanel';
import type { User } from '@supabase/supabase-js';

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuizAnswer {
  questionId: string;
  value: number;
}

// ── Quiz Page ─────────────────────────────────────────────────────────────────

const likertOptions = [
  { label: 'Strongly Dislike', short: 'S. Dislike', value: 1, color: 'bg-slate-700' },
  { label: 'Dislike', short: 'Dislike', value: 2, color: 'bg-slate-500' },
  { label: 'Neutral', short: 'Neutral', value: 3, color: 'bg-slate-400' },
  { label: 'Like', short: 'Like', value: 4, color: 'bg-slate-700' },
  { label: 'Strongly Like', short: 'S. Like', value: 5, color: 'bg-slate-900' },
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
  const isComplete = answers.length + skippedQuestions.length >= quizQuestions.length;
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
    if (answers.length === 0) return;
    if (hasSkipped) {
      setShowSkipReminder(true);
    } else {
      onComplete(answers, skippedQuestions.length);
    }
  };

  const handleConfirmFinish = () => {
    setShowSkipReminder(false);
    onComplete(answers, skippedQuestions.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="quiz" user={user} onNavigate={onNavigate} mode="career" />
      <div className="pt-24 pb-16 px-4 flex flex-col items-center">
        <div className="max-w-2xl w-full">
          {/* Header & Progress */}
          <div className="mb-10">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">RIASEC Assessment</p>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900" style={{ letterSpacing: '-0.03em' }}>Career Quiz</h1>
              </div>
              <div className="flex items-center gap-3 mt-1">
                {hasSkipped && (
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setIsPanelOpen(true)}
                    className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-1.5 whitespace-nowrap hover:bg-slate-200"
                  >
                    <SkipForward className="w-3 h-3" />
                    {skippedQuestions.length}
                  </motion.button>
                )}
                <div className="text-right">
                  <span className="text-slate-900 font-black text-2xl" style={{ letterSpacing: '-0.03em' }}>{currentQuestionIndex + 1}</span>
                  <span className="text-slate-400 text-sm font-medium"> / {quizQuestions.length}</span>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-slate-900"
              />
            </div>
          </div>

        {/* Question Card */}
        <div className="relative mb-8">

          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-24 flex flex-col justify-center"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-snug text-center" style={{ letterSpacing: '-0.015em' }}>
                {currentQuestion.question}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Likert Scale */}
          <div className="mt-8 sm:mt-12 grid grid-cols-5 gap-2">
            {likertOptions.map((option) => {
              const isSelected = currentAnswer === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`group flex flex-col items-center gap-3 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-700 rounded-xl p-2 ${
                    isSelected ? '' : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <div
                    className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-150 ${
                      isSelected
                        ? `${option.color}`
                        : 'bg-slate-100 border border-slate-200 group-hover:border-slate-300'
                    }`}
                  >
                    {isSelected
                      ? <CheckCircle2 className="w-5 h-5 text-white" />
                      : <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-slate-400 transition-colors" />
                    }
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-center leading-tight transition-colors hidden sm:block ${
                      isSelected ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {option.short}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-700 hover:bg-slate-700/10 transition-all border border-slate-300"
          >
            <SkipForward className="w-4 h-4" />
            Skip
          </button>

          {isLast ? (
            <button
              onClick={handleFinish}
              disabled={answers.length === 0}
              className="bg-slate-900 text-white px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-lg active:scale-95 disabled:opacity-50 transition-all"
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              disabled={!currentAnswer}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-sm leading-relaxed text-slate-500">
            Be honest. There are no right or wrong answers — this matches you with careers you'll actually enjoy.
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
              className="fixed inset-4 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 bg-white rounded-xl p-8 z-50 max-w-lg border border-slate-200"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900/20 rounded-full mb-6">
                  <SkipForward className="w-8 h-8 text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2 uppercase tracking-tight">
                  Skipped Questions
                </h2>
                <p className="text-sm text-slate-900/70">
                  You skipped <span className="font-bold">{skippedQuestions.length}</span> question{skippedQuestions.length !== 1 ? 's' : ''}. Go back and answer them now?
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSkipReminder(false);
                  }}
                  className="w-full bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-lg transition-all"
                >
                  Go Back & Answer
                </button>
                <button
                  onClick={handleConfirmFinish}
                  className="w-full bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
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
      results.percentages as Record<string, number>, // RIASEC scores
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

  const scoreColor = (_score: number) => 'bg-slate-700';
  const compatibilityColor = (_score: number) => 'bg-slate-100 text-slate-900';

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
      alert('Share link copied to clipboard.');
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
      <AppHeader currentPage="quiz" user={user} onNavigate={onNavigate} mode="career" />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
        {/* Section 1: Header & RIASEC Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 pt-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Assessment Complete</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4" style={{ letterSpacing: '-0.025em' }}>
            Your RIASEC Profile
          </h1>
          <p className="text-[15px] leading-[1.65] text-slate-500 max-w-2xl">
            {results.profileDescription}
          </p>
        </motion.div>

        {/* RIASEC Bars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="border border-slate-100 rounded-xl p-6 sm:p-8 mb-16"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Scores</p>
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
                    transition={{ delay: Math.min(index, 7) * 0.04 }}
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
                        <span className={`text-sm font-bold uppercase ${isTop3 ? 'text-slate-900' : 'text-slate-900/60'}`}>
                          {codeLabel}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${isTop3 ? 'text-slate-500' : 'text-slate-900/60'}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ delay: 0.15 + Math.min(index, 7) * 0.08, duration: 1 }}
                        className={`h-full ${scoreColor(score)} transition-all`}
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>

        {/* Section 3: Top 15 Careers */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Career Matches</p>
          <h2 className="text-2xl font-black text-slate-900 mb-8" style={{ letterSpacing: '-0.02em' }}>Your Best Matches</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCareers.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + Math.min(index, 7) * 0.04 }}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors cursor-pointer"
                onClick={() => onNavigate('careers')}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">{career.category}</p>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug" style={{ letterSpacing: '-0.01em' }}>{career.title}</h3>
                  </div>
                  <span className="shrink-0 ml-3 text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                    {career.compatibilityScore}%
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-500 line-clamp-2 mb-3">{career.whyItFits}</p>
                <div className="pt-3 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
                  <span>{career.salaryRange}</span>
                  <span className="text-slate-200">·</span>
                  <span>{career.jobDemand} demand</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section 4: Subject Recommendations */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Recommended Subjects</p>
          <h2 className="text-2xl font-black text-slate-900 mb-8" style={{ letterSpacing: '-0.02em' }}>Subjects to Focus On</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subjectsByImportance.Essential.length > 0 && (
              <div className="border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Essential</p>
                <ul className="space-y-3">
                  {subjectsByImportance.Essential.map((sub) => (
                    <li key={sub.subject}>
                      <p className="text-sm font-bold text-slate-900">{sub.subject}</p>
                      <p className="text-sm leading-relaxed text-slate-500 mt-0.5">{sub.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {subjectsByImportance.Recommended.length > 0 && (
              <div className="border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Recommended</p>
                <ul className="space-y-3">
                  {subjectsByImportance.Recommended.map((sub) => (
                    <li key={sub.subject}>
                      <p className="text-sm font-bold text-slate-900">{sub.subject}</p>
                      <p className="text-sm leading-relaxed text-slate-500 mt-0.5">{sub.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {subjectsByImportance.Useful.length > 0 && (
              <div className="border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Useful</p>
                <ul className="space-y-3">
                  {subjectsByImportance.Useful.map((sub) => (
                    <li key={sub.subject}>
                      <p className="text-sm font-bold text-slate-900">{sub.subject}</p>
                      <p className="text-sm leading-relaxed text-slate-500 mt-0.5">{sub.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>

        {/* Section 5: Next Steps */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Next Steps</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onNavigate('careers')} className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors">
              Explore Careers
            </button>
            <button onClick={() => onNavigate('bursaries')} className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-bold text-xs uppercase tracking-widest hover:border-slate-400 transition-colors">
              Find Bursaries
            </button>
            <button onClick={() => onNavigate('library')} className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-bold text-xs uppercase tracking-widest hover:border-slate-400 transition-colors">
              Study Resources
            </button>
            <button onClick={onRetake} className="px-5 py-2.5 border border-slate-200 text-slate-500 rounded-lg font-bold text-xs uppercase tracking-widest hover:border-slate-400 transition-colors">
              Retake Quiz
            </button>
          </div>
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
