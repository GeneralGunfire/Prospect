import React from 'react';
import { getVisualizationComponent } from './Visualizations';
import type { Topic } from '../../data/studyLibrary';

interface VisualizationProps {
  visualizations: Topic['visualizations'];
}

export const VisualizationComponent: React.FC<VisualizationProps> = ({ visualizations }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!visualizations || visualizations.length === 0) {
    return null;
  }

  const current = visualizations[currentIndex];
  const Component = getVisualizationComponent(current.svgComponent);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mt-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{current.title}</h3>
        <p className="text-sm text-slate-600">{current.description}</p>
      </div>

      <Component />

      {visualizations.length > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 border-2 border-slate-200 text-slate-900 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            ← Previous
          </button>

          <div className="flex gap-1">
            {visualizations.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-blue-600 w-6' : 'bg-slate-300'}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentIndex(Math.min(visualizations.length - 1, currentIndex + 1))}
            disabled={currentIndex === visualizations.length - 1}
            className="px-4 py-2 border-2 border-slate-200 text-slate-900 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};
