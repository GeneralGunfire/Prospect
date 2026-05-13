import { motion } from 'motion/react';
import { withAuth, type AuthedProps } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';
import { TVETSubNav } from '../../components/tvet/TVETSubNav';

function TVETPage({ user, onNavigate }: AuthedProps) {
  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="tvet" user={user} onNavigate={onNavigate} mode="career" />
      <TVETSubNav currentPage="overview" onNavigate={onNavigate} />

      {/* Hero Section */}
      <div className="pt-24 pb-20 px-4 bg-[#0f172a]">
        <div className="max-w-4xl mx-auto text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-4">Vocational Pathways</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight" style={{ letterSpacing: '-0.025em' }}>
              Technical Skills.<br />Real Jobs.
            </h1>
            <p className="text-sm md:text-base text-white/60 max-w-xl leading-relaxed mb-8">
              TVET is a direct pathway to high-demand careers with excellent earning potential.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => onNavigate('tvet-colleges')}
                className="px-5 py-2.5 bg-white text-slate-900 rounded-lg font-bold text-xs uppercase tracking-widest transition-opacity hover:opacity-90"
              >
                Explore Colleges
              </button>
              <button
                onClick={() => onNavigate('tvet-funding')}
                className="px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                Funding
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Why TVET Section */}
      <div className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Why TVET</p>

        <div className="divide-y divide-slate-100">
          {[
            { title: 'Faster to Qualify', description: '2–3 years vs 4–6 for a degree. Enter the workforce sooner.' },
            { title: 'Job-Ready Skills', description: 'Practical, hands-on skills employers actually need.' },
            { title: 'Lower Entry Requirements', description: 'No top matric grades needed. Motivated students welcome.' },
            { title: 'High Demand Careers', description: 'Electricians, plumbers, welders earn R20k–R60k+/mo.' },
            { title: 'Earn While You Learn', description: 'Apprenticeships pay you while you study.' },
            { title: 'Growing Industry', description: 'Infrastructure, energy, and construction create thousands of jobs yearly.' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex gap-6 py-5"
            >
              <span className="text-[10px] font-black text-slate-300 mt-0.5 shrink-0 w-4">{String(idx + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1" style={{ letterSpacing: '-0.01em' }}>{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* TVET vs University Comparison */}
      <div className="py-16 px-4 sm:px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">TVET vs University</p>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 pr-6">Aspect</th>
                  <th className="pb-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 pr-6">TVET</th>
                  <th className="pb-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">University</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['Duration', '2–3 years', '4–6 years'],
                  ['Entry', 'Average grades ok', 'APS 24–28+ required'],
                  ['Cost', 'R0–10k/year (NSFAS)', 'R30–80k/year'],
                  ['Focus', 'Hands-on, practical', 'Theory, research'],
                  ['Starting Salary', 'R15–20k/mo', 'R18–35k/mo'],
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 text-xs font-bold text-slate-600 pr-6">{row[0]}</td>
                    <td className="py-3 text-xs text-slate-700 pr-6">{row[1]}</td>
                    <td className="py-3 text-xs text-slate-500">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(TVETPage);
