import { useState } from 'react';
import { BookOpen, ExternalLink, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { WaterNewsItem } from '../../services/waterService';

type NewsType = 'all' | 'historical' | 'policy' | 'research' | 'breaking_alert';

const TYPE_CONFIG: Record<NewsType, { label: string; color: string; bg: string; border: string }> = {
  all:           { label: 'All',        color: 'text-slate-700', bg: 'bg-slate-100',  border: 'border-slate-200' },
  historical:    { label: 'Historical', color: 'text-amber-700', bg: 'bg-amber-100',  border: 'border-amber-200' },
  policy:        { label: 'Policy',     color: 'text-blue-700',  bg: 'bg-blue-100',   border: 'border-blue-200' },
  research:      { label: 'Research',   color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-200' },
  breaking_alert:{ label: 'Alert',      color: 'text-red-700',   bg: 'bg-red-100',    border: 'border-red-200' },
};

const IMPORTANCE_STARS: Record<number, string> = {
  5: '●●●●●',
  4: '●●●●○',
  3: '●●●○○',
  2: '●●○○○',
  1: '●○○○○',
};

function NewsCard({ item }: { item: WaterNewsItem }) {
  const [open, setOpen] = useState(false);
  const type = (item.news_type ?? 'historical') as NewsType;
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.historical;
  const year = item.published_at ? new Date(item.published_at).getFullYear() : '';

  return (
    <div className={`rounded-2xl border ${cfg.border} overflow-hidden`}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full text-left p-4 ${cfg.bg}`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white/60 ${cfg.color}`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/70 ${cfg.color}`}>
                  {cfg.label}
                </span>
                {year && <span className="text-xs text-slate-500 font-medium">{year}</span>}
                {item.importance_level && (
                  <span className="text-xs text-amber-500 font-mono tracking-tighter">
                    {IMPORTANCE_STARS[item.importance_level] ?? ''}
                  </span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>
            <h4 className={`font-bold text-sm ${cfg.color} leading-snug`}>{item.headline}</h4>
            {item.affected_provinces && item.affected_provinces.length > 0 && item.affected_provinces.length <= 3 && (
              <p className="text-xs text-slate-500 mt-1">{item.affected_provinces.join(', ')}</p>
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white border-t border-slate-100 space-y-3">
              {item.summary && (
                <p className="text-sm text-slate-700 leading-relaxed">{item.summary}</p>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {item.source && (
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Source: {item.source}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Props {
  news: WaterNewsItem[];
  province: string;
}

export function ResearchSection({ news, province }: Props) {
  const [typeFilter, setTypeFilter] = useState<NewsType>('all');
  const [search, setSearch] = useState('');

  const filtered = news.filter(n => {
    if (typeFilter !== 'all' && n.news_type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        n.headline.toLowerCase().includes(q) ||
        n.summary?.toLowerCase().includes(q) ||
        n.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Research & History</h2>
        <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{filtered.length}</span>
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder="Search events, policies, crises…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        {(Object.keys(TYPE_CONFIG) as NewsType[]).map(t => {
          const cfg = TYPE_CONFIG[t];
          const active = typeFilter === t;
          return (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                active
                  ? `${cfg.bg} ${cfg.color} border-transparent`
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-400 font-medium">No results found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
