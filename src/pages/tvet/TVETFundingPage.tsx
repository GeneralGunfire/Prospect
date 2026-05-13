import { motion } from 'motion/react';
import { withAuth, type AuthedProps } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';
import { TVETSubNav } from '../../components/tvet/TVETSubNav';

function TVETFundingPage({ user, onNavigate }: AuthedProps) {
  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="tvet" user={user} onNavigate={onNavigate} mode="career" />
      <TVETSubNav currentPage="funding" onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 pt-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">TVET</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900" style={{ letterSpacing: '-0.025em' }}>Funding</h1>
        </div>

        {/* Funding Options */}
        <section className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Options Available</p>
          <div className="divide-y divide-slate-100">
            {[
              {
                title: 'NSFAS',
                description: 'Government bursary covering tuition for students with household income below R350k/year. No repayment if you graduate.',
                facts: ['Tuition covered (R0–10k/year)', 'Monthly living allowance R3–4k', 'Book & equipment allowance'],
              },
              {
                title: 'TVET-Specific Bursaries',
                description: 'Industry-sponsored programs from Eskom, Construction SETA, Manufacturing SETA, and Energy sector companies.',
                facts: ['R10–25k annually', 'No minimum grades required', 'Apply directly to SETA bodies'],
              },
              {
                title: 'Apprenticeships',
                description: 'Employer hires and pays you while you complete your qualification. Most common in electrical, plumbing, and automotive trades.',
                facts: ['Starting salary R8–15k/month', 'Training costs covered', 'High employment on completion'],
              },
              {
                title: 'Company-Sponsored Training',
                description: 'Major employers like Absa, Nedbank, and Eskom hire trainees and fund their TVET qualification with guaranteed employment after.',
                facts: ['Monthly stipend + training paid', 'Guaranteed placement after graduation', '2–3 year commitment'],
              },
            ].map((option, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="py-6"
              >
                <div className="flex gap-6">
                  <span className="text-[10px] font-black text-slate-300 mt-0.5 shrink-0 w-4">{String(idx + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1" style={{ letterSpacing: '-0.01em' }}>{option.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{option.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {option.facts.map((f, i) => (
                        <span key={i} className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 border border-slate-200 rounded-md px-2 py-1">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Step-by-Step */}
        <section className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">How to Apply</p>
          <div className="divide-y divide-slate-100">
            {[
              ['Complete matric', 'No minimum grade required for TVET (unlike university).'],
              ['Choose your TVET career', 'Browse careers in our TVET section. Match to local job demand.'],
              ['Find a TVET college', 'Use the college finder to locate colleges near you.'],
              ['Apply for NSFAS', 'Visit nsfas.org.za before May–June deadlines.'],
              ['Apply to college', 'Submit directly to TVET colleges. Deadlines vary.'],
              ['Explore apprenticeships', 'Apply to companies offering apprenticeship programs while studying.'],
              ['Graduate and start earning', 'Enter the workforce at R15–20k+/month. Build toward ownership.'],
            ].map(([title, desc], idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className="flex gap-6 py-4"
              >
                <span className="text-[10px] font-black text-slate-300 mt-0.5 shrink-0 w-4">{String(idx + 1).padStart(2, '0')}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-0.5">{title}</h4>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Cost comparison */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Cost Comparison</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 pr-6">Item</th>
                  <th className="pb-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 pr-6">TVET (2 years)</th>
                  <th className="pb-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">University (4 years)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['Tuition', 'R0–10k/year (NSFAS covered)', 'R30–80k/year'],
                  ['Living allowance', 'R3–4k/month via NSFAS', 'Self-funded or loan'],
                  ['Total cost', 'R0–20k', 'R120–320k'],
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 text-xs font-bold text-slate-600 pr-6">{row[0]}</td>
                    <td className="py-3 text-xs text-slate-700 pr-6">{row[1]}</td>
                    <td className="py-3 text-xs text-slate-500">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default withAuth(TVETFundingPage);
