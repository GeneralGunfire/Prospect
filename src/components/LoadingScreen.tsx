import { motion } from 'motion/react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  // We no longer use a fixed timer here. 
  // App.tsx controls visibility based on actual image loading.

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(32px)' }}
      transition={{ duration: 0.75, ease: [0.7, 0, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden"
      style={{ willChange: 'opacity, transform, filter' }}
    >
      {/* Atmospheric background gradient */}
      <motion.div
        animate={{ opacity: [0.04, 0.10, 0.04], scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, #3B5A7F18, transparent)',
          willChange: 'transform, opacity',
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* Logo block */}
        <div className="relative mb-10">
          <motion.div
            initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-[0_16px_40px_rgba(15,23,42,0.12)] border border-slate-100"
            style={{ backgroundColor: '#1e293b', willChange: 'transform, opacity' }}
          >
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5, ease: 'easeOut' }}
              className="text-white font-black text-5xl md:text-6xl select-none"
              style={{ letterSpacing: '-0.02em' }}
            >
              P
            </motion.span>
          </motion.div>

          {/* Pulse ring */}
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              delay: 0.9,
              duration: 1.1,
              ease: 'easeOut',
              repeat: Infinity,
              repeatDelay: 0.6,
            }}
            className="absolute inset-0 rounded-2xl border border-slate-300/50 -z-10"
            style={{ willChange: 'transform, opacity' }}
          />
        </div>

        {/* Wordmark */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 1.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-5xl font-black text-[#1e293b] tracking-tight uppercase"
            style={{ letterSpacing: '-0.015em', willChange: 'transform' }}
          >
            Prospect
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.15em' }}
          animate={{ opacity: 1, letterSpacing: '0.28em' }}
          transition={{ delay: 1.75, duration: 0.9, ease: 'easeOut' }}
          className="mt-5 text-slate-400 text-[10px] uppercase font-semibold"
          style={{ willChange: 'opacity' }}
        >
          Know Your Path
        </motion.p>

        {/* Progress bar */}
        <motion.div
          className="mt-8 h-px rounded-full overflow-hidden"
          style={{ width: '80px', backgroundColor: '#e2e8f0' }}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ delay: 0.4, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{ backgroundColor: '#3B5A7F', willChange: 'transform' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
