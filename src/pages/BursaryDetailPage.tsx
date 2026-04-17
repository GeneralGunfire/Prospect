import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, XCircle, Wallet, FileText, PenTool, Users, ExternalLink, Bookmark, MessageCircle, Share2, AlertCircle } from 'lucide-react';
import { bursaries } from '../data/bursaries';
import { getUserBookmarks, saveBookmark, removeBookmark } from '../services/bookmarkService';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';

function BursaryDetailPage({ user, onNavigate }: AuthedProps) {
  const bursaryId = typeof window !== 'undefined' ? sessionStorage.getItem('selectedBursaryId') : null;
  const bursary = bursaryId ? bursaries.find(b => b.id === bursaryId) : null;
  const [eligibilityAnswers, setEligibilityAnswers] = useState<Record<string, boolean>>({});
  const [savedBursaries, setSavedBursaries] = useState<string[]>([]);

  // Fetch saved bursaries from Supabase on mount
  useEffect(() => {
    const loadSavedBursaries = async () => {
      const bookmarks = await getUserBookmarks(user.id);
      setSavedBursaries(bookmarks.bursaries);
    };

    loadSavedBursaries();
  }, [user.id]);

  if (!bursary) {
    return (
      <div className="min-h-screen bg-surface">
        <AppHeader currentPage="bursaries" user={user} onNavigate={onNavigate} mode="career" />
        <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold" style={{ color: '#1e293b' }}>Bursary not found</h1>
          <button
            onClick={() => onNavigate('bursaries')}
            className="mt-6 px-6 py-3 rounded-xl text-white font-bold text-sm uppercase tracking-widest"
            style={{ backgroundColor: '#1e293b' }}
          >
            Back to Bursaries
          </button>
        </div>
      </div>
    );
  }

  const toggleSave = async () => {
    if (savedBursaries.includes(bursary.id)) {
      // Remove from saved
      const success = await removeBookmark(user.id, 'bursary', bursary.id);
      if (success) {
        setSavedBursaries(savedBursaries.filter(s => s !== bursary.id));
      }
    } else {
      // Add to saved
      const success = await saveBookmark(user.id, 'bursary', bursary.id);
      if (success) {
        setSavedBursaries([...savedBursaries, bursary.id]);
      }
    }
  };

  const eligibilityChecks = useMemo(() => {
    const checks = [];
    if (bursary.requirements.minMarks) {
      checks.push({
        key: 'marks',
        label: `Minimum marks: ${bursary.requirements.minMarks}`,
      });
    }
    if (bursary.requirements.maxIncome) {
      checks.push({
        key: 'income',
        label: `Household income: ${bursary.requirements.maxIncome}`,
      });
    }
    if (bursary.requirements.citizenship) {
      checks.push({
        key: 'citizenship',
        label: `Citizenship: ${bursary.requirements.citizenship}`,
      });
    }
    if (bursary.requirements.ageLimit) {
      checks.push({
        key: 'age',
        label: `Age limit: ${bursary.requirements.ageLimit}`,
      });
    }
    if (bursary.requirements.specialRequirements) {
      bursary.requirements.specialRequirements.forEach((req, idx) => {
        checks.push({
          key: `special-${idx}`,
          label: req,
        });
      });
    }
    return checks;
  }, [bursary]);

  const coverageItems = useMemo(() => {
    const items = [];
    if (bursary.coverage.tuition) items.push('Full Tuition Fees');
    if (bursary.coverage.accommodation) items.push('Accommodation & Residence Fees');
    if (bursary.coverage.meals) items.push('Meal Plan/Food Allowance');
    if (bursary.coverage.books) items.push('Learning Materials (Books/Laptop)');
    if (bursary.coverage.transport) items.push('Transport/Travel Allowance');
    if (bursary.coverage.laptop) items.push('Laptop/Computer Equipment');
    if (bursary.coverage.stipend) items.push(`Monthly Stipend: ${bursary.coverage.stipend}`);
    return items;
  }, [bursary]);

  const applicationSteps = [
    { step: 1, title: 'Create Online Account', desc: `Go to ${bursary.contact.website} and register for an account with your email and personal details.` },
    { step: 2, title: 'Prepare Documents', desc: `Gather all required documents: ${bursary.applicationProcess.requiredDocuments.slice(0, 3).join(', ')}, etc.` },
    { step: 3, title: 'Complete Application', desc: 'Fill out the online form with accurate information. Double-check before submitting.' },
    { step: 4, title: 'Submit Documentation', desc: 'Upload certified copies of all required documents to your application.' },
    { step: 5, title: 'Submit Application', desc: `Submit before the deadline: ${bursary.applicationProcess.deadline}` },
    { step: 6, title: 'Wait for Results', desc: 'Check your email for updates. Shortlisted candidates will be invited for interviews.' },
  ];

  const eligibilityPercentage = Math.round((Object.values(eligibilityAnswers).filter(Boolean).length / eligibilityChecks.length) * 100);

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader currentPage="bursaries" user={user} onNavigate={onNavigate} mode="career" />

      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => onNavigate('bursaries')}
          className="flex items-center gap-2 mb-8 text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
          style={{ color: '#64748b' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Bursaries
        </button>

        {/* SECTION 1: Quick Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-8 border border-slate-100"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(30,41,59,0.05)' }}>
                  <Wallet className="w-8 h-8" style={{ color: '#1e293b' }} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: '#1e293b' }}>{bursary.name}</h1>
                  <p className="text-sm font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>by {bursary.provider}</p>
                </div>
              </div>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#475569' }}>
                {bursary.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg" style={{ color: i < Math.floor(bursary.rating) ? '#f59e0b' : '#e5e7eb' }}>★</span>
                  ))}
                  <span className="text-sm font-bold ml-2" style={{ color: '#1e293b' }}>{bursary.rating}/5</span>
                </div>
                <span className="text-xs text-slate-500">({bursary.reviews} reviews)</span>
              </div>
            </div>
            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
              <a
                href={bursary.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="grow md:grow-0 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: '#1e293b' }}
              >
                Apply Now <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={toggleSave}
                className="p-4 rounded-xl border transition-all flex items-center justify-center"
                style={savedBursaries.includes(bursary.id)
                  ? { backgroundColor: '#64748b', borderColor: '#64748b', color: 'white' }
                  : { backgroundColor: 'white', borderColor: '#e2e8f0', color: '#1e293b' }}
              >
                <Bookmark className={`w-4 h-4 ${savedBursaries.includes(bursary.id) ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {bursary.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: 'rgba(30,41,59,0.05)', color: '#1e293b' }}>
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* SECTION 2: Am I Eligible? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-8 border border-slate-100"
        >
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight" style={{ color: '#1e293b' }}>Am I Eligible?</h2>

          <div className="space-y-4 mb-8">
            {eligibilityChecks.map((check) => (
              <div
                key={check.key}
                className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all"
                onClick={() => setEligibilityAnswers({ ...eligibilityAnswers, [check.key]: !eligibilityAnswers[check.key] })}
                style={eligibilityAnswers[check.key]
                  ? { backgroundColor: 'rgba(34,197,94,0.05)', borderColor: '#22c55e' }
                  : { backgroundColor: 'rgba(30,41,59,0.02)', borderColor: '#e2e8f0' }}
              >
                {eligibilityAnswers[check.key] ? (
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: '#22c55e' }} />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 flex-shrink-0" style={{ borderColor: '#cbd5e1' }} />
                )}
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1e293b' }}>{check.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#64748b' }} />
              <div>
                <p className="font-bold mb-2" style={{ color: '#1e293b' }}>Your Match: <span style={{ color: '#22c55e' }}>{eligibilityPercentage}%</span></p>
                <p className="text-sm" style={{ color: '#475569' }}>
                  {eligibilityPercentage === 100 && "You appear to meet all requirements! Review details carefully and apply."}
                  {eligibilityPercentage >= 75 && eligibilityPercentage < 100 && "You meet most requirements. Review any gaps with the provider before applying."}
                  {eligibilityPercentage >= 50 && eligibilityPercentage < 75 && "You meet some requirements. Contact the provider to clarify eligibility criteria."}
                  {eligibilityPercentage < 50 && "You don't currently meet most requirements. Consider other bursaries or improving your profile."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 3: What's Covered? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-8 border border-slate-100"
        >
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight" style={{ color: '#1e293b' }}>What's Covered?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {coverageItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'rgba(34,197,94,0.05)' }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#22c55e' }} />
                <span className="font-bold text-sm" style={{ color: '#1e293b' }}>{item}</span>
              </div>
            ))}
          </div>

          {bursary.coverage.totalValue && (
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white text-center">
              <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>Total Value</p>
              <h3 className="text-3xl font-bold">{bursary.coverage.totalValue}</h3>
            </div>
          )}
        </motion.div>

        {/* SECTION 4: How to Apply (Step-by-Step) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-8 border border-slate-100"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight" style={{ color: '#1e293b' }}>How to Apply</h2>
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Timeline</p>
            <p className="text-base mt-2" style={{ color: '#475569' }}>{bursary.applicationProcess.timeline || 'Application process varies. Check website for timelines.'}</p>
            <p className="text-sm font-bold uppercase tracking-widest mt-6 mb-2" style={{ color: '#f59e0b' }}>⏰ Deadline: {bursary.applicationProcess.deadline}</p>
          </div>

          <div className="space-y-4">
            {applicationSteps.map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white" style={{ backgroundColor: '#1e293b' }}>
                    {item.step}
                  </div>
                  <div className="pt-2 flex-1">
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1" style={{ color: '#1e293b' }}>{item.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SECTION 5: Required Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-8 border border-slate-100"
        >
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight" style={{ color: '#1e293b' }}>Required Documents</h2>

          <div className="space-y-4">
            {bursary.applicationProcess.requiredDocuments.map((doc, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 hover:border-slate-300 transition-all" style={{ backgroundColor: 'rgba(30,41,59,0.02)' }}>
                <div className="flex items-start gap-4">
                  <FileText className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#64748b' }} />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-2" style={{ color: '#1e293b' }}>{doc}</h4>
                    <ul className="text-xs space-y-1" style={{ color: '#475569' }}>
                      {doc.includes('certified') && <li>• Must be certified by school or notary</li>}
                      {doc.includes('ID') && <li>• Front and back copy</li>}
                      {doc.includes('letter') && <li>• Typed or handwritten, signed</li>}
                      {doc.includes('transcript') && <li>• Showing all subjects and marks</li>}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(59,130,246,0.05)', borderLeft: '4px solid #3b82f6' }}>
            <p className="text-sm font-bold mb-2" style={{ color: '#1e293b' }}>💡 Pro Tip:</p>
            <p className="text-xs" style={{ color: '#475569' }}>Prepare documents well in advance. Get certified copies from school immediately after your marks are released. Keep digital backups of everything you upload.</p>
          </div>
        </motion.div>

        {/* SECTION 6: Motivation Letter Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-8 border border-slate-100"
        >
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight" style={{ color: '#1e293b' }}>Motivation Letter Guide</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="border-l-4 border-green-500 pl-6">
              <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#22c55e' }}>
                <CheckCircle2 className="w-5 h-5" /> What TO Do
              </h4>
              <ul className="space-y-2 text-xs" style={{ color: '#475569' }}>
                <li>✓ Be specific with your story and background</li>
                <li>✓ Show resilience despite challenges</li>
                <li>✓ Explain why this bursary matters to YOU</li>
                <li>✓ Show gratitude and commitment</li>
                <li>✓ Proofread carefully (no errors)</li>
                <li>✓ Be honest and authentic</li>
                <li>✓ Show how you'll contribute to society</li>
              </ul>
            </div>
            <div className="border-l-4 border-red-500 pl-6">
              <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#ef4444' }}>
                <XCircle className="w-5 h-5" /> What NOT to Do
              </h4>
              <ul className="space-y-2 text-xs" style={{ color: '#475569' }}>
                <li>✗ Don't just say "I'm poor, help me"</li>
                <li>✗ Don't make excuses for poor grades</li>
                <li>✗ Don't lie or exaggerate achievements</li>
                <li>✗ Don't copy from others</li>
                <li>✗ Don't complain or sound desperate</li>
                <li>✗ Don't ignore word limit</li>
                <li>✗ Don't focus only on money</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200 mb-8">
            <h4 className="font-bold mb-4" style={{ color: '#1e293b' }}>Template Structure</h4>
            <div className="space-y-3 text-xs" style={{ color: '#475569' }}>
              <div>
                <span className="font-bold">Opening (Hook):</span> Start with a powerful statement about who you are or what drives you
              </div>
              <div>
                <span className="font-bold">Body (Your Story):</span> Describe your background, challenges, and how you overcame them. Show academic progress despite difficulties.
              </div>
              <div>
                <span className="font-bold">Why This Bursary:</span> Explain how this specific bursary aligns with your goals and why it matters
              </div>
              <div>
                <span className="font-bold">Closing (Future Goals):</span> What will you achieve with this support? How will you give back?
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#1e293b' }}>
              <PenTool className="w-5 h-5" /> Example
            </h4>
            <p className="text-xs italic leading-relaxed" style={{ color: '#475569' }}>
              "I come from Khayelitsha where my mother works as a domestic worker earning R3,500/month. My father passed when I was 8. Despite walking 2km daily to school and helping at home, I achieved 78% last year because I believe education is my path to a better life. This bursary would mean my mother doesn't need extra jobs just for my tuition. I'm passionate about engineering to help build better communities. If selected, I commit to maintaining excellence and mentoring younger students from my township."
            </p>
          </div>
        </motion.div>

        {/* SECTION 7: Success Stories */}
        {bursary.successStories && bursary.successStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-8 border border-slate-100"
          >
            <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight" style={{ color: '#1e293b' }}>Success Stories</h2>

            <div className="space-y-6">
              {bursary.successStories.map((story, i) => (
                <div key={i} className="border-l-4 border-green-500 pl-6 py-4" style={{ backgroundColor: 'rgba(34,197,94,0.02)' }}>
                  <h4 className="font-bold text-lg mb-2" style={{ color: '#1e293b' }}>{story.studentName}</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-bold" style={{ color: '#64748b' }}>Background:</span>
                      <p style={{ color: '#475569' }}>{story.background}</p>
                    </div>
                    <div>
                      <span className="font-bold" style={{ color: '#64748b' }}>What Helped:</span>
                      <p style={{ color: '#475569' }}>{story.whatHelped}</p>
                    </div>
                    <div>
                      <span className="font-bold" style={{ color: '#22c55e' }}>Outcome:</span>
                      <p style={{ color: '#22c55e' }}>{story.outcome}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SECTION 8: Contact & Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-8 border border-slate-100"
        >
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight" style={{ color: '#1e293b' }}>Contact & Next Steps</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(30,41,59,0.05)' }}>
              <h4 className="font-bold mb-2 text-sm uppercase tracking-wider" style={{ color: '#1e293b' }}>Email</h4>
              <a href={`mailto:${bursary.contact.email}`} className="text-sm font-bold hover:opacity-70 transition-opacity" style={{ color: '#3b82f6' }}>
                {bursary.contact.email}
              </a>
            </div>
            {bursary.contact.phone && (
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(30,41,59,0.05)' }}>
                <h4 className="font-bold mb-2 text-sm uppercase tracking-wider" style={{ color: '#1e293b' }}>Phone</h4>
                <a href={`tel:${bursary.contact.phone}`} className="text-sm font-bold hover:opacity-70 transition-opacity" style={{ color: '#3b82f6' }}>
                  {bursary.contact.phone}
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <a
              href={bursary.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-all flex items-center gap-2 text-white"
              style={{ backgroundColor: '#1e293b' }}
            >
              Official Website <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={toggleSave}
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all flex items-center gap-2"
              style={savedBursaries.includes(bursary.id)
                ? { backgroundColor: '#64748b', borderColor: '#64748b', color: 'white' }
                : { backgroundColor: 'white', borderColor: '#e2e8f0', color: '#1e293b' }}
            >
              <Bookmark className={`w-4 h-4 ${savedBursaries.includes(bursary.id) ? 'fill-white' : ''}`} />
              Save for Later
            </button>
            <button className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border border-slate-200 text-slate-600 hover:border-slate-400 transition-all flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>

          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8">
            <h3 className="text-lg font-bold mb-4">Ready to Apply?</h3>
            <ol className="space-y-2 text-sm mb-6">
              <li>1. Review all requirements above (especially documents needed)</li>
              <li>2. Gather certified copies of your documents</li>
              <li>3. Draft your motivation letter using our guide</li>
              <li>4. Visit the official website and submit before the deadline</li>
              <li>5. Keep records of your application</li>
            </ol>
            <a
              href={bursary.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-all"
              style={{ backgroundColor: '#f59e0b', color: '#1e293b' }}
            >
              Start Your Application <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Related Bursaries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100"
        >
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight" style={{ color: '#1e293b' }}>Similar Bursaries</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bursaries
              .filter(b => b.id !== bursary.id && b.category === bursary.category)
              .slice(0, 3)
              .map((similar) => (
                <div
                  key={similar.id}
                  onClick={() => window.location.href = `?page=bursary&id=${similar.id}`}
                  className="p-6 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all cursor-pointer"
                >
                  <h4 className="font-bold mb-2 line-clamp-2" style={{ color: '#1e293b' }}>{similar.name}</h4>
                  <p className="text-xs mb-3" style={{ color: '#64748b' }}>{similar.provider}</p>
                  <p className="text-xs mb-4 line-clamp-2" style={{ color: '#475569' }}>{similar.description}</p>
                  <button className="text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity" style={{ color: '#3b82f6' }}>
                    View Details →
                  </button>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default withAuth(BursaryDetailPage);
