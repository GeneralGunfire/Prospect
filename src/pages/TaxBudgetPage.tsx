import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calculator, DollarSign, PieChart, Info,
  ChevronDown, ChevronUp, Wallet, Home, Car,
  ShoppingCart, Zap, Wifi, Smile
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';

// ── 2026 SARS Tax Brackets ─────────────────────────────────────────────────────

const TAX_BRACKETS_2026 = [
  { min: 0,        max: 237100,   rate: 18,  base: 0 },
  { min: 237100,   max: 370500,   rate: 26,  base: 42678 },
  { min: 370500,   max: 512800,   rate: 31,  base: 77362 },
  { min: 512800,   max: 673000,   rate: 36,  base: 121475 },
  { min: 673000,   max: 857900,   rate: 39,  base: 179147 },
  { min: 857900,   max: 1817000,  rate: 41,  base: 251258 },
  { min: 1817000,  max: Infinity, rate: 45,  base: 644489 },
];

const PRIMARY_REBATE = 17235;
const UIF_RATE = 0.01; // 1% of gross (employee contribution)

// ── SA Provinces ───────────────────────────────────────────────────────────────

const PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
  'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape'
];

const LIVING_SITUATIONS = [
  { value: 'alone', label: 'Living alone' },
  { value: 'shared', label: 'Shared accommodation' },
  { value: 'family', label: 'Living with family' },
];

// ── Tax calculation ────────────────────────────────────────────────────────────

function calculateAnnualTax(annualIncome: number): number {
  const bracket = [...TAX_BRACKETS_2026].reverse().find(b => annualIncome > b.min) ?? TAX_BRACKETS_2026[0];
  const tax = bracket.base + (annualIncome - bracket.min) * (bracket.rate / 100);
  return Math.max(0, tax - PRIMARY_REBATE);
}

// ── Budget estimates by province & situation ───────────────────────────────────

const RENT_ESTIMATES: Record<string, Record<string, number>> = {
  Gauteng:       { alone: 9500,  shared: 5000, family: 0 },
  'Western Cape': { alone: 12000, shared: 6500, family: 0 },
  'KwaZulu-Natal':{ alone: 8000,  shared: 4500, family: 0 },
  'Eastern Cape': { alone: 6500,  shared: 3500, family: 0 },
  Limpopo:       { alone: 5500,  shared: 3000, family: 0 },
  Mpumalanga:    { alone: 5800,  shared: 3200, family: 0 },
  'North West':  { alone: 5700,  shared: 3100, family: 0 },
  'Free State':  { alone: 6000,  shared: 3200, family: 0 },
  'Northern Cape':{ alone: 6200,  shared: 3400, family: 0 },
};

const FOOD_ESTIMATES: Record<string, number> = {
  alone: 2000, shared: 1600, family: 600
};

const TRANSPORT_ESTIMATES: Record<string, number> = {
  Gauteng: 2200, 'Western Cape': 2000, 'KwaZulu-Natal': 1800,
  'Eastern Cape': 1600, Limpopo: 1400, Mpumalanga: 1500,
  'North West': 1500, 'Free State': 1600, 'Northern Cape': 1700
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionCard({ title, icon, children, defaultOpen = true }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            {icon}
          </div>
          <span className="font-black text-sm uppercase tracking-wider text-slate-900">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800">
      <Info className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

function TaxBudgetPage({ user, onNavigate }: AuthedProps) {
  const [grossMonthly, setGrossMonthly] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [living, setLiving] = useState('shared');

  const gross = parseFloat(grossMonthly.replace(/,/g, '')) || 0;
  const annualGross = gross * 12;
  const annualTax = gross > 0 ? calculateAnnualTax(annualGross) : 0;
  const monthlyTax = annualTax / 12;
  const monthlyUIF = Math.min(gross * UIF_RATE, 177.12); // UIF capped
  const monthlyNet = gross - monthlyTax - monthlyUIF;

  const taxPercent = gross > 0 ? Math.round((monthlyTax / gross) * 100) : 0;
  const uifPercent = gross > 0 ? Math.round((monthlyUIF / gross) * 100) : 0;
  const netPercent = 100 - taxPercent - uifPercent;

  const rent = RENT_ESTIMATES[province]?.[living] ?? 5000;
  const food = FOOD_ESTIMATES[living] ?? 1600;
  const transport = TRANSPORT_ESTIMATES[province] ?? 1800;
  const utilities = 900;
  const entertainment = 600;
  const savings = Math.max(0, monthlyNet - rent - food - transport - utilities - entertainment);
  const totalSpend = rent + food + transport + utilities + entertainment;
  const budgetWarning = monthlyNet > 0 && totalSpend > monthlyNet * 0.85;

  const fmt = (n: number) => `R${Math.round(n).toLocaleString('en-ZA')}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentPage="tax-budget" user={user} onNavigate={onNavigate} mode="community" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-12 sm:pb-16 space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-xl sm:text-2xl text-slate-900 uppercase tracking-wide">Tax & Budget</h1>
              <p className="text-xs text-slate-500">Understand your money · 2026 rates</p>
            </div>
          </div>
        </motion.div>

        {/* Tax explainer */}
        <SectionCard title="How South African Tax Works" icon={<DollarSign className="w-4 h-4" />}>
          <div className="space-y-4 pt-2">
            <InfoBox>
              South Africa uses a <strong>progressive income tax</strong> system — the more you earn, the higher your marginal rate. You don't pay the highest rate on ALL your income, only on the portion above each threshold.
            </InfoBox>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">2026/27 Tax Brackets</p>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[320px] text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-600">Annual Income</th>
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-600">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TAX_BRACKETS_2026.map((b, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="px-4 py-2.5 text-slate-700">
                          {b.max === Infinity
                            ? `R${(b.min).toLocaleString()}+`
                            : `R${(b.min).toLocaleString()} – R${(b.max).toLocaleString()}`}
                        </td>
                        <td className="px-4 py-2.5 font-bold text-slate-900">{b.rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Primary rebate (2026): R17,235 — if your annual tax is less than this, you pay no tax.
                Workers earning under <strong>R95,750/year</strong> pay no income tax.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-black text-xs uppercase tracking-wider text-slate-500 mb-1">PAYE</p>
                <p className="text-sm text-slate-700">Pay As You Earn — your employer deducts income tax from your salary every month and pays SARS on your behalf. You don't need to pay separately.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-black text-xs uppercase tracking-wider text-slate-500 mb-1">UIF</p>
                <p className="text-sm text-slate-700">Unemployment Insurance Fund — you contribute 1% of your salary (capped at R177/month). This covers you if you lose your job or go on maternity leave.</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Calculator */}
        <SectionCard title="Tax Calculator" icon={<Calculator className="w-4 h-4" />}>
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Monthly Gross Salary (before deductions)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">R</span>
                <input
                  type="number"
                  value={grossMonthly}
                  onChange={e => setGrossMonthly(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full pl-8 pr-4 py-3 min-h-12 text-base rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {gross > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Breakdown bar */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Breakdown</p>
                  <div className="flex rounded-xl overflow-hidden h-8 gap-0.5">
                    <div
                      className="bg-blue-500 flex items-center justify-center text-xs font-black text-white transition-all"
                      style={{ width: `${netPercent}%` }}
                    >
                      {netPercent > 10 && `${netPercent}%`}
                    </div>
                    <div
                      className="bg-red-400 flex items-center justify-center text-xs font-black text-white transition-all"
                      style={{ width: `${taxPercent}%` }}
                    >
                      {taxPercent > 5 && `${taxPercent}%`}
                    </div>
                    <div
                      className="bg-amber-400 flex items-center justify-center text-xs font-black text-white transition-all"
                      style={{ width: `${uifPercent}%` }}
                    >
                      {uifPercent > 2 && `${uifPercent}%`}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />Take-home</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-400" />PAYE</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />UIF</span>
                  </div>
                </div>

                {/* Numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Gross', value: fmt(gross), color: 'text-slate-900' },
                    { label: 'PAYE', value: `−${fmt(monthlyTax)}`, color: 'text-red-500' },
                    { label: 'UIF', value: `−${fmt(monthlyUIF)}`, color: 'text-amber-600' },
                    { label: 'Take-home', value: fmt(monthlyNet), color: 'text-blue-500' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">{label}</p>
                      <p className={`font-black text-lg ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>

                <InfoBox>
                  For every <strong>R100</strong> you earn, you take home approximately <strong>R{netPercent}</strong>.
                  {annualGross < 95750 && ' At this income level, you pay no income tax — only UIF.'}
                </InfoBox>
              </motion.div>
            )}
          </div>
        </SectionCard>

        {/* Budget builder */}
        <SectionCard title="Budget Builder" icon={<PieChart className="w-4 h-4" />} defaultOpen={gross > 0}>
          <div className="space-y-4 pt-2">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Province</label>
                <select
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  className="w-full px-3.5 py-3 min-h-12 text-base rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-slate-400 transition-colors"
                >
                  {PROVINCES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Living situation</label>
                <select
                  value={living}
                  onChange={e => setLiving(e.target.value)}
                  className="w-full px-3.5 py-3 min-h-12 text-base rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-slate-400 transition-colors"
                >
                  {LIVING_SITUATIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {budgetWarning && (
              <div className="flex gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Your estimated expenses exceed 85% of your take-home pay. Consider shared accommodation or cutting entertainment spend.</span>
              </div>
            )}

            <div className="space-y-2.5">
              {[
                { icon: <Home className="w-4 h-4" />, label: living === 'family' ? 'Rent / contribution' : 'Rent', value: rent, color: 'bg-blue-500' },
                { icon: <ShoppingCart className="w-4 h-4" />, label: 'Food & groceries', value: food, color: 'bg-blue-500' },
                { icon: <Car className="w-4 h-4" />, label: 'Transport', value: transport, color: 'bg-blue-500' },
                { icon: <Zap className="w-4 h-4" />, label: 'Electricity & water', value: utilities, color: 'bg-amber-500' },
                { icon: <Wifi className="w-4 h-4" />, label: 'Entertainment & data', value: entertainment, color: 'bg-blue-500' },
              ].map(({ icon, label, value, color }) => {
                const pct = monthlyNet > 0 ? Math.min(100, Math.round((value / monthlyNet) * 100)) : 0;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{label}</span>
                        <span className="text-sm font-bold text-slate-900">{fmt(value)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {gross > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 rounded-xl border ${savings >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}
              >
                <div className="flex items-center gap-2">
                  <Smile className={`w-4 h-4 ${savings >= 0 ? 'text-blue-500' : 'text-red-500'}`} />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-600">Estimated monthly savings</span>
                </div>
                <p className={`font-black text-2xl mt-1 ${savings >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
                  {savings >= 0 ? fmt(savings) : `−${fmt(Math.abs(savings))}`}
                </p>
                {savings < 0 && (
                  <p className="text-xs text-red-600 mt-1">Expenses exceed take-home pay. Consider adjusting your budget.</p>
                )}
              </motion.div>
            )}

            {gross === 0 && (
              <div className="text-center py-8">
                <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Enter your monthly salary above to see your budget breakdown</p>
              </div>
            )}
          </div>
        </SectionCard>
      </main>
    </div>
  );
}

export default withAuth(TaxBudgetPage);
