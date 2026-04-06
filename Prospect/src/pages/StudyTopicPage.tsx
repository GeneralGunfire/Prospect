import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Clock, 
  Star,
  Lock,
  Unlock,
  Bookmark
} from 'lucide-react';
import { subjects } from '../data/subjects';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { cn } from '../lib/utils';

export const StudyTopicPage: React.FC = () => {
  const { subjectId, grade, term } = useParams<{ subjectId: string; grade: string; term: string }>();
  const navigate = useNavigate();
  const [completedLessons, setCompletedLessons] = useLocalStorage<string[]>('prospect_sa_completed_lessons', []);
  const [savedLessons, setSavedLessons] = useLocalStorage<string[]>('prospect_sa_saved_lessons', []);
  const [activeLesson, setActiveLesson] = useState(0);

  const subject = subjects.find(s => s.id === subjectId);

  const lessons = [
    { id: 'l1', title: 'Introduction & Overview', duration: '15:20', type: 'video' },
    { id: 'l2', title: 'Core Concepts & Definitions', duration: '25:45', type: 'video' },
    { id: 'l3', title: 'Practical Applications', duration: '10:15', type: 'reading' },
    { id: 'l4', title: 'Problem Solving Strategies', duration: '30:00', type: 'video' },
    { id: 'l5', title: 'Common Exam Questions', duration: '20:30', type: 'video' },
    { id: 'l6', title: 'Topic Summary & Quiz', duration: '15:00', type: 'quiz' },
  ];

  const toggleComplete = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter(id => id !== lessonId));
    } else {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const toggleSaveLesson = () => {
    const lessonId = lessons[activeLesson].id;
    if (savedLessons.includes(lessonId)) {
      setSavedLessons(savedLessons.filter(id => id !== lessonId));
    } else {
      setSavedLessons([...savedLessons, lessonId]);
    }
  };

  if (!subject) {
    return (
      <div className="pt-32 pb-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-navy mb-4">Subject Not Found</h2>
        <Link to="/library" className="text-secondary font-bold uppercase tracking-widest">Back to Library</Link>
      </div>
    );
  }

  const progress = (completedLessons.filter(id => lessons.some(l => l.id === id)).length / lessons.length) * 100;

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-8 text-[10px] font-bold uppercase tracking-widest text-navy/40">
        <Link to="/library" className="hover:text-secondary transition-colors">Library</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="hover:text-secondary transition-colors cursor-pointer" onClick={() => navigate('/library')}>{subject.name}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-secondary">Grade {grade} • Term {term}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2 uppercase tracking-tight">{subject.name}</h1>
            <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-4">Grade {grade} • Term {term} Curriculum</p>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-secondary">
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{lessons.length} Lessons</span>
              </div>
              <div className="flex items-center gap-2 text-secondary">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">4.5 Hours Total</span>
              </div>
              <div className="flex items-center gap-2 text-secondary">
                <Star className="w-4 h-4 fill-secondary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">4.9 (1.2k Reviews)</span>
              </div>
            </div>
          </div>

          {/* Video Player Placeholder */}
          <div className="aspect-video bg-navy rounded-3xl mb-10 flex flex-col items-center justify-center text-white relative overflow-hidden group cursor-pointer">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center shadow-2xl shadow-secondary/40 group-hover:scale-110 transition-transform relative z-10">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
            <p className="mt-6 text-sm font-bold uppercase tracking-widest relative z-10">Play Lesson: {lessons[activeLesson].title}</p>
            <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-60" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
              <div className="h-full bg-secondary w-1/3" />
            </div>
          </div>

          {/* Lesson Description */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-xl font-bold text-navy uppercase tracking-tight">About this Lesson</h3>
              <button
                onClick={toggleSaveLesson}
                className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest hover:opacity-70 transition-all group"
                data-testid="bookmark-button"
              >
                <Bookmark className={cn("w-4 h-4 transition-all", savedLessons.includes(lessons[activeLesson].id) && "fill-secondary")} />
                {savedLessons.includes(lessons[activeLesson].id) ? 'Saved' : 'Save Lesson'}
              </button>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
              In this lesson, we explore the fundamental principles of {subject.name}. We'll cover the core concepts that form the foundation of the CAPS curriculum, focusing on practical examples and problem-solving techniques that frequently appear in final examinations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-navy/5 rounded-2xl border border-navy/10">
                <h4 className="text-[10px] font-bold text-navy uppercase tracking-[0.2em] mb-4">Key Takeaways</h4>
                <ul className="space-y-3">
                  {['Understand core definitions', 'Master basic formulas', 'Apply theory to problems'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-medium text-navy/70">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
                <h4 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4">Resources</h4>
                <ul className="space-y-3">
                  {['Download PDF Summary', 'Practice Worksheet', 'Formula Sheet'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-medium text-secondary">
                      <FileText className="w-4 h-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Lesson List */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-1">Course Progress</h3>
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">{Math.round(progress)}% Complete</p>
                </div>
                <div className="text-right">
                  <span className="text-navy font-bold text-lg">{completedLessons.filter(id => lessons.some(l => l.id === id)).length}</span>
                  <span className="text-secondary text-xs font-medium"> / {lessons.length}</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden mb-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-secondary"
                />
              </div>

              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div 
                    key={lesson.id}
                    onClick={() => setActiveLesson(index)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer group",
                      activeLesson === index 
                        ? "bg-navy border-navy text-white" 
                        : "bg-white border-slate-100 hover:border-secondary"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleComplete(lesson.id);
                        }}
                        className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                          completedLessons.includes(lesson.id)
                            ? "bg-secondary text-white"
                            : activeLesson === index ? "bg-white/10 text-white/40" : "bg-navy/5 text-navy/20"
                        )}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <div className="flex-grow">
                        <h4 className={cn(
                          "text-xs font-bold mb-1 group-hover:text-secondary transition-colors",
                          activeLesson === index ? "text-white" : "text-navy"
                        )}>
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest opacity-60">
                          <span className="flex items-center gap-1">
                            {lesson.type === 'video' ? <Play className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                            {lesson.type}
                          </span>
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-10 bg-navy text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary transition-all flex items-center justify-center gap-2">
                Next Lesson
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
