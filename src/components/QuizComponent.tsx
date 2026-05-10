import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface Question {
  id: number;
  text: string;
  type?: 'multiple-choice' | 'fill-in-the-blank' | 'image-choice';
  options?: string[];
  correctAnswer: number | string;
  explanation?: string;
  image?: string;
  placeholder?: string;
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
  title?: string;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onComplete, title }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [fillValue, setFillValue] = useState('');
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

  const handleFillSubmit = () => {
    if (showResult) return;
    setShowResult(true);
    const isCorrect = fillValue.trim().toLowerCase() === String(questions[currentQuestion].correctAnswer).toLowerCase();
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setWrongAnswers([...wrongAnswers, questions[currentQuestion].text]);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setFillValue('');
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
    setFillValue('');
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
  const qType = question.type || 'multiple-choice';

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {title && (
        <h2 className="text-2xl font-black text-center mb-8 text-gray-900">{title}</h2>
      )}
      
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

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        {question.image && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100">
            <img 
              src={question.image} 
              alt="Question illustration" 
              className="w-full h-48 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-right leading-relaxed">
          {question.text}
        </h3>

        {qType === 'multiple-choice' || qType === 'image-choice' ? (
          <div className={cn(
            "grid gap-4",
            qType === 'image-choice' ? "grid-cols-2" : "grid-cols-1"
          )}>
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={showResult}
                className={cn(
                  "w-full rounded-2xl border-2 text-right font-bold transition-all flex items-center justify-between overflow-hidden",
                  qType === 'image-choice' ? "flex-col p-2 h-full" : "p-5",
                  !showResult && "border-gray-100 hover:border-emerald-500 hover:bg-emerald-50",
                  showResult && index === question.correctAnswer && "border-emerald-500 bg-emerald-50 text-emerald-700",
                  showResult && selectedOption === index && index !== question.correctAnswer && "border-rose-500 bg-rose-50 text-rose-700",
                  showResult && index !== question.correctAnswer && selectedOption !== index && "border-gray-50 opacity-50"
                )}
              >
                {qType === 'image-choice' && (
                  <div className="w-full h-32 mb-2 rounded-xl overflow-hidden">
                    <img src={option} alt={`Option ${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="flex items-center justify-between w-full px-2">
                  <span>{qType === 'image-choice' ? `خيار ${index + 1}` : option}</span>
                  {showResult && index === question.correctAnswer && <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />}
                  {showResult && selectedOption === index && index !== question.correctAnswer && <XCircle size={20} className="text-rose-600 shrink-0" />}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <input 
              type="text"
              value={fillValue}
              onChange={(e) => setFillValue(e.target.value)}
              disabled={showResult}
              placeholder={question.placeholder || "اكتب إجابتك هنا..."}
              className="w-full p-5 rounded-2xl border-2 border-gray-100 focus:border-emerald-500 outline-none transition-all text-center text-xl font-bold"
            />
            {!showResult && (
              <button
                onClick={handleFillSubmit}
                className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                تأكيد الإجابة
              </button>
            )}
          </div>
        )}

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 space-y-4"
            >
              <div className={cn(
                "p-6 rounded-2xl",
                (qType === 'fill-in-the-blank' ? fillValue.trim().toLowerCase() === String(question.correctAnswer).toLowerCase() : selectedOption === question.correctAnswer)
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-rose-50 text-rose-800"
              )}>
                <div className="flex items-center gap-2 font-black mb-2 text-lg">
                  {(qType === 'fill-in-the-blank' ? fillValue.trim().toLowerCase() === String(question.correctAnswer).toLowerCase() : selectedOption === question.correctAnswer)
                    ? <><CheckCircle2 size={24} /> أحسنت! إجابة صحيحة</>
                    : <><XCircle size={24} /> للأسف! إجابة خاطئة</>
                  }
                </div>
                {question.explanation && (
                  <p className="font-bold leading-relaxed opacity-90">{question.explanation}</p>
                )}
                {qType === 'fill-in-the-blank' && fillValue.trim().toLowerCase() !== String(question.correctAnswer).toLowerCase() && (
                  <p className="mt-2 font-black">الإجابة الصحيحة هي: {String(question.correctAnswer)}</p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all group"
                >
                  <span>{currentQuestion === questions.length - 1 ? 'إنهاء الاختبار' : 'السؤال التالي'}</span>
                  <ArrowRight size={20} className="group-hover:translate-x--1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
