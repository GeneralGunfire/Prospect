import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Fuel, Zap, ShoppingCart, Droplets, MapPin,
  TrendingDown, TrendingUp, Minus, Info, RefreshCw
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProvinceData {
  name: string;
  petrol_95: number;
  petrol_93: number;
  diesel: number;
  electricity_per_kwh: number;
  electricity_monthly_estimate: Record<string, { kwh: number; cost: number }>;
  water_per_kl: number;
  water_monthly_estimate: Record<string, { kl: number; cost: number }>;
}

interface FoodItem { name: string; price: number }

interface CostData {
  last_updated: string;
  provinces: Record<string, ProvinceData>;
  food_basket: {
    note: string;
    items: FoodItem[];
    monthly_estimate: Record<string, number>;
  };
  lifestyle_monthly_total: {
    tiers: Record<string, {
      label: string;
      description: string;
      provinces: Record<string, number>;
    }>;
  };
}

// ── Fallback data ──────────────────────────────────────────────────────────────

const PROVINCE_KEYS: Record<string, string> = {
  'Gauteng': 'gauteng',
  'Western Cape': 'western_cape',
  'KwaZulu-Natal': 'kwazulu_natal',
  'Eastern Cape': 'eastern_cape',
  'Limpopo': 'limpopo',
  'Mpumalanga': 'mpumalanga',
  'North West': 'north_west',
  'Free State': 'free_state',
  'Northern Cape': 'northern_cape',
};

const PROVINCE_NAMES = Object.keys(PROVINCE_KEYS);

// ── Sub-components ─────────────────────────────────────────────────────────────

function MetricCard({
  icon, label, value, sub, color
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${color}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-black uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-black text-2xl">{value}</p>
      {sub && <p className="text-xs mt-0.5 opacity-70">{sub}</p>}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

function CostOfLivingPage({ user, onNavigate }: AuthedProps) {
  const [data, setData] = useState<CostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState('Gauteng');

  useEffect(() => {
    fetch('/data/cost-of-living.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const key = PROVINCE_KEYS[province];
  const pd = data?.provinces[key];
  const food = data?.food_basket;
  const lifestyle = data?.lifestyle_monthly_total?.tiers;

  const fmt = (n: number) => `R${n.toLocaleString('en-ZA')}`;
  const fmt2 = (n: number) => `R${n.toFixed(2)}`;

  const TIER_COLORS: Record<string, string> = {
    minimal: 'bg-blue-50 border-blue-200 text-blue-900',
    moderate: 'bg-blue-50 border-blue-200 text-blue-900',
    comfortable: 'bg-blue-50 border-blue-200 text-slate-900',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentPage="cost-of-living" user={user} onNavigate={onNavigate} mode="community" />

      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-2xl text-slate-900 uppercase tracking-wide">Cost of Living</h1>
              <p className="text-xs text-slate-500">By province · 2026 estimates</p>
            </div>
          </div>
          {data && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
              <RefreshCw className="w-3 h-3" />
              Data updated {data.last_updated}
            </div>
          )}
        </motion.div>

        {/* Province selector */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            Select Province
          </label>
          <div className="flex flex-wrap gap-2">
            {PROVINCE_NAMES.map(p => (
              <button
                key={p}
                onClick={() => setProvince(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150
                  ${province === p
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && pd && (
          <>
            {/* Fuel section */}
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-3">Fuel Prices</h2>
              <div className="grid grid-cols-3 gap-3">
                <MetricCard
                  icon={<Fuel className="w-3.5 h-3.5 text-blue-600" />}
                  label="Petrol 95"
                  value={fmt2(pd.petrol_95)}
                  sub="per liter"
                  color="bg-blue-50 border border-blue-200 text-blue-900"
                />
                <MetricCard
                  icon={<Fuel className="w-3.5 h-3.5 text-blue-600" />}
                  label="Petrol 93"
                  value={fmt2(pd.petrol_93)}
                  sub="per liter"
                  color="bg-blue-50 border border-blue-200 text-blue-900"
                />
                <MetricCard
                  icon={<Fuel className="w-3.5 h-3.5 text-blue-500" />}
                  label="Diesel"
                  value={fmt2(pd.diesel)}
                  sub="per liter"
                  color="bg-blue-50 border border-blue-200 text-slate-900"
                />
              </div>
            </motion.section>

            {/* Electricity section */}
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-3">Electricity (Eskom tariff)</h2>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Rate per kWh</p>
                    <p className="font-black text-2xl text-slate-900">{fmt2(pd.electricity_per_kwh)}</p>
                  </div>
                  <Zap className="w-8 h-8 text-amber-400" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(pd.electricity_monthly_estimate).map(([tier, val]) => (
                    <div key={tier} className="text-center p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-xs font-black uppercase tracking-wider text-amber-700 mb-0.5">
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </p>
                      <p className="font-black text-slate-900">{fmt(val.cost)}</p>
                      <p className="text-xs text-amber-600">{val.kwh} kWh/mo</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Water section */}
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-3">Water Tariffs (municipal)</h2>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Rate per kL</p>
                    <p className="font-black text-2xl text-slate-900">{fmt2(pd.water_per_kl)}</p>
                  </div>
                  <Droplets className="w-8 h-8 text-blue-400" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(pd.water_monthly_estimate).map(([tier, val]) => (
                    <div key={tier} className="text-center p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-xs font-black uppercase tracking-wider text-blue-700 mb-0.5">
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </p>
                      <p className="font-black text-slate-900">{fmt(val.cost)}</p>
                      <p className="text-xs text-blue-600">{val.kl} kL/mo</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </>
        )}

        {/* Food basket */}
        {!loading && food && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h2 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-3">Food Basket</h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
                <ShoppingCart className="w-4 h-4 text-slate-400" />
                <p className="text-xs text-slate-500">{food.note}</p>
              </div>
              <div className="divide-y divide-slate-100">
                {food.items.map(item => (
                  <div key={item.name} className="flex justify-between items-center px-5 py-2.5">
                    <span className="text-sm text-slate-700">{item.name}</span>
                    <span className="font-bold text-slate-900 text-sm">{fmt2(item.price)}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Monthly food estimate</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Single person', key: 'single' },
                    { label: 'Couple', key: 'couple' },
                    { label: 'Family of 4', key: 'family_4' },
                  ].map(({ label, key }) => (
                    <div key={key} className="text-center p-2 bg-white rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                      <p className="font-black text-slate-900">{fmt(food.monthly_estimate[key])}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Lifestyle tiers */}
        {!loading && lifestyle && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-1">Monthly Cost Estimate</h2>
            <p className="text-xs text-slate-400 mb-3">Total living cost by lifestyle tier in {province} — includes rent, food, transport, utilities</p>
            <div className="space-y-3">
              {Object.entries(lifestyle).map(([key, tier]) => (
                <div key={key} className={`rounded-2xl border p-4 ${TIER_COLORS[key] || 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-black text-sm uppercase tracking-wider">{tier.label}</p>
                    <p className="font-black text-2xl">{fmt(tier.provinces[PROVINCE_KEYS[province]] ?? 0)}</p>
                  </div>
                  <p className="text-xs opacity-70">{tier.description}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3 p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Estimates are for guidance only. Actual costs vary by lifestyle and specific municipality. Figures updated monthly.</span>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}

export default withAuth(CostOfLivingPage);
