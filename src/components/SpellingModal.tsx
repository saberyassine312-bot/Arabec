import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, PenTool, Search, BookOpen, Sparkles, 
  ArrowLeft, CheckCircle2, AlertCircle, Info,
  ChevronDown, ChevronUp, Edit3, Lightbulb,
  CheckCircle, Trophy, Zap, Shield, HelpCircle,
  RefreshCw, Send, Quote
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface SpellingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SpellingCorrection {
  original: string;
  corrected: string;
  type: 'hemza' | 'ta' | 'alif' | 'tanwin' | 'letters' | 'other';
  explanation: string;
  rule: string;
}

interface AnalysisResult {
  correctedText: string;
  corrections: SpellingCorrection[];
  xpGained: number;
  badge?: string;
  advice: string;
}

export const SpellingModal: React.FC<SpellingModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<'selection' | 'inspector' | 'lessons' | 'arena'>('selection');
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userXp, setUserXp] = useState(0);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);

  // Load XP from local storage
  useEffect(() => {
    const savedXp = localStorage.getItem('spelling_xp');
    if (savedXp) setUserXp(parseInt(savedXp));
  }, []);

  const lessons = [
    {
      title: "الهمزات (الوصل والقطع)",
      description: "قواعد رسم الهمزة في أول الكلمة.",
      content: "همزة القطع (أ، إ) تُرسم وتُنطق دائماً. همزة الوصل (ا) لا تُرسم وتُنطق فقط في بداية الكلام. قاعدة 'الواو': أضف واواً قبل الكلمة، إذا نطقت الهمزة فهي قطع (وأَكَل)، وإذا لم تنطق فهي وصل (واستَمَع).",
      examples: [
        { word: "أحمد / إيمان", type: "قطع", note: "تُرسم دائماً." },
        { word: "استخرج / ابن", type: "وصل", note: "لا تُرسم الهمزة." }
      ]
    },
    {
      title: "التاء المربوطة والمفتوحة",
      description: "متى نكتب 'ة' ومتى نكتب 'ت'؟",
      content: "التاء المربوطة (ة) تُنطق هاءً عند الوقوف عليها (مدرسة -> مدرسه). التاء المفتوحة (ت) تُنطق تاءً دائماً سواء في الوصل أو الوقف (بيت -> بيت).",
      examples: [
        { word: "مدرسة / حديقة", type: "مربوطة", note: "تصبح هاءً في الوقف." },
        { word: "ذهبت / معلومات", type: "مفتوحة", note: "تبقى تاءً دائماً." }
      ]
    },
    {
      title: "التنوين والنون",
      description: "الفرق بين نون التنوين والنون الأصلية.",
      content: "التنوين نون زائدة تسقط عند الوقف ولا تُكتب نوناً صريحة. جرب حذف النون، إذا بقي معنى الكلمة صحيحاً فهي تنوين (بَيْتٌ -> بَيْت)، وإذا اختل فهي نون أصلية (مُؤْمِن -> مُؤْمِ).",
      examples: [
        { word: "صباحاً / كتابٌ", type: "تنوين", note: "تُكتب حركة لا نوناً." },
        { word: "عن / من / لبن", type: "نون أصلية", note: "لا يمكن حذفها." }
      ]
    }
  ];

  const handleInspect = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const prompt = `أنت "محقق الإملاء الذكي". حلل النص التالي واكتشف الأخطاء الإملائية.
      النص: "${text}"
      
      المهمة:
      1. اكتشف كل خطأ إملائي (همزات، تاءات، ألف لينة، تنوين، حروف متشابهة).
      2. قدم النص المصحح بالكامل.
      3. لكل خطأ، حدد نوعه واشرح القاعدة بأسلوب تعليمي مشوق لتلاميذ الإعدادي.
      4. حدد نقاط XP مستحقة (بين 10 و 100 حسب عدد الأخطاء المكتشفة).
      5. قدم نصيحة أخيرة للمتعلم لتجنب هذه الأخطاء مستقبلاً.`;

      const res = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              correctedText: { type: Type.STRING },
              corrections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    original: { type: Type.STRING },
                    corrected: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['hemza', 'ta', 'alif', 'tanwin', 'letters', 'other'] },
                    explanation: { type: Type.STRING },
                    rule: { type: Type.STRING }
                  },
                  required: ['original', 'corrected', 'type', 'explanation', 'rule']
                }
              },
              xpGained: { type: Type.NUMBER },
              badge: { type: Type.STRING },
              advice: { type: Type.STRING }
            },
            required: ['correctedText', 'corrections', 'xpGained', 'advice']
          }
        }
      });
      
      const analysis = JSON.parse(res.text || "{}");
      
      setResult(analysis);
      const newXp = userXp + (analysis.xpGained || 20);
      setUserXp(newXp);
      localStorage.setItem('spelling_xp', newXp.toString());
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء فحص النص. يرجى المحاولة لاحقاً.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden text-right relative flex flex-col h-[85vh] border-4 border-amber-500/20"
      >
        {/* Top HUD */}
        <div className="bg-amber-500 p-6 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <X size={24} />
             </button>
             <div className="h-8 w-px bg-white/20 mx-2" />
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                 <Shield size={24} className="text-white" />
               </div>
               <div>
                 <h2 className="text-xl font-black leading-none">محقق الإملاء الذكي</h2>
                 <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mt-1">المهمة: إنقاذ مدينة اللغة</p>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="bg-white/20 px-4 py-2 rounded-2xl flex items-center gap-2">
               <Zap size={18} className="text-amber-200" />
               <span className="font-black text-lg">{userXp} XP</span>
             </div>
             <div className="hidden md:flex gap-1">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className={cn("w-2 h-2 rounded-full", i <= Math.min(5, Math.ceil(userXp/500)) ? "bg-white" : "bg-white/30")} />
               ))}
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {view === 'selection' && (
              <motion.div 
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto space-y-12 py-8"
              >
                <div className="text-center space-y-4">
                  <div className="w-40 h-40 bg-amber-50 rounded-[2.5rem] mx-auto flex items-center justify-center border-4 border-amber-100 relative overflow-hidden shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80" 
                      alt="محقق الإملاء" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900">مرحباً بك أيها المحقق!</h3>
                  <p className="text-gray-500 font-bold text-lg leading-relaxed">
                    تَعَرَّضَتْ مَدِينَةُ اللُّغَةِ الْعَرَبِيَّةِ لِهُجُومٍ مِنْ "وَحْشِ الأَخْطَاءِ"! مُهِمَّتُكَ هِيَ اكْتِشَافُ الأَخْطَاءِ الإِمْلائِيَّةِ وَتَصْحِيحُهَا لِإِنْقَاذِ الْكَلِمَاتِ.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => setView('inspector')}
                    className="group p-8 rounded-[2.5rem] bg-amber-50 border-2 border-amber-100 hover:border-amber-500 hover:shadow-xl transition-all text-center"
                  >
                    <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Search size={32} />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">فحص النصوص</h4>
                    <p className="text-sm font-bold text-gray-500">أدخل نصاً للكشف عن أخطائه</p>
                  </button>

                  <button
                    onClick={() => setView('lessons')}
                    className="group p-8 rounded-[2.5rem] bg-indigo-50 border-2 border-indigo-100 hover:border-indigo-500 hover:shadow-xl transition-all text-center"
                  >
                    <div className="w-16 h-16 bg-indigo-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <BookOpen size={32} />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">مختبر القواعد</h4>
                    <p className="text-sm font-bold text-gray-500">تعلم قواعد الإملاء الأساسية</p>
                  </button>
                </div>
              </motion.div>
            )}

            {view === 'inspector' && (
              <motion.div 
                key="inspector"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {!result ? (
                  <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-inner">
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="أدخل النص هنا للفحص... (مثال: دهبة التلميد الى المدرصة صباحن)"
                        className="w-full h-48 bg-transparent text-2xl font-bold text-right outline-none resize-none placeholder:text-gray-300"
                        dir="rtl"
                      />
                      <div className="mt-4 flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                        <div className="flex gap-2">
                           <Zap size={20} className="text-amber-500" />
                           <span className="text-sm font-black text-gray-500">نظام الذكاء الاصطناعي جاهز</span>
                        </div>
                        <span className="text-xs text-gray-400 font-bold">{text.length} حرفاً</span>
                      </div>
                    </div>

                    <button
                      onClick={handleInspect}
                      disabled={!text.trim() || isAnalyzing}
                      className={cn(
                        "w-full py-6 rounded-[2rem] text-2xl font-black transition-all shadow-2xl flex items-center justify-center gap-4",
                        text.trim() && !isAnalyzing ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200" : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                      )}
                    >
                      {isAnalyzing ? <RefreshCw className="animate-spin" size={28} /> : <Search size={28} />}
                      <span>اِبْدَأِ التَّحْقِيقَ الآن</span>
                    </button>
                    
                    <button onClick={() => setView('selection')} className="w-full py-3 text-gray-400 font-bold text-sm">العودة للرئيسية</button>
                  </div>
                ) : (
                  <div className="space-y-8">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                              <h4 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">النص المصحح</h4>
                              <p className="text-2xl font-bold text-emerald-700 leading-relaxed" dir="rtl">{result.correctedText}</p>
                           </div>
                           
                           <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -m-10 blur-2xl" />
                              <div className="flex items-center gap-4 mb-4">
                                <Lightbulb className="text-amber-300" size={24} />
                                <h4 className="text-lg font-black">نصيحة المحقق نحوي</h4>
                              </div>
                              <p className="text-indigo-100 font-bold leading-relaxed">{result.advice}</p>
                              <div className="mt-6 flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <Zap size={20} className="text-amber-400" />
                                    <span className="text-2xl font-black">+{result.xpGained} XP</span>
                                 </div>
                                 {result.badge && (
                                   <div className="bg-white/20 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border border-white/10">
                                      <Trophy size={14} className="text-amber-300" />
                                      {result.badge}
                                   </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <h4 className="text-gray-900 font-black text-xl mb-4 pr-2">تقرير الأخطاء المكتشفة ({result.corrections.length})</h4>
                           <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                              {result.corrections.map((err, i) => (
                                <motion.div 
                                  key={i}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative group"
                                >
                                   <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                         <div className="text-red-500 font-black text-2xl line-through opacity-40">{err.original}</div>
                                         <ArrowLeft className="text-gray-300" size={16} />
                                         <div className="text-emerald-600 font-black text-2xl">{err.corrected}</div>
                                      </div>
                                      <div className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg border border-amber-100">
                                         {err.type === 'hemza' ? 'همزة' : err.type === 'ta' ? 'تاء' : err.type === 'tanwin' ? 'تنوين' : 'قاعدة أخرى'}
                                      </div>
                                   </div>
                                   <div className="bg-gray-50 p-4 rounded-2xl">
                                      <div className="text-xs font-black text-indigo-600 mb-1">القاعدة: {err.rule}</div>
                                      <p className="text-sm text-gray-600 font-bold leading-relaxed">{err.explanation}</p>
                                   </div>
                                </motion.div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <button 
                          onClick={() => { setResult(null); setText(''); }}
                          className="flex-1 py-5 bg-white border-2 border-gray-100 text-gray-500 rounded-[2rem] font-black text-lg hover:bg-gray-50 transition-all"
                        >
                           فحص نص جديد
                        </button>
                        <button 
                          onClick={() => setView('selection')}
                          className="flex-1 py-5 bg-amber-500 text-white rounded-[2rem] font-black text-lg hover:bg-amber-600 shadow-lg shadow-amber-100 transition-all"
                        >
                           العودة للمقرر
                        </button>
                     </div>
                  </div>
                )}
              </motion.div>
            )}

            {view === 'lessons' && (
              <motion.div 
                key="lessons"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {lessons.map((lesson, idx) => (
                    <div key={idx} className="bg-white border-2 border-gray-100 rounded-[2.5rem] overflow-hidden transition-all hover:border-indigo-200 shadow-sm">
                      <button 
                        onClick={() => setActiveLesson(activeLesson === idx ? null : idx)}
                        className="w-full p-8 flex items-center justify-between transition-colors bg-white hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-indigo-500 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
                            {idx + 1}
                          </div>
                          <div className="text-right">
                            <h4 className="text-xl font-black text-gray-900">{lesson.title}</h4>
                            <p className="text-xs text-gray-400 font-black uppercase tracking-wider">{lesson.description}</p>
                          </div>
                        </div>
                        {activeLesson === idx ? <ChevronUp size={24} className="text-indigo-500" /> : <ChevronDown size={24} className="text-gray-300" />}
                      </button>
                      
                      <AnimatePresence>
                        {activeLesson === idx && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-indigo-50/30 border-t border-indigo-100"
                          >
                            <div className="p-10 space-y-8">
                              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-indigo-50 relative">
                                <Quote className="absolute top-4 left-4 text-indigo-100" size={40} />
                                <p className="text-xl font-bold text-slate-800 leading-[1.8] relative z-10">
                                  {lesson.content}
                                </p>
                              </div>

                              <div className="grid sm:grid-cols-2 gap-6">
                                {lesson.examples.map((ex, i) => (
                                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-200 flex flex-col justify-center transform hover:scale-105 transition-transform">
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center shadow-md">
                                        <CheckCircle size={18} />
                                      </div>
                                      <span className="text-2xl font-black text-indigo-900">{ex.word}</span>
                                    </div>
                                    <div className="bg-indigo-50 p-3 rounded-xl">
                                      <span className="text-[10px] font-black text-indigo-500 uppercase block mb-1">{ex.type}</span>
                                      <span className="text-sm font-bold text-slate-600">{ex.note}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                <div className="pt-8">
                  <button 
                    onClick={() => setView('selection')}
                    className="w-full py-6 rounded-[2rem] bg-slate-900 text-white font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-xl"
                  >
                    <ArrowLeft size={24} />
                    حسناً، لِنَعُدْ لِلْمُهِمَّةِ الرَّئِيسِيَّةِ
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-4 rounded-2xl flex items-center gap-4 shadow-2xl z-50">
            <AlertCircle size={24} />
            <span className="font-bold">{error}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
