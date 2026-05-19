
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, BookOpen, Target, 
  Lightbulb, CheckCircle2, AlertCircle, Info, 
  Sparkles, Trophy, RotateCcw, Brain, Layout,
  ListCheck, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { MorphologyLessonData, Question } from '../lib/morphologyData';
import { QuizComponent } from './QuizComponent';
import { AssessmentType } from '../lib/smartCorrector';

interface Props {
  lesson: MorphologyLessonData;
  onClose: () => void;
}

type Step = 'intro' | 'objectives' | 'theory' | 'examples' | 'quiz' | 'summary' | 'final';

export const MorphologyInteractiveUnit: React.FC<Props> = ({ lesson, onClose }) => {
  const [step, setStep] = useState<Step>('intro');
  const [diagnosticPassed, setDiagnosticPassed] = useState(false);

  const steps: Step[] = ['intro', 'objectives', 'theory', 'examples', 'quiz', 'summary', 'final'];
  const currentIndex = steps.indexOf(step);

  const next = () => {
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col min-h-[80vh] relative"
      >
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-white flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                 <Brain className="text-white" size={28} />
              </div>
              <div>
                 <h1 className="text-2xl font-black">{lesson.title}</h1>
                 <p className="text-indigo-100 font-bold opacity-80">{lesson.level} • وحدة تفاعلية</p>
              </div>
           </div>
           <button 
             onClick={onClose}
             className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
           >
              <X size={24} />
           </button>
        </div>

        {/* Progress Bar */}
        <div className="flex bg-slate-100 h-1.5 w-full">
           {steps.map((s, i) => (
             <div 
               key={s} 
               className={cn(
                 "flex-1 transition-all duration-500",
                 i <= currentIndex ? "bg-indigo-500" : "bg-transparent"
               )}
             />
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-95">
           <AnimatePresence mode="wait">
              {step === 'intro' && (
                <motion.div 
                  key="intro"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                   <div className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 text-indigo-100 -mr-10 -mt-10 group-hover:scale-110 transition-transform">
                         <Lightbulb size={200} />
                      </div>
                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black mb-6">
                           <Sparkles size={14} className="text-amber-300" />
                           <span>الوضعية المشكلة</span>
                        </div>
                        <h2 className="text-3xl font-black text-indigo-900 mb-6 leading-tight max-w-2xl">{lesson.intro.problem}</h2>
                        <p className="text-indigo-700 font-bold text-lg">هيا بنا نكتشف أسرار هذا الدرس من خلال رحلة بيداغوجية ممتعة!</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                         <Layout className="text-indigo-500" />
                         الاختبار التشخيصي (قبل التعلم)
                      </h3>
                      <QuizComponent 
                         type={AssessmentType.DIAGNOSTIC}
                         questions={lesson.intro.diagnosticQuestions}
                         title="اختبر مكتسباتك القبلية"
                         onComplete={(res) => setDiagnosticPassed(true)}
                      />
                   </div>
                </motion.div>
              )}

              {step === 'objectives' && (
                <motion.div 
                  key="objectives"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                   <div className="text-center space-y-4 mb-10">
                      <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                         <Target size={40} />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900">أهداف التعلم</h2>
                      <p className="text-slate-400 font-bold italic">ماذا سنحقق في نهاية هذه الوحدة؟</p>
                   </div>

                   <div className="grid gap-4 max-w-2xl mx-auto">
                      {lesson.objectives.map((obj, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 hover:border-indigo-200 transition-all group">
                           <div className="w-12 h-12 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              {i + 1}
                           </div>
                           <p className="text-slate-700 font-bold text-lg">{obj}</p>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {step === 'theory' && (
                <motion.div 
                  key="theory"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                         <BookOpen size={28} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-900">الشرح النظري المبسط</h2>
                        <p className="text-slate-400 font-bold">بناء القاعدة الصرفية خطوة بخطوة</p>
                      </div>
                   </div>

                   <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
                      <p className="text-indigo-900 font-bold text-xl leading-loose">
                         {lesson.theory.definition}
                      </p>
                   </div>

                   <div className="space-y-12">
                      {lesson.theory.sections.map((section, i) => (
                        <div key={i} className="space-y-6">
                           <h3 className="text-2xl font-black text-slate-800 border-r-4 border-indigo-500 pr-4">{section.title}</h3>
                           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm leading-relaxed text-slate-600 font-bold text-lg">
                              {section.content}
                           </div>
                           {section.table && (
                             <div className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-lg">
                                <table className="w-full text-right border-collapse">
                                   <thead className="bg-indigo-600 text-white">
                                      <tr>
                                         {section.table.header.map((h, hi) => (
                                           <th key={hi} className="p-6 font-black text-lg">{h}</th>
                                         ))}
                                      </tr>
                                   </thead>
                                   <tbody className="bg-white">
                                      {section.table.rows.map((row, ri) => (
                                        <tr key={ri} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                           {row.map((cell, ci) => (
                                             <td key={ci} className="p-6 font-bold text-slate-700">{cell}</td>
                                           ))}
                                        </tr>
                                      ))}
                                   </tbody>
                                </table>
                             </div>
                           )}
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {step === 'examples' && (
                <motion.div 
                  key="examples"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                   <h2 className="text-3xl font-black text-slate-900">أمثلة تفاعلية محلولة</h2>
                   <div className="grid md:grid-cols-2 gap-8">
                      {lesson.solvedExamples.map((ex, i) => (
                        <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-indigo-50 transition-all flex flex-col items-center text-center">
                           <div className="text-4xl font-black text-indigo-600 mb-4">{ex.word}</div>
                           <div className="w-full h-px bg-slate-100 my-4" />
                           <div className="text-2xl font-black text-slate-400 mb-6">{ex.analysis}</div>
                           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-600 font-bold leading-relaxed">
                              {ex.explanation}
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {step === 'quiz' && (
                <motion.div 
                  key="quiz"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                   <h2 className="text-3xl font-black text-slate-900">أنشطة تفاعلية (تقويم تكويني)</h2>
                   <QuizComponent 
                      type={AssessmentType.FORMATIVE}
                      questions={lesson.activities}
                      title="طبق ما تعلمته"
                      onComplete={() => {}}
                   />
                </motion.div>
              )}

              {step === 'summary' && (
                <motion.div 
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                   <div className="bg-slate-900 p-12 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 left-0 p-12 text-white/5 -ml-20 -mt-20">
                         <Sparkles size={300} />
                      </div>
                      <div className="relative z-10 space-y-10">
                         <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                            <Sparkles className="text-amber-400" />
                            الملخص الذكي
                         </h2>
                         <p className="text-xl font-bold text-slate-300 leading-relaxed max-w-3xl">{lesson.summary.content}</p>
                         
                         <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                               <h3 className="text-2xl font-black text-emerald-400 flex items-center gap-3">
                                  <CheckCircle2 />
                                  القواعد الذهبية
                               </h3>
                               <ul className="space-y-4">
                                  {lesson.summary.rules.map((rule, i) => (
                                    <li key={i} className="flex items-start gap-4 text-slate-100 font-bold text-lg">
                                       <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2.5 shrink-0" />
                                       {rule}
                                    </li>
                                  ))}
                               </ul>
                            </div>
                            <div className="space-y-6">
                               <h3 className="text-2xl font-black text-rose-400 flex items-center gap-3">
                                  <AlertCircle />
                                  أخطاء شائعة تجنبها
                               </h3>
                               <ul className="space-y-4">
                                  {lesson.summary.mistakes.map((mistake, i) => (
                                    <li key={i} className="flex items-start gap-4 text-slate-100 font-bold text-lg">
                                       <div className="w-2 h-2 bg-rose-400 rounded-full mt-2.5 shrink-0" />
                                       {mistake}
                                    </li>
                                  ))}
                               </ul>
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {step === 'final' && (
                <motion.div 
                  key="final"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                   <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                         <Trophy size={40} />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900">التقويم النهائي والإجمالي</h2>
                      <p className="text-slate-400 font-bold">قياس مدى تمكنك من مهارات الدرس بنسبة 100%</p>
                   </div>
                   <QuizComponent 
                      type={AssessmentType.SUMMATIVE}
                      questions={lesson.summativeQuiz}
                      title={`اختبار نهائي: ${lesson.title}`}
                      onComplete={() => {}}
                   />
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
           <button 
             onClick={prev}
             disabled={currentIndex === 0}
             className={cn(
               "flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all",
               currentIndex === 0 
                 ? "bg-slate-100 text-slate-300 cursor-not-allowed" 
                 : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
             )}
           >
              <ChevronRight size={20} />
              <span>السابق</span>
           </button>

           <div className="hidden md:flex items-center gap-3">
              {steps.map((s, i) => (
                <div 
                  key={s} 
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    i === currentIndex ? "bg-indigo-600 scale-125" : "bg-slate-200"
                  )}
                />
              ))}
           </div>

           <button 
             onClick={next}
             disabled={currentIndex === steps.length - 1}
             className={cn(
               "flex items-center gap-3 px-10 py-4 rounded-2xl font-black transition-all shadow-xl",
               currentIndex === steps.length - 1 
                 ? "bg-emerald-100 text-emerald-400 cursor-not-allowed" 
                 : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
             )}
           >
              <span>{currentIndex === steps.length - 1 ? 'نهاية الوحدة' : 'التالي'}</span>
              <ChevronLeft size={20} />
           </button>
        </div>
      </motion.div>
    </div>
  );
};
