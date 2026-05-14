import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, AlertTriangle, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import type { DamLevel } from '../../services/waterService';

interface Props {
  dams: DamLevel[];
}

const CRITICAL = 20;
const WARNING = 40;

// Refined Color Palette from DESIGN.json
const COLORS = {
  navy: '#1E3A5F',
  midNavy: '#3B5A7F',
  surface: '#f8fafc',
  border: '#e2e8f0',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

function getBarColor(pct: number): string {
  if (pct < CRITICAL) return COLORS.error;
  if (pct < WARNING) return COLORS.warning;
  if (pct < 60) return COLORS.midNavy;
  return COLORS.success;
}

function getTrendIcon(trend: DamLevel['trend']) {
  if (trend === 'rising') return <TrendingUp className="w-3.5 h-3.5" />;
  if (trend === 'falling') return <TrendingDown className="w-3.5 h-3.5" />;
  return <Minus className="w-3.5 h-3.5" />;
}

// ── Dam Professional Card ──────────────────────────────────────────────────────

function DamProfessionalCard({ dam }: { dam: DamLevel }) {
  const color = getBarColor(dam.levelPercent);
  const isCritical = dam.levelPercent < CRITICAL;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
      className={`group relative bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
        isCritical ? 'border-red-100 shadow-red-500/5' : 'border-slate-200'
      }`}
    >
      {/* Professional Header Accent */}
      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }} />

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-black text-slate-900 tracking-tight truncate">
                {dam.damName}
              </h3>
              {isCritical && (
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              )}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {dam.province}
            </p>
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-tighter ${
            dam.trend === 'rising' ? 'text-green-600' : dam.trend === 'falling' ? 'text-red-500' : 'text-slate-400'
          }`}>
            {getTrendIcon(dam.trend)}
            {dam.trend}
          </div>
        </div>

        <div className="flex items-end justify-between mb-5">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tighter text-slate-900">
              {dam.levelPercent.toFixed(1)}
            </span>
            <span className="text-sm font-black text-slate-400">%</span>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Capacity Status</p>
            <p className="text-[10px] font-black uppercase tracking-tighter" style={{ color }}>
              {isCritical ? 'Critical Alert' : dam.levelPercent < WARNING ? 'Warning' : dam.levelPercent < 60 ? 'Moderate' : 'Optimal'}
            </p>
          </div>
        </div>

        {/* Professional Bar Visualization */}
        <div className="relative w-full h-3 bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${dam.levelPercent}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: color }}
          >
            {/* Subtle Sheen */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
          </motion.div>
        </div>

        {/* Micro Wave Effect (Very Subtle / Professional) */}
        <div className="mt-4 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <span>0%</span>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span>50%</span>
            </div>
            <div className="flex items-center gap-1 text-slate-900">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              <span>Current</span>
            </div>
          </div>
          <span>100%</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Professional Grid Chart ───────────────────────────────────────────────────

function BarChart({ dams }: { dams: DamLevel[] }) {
  if (!dams.length) return null;

  const sorted = [...dams].sort((a, b) => b.levelPercent - a.levelPercent);
  const ROW_H = 72; 
  const LABEL_W = 260; 
  const CHART_W = 480; 
  const SVG_W = LABEL_W + CHART_W + 120;
  const SVG_H = sorted.length * ROW_H + 80;

  return (
    <div className="relative group w-full">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto"
        style={{ minWidth: '700px' }}
        aria-label="Dam levels professional chart"
      >
        {/* Background Grid */}
        <rect x={LABEL_W} y={0} width={CHART_W} height={SVG_H - 60} fill="#fcfdfe" rx={8} />

        {/* Reference lines & Axis Labels */}
        {[0, 25, 50, 75, 100].map(pct => {
          const x = LABEL_W + (pct / 100) * CHART_W;
          const isMain = pct === 0 || pct === 100;
          return (
            <g key={pct}>
              <line 
                x1={x} y1={0} x2={x} y2={SVG_H - 50} 
                stroke={isMain ? "#e2e8f0" : "#f1f5f9"} 
                strokeWidth={isMain ? 2 : 1} 
              />
              <text 
                x={x} y={SVG_H - 20} 
                textAnchor="middle" 
                fontSize={11} 
                fontWeight="800"
                fill={COLORS.textSecondary}
                className="font-sans uppercase tracking-[0.1em]"
              >
                {pct}%
              </text>
            </g>
          );
        })}

        {/* Critical Threshold Highlighter */}
        <rect 
          x={LABEL_W} y={0} 
          width={(CRITICAL / 100) * CHART_W} height={SVG_H - 50} 
          fill={COLORS.error} opacity={0.03} 
        />
        <line 
          x1={LABEL_W + (CRITICAL / 100) * CHART_W} y1={0} 
          x2={LABEL_W + (CRITICAL / 100) * CHART_W} y2={SVG_H - 50} 
          stroke={COLORS.error} strokeWidth={2} strokeDasharray="8 6" opacity={0.4}
        />
        <text 
          x={LABEL_W + (CRITICAL / 100) * CHART_W} y={20} 
          textAnchor="middle" fontSize={9} fill={COLORS.error} fontWeight="900"
          className="uppercase tracking-[0.2em] opacity-80"
        >
          Critical Zone
        </text>

        {sorted.map((dam, i) => {
          const y = i * ROW_H + 50;
          const barW = (Math.min(100, Math.max(0, dam.levelPercent)) / 100) * CHART_W;
          const color = getBarColor(dam.levelPercent);

          return (
            <motion.g 
              key={dam.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              {/* Dam Info Panel */}
              <text 
                x={LABEL_W - 24} y={y + 14} 
                textAnchor="end" 
                fontSize={14} 
                fill={COLORS.textPrimary} 
                fontWeight="900"
                className="tracking-tight"
              >
                {dam.damName.replace(' Dam', '')}
              </text>
              <text 
                x={LABEL_W - 24} y={y + 30} 
                textAnchor="end" 
                fontSize={9} 
                fill={COLORS.textSecondary} 
                fontWeight="700"
                className="uppercase tracking-widest opacity-60"
              >
                {dam.province}
              </text>

              {/* Progress Track */}
              <rect 
                x={LABEL_W} y={y + 8} 
                width={CHART_W} height={12} 
                rx={6} fill="#f1f5f9" 
              />

              {/* Data Bar */}
              <motion.rect 
                initial={{ width: 0 }}
                animate={{ width: barW }}
                transition={{ duration: 1.4, delay: i * 0.03 + 0.2, ease: "circOut" }}
                x={LABEL_W} y={y + 8} 
                height={12} rx={6} 
                fill={color} 
              />
              
              {/* Value Indicator */}
              <text 
                x={LABEL_W + barW + 15} y={y + 19} 
                fontSize={16} fill={COLORS.textPrimary} fontWeight="900"
                className="font-sans tabular-nums tracking-tighter"
              >
                {dam.levelPercent.toFixed(1)}<tspan fontSize={10} fill={COLORS.textSecondary} dx={2}>%</tspan>
              </text>

              {/* Trend Arrow */}
              <text 
                x={LABEL_W + CHART_W + 70} y={y + 19} 
                fontSize={14} 
                fill={dam.trend === 'rising' ? COLORS.success : dam.trend === 'falling' ? COLORS.error : COLORS.textSecondary}
                fontWeight="900"
                textAnchor="start"
              >
                {dam.trend === 'rising' ? '▲' : dam.trend === 'falling' ? '▼' : '—'}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

export function DamTrendsChart({ dams }: Props) {
  const [view, setView] = useState<'chart' | 'cards'>('cards');

  if (!dams.length) return null;

  const healthyCount = dams.filter(d => d.levelPercent >= 60).length;
  const criticalDams = dams.filter(d => d.levelPercent < CRITICAL);
  const warningDams = dams.filter(d => d.levelPercent >= CRITICAL && d.levelPercent < WARNING);

  return (
    <div className="space-y-8">
      {/* ── Dashboard Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-slate-900/10">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              National Dam Monitoring
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Real-time Capacity Analysis Network
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          {(['cards', 'chart'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all ${
                view === v
                  ? 'bg-white text-slate-900 ring-1 ring-black/5'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {v} view
            </button>
          ))}
        </div>
      </div>

      {/* ── Key Performance Indicators ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Healthy Reservoirs', value: healthyCount, color: COLORS.success, icon: <Droplets /> },
          { label: 'Warning Levels', value: warningDams.length, color: COLORS.warning, icon: <AlertTriangle /> },
          { label: 'Critical Capacity', value: criticalDams.length, color: COLORS.error, icon: <AlertTriangle /> },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-2xl font-black text-slate-900 leading-none mt-1">{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Visualization Canvas ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.25 }}
          className="min-h-[400px]"
        >
          {view === 'chart' ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 overflow-x-auto scrollbar-hide">
              <BarChart dams={dams} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...dams].sort((a, b) => a.levelPercent - b.levelPercent).map(dam => (
                <DamProfessionalCard key={dam.id} dam={dam} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Metadata & Footer ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-6">
          {[
            { label: 'Critical (<20%)', color: COLORS.error },
            { label: 'Warning (20-40%)', color: COLORS.warning },
            { label: 'Moderate (40-60%)', color: COLORS.midNavy },
            { label: 'Optimal (>60%)', color: COLORS.success }
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
          <Info className="w-3 h-3 text-slate-400" />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Data provided by Department of Water & Sanitation
          </span>
        </div>
      </div>
    </div>
  );
}


