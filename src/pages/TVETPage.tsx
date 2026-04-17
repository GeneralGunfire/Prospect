import { motion } from 'motion/react';
import { CheckCircle, TrendingUp, Clock, Award, Users } from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import { TVETSubNav } from '../components/TVETSubNav';

function TVETPage({ user, onNavigate }: AuthedProps) {
  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="tvet" user={user} onNavigate={onNavigate} mode="career" />
      <TVETSubNav currentPage="overview" onNavigate={onNavigate} />

      {/* Hero Section */}
      <div
        className="pt-24 pb-32 px-4"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2b4d7a 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Technical Skills.<br />
              Real Jobs.<br />
              Real Futures.
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-95">
              TVET is not a backup option—it's a direct pathway to high-demand careers with excellent earning potential. Learn a trade, earn money, change your life.
            </p>
            <button
              onClick={() => onNavigate('tvet-careers')}
              className="inline-block px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all hover:opacity-90"
              style={{ backgroundColor: '#F9A825', color: '#1E3A5F' }}
            >
              Explore TVET Careers
            </button>
          </motion.div>
        </div>
      </div>

      {/* Why TVET Section */}
      <div className="py-20 px-4 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold mb-16 text-center"
          style={{ color: '#1E3A5F' }}
        >
          Why TVET Is a Smart Career Choice
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: Clock,
              title: 'Faster to Qualify',
              description: '2-3 years of study vs 4-6 years for university degrees. Enter the workforce sooner.',
            },
            {
              icon: TrendingUp,
              title: 'Job-Ready Skills',
              description: 'Learn practical, hands-on skills employers actually need. No theory-heavy lectures.',
            },
            {
              icon: Award,
              title: 'Lower Entry Requirements',
              description: 'No need for top matric grades. TVET colleges accept average performers who are motivated.',
            },
            {
              icon: Users,
              title: 'High Demand Careers',
              description: 'Electricians, plumbers, welders, mechanics earn R20k–R60k+ monthly. Always in demand.',
            },
            {
              icon: CheckCircle,
              title: 'Multiple Pathways',
              description: 'Apprenticeships let you earn while learning. Progress to university after if desired.',
            },
            {
              icon: TrendingUp,
              title: 'Growing Industry',
              description: 'Construction boom, renewable energy, infrastructure projects create thousands of jobs annually.',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07, duration: 0.4 }}
              whileHover={{ y: -3 }}
              className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:border-slate-200 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-prospect-green flex items-center justify-center mb-5">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-black text-sm mb-2 text-slate-900" style={{ letterSpacing: '-0.01em' }}>{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* TVET vs University Comparison */}
      <div className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold mb-12 text-center"
            style={{ color: '#1E3A5F' }}
          >
            TVET vs University: Choose What's Right for You
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="overflow-x-auto"
          >
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">
              <thead style={{ backgroundColor: '#1E3A5F' }} className="text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wide">Aspect</th>
                  <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wide">TVET</th>
                  <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wide">University</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Duration', '2-3 years', '4-6 years'],
                  ['Entry Requirements', 'Grade 12 pass (average grades ok)', 'Grade 12 pass + good APS (24-28+)'],
                  ['Cost', 'R0-10k/year (NSFAS available)', 'R30-80k/year'],
                  ['Focus', 'Practical, hands-on, job-ready skills', 'Theory, research, academic knowledge'],
                  ['Work During Study', 'Yes - apprenticeships pay you to learn', 'Rarely - mostly full-time study'],
                  ['Job Market', 'High demand for trades (electrician, plumber, etc.)', 'Competitive, many graduates'],
                  ['Starting Salary', 'R15-20k/month', 'R18-35k/month'],
                  ['Career Path', 'Master trade, own business, earn R50k+/month', 'Corporate roles, management, specializations'],
                  ['Further Study', 'Can upgrade to university diploma later', 'Advanced degrees and specializations'],
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-6 py-4 font-bold text-gray-900">{row[0]}</td>
                    <td className="px-6 py-4 text-gray-700">{row[1]}</td>
                    <td className="px-6 py-4 text-gray-700">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        className="py-20 px-4"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2b4d7a 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your TVET Journey?</h2>
          <p className="text-lg mb-8 opacity-95">
            Browse 50+ trade careers, find TVET colleges near you, and discover funding options available.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('tvet-careers')}
              className="px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all"
              style={{ backgroundColor: '#F9A825', color: '#1E3A5F' }}
            >
              Browse Careers
            </button>
            <button
              onClick={() => onNavigate('tvet-colleges')}
              className="px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all border-2 border-white text-white hover:bg-white hover:text-prospect-green"
            >
              Find Colleges
            </button>
            <button
              onClick={() => onNavigate('tvet-funding')}
              className="px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all border-2 border-white text-white hover:bg-white hover:text-prospect-green"
            >
              Funding Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(TVETPage);
