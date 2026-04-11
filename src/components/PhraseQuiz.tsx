import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, Compass } from 'lucide-react';

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
    text: "ما هي شبه الجملة؟",
    options: ["جملة تبدأ بفعل", "الظرف أو الجار والمجرور", "كلمة واحدة فقط", "جملة تبدأ باسم"],
    correctAnswer: 1,
    explanation: "شبه الجملة تتكون من الظرف أو الجار والمجرور، ولا تعطي معنىً مستقلاً وحدها."
  },
  {
    id: 2,
    text: "مما يتكون الجار والمجرور؟",
    options: ["مبتدأ وخبر", "فعل وفاعل", "حرف جر واسم مجرور", "ظرف ومضاف إليه"],
    correctAnswer: 2,
    explanation: "الجار والمجرور هو حرف الجر والاسم الذي يليه مباشرة."
  },
  {
    id: 3,
    text: "ما هو الظرف؟",
    options: ["اسم يدل على زمان أو مكان", "حرف يربط بين جملتين", "فعل ماضٍ دائماً", "اسم يبدأ به الكلام"],
    correctAnswer: 0,
    explanation: "الظرف هو اسم منصوب يدل على الزمان (متى) أو المكان (أين)."
  },
  {
    id: 4,
    text: "ما دور شبه الجملة في الجملة الاسمية؟",
    options: ["تكون فاعلاً دائماً", "تكون في محل رفع خبر", "تكون مبتدأً دائماً", "لا محل لها من الإعراب"],
    correctAnswer: 1,
    explanation: "شبه الجملة في الجملة الاسمية تقع في محل رفع خبر للمبتدأ."
  },
  {
    id: 5,
    text: "حدد شبه الجملة في جملة: \"في الدارِ رجلٌ\"",
    options: ["في الدارِ", "رجلٌ", "الدارِ فقط", "مستتر"],
    correctAnswer: 0,
    explanation: "\"في الدارِ\" هي شبه جملة من الجار والمجرور في محل رفع خبر مقدم."
  },
  {
    id: 6,
    text: "ما نوع شبه الجملة في: \"فوق الطاولة كتابٌ\"؟",
    options: ["جار ومجرور", "ظرف زمان", "ظرف مكان", "جملة فعلية"],
    correctAnswer: 2,
    explanation: "\"فوق\" ظرف مكان، لذا فهي شبه جملة ظرفية مكانية."
  },
  {
    id: 7,
    text: "حدد شبه الجملة في جملة: \"عندك نجاحٌ\"",
    options: ["نجاحٌ", "عندك", "عند فقط", "مستتر"],
    correctAnswer: 1,
    explanation: "\"عندك\" ظرف مكان، وهي هنا شبه جملة في محل رفع خبر مقدم."
  },
  {
    id: 8,
    text: "ما نوع شبه الجملة في: \"في الحديقة أطفالٌ\"؟",
    options: ["جار ومجرور", "ظرف مكان", "ظرف زمان", "مبتدأ مؤخر"],
    correctAnswer: 0,
    explanation: "\"في الحديقة\" تتكون من حرف جر واسم مجرور."
  },
  {
    id: 9,
    text: "ما إعراب شبه الجملة في: \"فوق الطاولة كتابٌ\"؟",
    options: ["مبتدأ مؤخر", "خبر مقدم", "فاعل", "مفعول به"],
    correctAnswer: 1,
    explanation: "شبه الجملة \"فوق الطاولة\" تقدمت على المبتدأ النكرة \"كتابٌ\" لتعرب خبراً مقدماً."
  },
  {
    id: 10,
    text: "حدد وظيفة شبه الجملة في: \"العصفور فوق الشجرة\"",
    options: ["مبتدأ", "فاعل", "خبر للمبتدأ", "مضاف إليه"],
    correctAnswer: 2,
    explanation: "\"فوق الشجرة\" هي شبه جملة أتمت معنى الجملة مع المبتدأ \"العصفور\"."
  }
];

export default function PhraseQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    const correct = index === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
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
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const getMotivationMessage = () => {
    if (score === 10) return "ممتاز 🎉 لقد أتقنت شبه الجملة ببراعة!";
    if (score >= 7) return "جيد جداً 👍 مستواك رائع في فهم القواعد!";
    if (score >= 5) return "جيد! واصل المراجعة لتصبح أفضل 👍";
    return "حاول مرة أخرى 💪 الممارسة تجعلك أقوى!";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-50 overflow-hidden">
        {/* Header */}
        <div className="bg-sky-500 p-6 text-white text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Compass size={24} />
            تحدي شبه الجملة
          </h2>
          {!showResult && (
            <div className="mt-4 flex items-center justify-between px-4">
              <span className="text-sky-100 font-medium">السؤال {currentQuestion + 1} من {questions.length}</span>
              <div className="w-32 h-2 bg-sky-800/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-sky-100 font-medium">النقاط: {score}</span>
            </div>
          )}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <span className="inline-block px-4 py-1 bg-sky-50 text-sky-600 rounded-full text-sm font-bold mb-4">
                    {currentQuestion < 4 ? "تعاريف" : "تطبيقات"}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-800 leading-relaxed">
                    {questions[currentQuestion].text}
                  </h3>
                </div>

                <div className="grid gap-4">
                  {questions[currentQuestion].options.map((option, index) => {
                    let bgColor = "bg-gray-50 hover:bg-sky-50 border-gray-200 hover:border-sky-200";
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
                          <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm group-hover:border-sky-400">
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
                    {questions[currentQuestion].explanation && (
                      <p className="text-gray-600 text-center bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                        {questions[currentQuestion].explanation}
                      </p>
                    )}
                    <button
                      onClick={nextQuestion}
                      className="flex items-center gap-2 bg-sky-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-sky-700 transition-all shadow-xl shadow-sky-100"
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
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-sky-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                  <div className="relative inline-flex items-center justify-center w-32 h-32 bg-sky-100 text-sky-600 rounded-full mb-4">
                    <Trophy size={64} />
                  </div>
                </div>
                <h3 className="text-4xl font-black text-gray-900">انتهى التحدي!</h3>
                <div className="space-y-2">
                  <div className="text-7xl font-black text-sky-600">{score} / {questions.length}</div>
                  <p className="text-2xl text-gray-600 font-bold">{getMotivationMessage()}</p>
                </div>
                
                <div className="pt-8">
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 bg-gray-900 text-white px-12 py-5 rounded-3xl font-bold hover:bg-sky-600 transition-all mx-auto shadow-2xl"
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
