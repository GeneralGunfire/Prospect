import React, { useState } from 'react';
import { motion } from 'motion/react';

// PPC Interactive Visualization
export const PPCInteractiveVisualization: React.FC = () => {
  const [cornProduction, setCornProduction] = useState(60);

  // PPC curve equation (simplified quadratic)
  const calculateGuns = (corn: number) => {
    return Math.max(0, 100 - (corn * corn) / 50);
  };

  const gunsProduction = calculateGuns(cornProduction);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">Production Possibility Curve</h3>

      {/* PPC Graph */}
      <div className="bg-white border-2 border-orange-300 rounded-lg p-6">
        <svg viewBox="0 0 400 300" className="w-full">
          {/* Grid */}
          {[...Array(5)].map((_, i) => (
            <React.Fragment key={`grid${i}`}>
              <line x1="50" y1={50 + i * 50} x2="350" y2={50 + i * 50} stroke="#e2e8f0" strokeWidth="1" />
              <line x1={50 + i * 60} y1="50" x2={50 + i * 60} y2="250" stroke="#e2e8f0" strokeWidth="1" />
            </React.Fragment>
          ))}

          {/* Axes */}
          <line x1="50" y1="250" x2="350" y2="250" stroke="#1e293b" strokeWidth="3" />
          <line x1="50" y1="50" x2="50" y2="250" stroke="#1e293b" strokeWidth="3" />

          {/* Axis labels */}
          <text x="360" y="255" fontSize="14" fontWeight="bold" fill="#1e293b">Corn</text>
          <text x="30" y="40" fontSize="14" fontWeight="bold" fill="#1e293b">Guns</text>

          {/* PPC Curve */}
          <path
            d="M 50 50 Q 150 70 200 150 T 350 250"
            fill="none"
            stroke="#f97316"
            strokeWidth="4"
          />

          {/* Current production point */}
          <motion.circle
            cx={50 + (cornProduction / 100) * 300}
            cy={250 - (gunsProduction / 100) * 200}
            r="6"
            fill="#ef4444"
            whileHover={{ r: 8 }}
          />

          {/* Efficient zone (on curve) */}
          <motion.text
            x={50 + (cornProduction / 100) * 300}
            y={250 - (gunsProduction / 100) * 200 - 20}
            fontSize="12"
            fontWeight="bold"
            fill="#ef4444"
            textAnchor="middle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Efficient
          </motion.text>

          {/* Inefficient zone indicator (inside curve) */}
          <circle cx="150" cy="200" r="4" fill="#fbbf24" opacity="0.5" />
          <text x="160" y="205" fontSize="11" fill="#b45309">Inefficient</text>

          {/* Impossible zone indicator (outside curve) */}
          <circle cx="300" cy="80" r="4" fill="#ef4444" opacity="0.5" />
          <text x="310" y="85" fontSize="11" fill="#dc2626">Impossible</text>
        </svg>
      </div>

      {/* Controls and Display */}
      <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700">Corn Production: {cornProduction} units</label>
            <input
              type="range"
              min="0"
              max="100"
              value={cornProduction}
              onChange={(e) => setCornProduction(Number(e.target.value))}
              className="w-full h-2 bg-orange-300 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <motion.div
              className="bg-blue-100 border border-blue-300 rounded p-3 text-center"
              key={cornProduction}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <p className="text-xs text-slate-600 font-semibold">CORN</p>
              <p className="text-2xl font-bold text-blue-700">{cornProduction}</p>
              <p className="text-xs text-slate-500">units</p>
            </motion.div>

            <motion.div
              className="bg-red-100 border border-red-300 rounded p-3 text-center"
              key={Math.round(gunsProduction)}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <p className="text-xs text-slate-600 font-semibold">GUNS</p>
              <p className="text-2xl font-bold text-red-700">{Math.round(gunsProduction)}</p>
              <p className="text-xs text-slate-500">units</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-600 bg-blue-50 border border-blue-300 p-3 rounded">
        <p><strong>Key Insight:</strong> As you increase corn production, guns production decreases. This demonstrates the trade-off and opportunity cost concept.</p>
      </div>
    </div>
  );
};

// Circular Flow Animation
export const CircularFlowAnimationVisualization: React.FC = () => {
  const [spending, setSpending] = useState(50);

  const flowSpeed = (spending / 100) * 8 + 2;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">Circular Flow of Income</h3>

      {/* Circular Flow Diagram */}
      <div className="bg-white border-2 border-purple-300 rounded-lg p-6">
        <svg viewBox="0 0 400 300" className="w-full">
          {/* Households box */}
          <rect x="50" y="100" width="100" height="80" fill="#e9d5ff" stroke="#a855f7" strokeWidth="2" rx="8" />
          <text x="100" y="135" fontSize="14" fontWeight="bold" fill="#1e293b" textAnchor="middle">HOUSEHOLDS</text>
          <text x="100" y="155" fontSize="11" fill="#64748b" textAnchor="middle">(Workers)</text>

          {/* Firms box */}
          <rect x="250" y="100" width="100" height="80" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="8" />
          <text x="300" y="135" fontSize="14" fontWeight="bold" fill="#1e293b" textAnchor="middle">FIRMS</text>
          <text x="300" y="155" fontSize="11" fill="#64748b" textAnchor="middle">(Businesses)</text>

          {/* Top flow - Money from Firms to Households (Wages) */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#22c55e" />
            </marker>
            <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
            </marker>
          </defs>

          {/* Wages flow (top - Firms to Households) */}
          <motion.path
            d="M 250 120 Q 200 80 150 100"
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
            strokeDasharray="10"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -flowSpeed * 2 }}
            transition={{ repeat: Infinity, duration: flowSpeed, ease: 'linear' }}
          />
          <text x="190" y="75" fontSize="11" fontWeight="bold" fill="#22c55e">Wages</text>

          {/* Spending flow (bottom - Households to Firms) */}
          <motion.path
            d="M 150 180 Q 200 220 250 200"
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            markerEnd="url(#arrowhead2)"
            strokeDasharray="10"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -flowSpeed * 2 }}
            transition={{ repeat: Infinity, duration: flowSpeed, ease: 'linear' }}
          />
          <text x="190" y="240" fontSize="11" fontWeight="bold" fill="#ef4444">Spending</text>

          {/* Money amounts */}
          <motion.text x="130" y="95" fontSize="12" fontWeight="bold" fill="#22c55e" key={spending}>
            R{Math.round((spending / 100) * 100000)}
          </motion.text>
          <motion.text x="200" y="205" fontSize="12" fontWeight="bold" fill="#ef4444" key={spending + 0.5}>
            R{Math.round((spending / 100) * 100000)}
          </motion.text>
        </svg>
      </div>

      {/* Spending Control */}
      <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4">
        <label className="text-sm font-bold text-slate-700 block mb-2">Consumer Spending Level: {spending}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={spending}
          onChange={(e) => setSpending(Number(e.target.value))}
          className="w-full h-2 bg-purple-400 rounded-lg cursor-pointer"
        />
      </div>

      {/* Status */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="bg-green-50 border border-green-300 rounded-lg p-3 text-center"
          key={spending}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <p className="text-xs text-slate-600 font-semibold">INCOME FLOW SPEED</p>
          <p className="text-lg font-bold text-green-700">
            {spending < 30 ? 'Low' : spending < 70 ? 'Medium' : 'High'}
          </p>
        </motion.div>

        <motion.div
          className="bg-blue-50 border border-blue-300 rounded-lg p-3 text-center"
          key={spending + 1}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <p className="text-xs text-slate-600 font-semibold">ECONOMIC TREND</p>
          <p className="text-lg font-bold text-blue-700">
            {spending < 40 ? 'Recession' : spending < 70 ? 'Normal' : 'Growth'}
          </p>
        </motion.div>
      </div>

      <div className="text-xs text-slate-600 bg-blue-50 border border-blue-300 p-3 rounded">
        <p><strong>Insight:</strong> More spending → More income for firms → More hiring → More wages → Faster flow. Less spending → Economic slowdown.</p>
      </div>
    </div>
  );
};

// Scarcity Visualizer
export const ScarcityVisualization: React.FC = () => {
  const [people, setPeople] = useState(1);
  const [resources] = useState(10);

  const wants = people * 8;
  const scarcityGap = Math.max(0, wants - resources);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">Scarcity: The Economic Problem</h3>

      {/* Visualization */}
      <div className="bg-white border-2 border-red-300 rounded-lg p-8">
        <svg viewBox="0 0 400 200" className="w-full">
          {/* Resources bar */}
          <g>
            <text x="10" y="30" fontSize="12" fontWeight="bold" fill="#1e293b">Resources</text>
            <rect x="150" y="15" width={resources * 15} height="30" fill="#10b981" />
            <text x="370" y="35" fontSize="12" fontWeight="bold" fill="#10b981">Fixed</text>
          </g>

          {/* Wants bar */}
          <g>
            <text x="20" y="100" fontSize="12" fontWeight="bold" fill="#1e293b">Wants</text>
            <motion.rect
              x="150"
              y="85"
              width={wants * 3}
              height="30"
              fill="#ef4444"
              initial={{ width: 50 }}
              animate={{ width: wants * 3 }}
              transition={{ type: 'spring' }}
            />
            <motion.text
              x={150 + Math.max(wants * 3, 50) + 10}
              y="105"
              fontSize="12"
              fontWeight="bold"
              fill="#ef4444"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Grows
            </motion.text>
          </g>

          {/* Scarcity gap (red zone) */}
          <motion.rect
            x={150 + resources * 15}
            y="85"
            width={scarcityGap * 3}
            height="30"
            fill="#fca5a5"
            opacity="0.5"
            initial={{ width: 0 }}
            animate={{ width: scarcityGap * 3 }}
          />

          {/* Labels */}
          <text x={150 + resources * 15 + (scarcityGap * 3) / 2} y="130" fontSize="11" fontWeight="bold" fill="#dc2626" textAnchor="middle">
            SCARCITY GAP
          </text>
        </svg>
      </div>

      {/* Control */}
      <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
        <label className="text-sm font-bold text-slate-700 block mb-2">Number of People: {people}</label>
        <input
          type="range"
          min="1"
          max="5"
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
          className="w-full h-2 bg-red-400 rounded-lg cursor-pointer"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-green-50 border border-green-300 rounded p-3 text-center">
          <p className="text-xs text-slate-600 font-semibold">RESOURCES</p>
          <p className="text-2xl font-bold text-green-700">{resources}</p>
        </div>
        <div className="bg-red-50 border border-red-300 rounded p-3 text-center">
          <p className="text-xs text-slate-600 font-semibold">WANTS</p>
          <p className="text-2xl font-bold text-red-700">{wants}</p>
        </div>
        <div className="bg-orange-50 border border-orange-300 rounded p-3 text-center">
          <p className="text-xs text-slate-600 font-semibold">GAP</p>
          <p className="text-2xl font-bold text-orange-700">{scarcityGap}</p>
        </div>
      </div>

      <div className="text-xs text-slate-600 bg-yellow-50 border border-yellow-300 p-3 rounded">
        <p><strong>Key Insight:</strong> As population grows, wants increase exponentially but resources remain fixed. This gap is scarcity—the fundamental economic problem.</p>
      </div>
    </div>
  );
};
