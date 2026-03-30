import { useEffect } from 'react';
import { motion } from 'motion/react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(40px)' }}
      transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
      className="fixed inset-0 z-100 bg-white flex items-center justify-center overflow-hidden"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo box with bounce entrance */}
        <div className="relative mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-[0_20px_40px_rgba(15,23,42,0.15)] border border-slate-200"
            style={{ backgroundColor: '#1e293b' }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-white font-semibold text-6xl select-none"
            >
              P
            </motion.span>
          </motion.div>

          {/* Outer ring pulse */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ delay: 1, duration: 1.2, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.5 }}
            className="absolute inset-0 border-2 border-slate-300/40 rounded-2xl -z-10"
          />
        </div>

        {/* "Prospect" text slide up */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 1.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-semibold tracking-tight uppercase"
            style={{ color: '#1e293b', fontFamily: 'Outfit, sans-serif' }}
          >
            Prospect
          </motion.div>
        </div>

        {/* Tagline fade in */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ delay: 1.8, duration: 1, ease: 'easeOut' }}
          className="mt-6 text-[11px] uppercase font-medium"
          style={{ color: '#64748b' }}
        >
          Know your path. Own your future.
        </motion.p>
      </div>

      {/* Background atmosphere */}
      <motion.div
        animate={{ opacity: [0.03, 0.08, 0.03], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-linear-to-b from-slate-100 to-transparent -z-10"
      />
    </motion.div>
  );
}
