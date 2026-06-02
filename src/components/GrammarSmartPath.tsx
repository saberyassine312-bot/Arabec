import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Target, Star, Lock, Play, 
  CheckCircle2, ArrowRight, ArrowLeft,
  Sparkles, MessageCircle, HelpCircle,
  BarChart3, RefreshCcw, Info, GraduationCap,
  ChevronRight, Map as MapIcon, Award
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db, auth } from '../lib/firebase';
import { 
  collection, doc, getDoc, setDoc, 
  updateDoc, arrayUnion, onSnapshot 
} from 'firebase/firestore';
import { QuizComponent } from './QuizComponent';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { ClipboardCheck } from 'lucide-react';

import { AssessmentType } from '../lib/smartCorrector';

// --- Data & Types ---

interface SmartLesson {
  id: string;
  title: string;
  level: number; // 1, 2, 3 (Prep Years)
  description: string;
  concepts: string[];
  prerequisites: string[];
}

const SMART_PATH_DATA: SmartLesson[] = [
  // 1st Prep
  { id: 'sent-types', title: 'أنواع الجملة', level: 1, description: 'التمييز بين الجملة الاسمية والفعلية وأركانهما.', concepts: ['الجملة الاسمية', 'الجملة الفعلية'], prerequisites: [] },
  { id: 'nominal-sent', title: 'الجملة الاسمية والفعلية', level: 1, description: 'هيكل الجملة العربية الأساسي.', concepts: ['المبتدأ', 'الخبر', 'الفعل', 'الفاعل'], prerequisites: ['sent-types'] },
  { id: 'sub-pred', title: 'المبتدأ والخبر', level: 1, description: 'أحكام المبتدأ وتعدد أنواع الخبر.', concepts: ['المبتدأ', 'أنواع الخبر'], prerequisites: ['nominal-sent'] },
  { id: 'subj-obj', title: 'الفاعل والمفعول', level: 1, description: 'إعراب الفاعل والمفعول به.', concepts: ['الفاعل', 'المفعول به'], prerequisites: ['nominal-sent'] },
  { id: 'adj-cond', title: 'النعت والحال', level: 1, description: 'التوابع والمنصوبات: النعت والحال.', concepts: ['النعت الحقيقي', 'الحال المفردة'], prerequisites: ['subj-obj'] },
  { id: 'pronouns', title: 'الضمائر', level: 1, description: 'الضمائر المنفصلة والمتصلة والمستترة.', concepts: ['الضمير المتصل', 'الضمير المنفصل'], prerequisites: ['nominal-sent'] },

  // 2nd Prep
  { id: 'kana', title: 'كان وأخواتها', level: 2, description: 'النواسخ الفعلية وعملها في الجملة الاسمية.', concepts: ['كان', 'ليس', 'صار'], prerequisites: ['sub-pred'] },
  { id: 'inna', title: 'إن وأخواتها', level: 2, description: 'النواسخ الحرفية ومعانيها.', concepts: ['إن', 'أن', 'كأن'], prerequisites: ['sub-pred'] },
  { id: 'obj-types', title: 'المفاعيل', level: 2, description: 'المفعول المطلق، المفعول لأجله، والمفعول فيه.', concepts: ['المفعول المطلق', 'المفعول لأجله'], prerequisites: ['subj-obj'] },
  { id: 'passive', title: 'نائب الفاعل', level: 2, description: 'بناء الفعل للمجهول وإنابة المفعول به.', concepts: ['الفعل المبني للمجهول'], prerequisites: ['subj-obj'] },
  { id: 'emphasis', title: 'التوكيد والعطف', level: 2, description: 'التوابع: التوكيد اللفظي والمعنوي، حروف العطف.', concepts: ['التوكيد', 'العطف'], prerequisites: ['adj-cond'] },
  { id: 'exception', title: 'المستثنى والمنادى', level: 2, description: 'الاستثناء بإلا والنداء بـ "يا".', concepts: ['المستثنى بإلا', 'المنادى'], prerequisites: ['obj-types'] },

  // 3rd Prep
  { id: 'verb-moods', title: 'إعراب الفعل المضارع', level: 3, description: 'رفع الفعل المضارع وعلامات إعرابه.', concepts: ['المضارع الصحيح', 'المضارع المعتل'], prerequisites: [] },
  { id: 'nasb-jazm', title: 'أدوات النصب والجزم', level: 3, description: 'نواصب وجوازم الفعل المضارع.', concepts: ['أن', 'لن', 'كي', 'لم', 'لا الناهية'], prerequisites: ['verb-moods'] },
  { id: 'conditional', title: 'أسلوب الشرط', level: 3, description: 'أدوات الشرط الجازمة وغير الجازمة.', concepts: ['أداة الشرط', 'جملة الشرط', 'جواب الشرط'], prerequisites: ['nasb-jazm'] },
  { id: 'lang-styles', title: 'أساليب لغوية', level: 3, description: 'التعجب، المدح والذم، والاختصاص.', concepts: ['التعجب', 'المدح والذم'], prerequisites: [] },
  { id: 'regional-prep', title: 'التحضير للامتحان الجهوي', level: 3, description: 'مراجعة شاملة لنماذج الامتحانات الجهوية.', concepts: ['تطبيقات شاملة'], prerequisites: ['conditional'] }
];

export default function GrammarSmartPath() {
  const [activeLevel, setActiveLevel] = useState<number>(3); // Default to 3rd Prep
  const [userPath, setUserPath] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<SmartLesson | null>(null);
  const [view, setView] = useState<'map' | 'lesson' | 'quiz' | 'tutor' | 'diagnostic'>('map');
  const [loading, setLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  // AI Setup (handled via backend API proxy)
  
  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = onSnapshot(doc(db, 'grammarPaths', auth.currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserPath(docSnap.data());
      } else {
        // Initialize path
        const initialPath = {
          completedLessons: [],
          currentLevel: 1,
          points: 0,
          strengths: [],
          weaknesses: []
        };
        setDoc(doc(db, 'grammarPaths', auth.currentUser!.uid), initialPath).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `grammarPaths/${auth.currentUser?.uid}`);
        });
        setUserPath(initialPath);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `grammarPaths/${auth.currentUser?.uid}`);
    });

    return () => unsubscribe();
  }, []);

  const isLessonUnlocked = (lesson: SmartLesson) => {
    if (lesson.prerequisites.length === 0) return true;
    return lesson.prerequisites.every(preId => userPath?.completedLessons?.includes(preId));
  };

  const handleLessonComplete = async (lessonId: string) => {
    if (!auth.currentUser || !userPath) return;

    const newCompleted = Array.from(new Set([...userPath.completedLessons, lessonId]));
    try {
      await updateDoc(doc(db, 'grammarPaths', auth.currentUser.uid), {
        completedLessons: newCompleted,
        points: (userPath.points || 0) + 50
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `grammarPaths/${auth.currentUser.uid}`);
    }
    
    setView('map');
    setSelectedLesson(null);
  };

  const askTutor = async (prompt: string) => {
    setAiLoading(true);
    setAiResponse('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/smartpath/ask-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          title: selectedLesson?.title,
          prompt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tutor response');
      }

      const data = await response.json();
      setAiResponse(data.text || "عذراً، لم أستطع توليد رد حالياً.");
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse("عذراً، حدث خطأ في التواصل مع المعلم الذكي. حاول مجدداً.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><RefreshCcw className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-24 pb-20 px-4 md:px-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                <MapIcon size={32} />
             </div>
             <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">مسارات التعلم الذكي</h1>
                <p className="text-slate-400 font-bold">رحلة شخصية لإتقان النحو العربي</p>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
             <button 
               onClick={() => setView('diagnostic')}
               className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-indigo-50 transition-all shadow-sm"
             >
                <ClipboardCheck size={20} />
                <span>إجراء اختبار تشخيصي</span>
             </button>

             <div className="flex bg-white p-1.5 rounded-3xl border border-slate-100 shadow-sm">
               {[1, 2, 3].map((num) => (
                 <button
                   key={num}
                   onClick={() => setActiveLevel(num)}
                   className={cn(
                     "px-6 py-2.5 rounded-2xl font-black text-sm transition-all",
                     activeLevel === num 
                       ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                       : "text-slate-400 hover:text-slate-600"
                   )}
                 >
                   السنة {num === 1 ? 'الأولى' : num === 2 ? 'الثانية' : 'الثالثة'}
                 </button>
               ))}
             </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'map' && (
            <motion.div 
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="relative space-y-12"
            >
              {/* Hero Banner */}
              <div className="relative h-[300px] rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img 
                  src="https://images.unsplash.com/photo-1523240715630-9918c13dabaf?auto=format&fit=crop&w=1200&q=80" 
                  alt="Middle School Students" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-indigo-900/40 to-transparent p-12 flex flex-col justify-center text-white">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black w-fit mb-6">
                    <Sparkles size={14} className="text-amber-300" />
                    <span>نظام تكيفي ذكي</span>
                  </div>
                  <h2 className="text-4xl font-black mb-4 leading-tight">مستقبلك يبدأ بإتقان <br /> لغتك الأم</h2>
                  <p className="text-indigo-100 font-bold max-w-md">نستخدم الذكاء الاصطناعي لتحويل قواعد النحو إلى رحلة استكشاف ممتعة تناسب مستواك الدراسي تماماً.</p>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                 <StatCard icon={<Trophy className="text-amber-500" />} label="نقاط المسار" value={userPath?.points || 0} color="amber" />
                 <StatCard icon={<Brain className="text-emerald-500" />} label="دروس مكتملة" value={userPath?.completedLessons?.length || 0} color="emerald" />
                 <StatCard icon={<Target className="text-blue-500" />} label="مستوى التمكن" value="78%" color="blue" />
              </div>

              {/* Path Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {SMART_PATH_DATA.filter(l => l.level === activeLevel).map((lesson, idx) => {
                    const unlocked = isLessonUnlocked(lesson);
                    const completed = userPath?.completedLessons?.includes(lesson.id);
                    
                    return (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={unlocked ? { y: -8 } : {}}
                        className={cn(
                          "relative bg-white rounded-[3rem] p-8 border shadow-lg transition-all flex flex-col",
                          unlocked ? "border-slate-100 shadow-slate-100 group cursor-pointer" : "opacity-70 border-slate-50 cursor-not-allowed bg-slate-50"
                        )}
                        onClick={() => unlocked && (setSelectedLesson(lesson), setView('lesson'))}
                      >
                         {!unlocked && (
                           <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] rounded-[3rem] flex items-center justify-center">
                              <div className="bg-white p-4 rounded-3xl shadow-xl flex flex-col items-center gap-2">
                                 <Lock size={24} className="text-slate-400" />
                                 <span className="text-[10px] font-black text-slate-500">أكمل المتطلبات أولاً</span>
                              </div>
                           </div>
                         )}

                         <div className="flex justify-between items-start mb-6">
                            <div className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black",
                              completed ? "bg-emerald-500 text-white" : unlocked ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-400"
                            )}>
                               {completed ? <CheckCircle2 size={28} /> : idx + 1}
                            </div>
                            {unlocked && !completed && (
                              <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">متاح الآن</span>
                            )}
                         </div>

                         <h3 className="text-xl font-black text-slate-800 mb-3">{lesson.title}</h3>
                         <p className="text-slate-400 font-bold text-sm leading-relaxed mb-8 flex-1">{lesson.description}</p>

                         <div className="mt-auto">
                            <div className="flex flex-wrap gap-2 mb-6">
                               {lesson.concepts.map(c => (
                                 <span key={c} className="bg-slate-50 text-slate-500 px-3 py-1 rounded-xl text-[10px] font-bold">#{c}</span>
                               ))}
                            </div>
                            <button className={cn(
                              "w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2",
                              completed ? "bg-emerald-50 text-emerald-600" : "bg-indigo-600 text-white shadow-xl shadow-indigo-100 group-hover:bg-indigo-700"
                            )}>
                               {completed ? 'مراجعة الدرس' : 'ابدأ التحدي'}
                               <ArrowRight size={18} className="rotate-180" />
                            </button>
                         </div>
                      </motion.div>
                    );
                 })}
              </div>
            </motion.div>
          )}

          {view === 'lesson' && selectedLesson && (
            <motion.div 
              key="lesson"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <button onClick={() => setView('map')} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all"><ChevronRight size={24} /></button>
                    <div>
                       <h2 className="text-2xl font-black text-slate-900">{selectedLesson.title}</h2>
                       <p className="text-slate-400 font-bold text-sm">المسار الذكي • السنة {activeLevel} إعدادي</p>
                    </div>
                 </div>
                 <div className="hidden md:flex gap-3">
                    <button onClick={() => setView('tutor')} className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-100 transition-all">
                       <MessageCircle size={18} />
                       اسأل المعلم الذكي
                    </button>
                 </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-100/50 min-h-[400px]">
                       <div className="flex items-center gap-3 mb-8">
                          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                             <Play size={20} fill="white" />
                          </div>
                          <h3 className="text-xl font-black text-slate-900">شرح المفهوم الأساسي</h3>
                       </div>

                       <div className="prose prose-slate max-w-none">
                          <p className="text-2xl font-bold text-slate-700 leading-[1.8] mb-8">
                             {selectedLesson.description}
                          </p>
                          <div className="bg-indigo-50/50 p-8 rounded-[3rem] border border-indigo-100/50 mb-10">
                             <h4 className="font-black text-indigo-900 mb-4 flex items-center gap-2">
                                <Info size={18} />
                                فكر في هذا:
                             </h4>
                             <p className="text-xl font-bold text-indigo-800">
                                كيف يتغير إعراب الكلمة بتغير وظيفتها في الجملة؟ في هذا الدرس سنكتشف الأسرار الكامنة خلف {selectedLesson.title}...
                             </p>
                          </div>
                       </div>

                       <div className="flex flex-col sm:flex-row gap-4">
                          <button onClick={() => setView('quiz')} className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3">
                             <Target size={24} />
                             بدء الاختبار التكيفي
                          </button>
                          <button onClick={() => setView('tutor')} className="sm:hidden py-5 bg-indigo-50 text-indigo-600 rounded-[2rem] font-black text-xl hover:bg-indigo-100 transition-all">
                             اسأل المعلم الذكي
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-xl shadow-indigo-200">
                       <Sparkles size={32} className="text-indigo-200 mb-6" />
                       <h3 className="text-xl font-black mb-4">نصيحة الذكاء التكيفي</h3>
                       <p className="text-indigo-100 font-bold leading-relaxed mb-6">
                          لقد لاحظنا أنك تتقن "أركان الجملة"، لذا سنركز في هذا الاختبار على "علامات الإعراب" الدقيقة.
                       </p>
                       <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                          <motion.div animate={{ width: '60%' }} className="h-full bg-white rounded-full" />
                       </div>
                    </div>

                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                       <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                          <Award size={18} className="text-amber-500" />
                          المفاهيم المطلوبة
                       </h4>
                       <ul className="space-y-3">
                          {selectedLesson.concepts.map(c => (
                            <li key={c} className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                               <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                               {c}
                            </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {view === 'tutor' && (
            <motion.div 
              key="tutor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <button onClick={() => setView('lesson')} className="p-3 bg-white rounded-xl shadow-sm text-slate-400 hover:text-indigo-600"><ChevronRight size={20} /></button>
                    <h2 className="text-2xl font-black text-slate-900">المعلم الذكي المساعد</h2>
                 </div>
                 <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black">متصل الآن</div>
              </div>

              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                 <div className="p-8 md:p-12 min-h-[400px] bg-slate-50/30">
                    <div className="flex gap-6 mb-8">
                       <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                          <Brain size={24} className="text-white" />
                       </div>
                       <div className="bg-white p-6 rounded-[2rem] rounded-tr-none shadow-sm border border-slate-100 flex-1">
                          <p className="text-lg font-bold text-slate-700 leading-relaxed">
                             مرحباً بك! أنا هنا للمساعدة في تبسيط أي مفهوم لغوي. عن ماذا تود الاستفسار بخصوص درس "{selectedLesson?.title}"؟
                          </p>
                       </div>
                    </div>

                    {aiResponse && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-6 mb-8">
                         <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                            <Brain size={24} className="text-white" />
                         </div>
                         <div className="bg-indigo-50 p-6 rounded-[2rem] rounded-tr-none shadow-sm border border-indigo-100 flex-1">
                            <div className="prose prose-indigo max-w-none font-bold text-lg leading-relaxed text-indigo-900">
                               {aiResponse}
                            </div>
                         </div>
                      </motion.div>
                    )}

                    {aiLoading && (
                      <div className="flex justify-center p-8">
                         <RefreshCcw className="animate-spin text-indigo-600" size={32} />
                      </div>
                    )}
                 </div>

                 <div className="p-6 bg-white border-t border-slate-100">
                    <div className="flex gap-4">
                       <input 
                         type="text" 
                         placeholder="اكتب سؤالك هنا..."
                         className="flex-1 bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                         onKeyPress={(e) => e.key === 'Enter' && askTutor(e.currentTarget.value)}
                         dir="rtl"
                       />
                       <button 
                         onClick={() => {
                           const input = document.querySelector('input') as HTMLInputElement;
                           if (input.value) askTutor(input.value);
                         }}
                         className="bg-indigo-600 text-white px-8 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                        >
                         إرسال
                       </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                       <button onClick={() => askTutor('أعطني مثالاً من الدارجة المغربية')} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold hover:bg-slate-200">مثال بالدارجة</button>
                       <button onClick={() => askTutor('بسط لي القاعدة أكثر')} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold hover:bg-slate-200">تبسيط أكثر</button>
                       <button onClick={() => askTutor('كيف يأتي هذا في الامتحان؟')} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold hover:bg-slate-200">سؤال امتحاني</button>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {view === 'diagnostic' && (
            <motion.div 
              key="diagnostic"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-2xl">
                 <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => setView('map')} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600"><ChevronRight size={20} /></button>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2">الاختبار التشخيصي الشامل</h2>
                      <p className="text-slate-400 font-bold">قياس المكتسبات القبلية لتحديد مسار التعلم الأمثل</p>
                    </div>
                 </div>

                 <QuizComponent 
                    type={AssessmentType.DIAGNOSTIC}
                    title="التقويم التشخيصي لمادة اللغة العربية"
                    questions={[
                      {
                        id: 1,
                        text: 'ما هي أركان الجملة الفعلية الأساسية؟',
                        options: ['المبتدأ والخبر', 'الفعل والفاعل', 'الناسخ واسمه'],
                        correctAnswer: 1,
                        explanation: 'الجملة الفعلية تتكون أساساً من فعل وفاعل.'
                      },
                      {
                        id: 2,
                        text: 'أي من الكلمات التالية تعتبر من أخوات كان؟',
                        options: ['لعل', 'صار', 'لكن'],
                        correctAnswer: 1,
                        explanation: 'صار من النواسخ الفعلية (أخوات كان)، بينما لعل ولكن من النواسخ الحرفية.'
                      },
                      {
                        id: 3,
                        text: 'ما هو إعراب الفاعل دائماً؟',
                        options: ['منصوب', 'مجرور', 'مرفوع'],
                        correctAnswer: 2,
                        explanation: 'الفاعل في اللغة العربية دائماً ما يكون مرفوعاً.'
                      },
                      {
                        id: 4,
                        text: 'ما نوع الخبر في جملة "العلمُ ينفعُ صاحبَه"؟',
                        options: ['مفرد', 'جملة فعلية', 'شبه جملة'],
                        correctAnswer: 1,
                        explanation: 'الخبر هنا هو الفعل "ينفع" وفاعله، فهو جملة فعلية.'
                      },
                      {
                        id: 5,
                        text: 'أداة الجزم "لم" تدخل على أي فعل؟',
                        options: ['الماضي', 'الأمر', 'المضارع'],
                        correctAnswer: 2,
                        explanation: 'أدوات الجزم تدخل حصراً على الفعل المضارع فتجزمه.'
                      }
                    ]}
                    onComplete={(result) => {
                      console.log("Diagnostic Complete:", result);
                      // Custom logic for diagnostic result if needed
                    }}
                 />
              </div>
            </motion.div>
          )}

          {view === 'quiz' && selectedLesson && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-2xl">
                 <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">تحدي المهارة التكيفي</h2>
                    <p className="text-slate-400 font-bold">أجب بدقة لفتح الدرس التالي في المسار</p>
                 </div>

                 <QuizComponent 
                    type={AssessmentType.FORMATIVE}
                    questions={[
                      {
                        id: 1,
                        text: `في جملة "${selectedLesson.title} مفيد"، ما هو الإعراب الصحيح؟`,
                        options: ['مبتدأ مرفوع', 'خبر منصوب', 'فاعل مجرور'],
                        correctAnswer: 0,
                        explanation: 'دائماً ما يأتي الاسم في بداية الجملة الاسمية مبتدأً مرفوعاً.'
                      }
                    ]}
                    onComplete={(result) => {
                      if (result.correctCount >= 1) { // Simplified for demo
                        handleLessonComplete(selectedLesson.id);
                      } else {
                        setView('tutor');
                        setAiResponse("يبدو أنك واجهت بعض الصعوبات في الاختبار. دعنا نراجع المفاهيم معاً قبل المحاولة مرة أخرى!");
                      }
                    }}
                 />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Helper Components ---

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  const colors: any = { amber: "bg-amber-50 text-amber-600", emerald: "bg-emerald-50 text-emerald-600", blue: "bg-blue-50 text-blue-600" };
  return (
    <div className={cn("bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-6", colors[color])}>
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-black text-slate-900">{value}</div>
      </div>
    </div>
  );
}

const Trophy = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
