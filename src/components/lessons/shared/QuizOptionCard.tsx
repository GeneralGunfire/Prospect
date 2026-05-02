import { motion } from 'motion/react'

interface QuizOptionCardProps { label: string; text: string; state: 'default' | 'selected' | 'correct' | 'wrong' | 'dimmed'; onClick: () => void }

export function QuizOptionCard({ label, text, state, onClick }: QuizOptionCardProps) {
  const stateStyles = {
    default: 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50 cursor-pointer',
    selected: 'border-blue-500 bg-blue-50',
    correct: 'border-emerald-500 bg-emerald-50 text-emerald-900',
    wrong: 'border-rose-500 bg-rose-50 text-rose-900',
    dimmed: 'border-slate-100 bg-white text-slate-300 cursor-default'
  }
  return (
    <motion.button
      whileTap={state === 'default' ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border-2 text-base font-semibold transition-all ${stateStyles[state]}`}
    >
      <span className="mr-3 font-black opacity-40">{label}</span>{text}
    </motion.button>
  )
}
