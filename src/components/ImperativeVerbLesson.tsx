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
  Zap, 
  ListChecks, 
  Star, 
  Trophy, 
  RotateCcw, 
  PenTool, 
  Target,
  MessageSquare,
  Layers,
  GanttChartSquare
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function ImperativeVerbLesson() {
  const [showAnswers, setShowAnswers] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const quizQuestions = [
    {
      question: "ما هي علامة بناء فعل الأمر 'اقْرَأْ'؟",
      options: ["الفتح", "السكون", "حذف النون", "الضم"],
      correct: 1
    },
    {
      question: "يُبنى فعل الأمر على حذف النون إذا اتصل بـ:",
      options: ["تاء الفاعل", "نون النسوة", "واو الجماعة", "لم يتصل به شيء"],
      correct: 2
    },
    {
      question: "ما هو إعراب 'اجْتَهِدِي'؟",
      options: ["مبني على السكون", "مبني على الفتح", "مبني على حذف النون", "مرفوع بالضمة"],
      correct: 2
    },
    {
      question: "فعل الأمر 'اسْمَعَا' مبني على:",
      options: ["السكون", "حذف النون", "الفتح", "حذف حرف العلة"],
      correct: 1
    },
    {
      question: "فعل الأمر يدل على طلب القيام بفعل في:",
      options: ["الماضي", "الحاضر فقط", "المستقبل", "الماضي والحاضر"],
      correct: 2
    },
    {
      question: "ما علامة بناء 'سَافِرُوا'؟",
      options: ["الضم", "حذف النون", "السكون", "الواو"],
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl mb-4">
          <MessageSquare size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">📌 فعل الأمر وإعرابه</h1>
        <p className="text-gray-500 font-bold">تعلم حالات بناء فعل الأمر ونماذج إعرابه</p>
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
            <span className="font-bold text-orange-600">فعل الأمر:</span> هو فعل يدل على طلب القيام بعمل معين في الزمن المستقبل.
          </p>
          <div className="p-4 bg-orange-50 rounded-xl border-r-4 border-orange-500 text-orange-900">
            💡 قاعدة أساسية: فعل الأمر <span className="font-bold underline">مبني دائماً</span> ولا يُعرب أبداً، أي أنه لا يكون مرفوعاً أو منصوباً أو مجزوماً.
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
                يُبنى فعل الأمر على ما يُجزم به مضارعه. وعلامات بنائه هي:
              </p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-2 text-gray-700 font-bold">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span>السكون (للفعل المفرد الصحيح).</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700 font-bold">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span>حذف النون (إذا اتصل بألف الاثنين، واو الجماعة، أو ياء المخاطبة).</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 italic">
                  <CheckCircle2 size={18} className="text-gray-400" />
                  <span>حذف حرف العلة (إذا كان معتل الآخر - سنتناوله لاحقاً).</span>
                </li>
              </ul>
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
          <h2 className="text-2xl font-bold text-gray-800">4. حالات بناء فعل الأمر مع النماذج</h2>
        </div>

        <div className="space-y-6">
          {/* Case 1 */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-3xl border-r-8 border-blue-400 shadow-sm">
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">📘 الحالة 1: الفعل المفرد</h3>
            <p className="text-gray-600 mb-3">يُبنى على السكون إذا كان صحيح الآخر ولم يتصل به شيء.</p>
            <div className="bg-blue-50 p-4 rounded-2xl">
              <p className="font-bold text-lg mb-1">مثال: اكْتُبْ</p>
              <p className="text-sm text-blue-800"><span className="font-bold">الإعراب:</span> فعل أمر مبني على السكون الظاهر على آخره.</p>
            </div>
          </motion.div>

          {/* Case 2 */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-3xl border-r-8 border-emerald-400 shadow-sm">
            <h3 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">📘 الحالة 2: اتصاله بألف الاثنين</h3>
            <p className="text-gray-600 mb-3">يُبنى على حذف النون إذا اتصلت به ألف الاثنين.</p>
            <div className="bg-emerald-50 p-4 rounded-2xl">
              <p className="font-bold text-lg mb-1">مثال: اكْتُبَا</p>
              <p className="text-sm text-emerald-800"><span className="font-bold">الإعراب:</span> فعل أمر مبني على حذف النون لأنه اتصل بألف الاثنين.</p>
            </div>
          </motion.div>

          {/* Case 3 */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-3xl border-r-8 border-purple-400 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">📘 الحالة 3: اتصاله بواو الجماعة</h3>
            <p className="text-gray-600 mb-3">يُبنى على حذف النون إذا اتصلت به واو الجماعة.</p>
            <div className="bg-purple-50 p-4 rounded-2xl">
              <p className="font-bold text-lg mb-1">مثال: اكْتُبُوا</p>
              <p className="text-sm text-purple-800"><span className="font-bold">الإعراب:</span> فعل أمر مبني على حذف النون لاتصاله بواو الجماعة.</p>
            </div>
          </motion.div>

          {/* Case 4 */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-3xl border-r-8 border-rose-400 shadow-sm">
            <h3 className="text-xl font-bold text-rose-700 mb-4 flex items-center gap-2">📘 الحالة 4: اتصاله بياء المخاطبة</h3>
            <p className="text-gray-600 mb-3">يُبنى على حذف النون إذا اتصلت به ياء المخاطبة.</p>
            <div className="bg-rose-50 p-4 rounded-2xl">
              <p className="font-bold text-lg mb-1">مثال: اكْتُبِي</p>
              <p className="text-sm text-rose-800"><span className="font-bold">الإعراب:</span> فعل أمر مبني على حذف النون لاتصاله بياء المخاطبة.</p>
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
                <td className="p-4 border-b">المفرد (صحيح الآخر)</td>
                <td className="p-4 border-b font-bold text-blue-600">السكون</td>
                <td className="p-4 border-b italic">اقْرَأْ</td>
              </tr>
              <tr>
                <td className="p-4 border-b">اتصال بـ (ألف الاثنين)</td>
                <td className="p-4 border-b font-bold text-emerald-600">حذف النون</td>
                <td className="p-4 border-b italic">اقْرَأَا</td>
              </tr>
              <tr>
                <td className="p-4 border-b">اتصال بـ (واو الجماعة)</td>
                <td className="p-4 border-b font-bold text-purple-600">حذف النون</td>
                <td className="p-4 border-b italic">اقْرَأُوا</td>
              </tr>
              <tr>
                <td className="p-4 border-b">اتصال بـ (ياء المخاطبة)</td>
                <td className="p-4 border-b font-bold text-rose-600">حذف النون</td>
                <td className="p-4 border-b italic">اقْرَئِي</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Solved Examples */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <Eye size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">6. أمثلة تطبيقية محلولة</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="text-2xl font-black mb-2">اسْمَعْ</div>
            <div className="text-sm text-blue-600 font-bold">مبني على السكون</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="text-2xl font-black mb-2">اسْمَعُوا</div>
            <div className="text-sm text-purple-600 font-bold">مبني على حذف النون</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="text-2xl font-black mb-2">اسْمَعِي</div>
            <div className="text-sm text-rose-600 font-bold">مبني على حذف النون</div>
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
              {['احْفَظْ', 'احْفَظُوا', 'احْفَظِي', 'احْفَظَا'].map(word => (
                <div key={word} className="p-4 bg-gray-50 rounded-2xl text-center">
                  <div className="text-xl font-bold mb-2">{word}</div>
                  {showAnswers && (
                    <div className="text-xs text-emerald-600 font-bold">
                      {word === 'احْفَظْ' ? 'مبني على السكون' : 'مبني على حذف النون'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-6">📝 تمرين 2: صنّف الأفعال حسب حالة البناء</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 min-h-[100px]">
                <span className="text-xs font-bold text-blue-600 block mb-2">على السكون</span>
                {showAnswers && <div className="font-bold">انْظُرْ، اجْلِسْ، افْهَمْ</div>}
              </div>
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 min-h-[100px]">
                <span className="text-xs font-bold text-purple-600 block mb-2">على حذف النون</span>
                {showAnswers && <div className="font-bold">انْظُرُوا، اجْلِسَا، افْهَمِي</div>}
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
            <h3 className="text-2xl font-bold mb-4">هل أنت مستعد لاختبار فعل الأمر؟</h3>
            <p className="text-gray-500 mb-8">6 أسئلة لقياس مدى إتقانك لإعراب فعل الأمر</p>
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
            <h3 className="text-3xl font-bold mb-2">مبدع!</h3>
            <p className="text-gray-500 mb-6">لقد أكملت اختبار فعل الأمر بنجاح</p>
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
              <p className="text-sm font-bold">فهم فعل الأمر كفعل مبني دائماً.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold">التمييز بين حالات بنائه المختلفة (سكون، حذف نون).</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold">إتقان الإعراب التطبيقي لفعل الأمر في الجمل.</p>
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
