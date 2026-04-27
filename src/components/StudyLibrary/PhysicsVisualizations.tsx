import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

// ============================================================================
// TRANSVERSE WAVES VISUALIZATIONS
// ============================================================================

/**
 * RopeWaveAnimation: Interactive rope wave simulation
 * User can shake rope end, see wave propagate with direction indicators
 */
export const RopeWaveAnimation: React.FC = () => {
  const [ropeY, setRopeY] = useState(0);
  const [wavePhase, setWavePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWavePhase(prev => (prev + 0.1) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Generate rope points for wave
  const points = Array.from({ length: 40 }, (_, i) => {
    const x = i * 25;
    const delay = i * 0.15; // Wave propagates left to right
    const y = Math.sin(wavePhase - delay) * 40; // Amplitude = 40px
    return `${x},${150 + y}`;
  }).join(' ');

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="font-bold text-slate-900 mb-4">Interactive Rope Wave</h4>
        <p className="text-sm text-slate-600 mb-4">Drag the rope end up and down to create waves:</p>

        <div className="flex items-center justify-center mb-6">
          <input
            type="range"
            min="-40"
            max="40"
            value={ropeY}
            onChange={(e) => setRopeY(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* SVG Canvas */}
        <svg viewBox="0 0 1000 300" className="w-full bg-blue-50 rounded border border-blue-200">
          {/* Grid */}
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={`grid-${i}`}
              x1={i * 100}
              y1="0"
              x2={i * 100}
              y2="300"
              stroke="#e0e7ff"
              strokeWidth="1"
            />
          ))}

          {/* Wave line */}
          <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" />

          {/* Rope end (where user controls) */}
          <circle cx="0" cy={150 + ropeY} r="8" fill="#ef4444" />

          {/* Direction arrows */}
          {/* Particle motion arrow (vertical) */}
          <motion.g
            animate={{ y: ropeY > 0 ? -20 : ropeY < 0 ? 20 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <line x1="30" y1="100" x2="30" y2={100 + ropeY} stroke="#3b82f6" strokeWidth="2" />
            <polygon points="30,110 25,100 35,100" fill="#3b82f6" />
          </motion.g>

          {/* Wave direction arrow (horizontal) */}
          <motion.g
            animate={{ x: 400 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <line x1="0" y1="280" x2="50" y2="280" stroke="#ef4444" strokeWidth="2" />
            <polygon points="50,280 40,275 40,285" fill="#ef4444" />
          </motion.g>

          {/* Labels */}
          <text x="30" y="60" fontSize="12" fill="#3b82f6" fontWeight="bold">Particle motion</text>
          <text x="400" y="310" fontSize="12" fill="#ef4444" fontWeight="bold">Wave direction</text>
        </svg>

        <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-slate-700">
          <p><strong>Blue arrow:</strong> Particles move up/down (perpendicular to wave)</p>
          <p><strong>Red arrow:</strong> Wave travels left/right</p>
        </div>
      </div>
    </div>
  );
};

/**
 * ParticleMotionVisualization: Show individual particle oscillating
 */
export const ParticleMotionVisualization: React.FC = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev + 0.05) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const particleY = Math.sin(phase) * 60;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h4 className="font-bold text-slate-900 mb-4">Individual Particle Motion</h4>
      <p className="text-sm text-slate-600 mb-4">Watch how one particle moves as the wave passes:</p>

      <svg viewBox="0 0 600 400" className="w-full bg-gradient-to-b from-blue-50 to-blue-100 rounded border border-blue-200">
        {/* Center line (rest position) */}
        <line x1="50" y1="200" x2="550" y2="200" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />

        {/* Amplitude markers */}
        <line x1="40" y1="140" x2="50" y2="140" stroke="#94a3b8" strokeWidth="1" />
        <text x="10" y="145" fontSize="12" fill="#64748b">+A</text>
        <line x1="40" y1="260" x2="50" y2="260" stroke="#94a3b8" strokeWidth="1" />
        <text x="10" y="265" fontSize="12" fill="#64748b">-A</text>

        {/* Oscillating particle */}
        <motion.circle
          cx="300"
          cy={200 + particleY}
          r="12"
          fill="#ef4444"
          animate={{ y: particleY }}
          transition={{ duration: 0 }}
        />

        {/* Motion path (circular) */}
        <circle cx="300" cy="200" r="60" fill="none" stroke="#dbeafe" strokeWidth="2" strokeDasharray="3,3" />

        {/* Vertical motion arrow */}
        <line x1="250" y1="140" x2="250" y2="260" stroke="#3b82f6" strokeWidth="2" />
        <polygon points="250,140 245,155 255,155" fill="#3b82f6" />
        <polygon points="250,260 245,245 255,245" fill="#3b82f6" />

        {/* Labels */}
        <text x="280" y="100" fontSize="14" fontWeight="bold" fill="#1e293b">Amplitude</text>
        <text x="200" y="200" fontSize="12" fill="#64748b">Particle</text>
        <text x="200" y="330" fontSize="12" fill="#64748b" fontWeight="bold">Frequency = 1 Hz (1 oscillation per second)</text>
      </svg>

      <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-slate-700">
        <p><strong>Key insight:</strong> The particle repeats the same up-and-down motion over and over.</p>
        <p>The wave travels horizontally, but this particle just oscillates vertically.</p>
      </div>
    </div>
  );
};

/**
 * WavePropertiesInteractive: Adjustable wave with labeled properties
 */
export const WavePropertiesInteractive: React.FC = () => {
  const [amplitude, setAmplitude] = useState(40);
  const [wavelength, setWavelength] = useState(150);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev + 0.05) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Generate wave points
  const points = Array.from({ length: 100 }, (_, i) => {
    const x = (i / 100) * 1000;
    const y = 200 + Math.sin((x / wavelength) * 2 * Math.PI + phase) * amplitude;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="font-bold text-slate-900 mb-4">Wave Properties</h4>

        {/* Amplitude Control */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="font-semibold text-slate-700">Amplitude (A)</label>
            <span className="text-blue-600 font-bold">{amplitude.toFixed(0)} px</span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            value={amplitude}
            onChange={(e) => setAmplitude(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-slate-600 mt-1">Maximum displacement from rest position</p>
        </div>

        {/* Wavelength Control */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="font-semibold text-slate-700">Wavelength (λ)</label>
            <span className="text-blue-600 font-bold">{wavelength.toFixed(0)} px</span>
          </div>
          <input
            type="range"
            min="80"
            max="300"
            value={wavelength}
            onChange={(e) => setWavelength(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-slate-600 mt-1">Distance from crest to crest</p>
        </div>

        {/* SVG Canvas */}
        <svg viewBox="0 0 1000 400" className="w-full bg-gradient-to-b from-blue-50 to-blue-100 rounded border border-blue-200 my-4">
          {/* Rest position line */}
          <line x1="0" y1="200" x2="1000" y2="200" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />

          {/* Wave */}
          <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" />

          {/* Crest highlight */}
          <circle cx={wavelength / 2} cy={200 - amplitude} r="6" fill="#10b981" />
          <line x1={wavelength / 2} y1="380" x2={wavelength / 2} y2={200 - amplitude} stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />

          {/* Trough highlight */}
          <circle cx={(3 * wavelength) / 2} cy={200 + amplitude} r="6" fill="#f59e0b" />
          <line x1={(3 * wavelength) / 2} y1="20" x2={(3 * wavelength) / 2} y2={200 + amplitude} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />

          {/* Wavelength indicator */}
          <motion.g>
            <line x1="50" y1="350" x2={50 + wavelength} y2="350" stroke="#8b5cf6" strokeWidth="2" />
            <polygon points="50,345 50,355 45,350" fill="#8b5cf6" />
            <polygon points={`${50 + wavelength},345 ${50 + wavelength},355 ${55 + wavelength},350`} fill="#8b5cf6" />
            <text x={50 + wavelength / 2} y="375" fontSize="12" fill="#8b5cf6" fontWeight="bold" textAnchor="middle">
              λ
            </text>
          </motion.g>

          {/* Amplitude indicator */}
          <line x1="20" y1={200 - amplitude} x2="40" y2={200 - amplitude} stroke="#3b82f6" strokeWidth="2" />
          <line x1="30" y1="200" x2="30" y2={200 - amplitude} stroke="#3b82f6" strokeWidth="2" />
          <text x="5" y={200 - amplitude / 2} fontSize="12" fill="#3b82f6" fontWeight="bold">
            A
          </text>

          {/* Labels */}
          <text x={wavelength / 2} y="30" fontSize="12" fill="#10b981" fontWeight="bold" textAnchor="middle">
            Crest
          </text>
          <text x={(3 * wavelength) / 2} y="30" fontSize="12" fill="#f59e0b" fontWeight="bold" textAnchor="middle">
            Trough
          </text>
        </svg>

        {/* Key Properties Display */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-xs text-slate-600 font-semibold">Amplitude (A)</p>
            <p className="text-lg font-bold text-blue-600">{amplitude.toFixed(0)}</p>
            <p className="text-xs text-slate-500">Height from center</p>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-xs text-slate-600 font-semibold">Wavelength (λ)</p>
            <p className="text-lg font-bold text-blue-600">{wavelength.toFixed(0)}</p>
            <p className="text-xs text-slate-500">Peak to peak</p>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <p className="text-xs text-slate-600 font-semibold">Period (T)</p>
            <p className="text-lg font-bold text-green-600">~2.0s</p>
            <p className="text-xs text-slate-500">Time per cycle</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * TransverseVsLongitudinalComparison: Side-by-side comparison
 */
export const TransverseVsLongitudinalComparison: React.FC = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev + 0.05) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Transverse wave
  const transversePoints = Array.from({ length: 50 }, (_, i) => {
    const x = i * 20;
    const y = 150 + Math.sin((x / 120) * 2 * Math.PI + phase) * 40;
    return `${x},${y}`;
  }).join(' ');

  // Longitudinal wave (compression/rarefaction)
  const longitudinalPoints = Array.from({ length: 50 }, (_, i) => {
    const x = i * 20;
    const stretch = 1 + Math.sin((x / 120) * 2 * Math.PI + phase) * 0.3;
    return `${x},${150 - (stretch - 1) * 30}`;
  }).join(' ');

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="font-bold text-slate-900 mb-6">Transverse vs Longitudinal</h4>

        {/* Transverse */}
        <div className="mb-8">
          <h5 className="font-semibold text-slate-800 mb-2">Transverse Wave</h5>
          <svg viewBox="0 0 1000 250" className="w-full bg-blue-50 rounded border border-blue-200 mb-2">
            <line x1="0" y1="150" x2="1000" y2="150" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <polyline points={transversePoints} fill="none" stroke="#3b82f6" strokeWidth="3" />

            {/* Particle motion arrows */}
            {[1, 2, 3, 4, 5].map((i) => {
              const x = i * 200;
              const amplitude = Math.sin((x / 120) * 2 * Math.PI + phase) * 40;
              return (
                <g key={`transverse-arrow-${i}`}>
                  <line x1={x} y1={150 - 30} x2={x} y2={150 + 30} stroke="#3b82f6" strokeWidth="1" />
                  <polygon points={`${x},${150 - amplitude - 15} ${x - 5},${150 - amplitude - 5} ${x + 5},${150 - amplitude - 5}`} fill="#3b82f6" />
                </g>
              );
            })}

            {/* Wave direction arrow */}
            <line x1="50" y1="50" x2="150" y2="50" stroke="#ef4444" strokeWidth="2" />
            <polygon points="150,50 135,45 135,55" fill="#ef4444" />
            <text x="100" y="40" fontSize="12" fill="#ef4444" fontWeight="bold" textAnchor="middle">Wave direction</text>
          </svg>
          <p className="text-sm text-slate-700"><strong>Blue arrows:</strong> Particles move UP and DOWN (perpendicular to wave direction)</p>
        </div>

        {/* Longitudinal */}
        <div>
          <h5 className="font-semibold text-slate-800 mb-2">Longitudinal Wave</h5>
          <svg viewBox="0 0 1000 250" className="w-full bg-green-50 rounded border border-green-200 mb-2">
            <line x1="0" y1="150" x2="1000" y2="150" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />

            {/* Compression/rarefaction visualization */}
            {[1, 2, 3, 4, 5].map((i) => {
              const x = i * 200;
              const compress = Math.sin((x / 120) * 2 * Math.PI + phase);
              const radius = 20 + compress * 10;
              const color = compress > 0 ? '#dc2626' : '#2563eb'; // Red for compression, blue for rarefaction
              return (
                <g key={`longitudinal-circles-${i}`}>
                  <circle cx={x} cy={150} r={radius} fill={color} opacity="0.3" />
                  <circle cx={x} cy={150} r={radius} fill="none" stroke={color} strokeWidth="2" />
                </g>
              );
            })}

            {/* Particle motion arrows (horizontal) */}
            {[1, 2, 3, 4, 5].map((i) => {
              const x = i * 200;
              const displacement = Math.sin((x / 120) * 2 * Math.PI + phase) * 20;
              return (
                <g key={`longitudinal-arrow-${i}`}>
                  <line x1={x - 30} y1="200" x2={x + 30} y2="200" stroke="#065f46" strokeWidth="1" />
                  <polygon points={`${x + displacement + 15},200 ${x + displacement + 5},195 ${x + displacement + 5},205`} fill="#065f46" />
                </g>
              );
            })}

            <text x="100" y="40" fontSize="12" fill="#ef4444" fontWeight="bold" textAnchor="middle">Wave direction</text>
          </svg>
          <p className="text-sm text-slate-700"><strong>Green arrows:</strong> Particles move LEFT and RIGHT (parallel to wave direction)</p>
        </div>

        {/* Comparison Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left p-2 font-bold">Property</th>
                <th className="text-left p-2 font-bold">Transverse</th>
                <th className="text-left p-2 font-bold">Longitudinal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold">Particle Motion</td>
                <td className="p-2">Up and down (⊥)</td>
                <td className="p-2">Left and right (∥)</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold">Wave Direction</td>
                <td className="p-2">Horizontal</td>
                <td className="p-2">Horizontal</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold">Examples</td>
                <td className="p-2">Water, light, rope</td>
                <td className="p-2">Sound, springs</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Needs Medium?</td>
                <td className="p-2">Usually yes</td>
                <td className="p-2">Yes (requires medium)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// LONGITUDINAL WAVES VISUALIZATIONS
// ============================================================================

/**
 * SpringCompressionVisualization: Shows spring compression/rarefaction
 * Demonstrates how particles compress and stretch in longitudinal waves
 */
export const SpringCompressionVisualization: React.FC = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev + 0.08) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="font-bold text-slate-900 mb-4">Spring Compression Wave</h4>
        <p className="text-sm text-slate-600 mb-4">Watch how coils compress and stretch as the wave propagates:</p>

        <svg viewBox="0 0 800 300" className="w-full bg-amber-50 rounded border border-amber-200">
          {/* Title */}
          <text x="400" y="30" fontSize="14" fill="#1e293b" fontWeight="bold" textAnchor="middle">Longitudinal Wave: Spring Compression</text>

          {/* Spring coils - compressed areas show closer coils (red), rarefied show further apart (blue) */}
          {Array.from({ length: 16 }).map((_, i) => {
            const baseX = 50 + i * 45;
            const compressionFactor = Math.sin(phase + (i * Math.PI) / 8);
            const displacement = compressionFactor * 15; // Max 15px displacement
            const circleRadius = 6 + Math.abs(compressionFactor) * 2;
            const fillColor = compressionFactor > 0.3 ? '#ef4444' : compressionFactor < -0.3 ? '#3b82f6' : '#f97316';

            return (
              <g key={`coil-${i}`}>
                <circle cx={baseX + displacement} cy="150" r={circleRadius} fill={fillColor} opacity="0.7" />
              </g>
            );
          })}

          {/* Wave direction arrow */}
          <g>
            <line x1="50" y1="220" x2="750" y2="220" stroke="#1e293b" strokeWidth="2" />
            <polygon points="750,220 735,215 735,225" fill="#1e293b" />
          </g>
          <text x="400" y="245" fontSize="12" fill="#1e293b" fontWeight="bold" textAnchor="middle">Wave travels →</text>

          {/* Compression/Rarefaction labels */}
          <rect x="680" y="80" width="100" height="40" fill="#ef4444" opacity="0.3" rx="4" />
          <text x="730" y="105" fontSize="11" fill="#ef4444" fontWeight="bold" textAnchor="middle">Compression</text>

          <rect x="680" y="160" width="100" height="40" fill="#3b82f6" opacity="0.3" rx="4" />
          <text x="730" y="185" fontSize="11" fill="#3b82f6" fontWeight="bold" textAnchor="middle">Rarefaction</text>
        </svg>

        <div className="mt-4 p-3 bg-amber-50 rounded text-sm text-slate-700 space-y-2">
          <p><strong>Compression:</strong> Coils packed close together (red)</p>
          <p><strong>Rarefaction:</strong> Coils spread far apart (blue)</p>
          <p><strong>Particle motion:</strong> Left-right along wave direction (parallel)</p>
        </div>
      </div>
    </div>
  );
};

/**
 * SoundWaveVisualization: Shows sound as longitudinal pressure waves
 * Demonstrates compression/rarefaction pattern of sound waves
 */
export const SoundWaveVisualization: React.FC = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev + 0.1) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="font-bold text-slate-900 mb-4">Sound Wave: Pressure Variations</h4>
        <p className="text-sm text-slate-600 mb-4">Sound is a longitudinal wave of pressure variations traveling through air:</p>

        <svg viewBox="0 0 900 350" className="w-full bg-blue-50 rounded border border-blue-200">
          {/* Air particles showing compression/rarefaction */}
          {Array.from({ length: 20 }).map((_, i) => {
            const x = 50 + i * 40;
            const compressionWave = Math.sin((x / 150) * 2 * Math.PI + phase);
            const particleSize = 5 + Math.abs(compressionWave) * 3;
            const opacity = 0.4 + Math.abs(compressionWave) * 0.4;

            return (
              <circle
                key={`particle-${i}`}
                cx={x}
                cy="150"
                r={particleSize}
                fill={compressionWave > 0 ? '#ef4444' : '#3b82f6'}
                opacity={opacity}
              />
            );
          })}

          {/* Pressure wave graph overlay */}
          <polyline
            points={Array.from({ length: 40 }, (_, i) => {
              const x = 50 + i * 20;
              const pressure = Math.sin((x / 150) * 2 * Math.PI + phase) * 60;
              return `${x},${250 + pressure}`;
            }).join(' ')}
            stroke="#0ea5e9"
            strokeWidth="2"
            fill="none"
          />

          {/* Labels */}
          <text x="50" y="320" fontSize="12" fill="#ef4444" fontWeight="bold">Compressed</text>
          <text x="550" y="320" fontSize="12" fill="#3b82f6" fontWeight="bold">Rarefied</text>
          <text x="450" y="30" fontSize="14" fill="#1e293b" fontWeight="bold">Sound Wave: Longitudinal Pressure</text>
        </svg>

        <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-slate-700 space-y-2">
          <p><strong>Red particles:</strong> High pressure (compression)</p>
          <p><strong>Blue particles:</strong> Low pressure (rarefaction)</p>
          <p><strong>Speed of sound:</strong> ~343 m/s in air at 20°C</p>
        </div>
      </div>
    </div>
  );
};

/**
 * ComprehensiveWavePropertiesExplorer: Master visualization for v = f × λ relationship
 * Allows manipulation of any two variables and shows the third adjust in real-time
 */
export const ComprehensiveWavePropertiesExplorer: React.FC = () => {
  const [speed, setSpeed] = useState(20); // m/s (10-40)
  const [frequency, setFrequency] = useState(2); // Hz (1-5)
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev + 0.08) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const wavelength = speed / frequency;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="font-bold text-slate-900 mb-4">Wave Equation: v = f × λ</h4>
        <p className="text-sm text-slate-600 mb-6">Adjust speed or frequency. Wavelength adjusts automatically:</p>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-semibold text-slate-700">Wave Speed: {speed} m/s</label>
            <input
              type="range"
              min="10"
              max="40"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">Depends on medium</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Frequency: {frequency} Hz</label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">Source vibration rate</p>
          </div>
        </div>

        {/* Visualization */}
        <svg viewBox="0 0 600 200" className="w-full bg-gradient-to-b from-blue-50 to-blue-50 rounded border border-blue-200 mb-4">
          {/* Wave visualization */}
          <polyline
            points={Array.from({ length: 60 }, (_, i) => {
              const x = 10 + i * 9.8;
              const y = 100 + Math.sin((x / wavelength) * 2 * Math.PI + phase) * 40;
              return `${x},${y}`;
            }).join(' ')}
            stroke="#0284c7"
            strokeWidth="3"
            fill="none"
          />

          {/* Wavelength measurement */}
          <g opacity="0.6">
            <line x1="10" y1="160" x2={10 + wavelength * 9.8} y2="160" stroke="#7c3aed" strokeWidth="2" />
            <circle cx="10" cy="160" r="4" fill="#7c3aed" />
            <circle cx={10 + wavelength * 9.8} cy="160" r="4" fill="#7c3aed" />
            <text x={10 + wavelength * 9.8 / 2} y="180" fontSize="12" fill="#7c3aed" fontWeight="bold" textAnchor="middle">
              λ = {wavelength.toFixed(1)}m
            </text>
          </g>

          {/* Particle at start showing oscillation */}
          <circle
            cx="10"
            cy={100 + Math.sin(phase) * 40}
            r="6"
            fill="#ef4444"
          />
        </svg>

        {/* Properties Grid */}
        <div className="grid grid-cols-3 gap-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded p-4">
          <div className="bg-white rounded p-3 shadow-sm">
            <p className="text-xs text-slate-600 font-semibold">Speed (v)</p>
            <p className="text-xl font-bold text-slate-900">{speed}</p>
            <p className="text-xs text-slate-500">m/s</p>
          </div>

          <div className="bg-white rounded p-3 shadow-sm">
            <p className="text-xs text-slate-600 font-semibold">Frequency (f)</p>
            <p className="text-xl font-bold text-slate-900">{frequency}</p>
            <p className="text-xs text-slate-500">Hz</p>
          </div>

          <div className="bg-white rounded p-3 shadow-sm border-2 border-blue-400">
            <p className="text-xs text-slate-600 font-semibold">Wavelength (λ)</p>
            <p className="text-xl font-bold text-blue-600">{wavelength.toFixed(2)}</p>
            <p className="text-xs text-slate-500">m</p>
          </div>
        </div>

        {/* Equation visualization */}
        <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-slate-700 space-y-2 text-center">
          <p className="font-bold text-lg">{speed} = {frequency} × {wavelength.toFixed(2)}</p>
          <p className="text-xs">Verify: {frequency} × {wavelength.toFixed(2)} = {(frequency * wavelength).toFixed(2)} ✓</p>
        </div>
      </div>
    </div>
  );
};

/**
 * LongitudinalWaveProperties: Interactive visualization of wavelength and frequency
 * Demonstrates how frequency affects wavelength in longitudinal waves
 */
export const LongitudinalWaveProperties: React.FC = () => {
  const [frequency, setFrequency] = useState(2);
  const [phase, setPhase] = useState(0);
  const [showMeasurement, setShowMeasurement] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev + 0.06) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const wavelength = 800 / (frequency + 1);
  const period = 1 / (frequency + 1);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="font-bold text-slate-900 mb-4">Longitudinal Wave Properties</h4>

        {/* Frequency Slider */}
        <div className="mb-6 space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Frequency: {frequency + 1} Hz
          </label>
          <input
            type="range"
            min="0"
            max="4"
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* SVG Visualization */}
        <svg viewBox="0 0 800 250" className="w-full bg-green-50 rounded border border-green-200 mb-4">
          {/* Compression zones */}
          {Array.from({ length: frequency + 2 }).map((_, waveNum) => {
            const startX = 50 + waveNum * wavelength;

            return (
              <g key={`wave-${waveNum}`}>
                {/* Compression (red) */}
                <rect x={startX} y="80" width={wavelength * 0.4} height="80" fill="#ef4444" opacity="0.3" />

                {/* Rarefaction (blue) */}
                <rect x={startX + wavelength * 0.4} y="80" width={wavelength * 0.6} height="80" fill="#3b82f6" opacity="0.3" />

                {/* Particle circles showing motion */}
                {Array.from({ length: 8 }).map((_, j) => {
                  const x = startX + (j * wavelength) / 8;
                  const compressionFactor = Math.sin((j / 8) * Math.PI * 2 + phase);
                  const displacement = compressionFactor * 8;
                  const particleSize = 4 + Math.abs(compressionFactor) * 2;

                  return (
                    <circle
                      key={`particle-${waveNum}-${j}`}
                      cx={x + displacement}
                      cy="120"
                      r={particleSize}
                      fill={compressionFactor > 0 ? '#ef4444' : '#3b82f6'}
                      opacity="0.6"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Wavelength measurement line */}
          {showMeasurement && (
            <>
              <line x1="50" y1="200" x2={50 + wavelength} y2="200" stroke="#8b5cf6" strokeWidth="2" />
              <circle cx="50" cy="200" r="4" fill="#8b5cf6" />
              <circle cx={50 + wavelength} cy="200" r="4" fill="#8b5cf6" />
              <text x={50 + wavelength / 2} y="220" fontSize="11" fill="#8b5cf6" fontWeight="bold" textAnchor="middle">
                λ = {wavelength.toFixed(0)}px
              </text>
            </>
          )}
        </svg>

        {/* Toggle measurement */}
        <button
          onClick={() => setShowMeasurement(!showMeasurement)}
          className="mb-4 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold hover:bg-blue-200"
        >
          {showMeasurement ? 'Hide' : 'Show'} Wavelength Measurement
        </button>

        {/* Properties display */}
        <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded p-4">
          <div className="text-center">
            <p className="text-xs text-slate-600">Frequency</p>
            <p className="text-lg font-bold text-slate-900">{frequency + 1} Hz</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600">Period</p>
            <p className="text-lg font-bold text-slate-900">{(period).toFixed(2)}s</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600">Wavelength</p>
            <p className="text-lg font-bold text-slate-900">{wavelength.toFixed(0)}px</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 rounded text-sm text-slate-700">
          <p><strong>Notice:</strong> As frequency increases, wavelength decreases (inverse relationship)</p>
          <p>This keeps wave speed constant: v = f × λ</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ELECTROMAGNETIC RADIATION VISUALIZATIONS
// ============================================================================

/**
 * EMSpectrumVisualization: Interactive EM spectrum showing frequency/wavelength ranges
 * Shows all EM radiation types from radio to gamma rays with colors
 */
export const EMSpectrumVisualization: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const spectrumTypes = [
    {
      name: 'Radio Waves',
      color: 'bg-red-200',
      frequency: '10³ Hz',
      wavelength: '10³ m',
      description: 'Used in broadcasting, cell phones',
      examples: 'FM radio, WiFi'
    },
    {
      name: 'Microwaves',
      color: 'bg-slate-200',
      frequency: '10⁹ Hz',
      wavelength: '10⁻³ m',
      description: 'Heating food, radar',
      examples: 'Microwave ovens'
    },
    {
      name: 'Infrared',
      color: 'bg-yellow-200',
      frequency: '10¹² Hz',
      wavelength: '10⁻⁶ m',
      description: 'Heat radiation',
      examples: 'Thermal imaging'
    },
    {
      name: 'Visible Light',
      color: 'bg-green-200',
      frequency: '10¹⁵ Hz',
      wavelength: '10⁻⁷ m',
      description: 'What our eyes see',
      examples: 'Red to violet'
    },
    {
      name: 'Ultraviolet',
      color: 'bg-blue-200',
      frequency: '10¹⁶ Hz',
      wavelength: '10⁻⁸ m',
      description: 'Sun\'s harmful rays',
      examples: 'Causes sunburn'
    },
    {
      name: 'X-rays',
      color: 'bg-blue-200',
      frequency: '10¹⁸ Hz',
      wavelength: '10⁻¹⁰ m',
      description: 'Medical imaging',
      examples: 'Bone imaging'
    },
    {
      name: 'Gamma Rays',
      color: 'bg-blue-300',
      frequency: '10²⁰ Hz',
      wavelength: '10⁻¹² m',
      description: 'Radioactive decay',
      examples: 'Very dangerous'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="font-bold text-slate-900 mb-2">Electromagnetic Spectrum</h4>
        <p className="text-sm text-slate-600 mb-4">All EM waves travel at 3×10⁸ m/s but have different frequencies and wavelengths:</p>

        {/* Spectrum bar */}
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold text-slate-700">← Lower Energy | Higher Energy →</p>
          <p className="text-xs font-semibold text-slate-700">← Longer Wavelength | Shorter Wavelength →</p>

          <div className="flex gap-1 h-12 rounded overflow-hidden border-2 border-slate-300">
            {spectrumTypes.map((type, index) => (
              <button
                key={index}
                onClick={() => setSelectedType(selectedType === type.name ? null : type.name)}
                className={`flex-1 ${type.color} hover:opacity-80 transition-opacity cursor-pointer border-r border-slate-300 last:border-r-0 font-semibold text-xs`}
                title={type.name}
              >
                {type.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-600">← Radio | Microwave | Infrared | Visible | UV | X-ray | Gamma →</p>
        </div>

        {/* Details panel */}
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-50 rounded p-4 mb-4 border-l-4 border-blue-600"
          >
            {spectrumTypes.find(t => t.name === selectedType) && (
              <>
                <h5 className="font-bold text-slate-900 mb-2">{selectedType}</h5>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                  <div>
                    <p className="text-xs text-slate-600">Frequency:</p>
                    <p className="font-semibold">{spectrumTypes.find(t => t.name === selectedType)!.frequency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Wavelength:</p>
                    <p className="font-semibold">{spectrumTypes.find(t => t.name === selectedType)!.wavelength}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-600">Uses:</p>
                    <p>{spectrumTypes.find(t => t.name === selectedType)!.description}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-600">Examples:</p>
                    <p>{spectrumTypes.find(t => t.name === selectedType)!.examples}</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Key facts */}
        <div className="space-y-2 bg-blue-50 rounded p-4 text-sm text-slate-700">
          <p><strong>Key fact:</strong> All EM waves travel at 3×10⁸ m/s in vacuum</p>
          <p><strong>Relationship:</strong> v = f × λ (same equation applies!)</p>
          <p><strong>Higher frequency:</strong> shorter wavelength, more dangerous</p>
          <p><strong>Lower frequency:</strong> longer wavelength, less dangerous</p>
        </div>

        {/* Frequency/Wavelength legend */}
        <div className="mt-4">
          <svg viewBox="0 0 500 80" className="w-full">
            {/* Frequency axis */}
            <text x="20" y="20" fontSize="12" fill="#1e293b" fontWeight="bold">Frequency (Hz):</text>
            <line x1="20" y1="30" x2="480" y2="30" stroke="#1e293b" strokeWidth="2" />

            {/* Frequency markers */}
            {[0, 1, 2, 3].map((i) => (
              <g key={`freq-${i}`}>
                <line x1={20 + i * 153} y1="25" x2={20 + i * 153} y2="35" stroke="#1e293b" strokeWidth="2" />
                <text x={20 + i * 153} y="50" fontSize="10" fill="#1e293b" textAnchor="middle">
                  10^{3 + i * 6}
                </text>
              </g>
            ))}

            {/* Wavelength axis */}
            <text x="20" y="70" fontSize="12" fill="#1e293b" fontWeight="bold">Wavelength (m):</text>

            {/* Wavelength markers (inverse scale) */}
            {[0, 1, 2, 3].map((i) => (
              <text key={`wave-${i}`} x={20 + (3 - i) * 153} y="75" fontSize="10" fill="#1e293b" textAnchor="middle">
                10^{3 - i * 6}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};
