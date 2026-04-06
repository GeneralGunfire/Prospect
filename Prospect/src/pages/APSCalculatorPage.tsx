import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator, Info, GraduationCap, CheckCircle2, AlertCircle, Search, ArrowRight } from 'lucide-react';
import { subjects } from '../data/subjects';
import { universities } from '../data/universities';
import { careers } from '../data/careers';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { cn } from '../lib/utils';

interface SubjectMark {
  subjectId: string;
  mark: number;
}

export const APSCalculatorPage: React.FC = () => {
  const [selectedMarks, setSelectedMarks] = useLocalStorage<SubjectMark[]>('prospect_sa_aps_marks', [
    { subjectId: 'english-hl', mark: 0 },
    { subjectId: 'maths', mark: 0 },
    { subjectId: 'life-orientation', mark: 0 },
    { subjectId: '', mark: 0 },
    { subjectId: '', mark: 0 },
    { subjectId: '', mark: 0 },
    { subjectId: '', mark: 0 },
  ]);

  const calculatePoints = (mark: number) => {
    if (mark >= 80) return 7;
    if (mark >= 70) return 6;
    if (mark >= 60) return 5;
    if (mark >= 50) return 4;
    if (mark >= 40) return 3;
    if (mark >= 30) return 2;
    if (mark >= 0) return 1;
    return 0;
  };

  const totalAPS = useMemo(() => {
    return selectedMarks.reduce((acc, curr) => acc + calculatePoints(curr.mark), 0);
  }, [selectedMarks]);

  // LO is usually excluded or halved by some universities, but for simplicity we'll show the standard 7-subject APS
  const apsWithoutLO = useMemo(() => {
    const loMark = selectedMarks.find(m => m.subjectId === 'life-orientation');
    return totalAPS - (loMark ? calculatePoints(loMark.mark) : 0);
  }, [totalAPS, selectedMarks]);

  const handleMarkChange = (index: number, field: 'subjectId' | 'mark', value: string | number) => {
    const newMarks = [...selectedMarks];
    newMarks[index] = { ...newMarks[index], [field]: value };
    setSelectedMarks(newMarks);
  };

  const qualifiedUniversities = useMemo(() => {
    return universities.filter(uni => totalAPS >= uni.minAPS).sort((a, b) => b.minAPS - a.minAPS);
  }, [totalAPS]);

  const qualifiedCareers = useMemo(() => {
    return careers.filter(career => totalAPS >= career.aps).sort((a, b) => b.aps - a.aps);
  }, [totalAPS]);

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Calculator Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
              <Calculator className="text-secondary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-navy uppercase tracking-tight">APS Calculator</h1>
              <p className="text-secondary text-xs font-bold uppercase tracking-widest">Admission Point Score</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm mb-8">
            <div className="grid grid-cols-12 gap-4 mb-6 px-4">
              <div className="col-span-8 text-[10px] font-bold text-navy/40 uppercase tracking-widest">Subject</div>
              <div className="col-span-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest text-center">Mark %</div>
              <div className="col-span-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest text-center">Points</div>
            </div>

            <div className="space-y-4">
              {selectedMarks.map((markObj, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="col-span-8">
                    <select
                      value={markObj.subjectId}
                      onChange={(e) => handleMarkChange(index, 'subjectId', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-navy focus:border-secondary transition-all outline-none"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={markObj.mark || ''}
                      onChange={(e) => handleMarkChange(index, 'mark', parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2 py-3 text-sm font-bold text-navy text-center focus:border-secondary transition-all outline-none"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="w-10 h-10 bg-navy/5 rounded-lg flex items-center justify-center text-navy font-bold text-sm">
                      {calculatePoints(markObj.mark)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-navy/5 rounded-2xl flex gap-4 border border-navy/10">
              <Info className="w-5 h-5 text-navy shrink-0" />
              <p className="text-xs text-navy/70 leading-relaxed">
                Most universities calculate APS using your best 6 subjects, excluding Life Orientation. However, some include LO at half value or full value. We show both for your reference.
              </p>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            {/* Score Card */}
            <div className="bg-navy rounded-3xl p-8 text-white shadow-xl shadow-navy/20 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-8">Your Results</h3>
                <div className="flex items-end gap-4 mb-8">
                  <div className="text-6xl font-bold tracking-tighter leading-none">{totalAPS}</div>
                  <div className="pb-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total APS</div>
                    <div className="text-xs font-bold text-secondary">Level {Math.floor(totalAPS / 7)} Avg</div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Excl. Life Orientation</span>
                  <span className="text-xl font-bold text-secondary">{apsWithoutLO}</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 rounded-full blur-[80px] -mr-24 -mt-24" />
            </div>

            {/* University Qualification */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-[10px] font-bold text-navy uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                University Match
                <span className="text-secondary">{qualifiedUniversities.length} Found</span>
              </h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {qualifiedUniversities.length > 0 ? (
                  qualifiedUniversities.map(uni => (
                    <div key={uni.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-navy">{uni.name}</div>
                        <div className="text-[9px] text-secondary font-bold uppercase tracking-widest">{uni.location}</div>
                      </div>
                      <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                        {uni.minAPS} APS
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-xs text-secondary font-medium">No matches yet. Keep entering marks!</p>
                  </div>
                )}
              </div>
              {qualifiedUniversities.length > 0 && (
                <button className="w-full mt-6 py-3 border border-slate-100 rounded-xl text-[10px] font-bold text-navy uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  View All Institutions
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Career Qualification */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-[10px] font-bold text-navy uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                Career Eligibility
                <span className="text-secondary">{qualifiedCareers.length} Found</span>
              </h3>
              <div className="space-y-4">
                {qualifiedCareers.slice(0, 4).map(career => (
                  <div key={career.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-navy">{career.title}</div>
                      <div className="text-[9px] text-secondary font-bold uppercase tracking-widest">Min APS: {career.aps}</div>
                    </div>
                  </div>
                ))}
                {qualifiedCareers.length > 4 && (
                  <p className="text-[10px] text-center text-navy/40 font-bold uppercase tracking-widest pt-2">
                    + {qualifiedCareers.length - 4} more careers
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
