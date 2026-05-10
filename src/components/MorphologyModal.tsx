import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Scale, Search, BookOpen, Sparkles, 
  ArrowLeft, CheckCircle2, AlertCircle, Info 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface MorphologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MorphologyModal: React.FC<MorphologyModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<'selection' | 'explanation' | 'analyzer'>('selection');
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
    // Pattern: افتعال (e.g. استخراج is length 7, but let's check basic ones)
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
    // Pattern: فعّال (e.g. غفار - difficult because of Shadda, let's look for common ones)
    else if (len === 4 && cleanWord[2] === 'ا') {
      root = cleanWord[0] + cleanWord[1] + cleanWord[3];
      weight = "فَعّال / فَعال";
      explanation = `زيدت الألف قبل الحرف الأخير.`;
    }
    // Fallback or more complex
    else {
      setError("تعذر تحديد الوزن بدقة، حاول بكلمة أخرى (مثل: كاتب، محمود، انكسر، أو كلمات ثلاثية).");
      return;
    }

    setResult({ word: cleanWord, root, weight, explanation });
  };

  const menuOptions = [
    {
      id: 'explanation',
      title: 'الميزان الصرفي',
      desc: 'تعرف على أساسيات وزن الكلمات وكيفية مقابلة الحروف بـ (ف-ع-ل).',
      icon: <Info className="text-blue-500" size={32} />,
      color: 'bg-blue-50'
    },
    {
      id: 'analyzer',
      title: 'اكتب الكلمة واحصل على الوزن',
      desc: 'أدخل أي كلمة وسنقوم بتحليلها صرفياً واستخراج وزنها وجذرها.',
      icon: <Search className="text-purple-500" size={32} />,
      color: 'bg-purple-50'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden text-right relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors order-first"
          >
            <X size={24} className="text-gray-500" />
          </button>
          
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-gray-900">
              {view === 'selection' ? 'مسار تعلم الصرف' : 
               view === 'explanation' ? 'شرح الميزان الصرفي' : 'محلل الأوزان الصرفية'}
            </h2>
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Scale size={20} />
            </div>
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {view === 'selection' && (
              <motion.div 
                key="selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid gap-6"
              >
                {menuOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setView(opt.id as any)}
                    className="flex items-center gap-6 p-6 rounded-3xl border-2 border-transparent hover:border-purple-200 hover:bg-purple-50/50 transition-all text-right group"
                  >
                    <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110", opt.color)}>
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-900 mb-2">{opt.title}</h3>
                      <p className="text-gray-500 font-bold leading-relaxed">{opt.desc}</p>
                    </div>
                    <ChevronRight size={24} className="text-gray-300 group-hover:text-purple-500 transition-colors" />
                  </button>
                ))}
              </motion.div>
            )}

            {view === 'explanation' && (
              <motion.div 
                key="explanation"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <p className="text-blue-900 font-bold leading-loose text-lg text-center">
                    الميزان الصرفي هو مقياس وضعه علماء العرب لمعرفة أحوال الكلمات، واختاروا كلمة <span className="text-blue-600 underline">(فَعَلَ)</span> لتكرارها في كل فعل.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { word: 'دَرَسَ', weight: 'فَعَلَ', color: 'bg-emerald-50 text-emerald-700' },
                    { word: 'كاتِب', weight: 'فاعِل', color: 'bg-amber-50 text-amber-700' },
                    { word: 'مَفْهوم', weight: 'مَفْعول', color: 'bg-rose-50 text-rose-700' }
                  ].map((item, idx) => (
                    <div key={idx} className={cn("p-6 rounded-[2rem] text-center border border-transparent hover:shadow-md transition-all", item.color)}>
                      <div className="text-3xl font-black mb-2">{item.word}</div>
                      <div className="w-8 h-px bg-current opacity-20 mx-auto mb-2" />
                      <div className="text-xl font-bold opacity-80">{item.weight}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-gray-900 flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-500" />
                    كيف نوازن الكلمات؟
                  </h4>
                  <ul className="space-y-3 mr-4">
                    <li className="flex items-start gap-2 text-gray-600 font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>الحروف المشتقة تقابل حروف الميزان: الفاء تقابل الحرف الأول، العين تقابل الثاني، واللام تقابل الثالث.</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600 font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>إذا زيد حرف في الكلمة، نزيد مقابله في الميزان؛ فكلمة (استخرج) على وزن (استفعل).</span>
                    </li>
                  </ul>
                </div>

                <button 
                  onClick={() => setView('selection')}
                  className="w-full py-4 rounded-2xl bg-gray-100 text-gray-600 font-black hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  العودة للخيارات
                </button>
              </motion.div>
            )}

            {view === 'analyzer' && (
              <motion.div 
                key="analyzer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="relative">
                  <input 
                    type="text" 
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="اكتب كلمة عربية هنا..."
                    className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-purple-500 outline-none font-black text-xl text-center"
                    onKeyPress={(e) => e.key === 'Enter' && analyzeWord(word)}
                  />
                  <button 
                    onClick={() => analyzeWord(word)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all"
                  >
                    تحليل
                  </button>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-red-600 font-bold">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}

                <AnimatePresence>
                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'الكلمة', value: result.word, color: 'text-gray-900 bg-gray-50' },
                          { label: 'الجذر', value: result.root, color: 'text-emerald-600 bg-emerald-50' },
                          { label: 'الوزن', value: result.weight, color: 'text-purple-600 bg-purple-50' }
                        ].map((item, idx) => (
                          <div key={idx} className={cn("p-4 rounded-2xl text-center border border-gray-100", item.color)}>
                            <div className="text-[10px] uppercase font-black opacity-50 mb-1">{item.label}</div>
                            <div className="text-2xl font-black">{item.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="p-6 bg-purple-600 rounded-3xl text-white">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 size={20} />
                          <h4 className="font-black">شرح التحليل</h4>
                        </div>
                        <p className="font-bold leading-[1.8] opacity-90">
                          {result.explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  onClick={() => setView('selection')}
                  className="w-full py-4 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-all"
                >
                  تغيير المسار
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

import { ChevronRight } from 'lucide-react';
