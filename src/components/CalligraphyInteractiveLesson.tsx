import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, CheckCircle2, MessageSquare, 
  ArrowRight, ArrowLeft, RefreshCcw, 
  PenTool, Eye, Quote, HelpCircle,
  Award, Sparkles, Users
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LessonStep {
  id: number;
  phase: string;
  question: string;
  placeholder: string;
  answer: React.ReactNode;
}

export const CalligraphyInteractiveLesson: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>(new Array(7).fill(''));
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const steps: LessonStep[] = [
    {
      id: 0,
      phase: "أولاً: التأطير والملاحظة",
      question: "ما الذي يتناوله النص بشكل عام؟",
      placeholder: "اكتب ملاحظتك الأولية حول موضوع النص...",
      answer: (
        <div className="space-y-2">
          <p className="font-bold text-emerald-700">يتناول النص القيمة الفنية والجمالية للخط العربي، مع التركيز على عبقرية المبدع العربي في تحويل الحرف الجامد إلى قطعة فنية تنبض بالروح والحركة.</p>
        </div>
      )
    },
    {
      id: 1,
      phase: "ثانياً: الفكرة العامة للنص",
      question: "ما الفكرة العامة للنص؟",
      placeholder: "اكتب ما خلصت إليه كفكرة جوهرية للنص...",
      answer: (
        <div className="space-y-2">
          <p className="font-bold text-emerald-700">إبراز الخصائص التجريدية والروحية للخط العربي، وتوضيح سماته الفنية التي جعلته فناً عالمياً فريداً يجمع بين الوظيفة التواصلية والقيمة الزخرفية.</p>
        </div>
      )
    },
    {
      id: 2,
      phase: "ثالثاً: الحقول الدلالية",
      question: "إلى أي حقلين ينقسم معجم النص؟",
      placeholder: "حدد الحقول الدلالية المسيطرة على النص...",
      answer: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <h4 className="font-black text-emerald-800 mb-2 border-b border-emerald-200 pb-1">حقل الجمال الفني</h4>
              <ul className="text-xs space-y-1 font-bold text-emerald-600">
                <li>• من الفنون الزخرفية</li>
                <li>• الفنون التصويرية</li>
                <li>• الكلمات العربية الموسيقية</li>
                <li>• قطعة فنية رائعة</li>
                <li>• ضفائر وزهريات</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <h4 className="font-black text-blue-800 mb-2 border-b border-blue-200 pb-1">الحقل الثقافي</h4>
              <ul className="text-xs space-y-1 font-bold text-blue-600">
                <li>• الخط العربي</li>
                <li>• اللغة العربية</li>
                <li>• متاحف</li>
                <li>• الحرف العربي</li>
                <li>• ديباج، سجاد</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      phase: "ثالثاً: الحقول الدلالية (تابع)",
      question: "ما العلاقة بين الحقلين؟",
      placeholder: "حلل العلاقة الرابطة بين الثقافي والفني في النص...",
      answer: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-black">
            <CheckCircle2 size={18} />
            <span>العلاقة: علاقة تأثير وتأثر</span>
          </div>
          <p className="text-slate-600 font-bold bg-slate-50 p-4 rounded-xl border-right-4 border-emerald-500">
            التعليل: الثقافة مصدر للفن، والفن يؤثر في الثقافة ويطورها ويغنيها.
          </p>
        </div>
      )
    },
    {
      id: 4,
      phase: "رابعاً: الأساليب",
      question: "ما الأساليب الموظفة في النص؟",
      placeholder: "اذكر الأساليب التي استعملها الكاتب مع أمثلة...",
      answer: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar p-2">
          {[
            { t: "الأسلوب الخبري", c: '"يعتبر الخط العربي فناً من الفنون الزخرفية."', color: "border-blue-500 bg-blue-50/30" },
            { t: "أسلوب التوكيد", c: '"إنه تجريدية رمزية." / "فإن الخط العربي كان معبّراً."', color: "border-emerald-500 bg-emerald-50/30" },
            { t: "أسلوب النفي", c: '"ليست الزخرفة في الخط العربي مقصودة لذاتها."', color: "border-purple-500 bg-purple-50/30" },
            { t: "أسلوب التشبيه", c: '"يشبه الشعاع الضوئي." / "تشبه فروع الشجرة."', color: "border-amber-500 bg-amber-50/30" },
            { t: "أسلوب الوصف", c: '"قطعة فنية رائعة ومقدسة." / "جماله ورشاقته."', color: "border-rose-500 bg-rose-50/30" },
            { t: "أسلوب المقابلة", c: '"الكوفي جماله في الاستقرار، والنسخي في الحركة."', color: "border-indigo-500 bg-indigo-50/30" }
          ].map((item, idx) => (
            <div key={idx} className={cn("p-3 rounded-xl border-r-4", item.color)}>
              <div className="font-black text-xs mb-1 underline capitalize">{item.t}</div>
              <div className="text-[10px] font-bold text-slate-600 italic">{item.c}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 5,
      phase: "خامساً: طبيعة اللغة",
      question: "ما طبيعة اللغة في النص؟",
      placeholder: "صف نوع اللغة والخطاب المعتمد...",
      answer: (
        <div className="flex items-center gap-4 bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-200">
           <Quote className="text-emerald-300" size={32} />
           <div className="text-2xl font-black text-emerald-800 tracking-wider">لغة تقريرية</div>
        </div>
      )
    },
    {
      id: 6,
      phase: "سادساً: التركيب العام",
      question: "ركب فكرة عامة تلخص النص.",
      placeholder: "اكتب خلاصة شاملة تجمع بين المضمون والأسلوب...",
      answer: (
        <div className="bg-slate-900 p-8 rounded-[2rem] text-white space-y-4 shadow-2xl">
          <div className="flex items-center gap-2 text-emerald-400 font-black mb-2">
            <Award size={20} />
            <span>التركيب النهائي</span>
          </div>
          <p className="text-sm leading-relaxed font-bold text-slate-300">
            يتناول النص "عبقرية الخط العربي" إبراز القيمة الفنية والثقافية للخط العربي باعتباره فناً يجمع بين الجمال والروحانية، وليس مجرد وسيلة للكتابة. ويبين أن العلاقة بين الثقافة والفن علاقة تأثير وتأثر، حيث تغذي الثقافة الفن، ويعمل الفن على تطويرها وإغنائها.
          </p>
          <p className="text-sm leading-relaxed font-bold text-slate-300">
            وقد اعتمد الكاتب على أساليب متنوعة مثل الخبر، والتوكيد، والنفي، والتشبيه، والوصف لإبراز جمال الخط العربي وخصائصه الفنية. وخلاصة النص أن الخط العربي يمثل تراثاً فنياً متميزاً يعكس عبقرية الإبداع العربي الإسلامي.
          </p>
        </div>
      )
    }
  ];

  const handleDone = () => {
    if (!userInputs[currentStep].trim()) {
      alert("المرجو ملء مساحة الإجابة أولاً.");
      return;
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setUserInputs(new Array(7).fill(''));
    setShowAnswer(false);
    setIsCompleted(false);
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-10 px-4 md:px-8 font-sans rtl" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Lesson Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-2">
            <Sparkles size={16} />
            <span>درس تفاعلي متقدم</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900">عبقرية الخط العربي</h1>
          <div className="flex items-center justify-center gap-6 text-slate-400 font-bold text-sm">
            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              <span>الثالثة إعدادي</span>
            </div>
            <div className="flex items-center gap-2">
              <PenTool size={18} />
              <span>مكون النصوص</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-3 rounded-full border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500" 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ ease: "circOut", duration: 0.8 }}
            />
          </div>
          <span className="text-xs font-black text-slate-400">المرحلة {currentStep + 1} من {steps.length}</span>
        </div>

        {/* Lesson Stage */}
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: -20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.98 }}
              className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
              
              <div className="p-8 md:p-12 space-y-10 relative z-10">
                {/* Phase Badge */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">
                    {currentStep + 1}
                  </div>
                  <h2 className="text-2xl font-black text-slate-700">{step.phase}</h2>
                </div>

                {/* Question Area */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0 mt-2">
                      <HelpCircle size={24} />
                    </div>
                    <div className="space-y-4 flex-1">
                      <h3 className="text-2xl font-black text-slate-900 leading-snug">{step.question}</h3>
                      <textarea 
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-3xl p-6 min-h-[150px] font-bold text-lg focus:border-emerald-500 focus:bg-white outline-none transition-all resize-none shadow-inner"
                        placeholder={step.placeholder}
                        value={userInputs[currentStep]}
                        onChange={(e) => {
                          const newInputs = [...userInputs];
                          newInputs[currentStep] = e.target.value;
                          setUserInputs(newInputs);
                        }}
                        disabled={showAnswer}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center py-4">
                  {!showAnswer ? (
                    <button 
                      onClick={handleDone}
                      className="px-12 py-5 bg-slate-900 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-3 group"
                    >
                      <CheckCircle2 size={24} className="group-hover:rotate-12 transition-transform" />
                      <span>تـم</span>
                    </button>
                  ) : (
                    <motion.button 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      onClick={handleNext}
                      className="px-12 py-5 bg-emerald-600 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-3 group"
                    >
                      <span>المرحلة التالية</span>
                      <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
                    </motion.button>
                  )}
                </div>

                {/* Answer Reveal Area */}
                <AnimatePresence>
                  {showAnswer && (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 pt-10 border-t-2 border-dashed border-emerald-100"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                          <Eye size={18} />
                        </div>
                        <span className="text-emerald-600 font-black tracking-widest uppercase">الإجابة الصحيحة المقترحة</span>
                      </div>
                      <div className="bg-[#FCFEFD] p-8 rounded-[2rem] border-2 border-emerald-50 shadow-sm">
                        {step.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="completion"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3.5rem] p-12 text-center space-y-8 shadow-2xl border border-emerald-100"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Award size={64} />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-900">أحسنت! لقد أكملت الدرس بنجاح</h2>
                <p className="text-xl text-slate-500 font-bold max-w-lg mx-auto">
                  لقد غصت في أعماق عبقرية الخط العربي وحللت النص بمستوياته المختلفة. المعرفة هي الخط الأول نحو الإبداع.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={handleReset}
                  className="px-8 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black hover:bg-slate-100 transition-all flex items-center gap-2"
                >
                  <RefreshCcw size={20} />
                  <span>إعادة الدرس</span>
                </button>
                <button 
                  className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2"
                >
                  <span>العودة للرئيسية</span>
                  <ArrowLeft size={20} />
                </button>
              </div>

              {/* Chalkboard Summary Section */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-16 w-full bg-[#1B2B24] border-[12px] border-[#3D2B1F] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 md:p-14 relative overflow-hidden rtl text-right"
                style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.6), 0 25px 60px rgba(0,0,0,0.4)' }}
              >
                {/* Chalkboard Texture Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-chalkboard.png')]" />
                
                {/* Board Header */}
                <div className="relative z-10 border-b-2 border-white/20 pb-8 mb-12 text-center">
                  <div className="inline-block px-6 py-2 border-2 border-dashed border-emerald-400/40 rounded-xl mb-4">
                    <h2 className="text-2xl font-black text-emerald-100">مكون النصوص: الثالثة إعدادي</h2>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white underline decoration-wavy decoration-amber-400 underline-offset-8">درس: جمالية الخط العربي (عبقرية الخط العربي)</h1>
                </div>

                <div className="relative z-10 space-y-16 text-white/90">
                  
                  {/* Phase 3: Analysis */}
                  <section className="space-y-10">
                    <h2 className="text-3xl font-black text-amber-300 border-b border-amber-300/30 pb-2 inline-block">ثالثاً: التحليل</h2>
                    
                    {/* 1. Semantic Fields */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-blue-200 flex items-center gap-2">
                        <div className="w-2 h-8 bg-blue-400/40 rounded-full" />
                        1- الحقول الدلالية الواردة في النص
                      </h3>
                      <p className="text-sm font-bold opacity-80 mr-4">يتوزع معجم النص إلى حقلين دلاليين أساسيين:</p>
                      
                      <div className="grid md:grid-cols-2 gap-8 mt-4">
                        {/* Table 1 */}
                        <div className="border-2 border-white/10 rounded-2xl overflow-hidden bg-white/5">
                          <div className="bg-blue-900/40 p-4 border-b-2 border-white/10 text-center">
                            <h4 className="font-black text-blue-100 italic tracking-widest">حقل الجمال الفني</h4>
                          </div>
                          <ul className="p-6 space-y-3 text-sm font-bold opacity-90">
                            <li className="list-disc list-inside border-b border-white/5 pb-2">من الفنون الزخرفية</li>
                            <li className="list-disc list-inside border-b border-white/5 pb-2">الفنون التصويرية</li>
                            <li className="list-disc list-inside border-b border-white/5 pb-2">في الكلمات العربية الموسيقية</li>
                            <li className="list-disc list-inside border-b border-white/5 pb-2">قطعة فنية رائعة</li>
                            <li className="list-disc list-inside">ضفائر وزهريات</li>
                          </ul>
                        </div>
                        {/* Table 2 */}
                        <div className="border-2 border-white/10 rounded-2xl overflow-hidden bg-white/5">
                          <div className="bg-emerald-900/40 p-4 border-b-2 border-white/10 text-center">
                            <h4 className="font-black text-emerald-100 italic tracking-widest">الحقل الثقافي</h4>
                          </div>
                          <ul className="p-6 space-y-3 text-sm font-bold opacity-90">
                            <li className="list-disc list-inside border-b border-white/5 pb-2">الخط العربي</li>
                            <li className="list-disc list-inside border-b border-white/5 pb-2">اللغة العربية</li>
                            <li className="list-disc list-inside border-b border-white/5 pb-2">متاحف</li>
                            <li className="list-disc list-inside border-b border-white/5 pb-2">الحرف العربي</li>
                            <li className="list-disc list-inside">ديباج، سجاد</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 2. Relationship */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-black text-blue-200 flex items-center gap-2">
                        <div className="w-2 h-8 bg-blue-400/40 rounded-full" />
                        2- العلاقة بين الحقلين
                      </h3>
                      <div className="bg-white/5 p-6 rounded-2xl border-r-4 border-emerald-400 italic">
                        <p className="text-lg leading-relaxed font-bold">
                          العلاقة بين الحقلين هي علاقة <span className="text-emerald-300 underline decoration-double decoration-emerald-500/50">تأثير وتأثر</span>، حيث تستمد الثقافة مادتها من الفن، بينما يسهم الفن في تطوير الثقافة وإغنائها وإبراز قيمها الجمالية.
                        </p>
                      </div>
                    </div>

                    {/* 3. Methods */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-blue-200 flex items-center gap-2">
                        <div className="w-2 h-8 bg-blue-400/40 rounded-full" />
                        3- الأساليب الموظفة في النص
                      </h3>
                      <p className="text-sm font-bold opacity-80 mr-4">اعتمد الكاتب على مجموعة من الأساليب، وهي:</p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mr-4">
                        {[
                          { t: "الأسلوب الخبري:", c: '"يعتبر الخط العربي فناً من الفنون الزخرفية."' },
                          { t: "أسلوب التوكيد:", c: '"إنه تجريدية رمزية."' },
                          { t: "أسلوب النفي:", c: '"ليست الزخرفة في الخط العربي مقصودة لذاتها."' },
                          { t: "أسلوب التشبيه:", c: '"يشبه الشعاع الضوئي."' },
                          { t: "أسلوب الوصف:", c: '"قطعة فنية رائعة ومقدسة."' },
                          { t: "أسلوب المقابلة:", c: '"الكوفي جماله في الاستقرار والنسخي في الحركة."' }
                        ].map((item, i) => (
                          <div key={i} className="border border-white/10 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                            <h4 className="text-xs font-black text-emerald-300 mb-2 underline">{item.t}</h4>
                            <p className="text-[10px] italic font-bold opacity-80">{item.c}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. Language Nature */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-black text-blue-200 flex items-center gap-2">
                        <div className="w-2 h-8 bg-blue-400/40 rounded-full" />
                        4- طبيعة اللغة الموظفة في النص
                      </h3>
                      <p className="text-lg font-bold bg-white/5 p-6 rounded-2xl border-r-4 border-rose-400 mr-4">
                        لغة النص <span className="text-rose-300 underline underline-offset-4">تقريرية</span> تعتمد على عرض المعلومات وتفسيرها بشكل واضح ومباشر.
                      </p>
                    </div>

                    {/* 5. Values */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-blue-200 flex items-center gap-2">
                        <div className="w-2 h-8 bg-blue-400/40 rounded-full" />
                        5- القيم الواردة في النص
                      </h3>
                      <div className="grid md:grid-cols-3 gap-6 mr-4">
                        <div className="bg-emerald-950/40 border border-emerald-500/30 p-5 rounded-2xl space-y-2">
                          <h4 className="font-black text-emerald-300 flex items-center gap-2">
                            <Sparkles size={16} /> قيمة فنية جمالية:
                          </h4>
                          <p className="text-xs font-bold opacity-80">إبراز جمال الخط العربي كفن زخرفي راقٍ.</p>
                        </div>
                        <div className="bg-blue-950/40 border border-blue-500/30 p-5 rounded-2xl space-y-2">
                          <h4 className="font-black text-blue-300 flex items-center gap-2">
                            <Users size={16} /> قيمة ثقافية حضارية:
                          </h4>
                          <p className="text-xs font-bold opacity-80">ارتباط الخط العربي باللغة العربية والتراث الإسلامي.</p>
                        </div>
                        <div className="bg-purple-950/40 border border-purple-500/30 p-5 rounded-2xl space-y-2">
                          <h4 className="font-black text-purple-300 flex items-center gap-2">
                            <Sparkles size={16} /> قيمة روحية جمالية:
                          </h4>
                          <p className="text-xs font-bold opacity-80">التعبير عن الإحساس الجمالي والبعد الروحي في الخط العربي.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Phase 4: Synthesis */}
                  <section className="space-y-8 pt-12 border-t-2 border-dashed border-white/10">
                    <h2 className="text-3xl font-black text-amber-300 border-b border-amber-300/30 pb-2 inline-block">رابعاً: التركيب</h2>
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-inner relative group">
                       <Quote className="absolute top-6 left-6 text-white/5 transform -rotate-12 group-hover:rotate-0 transition-transform" size={80} />
                       <div className="text-sm leading-[2] text-justify font-bold space-y-6 relative z-10">
                          <p>يتناول النص "عبقرية الخط العربي" إبراز جمالية الخط العربي باعتباره فناً يجمع بين البعد الجمالي والبعد الثقافي، وليس مجرد وسيلة للكتابة. كما يوضح أن العلاقة بين الثقافة والفن علاقة تأثير وتأثر، حيث تغذي الثقافة الفن، ويعمل الفن على تطويرها وإغنائها.</p>
                          <p>وقد اعتمد الكاتب على أساليب متنوعة مثل الأسلوب الخبري، والتوكيد، والنفي، والتشبيه، والوصف لإبراز جمال الخط العربي وخصائصه الفنية.</p>
                          <div className="pt-6 mt-6 border-t border-white/10">
                            <p className="text-xl font-black text-emerald-200 text-center italic tracking-wide">
                              "وخلاصة النص أن الخط العربي يمثل تراثاً فنياً عربياً إسلامياً متميزاً يعكس عبقرية الإبداع والجمال."
                            </p>
                          </div>
                       </div>
                    </div>
                  </section>

                </div>

                {/* Decorative Chalk Holder */}
                <div className="mt-20 flex justify-center gap-8 relative">
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/10 -translate-y-1/2" />
                  <div className="w-14 h-4 bg-white/95 rounded-sm rotate-12 shadow-[2px_2px_0_rgba(0,0,0,0.2)] relative z-10" />
                  <div className="w-12 h-4 bg-emerald-200/95 rounded-sm -rotate-6 shadow-[2px_2px_0_rgba(0,0,0,0.2)] relative z-10" />
                  <div className="w-16 h-4 bg-blue-200/95 rounded-sm rotate-[35deg] shadow-[2px_2px_0_rgba(0,0,0,0.2)] relative z-10" />
                  <div className="w-13 h-4 bg-rose-200/95 rounded-sm rotate-[-45deg] shadow-[2px_2px_0_rgba(0,0,0,0.2)] relative z-10" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Reference Sidebar (Optional for student) */}
        {!isCompleted && (
          <div className="bg-amber-50 p-6 rounded-[2rem] border-2 border-amber-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-200 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
              <Quote size={20} />
            </div>
            <p className="text-sm font-bold text-amber-800 leading-relaxed italic">
              "الخط العربي ليس مجرد حروف، بل هو رقصة من النور والظل، تعكس جمال الروح وسحر اللغة."
              <span className="block mt-2 font-black text-[10px] text-amber-600 uppercase tracking-widest">— مقتطف من موضوع الدرس</span>
            </p>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};
