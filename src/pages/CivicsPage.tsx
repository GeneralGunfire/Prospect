import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  IdCard, FileText, Vote, Shield, HardHat,
  Phone, ChevronDown, ChevronUp, AlertCircle,
  CheckCircle2, GraduationCap, Building2, CreditCard
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';

// ── Types ──────────────────────────────────────────────────────────────────────

interface CivicSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  steps?: string[];
  bullets?: string[];
  note?: string;
}

// ── Content ────────────────────────────────────────────────────────────────────

const SECTIONS: CivicSection[] = [
  {
    id: 'id-card',
    title: 'Applying for Your South African ID',
    icon: <IdCard className="w-4 h-4" />,
    color: 'blue',
    steps: [
      'You must be 16 years or older to apply for your first Smart ID card.',
      'Visit your nearest Home Affairs office. You can book an appointment at eHomeAffairs (online bookings available at selected offices).',
      'Bring: Your birth certificate (original), a completed DHA-9 form (available at Home Affairs), and your parent/guardian if you are under 18.',
      'You will have your photo and fingerprints taken at the office. No photos are needed from you.',
      'The Smart ID card takes approximately 2–8 weeks to process. Collect it from the same Home Affairs office.',
      'The Smart ID card costs R140. If you are 16 years old applying for the first time, it is FREE.',
    ],
    note: 'Home Affairs national hotline: 0800 601 190 (free call). Open Monday–Friday, 08:00–15:30.',
  },
  {
    id: 'pnb',
    title: 'PNB Forms — Protection of Personal Beneficiary',
    icon: <CreditCard className="w-4 h-4" />,
    color: 'indigo',
    steps: [
      'A PNB (Protection of Personal Beneficiary) form is required when a minor (under 18) is named as a beneficiary on a financial product such as a life insurance policy or pension fund.',
      'The form appoints a guardian to manage the funds on behalf of the minor until they turn 18.',
      'You need it when: a family member names you on their insurance or pension; you are opening a trust account for a minor; a deceased parent left funds for a minor child.',
      'The form is available from the relevant financial institution (insurer, bank, pension fund administrator).',
      'It must be completed by the legal guardian of the minor and submitted with a copy of the minor\'s birth certificate and the guardian\'s ID.',
      'Once submitted, the guardian legally manages the funds and must act in the best interest of the minor.',
    ],
    note: 'PNB forms are not standard across all institutions — request the specific form from the company managing the funds.',
  },
  {
    id: 'sassa',
    title: 'SASSA Grants — Financial Support',
    icon: <FileText className="w-4 h-4" />,
    color: 'emerald',
    bullets: [
      'Child Support Grant: R530/month (2026). For caregivers earning under R4,800/month (single) or R9,600/month (married). Apply at any SASSA office with: ID, child\'s birth certificate, proof of income.',
      'Foster Care Grant: R1,180/month (2026). For court-appointed foster parents. Apply at SASSA with court order and ID.',
      'Social Relief of Distress (SRD): R370/month. For unemployed adults aged 18–59 with no other income. Apply online at srd.sassa.gov.za or via USSD *134*7737#.',
      'Care Dependency Grant: R2,090/month. For caregivers of children with severe disabilities.',
      'Disability Grant: R2,090/month. For adults 18–59 with a medically assessed disability that prevents work.',
    ],
    steps: [
      'Visit your nearest SASSA office or apply online at sassa.gov.za',
      'Bring your SA ID, proof of residence, and a bank account number.',
      'A social worker may assess your application for some grants.',
      'Payments are made via SASSA card, Post Office, or bank transfer.',
    ],
    note: 'SASSA national hotline: 0800 601 011 (free call)',
  },
  {
    id: 'voting',
    title: 'How to Vote in South Africa',
    icon: <Vote className="w-4 h-4" />,
    color: 'amber',
    steps: [
      'You must be a South African citizen aged 18 or older to vote.',
      'Register on the voters\' roll: Visit any IEC (Electoral Commission) office, post office, or registration station during announced registration weekends. You need your SA ID and proof of address.',
      'Check your registration at checkregistration.elections.org.za — enter your ID number to confirm you are registered.',
      'On election day, go to the voting station listed on your voter card (or check online). Bring your SA ID card or passport.',
      'You will receive a ballot paper. Mark your choice with a tick (✓) or cross (X) next to the party or candidate of your choice.',
      'Fold the ballot paper and place it in the ballot box. Your vote is secret.',
    ],
    note: 'IEC helpline: 0800 11 8000 (free call). Election dates are announced by the President.',
  },
  {
    id: 'workers-rights',
    title: 'Basic Workers\' Rights',
    icon: <HardHat className="w-4 h-4" />,
    color: 'rose',
    bullets: [
      'You are entitled to a written employment contract outlining your pay, hours, and leave.',
      'National minimum wage (2026): R28.79/hour for most workers. Domestic workers and farm workers have slightly different rates.',
      'You are entitled to 15 days of annual leave per year (or 1 day per 17 days worked).',
      'You are entitled to 3 days of family responsibility leave per year (e.g. sick child, bereavement).',
      'Pregnant employees receive 4 months of unpaid maternity leave. UIF covers 66% of salary during this period.',
      'Your employer must register you for UIF. If you lose your job, you can claim UIF at any Labour office or online at uifecc.labour.gov.za.',
      'You cannot be fired without a fair reason and proper process (CCMA protects you against unfair dismissal).',
      'If you face workplace issues, contact the CCMA (Commission for Conciliation, Mediation and Arbitration): 0861 16 2762.',
    ],
  },
  {
    id: 'students-rights',
    title: 'Student Rights',
    icon: <GraduationCap className="w-4 h-4" />,
    color: 'violet',
    bullets: [
      'Every child in South Africa has the right to basic education (Section 29 of the Constitution).',
      'No public school may turn away a learner because their parents cannot afford school fees. Schools must have a school fees exemption policy.',
      'The South African Schools Act prohibits corporal punishment in all schools.',
      'You have the right to education in your preferred language where reasonably practicable.',
      'University students have the right to fair and transparent disciplinary processes.',
      'NSFAS-funded students have the right to appeal funding decisions. Submit appeals at nsfas.org.za.',
      'If you experience academic unfairness, you can escalate to the institution\'s student affairs office or the CHE (Council on Higher Education).',
    ],
    note: 'DBE hotline: 0800 202 933 (free call)',
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, { bg: string; border: string; icon: string; badge: string; step: string }> = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   icon: 'bg-blue-600',   badge: 'bg-blue-100 text-blue-700',   step: 'bg-blue-600 text-white' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'bg-indigo-600', badge: 'bg-indigo-100 text-indigo-700', step: 'bg-indigo-600 text-white' },
  emerald:{ bg: 'bg-emerald-50',border: 'border-emerald-200',icon: 'bg-emerald-600',badge: 'bg-emerald-100 text-emerald-700',step: 'bg-emerald-600 text-white' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  icon: 'bg-amber-600',  badge: 'bg-amber-100 text-amber-700',  step: 'bg-amber-600 text-white' },
  rose:   { bg: 'bg-rose-50',   border: 'border-rose-200',   icon: 'bg-rose-600',   badge: 'bg-rose-100 text-rose-700',    step: 'bg-rose-600 text-white' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', icon: 'bg-violet-600', badge: 'bg-violet-100 text-violet-700', step: 'bg-violet-600 text-white' },
};

function CivicCard({ section }: { section: CivicSection }) {
  const [open, setOpen] = useState(false);
  const cfg = COLOR_MAP[section.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${cfg.border} overflow-hidden`}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-5 py-4 text-left ${open ? cfg.bg : 'bg-white'} hover:${cfg.bg} transition-colors`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl ${cfg.icon} flex items-center justify-center text-white shrink-0`}>
            {section.icon}
          </div>
          <span className="font-bold text-slate-900 text-sm">{section.title}</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden ${cfg.bg} border-t ${cfg.border}`}
          >
            <div className="px-5 pb-5 pt-4 space-y-3">
              {section.steps && (
                <ol className="space-y-3">
                  {section.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                      <span className={`flex-none w-5 h-5 rounded-full ${cfg.step} text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5`}>
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              )}

              {section.bullets && (
                <ul className="space-y-2.5">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${cfg.icon.replace('bg-', 'text-')}`} />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {section.note && (
                <div className={`flex gap-2 p-3 rounded-xl ${cfg.badge} border ${cfg.border} text-xs`}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {section.note}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

function CivicsPage({ user, onNavigate }: AuthedProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentPage="civics" user={user} onNavigate={onNavigate} mode="news" />

      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16 space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-2xl text-slate-900 uppercase tracking-wide">Civics Guide</h1>
              <p className="text-xs text-slate-500">Know your rights · How SA works</p>
            </div>
          </div>
        </motion.div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-slate-900 text-white"
        >
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed text-slate-200">
              South Africa's Constitution guarantees rights for every citizen. This guide explains how to access government services, understand your rights as a worker and student, and navigate key government processes — in plain language.
            </p>
          </div>
        </motion.div>

        {/* Civic sections */}
        <div className="space-y-3">
          {SECTIONS.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <CivicCard section={section} />
            </motion.div>
          ))}
        </div>

        {/* Emergency numbers */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 bg-slate-900 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-4 h-4 text-slate-300" />
            <h2 className="font-black text-sm uppercase tracking-wider text-white">Emergency & Helpline Numbers</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Police (SAPS)', number: '10111' },
              { label: 'Ambulance', number: '10177' },
              { label: 'ER24', number: '084 124' },
              { label: 'Home Affairs', number: '0800 601 190' },
              { label: 'SASSA', number: '0800 601 011' },
              { label: 'NSFAS', number: '0800 067 327' },
              { label: 'Dept. of Labour', number: '0800 601 011' },
              { label: 'CCMA', number: '0861 16 2762' },
              { label: 'IEC (Elections)', number: '0800 11 8000' },
            ].map(({ label, number }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="font-black text-white text-base">{number}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">All numbers starting with 0800 are toll-free from landlines. Mobile rates may apply.</p>
        </motion.div>
      </main>
    </div>
  );
}

export default withAuth(CivicsPage);
