import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import { TVETSubNav } from '../components/TVETSubNav';

function TVETRequirementsPage({ user, onNavigate }: AuthedProps) {
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);

  const tradeRequirements: Record<string, { required: string[]; recommended: string[]; notes: string }> = {
    'Electrical & Energy': {
      required: ['Mathematics', 'Physical Science'],
      recommended: ['Technical Studies', 'Engineering Graphics'],
      notes: 'Strong maths is important. Pass at 40% or better in both required subjects.',
    },
    'Plumbing': {
      required: ['Mathematics'],
      recommended: ['Physical Science', 'Life Sciences'],
      notes: 'Practical math skills matter more than theory. Average grades acceptable.',
    },
    'Construction': {
      required: ['Mathematics'],
      recommended: ['Physical Science', 'Engineering Graphics'],
      notes: 'Basic maths for measurements. No top grades needed.',
    },
    'Automotive': {
      required: ['Mathematics', 'Physical Science'],
      recommended: ['Technical Studies', 'English'],
      notes: 'Mechanical understanding important. Hands-on skills learned during training.',
    },
    'Welding & Metal': {
      required: ['Mathematics', 'Physical Science'],
      recommended: ['Engineering Graphics', 'Technical Studies'],
      notes: 'Math for measurements. Physical strength also important.',
    },
    'Engineering': {
      required: ['Mathematics', 'Physical Science'],
      recommended: ['Engineering Graphics'],
      notes: 'Strong technical foundation needed. Good maths grades help.',
    },
    'Hospitality': {
      required: ['English'],
      recommended: ['Mathematics', 'Life Sciences'],
      notes: 'Customer service and communication skills important. Grades less critical.',
    },
    'Beauty & Wellness': {
      required: ['English'],
      recommended: ['Life Sciences', 'Mathematics'],
      notes: 'Communication and creativity key. No specific grade requirements.',
    },
    'IT & Digital': {
      required: ['Mathematics', 'English'],
      recommended: ['Computer Studies', 'Physical Science'],
      notes: 'Logic and problem-solving important. Average maths grades sufficient.',
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentPage="tvet" user={user} onNavigate={onNavigate} mode="career" />
      <TVETSubNav currentPage="requirements" onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight text-slate-900">
            Matric <span className="text-slate-500">Requirements</span>
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            Discover what matric subjects you need for your chosen TVET career. Good news: TVET is flexible. No top grades required.
          </p>
        </div>

        {/* Key Message */}
        <div className="bg-green-50 border-l-4 border-green-600 rounded-xl p-8 mb-12">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-slate-900" />
            TVET Is More Flexible Than University
          </h3>
          <div className="text-gray-700 space-y-2">
            <p>
              <strong>You don't need top matric grades for TVET.</strong> A pass in Grade 12 is usually sufficient.
            </p>
            <p>
              <strong>Specific subjects matter more than grades.</strong> Most TVET careers require just Mathematics + one other subject.
            </p>
            <p>
              <strong>Struggling now? Don't worry.</strong> If you're worried about your matric grades, TVET is still the right path.
            </p>
          </div>
        </div>

        {/* Subject Requirements by Trade Type */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 text-slate-900"
          >
            Subject Requirements by Trade Type
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(tradeRequirements).map(([trade, reqs], idx) => (
              <motion.div
                key={trade}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedTrade(selectedTrade === trade ? null : trade)}
                className={`border-2 rounded-xl p-6 cursor-pointer hover:shadow-md transition-all ${
                  selectedTrade === trade
                    ? 'bg-slate-900/5 border-slate-800'
                    : 'bg-white border-slate-200 hover:border-slate-400'
                }`}
              >
                <h3 className="font-bold text-lg mb-4 text-slate-900">
                  {trade}
                </h3>

                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2 text-slate-900">
                    Required Subjects
                  </p>
                  <ul className="space-y-1">
                    {reqs.required.map((subj) => (
                      <li key={subj} className="flex gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
                        <span className="text-slate-600">{subj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4 pb-4 border-t border-slate-200">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2 text-slate-900">
                    Recommended Subjects
                  </p>
                  <ul className="space-y-1">
                    {reqs.recommended.map((subj) => (
                      <li key={subj} className="flex gap-2 text-sm">
                        <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500">○</span>
                        <span className="text-slate-600">{subj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-[11px] italic text-slate-500">
                  {reqs.notes}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Can You Do TVET With Low Grades */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 text-slate-900"
          >
            Can You Do TVET With Low Matric Grades?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="bg-green-50 rounded-xl p-8 border-l-4 border-green-600">
              <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-slate-900">
                <CheckCircle className="w-6 h-6" />
                YES, Absolutely
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-slate-900">•</span>
                  <span>
                    <strong>Most colleges accept matric pass</strong> with no minimum grade requirement
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-900">•</span>
                  <span>
                    <strong>Practical skills matter more than grades</strong> - you'll learn in class
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-900">•</span>
                  <span>
                    <strong>Success stories are common</strong> - many successful tradespeople had average matric results
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-900">•</span>
                  <span>
                    <strong>Entry is about potential, not past performance</strong>
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} className="bg-blue-50 rounded-xl p-8 border-l-4 border-blue-600">
              <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-slate-900">
                <AlertCircle className="w-6 h-6 text-blue-500" />
                But Do This First
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>
                    <strong>Check specific college requirements</strong> - most have flexible entry
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>
                    <strong>Get the required subjects if possible</strong> - Math + Science help most trades
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>
                    <strong>Consider makeup classes</strong> - some colleges offer Math/Science support
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>
                    <strong>Show motivation & commitment</strong> - colleges value your attitude over grades
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Subject Selector */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 text-slate-900"
          >
            What Subjects Should I Choose Now?
          </motion.h2>

          <div className="bg-white border-2 rounded-xl p-8" style={{ borderColor: '#1e293b' }}>
            <h3 className="font-bold text-xl mb-6">To Prepare for TVET:</h3>

            <div className="space-y-6">
              {[
                {
                  subject: 'Mathematics',
                  importance: 'Critical for most trades',
                  why: 'Used in measurements, calculations, safety standards. Keep it even if struggling.',
                },
                {
                  subject: 'Physical Science / Life Sciences',
                  importance: 'Important (depends on trade)',
                  why: 'Electrical trades need Physics. Plumbing needs both. Choose based on interest.',
                },
                {
                  subject: 'English / Home Language',
                  importance: 'Always valuable',
                  why: 'Communication, reading instructions, job applications. Good to have.',
                },
                {
                  subject: 'Technical Studies / Engineering Graphics',
                  importance: 'Bonus for trades',
                  why: 'Perfect foundation for construction, manufacturing, automotive trades.',
                },
                {
                  subject: 'Computer Studies',
                  importance: 'Useful for IT & modern trades',
                  why: 'All trades increasingly use technology. Good general skill.',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-6 pb-6 border-b border-slate-200 last:border-0"
                >
                  <div className="flex-shrink-0">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-slate-900"
                    >
                      {item.importance}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.subject}</h4>
                    <p className="text-sm text-gray-600">{item.why}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* If You're Struggling Now */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 text-slate-900"
          >
            If You're Struggling With Your Subjects Now
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Get Help Now',
                actions: [
                  'Ask your teacher for tutoring',
                  'Join study groups with classmates',
                  'Use free online resources (Khan Academy, YouTube)',
                  'Consider after-school tutorials',
                  'Talk to your parents/guardian about extra lessons',
                ],
              },
              {
                title: 'Know Your Options',
                actions: [
                  'TVET colleges offer bridging programs for weak subjects',
                  'Some colleges have built-in Math/Science support',
                  'You don\'t need perfection - just pass',
                  'Many successful tradespeople had same struggles',
                  'TVET teaches practical skills, not just theory',
                ],
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 rounded-xl p-8"
              >
                <h3 className="font-bold text-lg mb-6 text-slate-900">
                  {item.title}
                </h3>
                <ul className="space-y-3">
                  {item.actions.map((action, aidx) => (
                    <li key={aidx} className="flex gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-900" />
                      <span className="text-sm text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-slate-900 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for TVET?</h2>
          <p className="mb-8 text-lg max-w-2xl mx-auto">
            Don't let grades discourage you. TVET is designed for students like you. Explore careers and find your path.
          </p>
          <button
            onClick={() => onNavigate('tvet-careers')}
            className="px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all hover:opacity-90 bg-amber-400 text-slate-900"
          >
            Explore TVET Careers Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(TVETRequirementsPage);
