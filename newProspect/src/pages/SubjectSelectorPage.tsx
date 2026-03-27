import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle2, AlertCircle, Info, ArrowRight, Briefcase, GraduationCap, Star } from 'lucide-react';
import { subjects, Subject } from '../data/subjects';
import { careers, Career } from '../data/careers';
import { cn } from '../lib/utils';

export const SubjectSelectorPage: React.FC = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isGrade9, setIsGrade9] = useState(true);

  const toggleSubject = (id: string) => {
    if (selectedSubjects.includes(id)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== id));
    } else {
      if (selectedSubjects.length < 7) {
        setSelectedSubjects([...selectedSubjects, id]);
      }
    }
  };

  const matchedCareers = useMemo(() => {
    if (selectedSubjects.length === 0) return [];
    
    return careers.filter(career => {
      // A career is matched if ALL its required subjects are in the selected list
      // Note: This is a simplified logic for the dummy app
      return career.subjects.every(reqSub => 
        selectedSubjects.some(selSub => 
          subjects.find(s => s.id === selSub)?.name.toLowerCase().includes(reqSub.toLowerCase())
        )
      );
    }).sort((a, b) => b.aps - a.aps);
  }, [selectedSubjects]);

  const coreSubjects = subjects.filter(s => s.category === 'Core');
  const electiveSubjects = subjects.filter(s => s.category === 'Elective');

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy/5 rounded-full mb-6">
          <BookOpen className="w-4 h-4 text-navy" />
          <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Subject Selection Tool</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6 uppercase tracking-tight">
          Choose the <span className="text-secondary">Right Path</span>
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base leading-relaxed font-normal">
          Grade 9 is a critical turning point. Use this tool to see how your subject choices impact your future career options and university eligibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Selection Section */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em]">Select Your Subjects</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Selected:</span>
                <span className={cn(
                  "text-sm font-bold",
                  selectedSubjects.length === 7 ? "text-green-600" : "text-secondary"
                )}>
                  {selectedSubjects.length} / 7
                </span>
              </div>
            </div>

            <div className="space-y-10">
              {/* Core Subjects */}
              <div>
                <h4 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-6">Core Subjects (Pick 4)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coreSubjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all flex items-center justify-between group",
                        selectedSubjects.includes(subject.id)
                          ? "bg-navy border-navy text-white"
                          : "bg-white border-slate-100 text-navy hover:border-secondary"
                      )}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider">{subject.name}</span>
                      {selectedSubjects.includes(subject.id) ? (
                        <CheckCircle2 className="w-4 h-4 text-secondary" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-200 group-hover:border-secondary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Elective Subjects */}
              <div>
                <h4 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-6">Elective Subjects (Pick 3)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {electiveSubjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all flex items-center justify-between group",
                        selectedSubjects.includes(subject.id)
                          ? "bg-navy border-navy text-white"
                          : "bg-white border-slate-100 text-navy hover:border-secondary"
                      )}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider">{subject.name}</span>
                      {selectedSubjects.includes(subject.id) ? (
                        <CheckCircle2 className="w-4 h-4 text-secondary" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-200 group-hover:border-secondary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-8 bg-navy/5 rounded-3xl flex gap-6 border border-navy/10">
            <Info className="w-6 h-6 text-navy shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-navy mb-2 uppercase tracking-tight">Pro Tip: Mathematics vs. Maths Literacy</h4>
              <p className="text-xs text-navy/70 leading-relaxed">
                Choosing Mathematics (Pure) is required for most STEM, Medical, and Finance careers. Mathematical Literacy is accepted for Humanities, Arts, and many Social Science degrees. Choose wisely based on your career goals!
              </p>
            </div>
          </div>
        </div>

        {/* Impact Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            {/* Career Match Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-[10px] font-bold text-navy uppercase tracking-[0.2em] mb-8 flex items-center justify-between">
                Career Matches
                <span className="text-secondary">{matchedCareers.length} Found</span>
              </h3>
              
              <div className="space-y-6">
                {matchedCareers.length > 0 ? (
                  matchedCareers.slice(0, 5).map(career => (
                    <Link 
                      key={career.id} 
                      to={`/careers/${career.id}`}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
                    >
                      <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                        <Star className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-grow">
                        <div className="text-xs font-bold text-navy group-hover:text-secondary transition-colors">{career.title}</div>
                        <div className="text-[9px] text-secondary font-bold uppercase tracking-widest">{career.category}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-navy/20 group-hover:text-secondary transition-colors" />
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs text-secondary font-medium">Select subjects to see matching careers.</p>
                  </div>
                )}
              </div>

              {matchedCareers.length > 5 && (
                <Link to="/careers" className="w-full mt-8 py-4 border border-slate-100 rounded-xl text-[10px] font-bold text-navy uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  Explore All Matches
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* University Eligibility */}
            <div className="bg-navy rounded-3xl p-8 text-white shadow-xl shadow-navy/20">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-8">Eligibility Alert</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold mb-1 uppercase tracking-wider">Bachelor Degree</h4>
                    <p className="text-[10px] text-white/60 leading-relaxed">
                      Requires at least 4 subjects at Level 4 (50%+) from the designated list.
                    </p>
                  </div>
                </div>
                
                {selectedSubjects.includes('maths-lit') && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-[10px] text-red-100 leading-relaxed">
                      Maths Literacy will exclude you from Engineering, Medicine, and most Science degrees.
                    </p>
                  </div>
                )}

                {!selectedSubjects.includes('phys-sci') && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex gap-3">
                    <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
                    <p className="text-[10px] text-orange-100 leading-relaxed">
                      Physical Sciences is required for all Engineering and most Medical degrees.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
