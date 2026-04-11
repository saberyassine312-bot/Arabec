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
    text: "الجملة التي تبدأ باسم تسمى:",
    options: ["جملة اسمية", "جملة فعلية", "شبه جملة", "جملة نداء"],
    correctAnswer: 0
  },
  {
    id: 2,
    text: "الجملة التي تبدأ بفعل تسمى:",
    options: ["جملة اسمية", "جملة فعلية", "شبه جملة", "جملة استفهام"],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "شبه الجملة يتكون من:",
    options: ["مبتدأ وخبر", "فعل وفاعل", "جار ومجرور أو ظرف", "اسم وفعل"],
    correctAnswer: 2
  },
  {
    id: 4,
    text: "الركنان الأساسيان للجملة الاسمية هما:",
    options: ["الفعل والفاعل", "المبتدأ والخبر", "الجار والمجرور", "الصفة والموصوف"],
    correctAnswer: 1
  },
  {
    id: 5,
    text: "\"الشمسُ مشرقةٌ\" هي جملة:",
    options: ["فعلية", "اسمية", "شبه جملة", "تعجبية"],
    correctAnswer: 1
  },
  {
    id: 6,
    text: "\"كتبَ الولدُ الدرسَ\" هي جملة:",
    options: ["اسمية", "فعلية", "شبه جملة", "استفهامية"],
    correctAnswer: 1
  },
  {
    id: 7,
    text: "\"تحتَ الطاولةِ\" تعتبر:",
    options: ["جملة اسمية", "جملة فعلية", "شبه جملة", "جملة تامة"],
    correctAnswer: 2
  },
  {
    id: 8,
    text: "\"المعلمُ في القسمِ\"؛ كلمة \"في القسم\" هي:",
    options: ["جملة اسمية", "جملة فعلية", "شبه جملة", "مبتدأ"],
    correctAnswer: 2
  },
  {
    id: 9,
    text: "\"سافرَ أبي إلى مكةَ\" هي جملة:",
    options: ["اسمية", "فعلية", "شبه جملة", "نداء"],
    correctAnswer: 1
  },
  {
    id: 10,
    text: "\"الصدقُ منجاةٌ\" هي جملة:",
    options: ["فعلية", "اسمية", "شبه جملة", "أمر"],
    correctAnswer: 1
  }
];

export default function QuizGame({ type = "game", onComplete }: { type?: string; onComplete?: (result: any) => void }) {
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
    if (score === 10) return "ممتاز! أنت عبقري في اللغة العربية 🌟";
    if (score >= 7) return "رائع جداً! مستواك متميز واصل التقدم 👍";
    if (score >= 5) return "جيد! يمكنك التحسن أكثر بالمراجعة 😊";
    return "لا بأس، حاول مرة أخرى وستنجح بالتأكيد 💪";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">لعبة أنواع الجمل</h2>
          {!showResult && (
            <div className="mt-4 flex items-center justify-between px-4">
              <span className="text-emerald-100">السؤال {currentQuestion + 1} من {questions.length}</span>
              <div className="w-32 h-2 bg-emerald-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-emerald-100">النقاط: {score}</span>
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
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
                  {questions[currentQuestion].text}
                </h3>

                <div className="grid gap-4">
                  {questions[currentQuestion].options.map((option, index) => {
                    let bgColor = "bg-gray-50 hover:bg-emerald-50 border-gray-200";
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
                        className={`w-full p-5 text-right rounded-2xl border-2 transition-all font-bold text-lg flex items-center justify-between ${bgColor} ${textColor}`}
                      >
                        <span>{option}</span>
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
                    <div className={`text-xl font-bold ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isCorrect ? 'إجابة صحيحة ✅' : `إجابة خاطئة ❌ الجواب الصحيح: ${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}`}
                    </div>
                    <button
                      onClick={nextQuestion}
                      className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                    >
                      <span>{currentQuestion + 1 === questions.length ? 'عرض النتيجة' : 'السؤال التالي'}</span>
                      <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 py-8"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                  <Trophy size={48} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">انتهت اللعبة!</h3>
                <div className="text-6xl font-black text-emerald-600">{score} / {questions.length}</div>
                <p className="text-xl text-gray-600 font-medium">{getMotivationMessage()}</p>
                
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all mx-auto"
                >
                  <RotateCcw size={20} />
                  <span>العب مرة أخرى</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
