import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  HelpCircle, 
  BookOpen, 
  Settings, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface InteractiveLessonProps {
  onComplete: () => void;
}

export const InteractiveLesson: React.FC<InteractiveLessonProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState<number | null>(null);

  const stages = [
    {
      id: 'problem',
      title: 'وضعية الانطلاق (وضعية مشكل)',
      icon: <Target className="text-red-500" />,
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
            <p className="text-lg text-gray-800 leading-loose">
              في حصة التعبير الكتابي، كتب التلميذ:
              <br />
              <span className="font-black text-red-600">"الطالبُ مجتهدٌ في دراسته، فهو يراجع دروسه بانتظام."</span>
              <br />
              ثم أعاد صياغتها قائلاً:
              <br />
              <span className="font-black text-emerald-600">"الطالبُ مُراجِعٌ دروسَه بانتظام."</span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200">
            <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle size={20} className="text-blue-500" />
              السؤال الإشكالي:
            </h4>
            <p className="text-gray-700 text-lg">
              هل يمكن لاسم الفاعل <span className="font-bold text-blue-600">"مراجع"</span> أن يعمل عمل فعله في الجملة؟ وما الشروط التي تجعله يعمل عمل الفعل؟
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'discovery',
      title: 'مرحلة الملاحظة والاكتشاف',
      icon: <Lightbulb className="text-amber-500" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-600">تأمل الجملتين السابقتين وأجب عن الأسئلة التالية:</p>
          <div className="grid gap-4">
            {[
              "ما التحول الذي حدث في الجملة الثانية؟",
              "ماذا نسمي كلمة 'مراجع' من الناحية الصرفية؟",
              "هل اكتفى اسم الفاعل بالدلالة أم تجاوزها إلى العمل؟"
            ].map((q, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-black text-amber-600 shadow-sm shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-800 font-bold">{q}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <p className="text-blue-800 font-medium">
              <span className="font-black">نلاحظ:</span> أن الفعل "يراجع" تحول إلى اسم فاعل "مُراجِع"، ومع ذلك بقيت كلمة "دروسه" منصوبة كما كانت مفعولاً به للفعل. هذا يعني أن اسم الفاعل قام بعمل الفعل!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'rule',
      title: 'بناء القاعدة (الفهم والتقعيد)',
      icon: <BookOpen className="text-emerald-500" />,
      content: (
        <div className="space-y-8">
          <section className="space-y-4">
            <h4 className="text-xl font-black text-emerald-700">1. تعريف اسم الفاعل</h4>
            <p className="text-gray-700 leading-loose bg-white p-6 rounded-2xl border border-gray-100">
              اسم الفاعل اسم مشتق يدل على الفعل وعلى من قام به.
            </p>
          </section>
          
          <section className="space-y-4">
            <h4 className="text-xl font-black text-emerald-700">2. صياغته</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                <h5 className="font-black mb-2">من الثلاثي</h5>
                <p className="text-sm text-emerald-800">يصاغ على وزن <span className="font-black">"فَاعِل"</span>. مثال: كَتَبَ ← كَاتِب.</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h5 className="font-black mb-2">من غير الثلاثي</h5>
                <p className="text-sm text-blue-800">على وزن مضارعه مع إبدال حرف المضارعة <span className="font-black">ميماً مضمومة</span> وكسر ما قبل الآخر. مثال: استخرج ← مُستخرِج.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-xl font-black text-emerald-700">3. عمله</h4>
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-amber-900 leading-loose">
                يعمل اسم الفاعل عمل فعله:
                <br />
                • إذا كان فعله لازماً: يرفع <span className="font-black">فاعلاً</span> فقط.
                <br />
                • إذا كان فعله متعدياً: يرفع <span className="font-black">فاعلاً</span> وينصب <span className="font-black">مفعولاً به</span>.
              </p>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'conditions',
      title: 'شروط عمل اسم الفاعل',
      icon: <Settings className="text-purple-500" />,
      content: (
        <div className="space-y-8">
          <div className="grid gap-6">
            <div className="p-6 bg-white rounded-3xl border-2 border-emerald-500 shadow-sm">
              <h4 className="font-black text-emerald-700 mb-4 flex items-center gap-2">
                <CheckCircle size={20} />
                الحالة الأولى: أن يكون معرفاً بـ "ال"
              </h4>
              <p className="text-gray-700">يعمل بدون شروط. مثال: "جاء <span className="font-black text-emerald-600">الحافظُ</span> كتابَ الله".</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border-2 border-blue-500 shadow-sm">
              <h4 className="font-black text-blue-700 mb-4 flex items-center gap-2">
                <CheckCircle size={20} />
                الحالة الثانية: أن يكون نكرة مجردة من "ال"
              </h4>
              <p className="text-gray-700 mb-4">يعمل بشرطين: أن يدل على الحال أو الاستقبال، وأن يعتمد على:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'مبتدأ', ex: 'أنت شاكرٌ فضلَ ربك' },
                  { label: 'نفي', ex: 'ما جاهدٌ أخوك' },
                  { label: 'استفهام', ex: 'أمسافرٌ والدك؟' },
                  { label: 'موصوف', ex: 'مررت برجلٍ حاملٍ حقيبةً' }
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-xs font-black text-blue-600 mb-1">{item.label}</div>
                    <div className="text-sm font-bold text-gray-800">{item.ex}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'practice',
      title: 'تطبيقات تفاعلية',
      icon: <Edit3 className="text-blue-500" />,
      content: (
        <div className="space-y-8">
          <p className="text-gray-600 text-center">اختبر فهمك للدرس من خلال الإجابة عن الأسئلة التالية:</p>
          <div className="space-y-6">
            {[
              {
                id: 1,
                text: 'استخرج اسم الفاعل من الجملة: "الكاتبُ قصتَه مبدعٌ"',
                options: ['الكاتب', 'قصته', 'مبدع'],
                correctAnswer: 0,
                explanation: 'الكاتب على وزن فاعل من الفعل كتب.'
              },
              {
                id: 2,
                text: 'ما عمل اسم الفاعل في جملة: "أمسافرٌ أخوك؟"',
                options: ['نصب مفعول به', 'رفع فاعل', 'جر مضاف إليه'],
                correctAnswer: 1,
                explanation: 'أخوك فاعل لاسم الفاعل مسافر سد مسد الخبر.'
              },
              {
                id: 3,
                text: 'يعمل اسم الفاعل النكرة إذا اعتمد على:',
                options: ['مبتدأ فقط', 'نفي أو استفهام فقط', 'مبتدأ أو نفي أو استفهام أو موصوف'],
                correctAnswer: 2,
                explanation: 'يعمل اسم الفاعل النكرة إذا اعتمد على واحد من هذه المسوغات.'
              }
            ].map((q, i) => (
              <div key={q.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h5 className="font-black text-gray-900 mb-4">{i + 1}. {q.text}</h5>
                <div className="grid gap-3">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => {
                        if (showFeedback === q.id) return;
                        setAnswers({ ...answers, [q.id]: optIdx });
                        setShowFeedback(q.id);
                      }}
                      className={cn(
                        "w-full p-4 rounded-2xl text-right font-bold transition-all border-2",
                        showFeedback === q.id
                          ? optIdx === q.correctAnswer
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                            : answers[q.id] === optIdx
                              ? "bg-red-50 border-red-500 text-red-700"
                              : "bg-gray-50 border-gray-100 text-gray-400"
                          : "bg-gray-50 border-transparent hover:border-blue-500 hover:bg-white text-gray-700"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {showFeedback === q.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={cn(
                        "mt-4 p-4 rounded-xl flex items-start gap-3",
                        answers[q.id] === q.correctAnswer ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      )}
                    >
                      {answers[q.id] === q.correctAnswer ? <CheckCircle size={20} /> : <XCircle size={20} />}
                      <div>
                        <div className="font-black mb-1">{answers[q.id] === q.correctAnswer ? 'إجابة صحيحة!' : 'إجابة خاطئة'}</div>
                        <p className="text-sm opacity-90">{q.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'summary',
      title: 'الخلاصة',
      icon: <Sparkles className="text-amber-500" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-[3rem] text-white shadow-xl shadow-emerald-100">
            <h4 className="text-2xl font-black mb-6">تذكر دائماً:</h4>
            <ul className="space-y-4">
              {[
                "اسم الفاعل اسم مشتق يدل على من قام بالفعل.",
                "يعمل عمل فعله إذا توفرت شروط معينة (التعريف بـ 'ال' أو الاعتماد على مسوغ).",
                "يمكن أن يرفع فاعلاً أو ينصب مفعولاً به."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle size={14} />
                  </div>
                  <span className="font-bold text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center pt-8">
            <p className="text-gray-500 mb-6">تهانينا! لقد أتممت درس اسم الفاعل وعمله بنجاح.</p>
            <button
              onClick={onComplete}
              className="px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              إنهاء الدرس والحصول على النقاط
            </button>
          </div>
        </div>
      )
    }
  ];

  const currentStage = stages[stage];

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-4 no-scrollbar">
        {stages.map((s, i) => (
          <div key={s.id} className="flex items-center shrink-0">
            <button
              onClick={() => i <= stage && setStage(i)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all font-black",
                i === stage 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100 scale-110" 
                  : i < stage 
                    ? "bg-emerald-100 text-emerald-600" 
                    : "bg-gray-100 text-gray-400"
              )}
            >
              {i < stage ? <CheckCircle size={18} /> : i + 1}
            </button>
            {i < stages.length - 1 && (
              <div className={cn(
                "w-8 h-1 mx-1 rounded-full",
                i < stage ? "bg-emerald-200" : "bg-gray-100"
              )} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-2xl">
              {currentStage.icon}
            </div>
            <div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">المرحلة {stage + 1}</div>
              <h2 className="text-2xl font-black text-gray-900">{currentStage.title}</h2>
            </div>
          </div>

          <div className="min-h-[400px]">
            {currentStage.content}
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-gray-100">
            <button
              onClick={() => setStage(Math.max(0, stage - 1))}
              disabled={stage === 0}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                stage === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <ArrowRight size={20} />
              السابق
            </button>

            {stage < stages.length - 1 && (
              <button
                onClick={() => setStage(stage + 1)}
                className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg"
              >
                التالي
                <ArrowLeft size={20} />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
