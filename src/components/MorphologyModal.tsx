import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Scale, Search, BookOpen, Sparkles, 
  ArrowLeft, CheckCircle2, AlertCircle, Info, 
  ChevronRight, ChevronLeft, Brain, PlayCircle, Star, Scale as ScaleIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { morphologyLessons, MorphologyLessonData } from '../lib/morphologyData';
import { MorphologyInteractiveUnit } from './MorphologyInteractiveUnit';

interface MorphologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MorphologyModal: React.FC<MorphologyModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<'selection' | 'analyzer'>('selection');
  const [selectedLesson, setSelectedLesson] = useState<MorphologyLessonData | null>(null);
  const [word, setWord] = useState('');
  const [result, setResult] = useState<{ word: string; root: string; weight: string; explanation: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeWord = (input: string) => {
    const cleanWord = input.trim();
    if (!cleanWord) return;

    setError(null);
    setResult(null);

    // Basic common patterns analyzer (Simplified for pedagogical use)
    let root = "";
    let weight = "";
    let explanation = "";

    const len = cleanWord.length;

    // Pattern: فعل (length 3)
    if (len === 3) {
      root = cleanWord;
      weight = "فَعَلَ";
      explanation = `الكلمة تتكون من ثلاثة أحرف أصلية، فتقابل الحرف الأول بالفاء، والثاني بالعين، والثالث باللام.`;
    } 
    // Pattern: فاعل (e.g. كاتب)
    else if (len === 4 && cleanWord[1] === 'ا') {
      root = cleanWord[0] + cleanWord[2] + cleanWord[3];
      weight = "فاعِل";
      explanation = `زيدت الألف بعد الحرف الأول (الفاء)، وبقيت الحروف الأصلية الثلاثة.`;
    }
    // Pattern: فعيل (e.g. كريم)
    else if (len === 4 && cleanWord[2] === 'ي') {
      root = cleanWord[0] + cleanWord[1] + cleanWord[3];
      weight = "فَعيل";
      explanation = `زيدت الياء بعد الحرف الثاني (العين).`;
    }
    // Pattern: مفعول (e.g. مكتوب)
    else if (len === 5 && cleanWord[0] === 'م' && cleanWord[3] === 'و') {
      root = cleanWord[1] + cleanWord[2] + cleanWord[4];
      weight = "مَفْعول";
      explanation = `زيدت الميم في أول الكلمة والواو قبل الحرف الأخير.`;
    }
    // Pattern: افتعال
    else if (len === 6 && cleanWord[0] === 'ا' && cleanWord[2] === 'ت' && cleanWord[4] === 'ا') {
      root = cleanWord[1] + cleanWord[3] + cleanWord[5];
      weight = "افتعال";
      explanation = `زيدت الألف في الأول، والتاء بعد الفاء، والألف قبل اللام.`;
    }
    // Pattern: انفعل (e.g. انكسر)
    else if (len === 5 && cleanWord.startsWith('ان')) {
      root = cleanWord.substring(2);
      weight = "انْفَعَلَ";
      explanation = `زيدت الألف والنون في أول الكلمة.`;
    }
    // Fallback or more complex
    else {
      setError("تعذر تحديد الوزن بدقة، حاول بكلمة أخرى (مثل: كاتب، محمود، انكسر، أو كلمات ثلاثية).");
      return;
    }

    setResult({ word: cleanWord, root, weight, explanation });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden text-right relative flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
            <button 
              onClick={onClose}
              className="p-3 hover:bg-slate-100 rounded-full transition-colors order-first"
            >
              <X size={24} className="text-slate-500" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <h2 className="text-2xl font-black text-slate-900">وحدة الصرف التفاعلية</h2>
                <p className="text-slate-400 font-bold">تعلم، طبق، وقيم مستواك وفق المنهج الرسمي</p>
              </div>
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                <ScaleIcon size={28} />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
            <AnimatePresence mode="wait">
              {view === 'selection' && (
                <motion.div 
                  key="selection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  {/* Tools Header */}
                  <div className="flex flex-col md:flex-row gap-6">
                     <button 
                        onClick={() => setView('analyzer')}
                        className="flex-1 p-8 bg-white border border-indigo-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all group flex items-center gap-6"
                     >
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                           <Search size={32} />
                        </div>
                        <div className="text-right">
                           <h3 className="text-xl font-black text-slate-900 mb-1">محلل الميزان الصرفي</h3>
                           <p className="text-slate-400 font-bold text-sm">اكتب أي كلمة واحصل على وزنها فوراً</p>
                        </div>
                        <ChevronLeft className="mr-auto text-slate-300 group-hover:text-indigo-600" />
                     </button>
                  </div>

                  {/* Lessons Grid */}
                  <div className="space-y-6">
                     <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Star className="text-amber-400 fill-amber-400" size={20} />
                        الدروس التفاعلية المقررة
                     </h3>
                     <div className="grid md:grid-cols-2 gap-6">
                        {morphologyLessons.map((lesson) => (
                           <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all text-right group flex items-center gap-6"
                           >
                              <div className="w-16 h-16 bg-slate-50 text-indigo-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                 <Brain size={28} />
                              </div>
                              <div className="flex-1">
                                 <div className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">{lesson.level}</div>
                                 <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{lesson.title}</h4>
                                 <p className="text-slate-400 font-bold text-sm mt-1">تتضمن: شرح، أمثلة، ومسابقات</p>
                              </div>
                              <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                 <PlayCircle size={20} />
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
                </motion.div>
              )}

              {view === 'analyzer' && (
                <motion.div 
                  key="analyzer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8 max-w-2xl mx-auto"
                >
                  <div className="text-center space-y-4 mb-10">
                     <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
                        <Search size={40} />
                     </div>
                     <h2 className="text-3xl font-black text-slate-900">المحلل الصرفي الذكي</h2>
                     <p className="text-slate-400 font-bold">أداة مساعدة لوزن الكلمات وفهم جذورها</p>
                  </div>

                  <div className="relative">
                    <input 
                      type="text" 
                      value={word}
                      onChange={(e) => setWord(e.target.value)}
                      placeholder="اكتب كلمة عربية هنا..."
                      className="w-full p-8 rounded-[2rem] bg-white border-2 border-slate-100 focus:border-indigo-500 outline-none font-black text-2xl text-center shadow-lg shadow-slate-100"
                      onKeyPress={(e) => e.key === 'Enter' && analyzeWord(word)}
                    />
                    <button 
                      onClick={() => analyzeWord(word)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                    >
                      تحليل
                    </button>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold">
                      <AlertCircle size={20} />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {result && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                      >
                        <div className="grid grid-cols-3 gap-6">
                          {[
                            { label: 'الكلمة', value: result.word, color: 'text-slate-900 bg-white' },
                            { label: 'الجذر', value: result.root, color: 'text-emerald-600 bg-emerald-50' },
                            { label: 'الوزن', value: result.weight, color: 'text-indigo-600 bg-indigo-50' }
                          ].map((item, idx) => (
                            <div key={idx} className={cn("p-6 rounded-[2rem] text-center border border-slate-100 shadow-sm", item.color)}>
                              <div className="text-[10px] uppercase font-black opacity-50 mb-2 tracking-widest">{item.label}</div>
                              <div className="text-3xl font-black">{item.value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="p-8 bg-indigo-600 rounded-[3rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
                           <div className="absolute top-0 left-0 p-8 text-white/10 -ml-10 -mt-10">
                              <Sparkles size={160} />
                           </div>
                           <div className="relative z-10">
                             <div className="flex items-center gap-3 mb-4">
                               <CheckCircle2 size={24} className="text-indigo-200" />
                               <h4 className="text-xl font-black">شرح التحليل التربوي</h4>
                             </div>
                             <p className="text-lg font-bold leading-relaxed opacity-90">
                               {result.explanation}
                             </p>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button 
                    onClick={() => { setView('selection'); setResult(null); setWord(''); }}
                    className="w-full py-5 rounded-[2rem] bg-slate-100 text-slate-500 font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                  >
                    <ArrowLeft size={20} />
                    <span>العودة لقائمة الدروس</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
         {selectedLesson && (
            <MorphologyInteractiveUnit 
               lesson={selectedLesson}
               onClose={() => setSelectedLesson(null)}
            />
         )}
      </AnimatePresence>
    </>
  );
};

