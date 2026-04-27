import React, { useState } from 'react';
import { motion } from 'motion/react';

// Sentence Diagrammer
export const SentenceDiagrammerVisualization: React.FC = () => {
  const [inputSentence, setInputSentence] = useState('The quick brown fox jumps');

  const exampleSentences = [
    'The quick brown fox jumps',
    'She reads books carefully',
    'Dogs run fast'
  ];

  // Simple parse (for demo)
  const words = inputSentence.trim().split(' ');

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-yellow-50 to-slate-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">Sentence Structure Analyzer</h3>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">Enter or select a sentence:</label>
        <input
          type="text"
          value={inputSentence}
          onChange={(e) => setInputSentence(e.target.value)}
          placeholder="Type a sentence..."
          className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-500"
        />
        <div className="flex gap-2 flex-wrap">
          {exampleSentences.map((sent) => (
            <button
              key={sent}
              onClick={() => setInputSentence(sent)}
              className="text-xs px-3 py-1 bg-yellow-200 hover:bg-yellow-300 text-slate-700 rounded transition"
            >
              {sent}
            </button>
          ))}
        </div>
      </div>

      {/* Diagram */}
      <div className="bg-white border-2 border-yellow-300 rounded-lg p-6">
        <svg viewBox="0 0 500 250" className="w-full">
          {/* Sentence baseline */}
          <line x1="50" y1="100" x2="450" y2="100" stroke="#1e293b" strokeWidth="2" />

          {/* Words with parts of speech */}
          {words.map((word, i) => {
            const x = 50 + i * 80;
            const colors = ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#a855f7'];
            const partsOfSpeech = ['Article', 'Adjective', 'Adjective', 'Noun', 'Verb'];

            return (
              <motion.g
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Word */}
                <text
                  x={x + 30}
                  y="95"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#1e293b"
                  textAnchor="middle"
                >
                  {word}
                </text>

                {/* Part of speech box */}
                <rect
                  x={x}
                  y="115"
                  width="60"
                  height="25"
                  fill={colors[i] || '#64748b'}
                  rx="4"
                />
                <text
                  x={x + 30}
                  y="135"
                  fontSize="10"
                  fontWeight="bold"
                  fill="white"
                  textAnchor="middle"
                >
                  {partsOfSpeech[i]}
                </text>

                {/* Connection line */}
                <line
                  x1={x + 30}
                  y1="100"
                  x2={x + 30}
                  y2="115"
                  stroke={colors[i] || '#64748b'}
                  strokeWidth="2"
                />
              </motion.g>
            );
          })}

          {/* Legend */}
          <text x="50" y="200" fontSize="11" fontWeight="bold" fill="#1e293b">
            Color key: Article (Blue) | Adjective (Green) | Noun (Orange) | Verb (Red) | Other (Purple)
          </text>
        </svg>
      </div>

      <div className="text-xs text-slate-600 bg-blue-50 border border-blue-300 p-3 rounded">
        <p><strong>How to read:</strong> Each word is labeled with its part of speech. Lines connect words to show relationships in the sentence structure.</p>
      </div>
    </div>
  );
};

// Essay Structure Visualizer
export const EssayStructureVisualization: React.FC = () => {
  const [totalWords, setTotalWords] = useState(500);

  const introWords = Math.round(totalWords * 0.15);
  const bodyWords = Math.round(totalWords * 0.70);
  const conclusionWords = Math.round(totalWords * 0.15);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">Essay Structure</h3>

      {/* Word count input */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">Total Word Count: {totalWords}</label>
        <input
          type="range"
          min="200"
          max="2000"
          step="100"
          value={totalWords}
          onChange={(e) => setTotalWords(Number(e.target.value))}
          className="w-full h-2 bg-blue-300 rounded-lg cursor-pointer"
        />
      </div>

      {/* Essay Structure Visualization */}
      <div className="bg-white border-2 border-blue-300 rounded-lg p-6">
        <div className="space-y-4">
          {/* Foundation (Intro) */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 0 }}
            className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4"
            style={{ transformOrigin: 'top' }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-900">INTRODUCTION</p>
                <p className="text-xs text-slate-600">Hook + Background + Thesis</p>
              </div>
              <p className="text-xl font-bold text-blue-700">{introWords} words</p>
            </div>
          </motion.div>

          {/* Pillars (Body Paragraphs) */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-green-100 border-2 border-green-400 rounded-lg p-4"
            style={{ transformOrigin: 'top' }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-900">BODY PARAGRAPHS</p>
                <p className="text-xs text-slate-600">Topic Sentence + Evidence + Analysis (x3-4 paragraphs)</p>
              </div>
              <p className="text-xl font-bold text-green-700">{bodyWords} words</p>
            </div>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 h-20 bg-green-200 rounded border border-green-400 flex items-center justify-center text-xs font-bold text-slate-600">
                  ¶ {i}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Roof (Conclusion) */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-100 border-2 border-slate-400 rounded-lg p-4"
            style={{ transformOrigin: 'top' }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-900">CONCLUSION</p>
                <p className="text-xs text-slate-600">Restate Thesis + Summary + Final Thought</p>
              </div>
              <p className="text-xl font-bold text-slate-700">{conclusionWords} words</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Structure breakdown */}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="bg-blue-50 border border-blue-300 rounded p-3 text-center">
          <p className="font-bold text-blue-700">INTRO</p>
          <p className="text-xs text-slate-600 mt-1">{Math.round((introWords / totalWords) * 100)}%</p>
          <p className="text-xs text-slate-600">{introWords} words</p>
        </div>
        <div className="bg-green-50 border border-green-300 rounded p-3 text-center">
          <p className="font-bold text-green-700">BODY</p>
          <p className="text-xs text-slate-600 mt-1">{Math.round((bodyWords / totalWords) * 100)}%</p>
          <p className="text-xs text-slate-600">{bodyWords} words</p>
        </div>
        <div className="bg-slate-50 border border-slate-300 rounded p-3 text-center">
          <p className="font-bold text-slate-700">CONCLUSION</p>
          <p className="text-xs text-slate-600 mt-1">{Math.round((conclusionWords / totalWords) * 100)}%</p>
          <p className="text-xs text-slate-600">{conclusionWords} words</p>
        </div>
      </div>

      <div className="text-xs text-slate-600 bg-yellow-50 border border-yellow-300 p-3 rounded">
        <p><strong>Standard breakdown:</strong> Introduction 10-15%, Body 70-80%, Conclusion 10-15%</p>
      </div>
    </div>
  );
};

// Literary Devices Visualizer
export const LiteraryDevicesVisualization: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState('metaphor');

  const devices = {
    metaphor: {
      name: 'Metaphor',
      definition: 'Direct comparison without "like" or "as"',
      example: '"Life is a journey"',
      breakdown: 'Life = Journey (suggesting life has a path, destination, obstacles)',
      color: '#ef4444'
    },
    simile: {
      name: 'Simile',
      definition: 'Comparison using "like" or "as"',
      example: '"Life is like a journey"',
      breakdown: 'Uses "like" to explicitly compare life to a journey',
      color: '#f97316'
    },
    personification: {
      name: 'Personification',
      definition: 'Giving human qualities to non-human things',
      example: '"The wind whispered secrets"',
      breakdown: 'Wind (non-human) is described as whispering (human action)',
      color: '#a855f7'
    },
    imagery: {
      name: 'Imagery',
      definition: 'Sensory language (sight, sound, touch, smell, taste)',
      example: '"The soft breeze carried sweet perfume"',
      breakdown: 'Appeals to touch (soft), smell (sweet, perfume), and sound (carried)',
      color: '#3b82f6'
    }
  };

  const current = devices[selectedDevice as keyof typeof devices];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-red-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">Literary Devices</h3>

      {/* Device Selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        {Object.entries(devices).map(([key, device]) => (
          <motion.button
            key={key}
            onClick={() => setSelectedDevice(key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedDevice === key
                ? `bg-${device.color.replace('#', '')}-600 text-white`
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
            style={
              selectedDevice === key
                ? { backgroundColor: device.color, color: 'white' }
                : undefined
            }
          >
            {device.name}
          </motion.button>
        ))}
      </div>

      {/* Device Display */}
      <motion.div
        key={selectedDevice}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 rounded-lg p-6"
        style={{ borderColor: current.color }}
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase">Definition</p>
            <p className="text-lg text-slate-900 font-semibold">{current.definition}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-600 uppercase">Example</p>
            <p className="text-lg italic text-slate-700">{current.example}</p>
          </div>

          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: current.color + '20', borderLeft: `4px solid ${current.color}` }}
          >
            <p className="text-xs font-bold text-slate-600 uppercase">How It Works</p>
            <p className="text-sm text-slate-800 mt-1">{current.breakdown}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
          <span className="font-bold text-red-700">Metaphor</span><br />Direct
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded p-2 text-center">
          <span className="font-bold text-slate-700">Simile</span><br />Like/As
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
          <span className="font-bold text-blue-700">Personification</span><br />Human traits
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
          <span className="font-bold text-blue-700">Imagery</span><br />Senses
        </div>
      </div>
    </div>
  );
};
