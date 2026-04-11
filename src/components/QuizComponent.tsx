import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizResult {
  score: string;
  wrongAnswers: string[];
  totalQuestions: number;
  correctCount: number;
}

interface QuizComponentProps {
  questions: Question[];
  onComplete: (result: QuizResult) => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    } else {
      setWrongAnswers([...wrongAnswers, questions[currentQuestion].text]);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
      onComplete({
        score: `${score} من ${questions.length}`,
        wrongAnswers,
        totalQuestions: questions.length,
        correctCount: score
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setWrongAnswers([]);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Trophy size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">أحسنت! لقد أتممت الاختبار</h2>
        <p className="text-gray-500 mb-8">لقد حصلت على {score} من {questions.length}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            <RotateCcw size={18} />
            إعادة الاختبار
          </button>
        </div>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600 font-bold">
          <HelpCircle size={20} />
          <span>سؤال {currentQuestion + 1} من {questions.length}</span>
        </div>
        <div className="w-32 bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-right leading-relaxed">
        {question.text}
      </h3>

      <div className="grid gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            disabled={showResult}
            className={cn(
              "w-full p-5 rounded-2xl border-2 text-right font-bold transition-all flex items-center justify-between",
              !showResult && "border-gray-100 hover:border-emerald-500 hover:bg-emerald-50",
              showResult && index === question.correctAnswer && "border-emerald-500 bg-emerald-50 text-emerald-700",
              showResult && selectedOption === index && index !== question.correctAnswer && "border-rose-500 bg-rose-50 text-rose-700",
              showResult && index !== question.correctAnswer && selectedOption !== index && "border-gray-50 opacity-50"
            )}
          >
            <span>{option}</span>
            {showResult && index === question.correctAnswer && <CheckCircle2 size={20} className="text-emerald-600" />}
            {showResult && selectedOption === index && index !== question.correctAnswer && <XCircle size={20} className="text-rose-600" />}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-end"
          >
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all"
            >
              {currentQuestion === questions.length - 1 ? 'إنهاء الاختبار' : 'السؤال التالي'}
              <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
