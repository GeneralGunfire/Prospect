import { motion } from 'motion/react'

interface EquationBoxProps { lines: string[]; highlight?: boolean; delay?: number }

export function EquationBox({ lines, highlight = false, delay = 0 }: EquationBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`rounded-2xl px-8 py-6 font-mono text-2xl font-black text-slate-900 space-y-2 ${highlight ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50 border border-slate-200'}`}
    >
      {lines.map((line, i) => <div key={i}>{line}</div>)}
    </motion.div>
  )
}
