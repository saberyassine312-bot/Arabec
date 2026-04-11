import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, Sun } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
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
    text: "تتكون الجملة الاسمية من ركنين أساسيين هما:",
    options: ["الفعل والفاعل", "الجار والمجرور", "المبتدأ والخبر", "الفعل والمفعول به"],
    correctAnswer: 2
  },
  {
    id: 3,
    text: "المبتدأ هو الاسم الذي:",
    options: ["تبدأ به الجملة الاسمية", "يأتي في نهاية الجملة دائماً", "يدل على فعل معين", "يجر ما بعده"],
    correctAnswer: 0
  },
  {
    id: 4,
    text: "الخبر هو الركن الذي:",
    options: ["تبدأ به الجملة", "يتمم معنى الجملة مع المبتدأ", "يكون دائماً فعلاً ماضياً", "لا يحتاجه المبتدأ"],
    correctAnswer: 1
  },
  {
    id: 5,
    text: "في جملة \"الولدُ نشيطٌ\"، المبتدأ هو:",
    options: ["الولدُ", "نشيطٌ", "مستتر", "لا يوجد"],
    correctAnswer: 0
  },
  {
    id: 6,
    text: "في جملة \"السماءُ صافيةٌ\"، الخبر هو:",
    options: ["السماءُ", "صافيةٌ", "مستتر", "فعل"],
    correctAnswer: 1
  },
  {
    id: 7,
    text: "أي من الجمل التالية تعتبر جملة اسمية؟",
    options: ["نامَ الطفلُ", "العلمُ نورٌ", "يقرأُ الطالبُ", "اكتبْ درسك"],
    correctAnswer: 1
  },
  {
    id: 8,
    text: "في جملة \"الحديقةُ واسعةٌ\"، كلمة \"واسعةٌ\" تعرب:",
    options: ["مبتدأ", "فاعلاً", "خبراً", "مفعولاً به"],
    correctAnswer: 2
  },
  {
    id: 9,
    text: "\"المعلمُ مخلصٌ\"؛ المبتدأ في هذه الجملة هو:",
    options: ["مخلصٌ", "المعلمُ", "ضمير", "فعل"],
    correctAnswer: 1
  },
  {
    id: 10,
    text: "حدد المبتدأ والخبر في جملة \"الصدقُ منجاةٌ\":",
    options: ["الصدق (فعل)، منجاة (فاعل)", "الصدق (مبتدأ)، منجاة (خبر)", "الصدق (خبر)، منجاة (مبتدأ)", "لا يوجد مبتدأ"],
    correctAnswer: 1
  }
];

export default function NominalSentenceQuiz({ onComplete }: { onComplete?: (result: any) => void }) {
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
    if (score === 10) return "رائع جداً! أنت خبير في الجملة الاسمية 🌟";
    if (score >= 7) return "ممتاز! إجاباتك تدل على فهم جيد جداً 👍";
    if (score >= 5) return "جيد! واصل التدريب لتصبح أفضل 💪";
    return "حاول مرة أخرى، الممارسة هي طريق النجاح ✨";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-yellow-50 overflow-hidden">
        {/* Header */}
        <div className="bg-yellow-500 p-6 text-white text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Sun size={24} />
            تحدي الجملة الاسمية
          </h2>
          {!showResult && (
            <div className="mt-4 flex items-center justify-between px-4">
              <span className="text-yellow-50 font-medium">السؤال {currentQuestion + 1} من {questions.length}</span>
              <div className="w-32 h-2 bg-yellow-700/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-yellow-50 font-medium">النقاط: {score}</span>
            </div>
          )}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <span className="inline-block px-4 py-1 bg-yellow-50 text-yellow-600 rounded-full text-sm font-bold mb-4">
                    {currentQuestion < 4 ? "أساسيات" : "تطبيقات"}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-800 leading-relaxed">
                    {questions[currentQuestion].text}
                  </h3>
                </div>

                <div className="grid gap-4">
                  {questions[currentQuestion].options.map((option, index) => {
                    let bgColor = "bg-gray-50 hover:bg-yellow-50 border-gray-200 hover:border-yellow-200";
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
                          <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm group-hover:border-yellow-400">
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
                      className="flex items-center gap-2 bg-yellow-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-yellow-600 transition-all shadow-xl shadow-yellow-100"
                    >
                      <span>{currentQuestion + 1 === questions.length ? 'عرض النتيجة' : 'السؤال التالي'}</span>
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
                  <div className="absolute inset-0 bg-yellow-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                  <div className="relative inline-flex items-center justify-center w-32 h-32 bg-yellow-100 text-yellow-600 rounded-full mb-4">
                    <Trophy size={64} />
                  </div>
                </div>
                <h3 className="text-4xl font-black text-gray-900">انتهى التحدي!</h3>
                <div className="space-y-2">
                  <div className="text-7xl font-black text-yellow-500">{score} / {questions.length}</div>
                  <p className="text-2xl text-gray-600 font-bold">{getMotivationMessage()}</p>
                </div>
                
                <div className="pt-8">
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 bg-gray-900 text-white px-12 py-5 rounded-3xl font-bold hover:bg-yellow-600 transition-all mx-auto shadow-2xl"
                  >
                    <RotateCcw size={24} />
                    <span className="text-xl">العب مرة أخرى</span>
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
