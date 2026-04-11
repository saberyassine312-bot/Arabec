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
  Clock, 
  ListChecks, 
  Star, 
  Trophy, 
  RotateCcw, 
  PenTool, 
  Target,
  Zap,
  Quote,
  Layers,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function PresentTenseVerbLesson() {
  const [showAnswers, setShowAnswers] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const quizQuestions = [
    {
      question: "ما هو إعراب الفعل في جملة 'يَشْرَبُ الطِّفْلُ اللَّبَنَ'؟",
      options: ["منصوب بالفتحة", "مرفوع بالضمة", "مجزوم بالسكون", "مبني على الفتح"],
      correct: 1
    },
    {
      question: "أي من الأدوات التالية تجزم الفعل المضارع؟",
      options: ["لَنْ", "كَيْ", "لَمْ", "أَنْ"],
      correct: 2
    },
    {
      question: "ما علامة إعراب الفعل في 'لَنْ يَنْجَحَ الكَسُولُ'؟",
      options: ["الضمة", "السكون", "الفتحة", "حذف النون"],
      correct: 2
    },
    {
      question: "يُبنى الفعل المضارع على السكون إذا اتصل بـ:",
      options: ["نون التوكيد", "نون النسوة", "واو الجماعة", "ألف الاثنين"],
      correct: 1
    },
    {
      question: "ما إعراب 'لَا تَهْمِلْ وَاجِبَكَ'؟",
      options: ["مرفوع بالضمة", "منصوب بالفتحة", "مجزوم بالسكون", "مبني على السكون"],
      correct: 2
    },
    {
      question: "إعراب الفعل 'ليَكْتُبَنَّ' هو:",
      options: ["مرفوع بالضمة", "مبني على الفتح", "مبني على السكون", "منصوب بالفتحة"],
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-4">
          <Clock size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">📌 الفعل المضارع وإعرابه</h1>
        <p className="text-gray-500 font-bold">تعلم حالات الرفع والنصب والجزم والبناء للمضارع</p>
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
            <span className="font-bold text-blue-600">الفعل المضارع:</span> هو فعل يدل على حدث يقع في الزمن الحاضر أو المستقبل.
          </p>
          <div className="p-4 bg-blue-50 rounded-xl border-r-4 border-blue-500 text-blue-900">
            💡 معلومة هامة: الفعل المضارع هو الفعل الوحيد <span className="font-bold underline">المعرب</span> في الأصل (أي يتغير آخره)، ولكنه قد يأتي مبنياً في حالات خاصة.
          </div>
        </div>
      </section>

      {/* 3. Basic Rule */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <ListChecks size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">3. القاعدة الأساسية</h2>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-lg text-gray-700 leading-relaxed">
                يكون الفعل المضارع <span className="font-bold text-emerald-600">معرباً</span> (مرفوعاً أو منصوباً أو مجزوماً) ما لم يتصل به:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span>نون النسوة (يُبنى حينها على السكون).</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span>نون التوكيد (يُبنى حينها على الفتح).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Inflection Cases */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
            <Activity size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">4. إعراب الفعل المضارع مع النماذج</h2>
        </div>

        <div className="space-y-6">
          {/* Case 1: Nominative */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-3xl border-r-8 border-blue-400 shadow-sm">
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">📘 أولاً: حالة الرفع</h3>
            <p className="text-gray-600 mb-3">يُرفع المضارع إذا لم تسبقه أداة نصب أو جزم.</p>
            <div className="bg-blue-50 p-4 rounded-2xl">
              <p className="font-bold text-lg mb-1">مثال: يَكْتُبُ</p>
              <p className="text-sm text-blue-800"><span className="font-bold">الإعراب:</span> فعل مضارع مرفوع وعلامة رفعه الضمة الظاهرة.</p>
            </div>
          </motion.div>

          {/* Case 2: Accusative */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-3xl border-r-8 border-emerald-400 shadow-sm">
            <h3 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">📘 ثانياً: حالة النصب</h3>
            <p className="text-gray-600 mb-3">يُنصب إذا سبقته إحدى أدوات النصب: <span className="font-bold">(أَنْ، لَنْ، كَيْ، حَتَّى، لام التعليل)</span>.</p>
            <div className="bg-emerald-50 p-4 rounded-2xl">
              <p className="font-bold text-lg mb-1">مثال: لَنْ يَكْتُبَ</p>
              <p className="text-sm text-emerald-800"><span className="font-bold">الإعراب:</span> فعل مضارع منصوب وعلامة نصبه الفتحة الظاهرة.</p>
            </div>
          </motion.div>

          {/* Case 3: Jussive */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-3xl border-r-8 border-rose-400 shadow-sm">
            <h3 className="text-xl font-bold text-rose-700 mb-4 flex items-center gap-2">📘 ثالثاً: حالة الجزم</h3>
            <p className="text-gray-600 mb-3">يُجزم إذا سبقته إحدى أدوات الجزم: <span className="font-bold">(لَمْ، لَا الناهية، لَام الأمر)</span>.</p>
            <div className="bg-rose-50 p-4 rounded-2xl">
              <p className="font-bold text-lg mb-1">مثال: لَمْ يَكْتُبْ</p>
              <p className="text-sm text-rose-800"><span className="font-bold">الإعراب:</span> فعل مضارع مجزوم وعلامة جزمه السكون.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Special Cases (Building) */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">5. حالات خاصة (البناء)</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-amber-600 mb-4 flex items-center gap-2">📌 نون النسوة</h3>
            <p className="text-gray-600 mb-4">يُبنى على السكون عند اتصاله بنون النسوة.</p>
            <div className="p-4 bg-amber-50 rounded-2xl">
              <p className="font-bold mb-1">مثال: يَكْتُبْنَ</p>
              <p className="text-xs text-amber-800">فعل مضارع مبني على السكون.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-amber-600 mb-4 flex items-center gap-2">📌 نون التوكيد</h3>
            <p className="text-gray-600 mb-4">يُبنى على الفتح عند اتصاله بنون التوكيد.</p>
            <div className="p-4 bg-amber-50 rounded-2xl">
              <p className="font-bold mb-1">مثال: لَيَكْتُبَنَّ</p>
              <p className="text-xs text-amber-800">فعل مضارع مبني على الفتح.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Summary Table */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
            <Layers size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">6. جدول تلخيصي</h2>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 border-b">الحالة</th>
                <th className="p-4 border-b">الإعراب / البناء</th>
                <th className="p-4 border-b">المثال</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b">الرفع</td>
                <td className="p-4 border-b font-bold text-blue-600">الضمة الظاهرة</td>
                <td className="p-4 border-b italic">يَكْتُبُ</td>
              </tr>
              <tr>
                <td className="p-4 border-b">النصب</td>
                <td className="p-4 border-b font-bold text-emerald-600">الفتحة الظاهرة</td>
                <td className="p-4 border-b italic">لَنْ يَكْتُبَ</td>
              </tr>
              <tr>
                <td className="p-4 border-b">الجزم</td>
                <td className="p-4 border-b font-bold text-rose-600">السكون</td>
                <td className="p-4 border-b italic">لَمْ يَكْتُبْ</td>
              </tr>
              <tr>
                <td className="p-4 border-b">اتصال بنون النسوة</td>
                <td className="p-4 border-b font-bold text-amber-600">مبني على السكون</td>
                <td className="p-4 border-b italic">يَكْتُبْنَ</td>
              </tr>
              <tr>
                <td className="p-4 border-b">اتصال بنون التوكيد</td>
                <td className="p-4 border-b font-bold text-amber-600">مبني على الفتح</td>
                <td className="p-4 border-b italic">لَيَكْتُبَنَّ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Solved Examples */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <Eye size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">7. أمثلة تطبيقية محلولة</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="text-2xl font-black mb-2">يَكْتُبُ</div>
            <div className="text-sm text-blue-600 font-bold">مرفوع بالضمة</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="text-2xl font-black mb-2">لَنْ يَكْتُبَ</div>
            <div className="text-sm text-emerald-600 font-bold">منصوب بالفتحة</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="text-2xl font-black mb-2">لَمْ يَكْتُبْ</div>
            <div className="text-sm text-rose-600 font-bold">مجزوم بالسكون</div>
          </div>
        </div>
      </section>

      {/* 8. Interactive Activity */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
              <PenTool size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">8. نشاط تفاعلي</h2>
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
            <h4 className="font-bold mb-6">📝 تمرين 1: أعرب الأفعال التالية (تخيل الإعراب في ذهنك)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['يَكْتُبُ', 'لَنْ يَكْتُبَ', 'لَمْ يَكْتُبْ', 'يَكْتُبْنَ'].map(word => (
                <div key={word} className="p-4 bg-gray-50 rounded-2xl text-center">
                  <div className="text-xl font-bold mb-2">{word}</div>
                  {showAnswers && (
                    <div className="text-xs text-emerald-600 font-bold">
                      {word === 'يَكْتُبُ' ? 'مرفوع بالضمة' : 
                       word === 'لَنْ يَكْتُبَ' ? 'منصوب بالفتحة' : 
                       word === 'لَمْ يَكْتُبْ' ? 'مجزوم بالسكون' :
                       'مبني على السكون'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-6">📝 تمرين 2: صنّف الأفعال حسب حالتها الإعرابية</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 min-h-[100px]">
                <span className="text-xs font-bold text-blue-600 block mb-2">حالة الرفع</span>
                {showAnswers && <div className="font-bold">يَلْعَبُ، يَقْرَأُ</div>}
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 min-h-[100px]">
                <span className="text-xs font-bold text-emerald-600 block mb-2">حالة النصب</span>
                {showAnswers && <div className="font-bold">أَنْ يَلْعَبَ، لَنْ يَقْرَأَ</div>}
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 min-h-[100px]">
                <span className="text-xs font-bold text-rose-600 block mb-2">حالة الجزم</span>
                {showAnswers && <div className="font-bold">لَمْ يَلْعَبْ، لَا تَقْرَأْ</div>}
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
            <h3 className="text-2xl font-bold mb-4">هل أنت مستعد لاختبار إعراب المضارع؟</h3>
            <p className="text-gray-500 mb-8">6 أسئلة لقياس مدى إتقانك لحالات الفعل المضارع</p>
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
            <h3 className="text-3xl font-bold mb-2">ممتاز!</h3>
            <p className="text-gray-500 mb-6">لقد أكملت اختبار الفعل المضارع</p>
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
              <p className="text-sm font-bold">فهم الفعل المضارع وحالات إعرابه وبنائه.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold">التمييز بين الرفع والنصب والجزم وأدوات كل منها.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold">إتقان الإعراب التطبيقي للمضارع في مختلف السياقات.</p>
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
