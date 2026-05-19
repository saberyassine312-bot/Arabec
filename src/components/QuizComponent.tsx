import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, XCircle, Trophy, ArrowRight, 
  RotateCcw, HelpCircle, BarChart3, AlertCircle, 
  Target, TrendingUp, ClipboardCheck, Sparkles 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AssessmentType, generateCorrectionReport, CorrectionReport } from '../lib/smartCorrector';

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
  onComplete: (result: any) => void;
  title?: string;
  type?: AssessmentType;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ 
  questions, 
  onComplete, 
  title, 
  type = AssessmentType.FORMATIVE 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [fillValue, setFillValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [report, setReport] = useState<CorrectionReport | null>(null);

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
      const finalReport = generateCorrectionReport(type, score, questions.length, wrongAnswers);
      setReport(finalReport);
      onComplete({
        score: `${score} من ${questions.length}`,
        wrongAnswers,
        totalQuestions: questions.length,
        correctCount: score,
        report: finalReport
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

  if (isFinished && report) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto py-12"
        dir="rtl"
      >
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
          {/* Main Header */}
          <div className="bg-gray-900 p-10 text-white text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <motion.div 
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20"
             >
                <Trophy size={48} className="text-amber-400" />
             </motion.div>
             <h2 className="text-4xl font-black mb-2">تقرير التقييم الذكي</h2>
             <p className="text-gray-400 font-bold">{title || 'نتائج الاختبار'}</p>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            {/* Score Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="نوع الاختبار" value={report.type} icon={<ClipboardCheck className="text-indigo-600" />} color="bg-indigo-50" />
              <StatCard label="النقطة النهائية" value={`${report.score}/20`} icon={<Target className="text-emerald-600" />} color="bg-emerald-50" />
              <StatCard label="النسبة المئوية" value={`${report.percentage}%`} icon={<BarChart3 className="text-blue-600" />} color="bg-blue-50" />
              <StatCard label="التقدير" value={report.grade} icon={<Sparkles className="text-amber-600" />} color="bg-amber-50" />
            </div>

            {/* Diagnostic Details */}
            {report.levelInfo && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <div className="flex items-center gap-3 mb-4 text-slate-800">
                    <AlertCircle className="text-slate-400" />
                    <h3 className="text-xl font-black">التشخيص التربوي</h3>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-indigo-600 text-white px-6 py-2 rounded-full font-black text-sm">
                      {report.levelInfo.status}
                    </span>
                    <p className="text-slate-600 font-bold text-lg">{report.levelInfo.diagnosis}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100">
                    <h4 className="font-black text-emerald-900 mb-4 flex items-center gap-2">
                      <TrendingUp size={20} />
                      خطة الدعم والتحسين
                    </h4>
                    <p className="text-emerald-800 font-bold leading-relaxed">{report.levelInfo.supportPlan}</p>
                  </div>
                  
                  <div className="bg-amber-50/50 p-8 rounded-[2.5rem] border border-amber-100">
                    <h4 className="font-black text-amber-900 mb-4 flex items-center gap-2">
                      <Target size={20} />
                      الأولويات المقترحة
                    </h4>
                    <ul className="space-y-2">
                       {report.levelInfo.priorities.map((p, i) => (
                         <li key={i} className="flex items-center gap-2 text-amber-800 font-bold">
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                            {p}
                         </li>
                       ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-8">
               <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                  <h4 className="font-black text-gray-900 mb-4">أهم المكتسبات</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.levelInfo?.strengths.map(s => (
                      <span key={s} className="bg-white px-4 py-2 rounded-xl text-emerald-600 font-bold border border-emerald-100">{s}</span>
                    ))}
                  </div>
               </div>
               <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                  <h4 className="font-black text-gray-900 mb-4">نقاط تحتاج تركيز</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.levelInfo?.weaknesses.length ? report.levelInfo.weaknesses.map(w => (
                      <span key={w} className="bg-white px-4 py-2 rounded-xl text-rose-600 font-bold border border-rose-100">{w}</span>
                    )) : <span className="text-gray-400 font-bold italic">لا يوجد تعثرات ملحوظة</span>}
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200"
              >
                <RotateCcw size={24} />
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Helper component
  function StatCard({ label, value, icon, color }: any) {
    return (
      <div className={cn("p-6 rounded-3xl flex flex-col items-center gap-3 text-center border border-gray-100 shadow-sm", color)}>
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider opacity-60 mb-0.5">{label}</p>
          <p className="text-lg font-black text-gray-900">{value}</p>
        </div>
      </div>
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
