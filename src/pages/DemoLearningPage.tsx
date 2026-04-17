import { useState } from 'react'
import { ChevronLeft, Lock } from 'lucide-react'
import { withAuth, type AuthedProps } from '../lib/withAuth'
import AppHeader from '../components/AppHeader'
import { DiagnosticQuiz } from '../components/DiagnosticQuiz'
import { LessonBlock } from '../components/LessonBlock'
import { GuidedPractice } from '../components/GuidedPractice'
import { IndependentPractice } from '../components/IndependentPractice'
import { SmartFeedback } from '../components/SmartFeedback'
import { AlgebraProgressCard } from '../components/AlgebraProgressCard'
import { algebraLearningPath, type LearningTopic, type TopicStatus } from '../data/demoLearningPath'
import { learningPathStorage } from '../services/storageService'
import { pushProgress } from '../services/supabaseSync'
import { getStatusIcon, getStatusColor, getStatusLabel } from '../utils/trackingLogic'

type Step = 'overview' | 'diagnostic' | 'lesson' | 'guided' | 'independent' | 'feedback'

interface FeedbackData {
  correct: number
  total: number
  hintsUsed: number
  status: TopicStatus
}

function DemoLearningPage({ user, onNavigate }: AuthedProps) {
  const [activeTopic, setActiveTopic] = useState<LearningTopic | null>(null)
  const [step, setStep] = useState<Step>('overview')
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)

  const pathId = algebraLearningPath.id
  const pathProgress = learningPathStorage.getPathProgress(pathId)

  function getTopicStatus(topicId: string): TopicStatus {
    return pathProgress?.topicStatuses[topicId]?.status ?? 'not-started'
  }

  function isTopicUnlocked(topic: LearningTopic): boolean {
    if (topic.order === 1) return true
    const prev = algebraLearningPath.topics.find(t => t.order === topic.order - 1)
    if (!prev) return true
    const prevStatus = getTopicStatus(prev.id)
    return prevStatus === 'mastered' || prevStatus === 'needs-practice'
  }

  function handleTopicClick(topic: LearningTopic) {
    if (!isTopicUnlocked(topic)) return
    setActiveTopic(topic)
    const status = getTopicStatus(topic.id)
    // Skip diagnostic if already attempted
    setStep(status === 'not-started' ? 'diagnostic' : 'lesson')
  }

  function handleDiagnosticComplete(level: 'strong' | 'medium' | 'weak') {
    if (!activeTopic) return
    learningPathStorage.saveTopicProgress(pathId, activeTopic.id, {
      topicId: activeTopic.id,
      subjectId: 'maths',
      status: 'in-progress',
      score: level === 'strong' ? 80 : level === 'medium' ? 50 : 20,
      hintsUsed: 0,
      attempts: activeTopic.diagnosticQuestions.length,
      diagnosticLevel: level,
      lastActivity: new Date().toISOString(),
    })
    setStep('lesson')
  }

  function handleIndependentComplete(result: FeedbackData) {
    if (!activeTopic) return
    const progress = {
      topicId: activeTopic.id,
      subjectId: 'maths',
      status: result.status,
      score: Math.round((result.correct / result.total) * 100),
      hintsUsed: result.hintsUsed,
      attempts: result.total,
      lastActivity: new Date().toISOString(),
    }
    learningPathStorage.saveTopicProgress(pathId, activeTopic.id, progress)
    pushProgress(user.id, pathId, activeTopic.id, progress)
    setFeedbackData(result)
    setStep('feedback')
  }

  function handleFeedbackContinue() {
    setActiveTopic(null)
    setFeedbackData(null)
    setStep('overview')
  }

  function handleRetry() {
    setStep('lesson')
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentPage="library" user={user} onNavigate={onNavigate} />

      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Back nav */}
        <button
          onClick={() => {
            if (step === 'overview' || !activeTopic) {
              onNavigate('library')
            } else {
              setStep('overview')
              setActiveTopic(null)
            }
          }}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-5 transition-colors"
        >
          <ChevronLeft size={16} />
          {step === 'overview' ? 'Study Library' : 'Back to Overview'}
        </button>

        {/* ── Overview ───────────────────────────────────────────────────── */}
        {step === 'overview' && (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Grade 10 · Mathematics</p>
              <h1 className="text-2xl font-black text-slate-900">Algebra</h1>
              <p className="text-sm text-slate-500 mt-1">{algebraLearningPath.description}</p>
            </div>

            <AlgebraProgressCard onNavigate={onNavigate} />

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Topics</p>
              {algebraLearningPath.topics.map(topic => {
                const status = getTopicStatus(topic.id)
                const unlocked = isTopicUnlocked(topic)
                return (
                  <button
                    key={topic.id}
                    data-topic={topic.id}
                    onClick={() => handleTopicClick(topic)}
                    disabled={!unlocked}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                      unlocked
                        ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                        : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">
                      {unlocked ? getStatusIcon(status) : <Lock size={16} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{topic.title}</p>
                      <p className={`text-xs font-medium mt-0.5 ${getStatusColor(status)}`}>
                        {unlocked ? getStatusLabel(status) : 'Complete previous topic to unlock'}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-400">Topic {topic.order}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Active topic steps ─────────────────────────────────────────── */}
        {activeTopic && step === 'diagnostic' && (
          <DiagnosticQuiz
            topicTitle={activeTopic.title}
            questions={activeTopic.diagnosticQuestions}
            onComplete={handleDiagnosticComplete}
          />
        )}

        {activeTopic && step === 'lesson' && (
          <div className="space-y-4">
            <p className="text-lg font-bold text-slate-800">{activeTopic.title}</p>
            <LessonBlock
              conceptBlock={activeTopic.conceptBlock}
              onContinue={() => setStep('guided')}
            />
          </div>
        )}

        {activeTopic && step === 'guided' && (
          <GuidedPractice
            items={activeTopic.guidedPractice}
            onComplete={() => setStep('independent')}
          />
        )}

        {activeTopic && step === 'independent' && (
          <IndependentPractice
            questions={activeTopic.independentPractice}
            onComplete={handleIndependentComplete}
          />
        )}

        {activeTopic && step === 'feedback' && feedbackData && (
          <SmartFeedback
            topicTitle={activeTopic.title}
            correct={feedbackData.correct}
            total={feedbackData.total}
            hintsUsed={feedbackData.hintsUsed}
            status={feedbackData.status}
            onContinue={handleFeedbackContinue}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  )
}

export default withAuth(DemoLearningPage)
