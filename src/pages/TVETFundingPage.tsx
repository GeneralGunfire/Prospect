import { motion } from 'motion/react';
import { CheckCircle, AlertCircle, DollarSign, Users } from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import { TVETSubNav } from '../components/TVETSubNav';

function TVETFundingPage({ user, onNavigate }: AuthedProps) {
  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="tvet" user={user} onNavigate={onNavigate} mode="career" />
      <TVETSubNav currentPage="funding" onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight text-slate-900">
            Funding & <span className="text-slate-500">Support Guide</span>
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            TVET is affordable for disadvantaged students. Discover financial aid, bursaries, and apprenticeships that support your training.
          </p>
        </div>

        {/* Why TVET is Affordable */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 text-slate-900"
          >
            Why TVET is Affordable
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: 'Shorter Duration',
                description: '2-3 years vs 4-6 years for university. Less time = less total cost.',
              },
              {
                icon: DollarSign,
                title: 'Lower Fees',
                description: 'Annual fees are R0-10k (often covered by NSFAS) vs R30-80k at university.',
              },
              {
                icon: Users,
                title: 'Earn While Learning',
                description: 'Apprenticeships pay you a salary (R8-15k monthly) while you qualify.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-shadow border-l-4 border-amber-400"
              >
                <item.icon className="w-10 h-10 mb-4 text-slate-900" />
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Funding Options */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 text-slate-900"
          >
            Funding Options Available
          </motion.h2>

          <div className="space-y-6">
            {[
              {
                title: 'NSFAS (National Student Financial Aid Scheme)',
                description: 'Government bursary covering tuition for TVET students from disadvantaged backgrounds.',
                details: [
                  '• Covers tuition fees (R0-10k annually)',
                  '• Living allowance for full-time students',
                  '• Book and equipment allowance',
                  '• No interest, no repayment if you graduate',
                  '• Eligibility: Family income < R350k/year',
                ],
                borderCls: 'border-slate-800',
              },
              {
                title: 'TVET-Specific Bursaries',
                description: 'Industry-sponsored programs supporting skilled trade development.',
                details: [
                  '• Eskom bursaries for electrical technicians',
                  '• Construction SETA bursaries (R10-25k annually)',
                  '• Manufacturing SETA support programs',
                  '• Energy industry bursaries for solar/HVAC',
                  '• Engineering SETA apprenticeship grants',
                ],
                borderCls: 'border-amber-400',
              },
              {
                title: 'Apprenticeships (Earn While Learning)',
                description: 'Get hired and paid while completing your qualification.',
                details: [
                  '• Starting salary: R8-15k monthly',
                  '• Employer covers training costs',
                  '• Gain work experience simultaneously',
                  '• High employment rate upon completion',
                  '• Opportunities with Eskom, construction firms, auto dealers',
                ],
                borderCls: 'border-blue-500',
              },
              {
                title: 'Company-Sponsored Training',
                description: 'Employers hire trainees and sponsor their TVET qualification.',
                details: [
                  '• Apply directly to companies (Absa, Nedbank, etc.)',
                  '• Monthly stipend + training costs paid',
                  '• Guaranteed employment after graduation',
                  '• Skill needed in company sector',
                  '• Often requires 2-3 year commitment',
                ],
                borderCls: 'border-blue-500',
              },
            ].map((option, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white border-2 rounded-xl p-8 hover:shadow-md transition-shadow ${option.borderCls}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1 text-slate-700" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">{option.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                    <ul className="space-y-2 text-sm">
                      {option.details.map((detail, didx) => (
                        <li key={didx} className="text-slate-600">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 text-slate-900"
          >
            Step-by-Step: How to Get Into TVET
          </motion.h2>

          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Get Your Grade 12 Certificate',
                details: 'Complete matric. No minimum grade required for TVET (unlike university).',
              },
              {
                step: 2,
                title: 'Choose Your TVET Career',
                details: 'Browse our list of 50+ TVET careers. Match it to your interests and local job demand.',
              },
              {
                step: 3,
                title: 'Find a TVET College',
                details: 'Use our college finder to locate colleges near you offering your chosen career.',
              },
              {
                step: 4,
                title: 'Apply for NSFAS',
                details: 'Visit nsfas.org.za. Apply before college application deadlines (usually May-June).',
              },
              {
                step: 5,
                title: 'Apply to College',
                details: 'Submit applications directly to TVET colleges (deadlines vary by college).',
              },
              {
                step: 6,
                title: 'Explore Apprenticeships',
                details: 'Consider applying for apprenticeships with companies while studying.',
              },
              {
                step: 7,
                title: 'Attend & Graduate',
                details: 'Complete 2-3 years of study. Gain practical skills and hands-on experience.',
              },
              {
                step: 8,
                title: 'Start Your Career',
                details: 'Enter workforce earning R15-20k+ monthly. Opportunity to own a business later.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-6 pb-6 border-b border-slate-200 last:border-0"
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-slate-900"
                >
                  {item.step}
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Costs Breakdown */}
        <section className="mb-16 bg-slate-50 rounded-xl p-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 text-slate-900"
          >
            Costs Breakdown: TVET vs University
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'TVET 2-Year Program',
                total: 'R0-20,000',
                borderCls: 'border-blue-500',
                totalCls: 'text-blue-500',
                items: ['Tuition (covered by NSFAS): R0k', 'Living allowance (monthly): R3-4k', 'Books & supplies: R2-3k/year', 'Transport: R500-1k/month'],
              },
              {
                title: 'University 4-Year Degree',
                total: 'R120-320,000',
                borderCls: 'border-red-400',
                totalCls: 'text-red-500',
                items: ['Tuition: R30-80k/year', 'Residence (often required): R40-60k/year', 'Books & supplies: R5-8k/year', 'Transport: R500-2k/month'],
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-xl p-8 border-l-4 ${item.borderCls}`}
              >
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className={`text-4xl font-bold mb-8 ${item.totalCls}`}>
                  {item.total}
                </p>
                <ul className="space-y-2 text-sm">
                  {item.items.map((cost, cidx) => (
                    <li key={cidx} className="flex gap-2">
                      <span style={{ color: item.color }}>•</span>
                      <span className="text-slate-600">{cost}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Disadvantaged Student Resources */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 text-slate-900"
          >
            Special Support for Disadvantaged Students
          </motion.h2>

          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-8 mb-6">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              Important: TVET is Designed for You
            </h3>
            <p className="text-gray-700">
              TVET systems specifically support disadvantaged students. No minimum grades required. NSFAS covers fees. Apprenticeships let you earn while learning. This is your pathway.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Financial Aid for TVET',
                items: ['NSFAS grants (no repayment needed)', 'Monthly living allowance (R3-4k)', 'Book & equipment allowance', 'Transport allowance', 'Hardship bursaries available'],
              },
              {
                title: 'Hardship Support',
                items: ['Free meals at some colleges', 'Accommodation assistance programs', 'Emergency bursaries', 'Childcare support for parents', 'Medical aid assistance'],
              },
              {
                title: 'Mentorship & Guidance',
                items: ['Career guidance at colleges', 'Peer mentorship programs', 'Job placement assistance', 'Alumni networks', 'Apprenticeship matching'],
              },
              {
                title: 'Additional Resources',
                items: ['Free psychosocial support', 'Study skills workshops', 'Job search coaching', 'Business startup grants', 'Loan schemes for self-employed'],
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 rounded-xl p-6"
              >
                <h4 className="font-bold text-lg mb-4 text-slate-900">
                  {item.title}
                </h4>
                <ul className="space-y-2 text-sm">
                  {item.items.map((resource, ridx) => (
                    <li key={ridx} className="flex gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-900" />
                      <span className="text-slate-600">{resource}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 text-slate-900"
          >
            How Others Funded Their TVET
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Lindiwe (Electrician)',
                story: 'NSFAS covered my R8k annual fees. I got a monthly living allowance of R3.5k which paid for transport and books. Graduated with zero debt and started earning R24k/month.',
              },
              {
                name: 'Thabo (Plumber)',
                story: 'Got apprenticed halfway through TVET. Employer paid remaining training costs while I earned R12k/month. After graduation, salary increased to R30k/month.',
              },
              {
                name: 'Naledi (Beauty Therapist)',
                story: 'NSFAS + construction SETA bursary covered all costs. Completed TVET without debt. Within 2 years, owned my own salon. Now earning R50k+ monthly.',
              },
            ].map((story, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border-2 rounded-xl p-6 border-amber-400"
              >
                <h4 className="font-bold text-lg mb-2 text-slate-900">
                  {story.name}
                </h4>
                <p className="text-sm text-gray-700 italic">"{story.story}"</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 bg-slate-900 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
          <p className="mb-8 text-lg">
            Browse TVET careers, find colleges, and start your application today.
          </p>
          <button
            onClick={() => onNavigate('tvet-careers')}
            className="px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all hover:opacity-90 bg-amber-400 text-slate-900"
          >
            Explore TVET Careers
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper icons not imported
function Clock(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default withAuth(TVETFundingPage);
