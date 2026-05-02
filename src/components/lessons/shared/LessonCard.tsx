import { motion } from 'motion/react'

interface LessonCardProps { children: React.ReactNode; animate?: boolean; className?: string }

export function LessonCard({ children, animate = true, className = '' }: LessonCardProps) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-[2.5rem] border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  )
}
