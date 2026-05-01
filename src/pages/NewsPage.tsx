import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Newspaper, TrendingUp, GraduationCap, BarChart3,
  Landmark, LayoutGrid, Clock, ExternalLink, ChevronDown,
  ChevronUp, RefreshCw, Phone
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';

// ── Types ──────────────────────────────────────────────────────────────────────

type Category = 'All' | 'Job Market' | 'Education' | 'Economy' | 'Government';

interface Article {
  id: string;
  source: string;
  title: string;
  summary: string;
  category: Category;
  priority_score: number;
  url: string;
  date: string;
}

// ── Category config ────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<Category, { icon: React.ReactNode; bg: string; text: string; border: string; dot: string }> = {
  All: {
    icon: <LayoutGrid className="w-3.5 h-3.5" />,
    bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500'
  },
  'Job Market': {
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500'
  },
  Education: {
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500'
  },
  Economy: {
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500'
  },
  Government: {
    icon: <Landmark className="w-3.5 h-3.5" />,
    bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500'
  },
};

const CATEGORIES: Category[] = ['All', 'Job Market', 'Education', 'Economy', 'Government'];

// ── Sub-components ─────────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: Category }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
      {cfg.icon}
      {category}
    </span>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const [expanded, setExpanded] = useState(false);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <CategoryBadge category={article.category} />
          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
            <Clock className="w-3 h-3" />
            {timeAgo(article.date)}
          </div>
        </div>

        <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">
          {article.title}
        </h3>

        <p className="text-xs text-slate-500 font-medium mb-3">
          {article.source}
        </p>

        <AnimatePresence>
          {expanded && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-slate-600 leading-relaxed mb-3 overflow-hidden"
            >
              {article.summary}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" /> Read summary</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

function NewsPage({ user, onNavigate }: AuthedProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetch('/data/news/latest.json')
      .then(r => r.json())
      .then((data: Article[]) => {
        setArticles(data);
        if (data.length > 0) {
          const latest = data.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b);
          setLastUpdated(new Date(latest.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }));
        }
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentPage="news" user={user} onNavigate={onNavigate} mode="news" />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-2xl text-slate-900 uppercase tracking-wide">SA News</h1>
              <p className="text-xs text-slate-500">
                What matters to your future
              </p>
            </div>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
              <RefreshCw className="w-3 h-3" />
              Updated {lastUpdated} · Curated daily
            </div>
          )}
        </motion.div>

        {/* Category filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => {
            const cfg = CATEGORY_CONFIG[cat];
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 border
                  ${active
                    ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                  }`}
              >
                {cfg.icon}
                {cat}
                {active && filtered.length > 0 && (
                  <span className={`ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs ${cfg.dot} text-white`}>
                    {filtered.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Articles */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
                <div className="h-4 bg-slate-100 rounded-full w-24 mb-3" />
                <div className="h-5 bg-slate-100 rounded-lg w-full mb-2" />
                <div className="h-5 bg-slate-100 rounded-lg w-3/4 mb-3" />
                <div className="h-3 bg-slate-100 rounded-full w-16" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No articles in this category</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="mt-3 text-sm text-blue-600 font-bold hover:underline"
            >
              Show all articles
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Emergency numbers strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-slate-900 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-4 h-4 text-slate-300" />
            <h2 className="font-black text-sm uppercase tracking-wider text-white">Emergency Numbers</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Police (SAPS)', number: '10111' },
              { label: 'Ambulance', number: '10177' },
              { label: 'ER24', number: '084 124' },
              { label: 'NSFAS Hotline', number: '0800 067 327' },
              { label: 'SASSA Hotline', number: '0800 601 011' },
              { label: 'Home Affairs', number: '0800 601 190' },
            ].map(({ label, number }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="font-black text-white text-lg">{number}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default withAuth(NewsPage);
