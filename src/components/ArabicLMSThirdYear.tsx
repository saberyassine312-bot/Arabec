import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown, 
  FileText, 
  Compass, 
  PenTool, 
  Lightbulb, 
  Zap, 
  Search, 
  Brain, 
  Layers, 
  CheckCircle, 
  Target, 
  ArrowRight,
  Home,
  Star,
  Type
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useSearchParams, Link } from 'react-router-dom';

// Types
interface LessonStep {
  scenario: string;
  question: string;
  questions: string[];
  analysis: string;
  rule: string;
  examples: string[];
  exercise: {
    question: string;
    correction: string;
  };
}

interface Lesson {
  id: string;
  title: string;
  content: LessonStep;
}

// Data for 3rd Year
const grammarLessons: Lesson[] = [
  {
    id: 'ism-fail',
    title: 'اسم الفاعل وعمله',
    content: {
      scenario: 'أراد الأستاذ أن يصف التلميذ الذي يراجع دروسه، فقال: "التلميذُ مراجعٌ دروسَه". لاحظ خالد أن كلمة "مراجع" (اسم) عملت مثل الفعل "يراجع" ونصبت مفعولاً به "دروسَه".',
      question: 'كيف يصاغ اسم الفاعل من الثلاثي وغير الثلاثي؟ وكيف "يعمل" عمل فعله في الجملة؟',
      questions: [
        'ما هو وزن اسم الفاعل من "كتب"؟ (كاتب)',
        'كيف نصيغه من "استخرج"؟ (مستخرِج)',
        'متى ينصب اسم الفاعل مفعولاً به؟'
      ],
      analysis: 'يساق اسم الفاعل من الثلاثي على وزن "فاعل"، ومن غير الثلاثي على وزن مضارعه بإبدال حرف المضارعة ميماً مضمومة وكسر ما قبل الآخر. يعمل عمل فعله إذا كان محلى بـ "ال" أو مسبوقاً بمبتدأ أو نداء أو نفي.',
      rule: 'اسم الفاعل اسم مشتق ليدل على من قام بالفعل. صيغه: فاعل (للثلاثي)، ومُفعِل (لغير الثلاثي). عمله: يرفع فاعلاً وينصب مفعولاً به إذا توفرت شروطه.',
      examples: ['هذا كاتبٌ رسالةً', 'المتقنُ عملَه محبوبٌ', 'يا طالعاً جبلاً'],
      exercise: {
        question: 'استخرج اسم الفاعل وعمله في: "أغافلٌ قلبُك عن الذكر؟"',
        correction: 'اسم الفاعل: غافل. عمله: رفع الفاعل (قلبُك).'
      }
    }
  },
  {
    id: 'ism-maful',
    title: 'اسم المفعول وعمله',
    content: {
      scenario: 'في المستشفى، قرأنا: "المريضُ محفوظٌ حقُّه". لاحظنا أن "محفوظ" تدل على من وقع عليه الحفظ، وأن الكلمة بعدها "حقُّه" جاءت مرفوعة.',
      question: 'كيف يصاغ اسم المفعول؟ وما هو إعراب الاسم الذي يأتي بعده؟',
      questions: [
        'ما هو وزن اسم المفعول من "حمد"؟ (محمود)',
        'كيف نصيغه من "أكرم"؟ (مُكرَم)',
        'لماذا يرفع اسم المفعول "نائب فاعل"؟'
      ],
      analysis: 'يصاغ اسم المفعول من الثلاثي على وزن "مفعول"، ومن غير الثلاثي مثل اسم الفاعل لكن بفتح ما قبل الآخر. يعمل عمل فعل المبني للمجهول فيرفع نائب فاعل.',
      rule: 'اسم المفعول اسم مشتق يدل على من وقع عليه الفعل. صيغه: مفعول (للثلاثي)، ومُفعَل (لغير الثلاثي). عمله: يرفع نائب فاعل بعده.',
      examples: ['الدرسُ مفهومٌ شرحُه', 'البابُ مغلقٌ', 'ما مهضومٌ حقُّ الضعيف'],
      exercise: {
        question: 'أعرب "حقُّ" في: "هل مسلوبٌ حقُّ المظلوم؟"',
        correction: 'حقُّ: نائب فاعل لاسم المفعول (مسلوب) سد مسد الخبر مرفوع بالضمة.'
      }
    }
  },
  {
    id: 'ikhtisas',
    title: 'أسلوب الاختصاص',
    content: {
      scenario: 'قالت المجموعة: "نحن -المغاربةَ- نحب الوطن". لاحظ التلميذ وجود كلمة منصوبة بين عارضتين توضح من هم "نحن".',
      question: 'لماذا جاءت كلمة "المغاربة" منصوبة؟ وما هو تقدير الفعل المحذوف قبلها؟',
      questions: [
        'ما هي الكلمة التي تمثل "المختص" في الجملة؟',
        'هل يمكن حذف المختص ويبقى المعنى تاماً؟',
        'ما هي حالات الاسم المختص (معرف بـ "ال"، مضاف، أيها/أيتها)؟'
      ],
      analysis: 'أسلوب الاختصاص يذكر فيه اسم ظاهر (مختص) بعد ضمير المتكلم غالباً لتفسيره وتوضيحه. يعرب المختص مفعولاً به لفعل محذوف وجوباً تقديره (أخص).',
      rule: 'أسلوب الاختصاص: ضمير + اسم مختص + باقي الجملة. المختص اسم منصوب بفعل محذوف وجوبا (أخص). يأتي المختص: معرفا بـ "ال"، أو مضافا إلى معرفة، أو بلفظ أيها وأيتها.',
      examples: ['أنا -المعلمَ- أبني العقول', 'بكم -معشرَ الشبابِ- ينهض الوطن', 'نحن -أيها الأوفياءُ- نعتز بكم'],
      exercise: {
        question: 'حدد المختص وإعرابه: "نحن -أهلَ العلمِ- مخلصون".',
        correction: 'المختص: أهلَ. إعرابه: مفعول به منصوب بفعل محذوف وجوبا تقديره "أخص".'
      }
    }
  },
  {
    id: 'nida',
    title: 'أسلوب النداء',
    content: {
      scenario: 'صاح الطفل: "يا أحمدُ"، "يا بائعَ الخبزِ"، "يا غافلاً تنبّه". لاحظ التلميذ اختلاف حركات المنادى.',
      question: 'لماذا تبنى بعض المنادى على الضم وتنصب أخرى؟ وما هي أنواع المنادى؟',
      questions: [
        'ما الفرق بين "يا خالدُ" و "يا خالداً"؟',
        'متى يكون المنادى منصوباً بالفتحة؟',
        'كيف ننادي ما فيه "ال"؟ (يا أيها، يا أيتها)'
      ],
      analysis: 'النداء طلب الإقبال بأداة (يا، أ، أي...). المنادى يبنى على ما يرفع به إذا كان علماً مفرداً أو نكرة مقصودة. وينصب إذا كان مضافاً أو شبيهاً بالمضاف أو نكرة غير مقصودة.',
      rule: 'أدوات النداء: يا، أ، أي، أيا، هيا. أنواع المنادى: 1. مضاف، شبيه بالمضاف، نكرة غير مقصودة (منصوب). 2. علم مفرد، نكرة مقصودة (مبني على الضم في محل نصب).',
      examples: ['يا قدسُ (مبني)', 'يا صاعداً جبلاً (منصوب)', 'يا عبدَ الله (منصوب)'],
      exercise: {
        question: 'ما نوع المنادى في: "يا مسافراً في التأني السلامة"؟',
        correction: 'نكرة غير مقصودة (منصوب).'
      }
    }
  }
];

const ArabicLMSThirdYear: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialComponent = searchParams.get('component');
  
  const [view, setView] = useState<'main' | 'grammar-list' | 'lesson' | 'texts-list'>(
    initialComponent === 'grammar' ? 'grammar-list' : initialComponent === 'texts' ? 'texts-list' : 'main'
  );
  const [activeComponent, setActiveComponent] = useState<string | null>(initialComponent);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showCorrection, setShowCorrection] = useState(false);

  // Computed
  const currentLesson = grammarLessons.find(l => l.id === activeLessonId);

  const steps = [
    { id: 'problem', label: 'وضعية مشكلة', icon: <Zap size={18} /> },
    { id: 'observation', label: 'الفهم والملاحظة', icon: <Search size={18} /> },
    { id: 'analysis', label: 'الاكتشاف والتحليل', icon: <Brain size={18} /> },
    { id: 'rule', label: 'أبني قاعدتي', icon: <Layers size={18} /> },
    { id: 'examples', label: 'أمثلة توضيحية', icon: <CheckCircle size={18} /> },
    { id: 'exercise', label: 'تمرين تطبيق', icon: <Target size={18} /> }
  ];

  const goBack = () => {
    if (view === 'lesson') setView('grammar-list');
    else if (view === 'grammar-list' || view === 'texts-list') setView('main');
  };

  const handleComponentSelect = (comp: string) => {
    setActiveComponent(comp);
    if (comp === 'grammar') {
      setView('grammar-list');
    } else if (comp === 'texts') {
      setView('texts-list');
    }
  };

  const handleLessonSelect = (id: string) => {
    setActiveLessonId(id);
    setActiveStep(0);
    setShowCorrection(false);
    setView('lesson');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Path Visualization */}
        <div className="flex items-center gap-2 mb-8 bg-white p-3 rounded-2xl border border-gray-100 w-fit shadow-sm">
           <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
              <Link to="/levels" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                <Home size={16} />
                <span>الأسلاك</span>
              </Link>
              <ChevronLeft size={14} className="text-gray-300" />
              <Link to="/prep-years" className="hover:text-emerald-600 transition-colors">السلك الإعدادي</Link>
              <ChevronLeft size={14} className="text-gray-300" />
              <button 
                onClick={() => setView('main')}
                className={cn("transition-colors", view === 'main' ? "text-emerald-600" : "hover:text-emerald-600")}
              >
                السنة الثالثة إعدادي
              </button>
              {view !== 'main' && (
                <>
                  <ChevronLeft size={14} />
                  <span className={view === 'grammar-list' ? 'text-emerald-600' : 'text-gray-500'}>مكون الدرس اللغوي</span>
                </>
              )}
           </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'main' && (
            <motion.div key="main" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="text-center mb-12">
                 <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">السنة الثالثة إعدادي</h1>
                 <p className="text-gray-500 font-bold text-lg">اختر المكون التعليمي المناسب</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                 <ComponentCard title="مكون النصوص" icon={<FileText size={32} />} color="bg-blue-50 text-blue-600 hover:bg-blue-600" onClick={() => handleComponentSelect('texts')} />
                 <ComponentCard title="مكون الدرس اللغوي" icon={<BookOpen size={32} />} color="bg-emerald-50 text-emerald-600 hover:bg-emerald-600" onClick={() => handleComponentSelect('grammar')} />
                 <ComponentCard title="مكون التعبير والإنشاء" icon={<PenTool size={32} />} color="bg-amber-50 text-amber-600 hover:bg-amber-600" onClick={() => handleComponentSelect('composition')} />
              </div>
            </motion.div>
          )}

          {view === 'texts-list' && (
            <motion.div key="texts" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
               <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">نصوص السنة الثالثة إعدادي</h2>
                    <p className="text-gray-400 font-bold">المستوى: الثالثة إعدادي • نصوص قرائية</p>
                  </div>
                  <button onClick={goBack} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-sm">
                    <ArrowRight size={20} className="rotate-180" />
                  </button>
               </div>

               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Link to="/interactive/calligraphy" className="group">
                    <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-[3rem] border-2 border-slate-50 shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all text-right relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-150" />
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-50">
                          <Type size={28} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-3">عبقرية الخط العربي</h3>
                        <p className="text-slate-400 font-bold text-sm mb-6 leading-relaxed">درس نصوص تفاعلي متقدم يعتمد على التحليل المنهجي للمراحل اللغوية والفنية.</p>
                        <div className="flex items-center gap-2 text-emerald-600 font-black">
                          <span>ابدأ التحليل التفاعلي</span>
                          <ArrowRight size={18} className="rotate-180 transition-transform group-hover:-translate-x-2" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                  
                  {/* Future text units can go here */}
                  <div className="bg-slate-50 p-8 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                    <div className="w-12 h-12 bg-slate-200 rounded-full" />
                    <p className="text-slate-400 font-black">نصوص إضافية قادمة...</p>
                  </div>
               </div>
            </motion.div>
          )}

          {view === 'grammar-list' && (
            <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
               <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">دروس الدرس اللغوي</h2>
                    <p className="text-gray-400 font-bold">المستوى: الثالثة إعدادي • الدورة الأولى</p>
                  </div>
                  <div className="flex gap-4">
                    <Link to="/grammar-smart-path" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center gap-3 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                      <Brain size={20} />
                      <span>مسارات التعلم الذكي</span>
                    </Link>
                    <button onClick={goBack} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-sm">
                      <ArrowRight size={20} className="rotate-180" />
                    </button>
                  </div>
               </div>

               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grammarLessons.map((lesson, index) => (
                    <motion.button key={lesson.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleLessonSelect(lesson.id)} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all text-right group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-all text-sm">{index + 1}</div>
                        <Compass className="text-emerald-100 group-hover:text-emerald-400 transition-colors" size={40} />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2">{lesson.title}</h3>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mt-4"><span>ابدأ الدرس</span><ArrowRight size={14} className="rotate-180" /></div>
                    </motion.button>
                  ))}
               </div>
            </motion.div>
          )}

          {view === 'lesson' && currentLesson && (
            <motion.div key="lesson" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-8">
               <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                     <button onClick={goBack} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-600 transition-all"><ChevronRight size={24} /></button>
                     <div><h2 className="text-3xl font-black text-gray-900">{currentLesson.title}</h2><div className="text-sm text-gray-400 font-bold mt-1">الثالثة إعدادي • الدرس اللغوي</div></div>
                  </div>
                  <div className="flex bg-gray-50 p-1.5 rounded-2xl">{steps.map((s, i) => (<div key={s.id} className={cn("w-3 h-3 rounded-full mx-1 transition-all", i === activeStep ? "bg-emerald-600 w-8" : i < activeStep ? "bg-emerald-200" : "bg-gray-200")} />))}</div>
               </div>

               <div className="flex flex-wrap justify-center gap-3">
                  {steps.map((step, i) => (
                    <button key={step.id} onClick={() => { setActiveStep(i); setShowCorrection(false); }} className={cn("flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all border-2", activeStep === i ? "bg-emerald-600 text-white border-transparent shadow-xl shadow-emerald-200 -translate-y-1" : "bg-white text-gray-400 border-gray-100 hover:border-emerald-100 hover:text-emerald-600")}>
                      {step.icon}<span>{step.label}</span>
                    </button>
                  ))}
               </div>

               <div className="bg-white rounded-[4rem] shadow-2xl border border-gray-100 overflow-hidden min-h-[500px]">
                  <AnimatePresence mode="wait">
                     <motion.div key={activeStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-10 md:p-16">
                        {activeStep === 0 && (
                          <div className="space-y-8">
                             <ContentTag label="🧩 وضعية مشكلة" color="emerald" />
                             <div className="p-10 bg-emerald-50/50 rounded-[3rem] border border-emerald-100 text-2xl font-bold text-emerald-900 leading-relaxed shadow-inner">{currentLesson.content.scenario}</div>
                             <div className="flex items-start gap-4 p-8 bg-amber-50 rounded-[2rem] border border-amber-100"><Lightbulb size={32} className="text-amber-500 shrink-0 mt-1" /><div className="text-xl font-black text-amber-900 leading-relaxed">{currentLesson.content.question}</div></div>
                             <button onClick={() => setActiveStep(1)} className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200">أبدأ الفهم والملاحظة</button>
                          </div>
                        )}
                        {activeStep === 1 && (
                          <div className="space-y-10">
                             <ContentTag label="🔍 الفهم والملاحظة" color="blue" />
                             <div className="grid gap-6">
                                {currentLesson.content.questions.map((q, i) => (
                                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center gap-6 group hover:border-blue-200 transition-all">
                                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-all">{i + 1}</div>
                                     <p className="text-xl font-bold text-gray-700 leading-relaxed">{q}</p>
                                  </motion.div>
                                ))}
                             </div>
                             <button onClick={() => setActiveStep(2)} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-xl">تحليل النتائج</button>
                          </div>
                        )}
                        {activeStep === 2 && (
                          <div className="space-y-10">
                             <ContentTag label="🧠 الاكتشاف والتحليل" color="purple" />
                             <div className="p-10 bg-purple-50 rounded-[3rem] border border-purple-100"><p className="text-2xl font-bold text-purple-900 leading-relaxed">{currentLesson.content.analysis}</p></div>
                             <button onClick={() => setActiveStep(3)} className="w-full py-5 bg-purple-600 text-white rounded-[2rem] font-black text-xl hover:bg-purple-700 transition-all shadow-xl">بناء القاعدة النهائية</button>
                          </div>
                        )}
                        {activeStep === 3 && (
                          <div className="space-y-10">
                             <ContentTag label="📌 أبني قاعدتي" color="emerald" />
                             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-12 bg-emerald-600 text-white rounded-[4rem] shadow-2xl shadow-emerald-200 text-3xl font-black leading-relaxed relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div><div className="relative z-10">{currentLesson.content.rule}</div>
                             </motion.div>
                             <button onClick={() => setActiveStep(4)} className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-600 transition-all shadow-xl">عرض الأمثلة التوضيحية</button>
                          </div>
                        )}
                        {activeStep === 4 && (
                          <div className="space-y-10">
                             <ContentTag label="✨ أمثلة توضيحية" color="amber" />
                             <div className="grid md:grid-cols-3 gap-6">
                                {currentLesson.content.examples.map((ex, i) => (
                                  <motion.div key={i} whileHover={{ y: -5 }} className="p-8 bg-white border-2 border-amber-100 rounded-[2.5rem] shadow-sm text-center">
                                     <Star className="text-amber-400 mx-auto mb-4" size={32} /><div className="text-2xl font-black text-gray-900">{ex}</div>
                                  </motion.div>
                                ))}
                             </div>
                             <button onClick={() => setActiveStep(5)} className="w-full py-5 bg-amber-500 text-white rounded-[2rem] font-black text-xl hover:bg-amber-600 transition-all shadow-xl shadow-amber-100">تطبيق ما تعلمته</button>
                          </div>
                        )}
                        {activeStep === 5 && (
                          <div className="space-y-10">
                             <ContentTag label="🧪 تمرين تطبيق" color="rose" />
                             <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100"><p className="text-2xl font-bold text-gray-700 leading-relaxed">{currentLesson.content.exercise.question}</p></div>
                             <AnimatePresence>{showCorrection && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100"><h3 className="text-xl font-black text-emerald-700 mb-4 flex items-center gap-2"><CheckCircle size={20} /> التصحيح:</h3><p className="text-2xl font-black text-emerald-800 leading-relaxed">{currentLesson.content.exercise.correction}</p></motion.div>)}</AnimatePresence>
                             <div className="flex flex-col md:flex-row gap-4 pt-6">
                                <button onClick={() => setShowCorrection(!showCorrection)} className="flex-1 py-5 bg-white border-2 border-gray-900 text-gray-900 rounded-[2rem] font-black text-xl hover:bg-gray-50 transition-all">{showCorrection ? 'إخفاء التصحيح' : 'عرض التصحيح'}</button>
                                <button 
                                  onClick={() => {
                                    const nextIdx = grammarLessons.findIndex(l => l.id === activeLessonId) + 1;
                                    if (nextIdx < grammarLessons.length) handleLessonSelect(grammarLessons[nextIdx].id);
                                    else setView('grammar-list');
                                  }}
                                  className="flex-1 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                                >
                                   الدرس القادم
                                </button>
                             </div>
                          </div>
                        )}
                     </motion.div>
                  </AnimatePresence>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ComponentCard = ({ title, icon, color, onClick }: any) => (
  <motion.button whileHover={{ y: -10, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick} className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all text-right group border border-gray-50 flex flex-col items-start h-full">
     <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 transition-all duration-300 group-hover:scale-110 shadow-lg", color)}>{icon}</div>
     <h3 className="text-2xl font-black text-gray-900 mb-4">{title}</h3>
     <div className="mt-auto flex items-center gap-2 text-emerald-600 font-black"><span>استعرض المكون</span><ArrowRight size={20} className="rotate-180" /></div>
  </motion.button>
);

const ContentTag = ({ label, color }: any) => {
  const colors: any = { emerald: "bg-emerald-100 text-emerald-700", blue: "bg-blue-100 text-blue-700", purple: "bg-purple-100 text-purple-700", amber: "bg-amber-100 text-amber-700", rose: "bg-rose-100 text-rose-700" };
  return <div className={cn("inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-black tracking-wide", colors[color])}>{label}</div>;
};

export default ArabicLMSThirdYear;
