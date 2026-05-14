import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Droplets, ShieldCheck, Leaf, AlertTriangle } from 'lucide-react';

type Category = 'all' | 'storage' | 'conservation' | 'health' | 'emergency';

interface Tip {
  title: string;
  description: string;
  category: Exclude<Category, 'all'>;
  steps: string[];
  costEstimate: string;
  icon: React.ReactNode;
}

const TIPS: Tip[] = [
  {
    title: 'Install a Jojo Tank',
    description: 'Harvest rainwater for toilet flushing and garden use.',
    category: 'storage',
    icon: <Droplets className="w-5 h-5" />,
    steps: [
      'Buy a 500L–2000L plastic tank (JoJo or similar)',
      'Connect gutters to channel rainwater in',
      'Use stored water for toilets, gardens, and cleaning',
      'Fit a first-flush diverter to keep debris out',
    ],
    costEstimate: 'R1 000 – R5 000',
  },
  {
    title: 'Stock Bottled Drinking Water',
    description: 'Keep 5–6 litres per person per day for emergencies.',
    category: 'storage',
    icon: <Droplets className="w-5 h-5" />,
    steps: [
      'Store at least 5L per person per day (3-day minimum)',
      'Keep in a cool, dark location away from direct sunlight',
      'Label with purchase date and rotate every 6 months',
      'Include water purification tablets as backup',
    ],
    costEstimate: 'R50 – R100 / month',
  },
  {
    title: 'Fill Large Water Bins',
    description: 'Emergency reserves for toilet flushing and washing.',
    category: 'storage',
    icon: <Droplets className="w-5 h-5" />,
    steps: [
      'Get 3–5 large plastic bins (25L–100L each)',
      'Fill when tap is running and top up daily',
      'Use primarily for toilet flushing during outages',
      'Refresh water every 3 days to prevent stagnation',
    ],
    costEstimate: 'R100 – R300',
  },
  {
    title: 'Install a Borehole',
    description: 'Tap groundwater if your property allows it.',
    category: 'storage',
    icon: <Droplets className="w-5 h-5" />,
    steps: [
      'Contact a licensed driller for a site assessment',
      'Apply for a water use licence from DWS',
      'Install a pump and storage tank',
      'Test water quality before use (pH, bacteria, metals)',
    ],
    costEstimate: 'R5 000 – R20 000',
  },
  {
    title: 'Limit Shower Duration',
    description: 'Cut usage to under 5 minutes — saves 50L+ per shower.',
    category: 'conservation',
    icon: <Leaf className="w-5 h-5" />,
    steps: [
      'Set a 5-minute timer before entering the shower',
      'Install a low-flow showerhead (saves 8L per minute)',
      'Turn off water while lathering',
      'Collect "warm-up" water in a bucket for plants',
    ],
    costEstimate: 'R200 – R500',
  },
  {
    title: 'Fix All Leaks Immediately',
    description: 'A dripping tap wastes 20L+ per day.',
    category: 'conservation',
    icon: <Leaf className="w-5 h-5" />,
    steps: [
      'Check all taps, toilets, and pipes monthly',
      'Replace worn washers and O-rings (R5–R20 each)',
      'Install dual-flush toilet cisterns',
      'Report street leaks to your municipality same day',
    ],
    costEstimate: 'R20 – R500',
  },
  {
    title: 'Reuse Greywater',
    description: 'Use rinse water from dishes and laundry on your garden.',
    category: 'conservation',
    icon: <Leaf className="w-5 h-5" />,
    steps: [
      'Use a bucket to collect rinse water from dishes',
      'Channel bath and shower water to garden via pipe',
      'Avoid using on food crops (soap residue)',
      'Do not store greywater for more than 24 hours',
    ],
    costEstimate: 'R0 – R200',
  },
  {
    title: 'Boil Water Safely',
    description: 'During boil-water advisories, all tap water must be boiled.',
    category: 'health',
    icon: <ShieldCheck className="w-5 h-5" />,
    steps: [
      'Bring water to a rolling boil for at least 1 minute',
      'Allow to cool before storing in a clean, covered container',
      'Use boiled water for drinking, cooking, and brushing teeth',
      'Discard ice made from unboiled water',
    ],
    costEstimate: 'R0',
  },
  {
    title: 'Use Water Purification Tablets',
    description: 'Chemical treatment when boiling is not possible.',
    category: 'health',
    icon: <ShieldCheck className="w-5 h-5" />,
    steps: [
      'Purchase sodium hypochlorite tablets (2mg/L dosage)',
      'Add 1 tablet per litre, wait 30 minutes before drinking',
      'Store tablets in a cool, dry place',
      'Do not use on visibly turbid water without filtering first',
    ],
    costEstimate: 'R30 – R80 / pack',
  },
  {
    title: 'Prepare an Emergency Water Kit',
    description: 'Have supplies ready before an outage hits.',
    category: 'emergency',
    icon: <AlertTriangle className="w-5 h-5" />,
    steps: [
      'Assemble: 20L+ stored water, purification tablets, manual pump',
      'Include a bucket, 5L bottles, waterproof bags',
      'Store kit in an accessible location',
      'Check and refresh every 6 months',
    ],
    costEstimate: 'R200 – R600',
  },
  {
    title: 'Know Your Municipal Emergency Number',
    description: 'Report outages and burst pipes quickly.',
    category: 'emergency',
    icon: <AlertTriangle className="w-5 h-5" />,
    steps: [
      'Johannesburg Water: 0860 562 874',
      'Cape Town: 0860 103 089',
      'eThekwini: 080 031 1111',
      'Nelson Mandela Bay: 0800 20 5050',
      'Tshwane: 012 358 9999',
    ],
    costEstimate: 'Free',
  },
];

const CATEGORY_CONFIG: Record<Category, { label: string; color: string; bg: string }> = {
  all:          { label: 'All Tips',     color: 'text-slate-700', bg: 'bg-slate-100' },
  storage:      { label: 'Storage',      color: 'text-blue-700',  bg: 'bg-blue-100' },
  conservation: { label: 'Conservation', color: 'text-green-700', bg: 'bg-green-100' },
  health:       { label: 'Health',       color: 'text-purple-700', bg: 'bg-purple-100' },
  emergency:    { label: 'Emergency',    color: 'text-red-700',   bg: 'bg-red-100' },
};

function TipCard({ tip }: { tip: Tip }) {
  const [open, setOpen] = useState(false);
  const cfg = CATEGORY_CONFIG[tip.category];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.color}`}>
          {tip.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-slate-900 text-sm">{tip.title}</h4>
            <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{tip.description}</p>
          <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
            {cfg.label} · {tip.costEstimate}
          </span>
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
            <div className="px-4 pb-4 pt-0 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-600 mt-3 mb-2">Steps:</p>
              <ol className="space-y-1.5">
                {tip.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PreparednessSection() {
  const [category, setCategory] = useState<Category>('all');

  const filtered = category === 'all' ? TIPS : TIPS.filter(t => t.category === category);

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Preparedness Tips</h2>
        <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{filtered.length}</span>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        {(Object.keys(CATEGORY_CONFIG) as Category[]).map(cat => {
          const cfg = CATEGORY_CONFIG[cat];
          const active = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
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

      <div className="space-y-3">
        {filtered.map(tip => (
          <TipCard key={tip.title} tip={tip} />
        ))}
      </div>
    </section>
  );
}
