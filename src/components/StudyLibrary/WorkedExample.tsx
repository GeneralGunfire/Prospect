import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import type { WorkedExample } from '../../data/studyLibrary';

interface WorkedExampleProps {
  example: WorkedExample;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

export const WorkedExampleComponent: React.FC<WorkedExampleProps> = ({ example }) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));

  const toggleStep = (stepNum: number) => {
    const newSet = new Set(expandedSteps);
    if (newSet.has(stepNum)) {
      newSet.delete(stepNum);
    } else {
      newSet.add(stepNum);
    }
    setExpandedSteps(newSet);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">{example.title}</h3>
          <p className="text-sm text-slate-600 mb-3">{example.problem}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${difficultyColors[example.difficulty]}`}>
          {example.difficulty}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        {example.steps.map((step) => (
          <div key={step.step} className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleStep(step.step)}
              className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3 text-left flex-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
                  {step.step}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{step.action}</p>
                  <p className="text-xs text-slate-600">{step.explanation}</p>
                </div>
              </div>
              {expandedSteps.has(step.step) ? (
                <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
              )}
            </button>

            {expandedSteps.has(step.step) && step.work && (
              <div className="px-4 py-3 bg-blue-50 border-t border-slate-200">
                <p className="font-mono text-sm text-slate-700 whitespace-pre-wrap">{step.work}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {example.commonMistakes && example.commonMistakes.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-2">Common Mistakes:</h4>
              <ul className="space-y-1">
                {example.commonMistakes.map((mistake, i) => (
                  <li key={i} className="text-sm text-red-800">• {mistake}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-green-900 mb-1">Answer:</p>
        <p className="text-lg font-bold text-green-700">{example.answer}</p>
      </div>
    </div>
  );
};
