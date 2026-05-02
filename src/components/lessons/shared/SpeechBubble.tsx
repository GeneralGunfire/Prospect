import { motion } from 'motion/react'

interface SpeechBubbleProps { children: string; color?: 'blue' | 'green' | 'yellow'; delay?: number }

export function SpeechBubble({ children, color = 'blue', delay = 0 }: SpeechBubbleProps) {
  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900'
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className={`rounded-2xl border-2 px-5 py-3 text-sm font-semibold ${colorMap[color]}`}
    >
      {children}
    </motion.div>
  )
}
