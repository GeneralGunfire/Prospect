import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { getTopMatchingCareers } from '../data/subjectCareerMapping';
import { getSubjectRequirements, apsScoreGuide } from '../data/universityRequirements';
import { getTopTVETCareers } from '../data/tvetCareers';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import { careers } from '../data/careers';
import AppHeader from '../components/AppHeader';

const GRADE_10_SUBJECTS = [
  'Mathematics',
  'Physical Sciences',
  'Life Sciences',
  'Accounting',
  'Business Studies',
  'Economics',
  'CAT',
  'EGD',
  'English Home Language',
];

function Grade10SubjectSelectorPage({ user, onNavigate }: AuthedProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const matchingCareers = useMemo(() => {
    if (selectedSubjects.length === 0) return [];
    const careerNames = getTopMatchingCareers(selectedSubjects, 10);
    return careers.filter(c => careerNames.includes(c.name));
  }, [selectedSubjects]);

  const tvetCareers = useMemo(() => {
    if (selectedSubjects.length === 0) return [];
    return getTopTVETCareers(selectedSubjects, 6);
  }, [selectedSubjects]);

  const subjectRequirements = useMemo(() => {
    if (selectedSubjects.length === 0) return [];
    return selectedSubjects.map(subject => ({
      subject,
      requirements: getSubjectRequirements(subject),
    }));
  }, [selectedSubjects]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader currentPage="subject-selector" user={user} onNavigate={onNavigate} mode="career" />

      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(30,41,59,0.05)' }}>
            <BookOpen className="w-4 h-4 text-slate-900" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Subject Selection</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
            Explore Careers by <span className="text-prospect-green">Subject</span>
          </h1>
          <p className="text-sm mt-2 text-slate-500">
            Select your Grade 10 subjects to see matching career paths and university requirements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Subject Selection */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-slate-100 rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-slate-900">
                Select Your Subjects
              </h3>
              <div className="space-y-3">
                {GRADE_10_SUBJECTS.map(subject => (
                  <button
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className="w-full flex items-center gap-3 cursor-pointer group text-left hover:bg-slate-50 p-2 rounded-lg transition-colors"
                  >
                    <div
                      className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0"
                      style={{
                        borderColor: selectedSubjects.includes(subject) ? '#1e293b' : '#cbd5e1',
                        backgroundColor: selectedSubjects.includes(subject) ? '#1e293b' : 'white',
                      }}
                    >
                      {selectedSubjects.includes(subject) && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span
                      className="text-sm font-medium transition-colors group-hover:text-prospect-green flex-1 text-slate-900"
                    >
                      {subject}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">
                  Selected: {selectedSubjects.length}
                </p>
                {selectedSubjects.length > 0 && (
                  <button
                    onClick={() => setSelectedSubjects([])}
                    className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10">
            {selectedSubjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center"
              >
                <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-slate-900">
                  No Subjects Selected
                </h3>
                <p className="text-sm mb-6 text-slate-500">
                  Select subjects from the sidebar to discover matching careers and university requirements
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={() => onNavigate('quiz')}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all"
                    style={{ backgroundColor: '#1e293b' }}
                  >
                    Take Quiz
                  </button>
                  <button
                    onClick={() => onNavigate('library')}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border border-slate-200 transition-all text-slate-900"
                  >
                    Study Library
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Matching Careers Section */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between items-end mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 text-slate-900">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1e293b' }} />
                      Matching Careers
                    </h3>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      {matchingCareers.length} results
                    </span>
                  </div>
                  {matchingCareers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {matchingCareers.map((career, idx) => (
                        <motion.div
                          key={career.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
                          onClick={() => onNavigate('careers' as any)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-sm font-bold flex-1 group-hover:text-prospect-green transition-colors text-slate-900">
                              {career.name}
                            </h4>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-prospect-green transition-colors ml-2" />
                          </div>
                          <p className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500">
                            {career.sector || 'Professional'}
                          </p>
                          <p className="text-xs leading-relaxed text-slate-500">
                            {career.description?.substring(0, 100)}...
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
                      <p className="text-sm text-slate-500">No matching careers found for your selection</p>
                    </div>
                  )}
                </motion.section>

                {/* University Requirements Section */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 mb-6 text-slate-900">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1e293b' }} />
                    University Requirements
                  </h3>
                  <div className="space-y-4">
                    {subjectRequirements.map((item, idx) => (
                      <motion.div
                        key={item.subject}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + idx * 0.05 }}
                        className="bg-white border border-slate-100 rounded-2xl p-6"
                      >
                        <h4 className="text-sm font-bold mb-4 text-slate-900">
                          {item.subject}
                        </h4>
                        {item.requirements.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {item.requirements.map(req => (
                              <div
                                key={req.degreeType}
                                className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                              >
                                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-slate-900">
                                  {req.degreeType}
                                </p>
                                <p className="text-xs mb-2 font-bold text-slate-900">
                                  Min Mark: {req.minMark}%
                                </p>
                                <p className="text-xs text-slate-500">
                                  {req.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">No specific requirements found</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* TVET Careers Section */}
                {tvetCareers.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex justify-between items-end mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 text-slate-900">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1e293b' }} />
                        TVET Pathways
                      </h3>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        {tvetCareers.length} options
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tvetCareers.map((career, idx) => (
                        <motion.div
                          key={career.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 + idx * 0.05 }}
                          className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
                          onClick={() => onNavigate('tvet-careers' as any)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-sm font-bold flex-1 group-hover:text-prospect-green transition-colors text-slate-900">
                              {career.name}
                            </h4>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-prospect-green transition-colors ml-2" />
                          </div>
                          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">
                            {career.duration} • {career.jobDemand} Demand
                          </p>
                          <p className="text-xs leading-relaxed mb-4 text-slate-500">
                            {career.description}
                          </p>
                          <p className="text-xs font-bold text-slate-900">
                            {career.salaryRange}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* APS Score Guide Section */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 mb-6 text-slate-900">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1e293b' }} />
                    APS Score Guide
                  </h3>
                  <div className="bg-white border border-slate-100 rounded-2xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {apsScoreGuide.map((guide, idx) => (
                        <div key={idx} className="border-l-4 pl-4" style={{ borderColor: '#1e293b' }}>
                          <p className="text-xs font-bold uppercase tracking-widest mb-1 text-slate-900">
                            {guide.score} Points
                          </p>
                          <p className="text-sm font-bold mb-2 text-slate-900">
                            {guide.grade}
                          </p>
                          <p className="text-xs text-slate-500">
                            {guide.qualification}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.section>

                {/* CTA Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex gap-4 justify-center flex-wrap"
                >
                  <button
                    onClick={() => onNavigate('quiz')}
                    className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all hover:shadow-lg"
                    style={{ backgroundColor: '#1e293b' }}
                  >
                    Take Quiz
                  </button>
                  <button
                    onClick={() => onNavigate('library')}
                    className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest border border-slate-200 transition-all hover:bg-slate-50 text-slate-900"
                  >
                    Study Library
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Grade10SubjectSelectorPage);
