import React from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck } from 'lucide-react';
import { useDataSaver } from '../contexts/DataSaverContext';

interface ModeSelectorProps {
  onSelect: (mode: boolean) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[90] bg-surface flex items-center justify-center p-6"
    >
      <div className="max-w-4xl w-full text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-navy tracking-tight mb-4 uppercase font-headline">
            Choose Your Experience
          </h2>
          <p className="text-secondary text-xs md:text-sm font-semibold tracking-[0.2em] uppercase">
            Select a browsing mode to continue
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Normal Mode */}
          <motion.button
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => onSelect(false)}
            className="group relative bg-white border border-slate-200 p-10 rounded-3xl text-left hover:border-secondary transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Zap className="text-secondary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-navy mb-4 uppercase tracking-tight font-headline">Normal Mode</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed font-normal">
                Full visual experience with animations, transitions, and high-fidelity graphics. Recommended for broadband connections.
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-all" />
          </motion.button>

          {/* Data Saver Mode */}
          <motion.button
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => onSelect(true)}
            className="group relative bg-white border border-slate-200 p-10 rounded-3xl text-left hover:border-secondary transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-navy/60 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-navy mb-4 uppercase tracking-tight font-headline">Data Saver</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed font-normal">
                Stripped-down, static version optimized for speed and low data usage. Zero animations, zero transitions.
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-100/50 rounded-full blur-3xl group-hover:bg-slate-100 transition-all" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
