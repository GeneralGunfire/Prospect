import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  onClick: () => void;
  accentColor?: string; // e.g. '#3B5A7F'
}

interface CategoryListProps {
  title: string;
  subtitle: string;
  categories: Category[];
}

const DEFAULT_COLORS = [
  '#1E3A5F', '#3B5A7F', '#176293', '#1A3E6F',
  '#2e4d6e', '#1B5E20', '#b45309', '#7c3aed',
];

export function CategoryList({ title, subtitle, categories }: CategoryListProps) {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Explore</p>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">{title}</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">{subtitle}</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {categories.map((cat, i) => {
          const color = cat.accentColor ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          return (
            <motion.button
              key={cat.id}
              onClick={cat.onClick}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="group relative flex flex-col items-start gap-3 p-5 md:p-6 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-lg transition-all duration-200 text-left overflow-hidden"
            >
              {/* Subtle gradient bg on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.035] transition-opacity duration-300 rounded-2xl"
                style={{ background: `radial-gradient(circle at top left, ${color}, transparent 70%)` }}
              />

              {/* Icon container */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ backgroundColor: color }}
              >
                {cat.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-800 leading-tight">{cat.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{cat.subtitle}</p>
              </div>

              {/* Arrow */}
              <ArrowRight
                className="absolute bottom-4 right-4 w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-200"
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
