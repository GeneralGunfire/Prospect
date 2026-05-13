import { useState } from 'react';
import { motion } from 'motion/react';
import { withAuth, type AuthedProps } from '../../lib/withAuth';
import AppHeader from '../../components/shell/AppHeader';
import { TVETSubNav } from '../../components/tvet/TVETSubNav';

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

      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 pt-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">TVET</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4" style={{ letterSpacing: '-0.025em' }}>Requirements</h1>
          <p className="text-sm text-slate-500">TVET is flexible. No top grades required — a matric pass with the right subjects is enough for most programs.</p>
        </div>

        {/* Trade requirements */}
        <section className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">By Trade Type</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(tradeRequirements).map(([trade, reqs], idx) => (
              <motion.div
                key={trade}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => setSelectedTrade(selectedTrade === trade ? null : trade)}
                className={`border rounded-xl p-5 cursor-pointer transition-colors ${
                  selectedTrade === trade
                    ? 'border-slate-900 bg-white'
                    : 'border-slate-200 bg-white hover:border-slate-400'
                }`}
              >
                <h3 className="text-sm font-bold text-slate-900 mb-3">{trade}</h3>

                <div className="mb-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1.5">Required</p>
                  <div className="flex flex-wrap gap-1.5">
                    {reqs.required.map((subj) => (
                      <span key={subj} className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-slate-900 text-slate-900">{subj}</span>
                    ))}
                  </div>
                </div>

                {selectedTrade === trade && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1.5">Recommended</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {reqs.recommended.map((subj) => (
                        <span key={subj} className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-slate-200 text-slate-500">{subj}</span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 italic">{reqs.notes}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Subjects guide */}
        <section className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Subject Guide</p>
          <div className="divide-y divide-slate-100">
            {[
              { subject: 'Mathematics', importance: 'Critical', why: 'Used in measurements, calculations, safety standards across almost every trade.' },
              { subject: 'Physical Science / Life Sciences', importance: 'Important', why: 'Electrical trades need Physics. Plumbing benefits from both.' },
              { subject: 'English / Home Language', importance: 'Always valuable', why: 'Communication, reading instructions, job applications.' },
              { subject: 'Technical Studies / Engineering Graphics', importance: 'Trade bonus', why: 'Perfect foundation for construction, manufacturing, automotive trades.' },
              { subject: 'Computer Studies', importance: 'Modern trades', why: 'All trades increasingly use technology. Good general foundation.' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 py-4">
                <span className="text-[10px] font-black text-slate-300 mt-0.5 shrink-0 w-4">{String(idx + 1).padStart(2, '0')}</span>
                <div>
                  <div className="flex items-center gap-3 mb-0.5">
                    <h4 className="text-sm font-bold text-slate-900">{item.subject}</h4>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.importance}</span>
                  </div>
                  <p className="text-sm text-slate-500">{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Low grades CTA */}
        <div className="border border-slate-200 rounded-xl p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">If Your Grades Are Low</p>
          <p className="text-sm text-slate-600 mb-4">TVET colleges accept a matric pass with no minimum grade for most programs. Practical skills are taught during training. Don't let current grades stop you.</p>
          <button
            onClick={() => onNavigate('tvet-careers')}
            className="text-xs font-black uppercase tracking-widest text-slate-900 hover:opacity-70 transition-opacity"
          >
            Explore TVET Careers →
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(TVETRequirementsPage);
