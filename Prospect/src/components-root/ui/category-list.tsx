import type { ReactNode } from 'react';

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  onClick: () => void;
}

interface CategoryListProps {
  title: string;
  subtitle: string;
  categories: Category[];
}

export function CategoryList({ title, subtitle, categories }: CategoryListProps) {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-tight mb-2">{title}</h2>
        <p className="text-slate-500">{subtitle}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={cat.onClick}
            className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              {cat.icon}
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">{cat.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{cat.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
