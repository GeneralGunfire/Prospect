import React from 'react';
import {
  RopeWaveAnimation,
  ParticleMotionVisualization,
  WavePropertiesInteractive,
  TransverseVsLongitudinalComparison,
  SpringCompressionVisualization,
  SoundWaveVisualization,
  LongitudinalWaveProperties,
  ComprehensiveWavePropertiesExplorer,
  EMSpectrumVisualization
} from './PhysicsVisualizations';
import {
  ThreeDToTwoDVisualization,
  PerpendiculerConstructionVisualization,
  FileStructureVisualization
} from './EGDVisualizations';
import {
  TAccountAnimatorVisualization,
  BalanceScaleVisualization,
  JournalEntryFlowVisualization
} from './AccountingVisualizations';
import {
  PPCInteractiveVisualization,
  CircularFlowAnimationVisualization,
  ScarcityVisualization
} from './EconomicsVisualizations';
import {
  DichotomousKeyVisualization,
  ClassificationTreeVisualization,
  BiodiversityPyramidVisualization
} from './LifeSciencesVisualizations';
import {
  SentenceDiagrammerVisualization,
  EssayStructureVisualization,
  LiteraryDevicesVisualization
} from './EnglishVisualizations';

// Simple visualization components for Grade 10 Mathematics
// These are placeholder implementations that display educational graphics

export const ExponentBlocksVisualization: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Understanding Exponents</h3>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-700 font-semibold mb-3">2³ = 2 × 2 × 2 = 8</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                2
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-700 font-semibold mb-3">2⁶ = 2 × 2 × 2 × 2 × 2 × 2 = 64</p>
          <div className="flex justify-center gap-2 flex-wrap max-w-xs mx-auto">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-600 mt-6">The exponent tells us how many times to multiply the base</p>
    </div>
  );
};

export const AlgebraTilesVisualization: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 text-center">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Expanding (x + 2)(x + 3) with Algebra Tiles</h3>
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
          <div className="bg-blue-400 rounded-lg p-4 text-white text-center font-bold h-24 flex items-center justify-center">
            x²
          </div>
          <div className="bg-green-400 rounded-lg p-4 text-white text-center font-bold h-24 flex items-center justify-center flex-col gap-1">
            <span>3x</span>
            <span className="text-xs">(3 rectangles)</span>
          </div>
          <div className="bg-green-400 rounded-lg p-4 text-white text-center font-bold h-24 flex items-center justify-center flex-col gap-1">
            <span>2x</span>
            <span className="text-xs">(2 rectangles)</span>
          </div>
          <div className="bg-yellow-400 rounded-lg p-4 text-white text-center font-bold h-24 flex items-center justify-center flex-col gap-1">
            <span>6</span>
            <span className="text-xs">(6 unit squares)</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-700 font-semibold">Result: x² + 3x + 2x + 6 = x² + 5x + 6</p>
    </div>
  );
};

export const FactoringTilesVisualization: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 text-center">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Factorization: Reverse the Process</h3>
      <p className="text-sm text-slate-700 mb-6">x² + 5x + 6 can be arranged as a rectangle:</p>
      <div className="max-w-sm mx-auto mb-6">
        <div className="bg-white border-4 border-orange-500 rounded-lg p-4">
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)' }}>
            <div className="bg-blue-400 rounded text-white font-bold text-sm h-12 flex items-center justify-center">x²</div>
            <div className="bg-green-400 rounded text-white font-bold text-sm h-12 flex items-center justify-center">x</div>
            <div className="bg-green-400 rounded text-white font-bold text-sm h-12 flex items-center justify-center">x</div>
            <div className="bg-green-400 rounded text-white font-bold text-sm h-12 flex items-center justify-center">x</div>
            <div className="bg-yellow-400 rounded text-white font-bold text-sm h-12 flex items-center justify-center">1</div>
            <div className="bg-yellow-400 rounded text-white font-bold text-sm h-12 flex items-center justify-center">1</div>
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-700 font-semibold">Forms: (x + 2)(x + 3)</p>
    </div>
  );
};

export const SequenceBlocksVisualization: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 text-center">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Arithmetic Sequence Pattern</h3>
      <p className="text-sm text-slate-700 mb-6">Sequence: 2, 5, 8, 11, 14, ... (d = 3)</p>
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {[2, 5, 8, 11, 14].map((num, i) => (
          <div key={i} className="text-center">
            <div className="bg-indigo-500 text-white rounded-lg p-4 w-12 h-12 flex items-center justify-center font-bold">
              {num}
            </div>
            <p className="text-xs text-slate-600 mt-1">T{i + 1}</p>
          </div>
        ))}
      </div>
      <div className="text-sm text-slate-700">
        <p className="mb-2">Each term increases by 3</p>
        <p className="text-xs text-slate-600">Formula: Tn = 2 + (n - 1) × 3</p>
      </div>
    </div>
  );
};

export const LinearFunctionVisualization: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 text-center">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Linear Function Graph</h3>
      <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-sm mx-auto">
        <svg viewBox="0 0 200 200" className="w-full" style={{ maxWidth: '300px' }}>
          {/* Grid */}
          {[...Array(5)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40 + 20} x2="200" y2={i * 40 + 20} stroke="#e2e8f0" strokeWidth="1" />
          ))}
          {[...Array(5)].map((_, i) => (
            <line key={`v${i}`} x1={i * 40 + 20} y1="0" x2={i * 40 + 20} y2="200" stroke="#e2e8f0" strokeWidth="1" />
          ))}

          {/* Axes */}
          <line x1="20" y1="180" x2="200" y2="180" stroke="#1e293b" strokeWidth="2" />
          <line x1="20" y1="20" x2="20" y2="180" stroke="#1e293b" strokeWidth="2" />

          {/* Line: y = 2x + 1 */}
          <line x1="28" y1="156" x2="188" y2="36" stroke="#ef4444" strokeWidth="3" />

          {/* Points */}
          <circle cx="28" cy="156" r="4" fill="#ef4444" />
          <circle cx="108" cy="96" r="4" fill="#ef4444" />
          <circle cx="188" cy="36" r="4" fill="#ef4444" />

          {/* Y-intercept label */}
          <text x="25" y="170" fontSize="12" fill="#1e293b" fontWeight="bold">c=1</text>
        </svg>
      </div>
      <p className="text-sm text-slate-700 mt-4">f(x) = 2x + 1</p>
      <p className="text-xs text-slate-600">Slope = 2, y-intercept = 1</p>
    </div>
  );
};

export const QuadraticFunctionVisualization: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 text-center">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Quadratic Function - Parabola</h3>
      <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-sm mx-auto">
        <svg viewBox="0 0 200 200" className="w-full" style={{ maxWidth: '300px' }}>
          {/* Grid */}
          {[...Array(5)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40 + 20} x2="200" y2={i * 40 + 20} stroke="#e2e8f0" strokeWidth="1" />
          ))}
          {[...Array(5)].map((_, i) => (
            <line key={`v${i}`} x1={i * 40 + 20} y1="0" x2={i * 40 + 20} y2="200" stroke="#e2e8f0" strokeWidth="1" />
          ))}

          {/* Axes */}
          <line x1="20" y1="140" x2="200" y2="140" stroke="#1e293b" strokeWidth="2" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="#1e293b" strokeWidth="2" />

          {/* Parabola: y = -(x-2)²/20 + 60 */}
          <path d="M 40 180 Q 70 90 100 50 Q 130 90 160 180" stroke="#0ea5e9" strokeWidth="3" fill="none" />

          {/* Vertex */}
          <circle cx="100" cy="50" r="5" fill="#0ea5e9" />

          {/* Axis of symmetry */}
          <line x1="100" y1="50" x2="100" y2="140" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="5,5" />

          {/* Labels */}
          <text x="98" y="45" fontSize="12" fill="#1e293b" fontWeight="bold">Vertex</text>
        </svg>
      </div>
      <p className="text-sm text-slate-700 mt-4">f(x) = -x² + 4x - 1</p>
      <p className="text-xs text-slate-600">Opens downward, vertex at (2, 3)</p>
    </div>
  );
};

export const InequalityNumberLineVisualization: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 text-center">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Inequality on a Number Line</h3>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-700 font-semibold mb-4">x &gt; 3</p>
          <svg viewBox="0 0 300 40" className="w-full">
            {/* Line */}
            <line x1="20" y1="20" x2="280" y2="20" stroke="#1e293b" strokeWidth="2" />

            {/* Numbers */}
            {[0, 1, 2, 3, 4, 5, 6].map(num => (
              <g key={num}>
                <line x1={20 + num * 40} y1="15" x2={20 + num * 40} y2="25" stroke="#1e293b" strokeWidth="2" />
                <text x={20 + num * 40} y="35" fontSize="12" textAnchor="middle" fill="#1e293b">
                  {num}
                </text>
              </g>
            ))}

            {/* Open circle at 3 */}
            <circle cx="140" cy="20" r="6" fill="none" stroke="#ef4444" strokeWidth="2" />

            {/* Arrow showing x > 3 */}
            <line x1="146" y1="20" x2="280" y2="20" stroke="#ef4444" strokeWidth="3" />
            <polygon points="280,20 270,16 270,24" fill="#ef4444" />
          </svg>
        </div>

        <div>
          <p className="text-sm text-slate-700 font-semibold mb-4">x &le; 4</p>
          <svg viewBox="0 0 300 40" className="w-full">
            {/* Line */}
            <line x1="20" y1="20" x2="280" y2="20" stroke="#1e293b" strokeWidth="2" />

            {/* Numbers */}
            {[0, 1, 2, 3, 4, 5, 6].map(num => (
              <g key={num}>
                <line x1={20 + num * 40} y1="15" x2={20 + num * 40} y2="25" stroke="#1e293b" strokeWidth="2" />
                <text x={20 + num * 40} y="35" fontSize="12" textAnchor="middle" fill="#1e293b">
                  {num}
                </text>
              </g>
            ))}

            {/* Closed circle at 4 */}
            <circle cx="180" cy="20" r="5" fill="#22c55e" />

            {/* Arrow showing x ≤ 4 */}
            <line x1="175" y1="20" x2="20" y2="20" stroke="#22c55e" strokeWidth="3" />
            <polygon points="20,20 30,16 30,24" fill="#22c55e" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const ModellingStepsVisualization: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">The Mathematical Modelling Process</h3>
      <div className="space-y-4 max-w-2xl mx-auto">
        {[
          { num: 1, title: 'Identify the Problem', desc: 'Understand what you need to find' },
          { num: 2, title: 'Define Variables', desc: 'Let x = ..., Let y = ...' },
          { num: 3, title: 'Write Equation', desc: 'Translate problem to mathematics' },
          { num: 4, title: 'Solve', desc: 'Use algebra to find the answer' },
          { num: 5, title: 'Interpret', desc: 'Explain what answer means' },
          { num: 6, title: 'Check', desc: 'Does the answer make sense?' }
        ].map((step) => (
          <div key={step.num} className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
              {step.num}
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">{step.title}</p>
              <p className="text-sm text-slate-600">{step.desc}</p>
            </div>
            {step.num < 6 && <div className="w-0.5 h-12 bg-purple-200 -ml-5 -mr-5" />}
          </div>
        ))}
      </div>
    </div>
  );
};

// Export a function to get the right visualization component
export function getVisualizationComponent(componentName: string): React.ComponentType<{}> {
  const components: Record<string, React.ComponentType<{}>> = {
    // Mathematics
    ExponentBlocksVisualization,
    AlgebraTilesVisualization,
    FactoringTilesVisualization,
    SequenceBlocksVisualization,
    LinearFunctionVisualization,
    QuadraticFunctionVisualization,
    InequalityNumberLineVisualization,
    ModellingStepsVisualization,
    ArithmeticFormulaVisualization: LinearFunctionVisualization,
    SumVisualization: SequenceBlocksVisualization,
    FunctionMappingVisualization: LinearFunctionVisualization,
    SlopeVisualization: LinearFunctionVisualization,
    RealWorldGraphVisualization: LinearFunctionVisualization,
    InterpretationGuideVisualization: LinearFunctionVisualization,
    // Physics visualizations - Transverse
    RopeWaveAnimation,
    ParticleMotionVisualization,
    WavePropertiesInteractive,
    TransverseVsLongitudinalComparison,
    // Physics visualizations - Longitudinal
    SpringCompressionVisualization,
    SoundWaveVisualization,
    LongitudinalWaveProperties,
    // Physics visualizations - Wave Properties & EM Spectrum
    ComprehensiveWavePropertiesExplorer,
    EMSpectrumVisualization,
    // EGD (Engineering Graphics & Design)
    ThreeDToTwoDVisualization,
    PerpendiculerConstructionVisualization,
    FileStructureVisualization,
    // Accounting
    TAccountAnimatorVisualization,
    BalanceScaleVisualization,
    JournalEntryFlowVisualization,
    // Economics
    PPCInteractiveVisualization,
    CircularFlowAnimationVisualization,
    ScarcityVisualization,
    // Life Sciences
    DichotomousKeyVisualization,
    ClassificationTreeVisualization,
    BiodiversityPyramidVisualization,
    // English
    SentenceDiagrammerVisualization,
    EssayStructureVisualization,
    LiteraryDevicesVisualization,
  };

  return components[componentName] || (() => (
    <div className="bg-slate-100 rounded-2xl p-8 text-center text-slate-600">
      <p>Visualization: {componentName}</p>
    </div>
  ));
}
