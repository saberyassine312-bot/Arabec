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
      
      // Map to learningStyle
      let learningStyle = 'analytical';
      if (sorted[0][0] === 'visual') learningStyle = 'visual';
      if (sorted[0][0] === 'kinesthetic') learningStyle = 'applied';

      onComplete({
        score: `الأساسي: ${primary}، الثانوي: ${secondary}`,
        primaryIntelligence: primary,
        secondaryIntelligence: secondary,
        learningStyle,
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
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-50">
                  <Brain size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">اختبار الذكاءات المتعددة للمتعلمين</h2>
                  <p className="text-sm text-gray-500 max-w-2xl font-medium">
                    اكتشف نوع ذكائك الغالب ونقاط قوتك التعليمية وفق نظرية هوارد غاردنر لتخصيص رحلة تعلمك.
                  </p>
                </div>
              </div>
              <button 
                onClick={handleStart}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl shadow-indigo-100"
              >
                ابدأ الاختبار التشخيصي
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="py-12"
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-2 text-indigo-600 font-black">
                    <span className="text-sm">سؤال {currentQuestionIndex + 1} من {allQuestions.length}</span>
                  </div>
                  <div className="flex-1 mx-8 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-500 shadow-sm" 
                      style={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <h3 className="text-3xl font-black text-gray-900 mb-12 text-center leading-relaxed">
                  {allQuestions[currentQuestionIndex].text}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allQuestions[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(allQuestions[currentQuestionIndex].mapping[idx])}
                      className="p-6 rounded-[2rem] border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 text-right font-black transition-all group shadow-sm hover:shadow-xl hover:shadow-indigo-100/50"
                    >
                      <div className="flex items-center gap-6">
                        <span className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center text-lg transition-colors font-black">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-gray-700 group-hover:text-indigo-900">{option}</span>
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
              className="py-12"
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-50">
                    <Trophy size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-4">نتائج اختبار الذكاءات</h2>
                  <p className="text-xl text-gray-500 font-medium">هذا هو تحليل نمط تعلمك ونقاط قوتك</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
                  {getSortedResults().slice(0, 2).map(([type, score]: any, idx) => {
                    const info = intelligenceInfo[type];
                    const Icon = info.icon;
                    return (
                      <div key={type} className={cn("p-10 rounded-[3rem] border-2 shadow-xl", idx === 0 ? "border-indigo-500 bg-indigo-50/30 shadow-indigo-100/50" : "border-gray-100 bg-white shadow-gray-100")}>
                        <div className="flex items-center justify-between mb-8">
                          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg", info.bg, info.color)}>
                            <Icon size={36} />
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{idx === 0 ? "الذكاء الأساسي" : "الذكاء الثانوي"}</span>
                            <h4 className={cn("text-3xl font-black", info.color)}>{info.title}</h4>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium text-lg">{info.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white rounded-[3rem] p-10 mb-16 shadow-xl shadow-gray-100 border border-gray-50">
                  <h4 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <Info size={24} className="text-indigo-600" />
                    توصيات تعليمية مخصصة
                  </h4>
                  <ul className="space-y-6 text-gray-600">
                    <li className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 shrink-0 shadow-lg shadow-indigo-200"></div>
                      <span className="text-lg font-medium">استخدم طريقة تعلم تناسب ذكاءك الأساسي لتحقيق أفضل النتائج في النحو والصرف.</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 shrink-0 shadow-lg shadow-indigo-200"></div>
                      <span className="text-lg font-medium">دمج أكثر من نمط (مثل البصري والحركي) يعطي نتائج تعليمية أعمق في دروس الإملاء.</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 shrink-0 shadow-lg shadow-indigo-200"></div>
                      <span className="text-lg font-medium">تذكر أنه لا يوجد ذكاء أفضل من آخر، فكل نوع له مجالات تميزه الخاصة في اللغة العربية.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <button 
                    onClick={resetTest}
                    className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-gray-200"
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
