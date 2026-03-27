import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { WorkedExample as IWorkedExample } from '../../types/lesson'
import { cn } from '../../lib/utils'

interface WorkedExampleProps {
  example: IWorkedExample
  currentIndex: number
  totalExamples: number
  onNext: () => void
  onPrev: () => void
}

export const WorkedExample: React.FC<WorkedExampleProps> = ({
  example,
  currentIndex,
  totalExamples,
  onNext,
  onPrev,
}) => {
  const [expandedStep, setExpandedStep] = useState(0)
  const [showSolution, setShowSolution] = useState(false)

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-lg font-bold text-navy uppercase tracking-tight">Example {currentIndex + 1}</h2>
            <span className={cn(
              'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest',
              example.level === 'basic'
                ? 'bg-green-100 text-green-800'
                : example.level === 'intermediate'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            )}>
              {example.level}
            </span>
          </div>
          <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">
            {currentIndex + 1} of {totalExamples}
          </p>
        </div>
      </div>

      {/* Question */}
      <div className="bg-navy/5 rounded-2xl p-6 mb-8 border-l-4 border-secondary">
        <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Question</p>
        <p className="text-lg font-bold text-navy">{example.question}</p>
      </div>

      {/* Solution Steps */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-bold text-navy uppercase tracking-tight mb-6">Solution</h3>
        {example.solution.map((step, idx) => (
          <div key={idx}>
            <button
              onClick={() => setExpandedStep(expandedStep === idx ? -1 : idx)}
              className="w-full flex items-start justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <div className="flex items-start gap-4 flex-grow">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-sm',
                  step.color || 'bg-navy'
                )}>
                  {idx + 1}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-navy">{step.step}</p>
                </div>
              </div>
              <ChevronDown className={cn(
                'w-4 h-4 text-navy transition-transform',
                expandedStep === idx && 'rotate-180'
              )} />
            </button>

            {expandedStep === idx && (
              <div className="mt-2 ml-12 p-4 bg-secondary/5 rounded-2xl border border-secondary/20">
                <p className="text-sm text-navy font-medium">= {step.result}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Full Solution */}
      <div className="bg-secondary/10 rounded-2xl p-6 mb-8 border border-secondary/30">
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="w-full flex items-center justify-between"
        >
          <span className="font-bold text-navy">Full Solution</span>
          <ChevronDown className={cn(
            'w-4 h-4 text-navy transition-transform',
            showSolution && 'rotate-180'
          )} />
        </button>
        {showSolution && (
          <div className="mt-4 pt-4 border-t border-secondary/30">
            <p className="text-sm text-navy/70 leading-relaxed mb-4">{example.explanation}</p>
            <div className="bg-white rounded-xl p-4 text-center font-bold text-secondary">
              Final Answer: {example.solution[example.solution.length - 1].result}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all',
            currentIndex === 0
              ? 'bg-slate-100 text-navy/30 cursor-not-allowed'
              : 'bg-navy text-white hover:shadow-lg'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">
          Example {currentIndex + 1}/{totalExamples}
        </span>

        <button
          onClick={onNext}
          disabled={currentIndex === totalExamples - 1}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all',
            currentIndex === totalExamples - 1
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
