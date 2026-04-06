import React, { useState } from 'react';
import { motion } from 'motion/react';

// T-Account Animator
export const TAccountAnimatorVisualization: React.FC = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, account: 'Cash', debit: 5000, credit: 0 },
  ]);
  const [newTransaction, setNewTransaction] = useState({ debit: 0, credit: 0 });

  const addTransaction = () => {
    if (newTransaction.debit > 0 || newTransaction.credit > 0) {
      setTransactions([
        ...transactions,
        { id: transactions.length + 1, account: `Account ${transactions.length + 1}`, ...newTransaction }
      ]);
      setNewTransaction({ debit: 0, credit: 0 });
    }
  };

  const calculateBalance = () => {
    return transactions.reduce((sum, t) => sum + t.debit - t.credit, 0);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">T-Account Animator</h3>

      {/* T-Account Display */}
      <div className="bg-white border-2 border-green-300 rounded-lg p-6 max-w-md mx-auto">
        <div className="text-center font-bold text-lg mb-4 text-slate-900">CASH</div>
        <div className="grid grid-cols-2 gap-4">
          {/* Debit side */}
          <div className="border-r-2 border-slate-300 pr-4">
            <div className="text-xs font-bold text-slate-600 mb-3 text-center">DEBIT (Left)</div>
            <div className="space-y-2">
              {transactions.map((t) => (
                t.debit > 0 && (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-right text-sm font-semibold text-green-700"
                  >
                    R{t.debit}
                  </motion.div>
                )
              ))}
            </div>
          </div>

          {/* Credit side */}
          <div className="pl-4">
            <div className="text-xs font-bold text-slate-600 mb-3 text-center">CREDIT (Right)</div>
            <div className="space-y-2">
              {transactions.map((t) => (
                t.credit > 0 && (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-left text-sm font-semibold text-red-700"
                  >
                    R{t.credit}
                  </motion.div>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="mt-6 pt-4 border-t-2 border-slate-300">
          <div className="text-center">
            <p className="text-xs text-slate-600 font-semibold">BALANCE</p>
            <motion.p
              key={calculateBalance()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-blue-600"
            >
              R{calculateBalance()}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Add Transaction */}
      <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 max-w-md mx-auto w-full">
        <p className="text-sm font-bold text-slate-700 mb-3">Add Transaction:</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600">Debit (R)</label>
            <input
              type="number"
              value={newTransaction.debit}
              onChange={(e) => setNewTransaction({ ...newTransaction, debit: Number(e.target.value) })}
              className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Credit (R)</label>
            <input
              type="number"
              value={newTransaction.credit}
              onChange={(e) => setNewTransaction({ ...newTransaction, credit: Number(e.target.value) })}
              className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
              placeholder="0"
            />
          </div>
        </div>
        <button
          onClick={addTransaction}
          className="w-full mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
        >
          Add Entry
        </button>
      </div>

      <div className="text-xs text-slate-600 text-center">
        <p>Watch how debits increase balance (left) and credits decrease balance (right)</p>
      </div>
    </div>
  );
};

// Balance Scale Visualization
export const BalanceScaleVisualization: React.FC = () => {
  const [assets, setAssets] = useState(10);
  const [equity, setEquity] = useState(6);
  const [liabilities, setLiabilities] = useState(4);

  const isBalanced = assets === (equity + liabilities);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">Accounting Equation Balance</h3>

      {/* Balance Scale SVG */}
      <div className="bg-white border-2 border-blue-300 rounded-lg p-8">
        <svg viewBox="0 0 500 350" className="w-full">
          {/* Base */}
          <rect x="175" y="260" width="150" height="25" fill="#64748b" rx="8" />

          {/* Fulcrum */}
          <polygon points="250,260 230,230 270,230" fill="#1e293b" />

          {/* Left beam */}
          <line x1="250" y1="230" x2="100" y2="150" stroke="#1e293b" strokeWidth="5" />

          {/* Right beam */}
          <line x1="250" y1="230" x2="400" y2="150" stroke="#1e293b" strokeWidth="5" />

          {/* Left pan (Assets) */}
          <motion.g animate={{ y: isBalanced ? 0 : -20 }} transition={{ type: 'spring' }}>
            <rect x="50" y="120" width="100" height="50" fill="#3b82f6" rx="6" />
            <text x="100" y="138" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
              Assets
            </text>
            <text x="100" y="162" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">
              R{assets}
            </text>

            {/* Asset blocks */}
            {[...Array(Math.min(assets, 5))].map((_, i) => (
              <motion.rect
                key={i}
                x={60 + i * 14}
                y={80 - i * 10}
                width="12"
                height="12"
                fill="#60a5fa"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </motion.g>

          {/* Right pan (Equity + Liabilities) */}
          <motion.g animate={{ y: isBalanced ? 0 : -20 }} transition={{ type: 'spring' }}>
            <rect x="350" y="120" width="100" height="50" fill="#10b981" rx="6" />
            <text x="400" y="138" fontSize="13" fontWeight="bold" fill="white" textAnchor="middle">
              Equity + Liab.
            </text>
            <text x="400" y="162" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">
              R{equity + liabilities}
            </text>

            {/* E+L blocks */}
            {[...Array(Math.min(equity + liabilities, 5))].map((_, i) => (
              <motion.rect
                key={i}
                x={360 + i * 14}
                y={80 - i * 10}
                width="12"
                height="12"
                fill="#34d399"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </motion.g>

          {/* Balanced indicator */}
          {isBalanced && (
            <motion.text
              x="250"
              y="310"
              fontSize="18"
              fontWeight="bold"
              fill="#10b981"
              textAnchor="middle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              ✓ BALANCED - Equation is in balance!
            </motion.text>
          )}

          {!isBalanced && (
            <motion.text
              x="250"
              y="310"
              fontSize="16"
              fontWeight="bold"
              fill="#ef4444"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ⚠ Not balanced - adjust values
            </motion.text>
          )}
        </svg>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4"
        >
          <label className="text-xs font-bold text-slate-700 block mb-2">Assets (R)</label>
          <input
            type="range"
            min="0"
            max="20"
            value={assets}
            onChange={(e) => setAssets(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <p className="text-center font-bold text-blue-700 mt-3 text-lg">R{assets}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-amber-100 border-2 border-amber-400 rounded-lg p-4"
        >
          <label className="text-xs font-bold text-slate-700 block mb-2">Equity (R)</label>
          <input
            type="range"
            min="0"
            max="20"
            value={equity}
            onChange={(e) => setEquity(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <p className="text-center font-bold text-amber-700 mt-3 text-lg">R{equity}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-rose-100 border-2 border-rose-400 rounded-lg p-4"
        >
          <label className="text-xs font-bold text-slate-700 block mb-2">Liabilities (R)</label>
          <input
            type="range"
            min="0"
            max="20"
            value={liabilities}
            onChange={(e) => setLiabilities(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <p className="text-center font-bold text-rose-700 mt-3 text-lg">R{liabilities}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-4"
      >
        <p className="mb-1">Assets = Equity + Liabilities</p>
        <p className="text-lg font-bold text-blue-700">R{assets} = R{equity} + R{liabilities}</p>
      </motion.div>
    </div>
  );
};

// Journal Entry Flow Animation
export const JournalEntryFlowVisualization: React.FC = () => {
  const [step, setStep] = useState(0);

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
      <h3 className="text-xl font-bold text-slate-900 text-center">Journal Entry Flow</h3>

      <div className="space-y-4">
        {/* Source Document */}
        <motion.div
          className="bg-white border-2 border-amber-300 rounded-lg p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-bold text-slate-600 mb-2">📄 SOURCE DOCUMENT (Invoice)</p>
          <div className="bg-amber-50 p-3 rounded text-sm space-y-1 border border-amber-200">
            <p><strong>Date:</strong> Jan 15, 2024</p>
            <p><strong>Description:</strong> Bought office equipment</p>
            <p><strong>Amount:</strong> R5,000</p>
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div className="flex justify-center">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
            ↓
          </motion.div>
        </motion.div>

        {/* Journal Entry */}
        <motion.div
          className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs font-bold text-slate-600 mb-2">📖 JOURNAL ENTRY</p>
          <div className="font-mono text-sm space-y-1 border border-blue-200 bg-white p-2 rounded">
            <p>Jan 15 | Equipment | R5,000 |</p>
            <p>       |     Cash  |        | R5,000</p>
            <p className="text-xs text-slate-500">Purchased equipment - Invoice #123</p>
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div className="flex justify-center">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
            ↓
          </motion.div>
        </motion.div>

        {/* Ledger */}
        <motion.div
          className="bg-green-50 border-2 border-green-300 rounded-lg p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xs font-bold text-slate-600 mb-3">📚 GENERAL LEDGER (T-Accounts)</p>
          <div className="grid grid-cols-2 gap-4">
            {/* Equipment account */}
            <div className="border border-green-300 rounded p-2">
              <p className="font-bold text-center text-sm mb-2">Equipment</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-right">R5,000</div>
                <div></div>
              </div>
            </div>

            {/* Cash account */}
            <div className="border border-green-300 rounded p-2">
              <p className="font-bold text-center text-sm mb-2">Cash</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div></div>
                <div className="text-right">R5,000</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="text-xs text-slate-600 text-center bg-yellow-50 border border-yellow-300 p-2 rounded">
        <strong>Flow:</strong> Source Document → Journal Entry → General Ledger (T-Accounts)
      </div>
    </div>
  );
};
