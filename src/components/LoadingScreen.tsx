import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed inset-0 z-100 bg-white flex items-center justify-center overflow-hidden"
      >
        <div className="relative flex flex-col items-center gap-6">
          {/* Prospect Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: '#1B5E20' }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-white font-bold text-5xl select-none"
            >
              P
            </motion.span>
          </motion.div>

          {/* Prospect Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold tracking-tight"
            style={{ color: '#1B5E20' }}
          >
            Prospect
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-sm uppercase font-semibold tracking-widest"
            style={{ color: '#64748b' }}
          >
            Know your path. Own your future.
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
