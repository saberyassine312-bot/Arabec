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
  Layers, 
  Star, 
  Trophy, 
  RotateCcw, 
  PenTool, 
  Target,
  Wind,
  Leaf
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function VerbClassificationLesson() {
  const [showAnswers, setShowAnswers] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const quizQuestions = [
    {
      question: "ما نوع الفعل 'قَالَ'؟",
      options: ["صحيح سالم", "معتل أجوف", "معتل ناقص", "صحيح مهموز"],
      correct: 1
    },
    {
      question: "الفعل 'أَخَذَ' هو فعل:",
      options: ["صحيح سالم", "صحيح مهموز", "معتل مثال", "لفيف مقرون"],
      correct: 1
    },
    {
      question: "الفعل الذي آخره حرف علة يسمى:",
      options: ["أجوف", "مثال", "ناقص", "سالم"],
      correct: 2
    },
    {
      question: "ما نوع الفعل 'وَقَى'؟",
      options: ["لفيف مقرون", "لفيف مفروق", "معتل مثال", "صحيح مضعف"],
      correct: 1
    },
    {
      question: "الفعل 'دَعَا' هو فعل:",
      options: ["معتل ناقص", "معتل أجوف", "صحيح سالم", "معتل مثال"],
      correct: 0
    },
    {
      question: "الفعل 'شَدَّ' يعتبر فعلاً:",
      options: ["مهموزاً", "سالماً", "مضعفاً", "ناقصاً"],
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-4">
          <Wind size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">📌 تصنيف الأفعال: الصحيح والمعتل</h1>
        <p className="text-gray-500 font-bold">فهم أنواع الأفعال حسب حروفها الأصلية</p>
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
            الفعل في اللغة العربية هو كلمة تدل على حدث مقترن بزمن. وتنقسم الأفعال من حيث نوع حروفها الأصلية إلى قسمين كبيرين:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 text-center font-bold">
              ✅ الأفعال الصحيحة
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-center font-bold">
              ⚠️ الأفعال المعتلة
            </div>
          </div>
          <p className="text-gray-600 text-sm italic">
            الهدف من الدرس: التمييز بين الفعل الصحيح والمعتل ومعرفة أنواع كل منهما بدقة.
          </p>
        </div>
      </section>

      {/* 3. Sound Verbs */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">3. الفعل الصحيح</h2>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="p-4 bg-emerald-50 rounded-xl border-r-4 border-emerald-500">
            <h3 className="font-bold text-emerald-800 mb-2">📘 تعريفه:</h3>
            <p>هو الفعل الذي تخلو حروفه الأصلية من حروف العلة الثلاثة (ا، و، ي).</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-emerald-600 mb-2">السالم</h4>
              <p className="text-sm text-gray-500 mb-2">خالٍ من الهمز والتضعيف.</p>
              <div className="font-bold text-lg">مثل: كَتَبَ، جَلَسَ</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-emerald-600 mb-2">المهموز</h4>
              <p className="text-sm text-gray-500 mb-2">يحتوي على همزة في أصوله.</p>
              <div className="font-bold text-lg">مثل: أَخَذَ، سَأَلَ، قَرَأَ</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-emerald-600 mb-2">المضعّف</h4>
              <p className="text-sm text-gray-500 mb-2">ما كان أحد حروفه مكرراً.</p>
              <div className="font-bold text-lg">مثل: شَدَّ، مَدَّ، زَلْزَلَ</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Weak Verbs */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">4. الفعل المعتل</h2>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="p-4 bg-amber-50 rounded-xl border-r-4 border-amber-500">
            <h3 className="font-bold text-amber-800 mb-2">📘 تعريفه:</h3>
            <p>هو الفعل الذي يحتوي أحد حروفه الأصلية على حرف علة (ا، و، ي).</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-amber-600 mb-2">🌿 المثال</h4>
              <p className="text-sm text-gray-500 mb-2">أوله حرف علة.</p>
              <div className="font-bold text-lg">مثل: وَعَدَ، وَجَدَ</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-amber-600 mb-2">🌿 الأجوف</h4>
              <p className="text-sm text-gray-500 mb-2">وسطه حرف علة.</p>
              <div className="font-bold text-lg">مثل: قَالَ، بَاعَ، نَامَ</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-amber-600 mb-2">🌿 الناقص</h4>
              <p className="text-sm text-gray-500 mb-2">آخره حرف علة.</p>
              <div className="font-bold text-lg">مثل: دَعَا، رَمَى، مَشَى</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Lafeef */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
            <Leaf size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">5. اللفيف</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-purple-600 mb-4 flex items-center gap-2">🌿 اللفيف المفروق</h3>
            <p className="text-gray-600 mb-4">يحتوي حرفي علة بينهما حرف صحيح (مفصولين).</p>
            <div className="p-4 bg-purple-50 rounded-2xl text-center font-bold text-xl">
              مثل: وَقَى، وَعَى
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-purple-600 mb-4 flex items-center gap-2">🌿 اللفيف المقرون</h3>
            <p className="text-gray-600 mb-4">يحتوي حرفي علة متجاورين (مقترنين).</p>
            <div className="p-4 bg-purple-50 rounded-2xl text-center font-bold text-xl">
              مثل: هَوَى، نَوَى، شَوَى
            </div>
          </div>
        </div>
      </section>

      {/* 6. Comparison Table */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
            <Layers size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">6. جدول مقارنة</h2>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 border-b">نوع الفعل</th>
                <th className="p-4 border-b">التعريف</th>
                <th className="p-4 border-b">أمثلة</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-emerald-50/30">
                <td className="p-4 border-b font-bold text-emerald-700">الصحيح</td>
                <td className="p-4 border-b">خالٍ من حروف العلة</td>
                <td className="p-4 border-b italic">كتب، أخذ، شد</td>
              </tr>
              <tr className="bg-amber-50/30">
                <td className="p-4 border-b font-bold text-amber-700">المعتل</td>
                <td className="p-4 border-b">أحد أصوله حرف علة</td>
                <td className="p-4 border-b italic">وعد، قال، دعا</td>
              </tr>
              <tr className="bg-purple-50/30">
                <td className="p-4 border-b font-bold text-purple-700">اللفيف</td>
                <td className="p-4 border-b">فيه حرفا علة</td>
                <td className="p-4 border-b italic">وقى، هوى</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Applied Examples */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <Eye size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">7. أمثلة تطبيقية</h2>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h4 className="font-bold mb-6 text-center">تصنيف مجموعة من الأفعال:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { v: 'كَتَبَ', t: 'صحيح سالم' },
              { v: 'قَالَ', t: 'معتل أجوف' },
              { v: 'وَعَدَ', t: 'معتل مثال' },
              { v: 'دَعَا', t: 'معتل ناقص' },
              { v: 'هَوَى', t: 'لفيف مقرون' },
              { v: 'أَخَذَ', t: 'صحيح مهموز' }
            ].map((item, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                <div className="text-xl font-black mb-1">{item.v}</div>
                <div className="text-xs text-emerald-600 font-bold">{item.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Interactive Exercises */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
              <PenTool size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">8. تمارين تفاعلية</h2>
          </div>
          <button 
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
          >
            {showAnswers ? <><EyeOff size={18} /> إخفاء الحل</> : <><Eye size={18} /> إظهار الحل</>}
          </button>
        </div>

        <div className="space-y-6">
          {/* Exercise 1 */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-6">📝 تمرين 1: صنّف الأفعال التالية حسب نوعها</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-bold">سَأَلَ</span>
                  {showAnswers && <span className="text-emerald-600 font-bold">صحيح مهموز</span>}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-bold">بَاعَ</span>
                  {showAnswers && <span className="text-emerald-600 font-bold">معتل أجوف</span>}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-bold">رَمَى</span>
                  {showAnswers && <span className="text-emerald-600 font-bold">معتل ناقص</span>}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-bold">وَعَى</span>
                  {showAnswers && <span className="text-emerald-600 font-bold">لفيف مفروق</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Exercise 2 */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-6">📝 تمرين 2: اختر نوع الفعل الصحيح</h4>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="mb-3 font-bold">ما نوع الفعل 'مَدَّ'؟</p>
                <div className="flex gap-2">
                  {['سالم', 'مهموز', 'مضعف'].map(opt => (
                    <button key={opt} className={cn("px-4 py-2 rounded-xl border font-bold transition-all", showAnswers && opt === 'مضعف' ? "bg-emerald-500 text-white border-emerald-500" : "bg-white border-gray-200")}>{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Final Quiz */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">9. التقويم الختامي</h2>
        </div>

        {!quizStarted && !showQuizResult ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
            <h3 className="text-2xl font-bold mb-4">هل أنت مستعد للاختبار النهائي؟</h3>
            <p className="text-gray-500 mb-8">6 أسئلة لقياس مدى استيعابك لتصنيف الأفعال</p>
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

      {/* 10. Goal */}
      <section className="mb-12">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target size={24} className="text-emerald-600" /> 10. هدف الدرس
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold">التمييز بين الفعل الصحيح والمعتل بدقة.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold">معرفة أنواع الأفعال الصحيحة والمعتلة في اللغة العربية.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold">تطبيق عملي على تصنيف الأفعال في النصوص.</p>
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
