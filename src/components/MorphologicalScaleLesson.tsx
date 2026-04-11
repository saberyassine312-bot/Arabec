import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ArrowRight, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Scale, 
  ListChecks, 
  Star, 
  XCircle, 
  Trophy, 
  RotateCcw, 
  PenTool, 
  Layers,
  Zap,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function MorphologicalScaleLesson() {
  const [showAnswers, setShowAnswers] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const quizQuestions = [
    {
      question: "ما هو الوزن الصرفي لكلمة 'كَتَبَ'؟",
      options: ["فِعْل", "فَعَلَ", "مَفْعَل", "فَعْلَلَ"],
      correct: 1
    },
    {
      question: "ما هو وزن كلمة 'مَدْرَسَة'؟",
      options: ["فَعَلَة", "مَفْعَلَة", "فِعْلَة", "مَفْعُول"],
      correct: 1
    },
    {
      question: "كلمة 'دَحْرَجَ' هي كلمة رباعية أصلية، فما وزنها؟",
      options: ["فَعَلَ", "فَعْلَلَ", "فَعْلَلَلَ", "مَفْعَل"],
      correct: 1
    },
    {
      question: "ما هو وزن كلمة 'مَكْتُوب'؟",
      options: ["فَعُول", "مَفْعَل", "مَفْعُول", "فِعْل"],
      correct: 2
    },
    {
      question: "كلمة 'سَفَرْجَل' خماسية الأصول، فما وزنها؟",
      options: ["فَعْلَلَ", "فَعْلَلَلَ", "فَعْلَلّ", "فَعْنَلَل"],
      correct: 1
    }
  ];

  const handleQuizAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowQuizResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowQuizResult(false);
    setSelectedOption(null);
    setQuizStarted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans" dir="rtl">
      {/* 1. Title */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl mb-4">
          <Scale size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">📌 الميزان الصرفي</h1>
        <p className="text-gray-500 font-bold">وسيلة لمعرفة بنية الكلمات وأصولها</p>
      </motion.div>

      {/* 2. Introduction */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
            <Info size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">2. مقدمة</h2>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm leading-relaxed text-lg space-y-4">
          <p>
            <span className="font-bold text-emerald-600">الميزان الصرفي:</span> هو مقياس وضعه علماء العرب لمعرفة أحوال بنية الكلمة، وما يطرأ عليها من زيادة أو حذف.
          </p>
          <p>
            تُوزن الكلمة حسب عدد حروفها الأصلية، وقد اختار العلماء كلمة <span className="font-bold text-blue-600">(ف ع ل)</span> لتكون الميزان الأساسي.
          </p>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 font-medium">
            💡 الفاء تقابل الحرف الأول، والعين تقابل الثاني، واللام تقابل الثالث.
          </div>
        </div>
      </section>

      {/* 3. Triliteral Words */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <Layers size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">3. الميزان الصرفي للكلمات الثلاثية</h2>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <p className="text-lg text-gray-700">الكلمات الثلاثية هي التي أصلها 3 حروف أصلية.</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
              <div className="text-sm text-gray-400 mb-2">مثال: المَجْد</div>
              <div className="text-3xl font-black text-gray-900 mb-2">مَجْد</div>
              <div className="text-xl font-bold text-emerald-600">فَعْل</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
              <div className="text-sm text-gray-400 mb-2">مثال: كَتَبَ</div>
              <div className="text-3xl font-black text-gray-900 mb-2">كَتَبَ</div>
              <div className="text-xl font-bold text-emerald-600">فَعَلَ</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold">عَلِمَ ← فَعِلَ</div>
            <div className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold">كَرُمَ ← فَعُلَ</div>
            <div className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold">ضَرَبَ ← فَعَلَ</div>
          </div>
        </div>
      </section>

      {/* 4. Augmented Words */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <Zap size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">4. الكلمات المزيدة</h2>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <p className="text-lg text-gray-700">إذا زادت الكلمة عن أصولها بحروف من حروف الزيادة (سألتمونيها)، نزيد ما يماثلها في الميزان.</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-center">
              <div className="text-sm text-amber-600 mb-2">مدرسة (أصلها: درس)</div>
              <div className="text-3xl font-black text-gray-900 mb-2">مَدْرَسَة</div>
              <div className="text-xl font-bold text-amber-700">مَفْعَلَة</div>
            </div>
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-center">
              <div className="text-sm text-amber-600 mb-2">مكتوب (أصلها: كتب)</div>
              <div className="text-3xl font-black text-gray-900 mb-2">مَكْتُوب</div>
              <div className="text-xl font-bold text-amber-700">مَفْعُول</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Common Weights */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
            <ListChecks size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">5. أشهر الأوزان الصرفية</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { w: 'فَعَلَ', ex: 'جَلَسَ' },
            { w: 'فَعْل', ex: 'بَحْر' },
            { w: 'فِعْل', ex: 'عِلْم' },
            { w: 'مَفْعَل', ex: 'مَلْعَب' },
            { w: 'مَفْعُول', ex: 'مَنْصُور' },
            { w: 'فَاعِل', ex: 'قَائِل' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="text-xl font-black text-purple-600 mb-1">{item.w}</div>
              <div className="text-sm text-gray-500">مثل: {item.ex}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6 & 7. Quad and Quinque */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
            <Star size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">6 & 7. الكلمات الرباعية والخماسية</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-indigo-600 mb-4">الكلمات الرباعية الأصلية</h3>
            <p className="text-sm text-gray-500 mb-4">نزيد لاماً ثانية في آخر الميزان.</p>
            <div className="p-4 bg-indigo-50 rounded-2xl text-center">
              <div className="text-2xl font-black mb-1">دَحْرَجَ</div>
              <div className="text-lg font-bold text-indigo-700">فَعْلَلَ</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-rose-600 mb-4">الكلمات الخماسية الأصلية</h3>
            <p className="text-sm text-gray-500 mb-4">نزيد لامين في آخر الميزان (أو لام مشددة).</p>
            <div className="p-4 bg-rose-50 rounded-2xl text-center">
              <div className="text-2xl font-black mb-1">سَفَرْجَل</div>
              <div className="text-lg font-bold text-rose-700">فَعْلَلَل (فَعْلَلّ)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Summary */}
      <section className="mb-12">
        <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400" /> 8. خلاصة القاعدة
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0 mt-1">✓</div>
                <p>الكلمة تُوزن حسب عدد حروفها الأصلية.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0 mt-1">✓</div>
                <p>نستخدم الميزان الأساسي <span className="text-white font-bold">ف ع ل</span> للثلاثي.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0 mt-1">✓</div>
                <p>نضيف حروف الزيادة في الميزان كما هي في الكلمة.</p>
              </li>
            </ul>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </div>
      </section>

      {/* 9. Interactive Exercises */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
              <PenTool size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">9. تمارين تفاعلية</h2>
          </div>
          <button 
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
          >
            {showAnswers ? <><EyeOff size={18} /> إخفاء الحل</> : <><Eye size={18} /> إظهار الحل</>}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-6 text-center text-lg">اختر الوزن الصحيح للكلمات التالية:</h4>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl gap-4">
                <span className="text-2xl font-black">كَتَبَ</span>
                <div className="flex gap-2">
                  {['فَعَلَ', 'مَفْعَل', 'فِعْل'].map(w => (
                    <button key={w} className={cn("px-4 py-2 rounded-xl border font-bold transition-all", showAnswers && w === 'فَعَلَ' ? "bg-emerald-500 text-white border-emerald-500" : "bg-white border-gray-200")}>{w}</button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl gap-4">
                <span className="text-2xl font-black">مَدْرَسَة</span>
                <div className="flex gap-2">
                  {['مَفْعَلَة', 'فَعَل', 'فِعْل'].map(w => (
                    <button key={w} className={cn("px-4 py-2 rounded-xl border font-bold transition-all", showAnswers && w === 'مَفْعَلَة' ? "bg-emerald-500 text-white border-emerald-500" : "bg-white border-gray-200")}>{w}</button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl gap-4">
                <span className="text-2xl font-black">دَحْرَجَ</span>
                <div className="flex gap-2">
                  {['فَعْلَلَ', 'مَفْعُول', 'فِعْل'].map(w => (
                    <button key={w} className={cn("px-4 py-2 rounded-xl border font-bold transition-all", showAnswers && w === 'فَعْلَلَ' ? "bg-emerald-500 text-white border-emerald-500" : "bg-white border-gray-200")}>{w}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Final Quiz */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">10. التقويم الختامي</h2>
        </div>

        {!quizStarted && !showQuizResult ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
            <h3 className="text-2xl font-bold mb-4">هل أنت مستعد للاختبار النهائي؟</h3>
            <p className="text-gray-500 mb-8">5 أسئلة لقياس مدى استيعابك للميزان الصرفي</p>
            <button 
              onClick={() => setQuizStarted(true)}
              className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              ابدأ الاختبار الآن
            </button>
          </div>
        ) : showQuizResult ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center"
          >
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={40} />
            </div>
            <h3 className="text-3xl font-bold mb-2">أحسنت!</h3>
            <p className="text-gray-500 mb-6">لقد أكملت الاختبار بنجاح</p>
            <div className="text-5xl font-black text-emerald-600 mb-8">{score} / {quizQuestions.length}</div>
            <button 
              onClick={resetQuiz}
              className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all mx-auto"
            >
              <RotateCcw size={20} />
              إعادة الاختبار
            </button>
          </motion.div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm font-bold text-gray-400">السؤال {currentQuestion + 1} من {quizQuestions.length}</span>
              <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}></div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-8 text-center">{quizQuestions[currentQuestion].question}</h3>

            <div className="grid gap-4">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(index)}
                  disabled={selectedOption !== null}
                  className={cn(
                    "w-full p-4 text-right rounded-2xl border-2 transition-all font-bold",
                    selectedOption === null ? "border-gray-100 hover:border-emerald-500 hover:bg-emerald-50" :
                    index === quizQuestions[currentQuestion].correct ? "border-emerald-500 bg-emerald-50 text-emerald-700" :
                    selectedOption === index ? "border-red-500 bg-red-50 text-red-700" : "border-gray-50 opacity-50"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>

            {selectedOption !== null && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={nextQuestion}
                className="w-full mt-8 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                <span>{currentQuestion + 1 === quizQuestions.length ? 'إنهاء الاختبار' : 'السؤال التالي'}</span>
                <ArrowRight size={20} className="rotate-180" />
              </motion.button>
            )}
          </div>
        )}
      </section>

      {/* 11. Goal */}
      <section className="mb-12">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target size={24} className="text-emerald-600" /> 11. هدف الدرس
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold">فهم الميزان الصرفي وكيفية استخدامه.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold">التمييز بين الكلمات حسب بنيتها (ثلاثي، رباعي...).</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold">تطبيق عملي على الأوزان المختلفة في اللغة.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center pb-12">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm"
        >
          <ArrowRight className="rotate-180" />
          العودة لأعلى الدرس
        </button>
      </div>
    </div>
  );
}
