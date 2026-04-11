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
  History, 
  ListChecks, 
  Star, 
  Trophy, 
  RotateCcw, 
  PenTool, 
  Target,
  GanttChartSquare,
  Quote,
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function PastTenseVerbLesson() {
  const [showAnswers, setShowAnswers] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const quizQuestions = [
    {
      question: "ما هي علامة بناء الفعل 'ذَهَبَ'؟",
      options: ["السكون", "الفتح الظاهر", "الضم", "الكسر"],
      correct: 1
    },
    {
      question: "يُبنى الفعل الماضي على السكون إذا اتصل بـ:",
      options: ["واو الجماعة", "ألف الاثنين", "تاء الفاعل", "ياء المخاطبة"],
      correct: 2
    },
    {
      question: "ما هو إعراب 'خَرَجوا'؟",
      options: ["مبني على الفتح", "مبني على السكون", "مبني على الضم", "معرب مرفوع"],
      correct: 2
    },
    {
      question: "الفعل 'قَرَأْنَ' مبني على السكون لاتصاله بـ:",
      options: ["تاء التأنيث", "نون النسوة", "نا الفاعلين", "ألف الاثنين"],
      correct: 1
    },
    {
      question: "يُبنى الفعل الماضي على الفتح إذا اتصل بـ:",
      options: ["واو الجماعة", "نون النسوة", "ألف الاثنين", "تاء الفاعل"],
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
          <History size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">📌 الفعل الماضي وإعرابه</h1>
        <p className="text-gray-500 font-bold">تعلم حالات بناء الفعل الماضي ونماذج إعرابه</p>
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
            <span className="font-bold text-indigo-600">الفعل الماضي:</span> هو كل فعل يدل على حدث وقع في الزمن الماضي وانتهى.
          </p>
          <div className="p-4 bg-indigo-50 rounded-xl border-r-4 border-indigo-500 text-indigo-900">
            💡 القاعدة الذهبية: الفعل الماضي <span className="font-bold underline">مبني دائماً</span>، أي أن حركة آخره ثابتة لا تتغير بتغير موقعه في الجملة، ولكنها تتغير حسب ما يتصل به من ضمائر.
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
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
              <Star size={24} />
            </div>
            <div>
              <p className="text-lg text-gray-700 leading-relaxed">
                يُبنى الفعل الماضي على ثلاث حركات أساسية: <span className="font-bold text-emerald-600">الفتح</span>، <span className="font-bold text-emerald-600">السكون</span>، و <span className="font-bold text-emerald-600">الضم</span>.
              </p>
              <p className="mt-2 text-gray-500 italic">يختلف بناء الفعل الماضي باختلاف الضمائر المتصلة به كما سنرى في الحالات التالية.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Construction Cases */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
            <GanttChartSquare size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">4. حالات بناء الفعل الماضي</h2>
        </div>

        <div className="space-y-6">
          {/* Case 1 */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-3xl border-r-8 border-blue-400 shadow-sm">
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">📘 الحالة 1: البناء على الفتح (الأساسي)</h3>
            <p className="text-gray-600 mb-3">يُبنى على الفتح إذا لم يتصل به شيء أو اتصلت به تاء التأنيث أو ألف الاثنين.</p>
            <div className="bg-blue-50 p-4 rounded-2xl">
              <p className="font-bold text-lg mb-1">مثال: كَتَبَ</p>
              <p className="text-sm text-blue-800"><span className="font-bold">الإعراب:</span> فعل ماضٍ مبني على الفتح الظاهر على آخره.</p>
            </div>
          </motion.div>

          {/* Case 2 */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-3xl border-r-8 border-rose-400 shadow-sm">
            <h3 className="text-xl font-bold text-rose-700 mb-4 flex items-center gap-2">📘 الحالة 2: اتصاله بتاء الفاعل</h3>
            <p className="text-gray-600 mb-3">يُبنى على السكون إذا اتصلت به تاء الفاعل المتحركة.</p>
            <div className="bg-rose-50 p-4 rounded-2xl">
              <p className="font-bold text-lg mb-1">مثال: كَتَبْتُ / كَتَبْتَ / كَتَبْتِ</p>
              <p className="text-sm text-rose-800"><span className="font-bold">الإعراب:</span> فعل ماضٍ مبني على السكون لاتصاله بتاء الفاعل.</p>
            </div>
          </motion.div>

          {/* Case 3 */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-3xl border-r-8 border-emerald-400 shadow-sm">
            <h3 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">📘 الحالة 3: اتصاله بنون النسوة</h3>
            <p className="text-gray-600 mb-3">يُبنى على السكون إذا اتصلت به نون النسوة.</p>
            <div className="bg-emerald-50 p-4 rounded-2xl">
              <p className="font-bold text-lg mb-1">مثال: كَتَبْنَ</p>
              <p className="text-sm text-emerald-800"><span className="font-bold">الإعراب:</span> فعل ماضٍ مبني على السكون لاتصاله بنون النسوة.</p>
            </div>
          </motion.div>

          {/* Case 4 */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-3xl border-r-8 border-amber-400 shadow-sm">
            <h3 className="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2">📘 الحالة 4: اتصاله بألف الاثنين</h3>
            <p className="text-gray-600 mb-3">يُبنى على الفتح إذا اتصلت به ألف الاثنين.</p>
            <div className="bg-amber-50 p-4 rounded-2xl">
              <p className="font-bold text-lg mb-1">مثال: كَتَبَا</p>
              <p className="text-sm text-amber-800"><span className="font-bold">الإعراب:</span> فعل ماضٍ مبني على الفتح لاتصاله بألف الاثنين.</p>
            </div>
          </motion.div>

          {/* Case 5 */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-3xl border-r-8 border-purple-400 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">📘 الحالة 5: اتصاله بواو الجماعة</h3>
            <p className="text-gray-600 mb-3">يُبنى على الضم إذا اتصلت به واو الجماعة.</p>
            <div className="bg-purple-50 p-4 rounded-2xl">
              <p className="font-bold text-lg mb-1">مثال: كَتَبُوا</p>
              <p className="text-sm text-purple-800"><span className="font-bold">الإعراب:</span> فعل ماضٍ مبني على الضم لاتصاله بواو الجماعة.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Summary Table */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
            <Layers size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">5. جدول تلخيصي</h2>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 border-b">الحالة</th>
                <th className="p-4 border-b">علامة البناء</th>
                <th className="p-4 border-b">المثال</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b">لم يتصل به شيء</td>
                <td className="p-4 border-b font-bold text-blue-600">الفتح</td>
                <td className="p-4 border-b italic">ذَهَبَ</td>
              </tr>
              <tr>
                <td className="p-4 border-b">اتصل بـ (تاء الفاعل)</td>
                <td className="p-4 border-b font-bold text-rose-600">السكون</td>
                <td className="p-4 border-b italic">ذَهَبْتُ</td>
              </tr>
              <tr>
                <td className="p-4 border-b">اتصل بـ (نون النسوة)</td>
                <td className="p-4 border-b font-bold text-emerald-600">السكون</td>
                <td className="p-4 border-b italic">ذَهَبْنَ</td>
              </tr>
              <tr>
                <td className="p-4 border-b">اتصل بـ (ألف الاثنين)</td>
                <td className="p-4 border-b font-bold text-amber-600">الفتح</td>
                <td className="p-4 border-b italic">ذَهَبَا</td>
              </tr>
              <tr>
                <td className="p-4 border-b">اتصل بـ (واو الجماعة)</td>
                <td className="p-4 border-b font-bold text-purple-600">الضم</td>
                <td className="p-4 border-b italic">ذَهَبُوا</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Solved Examples */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
            <Eye size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">6. أمثلة تطبيقية محلولة</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="text-2xl font-black mb-2">ذَهَبَ</div>
            <div className="text-sm text-blue-600 font-bold">مبني على الفتح</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="text-2xl font-black mb-2">ذَهَبُوا</div>
            <div className="text-sm text-purple-600 font-bold">مبني على الضم</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="text-2xl font-black mb-2">ذَهَبْتُ</div>
            <div className="text-sm text-rose-600 font-bold">مبني على السكون</div>
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
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-6">📝 تمرين 1: أعرب الأفعال التالية (تخيل الإعراب في ذهنك)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['كَتَبَ', 'كَتَبُوا', 'كَتَبْتُ', 'كَتَبْنَ'].map(word => (
                <div key={word} className="p-4 bg-gray-50 rounded-2xl text-center">
                  <div className="text-xl font-bold mb-2">{word}</div>
                  {showAnswers && (
                    <div className="text-xs text-emerald-600 font-bold">
                      {word === 'كَتَبَ' ? 'مبني على الفتح' : 
                       word === 'كَتَبُوا' ? 'مبني على الضم' : 
                       'مبني على السكون'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-6">📝 تمرين 2: صنّف الأفعال حسب حالة بنائها</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 min-h-[100px]">
                <span className="text-xs font-bold text-blue-600 block mb-2">على الفتح</span>
                {showAnswers && <div className="font-bold">قَرَأَ، قَرَأا</div>}
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 min-h-[100px]">
                <span className="text-xs font-bold text-rose-600 block mb-2">على السكون</span>
                {showAnswers && <div className="font-bold">قَرَأْتُ، قَرَأْنَ</div>}
              </div>
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 min-h-[100px]">
                <span className="text-xs font-bold text-purple-600 block mb-2">على الضم</span>
                {showAnswers && <div className="font-bold">قَرَأُوا</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final Quiz */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">8. التقويم الختامي</h2>
        </div>

        {!quizStarted && !showQuizResult ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
            <h3 className="text-2xl font-bold mb-4">هل أنت مستعد لاختبار الإعراب؟</h3>
            <p className="text-gray-500 mb-8">5 أسئلة لقياس مدى إتقانك لإعراب الفعل الماضي</p>
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
            <h3 className="text-3xl font-bold mb-2">رائع!</h3>
            <p className="text-gray-500 mb-6">لقد أكملت اختبار الفعل الماضي</p>
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

      {/* 9. Goal */}
      <section className="mb-12">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target size={24} className="text-emerald-600" /> 9. هدف الدرس
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold">فهم الفعل الماضي كفعل مبني دائماً.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold">التمييز بين حالات بنائه المختلفة (فتح، سكون، ضم).</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold">إتقان الإعراب التطبيقي للفعل الماضي في الجمل.</p>
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
