import React from 'react';
import { BookOpen } from 'lucide-react';
import { VisualizationComponent } from './Visualization';
import type { Topic } from '../../data/studyLibrary';

interface ConceptExplanationProps {
  title: string;
  content: string;
  visualizations?: Topic['visualizations'];
}

export const ConceptExplanation: React.FC<ConceptExplanationProps> = ({ title, content, visualizations }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-slate-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        </div>

        <div className="prose prose-sm max-w-none text-slate-700 space-y-4">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>

      {visualizations && visualizations.length > 0 && (
        <VisualizationComponent visualizations={visualizations} />
      )}
    </div>
  );
};
