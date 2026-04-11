import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: "الجملة الفعلية هي التي تبدأ بـ:",
    options: ["اسم", "فعل", "حرف", "ظرف"],
    correctAnswer: 1
  },
  {
    id: 2,
    text: "الفاعل هو اسم مرفوع يدل على:",
    options: ["من وقع عليه الفعل", "من قام بالفعل", "زمان وقوع الفعل", "مكان وقوع الفعل"],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "المفعول به هو اسم منصوب يدل على:",
    options: ["من قام بالفعل", "من وقع عليه فعل الفاعل", "حالة الفاعل", "سبب وقوع الفعل"],
    correctAnswer: 1
  },
  {
    id: 4,
    text: "الفعل هو كلمة تدل على:",
    options: ["اسم إنسان", "حدث مرتبط بزمن معين", "وصف لشيء ما", "ربط بين الجمل"],
    correctAnswer: 1
  },
  {
    id: 5,
    text: "في جملة \"أكلَ الطفلُ التفاحةَ\"، الفاعل هو:",
    options: ["أكل", "الطفل", "التفاحة", "مستتر"],
    correctAnswer: 1
  },
  {
    id: 6,
    text: "في جملة \"شربَ الولدُ الحليبَ\"، المفعول به هو:",
    options: ["شرب", "الولد", "الحليب", "لا يوجد"],
    correctAnswer: 2
  },
  {
    id: 7,
    text: "\"يذهبُ الطالبُ إلى المدرسةِ\"، الفعل في هذه الجملة هو:",
    options: ["يذهب", "الطالب", "إلى", "المدرسة"],
    correctAnswer: 0
  },
  {
    id: 8,
    text: "\"فهمتُ المسألةَ\"، الفعل في هذه الجملة هو:",
    options: ["فهم", "المسألة", "التاء", "مستتر"],
    correctAnswer: 0
  },
  {
    id: 9,
    text: "في جملة \"رسمَ الفنانُ لوحةً\"، الكلمة التي تعرب مفعولاً به هي:",
    options: ["رسم", "الفنان", "لوحة", "جميلة"],
    correctAnswer: 2
  },
  {
    id: 10,
    text: "في جملة \"خرجتُ من البيتِ\"، نوع الفاعل هنا هو:",
    options: ["اسم ظاهر", "ضمير مستتر", "ضمير متصل (التاء)", "شبه جملة"],
    correctAnswer: 2
  }
];

export default function VerbalSentenceQuiz({ onComplete }: { onComplete?: (result: any) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    const correct = index === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    } else {
      setWrongAnswers([...wrongAnswers, questions[currentQuestion].text]);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
      if (onComplete) {
        onComplete({
          score: `${score} من ${questions.length}`,
          wrongAnswers,
          totalQuestions: questions.length,
          correctCount: score
        });
      }
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setWrongAnswers([]);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const getMotivationMessage = () => {
    if (score === 10) return "مذهل! أنت خبير في الجملة الفعلية 🏆";
    if (score >= 7) return "عمل رائع! إجاباتك تدل على فهم عميق 🌟";
    if (score >= 5) return "جيد جداً! استمر في التدريب لتصبح أفضل 👍";
    return "محاولة جيدة، راجع درس الجملة الفعلية وحاول مجدداً 💪";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-blue-50 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">تحدي الجملة الفعلية</h2>
          {!showResult && (
            <div className="mt-4 flex items-center justify-between px-4">
              <span className="text-blue-100">السؤال {currentQuestion + 1} من {questions.length}</span>
              <div className="w-32 h-2 bg-blue-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-blue-100">النقاط: {score}</span>
            </div>
          )}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-4">
                    {currentQuestion < 4 ? "مفاهيم أساسية" : currentQuestion < 9 ? "تطبيقات عملية" : "أنواع الفاعل"}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-800 leading-relaxed">
                    {questions[currentQuestion].text}
                  </h3>
                </div>

                <div className="grid gap-4">
                  {questions[currentQuestion].options.map((option, index) => {
                    let bgColor = "bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-200";
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
                          <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm group-hover:border-blue-400">
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-4 pt-4"
                  >
                    <div className={`text-xl font-bold p-4 rounded-2xl w-full text-center ${isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {isCorrect ? 'إجابة صحيحة ✅' : `إجابة خاطئة ❌ الجواب الصحيح: ${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}`}
                    </div>
                    <button
                      onClick={nextQuestion}
                      className="flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                    >
                      <span>{currentQuestion + 1 === questions.length ? 'عرض النتيجة النهائية' : 'السؤال التالي'}</span>
                      <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8 py-8"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-blue-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative inline-flex items-center justify-center w-32 h-32 bg-blue-100 text-blue-600 rounded-full mb-4">
                    <Trophy size={64} />
                  </div>
                </div>
                <h3 className="text-4xl font-black text-gray-900">أحسنت يا بطل!</h3>
                <div className="space-y-2">
                  <div className="text-7xl font-black text-blue-600">{score} / {questions.length}</div>
                  <p className="text-2xl text-gray-600 font-bold">{getMotivationMessage()}</p>
                </div>
                
                <div className="pt-8">
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 bg-gray-900 text-white px-12 py-5 rounded-3xl font-bold hover:bg-blue-600 transition-all mx-auto shadow-2xl"
                  >
                    <RotateCcw size={24} />
                    <span className="text-xl">إعادة التحدي</span>
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
