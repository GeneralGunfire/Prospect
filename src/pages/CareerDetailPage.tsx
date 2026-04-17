import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, MapPin, DollarSign, Users, Award, Book, Briefcase, Target, AlertCircle } from 'lucide-react';
import type { CareerFull, AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';

interface CareerDetailPageProps extends AuthedProps {
  careerId: string;
  allCareers: CareerFull[];
  onBackClick: () => void;
}

export function CareerDetailPage({ careerId, allCareers, user, onNavigate, onBackClick }: CareerDetailPageProps) {
  const career = allCareers.find(c => c.id === careerId);
  const [activeSection, setActiveSection] = useState<'overview' | 'pathway' | 'universities' | 'funding' | 'qualifications' | 'dayinlife'>('overview');

  if (!career) {
    return (
      <div className="min-h-screen bg-surface">
        <AppHeader currentPage="careers" user={user} onNavigate={onNavigate} mode="career" />
        <div className="pt-32 text-center">
          <p className="text-xl text-slate-600">Career not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader currentPage="careers" user={user} onNavigate={onNavigate} mode="career" />

      {/* Header */}
      <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        <motion.button
          onClick={onBackClick}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-8 transition"
          whileHover={{ x: -4 }}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Careers</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(100,116,139,0.1)' }}>
            <Briefcase className="w-5 h-5" style={{ color: '#64748b' }} />
            <span className="text-sm font-bold uppercase tracking-wide" style={{ color: '#64748b' }}>
              Career Exploration
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-4 uppercase tracking-tight" style={{ color: '#1e293b' }}>
            {career.title}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">{career.description}</p>
        </motion.div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-600">Entry Salary</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">R{career.salary.entryLevel.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-slate-600">Demand</span>
            </div>
            <p className="text-2xl font-bold capitalize text-slate-900">{career.jobDemand.level}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-slate-600">Growth</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{career.jobDemand.growthPercentage}%/year</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-red-600" />
              <span className="text-sm font-semibold text-slate-600">Top Locations</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{career.jobLocations.hotspots.slice(0, 2).join(', ')}</p>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-20 z-30 bg-white border-b border-slate-200 px-4">
        <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto">
          {['overview', 'pathway', 'universities', 'funding', 'qualifications', 'dayinlife'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section as any)}
              className={`px-6 py-4 font-semibold text-sm uppercase tracking-wide border-b-2 transition ${
                activeSection === section
                  ? 'text-slate-900 border-slate-900'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              {section.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="pt-12 pb-16 px-4 max-w-6xl mx-auto">
        {/* Overview */}
        {activeSection === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e293b' }}>Career Overview</h2>
              <p className="text-lg text-slate-600 mb-6">{career.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Top Employers
                  </h3>
                  <ul className="space-y-2">
                    {career.topEmployers.map((employer, i) => (
                      <li key={i} className="text-slate-700">✓ {employer}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Key Skills
                  </h3>
                  <ul className="space-y-2">
                    {career.skills.slice(0, 5).map((skill, i) => (
                      <li key={i} className="text-slate-700">✓ {skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pathway */}
        {activeSection === 'pathway' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#1e293b' }}>School to Career Pathway</h2>

              <div className="space-y-6">
                {/* Step 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">High School (Grades 10-12)</h3>
                      <p className="text-slate-700 mb-3">Required Subjects: {career.matricRequirements.requiredSubjects.join(', ')}</p>
                      <p className="text-sm text-slate-600">Minimum APS Score Required: <span className="font-bold text-slate-900">{career.matricRequirements.minimumAps}+</span></p>
                      <p className="text-sm text-slate-600 mt-2">Focus: Achieve strong marks in {career.matricRequirements.requiredSubjects.join(' and ')}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Tertiary Education</h3>
                      <p className="text-slate-700 mb-3">{career.studyPath.primaryOption}</p>
                      <p className="text-sm text-slate-600">Duration: {career.studyPath.timeToQualify}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-green-50 rounded-xl p-6 border-2 border-green-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Job Entry</h3>
                      <p className="text-slate-700 mb-3">Entry-Level Position: {career.careerProgression.entryRole}</p>
                      <p className="text-sm text-slate-600">Starting Salary: R{career.salary.entryLevel.toLocaleString()}</p>
                      <p className="text-sm text-slate-600 mt-2">Key employers: {career.topEmployers.slice(0, 2).join(', ')}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Step 4 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Career Growth</h3>
                      <p className="text-slate-700 mb-3">Senior Position: {career.careerProgression.seniorRole}</p>
                      <p className="text-sm text-slate-600">Senior Salary: R{career.salary.senior.toLocaleString()}</p>
                      <p className="text-sm text-slate-600 mt-2">Growth trajectory: Approximately {career.jobDemand.growthPercentage}% annual growth</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Universities Section */}
        {activeSection === 'universities' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e293b' }}>Universities & Institutions</h2>
              <p className="text-slate-600 mb-6">Study Path: {career.studyPath.primaryOption}</p>

              <div className="bg-slate-50 rounded-xl p-8">
                <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  Recommended Institutions in South Africa
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {career.providers.universities?.map((uni, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-slate-700">{uni}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {career.category === 'trades' && (
                <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    TVET College Path
                  </h3>
                  <p className="text-slate-700">This is a hands-on trade requiring practical training at TVET colleges or through apprenticeships. Look for TVET colleges near your province offering this qualification.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Funding Section */}
        {activeSection === 'funding' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e293b' }}>Funding & Bursaries</h2>

              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">NSFAS Eligibility</h3>
                  <p className="text-slate-700">
                    {career.nsfasEligible
                      ? 'This career qualifies for NSFAS funding. Apply at www.nsfas.org.za'
                      : 'This career may have limited NSFAS eligibility. Check with specific institutions.'}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Industry Bursaries</h3>
                  <p className="text-slate-700 mb-3">Bursaries offered by: {career.relevantBursaries.join(', ')}</p>
                  <p className="text-sm text-slate-600">Many employers in this field offer bursaries to promising students. Research companies and contact their HR departments directly.</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Other Funding Options</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>✓ Student loans from commercial banks</li>
                    <li>✓ University scholarships based on academic merit</li>
                    <li>✓ Bursaries from professional associations</li>
                    <li>✓ Government learnership programs (for trades)</li>
                    <li>✓ Company internship programs with stipends</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Qualifications Section */}
        {activeSection === 'qualifications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e293b' }}>External Qualifications & Certifications</h2>

              <div className="space-y-4">
                <div className="bg-indigo-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Professional Certifications</h3>
                  <ul className="space-y-3 text-slate-700">
                    {career.id === 'data-scientist' && (
                      <>
                        <li>✓ Microsoft Power BI Certification (PL-300)</li>
                        <li>✓ Google Analytics Certification</li>
                        <li>✓ Tableau Desktop Specialist</li>
                        <li>✓ AWS Certified Data Analytics – Specialty</li>
                      </>
                    )}
                    {career.id === 'software-engineer' && (
                      <>
                        <li>✓ AWS Certified Developer Associate</li>
                        <li>✓ Google Cloud Professional Cloud Architect</li>
                        <li>✓ Docker Certified Associate</li>
                        <li>✓ Kubernetes Application Developer (CKAD)</li>
                      </>
                    )}
                    {career.id === 'cybersecurity-analyst' && (
                      <>
                        <li>✓ CompTIA Security+ Certification</li>
                        <li>✓ CEH (Certified Ethical Hacker)</li>
                        <li>✓ CISSP (Certified Information Systems Security Professional)</li>
                        <li>✓ Certified Information Security Manager (CISM)</li>
                      </>
                    )}
                    {!['data-scientist', 'software-engineer', 'cybersecurity-analyst'].includes(career.id) && (
                      <>
                        <li>✓ Industry-specific professional certifications</li>
                        <li>✓ Advanced specialized diplomas</li>
                        <li>✓ Professional registration where applicable</li>
                        <li>✓ Continuing professional development (CPD) courses</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Academic Requirements for Hiring</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>✓ Minimum APS Score: {career.matricRequirements.minimumAps}+</li>
                    <li>✓ Key Subjects: {career.matricRequirements.requiredSubjects.join(', ')}</li>
                    <li>✓ University Degree/Qualification: {career.studyPath.nqfLevel > 8 ? 'Bachelor or Higher' : 'Diploma/Certificate or Higher'}</li>
                    <li>✓ GPA/Academic Performance: Typically 60%+ for competitive roles</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Day in Life Section */}
        {activeSection === 'dayinlife' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e293b' }}>A Day in the Life</h2>

              <div className="bg-slate-50 rounded-xl p-8 mb-6">
                <p className="text-lg text-slate-700 leading-relaxed">{career.dayInTheLife}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Typical Daily Activities</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Core work responsibilities aligned with job title',
                    'Collaboration with team members and stakeholders',
                    'Problem-solving and critical thinking tasks',
                    'Documentation and reporting work',
                    'Continuous learning and skill development',
                    'Client or internal customer communication',
                  ].map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-lg p-4 border-l-4 border-blue-600"
                    >
                      <p className="text-slate-700">• {activity}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-8 bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-3">Portfolio Projects You Could Build</h3>
                <ul className="space-y-2 text-slate-700">
                  {career.id === 'data-scientist' && (
                    <>
                      <li>✓ Build a predictive analytics dashboard using Power BI</li>
                      <li>✓ Create a customer segmentation analysis project</li>
                      <li>✓ Develop a time-series forecasting model for real data</li>
                      <li>✓ Build an interactive data exploration tool</li>
                    </>
                  )}
                  {career.id === 'software-engineer' && (
                    <>
                      <li>✓ Build a full-stack web application</li>
                      <li>✓ Create a mobile app with API integration</li>
                      <li>✓ Deploy microservices on cloud infrastructure</li>
                      <li>✓ Contribute to open-source projects on GitHub</li>
                    </>
                  )}
                  {career.id === 'cybersecurity-analyst' && (
                    <>
                      <li>✓ Set up and manage a home lab network</li>
                      <li>✓ Conduct vulnerability assessments and penetration testing</li>
                      <li>✓ Build incident response documentation</li>
                      <li>✓ Create security awareness training materials</li>
                    </>
                  )}
                  {!['data-scientist', 'software-engineer', 'cybersecurity-analyst'].includes(career.id) && (
                    <>
                      <li>✓ Real-world projects aligned with the career field</li>
                      <li>✓ Case studies demonstrating problem-solving ability</li>
                      <li>✓ Evidence of technical skill development</li>
                      <li>✓ Internship experience documentation</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default CareerDetailPage;
