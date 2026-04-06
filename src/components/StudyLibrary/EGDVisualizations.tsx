import React, { useState } from 'react';
import { motion } from 'motion/react';

// CRITICAL: 3D to Orthographic Projection Converter
export const ThreeDToTwoDVisualization: React.FC = () => {
  const [rotationX, setRotationX] = useState(15);
  const [rotationY, setRotationY] = useState(30);

  // Simple cube vertices
  const vertices = [
    { x: -1, y: -1, z: -1 }, // 0
    { x: 1, y: -1, z: -1 },  // 1
    { x: 1, y: 1, z: -1 },   // 2
    { x: -1, y: 1, z: -1 },  // 3
    { x: -1, y: -1, z: 1 },  // 4
    { x: 1, y: -1, z: 1 },   // 5
    { x: 1, y: 1, z: 1 },    // 6
    { x: -1, y: 1, z: 1 },   // 7
  ];

  const rotatePoint = (p: any, rx: number, ry: number) => {
    const radX = rx * Math.PI / 180;
    const radY = ry * Math.PI / 180;

    let x = p.x, y = p.y, z = p.z;

    // Rotate around X
    let ty = y * Math.cos(radX) - z * Math.sin(radX);
    let tz = y * Math.sin(radX) + z * Math.cos(radX);

    // Rotate around Y
    let tx = x * Math.cos(radY) + tz * Math.sin(radY);
    tz = -x * Math.sin(radY) + tz * Math.cos(radY);

    return { x: tx, y: ty, z: tz };
  };

  const project = (p: any) => {
    const scale = 80 / (5 + p.z);
    return {
      x: p.x * scale + 100,
      y: -p.y * scale + 100,
    };
  };

  const rotated = vertices.map(v => rotatePoint(v, rotationX, rotationY));
  const projected = rotated.map(project);

  // Get top, front, side views
  const topView = vertices.map((v, i) => ({
    x: v.x * 40 + 50,
    y: v.z * 40 + 50,
    idx: i
  }));

  const frontView = vertices.map((v, i) => ({
    x: v.x * 40 + 50,
    y: -v.y * 40 + 50,
    idx: i
  }));

  const sideView = vertices.map((v, i) => ({
    x: v.z * 40 + 50,
    y: -v.y * 40 + 50,
    idx: i
  }));

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">3D to Orthographic Projection</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D View (Interactive) */}
        <motion.div
          className="bg-white border-2 border-blue-300 rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-xs font-semibold text-slate-600 mb-2">3D OBJECT (Drag to Rotate)</p>
          <svg viewBox="0 0 200 200" className="w-full border border-slate-200 rounded bg-white">
            {/* Cube edges */}
            <line x1={projected[0].x} y1={projected[0].y} x2={projected[1].x} y2={projected[1].y} stroke="#3b82f6" strokeWidth="2" />
            <line x1={projected[1].x} y1={projected[1].y} x2={projected[2].x} y2={projected[2].y} stroke="#3b82f6" strokeWidth="2" />
            <line x1={projected[2].x} y1={projected[2].y} x2={projected[3].x} y2={projected[3].y} stroke="#3b82f6" strokeWidth="2" />
            <line x1={projected[3].x} y1={projected[3].y} x2={projected[0].x} y2={projected[0].y} stroke="#3b82f6" strokeWidth="2" />

            <line x1={projected[4].x} y1={projected[4].y} x2={projected[5].x} y2={projected[5].y} stroke="#3b82f6" strokeWidth="2" />
            <line x1={projected[5].x} y1={projected[5].y} x2={projected[6].x} y2={projected[6].y} stroke="#3b82f6" strokeWidth="2" />
            <line x1={projected[6].x} y1={projected[6].y} x2={projected[7].x} y2={projected[7].y} stroke="#3b82f6" strokeWidth="2" />
            <line x1={projected[7].x} y1={projected[7].y} x2={projected[4].x} y2={projected[4].y} stroke="#3b82f6" strokeWidth="2" />

            <line x1={projected[0].x} y1={projected[0].y} x2={projected[4].x} y2={projected[4].y} stroke="#3b82f6" strokeWidth="2" />
            <line x1={projected[1].x} y1={projected[1].y} x2={projected[5].x} y2={projected[5].y} stroke="#3b82f6" strokeWidth="2" />
            <line x1={projected[2].x} y1={projected[2].y} x2={projected[6].x} y2={projected[6].y} stroke="#3b82f6" strokeWidth="2" />
            <line x1={projected[3].x} y1={projected[3].y} x2={projected[7].x} y2={projected[7].y} stroke="#3b82f6" strokeWidth="2" />

            {/* Vertices */}
            {projected.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3" fill="#ef4444" />
            ))}
          </svg>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">Rotate X: {rotationX}°</label>
              <input
                type="range"
                min="-90"
                max="90"
                value={rotationX}
                onChange={(e) => setRotationX(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Rotate Y: {rotationY}°</label>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotationY}
                onChange={(e) => setRotationY(Number(e.target.value))}
                className="w-full h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </motion.div>

        {/* Orthographic Views Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* TOP VIEW */}
          <motion.div
            className="bg-white border-2 border-green-300 rounded-lg p-3"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs font-bold text-slate-600 text-center mb-2">TOP VIEW</p>
            <svg viewBox="0 0 100 100" className="w-full border border-slate-200 rounded bg-white">
              {/* Cube outline from top */}
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="#22c55e" strokeWidth="2" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="#22c55e" strokeWidth="1" strokeDasharray="3" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="#22c55e" strokeWidth="1" strokeDasharray="3" />
            </svg>
          </motion.div>

          {/* FRONT VIEW */}
          <motion.div
            className="bg-white border-2 border-orange-300 rounded-lg p-3"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs font-bold text-slate-600 text-center mb-2">FRONT VIEW</p>
            <svg viewBox="0 0 100 100" className="w-full border border-slate-200 rounded bg-white">
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="#f97316" strokeWidth="2" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="#f97316" strokeWidth="1" strokeDasharray="3" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="#f97316" strokeWidth="1" strokeDasharray="3" />
            </svg>
          </motion.div>

          {/* SIDE VIEW */}
          <motion.div
            className="bg-white border-2 border-purple-300 rounded-lg p-3"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs font-bold text-slate-600 text-center mb-2">SIDE VIEW</p>
            <svg viewBox="0 0 100 100" className="w-full border border-slate-200 rounded bg-white">
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="#a855f7" strokeWidth="2" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="#a855f7" strokeWidth="1" strokeDasharray="3" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="#a855f7" strokeWidth="1" strokeDasharray="3" />
            </svg>
          </motion.div>

          {/* PERSPECTIVE */}
          <motion.div
            className="bg-white border-2 border-red-300 rounded-lg p-3"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs font-bold text-slate-600 text-center mb-2">ISOMETRIC</p>
            <svg viewBox="0 0 100 100" className="w-full border border-slate-200 rounded bg-white">
              {/* Simplified isometric cube */}
              <path d="M 50 20 L 80 35 L 80 65 L 50 80 L 20 65 L 20 35 Z" fill="none" stroke="#ef4444" strokeWidth="2" />
              <line x1="50" y1="20" x2="50" y2="80" stroke="#ef4444" strokeWidth="1" strokeDasharray="3" />
              <line x1="20" y1="35" x2="80" y2="35" stroke="#ef4444" strokeWidth="1" strokeDasharray="3" />
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded text-xs text-slate-700">
        <p><strong>How it works:</strong> Rotate the 3D cube using the sliders. Notice how the 2D views update in real-time, showing exactly what you would see from each angle. Dashed lines show hidden edges.</p>
      </div>
    </div>
  );
};

// Perpendicular Line Construction (Animated)
export const PerpendiculerConstructionVisualization: React.FC = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { label: 'Step 1: Set compass to any radius, draw arcs above and below the line', show: [0] },
    { label: 'Step 2: Increase compass radius, draw arcs from the arc intersections', show: [0, 1] },
    { label: 'Step 3: Draw a line through the arc intersections', show: [0, 1, 2] },
    { label: 'Step 4: Complete! The new line is perpendicular (90°)', show: [0, 1, 2, 3] },
  ];

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">Perpendicular Line Construction</h3>

      <div className="bg-white border-2 border-purple-300 rounded-lg p-6">
        <svg viewBox="0 0 400 300" className="w-full border border-slate-200 rounded bg-white">
          {/* Original line */}
          <line x1="50" y1="150" x2="350" y2="150" stroke="#1e293b" strokeWidth="3" />
          <text x="360" y="155" fontSize="14" fontWeight="bold" fill="#1e293b">AB</text>

          {/* Point on line */}
          <circle cx="200" cy="150" r="5" fill="#ef4444" />
          <text x="200" y="135" fontSize="12" fontWeight="bold" fill="#ef4444" textAnchor="middle">P</text>

          {/* Step 1: Initial arcs */}
          {step >= 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <circle cx="200" cy="150" r="40" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5" opacity="0.7" />
              <circle cx="200" cy="110" r="5" fill="#3b82f6" />
              <circle cx="200" cy="190" r="5" fill="#3b82f6" />
            </motion.g>
          )}

          {/* Step 2: Larger arcs */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <circle cx="200" cy="110" r="60" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5" opacity="0.7" />
              <circle cx="200" cy="190" r="60" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5" opacity="0.7" />
              <circle cx="140" cy="150" r="5" fill="#10b981" />
              <circle cx="260" cy="150" r="5" fill="#10b981" />
            </motion.g>
          )}

          {/* Step 3: Perpendicular line */}
          {step >= 2 && (
            <motion.line
              x1="200"
              y1="50"
              x2="200"
              y2="250"
              stroke="#ef4444"
              strokeWidth="3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Step 4: Right angle indicator */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <rect x="195" y="145" width="10" height="10" fill="none" stroke="#a855f7" strokeWidth="2" />
              <text x="180" y="175" fontSize="14" fontWeight="bold" fill="#a855f7">90°</text>
            </motion.g>
          )}
        </svg>
      </div>

      <motion.div
        className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 p-4 rounded-lg text-sm text-slate-800"
        key={step}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="font-bold mb-2">{steps[step].label}</p>
      </motion.div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition"
        >
          ← Previous
        </button>

        <div className="flex gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === step ? 'bg-purple-600 w-8' : 'bg-purple-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

// File Structure Explorer
export const FileStructureVisualization: React.FC = () => {
  const [expanded, setExpanded] = useState({ docs: true, school: true });

  const toggleFolder = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl space-y-4">
      <h3 className="text-xl font-bold text-slate-900">File Organization Structure</h3>

      <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm space-y-2">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-1 rounded" onClick={() => toggleFolder('docs')}>
          <span className="text-blue-600 font-bold">{expanded.docs ? '📁' : '📂'}</span>
          <span className="font-semibold text-slate-900">Documents/</span>
        </div>

        {expanded.docs && (
          <div className="ml-6 space-y-1 border-l-2 border-blue-300 pl-3">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-1 rounded" onClick={() => toggleFolder('school')}>
              <span className="text-blue-600 font-bold">{expanded.school ? '📁' : '📂'}</span>
              <span className="font-semibold text-slate-700">School/</span>
            </div>

            {expanded.school && (
              <div className="ml-6 space-y-1 border-l-2 border-green-300 pl-3">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600">📁</span>
                  <span className="text-slate-700">Grade 10/</span>
                </div>
                <div className="ml-6 space-y-1 border-l-2 border-green-300 pl-3">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">📄</span>
                    <span className="text-slate-700">Biology-Chapter3-Notes-2024.docx</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">✓ Good</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">📄</span>
                    <span className="text-slate-700">document1.docx</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">✗ Bad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">📊</span>
                    <span className="text-slate-700">Math-Algebra-Assignment-Draft1.xlsx</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">✓ Good</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-yellow-600">📁</span>
              <span className="text-slate-700">Work/</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">📁</span>
              <span className="text-slate-700">Personal/</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded text-sm text-slate-700">
        <p><strong>Naming Convention:</strong> Subject-Topic-Type-Date.extension</p>
        <p className="text-xs mt-1 text-slate-600">Example: English-Macbeth-Essay-2024-03-15.docx</p>
      </div>
    </div>
  );
};
