import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: "الجملة الفعلية هي الجملة التي تبدأ بـ:",
    options: ["اسم", "فعل", "حرف", "ضمير"],
    correctAnswer: 1
  },
  {
    id: 2,
    text: "الفاعل في الجملة الفعلية يكون دائماً:",
    options: ["منصوباً", "مجروراً", "مرفوعاً", "مجزوماً"],
    correctAnswer: 2
  },
  {
    id: 3,
    text: "المفعول به هو اسم يدل على:",
    options: ["من قام بالفعل", "من وقع عليه الفعل", "زمان الفعل", "مكان الفعل"],
    correctAnswer: 1
  },
  {
    id: 4,
    text: "الفعل الذي يدل على طلب القيام بعمل هو فعل:",
    options: ["ماضٍ", "مضارع", "أمر", "مستقبل"],
    correctAnswer: 2
  },
  {
    id: 5,
    text: "حدد الفعل في جملة: \"يحرثُ الفلاحُ الأرضَ\"",
    options: ["يحرث", "الفلاح", "الأرض", "لا يوجد"],
    correctAnswer: 0
  },
  {
    id: 6,
    text: "حدد الفاعل في جملة: \"سهرتِ الأمُ على راحةِ طفلها\"",
    options: ["سهرت", "الأم", "راحة", "طفلها"],
    correctAnswer: 1
  },
  {
    id: 7,
    text: "حدد المفعول به في جملة: \"اشترى المسافرُ تذكرةً\"",
    options: ["اشترى", "المسافر", "تذكرة", "لا يوجد"],
    correctAnswer: 2
  },
  {
    id: 8,
    text: "ما نوع الفعل في جملة: \"حافظْ على نظافةِ مدرستك\"",
    options: ["ماضٍ", "مضارع", "أمر", "نهي"],
    correctAnswer: 2
  },
  {
    id: 9,
    text: "ما نوع الفعل في جملة: \"نجحَ المجتهدُ في الامتحان\"",
    options: ["ماضٍ", "مضارع", "أمر", "مستقبل"],
    correctAnswer: 0
  },
  {
    id: 10,
    text: "حدد الفاعل في جملة: \"كتبتُ قصةً قصيرةً\"",
    options: ["كتب", "التاء (ضمير متصل)", "قصة", "قصيرة"],
    correctAnswer: 1
  },
  {
    id: 11,
    text: "حدد المفعول به في جملة: \"كافأ المديرُ المتفوقينَ\"",
    options: ["كافأ", "المدير", "المتفوقين", "لا يوجد"],
    correctAnswer: 2
  },
  {
    id: 12,
    text: "الفعل في جملة \"سوف نخرجُ غداً\" هو فعل:",
    options: ["ماضٍ", "مضارع", "أمر", "ماضٍ بعيد"],
    correctAnswer: 1
  },
  {
    id: 13,
    text: "الفاعل في جملة \"نامَ الطفلُ\" هو:",
    options: ["نام", "الطفل", "مستتر", "لا يوجد"],
    correctAnswer: 1
  },
  {
    id: 14,
    text: "المفعول به في جملة \"شربتِ القطةُ الحليبَ\" هو:",
    options: ["شربت", "القطة", "الحليب", "مستتر"],
    correctAnswer: 2
  },
  {
    id: 15,
    text: "الجملة الفعلية الصحيحة مما يلي هي:",
    options: ["الشمسُ مشرقةٌ", "في المدرسةِ طلابٌ", "دخلَ المعلمُ الفصلَ", "أنتَ مجتهدٌ"],
    correctAnswer: 2
  }
];

export default function VerbalSentenceExam() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    const correct = index === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setCorrectCount(prev => prev + 1);
    } else {
      setErrorCount(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setCorrectCount(0);
    setErrorCount(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const isPassed = correctCount >= 10 && errorCount <= 3;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-indigo-50 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white text-center relative">
          <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
            امتحان شامل
          </div>
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <GraduationCap size={28} />
            اختبار الجملة الفعلية الشامل
          </h2>
          {!showResult && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between px-4 text-sm font-bold">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-100">السؤال:</span>
                  <span className="bg-white text-indigo-600 px-2 py-0.5 rounded-lg">{currentQuestion + 1} / {questions.length}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-emerald-300">
                    <CheckCircle size={16} />
                    <span>{correctCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-300">
                    <XCircle size={16} />
                    <span>{errorCount}</span>
                  </div>
                </div>
              </div>
              <div className="w-full h-2 bg-indigo-900/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 leading-relaxed">
                    {questions[currentQuestion].text}
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {questions[currentQuestion].options.map((option, index) => {
                    let bgColor = "bg-gray-50 hover:bg-indigo-50 border-gray-200 hover:border-indigo-200";
                    let textColor = "text-gray-700";
                    
                    if (selectedOption !== null) {
                      if (index === questions[currentQuestion].correctAnswer) {
                        bgColor = "bg-emerald-100 border-emerald-500";
                        textColor = "text-emerald-700";
                      } else if (index === selectedOption) {
                        bgColor = "bg-red-100 border-red-500";
                        textColor = "text-red-700";
                      } else {
                        bgColor = "bg-gray-50 border-gray-100 opacity-50";
                      }
                    }

                    return (
                      <button
                        key={index}
                        disabled={selectedOption !== null}
                        onClick={() => handleOptionClick(index)}
                        className={`w-full p-5 text-right rounded-2xl border-2 transition-all font-bold text-lg flex items-center justify-between group ${bgColor} ${textColor}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm group-hover:border-indigo-400">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {selectedOption !== null && index === questions[currentQuestion].correctAnswer && (
                          <CheckCircle2 className="text-emerald-600" />
                        )}
                        {selectedOption === index && index !== questions[currentQuestion].correctAnswer && (
                          <XCircle className="text-red-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4 pt-4"
                  >
                    <div className={`text-xl font-bold p-5 rounded-2xl w-full text-center shadow-sm ${isCorrect ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {isCorrect ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 />
                          <span>إجابة صحيحة ✅</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-2">
                            <XCircle />
                            <span>إجابة خاطئة ❌</span>
                          </div>
                          <div className="text-sm opacity-80">الجواب الصحيح هو: {questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}</div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={nextQuestion}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                    >
                      <span>{currentQuestion + 1 === questions.length ? 'إنهاء الاختبار وعرض النتيجة' : 'السؤال التالي'}</span>
                      <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10 py-6"
              >
                <div className="relative inline-block">
                  <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 animate-pulse ${isPassed ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                  <div className={`relative inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 ${isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {isPassed ? <Trophy size={64} /> : <AlertCircle size={64} />}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className={`text-5xl font-black ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isPassed ? 'ناجح ✔️' : 'راسب ❌'}
                  </h3>
                  <p className="text-xl text-gray-500 font-medium">
                    {isPassed ? 'تهانينا! لقد اجتزت الاختبار بنجاح باهر' : 'للأسف، لم تحقق شروط النجاح هذه المرة'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                  <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                    <div className="text-4xl font-black text-emerald-600 mb-1">{correctCount}</div>
                    <div className="text-sm text-emerald-700 font-bold">إجابات صحيحة</div>
                  </div>
                  <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                    <div className="text-4xl font-black text-red-600 mb-1">{errorCount}</div>
                    <div className="text-sm text-red-700 font-bold">أخطاء</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 max-w-md mx-auto text-right space-y-3">
                  <h4 className="font-bold text-gray-700 border-b border-gray-200 pb-2 mb-2">شروط النجاح:</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className={correctCount >= 10 ? 'text-emerald-600 font-bold' : 'text-gray-500'}>10 إجابات صحيحة أو أكثر</span>
                    {correctCount >= 10 ? <CheckCircle size={16} className="text-emerald-600" /> : <XCircle size={16} className="text-gray-300" />}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={errorCount <= 3 ? 'text-emerald-600 font-bold' : 'text-gray-500'}>ألا يتجاوز عدد الأخطاء 3</span>
                    {errorCount <= 3 ? <CheckCircle size={16} className="text-emerald-600" /> : <XCircle size={16} className="text-red-500" />}
                  </div>
                </div>
                
                <div className="pt-6">
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 bg-gray-900 text-white px-12 py-5 rounded-3xl font-bold hover:bg-indigo-600 transition-all mx-auto shadow-2xl"
                  >
                    <RotateCcw size={24} />
                    <span className="text-xl">إعادة الاختبار</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
