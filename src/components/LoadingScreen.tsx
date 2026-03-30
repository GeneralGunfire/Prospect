import { useEffect } from 'react';
import { motion } from 'motion/react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 bg-white flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl"
          style={{ backgroundColor: '#1e293b' }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-white font-bold text-6xl"
          >
            P
          </motion.span>
        </motion.div>

        {/* Prospect Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-5xl font-bold tracking-tight"
          style={{ color: '#1B5E20' }}
        >
          Prospect
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="text-sm uppercase font-semibold tracking-widest text-center"
          style={{ color: '#64748b' }}
        >
          Know your path. Own your future.
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 2.5, ease: 'easeInOut' }}
          className="h-0.5 w-16 bg-gradient-to-r mt-8"
          style={{
            backgroundImage: 'linear-gradient(to right, #1e293b, #1B5E20)',
            transformOrigin: 'left'
          }}
        />
      </div>
    </motion.div>
  );
}
