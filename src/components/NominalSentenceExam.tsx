import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, BookCheck, ListChecks, Info } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "الجملة الاسمية هي الجملة التي تبدأ بـ:",
    options: ["فعل", "اسم", "حرف", "ظرف"],
    correctAnswer: 1
  },
  {
    id: 2,
    text: "المبتدأ هو الركن الذي:",
    options: ["يأتي بعد الفعل", "تبدأ به الجملة الاسمية غالباً", "يتمم معنى الخبر", "يكون منصوباً دائماً"],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "الخبر هو الركن الذي:",
    options: ["تبدأ به الجملة", "يتمم معنى الجملة مع المبتدأ", "يدل على من قام بالفعل", "يجر ما بعده"],
    correctAnswer: 1
  },
  {
    id: 4,
    text: "الحالة الإعرابية الأصلية للمبتدأ والخبر هي:",
    options: ["النصب", "الجر", "الرفع", "الجزم"],
    correctAnswer: 2
  },
  {
    id: 5,
    text: "المبتدأ والخبر هما الركنان الأساسيان للجملة:",
    options: ["الفعلية", "الاسمية", "شبه الجملة", "الظرفية"],
    correctAnswer: 1
  },
  {
    id: 6,
    text: "في جملة \"الولدُ نشيطٌ\"، المبتدأ هو:",
    options: ["نشيطٌ", "الولدُ", "مستتر", "لا يوجد"],
    correctAnswer: 1
  },
  {
    id: 7,
    text: "في جملة \"السماءُ صافيةٌ\"، الخبر هو:",
    options: ["السماءُ", "صافيةٌ", "مستتر", "فعل"],
    correctAnswer: 1
  },
  {
    id: 8,
    text: "\"الكتابُ مفيدٌ\"؛ نوع هذه الجملة هو:",
    options: ["جملة فعلية", "جملة اسمية", "شبه جملة", "جملة أمر"],
    correctAnswer: 1
  },
  {
    id: 9,
    text: "في جملة \"المعلمون مخلصون\"، الخبر هو:",
    options: ["المعلمون", "مخلصون", "مخلصين", "مستتر"],
    correctAnswer: 1
  },
  {
    id: 10,
    text: "\"العلمُ نورٌ\"؛ المبتدأ في هذه الجملة هو:",
    options: ["نورٌ", "العلمُ", "مستتر", "فعل"],
    correctAnswer: 1
  },
  {
    id: 11,
    text: "في جملة \"الشجرةُ مثمرةٌ\"، الكلمة التي تعرب خبراً هي:",
    options: ["الشجرةُ", "مثمرةٌ", "تثمرُ", "مستتر"],
    correctAnswer: 1
  },
  {
    id: 12,
    text: "في جملة \"أنتَ مجتهدٌ\"، المبتدأ هو:",
    options: ["مجتهدٌ", "أنتَ", "ضمير مستتر", "لا يوجد"],
    correctAnswer: 1
  },
  {
    id: 13,
    text: "في جملة \"في البيتِ رجلٌ\"، المبتدأ هو:",
    options: ["في", "البيتِ", "رجلٌ", "مستتر"],
    correctAnswer: 2,
    explanation: "رجلٌ هو المبتدأ المؤخر، وفي البيت هو الخبر المقدم."
  },
  {
    id: 14,
    text: "في جملة \"أينَ الطريقُ؟\"، الخبر هو:",
    options: ["أينَ", "الطريقُ", "مستتر", "لا يوجد"],
    correctAnswer: 0,
    explanation: "أين اسم استفهام له الصدارة، فهو خبر مقدم."
  },
  {
    id: 15,
    text: "يتقدم الخبر في جملة \"عندَك ضيفٌ\" لأن:",
    options: ["المبتدأ معرفة", "الخبر شبه جملة والمبتدأ نكرة", "الخبر فعل", "المبتدأ اسم إشارة"],
    correctAnswer: 1,
    explanation: "عندك ظرف (شبه جملة) وضيف نكرة، لذا يتقدم الخبر وجوباً."
  }
];

export default function NominalSentenceExam() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    const correct = index === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    } else {
      setErrors(prev => prev + 1);
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
    setScore(0);
    setErrors(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const getMotivationMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "مذهل! أنت أستاذ في الجملة الاسمية 🎓";
    if (percentage >= 80) return "رائع جداً! إجاباتك تدل على تمكن كبير 🌟";
    if (percentage >= 60) return "جيد جداً! استمر في الممارسة لتصل للكمال 👍";
    if (percentage >= 40) return "جيد! تحتاج لبعض المراجعة لتثبيت المعلومات 💪";
    return "لا بأس، المراجعة الدائمة هي سر النجاح. حاول مرة أخرى ✨";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-50 overflow-hidden">
        {/* Header */}
        <div className="bg-amber-600 p-6 text-white text-center relative">
          <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
            اختبار شامل
          </div>
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <BookCheck size={28} />
            امتحان الجملة الاسمية الشامل
          </h2>
          {!showResult && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between px-4 text-sm font-bold">
                <div className="flex items-center gap-2">
                  <span className="text-amber-100">السؤال:</span>
                  <span className="bg-white text-amber-600 px-2 py-0.5 rounded-lg">{currentQuestion + 1} / {questions.length}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-emerald-300">
                    <CheckCircle2 size={16} />
                    <span>{score}</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-300">
                    <XCircle size={16} />
                    <span>{errors}</span>
                  </div>
                </div>
              </div>
              <div className="w-full h-2 bg-amber-900/30 rounded-full overflow-hidden">
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <span className="inline-block px-4 py-1 bg-amber-50 text-amber-600 rounded-full text-sm font-bold mb-4">
                    {currentQuestion < 5 ? "تعاريف" : currentQuestion < 12 ? "تطبيقات" : "حالات متقدمة"}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-800 leading-relaxed">
                    {questions[currentQuestion].text}
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {questions[currentQuestion].options.map((option, index) => {
                    let bgColor = "bg-gray-50 hover:bg-amber-50 border-gray-200 hover:border-amber-200";
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
                          <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm group-hover:border-amber-400">
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
                      {isCorrect ? 'إجابة صحيحة ✅' : `إجابة خاطئة ❌ الجواب الصحيح: ${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}`}
                    </div>
                    
                    {questions[currentQuestion].explanation && (
                      <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl border border-blue-100 flex gap-3 text-sm">
                        <Info className="shrink-0" size={20} />
                        <p>{questions[currentQuestion].explanation}</p>
                      </div>
                    )}

                    <button
                      onClick={nextQuestion}
                      className="flex items-center gap-2 bg-amber-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-xl shadow-amber-100"
                    >
                      <span>{currentQuestion + 1 === questions.length ? 'عرض النتيجة النهائية' : 'السؤال التالي'}</span>
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
                  <div className="absolute inset-0 bg-amber-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                  <div className="relative inline-flex items-center justify-center w-32 h-32 bg-amber-100 text-amber-600 rounded-full mb-4">
                    <Trophy size={64} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-gray-900">انتهى الاختبار!</h3>
                  <p className="text-2xl text-amber-600 font-bold">{getMotivationMessage()}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                  <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                    <div className="text-4xl font-black text-emerald-600 mb-1">{score}</div>
                    <div className="text-sm text-emerald-700 font-bold">إجابات صحيحة</div>
                  </div>
                  <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                    <div className="text-4xl font-black text-red-600 mb-1">{errors}</div>
                    <div className="text-sm text-red-700 font-bold">أخطاء</div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 bg-gray-900 text-white px-12 py-5 rounded-3xl font-bold hover:bg-amber-600 transition-all mx-auto shadow-2xl"
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
