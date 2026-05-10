import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, Target, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "في الجملة: \"نحن —التلاميذَ— نجتهدُ في دروسنا\"، ما نوع الأسلوب؟",
    options: ["أسلوب نداء", "أسلوب اختصاص", "أسلوب تعجب", "أسلوب شرط"],
    correctAnswer: 1,
    explanation: "\"التلاميذَ\" جاءت بين عارضتين لتوضيح أنها اسم مختص منصوب يوضح الضمير \"نحن\"."
  },
  {
    id: 2,
    text: "ما الكلمة التي تمثل المختص في الجملة: \"إنا —المسلمينَ— نحب الخير\"؟",
    options: ["إنا", "المسلمينَ", "نحب", "الخير"],
    correctAnswer: 1,
    explanation: "\"المسلمينَ\" اسم مختص منصوب يوضح الضمير \"إنا\"."
  },
  {
    id: 3,
    text: "ما إعراب \"العربَ\" في الجملة: \"نحن —العربَ— نعتز بلغتنا\"؟",
    options: ["مبتدأ مرفوع", "مفعول به", "اسم مختص منصوب", "خبر مرفوع"],
    correctAnswer: 2,
    explanation: "\"العربَ\" اسم مختص منصوب جاء لتوضيح الضمير \"نحن\"."
  },
  {
    id: 4,
    text: "أي الجمل التالية تتضمن أسلوب اختصاص؟",
    options: ["يا تلميذُ اجتهد", "نحن —المجتهدينَ— ننجح", "هل درست الدرس؟", "ما أجملَ الطبيعة!"],
    correctAnswer: 1,
    explanation: "وجود ضمير + اسم مختص منصوب بين عارضتين."
  },
  {
    id: 5,
    text: "في الجملة: \"نحن —المعلمينَ— نؤدي واجبنا\"، ما وظيفة \"المعلمينَ\"؟",
    options: ["منادى", "خبر", "اسم مختص", "مفعول مطلق"],
    correctAnswer: 2,
    explanation: "اسم مختص منصوب يوضح الضمير \"نحن\"."
  },
  {
    id: 6,
    text: "أي الجمل التالية صحيحة من حيث أسلوب الاختصاص؟",
    options: ["نحن —المعلمونَ— نحب التعليم", "نحن —المعلمينَ— نحب التعليم", "نحن يا معلمين نحب التعليم", "نحن معلمون نحب التعليم"],
    correctAnswer: 1,
    explanation: "المختص يكون منصوبًا."
  },
  {
    id: 7,
    text: "في الجملة: \"إنا —الطلابَ— نسعى للنجاح\"، ما وظيفة \"الطلابَ\"؟",
    options: ["مبتدأ", "خبر", "اسم مختص", "مفعول به"],
    correctAnswer: 2,
    explanation: "اسم منصوب يوضح الضمير."
  },
  {
    id: 8,
    text: "حوّل الجملة إلى أسلوب اختصاص: \"نحن نحب الوطن\"",
    options: ["نحن —الوطنَ— نحب", "نحن —المواطنينَ— نحب الوطن", "يا وطنُ نحن نحبك", "نحب نحن الوطن"],
    correctAnswer: 1,
    explanation: "إضافة اسم مختص منصوب بين عارضتين."
  },
  {
    id: 9,
    text: "ما الفرق بين أسلوب الاختصاص والنداء في: \"نحن —التلاميذَ— نجتهد\" و\"يا تلاميذُ اجتهدوا\"؟",
    options: ["لا فرق", "الأول نداء والثاني اختصاص", "الأول اختصاص والثاني نداء", "كلاهما خبر"],
    correctAnswer: 2,
    explanation: "الأول يوضح الضمير، والثاني فيه أداة نداء."
  },
  {
    id: 10,
    text: "صحح الخطأ: \"نحن —التلاميذُ— نجتهد\"",
    options: ["نحن —التلاميذَ— نجتهد", "نحن —التلاميذِ— نجتهد", "نحن —التلاميذُ— نجتهد", "نحن —تلاميذَ— نجتهد"],
    correctAnswer: 0,
    explanation: "الاسم المختص يجب أن يكون منصوبًا."
  }
];

export default function SpecializationQuiz({ onComplete }: { onComplete?: (result: any) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

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
      setShowExplanation(false);
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
    setShowExplanation(false);
  };

  const getMotivationMessage = () => {
    if (score === 10) return "مذهل! أنت الآن أستاذ في أسلوب الاختصاص 🏆";
    if (score >= 7) return "عمل رائع! فهمك لأسلوب الاختصاص متميز جداً 🌟";
    if (score >= 5) return "جيد جداً! واصل المراجعة لتصل للمستوى الأعلى 💪";
    return "لا بأس، أعد المحاولة، فالتكرار يعلم الشطار ✨";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-emerald-50 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
          
          <h2 className="text-3xl font-black flex items-center justify-center gap-3 relative z-10">
            <Target size={32} />
            تحدي أسلوب الاختصاص
          </h2>
          
          {!showResult && (
            <div className="mt-6 flex items-center justify-between px-4 relative z-10">
              <div className="flex flex-col items-start gap-1">
                <span className="text-emerald-100/60 text-xs font-bold uppercase tracking-wider">السؤال الحالي</span>
                <span className="text-xl font-black">{currentQuestion + 1} <span className="text-emerald-300 text-sm">/ {questions.length}</span></span>
              </div>
              
              <div className="flex-1 max-w-[200px] mx-8 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-emerald-100/60 text-xs font-bold uppercase tracking-wider">النقاط</span>
                <span className="text-xl font-black text-emerald-300">{score}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-black border border-emerald-100">
                    <CheckCircle2 size={16} />
                    <span>للسنة الثالثة إعدادي</span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-800 leading-tight">
                    {questions[currentQuestion].text}
                  </h3>
                </div>

                <div className="grid gap-5">
                  {questions[currentQuestion].options.map((option, index) => {
                    let style = "bg-gray-50 hover:bg-emerald-50 border-gray-100 hover:border-emerald-200 text-gray-700 hover:scale-[1.02]";
                    
                    if (selectedOption !== null) {
                      if (index === questions[currentQuestion].correctAnswer) {
                        style = "bg-emerald-100 border-emerald-500 text-emerald-800 shadow-lg shadow-emerald-100";
                      } else if (index === selectedOption) {
                        style = "bg-red-50 border-red-500 text-red-700 shadow-lg shadow-red-100";
                      } else {
                        style = "bg-gray-50 border-gray-100 opacity-40 scale-95";
                      }
                    }

                    return (
                      <button
                        key={index}
                        disabled={selectedOption !== null}
                        onClick={() => handleOptionClick(index)}
                        className={`w-full p-6 text-right rounded-[1.5rem] border-2 transition-all duration-300 font-bold text-xl flex items-center justify-between group relative overflow-hidden ${style}`}
                      >
                        <div className="flex items-center gap-5 relative z-10">
                          <span className={cn(
                            "w-10 h-10 rounded-xl bg-white border-2 flex items-center justify-center text-lg font-black transition-colors duration-300",
                            selectedOption !== null && index === questions[currentQuestion].correctAnswer 
                              ? "border-emerald-500 text-emerald-600" 
                              : "border-gray-200 text-gray-400 group-hover:border-emerald-300 group-hover:text-emerald-500"
                          )}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1">{option}</span>
                        </div>
                        
                        {selectedOption !== null && index === questions[currentQuestion].correctAnswer && (
                          <div className="relative z-10 flex items-center justify-center w-10 h-10 bg-emerald-500 text-white rounded-full">
                            <CheckCircle2 size={24} />
                          </div>
                        )}
                        {selectedOption === index && index !== questions[currentQuestion].correctAnswer && (
                          <div className="relative z-10 flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full">
                            <XCircle size={24} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 pt-4"
                  >
                    <div className={cn(
                      "p-6 rounded-3xl border-2 space-y-3",
                      isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'
                    )}>
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <span className="text- emerald-600 font-black text-xl flex items-center gap-2">
                            <CheckCircle2 size={24} /> أحسنت! إجابة ذكية
                          </span>
                        ) : (
                          <span className="text-red-500 font-black text-xl flex items-center gap-2">
                            <AlertCircle size={24} /> ركز قليلاً، يمكنك التعلم من هذا!
                          </span>
                        )}
                      </div>
                      
                      <div className="bg-white/60 p-4 rounded-xl border border-white flex gap-3">
                        <Info className={cn("shrink-0 mt-0.5", isCorrect ? "text-emerald-400" : "text-amber-400")} size={18} />
                        <p className="text-gray-600 text-sm font-bold leading-relaxed">
                          <span className="text-gray-900 block mb-1">تفسير تربوي:</span>
                          {questions[currentQuestion].explanation}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={nextQuestion}
                      className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200"
                    >
                      <span>{currentQuestion + 1 === questions.length ? 'عرض النتائج النهائية' : 'متابعة التحدي'}</span>
                      <ArrowRight size={24} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10 py-10"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-emerald-200 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
                  <div className="relative inline-flex items-center justify-center w-48 h-48 bg-emerald-100 text-emerald-600 rounded-[3rem] rotate-12 shadow-2xl shadow-emerald-200">
                    <Trophy size={96} className="-rotate-12" />
                  </div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-4 -right-4 bg-emerald-500 text-white p-4 rounded-full shadow-lg"
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-5xl font-black text-gray-900">نهاية التحدي!</h3>
                  <p className="text-2xl text-gray-500 font-bold max-w-md mx-auto">{getMotivationMessage()}</p>
                </div>

                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 inline-block px-16 relative">
                  <div className="text-gray-400 text-sm font-black uppercase tracking-widest mb-2">النتيجة النهائية</div>
                  <div className="text-8xl font-black text-emerald-600 flex items-baseline gap-2">
                    {score}
                    <span className="text-4xl text-emerald-300">/ {questions.length}</span>
                  </div>
                </div>
                
                <div className="pt-6">
                  <button
                    onClick={resetGame}
                    className="group relative flex items-center gap-4 bg-gray-900 text-white px-16 py-6 rounded-[2rem] font-black transition-all hover:bg-emerald-600 shadow-2xl mx-auto overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <RotateCcw size={28} className="relative z-10" />
                    <span className="text-2xl relative z-10">إعادة التحدي</span>
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

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
