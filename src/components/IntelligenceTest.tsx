import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Trophy, 
  BookOpen, 
  Calculator, 
  Image as ImageIcon, 
  Activity, 
  Music, 
  Users, 
  User, 
  Leaf,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Question {
  text: string;
  options: string[];
  mapping: string[];
}

interface Section {
  category: string;
  title: string;
  questions: Question[];
}

const testData: Section[] = [
  {
    category: "linguistic",
    title: "الذكاء اللغوي",
    questions: [
      { text: "أفضل طريقة للتعلم بالنسبة لي هي:", options: ["قراءة النصوص وكتابة الملاحظات", "مشاهدة صور ورسوم", "التجربة العملية", "الاستماع والشرح الصوتي"], mapping: ["linguistic", "logical", "visual", "musical"] },
      { text: "أحب أكثر:", options: ["كتابة القصص", "حل الألغاز", "الرسم", "التحدث مع الآخرين"], mapping: ["linguistic", "logical", "visual", "social"] },
      { text: "عندما أشرح فكرة:", options: ["أستخدم الكلمات بكثرة", "أرسمها", "أمثلها بالحركة", "أشرحها شفهيًا"], mapping: ["linguistic", "visual", "kinesthetic", "social"] },
    ]
  },
  {
    category: "logical",
    title: "الذكاء المنطقي الرياضي",
    questions: [
      { text: "أفضل:", options: ["القصص", "الأرقام والحساب", "الرسم", "الموسيقى"], mapping: ["linguistic", "logical", "visual", "musical"] },
      { text: "أحب حل:", options: ["نصوص", "مسائل رياضية", "أنشطة فنية", "نقاشات"], mapping: ["linguistic", "logical", "visual", "social"] },
      { text: "عند مواجهة مشكلة:", options: ["أكتب عنها", "أحللها منطقيًا", "أرسمها", "أتناقش حولها"], mapping: ["linguistic", "logical", "visual", "social"] },
    ]
  },
  {
    category: "visual",
    title: "الذكاء البصري المكاني",
    questions: [
      { text: "أفضل التعلم عبر:", options: ["النصوص", "الحساب", "الصور والخرائط", "النقاش"], mapping: ["linguistic", "logical", "visual", "social"] },
      { text: "أستطيع:", options: ["حفظ نصوص", "حل مسائل", "تخيل الأشكال بسهولة", "التعبير بالكلام"], mapping: ["linguistic", "logical", "visual", "linguistic"] },
      { text: "أحب:", options: ["القراءة", "الرياضيات", "الرسم والتصميم", "التحدث"], mapping: ["linguistic", "logical", "visual", "social"] },
    ]
  },
  {
    category: "kinesthetic",
    title: "الذكاء الجسدي الحركي",
    questions: [
      { text: "أتعلم أفضل عندما:", options: ["أقرأ", "أحسب", "أرى", "أتحرك وأجرب"], mapping: ["linguistic", "logical", "visual", "kinesthetic"] },
      { text: "أفضل:", options: ["الجلوس للدراسة", "حل مسائل", "مشاهدة صور", "الأنشطة الحركية"], mapping: ["linguistic", "logical", "visual", "kinesthetic"] },
      { text: "أحب:", options: ["الكتابة", "التحليل", "التصميم", "اللعب والتجارب"], mapping: ["linguistic", "logical", "visual", "kinesthetic"] },
    ]
  },
  {
    category: "musical",
    title: "الذكاء الموسيقي",
    questions: [
      { text: "أحب:", options: ["القراءة", "الأرقام", "الصور", "الموسيقى"], mapping: ["linguistic", "logical", "visual", "musical"] },
      { text: "أستطيع:", options: ["حفظ النصوص", "حل مسائل", "تذكر الأشكال", "تذكر الألحان بسهولة"], mapping: ["linguistic", "logical", "visual", "musical"] },
      { text: "أركز أكثر عندما:", options: ["أقرأ", "أحسب", "أشاهد", "أستمع لموسيقى"], mapping: ["linguistic", "logical", "visual", "musical"] },
    ]
  },
  {
    category: "social",
    title: "الذكاء الاجتماعي",
    questions: [
      { text: "أفضل العمل:", options: ["وحدي", "مع أرقام", "بصريًا", "مع مجموعة"], mapping: ["intrapersonal", "logical", "visual", "social"] },
      { text: "أحب:", options: ["القراءة الفردية", "التحليل", "التصميم", "النقاش والعمل الجماعي"], mapping: ["intrapersonal", "logical", "visual", "social"] },
      { text: "أتعلم بسرعة عندما:", options: ["أقرأ وحدي", "أحلل", "أشاهد", "أتعلم مع الآخرين"], mapping: ["intrapersonal", "logical", "visual", "social"] },
    ]
  },
  {
    category: "intrapersonal",
    title: "الذكاء الذاتي",
    questions: [
      { text: "أفهم نفسي عندما:", options: ["أقرأ", "أحسب", "أتخيل", "أفكر وحدي"], mapping: ["linguistic", "logical", "visual", "intrapersonal"] },
      { text: "أفضل:", options: ["الدراسة الجماعية", "الحساب", "الصور", "التأمل والتفكير"], mapping: ["social", "logical", "visual", "intrapersonal"] },
      { text: "أتعلم عبر:", options: ["النصوص", "المنطق", "الصور", "التفكير الذاتي"], mapping: ["linguistic", "logical", "visual", "intrapersonal"] },
    ]
  },
  {
    category: "naturalistic",
    title: "الذكاء الطبيعي",
    questions: [
      { text: "أحب:", options: ["الكتب", "الأرقام", "التكنولوجيا", "الطبيعة"], mapping: ["linguistic", "logical", "visual", "naturalistic"] },
      { text: "أفضل:", options: ["الدراسة داخل الصف", "حل مسائل", "التصميم", "التعلم في الطبيعة"], mapping: ["linguistic", "logical", "visual", "naturalistic"] },
      { text: "ألاحظ بسهولة:", options: ["الكلمات", "الأنماط", "الصور", "النباتات والحيوانات"], mapping: ["linguistic", "logical", "visual", "naturalistic"] },
    ]
  }
];

const intelligenceInfo: any = {
  linguistic: { title: "لغوي", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", desc: "مناسب للقراءة والكتابة والتعامل مع الكلمات." },
  logical: { title: "منطقي", icon: Calculator, color: "text-emerald-600", bg: "bg-emerald-50", desc: "يحب التحليل والأرقام والحلول المنطقية." },
  visual: { title: "بصري", icon: ImageIcon, color: "text-purple-600", bg: "bg-purple-50", desc: "يتعلم بالصور والخرائط الذهنية والتخيل." },
  kinesthetic: { title: "حركي", icon: Activity, color: "text-orange-600", bg: "bg-orange-50", desc: "يتعلم بالتجربة العملية والحركة واللمس." },
  musical: { title: "موسيقي", icon: Music, color: "text-rose-600", bg: "bg-rose-50", desc: "يتعلم بالإيقاع والألحان والأصوات." },
  social: { title: "اجتماعي", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", desc: "يتعلم من خلال التفاعل والعمل مع الآخرين." },
  intrapersonal: { title: "ذاتي", icon: User, color: "text-slate-600", bg: "bg-slate-50", desc: "يحب التفكير الفردي والتأمل وفهم الذات." },
  naturalistic: { title: "طبيعي", icon: Leaf, color: "text-green-600", bg: "bg-green-50", desc: "يحب الطبيعة والتعلم في الهواء الطلق وملاحظة الأنماط الطبيعية." },
};

export const IntelligenceTest: React.FC<{ onComplete?: (results: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [scores, setScores] = useState<any>({});

  const allQuestions = testData.flatMap(section => section.questions);

  const handleStart = () => setStep('quiz');

  const handleAnswer = (mappingType: string) => {
    const newAnswers = [...answers, mappingType];
    setAnswers(newAnswers);

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: string[]) => {
    const counts: any = {};
    finalAnswers.forEach(type => {
      counts[type] = (counts[type] || 0) + 1;
    });
    setScores(counts);
    setStep('result');

    if (onComplete) {
      const sorted = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]);
      const primary = sorted[0] ? intelligenceInfo[sorted[0][0]].title : 'غير محدد';
      const secondary = sorted[1] ? intelligenceInfo[sorted[1][0]].title : 'غير محدد';
      onComplete({
        score: `الأساسي: ${primary}، الثانوي: ${secondary}`,
        primaryIntelligence: primary,
        secondaryIntelligence: secondary,
        isIntelligenceTest: true
      } as any);
    }
  };

  const getSortedResults = () => {
    return Object.entries(scores)
      .sort((a: any, b: any) => b[1] - a[1]);
  };

  const resetTest = () => {
    setStep('intro');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScores({});
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col md:flex-row items-center justify-between gap-6 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Brain size={28} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">اختبار الذكاءات المتعددة للمتعلمين</h2>
                  <p className="text-sm text-gray-500 max-w-2xl">
                    اكتشف نوع ذكائك الغالب ونقاط قوتك التعليمية وفق نظرية هوارد غاردنر.
                  </p>
                </div>
              </div>
              <button 
                onClick={handleStart}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
              >
                ابدأ الاختبار التشخيصي
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="py-8"
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">
                    <span className="text-sm">سؤال {currentQuestionIndex + 1} من {allQuestions.length}</span>
                  </div>
                  <div className="flex-1 mx-8 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500" 
                      style={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  {allQuestions[currentQuestionIndex].text}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allQuestions[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(allQuestions[currentQuestionIndex].mapping[idx])}
                      className="p-5 rounded-2xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 text-right font-bold transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 flex items-center justify-center text-sm transition-colors">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-gray-700 group-hover:text-emerald-900">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8"
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Trophy size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">نتائج اختبار الذكاءات</h2>
                  <p className="text-gray-500">هذا هو تحليل نمط تعلمك ونقاط قوتك</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                  {getSortedResults().slice(0, 2).map(([type, score]: any, idx) => {
                    const info = intelligenceInfo[type];
                    const Icon = info.icon;
                    return (
                      <div key={type} className={cn("p-8 rounded-3xl border-2", idx === 0 ? "border-emerald-500 bg-emerald-50/50" : "border-gray-100 bg-white")}>
                        <div className="flex items-center justify-between mb-6">
                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm", info.bg, info.color)}>
                            <Icon size={32} />
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{idx === 0 ? "الذكاء الأساسي" : "الذكاء الثانوي"}</span>
                            <h4 className={cn("text-2xl font-black", info.color)}>{info.title}</h4>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{info.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 mb-12">
                  <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Info size={20} className="text-emerald-600" />
                    توصيات تعليمية
                  </h4>
                  <ul className="space-y-4 text-gray-600">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                      <span>استخدم طريقة تعلم تناسب ذكاءك الأساسي لتحقيق أفضل النتائج.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                      <span>دمج أكثر من نمط (مثل البصري والحركي) يعطي نتائج تعليمية أعمق.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                      <span>تذكر أنه لا يوجد ذكاء أفضل من آخر، فكل نوع له مجالات تميزه الخاصة.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <button 
                    onClick={resetTest}
                    className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all"
                  >
                    إعادة الاختبار
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
