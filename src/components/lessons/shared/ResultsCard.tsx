import { motion } from 'motion/react'
import { Award, RotateCcw, ArrowRight } from 'lucide-react'

interface ResultsCardProps { title: string; correct: number; total: number; onRetry: () => void; onContinue: () => void }

export function ResultsCard({ title, correct, total, onRetry, onContinue }: ResultsCardProps) {
  const pct = Math.round((correct / total) * 100)
  const mastered = correct / total >= 2 / 3
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border border-slate-200 p-12 text-center space-y-8 shadow-sm">
      <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto text-white shadow-xl ${mastered ? 'bg-emerald-500' : 'bg-slate-900'}`}>
        {mastered ? <Award size={40} /> : <RotateCcw size={40} />}
      </div>
      <div>
        <p className={`text-xs font-black uppercase tracking-widest mb-2 ${mastered ? 'text-emerald-600' : 'text-slate-400'}`}>
          {mastered ? '✦ Mastered' : 'Keep Practising'}
        </p>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Your Results</h2>
        <p className="text-sm text-slate-400 font-semibold mt-1">{title}</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-6xl font-black text-slate-900">{correct} <span className="text-slate-300">/</span> {total}</p>
        <div className="w-full max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 }}
            className={`h-full rounded-full ${mastered ? 'bg-emerald-500' : 'bg-blue-500'}`} />
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-2">
        <button onClick={onRetry} className="w-full py-5 bg-slate-100 text-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">
          Try Again
        </button>
        <button onClick={onContinue} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl">
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  )
}
