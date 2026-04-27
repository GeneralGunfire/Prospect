import React, { useState } from 'react';
import { motion } from 'motion/react';

// Dichotomous Key Interactive
export const DichotomousKeyVisualization: React.FC = () => {
  const [step, setStep] = useState(0);
  const [path, setPath] = useState<string[]>([]);

  const questions = [
    {
      question: 'Does the organism have a backbone?',
      yesLabel: 'Yes → Vertebrate',
      noLabel: 'No → Invertebrate',
      yesPath: 'vertebrate',
      noPath: 'invertebrate'
    },
    {
      question: 'Is it warm-blooded?',
      yesLabel: 'Yes → Mammal',
      noLabel: 'No → Reptile/Amphibian',
      yesPath: 'mammal',
      noPath: 'cold-blooded'
    },
    {
      question: 'Does it have fur?',
      yesLabel: 'Yes → Identified as Mammal',
      noLabel: 'No → Continue',
      yesPath: 'mammal-final',
      noPath: 'bird'
    },
  ];

  const handleYes = () => {
    setPath([...path, questions[step].yesPath]);
    setStep(step + 1);
  };

  const handleNo = () => {
    setPath([...path, questions[step].noPath]);
    setStep(step + 1);
  };

  const reset = () => {
    setStep(0);
    setPath([]);
  };

  const isComplete = step >= questions.length;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">Interactive Dichotomous Key</h3>

      {/* Decision Tree Path */}
      <div className="bg-white border-2 border-green-300 rounded-lg p-6">
        {/* Current Question */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center mb-8"
        >
          <p className="text-lg font-bold text-slate-900 mb-6">
            {isComplete ? '✓ Organism Identified!' : `Question ${step + 1}: ${questions[step]?.question}`}
          </p>

          {isComplete && (
            <motion.div
              className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <p className="text-2xl font-bold text-green-700">
                {path.join(' → ')}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Decision Path Visualization */}
        <div className="mb-6">
          <div className="flex gap-1 flex-wrap justify-center">
            {path.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-100 border border-blue-300 rounded-full px-3 py-1 text-sm font-semibold text-blue-700"
              >
                {p}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Yes/No Buttons */}
        {!isComplete && (
          <div className="flex gap-4 justify-center mt-8">
            <motion.button
              onClick={handleYes}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition"
            >
              ✓ {questions[step]?.yesLabel}
            </motion.button>
            <motion.button
              onClick={handleNo}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition"
            >
              ✗ {questions[step]?.noLabel}
            </motion.button>
          </div>
        )}

        {isComplete && (
          <motion.button
            onClick={reset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition mt-4"
          >
            Try Again
          </motion.button>
        )}
      </div>

      <div className="text-xs text-slate-600 bg-green-50 border border-green-300 p-3 rounded">
        <p><strong>How to use:</strong> Answer yes or no to narrow down the organism. Each answer removes possibilities until you identify it!</p>
      </div>
    </div>
  );
};

// Classification Tree
export const ClassificationTreeVisualization: React.FC = () => {
  const [selectedOrganism, setSelectedOrganism] = useState(null);

  const organisms = [
    { name: 'Human', kingdom: 'Animalia', phylum: 'Chordata', class: 'Mammalia' },
    { name: 'Lion', kingdom: 'Animalia', phylum: 'Chordata', class: 'Mammalia' },
    { name: 'Eagle', kingdom: 'Animalia', phylum: 'Chordata', class: 'Aves' },
    { name: 'Frog', kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia' },
    { name: 'Rose', kingdom: 'Plantae', phylum: 'Magnoliophyta', class: 'Eudicots' },
  ];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-blue-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">Classification Tree</h3>

      {/* Tree Visualization */}
      <div className="bg-white border-2 border-blue-300 rounded-lg p-6">
        <svg viewBox="0 0 500 300" className="w-full">
          {/* Kingdom level */}
          <circle cx="250" cy="30" r="30" fill="#3b82f6" />
          <text x="250" y="35" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
            KINGDOM
          </text>

          {/* Lines to Phylum */}
          <line x1="250" y1="60" x2="120" y2="100" stroke="#3b82f6" strokeWidth="2" />
          <line x1="250" y1="60" x2="380" y2="100" stroke="#3b82f6" strokeWidth="2" />

          {/* Phylum level */}
          <circle cx="120" cy="120" r="28" fill="#10b981" />
          <text x="120" y="125" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">
            Chordata
          </text>

          <circle cx="380" cy="120" r="28" fill="#10b981" />
          <text x="380" y="125" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">
            Other
          </text>

          {/* Lines to Class */}
          <line x1="120" y1="148" x2="60" y2="180" stroke="#10b981" strokeWidth="2" />
          <line x1="120" y1="148" x2="120" y2="180" stroke="#10b981" strokeWidth="2" />
          <line x1="120" y1="148" x2="180" y2="180" stroke="#10b981" strokeWidth="2" />

          {/* Class level */}
          <circle cx="60" cy="200" r="20" fill="#f97316" />
          <text x="60" y="205" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">
            Mammalia
          </text>

          <circle cx="120" cy="200" r="20" fill="#f97316" />
          <text x="120" y="205" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">
            Aves
          </text>

          <circle cx="180" cy="200" r="20" fill="#f97316" />
          <text x="180" y="205" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">
            Amphibia
          </text>

          {/* Organisms */}
          <circle cx="60" cy="250" r="18" fill="#a855f7" />
          <text x="60" y="256" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">
            Human
          </text>

          <circle cx="60" cy="275" r="18" fill="#a855f7" />
          <text x="60" y="281" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">
            Lion
          </text>
        </svg>
      </div>

      {/* Organism List */}
      <div className="space-y-2">
        <p className="text-sm font-bold text-slate-700">Click an organism to see its classification path:</p>
        <div className="grid grid-cols-2 gap-2">
          {organisms.map((org) => (
            <motion.button
              key={org.name}
              onClick={() => setSelectedOrganism(org)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-2 rounded-lg font-semibold transition text-sm ${
                selectedOrganism?.name === org.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {org.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Classification Display */}
      {selectedOrganism && (
        <motion.div
          className="bg-gradient-to-r from-blue-100 to-slate-100 border-2 border-blue-300 rounded-lg p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-lg font-bold text-slate-900 mb-3">{selectedOrganism.name}</p>
          <div className="space-y-2 text-sm">
            <p><strong>Kingdom:</strong> {selectedOrganism.kingdom}</p>
            <p><strong>Phylum:</strong> {selectedOrganism.phylum}</p>
            <p><strong>Class:</strong> {selectedOrganism.class}</p>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            <p>👆 Click another organism to compare classifications</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Biodiversity Pyramid
export const BiodiversityPyramidVisualization: React.FC = () => {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-green-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">Three Levels of Biodiversity</h3>

      <div className="bg-white border-2 border-slate-300 rounded-lg p-6">
        <svg viewBox="0 0 500 380" className="w-full">
          {/* Ecosystem Diversity (Base) */}
          <motion.rect
            x="50"
            y="280"
            width="400"
            height="80"
            fill="#10b981"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0 }}
            style={{ transformOrigin: '250px 280px' }}
          />
          <text x="250" y="315" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">
            ECOSYSTEM DIVERSITY
          </text>
          <text x="250" y="335" fontSize="11" fill="white" textAnchor="middle">
            Rainforest, Desert, Ocean, Tundra, Grassland...
          </text>

          {/* Species Diversity (Middle) */}
          <motion.polygon
            points="100,280 400,280 250,140"
            fill="#22c55e"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.15 }}
            style={{ transformOrigin: '250px 280px' }}
          />
          <text x="250" y="200" fontSize="15" fontWeight="bold" fill="white" textAnchor="middle">
            SPECIES DIVERSITY
          </text>
          <text x="250" y="220" fontSize="10" fill="white" textAnchor="middle">
            Many different species in ecosystem
          </text>

          {/* Genetic Diversity (Top) */}
          <motion.polygon
            points="200,140 300,140 250,20"
            fill="#06b6d4"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.3 }}
            style={{ transformOrigin: '250px 140px' }}
          />
          <text x="250" y="65" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
            GENETIC
          </text>
          <text x="250" y="82" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
            DIVERSITY
          </text>
          <text x="250" y="98" fontSize="9" fill="white" textAnchor="middle">
            Variation within species
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4 text-center"
        >
          <p className="font-bold text-blue-700 mb-2">GENETIC</p>
          <p className="text-xs text-slate-700">Differences in traits within same species</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-green-100 border-2 border-green-400 rounded-lg p-4 text-center"
        >
          <p className="font-bold text-green-700 mb-2">SPECIES</p>
          <p className="text-xs text-slate-700">Many different species together</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4 text-center"
        >
          <p className="font-bold text-blue-700 mb-2">ECOSYSTEM</p>
          <p className="text-xs text-slate-700">Different types of habitats on Earth</p>
        </motion.div>
      </div>
    </div>
  );
};
