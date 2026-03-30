import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, CheckCircle2, AlertCircle, Lightbulb, Heart, BookOpen, Users, FileText, Calendar, Download } from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';

function DisadvantagedGuide({ user, onNavigate }: AuthedProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('info');

  const sections = [
    {
      id: 'info',
      title: 'What Info Helps You Qualify?',
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl" style={{ backgroundColor: 'rgba(22, 163, 74, 0.05)', borderLeft: '4px solid #16a34a' }}>
              <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1e293b' }}>
                <FileText className="w-5 h-5" /> Financial Need
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
                <li>• Household income statements</li>
                <li>• Utility bills (proof of financial hardship)</li>
                <li>• Affidavit from parent/guardian</li>
                <li>• School's confirmation of hardship</li>
                <li>• Rent/mortgage agreements</li>
                <li>• Medical expenses if applicable</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', borderLeft: '4px solid #3b82f6' }}>
              <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1e293b' }}>
                <Heart className="w-5 h-5" /> Personal Story
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
                <li>• Your background and circumstances</li>
                <li>• Challenges you've faced</li>
                <li>• How you overcame them</li>
                <li>• Why education matters to you</li>
                <li>• Your goals and aspirations</li>
                <li>• How this bursary will help</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl" style={{ backgroundColor: 'rgba(168, 85, 247, 0.05)', borderLeft: '4px solid #a855f7' }}>
              <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1e293b' }}>
                <CheckCircle2 className="w-5 h-5" /> Academics
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
                <li>• Your current grades (even if not top tier)</li>
                <li>• Show improvement over time</li>
                <li>• Effort and determination</li>
                <li>• Consistency despite challenges</li>
                <li>• Any subjects of strength</li>
                <li>• Attendance record</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid #ef4444' }}>
              <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1e293b' }}>
                <Users className="w-5 h-5" /> Community
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
                <li>• Volunteer work or community service</li>
                <li>• Helping in your community</li>
                <li>• Leadership roles (formal or informal)</li>
                <li>• Sports or cultural participation</li>
                <li>• Mentoring younger students</li>
                <li>• Initiative and responsibility</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'story',
      title: 'How to Write Your Story',
      icon: AlertCircle,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border-2 border-red-200" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
              <h4 className="font-bold mb-4 flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" /> What NOT to Do
              </h4>
              <ul className="space-y-3 text-sm" style={{ color: '#475569' }}>
                <li>✗ Don't just say "I'm poor, please help"</li>
                <li>✗ Don't make excuses for everything</li>
                <li>✗ Don't lie or exaggerate your story</li>
                <li>✗ Don't focus only on sadness/problems</li>
                <li>✗ Don't ask for pity or sympathy</li>
                <li>✗ Don't ignore spelling/grammar</li>
                <li>✗ Don't use informal language</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border-2 border-green-200" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
              <h4 className="font-bold mb-4 flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" /> What TO Do
              </h4>
              <ul className="space-y-3 text-sm" style={{ color: '#475569' }}>
                <li>✓ Be specific: Give exact numbers/details</li>
                <li>✓ Show resilience and determination</li>
                <li>✓ Show your passion for education</li>
                <li>✓ Demonstrate gratitude and appreciation</li>
                <li>✓ Show how you've overcome challenges</li>
                <li>✓ Use proper grammar and language</li>
                <li>✓ Tell a story that feels authentic</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
            <h4 className="font-bold mb-6 text-lg" style={{ color: '#1e293b' }}>Template Structure</h4>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h5 className="font-bold mb-2" style={{ color: '#1e293b' }}>Opening (Hook) - 1-2 sentences</h5>
                <p style={{ color: '#475569' }}>Start with a powerful statement about who you are or what drives you.</p>
                <p className="mt-3 text-xs italic" style={{ color: '#64748b' }}>Example: "I come from Khayelitsha, where opportunity feels like a luxury..."</p>
              </div>

              <div className="border-l-4 border-green-500 pl-6">
                <h5 className="font-bold mb-2" style={{ color: '#1e293b' }}>Body (Your Story) - 3-4 paragraphs</h5>
                <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
                  <li>• Para 1: Your background (specific)</li>
                  <li>• Para 2: Challenges you face (specific)</li>
                  <li>• Para 3: How you've overcome them</li>
                  <li>• Para 4: Your determination despite circumstances</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-6">
                <h5 className="font-bold mb-2" style={{ color: '#1e293b' }}>Why This Bursary - 1-2 paragraphs</h5>
                <p style={{ color: '#475569' }}>Explain how this specific bursary helps YOU achieve your goals. Not just that you need money, but what this opportunity means to your future.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-6">
                <h5 className="font-bold mb-2" style={{ color: '#1e293b' }}>Closing (Future Goals) - 1 paragraph</h5>
                <p style={{ color: '#475569' }}>What will you achieve with this support? How will you give back to your community? What's your vision?</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
            <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#1e293b' }}>
              <Lightbulb className="w-5 h-5" /> Full Example
            </h4>
            <div className="p-6 bg-white rounded-xl border border-blue-200" style={{ color: '#475569' }}>
              <p className="mb-4 italic">
                "I come from Khayelitsha. My father passed away when I was 8, and my mother works as a domestic worker earning R3,500/month. Every morning, I walk 2km to school and help my mother at home before studying. Despite these circumstances, I achieved 78% last year because I believe education is my path to a better life.
              </p>
              <p className="mb-4 italic">
                My mother struggles to keep me in school. She often takes extra jobs, which means she's away from home. This bursary would change our lives. It would mean my mother doesn't have to work extra hours just for my tuition, and she can be home more. More importantly, it would mean I can focus entirely on my studies without guilt.
              </p>
              <p className="mb-4 italic">
                I'm passionate about engineering because I want to build roads and infrastructure that connects rural communities to opportunities, just as I've been kept from opportunities by distance and lack of resources. If selected for this bursary, I will maintain academic excellence, mentor younger students from my community, and ultimately become an engineer who gives back to townships like mine."
              </p>
              <p className="font-bold text-sm" style={{ color: '#3b82f6' }}>Why this works:</p>
              <ul className="mt-3 space-y-1 text-xs" style={{ color: '#475569' }}>
                <li>✓ Specific numbers ($3,500, 78%, 2km)</li>
                <li>✓ Shows resilience, not just problems</li>
                <li>✓ Clear career goal connected to hardship</li>
                <li>✓ Shows gratitude and broader vision</li>
                <li>✓ Professional language, no excuses</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'documents',
      title: 'Documents You Can Get for Free',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border-2 border-slate-200 hover:border-slate-400 transition-all">
              <h5 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1e293b' }}>
                <CheckCircle2 className="w-5 h-5" style={{ color: '#22c55e' }} /> Affidavit
              </h5>
              <p className="text-sm mb-3" style={{ color: '#475569' }}>Go to your local <span className="font-bold">police station</span>, ask for an affidavit form (completely free), and fill it out describing your financial situation.</p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Time needed: 30 minutes</p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-slate-200 hover:border-slate-400 transition-all">
              <h5 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1e293b' }}>
                <CheckCircle2 className="w-5 h-5" style={{ color: '#22c55e' }} /> Income Letter
              </h5>
              <p className="text-sm mb-3" style={{ color: '#475569' }}>Ask your parent's <span className="font-bold">employer</span> to write a letter on company letterhead stating their income, position, and employment dates.</p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Time needed: 1-2 days</p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-slate-200 hover:border-slate-400 transition-all">
              <h5 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1e293b' }}>
                <CheckCircle2 className="w-5 h-5" style={{ color: '#22c55e' }} /> School Hardship Letter
              </h5>
              <p className="text-sm mb-3" style={{ color: '#475569' }}>Ask your <span className="font-bold">principal or school counselor</span> to write a letter confirming your financial need and circumstances.</p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Time needed: 1-3 days</p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-slate-200 hover:border-slate-400 transition-all">
              <h5 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1e293b' }}>
                <CheckCircle2 className="w-5 h-5" style={{ color: '#22c55e' }} /> Character Reference
              </h5>
              <p className="text-sm mb-3" style={{ color: '#475569' }}>Ask a <span className="font-bold">teacher</span> who knows you well to write a reference letter about your character and potential.</p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Time needed: 2-3 days</p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-slate-200 hover:border-slate-400 transition-all">
              <h5 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1e293b' }}>
                <CheckCircle2 className="w-5 h-5" style={{ color: '#22c55e' }} /> Community Letter
              </h5>
              <p className="text-sm mb-3" style={{ color: '#475569' }}>Ask a <span className="font-bold">pastor, community leader, or social worker</span> to write about your character and community contribution.</p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Time needed: 2-3 days</p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-slate-200 hover:border-slate-400 transition-all">
              <h5 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1e293b' }}>
                <CheckCircle2 className="w-5 h-5" style={{ color: '#22c55e' }} /> Bank Statement
              </h5>
              <p className="text-sm mb-3" style={{ color: '#475569' }}>Get a <span className="font-bold">3-6 month bank statement</span> from your parent or guardian showing low balance and transactions (free from bank).</p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Time needed: Same day</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'timeline',
      title: 'Timeline Management - Don\'t Wait!',
      icon: Calendar,
      content: (
        <div className="space-y-6">
          <div className="relative">
            {[
              { months: '3 months before deadline', tasks: ['Start gathering documents', 'Get certified ID copy from Home Affairs', 'Ask school for transcript', 'Ask employer for income letter'] },
              { months: '2 months before', tasks: ['Write first draft of motivation letter', 'Get feedback from teacher', 'Revise and improve', 'Collect references from teachers'] },
              { months: '1 month before', tasks: ['Get letters from all references', 'Get affidavit from police station', 'Finalize motivation letter', 'Gather all financial documents'] },
              { months: '2 weeks before', tasks: ['Review everything (typos, clarity)', 'Make copies of all documents', 'Create digital backups', 'Test online portal login'] },
              { months: 'Final week', tasks: ['Double-check deadline date', 'Review all requirements', 'Submit application early (not last day)', 'Keep confirmation email'] },
            ].map((phase, idx) => (
              <div key={idx} className="flex gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#1e293b' }}>
                    {idx + 1}
                  </div>
                  {idx < 4 && <div className="w-1 h-16" style={{ backgroundColor: '#cbd5e1' }} />}
                </div>
                <div className="flex-1">
                  <h5 className="font-bold mb-3 text-lg" style={{ color: '#1e293b' }}>{phase.months}</h5>
                  <div className="space-y-2">
                    {phase.tasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5" style={{ color: '#22c55e' }} />
                        <span style={{ color: '#475569' }}>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-2xl p-6">
            <h5 className="font-bold mb-2 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" /> Don't Make This Mistake!
            </h5>
            <p style={{ color: '#475569' }}>
              Many students wait until the last week to apply. This is RISKY because:
            </p>
            <ul className="mt-3 space-y-1 text-sm" style={{ color: '#475569' }}>
              <li>✗ Documents aren't ready in time</li>
              <li>✗ You can't get references completed</li>
              <li>✗ Portal might crash (too many users)</li>
              <li>✗ Your upload fails and you miss deadline</li>
              <li>✗ No time to fix mistakes</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'applications',
      title: 'Multiple Applications - Apply to Many!',
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <h5 className="font-bold mb-4 text-lg flex items-center gap-2" style={{ color: '#15803d' }}>
              <CheckCircle2 className="w-6 h-6" /> Why Apply to Multiple Bursaries?
            </h5>
            <ul className="space-y-3 text-sm" style={{ color: '#166534' }}>
              <li>✓ Different bursaries have different criteria (some care more about academics, others about need)</li>
              <li>✓ Your motivation letter will resonate better with some than others</li>
              <li>✓ Even with great qualifications, you might not get selected for one (competitive)</li>
              <li>✓ Getting multiple offers means you can choose the best one</li>
              <li>✓ Some bursaries complement each other</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border-2 border-blue-200" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
              <h5 className="font-bold mb-4" style={{ color: '#1e293b' }}>Target: Apply to 10-15 bursaries</h5>
              <ol className="space-y-2 text-sm" style={{ color: '#475569' }}>
                <li>1. NSFAS (government - most accessible)</li>
                <li>2. Provincial bursaries (your province)</li>
                <li>3. University-specific bursaries</li>
                <li>4. Corporate bursaries (5-10 companies)</li>
                <li>5. NGO bursaries (2-3 organizations)</li>
              </ol>
            </div>

            <div className="p-6 rounded-2xl border-2 border-purple-200" style={{ backgroundColor: 'rgba(168, 85, 247, 0.05)' }}>
              <h5 className="font-bold mb-4" style={{ color: '#1e293b' }}>Customize Your Letter for EACH</h5>
              <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
                <li>✓ Keep your core story the same</li>
                <li>✓ Adjust the "why this bursary" section</li>
                <li>✓ Reference their specific focus</li>
                <li>✓ Align your goals with their mission</li>
                <li>✓ Don't send identical letters!</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-2xl p-6">
            <h5 className="font-bold mb-2" style={{ color: '#854d0e' }}>Pro Tip: Spreadsheet</h5>
            <p style={{ color: '#92400e' }}>Create a spreadsheet tracking:</p>
            <ul className="mt-2 text-sm space-y-1" style={{ color: '#92400e' }}>
              <li>• Bursary name | Provider | Deadline | Status | Submitted Date | Interview Date</li>
              <li>• This helps you stay organized and follow up</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'rejection',
      title: 'If Rejected - Don\'t Give Up!',
      icon: Heart,
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-2xl p-6">
            <h5 className="font-bold mb-3 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" /> Getting Rejected is Normal
            </h5>
            <p style={{ color: '#7f1d1d' }}>
              Even excellent students get rejected from bursaries. It's not because you're not good enough—it's because hundreds of other excellent students also apply. Don't give up!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border-2 border-blue-200" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
              <h5 className="font-bold mb-4" style={{ color: '#1e293b' }}>If You Get Rejected</h5>
              <ol className="space-y-3 text-sm" style={{ color: '#475569' }}>
                <li>1. <span className="font-bold">Ask for feedback</span> - Email them asking why you weren't selected</li>
                <li>2. <span className="font-bold">Take notes</span> - Listen to constructive criticism</li>
                <li>3. <span className="font-bold">Improve</span> - Strengthen weak areas</li>
                <li>4. <span className="font-bold">Reapply</span> - Try again next year with stronger application</li>
                <li>5. <span className="font-bold">Try others</span> - Apply to different bursaries</li>
              </ol>
            </div>

            <div className="p-6 rounded-2xl border-2 border-green-200" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
              <h5 className="font-bold mb-4" style={{ color: '#1e293b' }}>If You Get Selected</h5>
              <ol className="space-y-3 text-sm" style={{ color: '#475569' }}>
                <li>1. <span className="font-bold">Respond immediately</span> - Show your enthusiasm</li>
                <li>2. <span className="font-bold">Prepare for interview</span> - Practice your story</li>
                <li>3. <span className="font-bold">Be authentic</span> - Tell your real story with confidence</li>
                <li>4. <span className="font-bold">Ask good questions</span> - Show you care</li>
                <li>5. <span className="font-bold">Send thank you</span> - Professional follow-up email</li>
              </ol>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
            <h5 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#1e293b' }}>
              <Lightbulb className="w-5 h-5" style={{ color: '#3b82f6' }} /> Things to Remember
            </h5>
            <ul className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <li>✓ Your worth isn't determined by bursary rejections</li>
              <li>✓ Many successful people were rejected multiple times</li>
              <li>✓ Bursaries are competitive—keep trying</li>
              <li>✓ Get mentoring from your school counselor</li>
              <li>✓ Look into alternative funding (NSFAS, student loans)</li>
              <li>✓ Part-time work + studying is possible</li>
              <li>✓ Don't give up on your dreams</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader currentPage="bursaries" user={user} onNavigate={onNavigate} />

      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(100,116,139,0.1)' }}>
            <Heart className="w-4 h-4" style={{ color: '#64748b' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Support for You</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight" style={{ color: '#1e293b' }}>
            Disadvantaged Student <span style={{ color: '#64748b' }}>Guide</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: '#475569' }}>
            A comprehensive guide for students from low-income backgrounds applying for bursaries. Learn what information helps you qualify, how to write your story, and how to successfully apply.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(30,41,59,0.05)' }}>
                      <Icon className="w-6 h-6" style={{ color: '#1e293b' }} />
                    </div>
                    <h3 className="text-lg font-bold text-left uppercase tracking-tight" style={{ color: '#1e293b' }}>
                      {section.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className="w-6 h-6 flex-shrink-0 transition-transform"
                    style={{ color: '#64748b', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <div className="p-6 md:p-8">{section.content}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4 uppercase tracking-tight">You Can Do This!</h2>
          <p className="text-white/80 mb-8 leading-relaxed">
            Getting a bursary takes effort, but it's absolutely achievable. Thousands of disadvantaged students get bursaries every year. With preparation, authenticity, and persistence, you can too.
          </p>
          <button
            onClick={() => {
              sessionStorage.removeItem('selectedBursaryId');
              onNavigate('bursaries');
            }}
            className="px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-80 transition-all"
            style={{ backgroundColor: '#f59e0b', color: '#1e293b' }}
          >
            Browse Bursaries Now
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default withAuth(DisadvantagedGuide);
