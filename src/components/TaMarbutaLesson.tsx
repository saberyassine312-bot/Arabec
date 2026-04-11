import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, AlertCircle, Info, ArrowRight, HelpCircle, Eye, EyeOff, Type, ListChecks, Star, XCircle, Trophy, RotateCcw, PenTool, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

export default function TaMarbutaLesson() {
  const [showAnswers, setShowAnswers] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const quizQuestions = [
    {
      question: "ما هي التاء التي تُنطق هاءً عند الوقف؟",
      options: ["التاء المبسوطة", "التاء المربوطة", "التاء الأصلية", "لا شيء مما سبق"],
      correct: 1
    },
    {
      question: "أي من هذه الكلمات تنتهي بتاء مبسوطة؟",
      options: ["شجرة", "مدرسة", "بنت", "زهرة"],
      correct: 2
    },
    {
      question: "التاء في كلمة 'كتبتْ' هي تاء:",
      options: ["مربوطة", "مبسوطة", "مخفية", "زائدة"],
      correct: 1
    },
    {
      question: "عند تحويل 'معلمة' إلى جمع مؤنث سالم تصبح التاء:",
      options: ["مربوطة", "مبسوطة", "تختفي", "تبقى كما هي"],
      correct: 1
    },
    {
      question: "كلمة 'بيت' تنتهي بتاء مبسوطة لأنها:",
      options: ["اسم مؤنث", "فعل ماض", "اسم ثلاثي ساكن الوسط", "جمع تكسير"],
      correct: 2
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl mb-4">
          <Star size={32} className="fill-rose-400" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">📌 التاء المربوطة والتاء المبسوطة</h1>
        <p className="text-gray-500 font-bold">إتقان الإملاء والكتابة</p>
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
            التاء في اللغة العربية تأتي في آخر الكلمة على شكلين أساسيين، ولكل منهما قاعدة خاصة في الكتابة والنطق.
          </p>
          <p>
            تنقسم التاء إلى نوعين: <span className="text-rose-600 font-bold">التاء المربوطة</span> و <span className="text-indigo-600 font-bold">التاء المبسوطة</span>.
          </p>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 font-medium">
            🎯 الأهمية: التمييز بينهما ضروري جداً للإملاء الصحيح وتجنب الأخطاء الكتابية.
          </div>
        </div>
      </section>

      {/* 3. Rule */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <ListChecks size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">3. القاعدة</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tied T Rule */}
          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border-t-8 border-rose-400 shadow-sm">
            <h3 className="text-xl font-bold text-rose-700 mb-4 flex items-center gap-2">
              🌸 التاء المربوطة (ة)
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li><span className="font-bold">تعريفها:</span> تُكتب (ة) وتُنطق هاءً عند الوقف.</li>
              <li><span className="font-bold">المواضع:</span> تأتي غالباً في نهاية الأسماء المؤنثة.</li>
              <li className="p-2 bg-rose-50 rounded-lg italic">مثال: مَدْرَسَة، شَجَرَة، زَهْرَة.</li>
            </ul>
          </motion.div>

          {/* Open T Rule */}
          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border-t-8 border-indigo-400 shadow-sm">
            <h3 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
              🔵 التاء المبسوطة (ت)
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li><span className="font-bold">تعريفها:</span> تُكتب (ت) وتُنطق تاءً في جميع الحالات.</li>
              <li><span className="font-bold">المواضع:</span> تأتي في الأفعال والأسماء.</li>
              <li className="p-2 bg-indigo-50 rounded-lg italic">مثال: بِنْت، كَتَبَتْ، خَرَجَتْ.</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 4. Distinguishing Method */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <HelpCircle size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">4. طريقة التمييز</h2>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0 font-bold">1</div>
            <div>
              <p className="font-bold text-lg mb-2">تحويل الكلمة إلى جمع:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>إذا ظهرت تاء في الجمع السالم (طالبة {"->"} طالبات) ← مربوطة في المفرد.</li>
                <li>إذا بقيت تاء في الجمع (بيت {"->"} بيوت) ← مبسوطة.</li>
              </ul>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0 font-bold">2</div>
            <div>
              <p className="font-bold text-lg mb-2">ملاحظة نوع الكلمة:</p>
              <p className="text-gray-600">الأفعال دائماً تنتهي بتاء مبسوطة (لعبت، قرأت)، بينما الأسماء المؤنثة المفردة تنتهي بتاء مربوطة (قصة، لوحة).</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Comparison */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
            <Layers size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">5. مقارنة مبسطة</h2>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 border-b">وجه المقارنة</th>
                <th className="p-4 border-b text-rose-600">التاء المربوطة (ة)</th>
                <th className="p-4 border-b text-indigo-600">التاء المبسوطة (ت)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b font-bold">الشكل</td>
                <td className="p-4 border-b text-2xl">ـة / ة</td>
                <td className="p-4 border-b text-2xl">ـت / ت</td>
              </tr>
              <tr>
                <td className="p-4 border-b font-bold">النطق</td>
                <td className="p-4 border-b">هاء عند الوقف / تاء عند الوصل</td>
                <td className="p-4 border-b">تاء في جميع الحالات</td>
              </tr>
              <tr>
                <td className="p-4 border-b font-bold">المواضع</td>
                <td className="p-4 border-b">الأسماء المفردة المؤنثة</td>
                <td className="p-4 border-b">الأفعال، جمع المؤنث السالم</td>
              </tr>
              <tr>
                <td className="p-4 border-b font-bold">الأمثلة</td>
                <td className="p-4 border-b italic">حديقة، مدرسة</td>
                <td className="p-4 border-b italic">بنت، لعبت</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Applied Examples */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
            <Eye size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">6. أمثلة تطبيقية</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-rose-600 mb-4 flex items-center gap-2">🌸 تاء مربوطة</h3>
            <div className="space-y-2">
              {['مَدْرَسَةٌ', 'شَجَرَةٌ', 'زَهْرَةٌ', 'قِصَّةٌ', 'فَاطِمَةُ'].map(w => (
                <div key={w} className="p-3 bg-rose-50 rounded-xl font-bold text-xl text-center">{w}</div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-indigo-600 mb-4 flex items-center gap-2">🔵 تاء مبسوطة</h3>
            <div className="space-y-2">
              {['بِنْتٌ', 'كَتَبَتْ', 'خَرَجَتْ', 'بَيْتٌ', 'مُعَلِّمَاتٌ'].map(w => (
                <div key={w} className="p-3 bg-indigo-50 rounded-xl font-bold text-xl text-center">{w}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Interactive Activity */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
              <PenTool size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">7. نشاط تفاعلي</h2>
          </div>
          <button 
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
          >
            {showAnswers ? <><EyeOff size={18} /> إخفاء الحل</> : <><Eye size={18} /> إظهار الحل</>}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-4">صنّف الكلمات التالية: (حديقة، زيت، سيارة، مهندسات)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 min-h-[80px]">
                <span className="text-xs font-bold text-rose-600 block mb-2">مربوطة</span>
                {showAnswers && <div className="font-bold text-lg">حديقة، سيارة</div>}
              </div>
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 min-h-[80px]">
                <span className="text-xs font-bold text-indigo-600 block mb-2">مبسوطة</span>
                {showAnswers && <div className="font-bold text-lg">زيت، مهندسات</div>}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-4">أكمل الكلمات بالحرف المناسب (ة / ت):</h4>
            <div className="space-y-2 text-lg">
              <p>1. قطـ.... (حيوان أليف)</p>
              <p>2. حو.... (يعيش في البحر)</p>
              {showAnswers && <div className="mt-2 text-emerald-600 font-bold">الحل: 1. قطة | 2. حوت</div>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-4">صحّح الكلمات الخاطئة:</h4>
            <div className="flex gap-4">
              <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 font-bold">مدرساتة</div>
              <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 font-bold">بنتة</div>
              {showAnswers && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold">التصحيح: مدرسات، بنت</div>}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Common Errors */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">8. الأخطاء الشائعة</h2>
        </div>
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-red-200 text-red-700 rounded-full flex items-center justify-center shrink-0 mt-1">!</div>
            <p className="text-red-800 font-medium"><span className="font-bold">كتابة التاء المربوطة مكان المبسوطة والعكس:</span> مثل كتابة "لعبتة" بدلاً من "لعبت".</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-red-200 text-red-700 rounded-full flex items-center justify-center shrink-0 mt-1">!</div>
            <p className="text-red-800 font-medium"><span className="font-bold">نسيان الفرق في النطق:</span> عدم اختبار الكلمة عند الوقف لمعرفة نوع التاء.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-red-200 text-red-700 rounded-full flex items-center justify-center shrink-0 mt-1">!</div>
            <p className="text-red-800 font-medium"><span className="font-bold">الاعتماد على الشكل فقط:</span> كتابة التاء بناءً على الشكل دون فهم القاعدة اللغوية.</p>
          </div>
        </div>
      </section>

      {/* 9. Final Quiz */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">9. تقويم ختامي</h2>
        </div>

        {!quizStarted && !showQuizResult ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
            <h3 className="text-2xl font-bold mb-4">هل أنت مستعد للاختبار القصير؟</h3>
            <p className="text-gray-500 mb-8">5 أسئلة لقياس مدى استيعابك للدرس</p>
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
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl text-right">
                <p className="font-bold mb-2">📝 سؤال تطبيقي:</p>
                <p className="text-gray-600 italic">اكتب 3 كلمات مربوطة و3 مبسوطة في دفترك وراجعها مع القاعدة.</p>
              </div>
              <button 
                onClick={resetQuiz}
                className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all"
              >
                <RotateCcw size={20} />
                إعادة الاختبار
              </button>
            </div>
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

      {/* 10. Goal */}
      <section className="mb-12">
        <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-400" /> 10. هدف الدرس
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
              <div className="text-emerald-400 font-bold mb-2">1</div>
              <p className="text-sm">إتقان التمييز بين نوعي التاء عند الكتابة.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
              <div className="text-emerald-400 font-bold mb-2">2</div>
              <p className="text-sm">تحسين الكتابة الإملائية السليمة في النصوص.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
              <div className="text-emerald-400 font-bold mb-2">3</div>
              <p className="text-sm">تقليل الأخطاء الشائعة المرتبطة بالتاء في آخر الكلمة.</p>
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
