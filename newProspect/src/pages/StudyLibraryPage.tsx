import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Play, CheckCircle2, Star, Clock, ArrowRight, Library, ChevronLeft, GraduationCap, Calendar } from 'lucide-react';
import { subjects } from '../data/subjects';
import { cn } from '../lib/utils';

type SelectionStep = 'subject' | 'grade' | 'term';

export const StudyLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [step, setStep] = useState<SelectionStep>('subject');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubjectSelect = (id: string) => {
    setSelectedSubject(id);
    setStep('grade');
  };

  const handleGradeSelect = (grade: number) => {
    setSelectedGrade(grade);
    setStep('term');
  };

  const handleTermSelect = (term: number) => {
    if (selectedSubject && selectedGrade) {
      navigate(`/library/${selectedSubject}/${selectedGrade}/${term}`);
    }
  };

  const goBack = () => {
    if (step === 'grade') setStep('subject');
    if (step === 'term') setStep('grade');
  };

  const currentSubjectName = subjects.find(s => s.id === selectedSubject)?.name;

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy/5 rounded-full mb-6">
          <Library className="w-4 h-4 text-navy" />
          <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Digital Study Library</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6 uppercase tracking-tight">
          Master Your <span className="text-secondary">Subjects</span>
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base leading-relaxed font-normal">
          Access high-quality study materials, video lessons, and practice questions for all South African CAPS subjects.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'subject' && (
          <motion.div
            key="subject-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-16 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                type="text"
                placeholder="Search for a subject (e.g. Mathematics, History)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-navy focus:border-secondary transition-all outline-none shadow-sm"
              />
            </div>

            {/* Subject Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSubjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectSelect(subject.id)}
                  className="group bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-secondary transition-all duration-300 flex flex-col text-left"
                >
                  <div className="w-12 h-12 bg-navy/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/10 transition-colors">
                    <BookOpen className="w-6 h-6 text-navy group-hover:text-secondary transition-colors" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-secondary transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-6">
                    {subject.category} Subject
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-navy/40">
                      <div className="flex items-center gap-2">
                        <Play className="w-3 h-3 text-secondary" />
                        12 Lessons
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-secondary" />
                        4.5 Hours
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-navy/40 uppercase tracking-widest">Select Subject</span>
                      <ArrowRight className="w-4 h-4 text-secondary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'grade' && (
          <motion.div
            key="grade-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <button 
              onClick={goBack}
              className="flex items-center gap-2 text-[10px] font-bold text-navy uppercase tracking-widest mb-8 hover:text-secondary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Subjects
            </button>
            <h2 className="text-2xl font-bold text-navy mb-2 uppercase tracking-tight">Select Your Grade</h2>
            <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-12">Subject: {currentSubjectName}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[10, 11, 12].map((grade) => (
                <button
                  key={grade}
                  onClick={() => handleGradeSelect(grade)}
                  className="group bg-white border border-slate-100 rounded-3xl p-10 shadow-sm hover:shadow-xl hover:border-secondary transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/10 transition-colors">
                    <GraduationCap className="w-8 h-8 text-navy group-hover:text-secondary transition-colors" />
                  </div>
                  <h3 className="text-3xl font-bold text-navy mb-2 group-hover:text-secondary transition-colors">Grade {grade}</h3>
                  <p className="text-on-surface-variant text-xs font-medium">CAPS Curriculum</p>
                  <div className="mt-8 pt-6 border-t border-slate-50 w-full flex items-center justify-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Select Grade <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'term' && (
          <motion.div
            key="term-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <button 
              onClick={goBack}
              className="flex items-center gap-2 text-[10px] font-bold text-navy uppercase tracking-widest mb-8 hover:text-secondary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Grade Selection
            </button>
            <h2 className="text-2xl font-bold text-navy mb-2 uppercase tracking-tight">Select Term</h2>
            <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-12">
              Subject: {currentSubjectName} • Grade {selectedGrade}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((term) => (
                <button
                  key={term}
                  onClick={() => handleTermSelect(term)}
                  className="group bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-secondary transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 bg-navy/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/10 transition-colors">
                    <Calendar className="w-6 h-6 text-navy group-hover:text-secondary transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-1 group-hover:text-secondary transition-colors">Term {term}</h3>
                  <p className="text-on-surface-variant text-[10px] font-medium uppercase tracking-wider">Quarter {term}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Section - Only show on subject step */}
      {step === 'subject' && (
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-navy rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-6">
                <Star className="w-3 h-3 text-secondary fill-secondary" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Featured Course</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 uppercase tracking-tight leading-tight">Mathematics Paper 1 <br/>Masterclass</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-md">
                A comprehensive guide to acing your final Mathematics exam. Covers Algebra, Calculus, and Functions in detail.
              </p>
              <button className="bg-secondary text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2">
                Enroll Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-navy uppercase tracking-tight">Recent Study Guides</h3>
            {[
              { title: 'English HL: Poetry Analysis', type: 'PDF Guide', date: '2 days ago' },
              { title: 'Physical Sciences: Newton\'s Laws', type: 'Video Lesson', date: '5 days ago' },
              { title: 'Accounting: Financial Statements', type: 'Practice Quiz', date: '1 week ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-secondary transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy group-hover:text-secondary transition-colors">{item.title}</h4>
                    <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">{item.type} • {item.date}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-navy/20 group-hover:text-secondary transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
