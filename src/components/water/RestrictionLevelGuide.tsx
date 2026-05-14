import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import type { WaterRestriction } from '../../services/waterService';

interface Level {
  level: number;
  name: string;
  reduction: string;
  color: string;
  bg: string;
  border: string;
  bar: string;
  allowedUses: string[];
  bannedUses: string[];
}

const LEVELS: Level[] = [
  {
    level: 0, name: 'No Restrictions', reduction: 'Normal use',
    color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', bar: 'bg-green-500',
    allowedUses: ['Unlimited domestic use', 'Garden watering any time', 'Pool filling', 'Car washing'],
    bannedUses: [],
  },
  {
    level: 1, name: 'Mild Restrictions', reduction: '10% reduction',
    color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500',
    allowedUses: ['Domestic use', 'Essential industry', 'Garden watering (off-peak hours)'],
    bannedUses: ['Watering during 10:00–16:00', 'Hosepipe car washing'],
  },
  {
    level: 2, name: 'Moderate Restrictions', reduction: '15–20% reduction',
    color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500',
    allowedUses: ['Essential domestic use', 'Critical industries', 'Garden watering twice/week (before 09:00 or after 18:00)'],
    bannedUses: ['Pool filling or topping up', 'Hosepipe car washing', 'Street cleaning', 'Irrigation systems'],
  },
  {
    level: 3, name: 'Severe Restrictions', reduction: '30–45% reduction',
    color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', bar: 'bg-orange-500',
    allowedUses: ['Basic domestic use', 'Hospitals and clinics', 'Schools (essential only)'],
    bannedUses: ['All outdoor watering', 'Swimming pools', 'Washing vehicles', 'Non-essential industrial use', 'Fountains and water features'],
  },
  {
    level: 4, name: 'Critical Restrictions', reduction: '50%+ reduction',
    color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-500',
    allowedUses: ['Basic domestic use only', 'Hospitals and emergency services'],
    bannedUses: ['Nearly all non-essential use', 'All outdoor use', 'All industrial use except critical', 'Any use not related to survival'],
  },
  {
    level: 5, name: 'Emergency / Day Zero', reduction: 'Strict rationing',
    color: 'text-red-900', bg: 'bg-red-100', border: 'border-red-300', bar: 'bg-red-700',
    allowedUses: ['Emergency rations only (25–50L/person/day)', 'Hospitals', 'Designated collection points'],
    bannedUses: ['All normal use', 'Gardens', 'Vehicles', 'Pools', 'Industry', 'Schools (closed)'],
  },
];

interface Props {
  restrictions: WaterRestriction[];
  province: string;
}

export function RestrictionLevelGuide({ restrictions, province }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const currentLevel = restrictions[0]?.restriction_level ?? null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Restriction Levels</h2>
        {currentLevel !== null && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVELS[currentLevel]?.bg ?? 'bg-slate-100'} ${LEVELS[currentLevel]?.color ?? 'text-slate-600'}`}>
            {province}: Level {currentLevel}
          </span>
        )}
      </div>

      {restrictions.length > 0 && (
        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3">
          <p className="text-xs font-semibold text-amber-800">
            {restrictions[0].municipality ?? province} — {restrictions[0].description}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {LEVELS.map(lvl => {
          const isActive = lvl.level === currentLevel;
          const isOpen = expanded === lvl.level;

          return (
            <div
              key={lvl.level}
              className={`rounded-xl border overflow-hidden transition-all ${
                isActive ? `${lvl.border} ring-2 ring-offset-1 ${lvl.border.replace('border-', 'ring-')}` : 'border-slate-200'
              }`}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : lvl.level)}
                className={`w-full text-left p-3.5 flex items-center gap-3 ${isActive ? lvl.bg : 'bg-white hover:bg-slate-50'}`}
              >
                {/* Level badge */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${lvl.bg} ${lvl.color} border ${lvl.border}`}>
                  {lvl.level}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${isActive ? lvl.color : 'text-slate-800'}`}>
                      {lvl.name}
                    </span>
                    {isActive && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${lvl.bg} ${lvl.color} border ${lvl.border}`}>
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{lvl.reduction}</p>
                </div>

                {/* Progress bar */}
                <div className="w-16 hidden sm:block">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${lvl.bar} rounded-full`}
                      style={{ width: `${(lvl.level / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-white border-t border-slate-100 grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Allowed
                        </p>
                        <ul className="space-y-1">
                          {lvl.allowedUses.length > 0
                            ? lvl.allowedUses.map(u => (
                              <li key={u} className="text-xs text-slate-600 flex items-start gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                {u}
                              </li>
                            ))
                            : <li className="text-xs text-slate-400 italic">None</li>
                          }
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Banned
                        </p>
                        <ul className="space-y-1">
                          {lvl.bannedUses.length > 0
                            ? lvl.bannedUses.map(u => (
                              <li key={u} className="text-xs text-slate-600 flex items-start gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                {u}
                              </li>
                            ))
                            : <li className="text-xs text-slate-400 italic">No bans</li>
                          }
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
