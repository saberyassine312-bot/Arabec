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
  Star
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

// Data for 2nd Year
const grammarLessons: Lesson[] = [
  {
    id: 'dual',
    title: 'المثنى وصيغه وملحقاته',
    content: {
      scenario: 'في حفل التكريم، قال المدير: "استحق الجائزةَ التلميذانِ النجيبانِ". لاحظ عمر أن الفعل لشخص واحد لكن الفاعل انتهى بألف ونون.',
      question: 'لماذا انتهت الكلمات بـ "انِ"؟ وما هي القواعد التي تحكم تحويل المفرد إلى اثنين؟',
      questions: [
        'ماذا لو قلنا "أكرمتُ التلميذينِ"؟ لماذا تغيرت الألف ياء؟',
        'هل كل كلمة تنتهي بـ "ان" هي مثنى؟ (مثل: عثمان، عَدنان)',
        'ما هي ملحقات المثنى (اثنان، اثنتان، كلا، كلتا)؟'
      ],
      analysis: 'المثنى يدل على اثنين. يرفع بالألف وينصب ويجر بالياء المفتوح ما قبلها. الملحق بالمثنى يعامل معاملته في الإعراب.',
      rule: 'المثنى هو ما دل على اثنين أو اثنتين بزيادة ألف ونون مكسورة في حالة الرفع، وياء ونون مكسورة في حالتي النصب والجر. يلحق به: هذان، هاتان، اللذان، اللتان، اثنان، اثنتان، وكلا وكلتا المضافتان لضمير.',
      examples: ['جاء الولدانِ (رفع)', 'رأيتُ الولدينِ (نصب)', 'سلمتُ على الولدينِ (جر)'],
      exercise: {
        question: 'اعرب: "كافأ المعلمُ الطالبينِ المجتهدينِ".',
        correction: 'الطالبين: مفعول به منصوب بالياء لأنه مثنى. المجتهدين: نعت منصوب بالياء لأنه مثنى.'
      }
    }
  },
  {
    id: 'salim-plural',
    title: 'الجمع السالم (المذكر والمؤنث) وملحقاته',
    content: {
      scenario: 'دخل خالد المسجد وجد لافتة مكتوب عليها: "بشرى للمصلين والقانتات". لاحظ الجمع بالواو والنون تارة وبياء ونون تارة وبالألف والتاء تارة أخرى.',
      question: 'كيف نفرق بين أنواع الجموع السالمة؟ وما هي الحركات الإعرابية لكل نوع؟',
      questions: [
        'متى نستخدم "المسلمون" ومتى نستخدم "المسلمين"؟',
        'بماذا يرفع جمع المؤنث السالم؟ وما هي علامة نصبه "المتمردة"؟',
        'ما هي ملحقات جمع المذكر السالم (أولو، بنون، سنون...)؟'
      ],
      analysis: 'جمع المذكر السالم يرفع بالواو وينصب ويجر بالياء. جمع المؤنث السالم يرفع بالضمة ويجر بالكسرة، وينصب بالكسرة النائبة عن الفتحة.',
      rule: 'جمع المذكر السالم: زيادة واو ونون أو ياء ونون على المفرد. جمع المؤنث السالم: زيادة ألف وتاء مبسوطة على المفرد. يلحق بالمذكر: أولو، عالمون، بنون، عشرون-تسعون... وبالمنؤث: أولات.',
      examples: ['المعلمون مخلصون', 'المعلماتُ مخلصاتٌ', 'رأيتُ المعلماتِ (نصب بالكسرة)'],
      exercise: {
        question: 'ما علامة إعراب "المؤمناتِ" في: "إنَّ المؤمناتِ صابراتٌ"؟',
        correction: 'اسم إن منصوب وعلامة نصبه الكسرة النائبة عن الفتحة لأنه جمع مؤنث سالم.'
      }
    }
  },
  {
    id: 'taksir-plural',
    title: 'جمع التكسير (القلة والكثرة)',
    content: {
      scenario: 'قرأنا في القرآن: "سبعة أبحر" و"قناديل من نور". لاحظنا أن كلمة "أبحر" جمع "بحر"، و"قناديل" جمع "قنديل". لكن لماذا تغير شكل الكلمة تماماً ولم يزد عليها "ون" أو "ات"؟',
      question: 'لماذا سمي بجمع التكسير؟ وهل له أوزان محددة؟',
      questions: [
        'ما معنى جمع "قلة" وجمع "كثرة"؟',
        'هل أوزان جمع القلة محصورة؟ (أفعُل، أفعال، أفعلة، فعلة)',
        'ما هي صيغة منتهى الجموع؟'
      ],
      analysis: 'جمع التكسير هو ما تغير فيه بناء المفرد عند الجمع. القلة تدل على (3-10) والكثرة تدل على ما فوق ذلك.',
      rule: 'جمع القلة أوزانه أربعة: أَفْعُلٌ، أَفْعَالٌ، أَفْعِلَةٌ، فِعْلَةٌ. ما عداها جموع كثرة. صيغة منتهى الجموع: كل جمع بعد ألف تكسيره حرفان أو ثلاثة أوسطها ساكن (مساجد، مصابيح).',
      examples: ['أقلام (قلة)', 'كتب (كثرة)', 'مساجد (صيغة منتهى الجموع)'],
      exercise: {
        question: 'ما نوع الجمع في: (أنفس، جبال، مفاتيح)؟',
        correction: 'أنفس: جمع قلة (أفعل) | جبال: جمع كثرة | مفاتيح: صيغة منتهى الجموع.'
      }
    }
  },
  {
    id: 'five-names',
    title: 'الأسماء الخمسة',
    content: {
      scenario: 'سمعنا في الخطبة: "جاء أبوك، رأيت أباك، سلمت على أبيك". كلمة واحدة تغيرت حروفها (واو، ألف، ياء) في ثلاث جمل.',
      question: 'ما هي هذه الأسماء؟ ولماذا تعرب بالحروف لا بالحركات؟',
      questions: [
        'ما هي الأسماء الخمسة؟ (أب، أخ، حم، فو، ذو)',
        'هل تعرب بالحروف دائماً؟ (شرط الإضافة لغير ياء المتكلم)',
        'ما الفرق بين "أبي" و "أبوك" في الإعراب؟'
      ],
      analysis: 'هذه الأسماء الخمسة ترفع بالواو وتنصب بالألف وتجر بالياء، بشرط أن تكون مفردة ومضافة لغير ياء المتكلم.',
      rule: 'الأسماء الخمسة: أب، أخ، حم، فو، ذو. ترفع بالواو، تنصب بالألف، وتجر بالياء. شروط إعرابها بالحروف: أن تكون مفردة، مضافة، وإضافتها لغير ياء المتكلم.',
      examples: ['أبوك كريم', 'شاهدتُ حماك', 'سلمتُ على ذي علم'],
      exercise: {
        question: 'أعرب: "نظف فوك من الطعام".',
        correction: 'فوك: فاعل مرفوع بالواو لأنه من الأسماء الخمسة، وهو مضاف والكاف مضاف إليه.'
      }
    }
  }
];

const ArabicLMSSecondYear: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialComponent = searchParams.get('component');
  
  const [view, setView] = useState<'main' | 'grammar-list' | 'lesson'>(
    initialComponent === 'grammar' ? 'grammar-list' : 'main'
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
    else if (view === 'grammar-list') setView('main');
  };

  const handleComponentSelect = (comp: string) => {
    setActiveComponent(comp);
    if (comp === 'grammar') {
      setView('grammar-list');
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
              <Link to="/levels" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                <Home size={16} />
                <span>الأسلاك</span>
              </Link>
              <ChevronLeft size={14} className="text-gray-300" />
              <Link to="/prep-years" className="hover:text-indigo-600 transition-colors">السلك الإعدادي</Link>
              <ChevronLeft size={14} className="text-gray-300" />
              <button 
                onClick={() => setView('main')}
                className={cn("transition-colors", view === 'main' ? "text-indigo-600" : "hover:text-indigo-600")}
              >
                السنة الثانية إعدادي
              </button>
              {view !== 'main' && (
                <>
                  <ChevronLeft size={14} />
                  <span className={view === 'grammar-list' ? 'text-indigo-600' : 'text-gray-500'}>مكون الدرس اللغوي</span>
                </>
              )}
           </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'main' && (
            <motion.div key="main" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="text-center mb-12">
                 <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">السنة الثانية إعدادي</h1>
                 <p className="text-gray-500 font-bold text-lg">اختر المكون التعليمي المناسب</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                 <ComponentCard title="مكون النصوص" icon={<FileText size={32} />} color="bg-indigo-50 text-indigo-600 hover:bg-indigo-600" onClick={() => handleComponentSelect('texts')} />
                 <ComponentCard title="مكون الدرس اللغوي" icon={<BookOpen size={32} />} color="bg-emerald-50 text-emerald-600 hover:bg-emerald-600" onClick={() => handleComponentSelect('grammar')} />
                 <ComponentCard title="مكون التعبير والإنشاء" icon={<PenTool size={32} />} color="bg-rose-50 text-rose-600 hover:bg-rose-600" onClick={() => handleComponentSelect('composition')} />
              </div>
            </motion.div>
          )}

          {view === 'grammar-list' && (
            <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
               <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">دروس الدرس اللغوي</h2>
                    <p className="text-gray-400 font-bold">المستوى: الثانية إعدادي • الدورة الأولى</p>
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
                     <button onClick={goBack} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all"><ChevronRight size={24} /></button>
                     <div><h2 className="text-3xl font-black text-gray-900">{currentLesson.title}</h2><div className="text-sm text-gray-400 font-bold mt-1">الثانية إعدادي • الدرس اللغوي</div></div>
                  </div>
                  <div className="flex bg-gray-50 p-1.5 rounded-2xl">{steps.map((s, i) => (<div key={s.id} className={cn("w-3 h-3 rounded-full mx-1 transition-all", i === activeStep ? "bg-indigo-600 w-8" : i < activeStep ? "bg-indigo-200" : "bg-gray-200")} />))}</div>
               </div>

               <div className="flex flex-wrap justify-center gap-3">
                  {steps.map((step, i) => (
                    <button key={step.id} onClick={() => { setActiveStep(i); setShowCorrection(false); }} className={cn("flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all border-2", activeStep === i ? "bg-indigo-600 text-white border-transparent shadow-xl shadow-indigo-200 -translate-y-1" : "bg-white text-gray-400 border-gray-100 hover:border-indigo-100 hover:text-indigo-600")}>
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
                             <button onClick={() => setActiveStep(1)} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl">أبدأ الفهم والملاحظة</button>
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
                             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-12 bg-indigo-600 text-white rounded-[4rem] shadow-2xl shadow-indigo-200 text-3xl font-black leading-relaxed relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div><div className="relative z-10">{currentLesson.content.rule}</div>
                             </motion.div>
                             <button onClick={() => setActiveStep(4)} className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-600 transition-all shadow-xl">عرض الأمثلة التوضيحية</button>
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
                                  className="flex-1 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-700 transition-all shadow-xl"
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
     <div className="mt-auto flex items-center gap-2 text-indigo-600 font-black"><span>استعرض المكون</span><ArrowRight size={20} className="rotate-180" /></div>
  </motion.button>
);

const ContentTag = ({ label, color }: any) => {
  const colors: any = { emerald: "bg-emerald-100 text-emerald-700", blue: "bg-blue-100 text-blue-700", purple: "bg-purple-100 text-purple-700", amber: "bg-amber-100 text-amber-700", rose: "bg-rose-100 text-rose-700" };
  return <div className={cn("inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-black tracking-wide", colors[color])}>{label}</div>;
};

export default ArabicLMSSecondYear;
