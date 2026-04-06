import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Bookmark, BarChart3, Briefcase, GraduationCap, MapPin, TrendingUp, AlertCircle } from 'lucide-react';
import type { CareerFull } from '../data/careersTypes';

interface CareerDetailModalProps {
  career: CareerFull | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
  onSelectCareer?: (career: CareerFull) => void;
  relatedCareers?: CareerFull[];
  isSaved?: boolean;
  onToggleSave?: (careerId: string) => void;
}

const RIASEC_COLORS: Record<string, string> = {
  R: '#EF4444', // Realistic - red
  I: '#3B82F6', // Investigative - blue
  A: '#A855F7', // Artistic - purple
  S: '#10B981', // Social - green
  E: '#F59E0B', // Enterprising - amber
  C: '#06B6D4', // Conventional - cyan
};

const RIASEC_NAMES: Record<string, string> = {
  realistic: 'Realistic',
  investigative: 'Investigative',
  artistic: 'Artistic',
  social: 'Social',
  enterprising: 'Enterprising',
  conventional: 'Conventional',
};

export function CareerDetailModal({
  career,
  isOpen,
  onClose,
  onNavigate,
  onSelectCareer,
  relatedCareers = [],
  isSaved = false,
  onToggleSave,
}: CareerDetailModalProps) {
  if (!career) return null;

  const riasecEntries = Object.entries(career.riasecMatch).sort(([, a], [, b]) => b - a).slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            data-testid="career-modal"
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vh] md:h-[90vh] md:max-w-5xl bg-white rounded-3xl shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 md:p-8 flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-prospect-green/10 text-prospect-green text-xs font-bold uppercase tracking-widest rounded-full">
                    {career.category}
                  </span>
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full ${
                    career.jobDemand.level === 'high'
                      ? 'bg-green-50 text-green-700'
                      : career.jobDemand.level === 'medium'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {career.jobDemand.level} demand
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#1e293b' }}>
                  {career.title}
                </h2>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => onToggleSave?.(career.id)}
                  data-testid="bookmark-btn"
                  className={`p-3 rounded-xl transition-all ${
                    isSaved
                      ? 'bg-prospect-green text-white'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                  title={isSaved ? 'Unsave' : 'Save'}
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all"
                  title="Close"
                >
                  <X className="w-5 h-5" style={{ color: '#1e293b' }} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-8">
              {/* Overview */}
              <section>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#475569' }}>
                  {career.description}
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#1e293b' }}>
                    A Day in the Life
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
                    {career.dayInTheLife}
                  </p>
                </div>
              </section>

              {/* RIASEC Match */}
              <section>
                <h3 className="text-lg font-bold mb-4 uppercase tracking-wide" style={{ color: '#1e293b' }}>
                  Your RIASEC Match
                </h3>
                <div className="grid grid-cols-6 gap-3">
                  {Object.entries(career.riasecMatch).map(([code, score]) => (
                    <div key={code} className="text-center">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-2"
                        style={{
                          backgroundColor: RIASEC_COLORS[code.charAt(0).toUpperCase()],
                          opacity: score > 50 ? 1 : 0.5,
                        }}
                      >
                        {code.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: '#1e293b' }}>
                        {score}%
                      </div>
                    </div>
                  ))}
                </div>
                {riasecEntries.length > 0 && (
                  <p className="text-xs mt-4 leading-relaxed" style={{ color: '#64748b' }}>
                    You scored high in <strong>{riasecEntries.map(([code]) => RIASEC_NAMES[code]).join(', ')}</strong> — this
                    career is an excellent match for your personality and interests.
                  </p>
                )}
              </section>

              {/* Education & Study Path */}
              <section>
                <h3 className="text-lg font-bold mb-4 uppercase tracking-wide" style={{ color: '#1e293b' }}>
                  How to Get There
                </h3>
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#1e293b' }}>
                      Matric Requirements
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-bold" style={{ color: '#1e293b' }}>Required Subjects:</p>
                        <p style={{ color: '#64748b' }}>{career.matricRequirements.requiredSubjects.join(', ')}</p>
                      </div>
                      {career.matricRequirements.recommendedSubjects.length > 0 && (
                        <div>
                          <p className="font-bold" style={{ color: '#1e293b' }}>Recommended Subjects:</p>
                          <p style={{ color: '#64748b' }}>{career.matricRequirements.recommendedSubjects.join(', ')}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-bold" style={{ color: '#1e293b' }}>Minimum APS Score:</p>
                        <p style={{ color: '#64748b' }}>{career.matricRequirements.minimumAps}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#1e293b' }}>
                      Study Options
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-bold mb-1" style={{ color: '#1e293b' }}>Primary Option</p>
                        <p style={{ color: '#64748b' }}>{career.studyPath.primaryOption}</p>
                        {career.studyPath.secondaryOption && (
                          <>
                            <p className="font-bold mb-1 mt-3" style={{ color: '#1e293b' }}>
                              Alternative Option
                            </p>
                            <p style={{ color: '#64748b' }}>{career.studyPath.secondaryOption}</p>
                          </>
                        )}
                      </div>
                      <div className="pt-4 border-t border-slate-200">
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>
                          Time to Qualify: {career.studyPath.timeToQualify}
                        </p>
                      </div>
                    </div>
                  </div>

                  {career.providers.universities || career.providers.tvetColleges ? (
                    <div className="bg-slate-50 rounded-2xl p-6 text-sm">
                      <h4 className="font-bold uppercase tracking-wider mb-4" style={{ color: '#1e293b' }}>
                        Where to Study
                      </h4>
                      {career.providers.universities && (
                        <div>
                          <p className="font-semibold mb-2" style={{ color: '#1e293b' }}>Universities:</p>
                          <p style={{ color: '#64748b' }}>{career.providers.universities.join(', ')}</p>
                        </div>
                      )}
                      {career.providers.tvetColleges && (
                        <div className={career.providers.universities ? 'mt-3 pt-3 border-t border-slate-200' : ''}>
                          <p className="font-semibold mb-2" style={{ color: '#1e293b' }}>TVET Colleges:</p>
                          <p style={{ color: '#64748b' }}>{career.providers.tvetColleges.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </section>

              {/* Job Market */}
              <section>
                <h3 className="text-lg font-bold mb-4 uppercase tracking-wide" style={{ color: '#1e293b' }}>
                  Job Market
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <TrendingUp className="w-5 h-5 mt-1" style={{ color: '#1B5E20' }} />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>
                          Demand & Growth
                        </p>
                        <p className="text-sm font-bold mb-1" style={{ color: '#1e293b' }}>
                          {career.jobDemand.growthOutlook}
                        </p>
                        <p className="text-xs" style={{ color: '#64748b' }}>
                          +{career.jobDemand.growthPercentage}% projected growth
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin className="w-5 h-5 mt-1" style={{ color: '#1B5E20' }} />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>
                          Top Locations
                        </p>
                        <p className="text-sm font-bold mb-1" style={{ color: '#1e293b' }}>
                          {career.jobLocations.hotspots.slice(0, 3).join(', ')}
                        </p>
                        <p className="text-xs" style={{ color: '#64748b' }}>
                          {career.jobLocations.remoteViable ? 'Remote-friendly' : 'Onsite work required'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-slate-50 rounded-2xl p-6 text-sm">
                  <p className="font-bold mb-2" style={{ color: '#1e293b' }}>Top Employers:</p>
                  <p style={{ color: '#64748b' }}>{career.topEmployers.join(', ')}</p>
                </div>
              </section>

              {/* Salary */}
              <section>
                <h3 className="text-lg font-bold mb-4 uppercase tracking-wide" style={{ color: '#1e293b' }}>
                  Salary Progression
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Entry Level', value: career.salary.entryLevel },
                    { label: 'Mid-Career', value: career.salary.midLevel },
                    { label: 'Senior', value: career.salary.senior },
                  ].map((item, i) => (
                    <div key={i} className="bg-gradient-to-br from-prospect-green/10 to-prospect-gold/10 rounded-2xl p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>
                        {item.label}
                      </p>
                      <p className="text-xl font-bold" style={{ color: '#1B5E20' }}>
                        R{(item.value / 1000).toFixed(0)}k
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                        per month
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section>
                <h3 className="text-lg font-bold mb-4 uppercase tracking-wide" style={{ color: '#1e293b' }}>
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-prospect-green/10 text-prospect-green text-xs font-bold uppercase tracking-wider rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Misconceptions */}
              {career.commonMisconceptions.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold mb-4 uppercase tracking-wide" style={{ color: '#1e293b' }}>
                    Common Misconceptions
                  </h3>
                  <div className="space-y-3">
                    {career.commonMisconceptions.map((misconception, i) => (
                      <div key={i} className="flex gap-3 bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                        <AlertCircle className="w-5 h-5 mt-0.5 text-yellow-600 shrink-0" />
                        <p className="text-sm" style={{ color: '#475569' }}>
                          {misconception}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Career Progression */}
              <section>
                <h3 className="text-lg font-bold mb-4 uppercase tracking-wide" style={{ color: '#1e293b' }}>
                  Career Growth Path
                </h3>
                <div className="space-y-3">
                  {[
                    { stage: 'Entry', role: career.careerProgression.entryRole },
                    { stage: 'Mid-Career', role: career.careerProgression.midRole },
                    { stage: 'Senior', role: career.careerProgression.seniorRole },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: '#1B5E20' }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>
                          {item.stage}
                        </p>
                        <p className="text-sm font-bold" style={{ color: '#1e293b' }}>
                          {item.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* CTAs */}
              <section className="border-t border-slate-100 pt-8">
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => onNavigate?.('library')}
                    className="w-full p-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ backgroundColor: '#1e293b' }}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Start Studying
                  </button>
                  <button
                    onClick={() => onNavigate?.('bursaries')}
                    className="w-full p-4 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all"
                    style={{ backgroundColor: '#F9A825', color: '#1e293b', borderColor: '#F9A825' }}
                  >
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    Find Bursaries
                  </button>
                </div>
              </section>

              {/* Related Careers */}
              {relatedCareers.length > 0 && (
                <section className="border-t border-slate-100 pt-8">
                  <h3 className="text-lg font-bold mb-4 uppercase tracking-wide" style={{ color: '#1e293b' }}>
                    Similar Careers
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {relatedCareers.slice(0, 2).map((relatedCareer) => (
                      <div
                        key={relatedCareer.id}
                        className="p-4 border border-slate-100 rounded-2xl hover:shadow-lg transition-all cursor-pointer hover:border-prospect-green"
                      >
                        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>
                          {relatedCareer.category}
                        </p>
                        <p className="text-sm font-bold mb-2" style={{ color: '#1e293b' }}>
                          {relatedCareer.title}
                        </p>
                        <p className="text-xs mb-3 line-clamp-2" style={{ color: '#64748b' }}>
                          {relatedCareer.description}
                        </p>
                        <button
                          onClick={() => onSelectCareer?.(relatedCareer)}
                          className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                          style={{ color: '#1B5E20' }}
                        >
                          View <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
