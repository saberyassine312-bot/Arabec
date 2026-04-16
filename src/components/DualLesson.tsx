import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Zap, 
  ListChecks, 
  Trophy, 
  RotateCcw, 
  PenTool, 
  Target,
  MessageSquare,
  Layers,
  GanttChartSquare,
  HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

import { useNavigate } from 'react-router-dom';

export default function DualLesson() {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const quizQuestions = [
    {
      question: "ما هي علامة رفع المثنى؟",
      options: ["الضمة", "الألف", "الواو", "الياء"],
      correct: 1
    },
    {
      question: "حول كلمة 'قلم' إلى مثنى في حالة النصب:",
      options: ["قلمان", "قلمون", "قلمين", "قلمات"],
      correct: 2
    },
    {
      question: "ما هو مثنى كلمة 'فتى'؟",
      options: ["فتوان", "فتيان", "فتاتان", "فتون"],
      correct: 1
    },
    {
      question: "تُحذف نون المثنى عند:",
      options: ["التعريف بـ 'ال'", "الإضافة", "الرفع", "الجر"],
      correct: 1
    },
    {
      question: "ما هو إعراب 'التلميذان' في جملة 'جاء التلميذان'؟",
      options: ["مبتدأ مرفوع", "فاعل مرفوع بالألف", "مفعول به منصوب", "خبر مرفوع"],
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
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans relative" dir="rtl">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all flex items-center gap-2"
      >
        <ArrowRight size={16} />
        العودة
      </button>

      {/* 1. Title */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl mb-4">
          <BookOpen size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">🟦 المثنى وصيغه</h1>
        <p className="text-gray-500 font-bold">المستوى: الثانية إعدادي | المكون: الدرس اللغوي</p>
      </motion.div>

      {/* 1. Presentation (Problem Situation) */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
            <HelpCircle size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">1- التقديم (الوضعية المشكلة)</h2>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="p-6 bg-indigo-50 rounded-xl border-r-4 border-indigo-500">
            <p className="font-bold text-indigo-900 mb-4">الوضعية:</p>
            <p className="text-lg leading-relaxed text-indigo-800">
              قرأ أحمد الجملتين التاليتين:
              <br />
              * <span className="font-black">جاء التلميذان إلى المدرسة</span>
              <br />
              * <span className="font-black">رأيت التلميذين في الساحة</span>
            </p>
          </div>
          <div className="grid gap-3 mt-4">
            <p className="flex items-center gap-2 text-gray-700">👉 لماذا تغيرت نهاية الكلمة؟</p>
            <p className="flex items-center gap-2 text-gray-700">👉 هل هناك قاعدة تضبط هذا التغيير؟</p>
            <p className="flex items-center gap-2 text-gray-700">👉 كيف نحول الاسم المفرد إلى مثنى؟</p>
          </div>
        </div>
      </section>

      {/* 2. Observation & Discovery */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
            <Eye size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">2- الملاحظة والاكتشاف</h2>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900">🔹 الأمثلة:</h3>
            <ul className="space-y-2 pr-4">
              <li className="text-lg">• حضر <span className="text-emerald-600 font-black">التلميذان</span> إلى القسم</li>
              <li className="text-lg">• شاهدت <span className="text-emerald-600 font-black">التلميذين</span> في الساحة</li>
              <li className="text-lg">• سلمت على <span className="text-emerald-600 font-black">الأستاذين</span></li>
            </ul>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <h3 className="font-bold text-emerald-800 mb-2">👉 الاكتشاف:</h3>
            <ul className="text-emerald-700 space-y-1">
              <li>• المثنى يدل على اثنين.</li>
              <li>• يضاف إليه (ان / ين).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Analysis & Understanding */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <Zap size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">3- التحليل والفهم</h2>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-emerald-700 mb-4">🔹 تعريف المثنى:</h3>
            <p className="text-lg leading-relaxed">
              المثنى اسم يدل على اثنين أو اثنتين بزيادة:
              <br />
              * <span className="font-bold text-emerald-600">ألف ونون (ان)</span> في حالة الرفع
              <br />
              * <span className="font-bold text-emerald-600">ياء ونون (ين)</span> في حالتي النصب والجر
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-emerald-700 mb-4">🔹 صياغة المثنى:</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="font-bold block mb-1">1- الاسم الصحيح</span>
                <span className="text-gray-600">كتاب ← كتابان / كتابين</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="font-bold block mb-1">2- الاسم المقصور</span>
                <span className="text-gray-600">فتى ← فتيان / فتيين</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="font-bold block mb-1">3- الاسم المنقوص</span>
                <span className="text-gray-600">قاضٍ ← قاضيان / قاضيين</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="font-bold block mb-1">4- الاسم الممدود</span>
                <span className="text-gray-600">سماء ← سماوان / سماوين</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-emerald-600 text-white font-bold text-center">إعراب المثنى</div>
            <table className="w-full text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 border-b">الحالة</th>
                  <th className="p-4 border-b">العلامة</th>
                  <th className="p-4 border-b">مثال</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b">الرفع</td>
                  <td className="p-4 border-b font-bold text-emerald-600">الألف</td>
                  <td className="p-4 border-b italic">جاء التلميذان</td>
                </tr>
                <tr>
                  <td className="p-4 border-b">النصب</td>
                  <td className="p-4 border-b font-bold text-emerald-600">الياء</td>
                  <td className="p-4 border-b italic">رأيت التلميذين</td>
                </tr>
                <tr>
                  <td className="p-4 border-b">الجر</td>
                  <td className="p-4 border-b font-bold text-emerald-600">الياء</td>
                  <td className="p-4 border-b italic">مررت بالتلميذين</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Synthesis (Rule) */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <Layers size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">4- التركيب (استخلاص القاعدة)</h2>
        </div>
        <div className="bg-amber-50 p-8 rounded-3xl border-2 border-amber-200 shadow-sm space-y-4">
          <p className="text-lg font-bold text-amber-900">🔸 المثنى: اسم يدل على اثنين أو اثنتين.</p>
          <p className="text-lg font-bold text-amber-900">🔸 يصاغ بإضافة (ان) في الرفع و (ين) في النصب والجر.</p>
          <p className="text-lg font-bold text-amber-900">🔸 يعرب بالألف رفعًا وبالياء نصبًا وجرًا.</p>
          <p className="text-lg font-bold text-amber-900">🔸 قد تتغير بنية الكلمة حسب نوعها (مقصور، منقوص، ممدود).</p>
        </div>
      </section>

      {/* 5. Application */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
              <PenTool size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">5- التطبيق</h2>
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
            <h4 className="font-bold mb-6">✏️ التمرين 1: ثنِّ الكلمات التالية</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <div className="text-xl font-bold mb-2">قلم</div>
                {showAnswers && <div className="text-emerald-600 font-bold">قلمان / قلمين</div>}
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <div className="text-xl font-bold mb-2">مهندس</div>
                {showAnswers && <div className="text-emerald-600 font-bold">مهندسان / مهندسين</div>}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-6">✏️ التمرين 2: أكمل الجمل بما يناسب</h4>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                <span>حضر ............ إلى القسم</span>
                {showAnswers && <span className="font-bold text-emerald-600">التلميذان</span>}
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                <span>رأيت ............ في الحديقة</span>
                {showAnswers && <span className="font-bold text-emerald-600">الطفلين</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Assessment & Support */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">6- التقويم والدعم</h2>
        </div>

        {!quizStarted && !showQuizResult ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
            <h3 className="text-2xl font-bold mb-4">اختبر معلوماتك حول المثنى</h3>
            <p className="text-gray-500 mb-8">5 أسئلة تفاعلية لقياس مدى فهمك للدرس</p>
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
            <p className="text-gray-500 mb-6">لقد أكملت اختبار المثنى بنجاح</p>
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
