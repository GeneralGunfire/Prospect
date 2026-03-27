import React, { useEffect } from 'react'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimationData } from '../../types/lesson'
import { cn } from '../../lib/utils'

interface AnimatedExplainerProps {
  animation: AnimationData
  currentStep: number
  onNextStep: () => void
  onPrevStep: () => void
  onTogglePlayback: () => void
  onReset: () => void
  isPlaying: boolean
  totalSteps: number
}

export const AnimatedExplainer: React.FC<AnimatedExplainerProps> = ({
  animation,
  currentStep,
  onNextStep,
  onPrevStep,
  onTogglePlayback,
  onReset,
  isPlaying,
  totalSteps,
}) => {
  const currentStepData = animation.steps[currentStep]

  // Auto-advance animation
  useEffect(() => {
    if (!isPlaying || !currentStepData) return

    const delay = (currentStepData.duration || 3) * 1000
    const timer = setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        onNextStep()
      } else {
        onTogglePlayback() // Stop at end
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, currentStepData, totalSteps, onNextStep, onTogglePlayback])

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-navy uppercase tracking-tight mb-2">
          {animation.title}
        </h2>
        <p className="text-sm text-navy/60">
          Step {currentStep + 1} of {totalSteps} • {animation.duration}-minute animation
        </p>
      </div>

      {/* Animation Display */}
      <div className="bg-navy/5 rounded-2xl p-8 mb-8 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
        {/* SVG/Visual Container */}
        <div className="w-full h-full flex items-center justify-center">
          {currentStepData.visual ? (
            <div className="text-center">
              {/* If visual starts with <svg, render as HTML, else as text */}
              {currentStepData.visual.startsWith('<svg') ? (
                <div dangerouslySetInnerHTML={{ __html: currentStepData.visual }} />
              ) : (
                <p className="text-navy/60 font-medium">{currentStepData.visual}</p>
              )}
            </div>
          ) : (
            <div className="text-navy/40 text-sm">Visual loading...</div>
          )}
        </div>

        {/* Step Indicator */}
        <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold">
          {currentStep + 1}/{totalSteps}
        </div>
      </div>

      {/* Step Title and Narration */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-navy mb-3">{currentStepData.title}</h3>
        <p className="text-sm text-navy/70 leading-relaxed">{currentStepData.narration}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 mb-8 overflow-hidden">
        <div
          className="h-full bg-secondary transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onPrevStep}
          disabled={currentStep === 0}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all',
            currentStep === 0
              ? 'bg-slate-100 text-navy/30 cursor-not-allowed'
              : 'bg-navy text-white hover:shadow-lg'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-slate-100 text-navy hover:bg-slate-200 transition-all"
            title="Reset animation"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            onClick={onTogglePlayback}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-secondary text-white hover:shadow-lg transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play
              </>
            )}
          </button>
        </div>

        <button
          onClick={onNextStep}
          disabled={currentStep === totalSteps - 1}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all',
            currentStep === totalSteps - 1
              ? 'bg-slate-100 text-navy/30 cursor-not-allowed'
              : 'bg-navy text-white hover:shadow-lg'
          )}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
