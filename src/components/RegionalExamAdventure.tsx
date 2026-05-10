import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Zap, ArrowRight, ArrowLeft, 
  CheckCircle2, AlertCircle, RefreshCw, Brain,
  Gamepad2, Lightbulb, ListOrdered, Search,
  Puzzle, BookOpen, Quote, Sword, Map, 
  Shield, Compass, Gem, Lock, Sparkles, Timer
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---
interface GameQuestion {
  id: number;
  text: string;
  options?: string[];
  correct: any;
  explanation: string;
  type?: 'multiple' | 'order' | 'cloze' | 'blitz';
  words?: string[];
}

interface World {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  bgColor: string;
  description: string;
  scenario: string;
  reward: string;
  badge: string;
  difficulty: 'سهل' | 'متوسط' | 'جهوي';
  questions: GameQuestion[];
}

// --- Worlds Data (Tailored to Moroccan 3rd Prep Exam Frame) ---
const WORLDS: World[] = [
  {
    id: 'reading',
    name: 'عالم القراءة والفهم',
    icon: <BookOpen />,
    color: 'emerald',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    description: 'تحليل النصوص، العنوان، الفكرة العامة والقيم.',
    scenario: 'دخلتَ مكتبة قديمة، وأُغلقت الأبواب. للخروج يجب فهم النص امتحاني واستخراج مفاتيحه.',
    reward: 'مفتاح الحكمة',
    badge: 'مكتشف النصوص',
    difficulty: 'متوسط',
    questions: [
      {
        id: 1,
        text: 'مَا الْفِكْرَةُ الْعَامَّةُ لِلنَّصِّ الَّذِي يَتَحَدَّثُ عَنْ "أَهَمِّيَّةِ التَّضَامُنِ فِي الْمُجْتَمَعِ"؟',
        options: ['وَصْفُ جَمَالِ الطَّبِيعَةِ', 'دَوْرُ التَّضَامُنِ فِي تَقْوِيَةِ الرَّوَابِطِ الاِجْتِمَاعِيَّةِ', 'تَارِيخُ الصِّنَاعَةِ الْتَّقْلِيدِيَّةِ', 'أَهَمِّيَّةُ الرِّيَاضَةِ لِلْجِسْمِ'],
        correct: 1,
        explanation: 'الفكرة العامة يجب أن تشمل الموضوع الرئيسي للنص وهو التضامن الاجتماعي.'
      },
      {
        id: 2,
        text: 'مَا هُوَ "الْمَجَالُ" الَّذِي يَنْتَمِي إِلَيْهِ نَصٌّ يَتَنَاوَلُ "قَضَايَا الْبِيئَةِ وَالتَّلَوُّثِ"؟',
        options: ['الْمَجَالُ الْقِيَمِيُّ', 'الْمَجَالُ السُّكَّانِيُّ', 'الْمَجَالُ الاِجْتِمَاعِيُّ وَالاِقْتِصَادِيُّ', 'الْمَجَالُ الْحَضَارِيُّ'],
        correct: 1,
        explanation: 'قضايا البيئة والتلوث تندرج ضمن المجال السكاني في المقرر المغربي.'
      },
      {
        id: 3,
        text: 'اسْتَخْرِجْ ضِدَّ كَلِمَةِ "يُبَدِّدُ" فِي سِيَاقِ: "الْعِلْمُ نُورٌ لَا يُبَدِّدُهُ جَهْلٌ".',
        options: ['يُفَرِّقُ', 'يَجْمَعُ / يُكَثِّفُ', 'يُزِيلُ', 'يَنْشُرُ'],
        correct: 1,
        explanation: 'يبدد تعني يفرق ويزيل، وضدها يجمع أو يكثف.'
      }
    ]
  },
  {
    id: 'grammar',
    name: 'عالم الدرس اللغوي',
    icon: <Shield />,
    color: 'blue',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    description: 'الإعراب، الممنوع من الصرف، التعجب، الاختصاص، النداء، والمدح والذم.',
    scenario: 'أنت محامي اللغة، وعليك الدفاع عن الجملة من الأخطاء في محكمة النحو الكبرى.',
    reward: 'درع الفصاحة',
    badge: 'فارس النحو',
    difficulty: 'جهوي',
    questions: [
      {
        id: 1,
        text: 'مَا هُوَ إِعْرَابُ كَلِمَةِ "أَحْمَدُ" فِي جُمْلَةِ: "سَلَّمْتُ عَلَى أَحْمَدَ"؟',
        options: ['اسْمٌ مَجْرُورٌ بِالْكَسْرَةِ', 'اسْمٌ مَجْرُورٌ بِالْفَتْحَةِ النَّائِبَةِ عَنِ الْكَسْرَةِ', 'مُضَافٌ إِلَيْهِ مَرْفُوعٌ', 'مَفْعُولٌ بِهِ مَنْصُوبٌ'],
        correct: 1,
        explanation: 'أحمد اسم ممنوع من الصرف (علم على وزن الفعل)، يجر بالفتحة النائبة عن الكسرة.'
      },
      {
        id: 2,
        text: 'حَدِّدْ نَوْعَ الأُسْلُوبِ فِي: "يَا طَالِبًا لِلْعِلْمِ اجْتَهِدْ".',
        options: ['أُسْلُوبُ تَعَجُّبٍ', 'أُسْلُوبُ نِدَاءٍ', 'أُسْلُوبُ اِخْتِصَاصٍ', 'أُسْلُوبُ ذَمٍّ'],
        correct: 1,
        explanation: 'تبدأ الجملة بأداة النداء "يا"، فهو أسلوب نداء.'
      },
      {
        id: 3,
        text: 'مَا هُوَ الْمَخْصُوصُ بِالْمَدْحِ فِي: "نِعْمَ الصِّدِيقُ الْمُوَاسِي"؟',
        options: ['نِعْمَ', 'الصِّدِيقُ', 'الْمُوَاسِي', 'مُسْتَتِرٌ'],
        correct: 2,
        explanation: 'المواسي هو الاسم الذي خصصناه بالمدح بعد فعل المدح وفاعله.'
      }
    ]
  },
  {
    id: 'morphology',
    name: 'عالم الصرف والتحويل',
    icon: <RefreshCw />,
    color: 'orange',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    description: 'اسم الفاعل والمفعول، اسم الزمان والمكان، واسم الآلة.',
    scenario: 'للوصول إلى الكنز عليك تحويل الكلمات بالشكل الصحيح في مختبر الصرف.',
    reward: 'جوهرة التغيير',
    badge: 'خبير الصرف',
    difficulty: 'متوسط',
    questions: [
      {
        id: 1,
        text: 'صُغِ اسْمَ الْفَاعِلِ مِنَ الْفِعْلِ "اسْتَخْرَجَ".',
        options: ['مُسْتَخْرَج', 'مُسْتَخْرِج', 'خَارِج', 'مَخْرُج'],
        correct: 1,
        explanation: 'من غير الثلاثي نأتي بمضارعه ونقلب حرف المضارعة ميماً مضمومة وكسر ما قبل الآخر.'
      },
      {
        id: 2,
        text: 'مَا هُوَ اسْمُ الآلَةِ مِمَّا يَلِي؟',
        options: ['مِنْجَل', 'مَجْلِس', 'مَنْظَر', 'مَكْتَب'],
        correct: 0,
        explanation: 'المنجل آلة تستخدم في الحصاد، أما البقية فأسماء مكان.'
      }
    ]
  },
  {
    id: 'rhetoric',
    name: 'عالم البلاغة',
    icon: <Sparkles />,
    color: 'purple',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
    description: 'التشبيه، الاستعارة، الطباق، والمقابلة.',
    scenario: 'الساحر اللغوي أخفى البلاغة داخل ألغاز المتاهة، هل يمكنك فكها؟',
    reward: 'عصا البيان',
    badge: 'أديب البلاغة',
    difficulty: 'متوسط',
    questions: [
      {
        id: 1,
        text: 'مَا نَوْعُ الصُّورَةِ الْبَيَانِيَّةِ فِي: "الْعِلْمُ بَحْرٌ"؟',
        options: ['تَشْبِيهٌ بَلِيغٌ', 'اسْتِعَارَةٌ مَكْنِيَّةٌ', 'كِنَايَةٌ', 'مَجَازٌ مُرْسَلٌ'],
        correct: 0,
        explanation: 'تشبيه بليغ لأنه حُذف منه الأداة ووجه الشبه.'
      },
      {
        id: 2,
        text: 'حَدِّدِ الطِّبَاقَ فِي قَوْلِهِ تَعَالَى: "وَتَحْسَبُهُمْ أَيْقَاظًا وَهُمْ رُقُودٌ".',
        options: ['أَيْقَاظًا - رُقُودٌ', 'تَحْسَبُهُمْ - هُمْ', 'رُقُودٌ - هُمْ', 'لَا يُوجَدُ طِبَاقٌ'],
        correct: 0,
        explanation: 'الطباق هو الجمع بين الشيء وضده (أيقاظ ضد رقود).'
      }
    ]
  },
  {
    id: 'exam',
    name: 'التحدي الجهوي النهائي',
    icon: <Sword />,
    color: 'rose',
    textColor: 'text-rose-700',
    bgColor: 'bg-rose-50',
    description: 'محاكاة كاملة للامتحان الجهوي بنسق سريع.',
    scenario: 'وصلت للمرحلة الأخيرة: عليك اجتياز امتحان جهوي على شكل لعبة قتال زعماء Boss Fight.',
    reward: 'شهادة النجاح الأسطورية',
    badge: 'بطل الجهوي',
    difficulty: 'جهوي',
    questions: [
      {
        id: 1,
        text: 'أَعْرِبْ "الْكُتُبَ" فِي: "مَا أَجْمَلَ الْكُتُبَ!"',
        options: ['فَاعِلٌ مَرْفُوعٌ', 'مَفْعُولٌ بِهِ (مُتَعَجَّبٌ مِنْهُ) مَنْصُوبٌ', 'مُضَافٌ إِلَيْهِ مَجْرُورٌ', 'نَعْتٌ مَنْصُوبٌ'],
        correct: 1,
        explanation: 'في صيغة "ما أفعله"، المتعجب منه يعرب مفعولاً به كائماً.'
      },
      {
        id: 2,
        text: 'حَوِّلِ الْجُمْلَةَ إِلَى أُسْلُوبِ نِدَاءٍ مَعَ ضَبْطِ الْمُنَادَى: "الْمُتَعَلِّمُ يَبْنِي وَطَنَهُ".',
        options: ['يَا مُتَعَلِّمُ ابْنِ وَطَنَكَ!', 'يَا مُتَعَلِّمَ ابْنِ وَطَنَكَ!', 'أَيُّهَا الْمُتَعَلِّمُ ابْنِ وَطَنَكَ!', 'يَا مَنْ تَعَلَّمَ ابْنِ وَطَنَكَ!'],
        correct: 2,
        explanation: 'عند نداء المعرف بـ "ال" نستخدم "أيها" للمذكر.'
      },
      {
        id: 3,
        text: 'اسْتَخْرِجِ الْمَمْنُوعَ مِنَ الصَّرْفِ لِعِلَّةٍ وَاحِدَةٍ.',
        options: ['عُمَر', 'مَسَاجِد', 'إِبْرَاهِيم', 'يَزِيد'],
        correct: 1,
        explanation: 'مساجد ممنوعة من الصرف لعلة واحدة وهي صيغة منتهى الجموع.'
      }
    ]
  }
];

export const RegionalExamAdventure: React.FC = () => {
  const [gameState, setGameState] = useState<'intro' | 'map' | 'playing' | 'result'>('intro');
  const [activeWorld, setActiveWorld] = useState<World | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [unlockedWorlds, setUnlockedWorlds] = useState<string[]>(['reading']);
  const [xp, setXp] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(false);

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0 && !showFeedback) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showFeedback) {
      handleAnswer(-1); // Timeout
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, showFeedback]);

  const handleStartGame = (world: World) => {
    setActiveWorld(world);
    setCurrentStep(0);
    setScore(0);
    setGameState('playing');
    setShowFeedback(false);
    setSelectedOption(null);
    setTimeLeft(30);
    setTimerActive(true);
  };

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    
    setTimerActive(false);
    setSelectedOption(index);
    const correct = activeWorld?.questions[currentStep].correct === index;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
      setXp(prev => prev + 50);
    }
  };

  const handleNext = () => {
    if (activeWorld && currentStep < activeWorld.questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowFeedback(false);
      setSelectedOption(null);
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      setGameState('result');
      // Unlock next world if passing threshold
      const success = (score + (isCorrect ? 1 : 0)) >= (activeWorld?.questions.length || 0) * 0.6;
      if (success) {
        const currentIndex = WORLDS.findIndex(w => w.id === activeWorld?.id);
        if (currentIndex < WORLDS.length - 1) {
          const nextId = WORLDS[currentIndex + 1].id;
          if (!unlockedWorlds.includes(nextId)) {
            setUnlockedWorlds(prev => [...prev, nextId]);
          }
        }
      }
    }
  };

  const colorMap: Record<string, { bg: string; border: string; text: string; lightBg: string; hoverShadow: string; shadow: string; btn: string; hoverBtn: string }> = {
    emerald: { 
      bg: 'bg-emerald-500', 
      border: 'border-emerald-500/30', 
      text: 'text-emerald-400', 
      lightBg: 'bg-emerald-500/10',
      hoverShadow: 'hover:shadow-emerald-500/20',
      shadow: 'shadow-emerald-600/20',
      btn: 'bg-emerald-600',
      hoverBtn: 'hover:bg-emerald-500'
    },
    blue: { 
      bg: 'bg-blue-500', 
      border: 'border-blue-500/30', 
      text: 'text-blue-400', 
      lightBg: 'bg-blue-500/10',
      hoverShadow: 'hover:shadow-blue-500/20',
      shadow: 'shadow-blue-600/20',
      btn: 'bg-blue-600',
      hoverBtn: 'hover:bg-blue-500'
    },
    orange: { 
      bg: 'bg-orange-500', 
      border: 'border-orange-500/30', 
      text: 'text-orange-400', 
      lightBg: 'bg-orange-500/10',
      hoverShadow: 'hover:shadow-orange-500/20',
      shadow: 'shadow-orange-600/20',
      btn: 'bg-orange-600',
      hoverBtn: 'hover:bg-orange-500'
    },
    purple: { 
      bg: 'bg-purple-500', 
      border: 'border-purple-500/30', 
      text: 'text-purple-400', 
      lightBg: 'bg-purple-500/10',
      hoverShadow: 'hover:shadow-purple-500/20',
      shadow: 'shadow-purple-600/20',
      btn: 'bg-purple-600',
      hoverBtn: 'hover:bg-purple-500'
    },
    rose: { 
      bg: 'bg-rose-500', 
      border: 'border-rose-500/30', 
      text: 'text-rose-400', 
      lightBg: 'bg-rose-500/10',
      hoverShadow: 'hover:shadow-rose-500/20',
      shadow: 'shadow-rose-600/20',
      btn: 'bg-rose-600',
      hoverBtn: 'hover:bg-rose-500'
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 pt-24 pb-12 px-4 selection:bg-rose-500/30" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* Top HUD */}
        <div className="flex items-center justify-between mb-12 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center border border-rose-500/20">
              <Shield size={24} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">المستوى الحالي</div>
              <div className="text-xl font-black text-white">فارس البيان</div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">النقاط XP</div>
              <div className="text-2xl font-black text-emerald-400">{xp}</div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">العوالم المحررة</div>
              <div className="text-2xl font-black text-blue-400">{unlockedWorlds.length}/5</div>
            </div>
          </div>

          <div className="hidden md:flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={cn("w-3 h-3 rounded-full", i <= unlockedWorlds.length ? "bg-rose-500" : "bg-white/10")} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="max-w-3xl mx-auto text-center py-12"
            >
              <div className="relative mb-12">
                 <div className="w-56 h-56 bg-slate-800 rounded-[3rem] mx-auto flex items-center justify-center border-8 border-rose-500/30 overflow-hidden shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80" 
                      alt="حكيم العربية" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                 </div>
                 <motion.div 
                   animate={{ scale: [1, 1.2, 1] }} 
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute -top-4 right-1/2 translate-x-36 bg-rose-500 text-white px-6 py-2 rounded-2xl text-sm font-black shadow-lg shadow-rose-500/20"
                 >
                   مُدَرِّبُ النَّجَاحِ
                 </motion.div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.2]">
                 مُغَامَرَاتُ الْجِهَوِي تَنْتَظِرُكَ!
              </h1>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] mb-12">
                <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed italic">
                  "لَقَدْ فَقَدَتْ مَدْرَسَةُ النَّجَاحِ مِفْتَاحَ شَهَادَةِ الثَّالِثَةِ إِعْدَادِي! لَا يُمْكِنُ اسْتِرْجَاعُهُ إِلَّا بِحَلِّ أَلْغَازِ اللُّغَةِ الْعَرَبِيَّةِ عَبْرَ خَمْسَةِ عَوَالِمَ أُسْطُورِيَّةٍ..."
                </p>
              </div>

              <button 
                onClick={() => setGameState('map')}
                className="group relative px-12 py-6 bg-rose-600 rounded-[2rem] text-2xl font-black hover:bg-rose-500 transition-all shadow-2xl shadow-rose-600/40 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center gap-4">
                  اِبْدَأِ الرِّحْلَةَ الآن
                  <ArrowLeft size={28} />
                </span>
              </button>
            </motion.div>
          )}

          {gameState === 'map' && (
            <motion.div 
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <div className="text-center mb-16">
                 <h2 className="text-4xl font-black text-white mb-4">خَرِيطَةُ الْمَمَالِكِ الْخَمْسِ</h2>
                 <p className="text-slate-400 font-bold max-w-xl mx-auto">اختر المملكة التي تود تحريرها أولاً بالمعرفة والعلم.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {WORLDS.map((world, idx) => {
                  const isUnlocked = unlockedWorlds.includes(world.id);
                  return (
                    <motion.div
                      key={world.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={isUnlocked ? { y: -10 } : {}}
                      className={cn(
                        "relative p-8 rounded-[3.5rem] border-2 transition-all overflow-hidden cursor-pointer",
                        isUnlocked 
                          ? `${colorMap[world.color].lightBg} ${colorMap[world.color].border} ${colorMap[world.color].hoverShadow}` 
                          : "bg-slate-900/50 border-white/5 grayscale"
                      )}
                      onClick={() => isUnlocked && handleStartGame(world)}
                    >
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-center p-8">
                           <Lock className="text-white/40 mb-4" size={40} />
                           <div className="text-white/60 font-black">يُفْتَحُ بَعْدَ تَحْرِيرِ أَرْضِ {WORLDS[idx-1]?.name}</div>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-8">
                        <div className={cn(
                          "w-16 h-16 rounded-[2rem] flex items-center justify-center text-2xl shadow-xl",
                          isUnlocked ? `${colorMap[world.color].bg} text-white` : "bg-slate-800 text-slate-600"
                        )}>
                          {world.icon}
                        </div>
                        <div className={cn(
                          "px-4 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider",
                          world.difficulty === 'جهوي' ? "bg-rose-500/20 border-rose-500/30 text-rose-400" : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                        )}>
                          {world.difficulty}
                        </div>
                      </div>

                      <h3 className="text-2xl font-black text-white mb-2">{world.name}</h3>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                        {world.description}
                      </p>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-500 text-xs font-bold bg-white/5 p-3 rounded-2xl">
                          <Compass size={14} className="text-blue-400" />
                          <span>الْمُهِمَّةُ: {world.badge}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 text-xs font-bold bg-white/5 p-3 rounded-2xl">
                          <Gem size={14} className="text-amber-400" />
                          <span>الْجَائِزَةُ: {world.reward}</span>
                        </div>
                      </div>

                      {isUnlocked && (
                         <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between group">
                            <span className="text-sm font-black text-white">اُدْخُلِ الآن</span>
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white/10 group-hover:scale-110")}>
                               <ArrowLeft size={18} />
                            </div>
                         </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && activeWorld && (
            <motion.div 
               key="playing"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-4xl mx-auto"
            >
               {/* Game UI */}
               <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl">
                  {/* Progress Header */}
                  <div className="bg-white/5 p-8 border-b border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white", colorMap[activeWorld.color].lightBg)}>
                           {activeWorld.icon}
                        </div>
                        <div>
                           <h3 className="font-black text-white">{activeWorld.name}</h3>
                           <div className="text-[10px] text-slate-500 font-bold uppercase">{activeWorld.difficulty}</div>
                        </div>
                     </div>

                     <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                           {activeWorld.questions.map((_, i) => (
                             <div key={i} className={cn("w-12 h-2 rounded-full transition-all duration-500", i <= currentStep ? colorMap[activeWorld.color].bg : "bg-white/5")} />
                           ))}
                        </div>
                        <div className="text-[10px] text-slate-500 font-black">السُّؤَالُ {currentStep + 1} مِنْ {activeWorld.questions.length}</div>
                     </div>
                  </div>

                  {/* Body */}
                  <div className="p-10 lg:p-16">
                     <div className="mb-12">
                        <div className="flex items-center justify-center gap-4 mb-8">
                           <div className={cn(
                             "w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-black",
                             timeLeft > 5 ? "border-white/10 text-white" : "border-rose-500 text-rose-500 animate-pulse"
                           )}>
                              {timeLeft}
                           </div>
                           <Timer size={24} className={timeLeft > 5 ? "text-slate-500" : "text-rose-500 anim-shake"} />
                        </div>

                        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 mb-10">
                           <h4 className="text-2xl md:text-3xl font-black text-white leading-[1.6] text-center">
                              {activeWorld.questions[currentStep].text}
                           </h4>
                        </div>

                        <div className="grid gap-4">
                           {activeWorld.questions[currentStep].options?.map((opt, idx) => (
                              <button
                                key={idx}
                                disabled={showFeedback}
                                onClick={() => handleAnswer(idx)}
                                className={cn(
                                  "w-full p-8 rounded-[2.5rem] border-2 text-right text-xl font-bold transition-all relative group",
                                  !showFeedback 
                                    ? "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10" 
                                    : idx === activeWorld.questions[currentStep].correct 
                                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                                      : idx === selectedOption 
                                        ? "bg-rose-500/20 border-rose-500 text-rose-400"
                                        : "bg-white/5 border-white/5 opacity-40"
                                )}
                              >
                                {opt}
                                <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <ArrowLeft size={24} className={colorMap[activeWorld.color].text} />
                                </div>
                              </button>
                           ))}
                        </div>
                     </div>

                     {showFeedback && (
                        <motion.div 
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="space-y-8"
                        >
                           <div className={cn(
                             "p-10 rounded-[3rem] border-2",
                             isCorrect ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                           )}>
                              <h5 className="text-2xl font-black mb-4 flex items-center gap-4">
                                 {isCorrect ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                                 {isCorrect ? 'أَحْسَنْتَ يَا بَطَل!' : 'لَا بَأْسَ، حَاوِلِ التَّرْكِيزَ!'}
                              </h5>
                              <p className="text-lg font-bold opacity-80 leading-relaxed italic">
                                 {activeWorld.questions[currentStep].explanation}
                              </p>
                           </div>

                           <button 
                             onClick={handleNext}
                             className={cn(
                               "w-full py-6 rounded-[2rem] text-2xl font-black transition-all shadow-2xl flex items-center justify-center gap-4",
                               `${colorMap[activeWorld.color].btn} text-white ${colorMap[activeWorld.color].hoverBtn} ${colorMap[activeWorld.color].shadow}`
                             )}
                           >
                             {currentStep === activeWorld.questions.length - 1 ? 'نَتِيجَةُ الْمُغَامَرَةِ' : 'الْمُهِمَّةُ الْقَادِمَةُ'}
                             <ArrowLeft size={24} />
                           </button>
                        </motion.div>
                     )}
                  </div>
               </div>
            </motion.div>
          )}

          {gameState === 'result' && activeWorld && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center py-20"
            >
               <div className="relative mb-12">
                  <div className={cn(
                    "w-48 h-48 rounded-[3rem] mx-auto flex items-center justify-center text-7xl shadow-2xl",
                    score / activeWorld.questions.length >= 0.6 ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-600"
                  )}>
                     <Trophy size={96} />
                  </div>
                  {score / activeWorld.questions.length >= 0.6 && (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 border-4 border-dashed border-emerald-400 rounded-[3.5rem] -m-4 opacity-50"
                    />
                  )}
               </div>

               <h2 className="text-5xl font-black text-white mb-6">
                  {score / activeWorld.questions.length >= 0.6 ? 'تَمَّ تَحْرِيرُ الْمَمْلَكَةِ!' : 'لَمْ تَتَحَرَّرِ الْمَمْلَكةُ بَعْدُ'}
               </h2>
               <p className="text-xl text-slate-400 font-bold mb-12 leading-relaxed">
                  {score / activeWorld.questions.length >= 0.6 
                    ? `بِسَبَبِ ذَكَائِكَ، تُوِّجْتَ بِـ {activeWorld.badge} وَحَصَلْتَ عَلَى {activeWorld.reward}.`
                    : "عَلَيْكَ إِعَادَةُ الْمُحَاوَلَةِ لِاسْتِرْجَاعِ النُّورِ لِهَذِهِ الأَرْضِ."}
               </p>

               <div className="grid grid-cols-2 gap-8 mb-16">
                  <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
                     <div className="text-[10px] text-slate-500 font-black uppercase mb-1">الْمُهِمَّاتُ النَّاجِحَةُ</div>
                     <div className="text-5xl font-black text-white">{score} / {activeWorld.questions.length}</div>
                  </div>
                  <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 text-emerald-400">
                     <div className="text-[10px] text-slate-500 font-black uppercase mb-1">الْمَكَافَأَةُ</div>
                     <div className="text-5xl font-black">+{score * 100} XP</div>
                  </div>
               </div>

               <div className="flex flex-col gap-6">
                  <button 
                    onClick={() => setGameState('map')}
                    className="w-full py-6 bg-white text-slate-900 rounded-[2rem] text-2xl font-black hover:bg-slate-100 transition-all shadow-2xl"
                  >
                    الْعَوْدَةُ إِلَى الْخَرِيطَةِ
                  </button>
                  <button 
                    onClick={() => handleStartGame(activeWorld)}
                    className="w-full py-6 bg-white/5 text-white border border-white/10 rounded-[2rem] text-xl font-bold hover:bg-white/10"
                  >
                    إِعَادَةُ الْمُحَاوَلَةِ فِي {activeWorld.name}
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
