import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, Layers } from 'lucide-react';

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
    text: "الأصل في المبتدأ أن يكون:",
    options: ["نكرة دائماً", "معرفة دائماً", "فعلاً ماضياً", "حرف جر"],
    correctAnswer: 1,
    explanation: "الأصل في المبتدأ أن يكون معرفة لكي يصح الإخبار عنه."
  },
  {
    id: 2,
    text: "متى يتقدم الخبر على المبتدأ وجوباً؟",
    options: ["إذا كان المبتدأ معرفة", "إذا كان الخبر شبه جملة والمبتدأ نكرة", "إذا كان الخبر فعلاً", "إذا كان المبتدأ طويلاً"],
    correctAnswer: 1,
    explanation: "يتقدم الخبر وجوباً إذا كان شبه جملة (جار ومجرور أو ظرف) والمبتدأ نكرة."
  },
  {
    id: 3,
    text: "المبتدأ النكرة يحتاج إلى \"مسوغ\" للابتداء به، مثل:",
    options: ["أن يسبقه نفي أو استفهام", "أن يكون في نهاية الجملة", "أن يكون فعلاً", "أن يكون حرفاً"],
    correctAnswer: 0,
    explanation: "من مسوغات الابتداء بالنكرة أن تسبق بنفي أو استفهام."
  },
  {
    id: 4,
    text: "يتقدم الخبر وجوباً إذا كان من الأسماء التي لها الصدارة مثل:",
    options: ["أسماء الإشارة", "أسماء الاستفهام", "الأسماء الموصولة", "الأسماء الخمسة"],
    correctAnswer: 1,
    explanation: "أسماء الاستفهام لها الصدارة في الكلام، لذا تتقدم وجوباً إذا كانت خبراً."
  },
  {
    id: 5,
    text: "في جملة \"في الدارِ رجلٌ\"، المبتدأ هو:",
    options: ["في", "الدار", "رجلٌ", "مستتر"],
    correctAnswer: 2,
    explanation: "رجلٌ هو المبتدأ المؤخر، وفي الدار هو الخبر المقدم (شبه جملة)."
  },
  {
    id: 6,
    text: "في جملة \"عندَك نجاحٌ\"، الخبر هو:",
    options: ["عندَك", "نجاحٌ", "مستتر", "لا يوجد خبر"],
    correctAnswer: 0,
    explanation: "عندك هو الخبر المقدم لأنه شبه جملة (ظرف)."
  },
  {
    id: 7,
    text: "\"الكتابُ مفيدٌ\"؛ حالة المبتدأ هنا هي:",
    options: ["نكرة", "معرفة", "شبه جملة", "فعل"],
    correctAnswer: 1,
    explanation: "الكتابُ معرف بـ (ال)، فهو معرفة."
  },
  {
    id: 8,
    text: "سبب تقدم الخبر في جملة \"أينَ الطريقُ؟\" هو:",
    options: ["الخبر شبه جملة", "الخبر اسم استفهام له الصدارة", "المبتدأ نكرة", "المبتدأ فعل"],
    correctAnswer: 1,
    explanation: "أين اسم استفهام، وأسماء الاستفهام لها حق الصدارة في الجملة."
  },
  {
    id: 9,
    text: "في جملة \"للمحسنِ إحسانُه\"، يتقدم الخبر وجوباً لأن:",
    options: ["المبتدأ نكرة", "في المبتدأ ضمير يعود على الخبر", "الخبر اسم استفهام", "المبتدأ معرفة"],
    correctAnswer: 1,
    explanation: "إحسانه يشتمل على الهاء التي تعود على المحسن (الخبر)."
  },
  {
    id: 10,
    text: "الجملة التي تقدم فيها الخبر وجوباً لأن المبتدأ نكرة هي:",
    options: ["العلمُ في الصدورِ", "في الصدورِ علمٌ", "أنتَ مجتهدٌ", "نجحَ الطالبُ"],
    correctAnswer: 1,
    explanation: "في الصدورِ علمٌ؛ الخبر شبه جملة والمبتدأ (علم) نكرة."
  }
];

export default function SubjectPredicateStatesQuiz({ onComplete }: { onComplete?: (result: any) => void }) {
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
    if (score === 10) return "مذهل! لقد أتقنت أحوال المبتدأ والخبر ببراعة 🏆";
    if (score >= 7) return "رائع جداً! مستواك متميز في القواعد المتقدمة 🌟";
    if (score >= 5) return "جيد! استمر في المراجعة لتثبيت هذه المفاهيم 👍";
    return "لا بأس، هذه القواعد تحتاج لتركيز. حاول مرة أخرى 💪";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-cyan-50 overflow-hidden">
        {/* Header */}
        <div className="bg-cyan-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Layers size={24} />
            تحدي أحوال المبتدأ والخبر
          </h2>
          {!showResult && (
            <div className="mt-4 flex items-center justify-between px-4">
              <span className="text-cyan-100 font-medium">السؤال {currentQuestion + 1} من {questions.length}</span>
              <div className="w-32 h-2 bg-cyan-800/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-cyan-100 font-medium">النقاط: {score}</span>
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
                  <span className="inline-block px-4 py-1 bg-cyan-50 text-cyan-600 rounded-full text-sm font-bold mb-4">
                    {currentQuestion < 4 ? "قواعد التقديم والتأخير" : "تطبيقات وحالات"}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-800 leading-relaxed">
                    {questions[currentQuestion].text}
                  </h3>
                </div>

                <div className="grid gap-4">
                  {questions[currentQuestion].options.map((option, index) => {
                    let bgColor = "bg-gray-50 hover:bg-cyan-50 border-gray-200 hover:border-cyan-200";
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
                          <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm group-hover:border-cyan-400">
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
                      className="flex items-center gap-2 bg-cyan-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-cyan-700 transition-all shadow-xl shadow-cyan-100"
                    >
                      <span>{currentQuestion + 1 === questions.length ? 'عرض النتيجة' : 'السؤال التالي'}</span>
                      <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 py-8"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                  <div className="relative inline-flex items-center justify-center w-32 h-32 bg-cyan-100 text-cyan-600 rounded-full mb-4">
                    <Trophy size={64} />
                  </div>
                </div>
                <h3 className="text-4xl font-black text-gray-900">انتهى التحدي!</h3>
                <div className="space-y-2">
                  <div className="text-7xl font-black text-cyan-600">{score} / {questions.length}</div>
                  <p className="text-2xl text-gray-600 font-bold">{getMotivationMessage()}</p>
                </div>
                
                <div className="pt-8">
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 bg-gray-900 text-white px-12 py-5 rounded-3xl font-bold hover:bg-cyan-600 transition-all mx-auto shadow-2xl"
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
