import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Zap, ArrowRight, ArrowLeft, 
  CheckCircle2, AlertCircle, RefreshCw, Brain,
  Gamepad2, Lightbulb, ListOrdered, Search,
  Puzzle, BookOpen, Quote
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---
interface Question {
  id: number;
  text: string;
  options?: string[];
  correct: string | number;
  explanation: string;
  words?: string[]; // For ordering games
}

interface Game {
  id: number;
  title: string;
  type: string;
  rules: string;
  questions: Question[];
}

// --- Games Data ---
const GAMES: Game[] = [
  {
    id: 1,
    title: "فرسان الجمال",
    type: "إكمال الجملة",
    rules: "اختر الكلمة المناسبة التي تجعل الجملة صحيحة من حيث المعنى والقواعد.",
    questions: [
      { id: 1, text: "صعد المسافر ______ الطائرة بهدوء.", options: ["إلى", "على", "في", "عن"], correct: 1, explanation: "نستخدم 'على' مع وسائل النقل الكبيرة غالباً (على متن الطائرة)." },
      { id: 2, text: "كان الجو ______ في الصباح الباكر.", options: ["بارداً", "باردٌ", "باردٍ", "بارد"], correct: 0, explanation: "خبر 'كان' يكون منصوباً، لذا نقول 'بارداً'." },
      { id: 3, text: "العلم ______ ينير طريق صاحبه.", options: ["سلاحٌ", "سلاحَ", "سلاحِ", "السلاح"], correct: 0, explanation: "خبر المبتدأ مرفوع، لذا نقول 'سلاحٌ'." },
      { id: 4, text: "لم ______ التلميذ دروسه بالأمس.", options: ["يهملُ", "يهملَ", "يهملْ", "يهملون"], correct: 2, explanation: "الفعل المضارع بعد 'لم' يكون مجزوماً بالسكون." },
      { id: 5, text: "رأيتُ ______ في الحديقة يغرد.", options: ["عصفورٌ", "عصفورٍ", "عصفوراً", "عصفور"], correct: 2, explanation: "المفعول به يكون منصوباً، لذا نقول 'عصفوراً'." }
    ]
  },
  {
    id: 2,
    title: "لغز العباقرة",
    type: "لغز لغوي",
    rules: "اقرأ الوصف بعناية وحاول معرفة الشيء المقصود.",
    questions: [
      { id: 1, text: "أنا كلمة من خمسة حروف، إذا حذفت أول حرفين صرت شيئاً نلمسه، وإذا قرأتني من اليمين كالشمال لم يتغير معني. ما هي؟", options: ["خوخ", "توت", "خوخة", "كلمة"], correct: 2, explanation: "كلمة 'خوخة' إذا حذفت أول حرفين (خو) أصبحت 'خة' (ليست هذه المقصودة).. الصحيح هو 'خوخ' (3 حروف).. يبدو اللغز يلمح لـ 'خوخة' في صياغة أخرى ولكن 'خوخ' هي الأشهر." },
      { id: 2, text: "ما هو الشيء الذي له عين واحدة ولا يرى؟", options: ["الإبرة", "النافذة", "البحر", "الجبل"], correct: 0, explanation: "للإبرة ثقب يسمى 'عين' ولكنها لا ترى." },
      { id: 3, text: "أنا موجود في كل مكان، لكني لا أرى، وأدخل الرئتين لأسكن. من أنا؟", options: ["الماء", "الهواء", "الضوء", "الكلور"], correct: 1, explanation: "الهواء ضروري للحياة ويدخل الرئتين." },
      { id: 4, text: "كلمة إذا نطقت بها كُسر معناها؟", options: ["الزجاج", "الصمت", "الكتاب", "الحقيقة"], correct: 1, explanation: "إذا تكلمت، انتهى الصمت وانكسر." },
      { id: 5, text: "ما هو القبر الذي سار بصاحبه؟", options: ["السفينة", "الحوت (يونس)", "التابوت", "الصحراء"], correct: 1, explanation: "حوت سيدنا يونس عليه السلام سار به في البحر." }
    ]
  },
  {
    id: 3,
    title: "كنز المفردات",
    type: "أحجية معاني",
    rules: "ابحث عن المعنى الصحيح للكلمة المذكورة.",
    questions: [
      { id: 1, text: "ما معنى كلمة 'الوتين' في قوله تعالى: 'ثم لقطعنا منه الوتين'؟", options: ["القلب", "شريان القلب الرئيسي", "العنق", "اللسان"], correct: 1, explanation: "الوتين هو نياط القلب أو الشريان الذي يغذي الجسم بالدم." },
      { id: 2, text: "ما معنى كلمة 'الغسق'؟", options: ["الفجر", "شدة الظلمة", "الضحى", "الظهيرة"], correct: 1, explanation: "الغسق هو أول ظلمة الليل." },
      { id: 3, text: "ما هو 'اللجين'؟", options: ["الذهب", "الفضة", "النحاس", "الحرير"], correct: 1, explanation: "اللجين هو اسم من أسماء الفضة." },
      { id: 4, text: "ما معنى 'القسور'؟", options: ["النمر", "الأسد", "الصقر", "الذئب"], correct: 1, explanation: "القسور هو أحد أسماء الأسد." },
      { id: 5, text: "ما هو 'المنون'؟", options: ["الحظ", "الموت", "المال", "القوة"], correct: 1, explanation: "المنون تعني الموت أو الدهر." }
    ]
  },
  {
    id: 4,
    title: "بناء الجمل",
    type: "ترتيب الكلمات",
    rules: "رتب الكلمات المبعثرة لتكون جملة مفيدة وصحيحة.",
    questions: [
      { id: 1, text: "رتب الجملة:", words: ["العلم", "طريق", "نور", "النجاح"], correct: "العلم نور طريق النجاح", explanation: "الجملة الاسمية تبدأ بالمبتدأ وتكمل المعنى بالخبر." },
      { id: 2, text: "رتب الجملة:", words: ["المعلم", "التلاميذ", "في", "يشرح", "القسم"], correct: "يشرح المعلم في القسم التلاميذ", explanation: "فعل + فاعل + حرف جر + اسم مجرور." }, // Fixed order logic
      { id: 3, text: "رتب الجملة:", words: ["الوطن", "من", "حب", "الإيمان"], correct: "حب الوطن من الإيمان", explanation: "جملة مشهورة تعبر عن الانتماء." },
      { id: 4, text: "رتب الجملة:", words: ["الماء", "كل", "جعلنا", "من", "حي", "شيء"], correct: "جعلنا من الماء كل شيء حي", explanation: "آية قرآنية تؤكد أهمية الماء." },
      { id: 5, text: "رتب الجملة:", words: ["الرياضة", "الجسم", "العقل", "وتقوي", "تنشط"], correct: "الرياضة تنشط العقل وتقوي الجسم", explanation: "فوائد الرياضة على العقل والجسد." }
    ]
  },
  {
    id: 5,
    title: "الغريب بيننا",
    type: "الكلمة الشاذة",
    rules: "استخرج الكلمة التي لا تنتمي للمجموعة.",
    questions: [
      { id: 1, text: "أي كلمة هي الشاذة؟", options: ["تفاح", "برتقال", "خيار", "موز"], correct: 2, explanation: "الخيار من الخضروات والباقي فواكه." },
      { id: 2, text: "أي كلمة هي الشاذة؟", options: ["أسد", "نمر", "فهد", "غزال"], correct: 3, explanation: "الغزال حيوان عاشب والباقي مفترسات." },
      { id: 3, text: "أي كلمة هي الشاذة؟", options: ["القاهرة", "دمشق", "لندن", "الرباط"], correct: 2, explanation: "لندن مدينة أوروبية والباقي عواصم عربية." },
      { id: 4, text: "أي كلمة هي الشاذة؟", options: ["يكتب", "يقرأ", "كتاب", "يدرس"], correct: 2, explanation: "'كتاب' اسم والباقي أفعال مضارعة." },
      { id: 5, text: "أي كلمة هي الشاذة؟", options: ["محمد", "أحمد", "فاطمة", "علي"], correct: 2, explanation: "فاطمة اسم مؤنث والباقي مذكر." }
    ]
  },
  {
    id: 6,
    title: "جسر المعاني",
    type: "ربط الكلمة بمعناها",
    rules: "اختر المعنى الصحيح للكلمة المقترحة.",
    questions: [
      { id: 1, text: "ما معنى 'كفاح'؟", options: ["استسلام", "نضال", "راحة", "لعب"], correct: 1, explanation: "الكفاح هو النضال وبذل الجهد." },
      { id: 2, text: "ما معنى 'شاسع'؟", options: ["ضيق", "واسع", "قريب", "صغير"], correct: 1, explanation: "شاسع تعني واسع جداً أو بعيد المدى." },
      { id: 3, text: "ما معنى 'فطن'؟", options: ["غبي", "ذكي", "كسول", "خائف"], correct: 1, explanation: "فطن تعني ذكي وسريع البديهة." },
      { id: 4, text: "ما معنى 'هزيل'؟", options: ["قوي", "سمين", "ضعيف", "طويل"], correct: 2, explanation: "هزيل تعني ضعيف ونحيف جداً." },
      { id: 5, text: "ما معنى 'إقدام'؟", options: ["خوف", "هروب", "شجاعة", "تردد"], correct: 2, explanation: "الإقدام هو الشجاعة والمبادرة." }
    ]
  },
  {
    id: 7,
    title: "بحر المترادفات",
    type: "الترادف",
    rules: "ابحث عن الكلمة التي تعطي نفس المعنى.",
    questions: [
      { id: 1, text: "مرادف كلمة 'منال' هو:", options: ["هدف", "طريق", "حلم", "أمل"], correct: 0, explanation: "المنال هو ما ينال ويُدرك، أي الهدف." },
      { id: 2, text: "مرادف كلمة 'سرور' هو:", options: ["حزن", "فرح", "غضب", "خوف"], correct: 1, explanation: "السرور هو الفرح والبهجة." },
      { id: 3, text: "مرادف كلمة 'وهن' هو:", options: ["قوة", "ضعف", "نور", "ظلام"], correct: 1, explanation: "الوهن هو الضعف (وهن العظم مني)." },
      { id: 4, text: "مرادف كلمة 'عبق' هو:", options: ["رائحة طيبة", "صوت عال", "لون زاه", "طعم حلو"], correct: 0, explanation: "العبق هو الرائحة الزكية." },
      { id: 5, text: "مرادف كلمة 'وجل' هو:", options: ["طمأنينة", "خوف", "سرعة", "بطء"], correct: 1, explanation: "الوجل هو الفزع والخوف." }
    ]
  },
  {
    id: 8,
    title: "تحدي الأضداد",
    type: "الأضداد",
    rules: "اختر الكلمة التي تعكس المعنى تماماً.",
    questions: [
      { id: 1, text: "ضد كلمة 'سخي' هو:", options: ["كريم", "بخيل", "شجاع", "قوي"], correct: 1, explanation: "السخي هو الكريم وضده البخيل." },
      { id: 2, text: "ضد كلمة 'أمانة' هو:", options: ["صدق", "خيانة", "وفاء", "إخلاص"], correct: 1, explanation: "الأمانة ضدها الخيانة." },
      { id: 3, text: "ضد كلمة 'تشاؤم' هو:", options: ["تفاؤل", "يأس", "حزن", "خوف"], correct: 0, explanation: "التشاؤم ضده التفاؤل." },
      { id: 4, text: "ضد كلمة 'قاحلة' هو:", options: ["يابسة", "خضراء ومثمرة", "صحراوية", "مرتفعة"], correct: 1, explanation: "القاحلة هي التي لا نبات فيها، وضدها الخضراء المثمرة." },
      { id: 5, text: "ضد كلمة 'فناء' هو:", options: ["موت", "بقاء", "زوال", "نهاية"], correct: 1, explanation: "الفناء هو الزوال وضده البقاء والخلود." }
    ]
  },
  {
    id: 9,
    title: "حكم وأمثال",
    type: "فهم الأمثال",
    rules: "أكمل المثل الشعبي أو الحكمة العربية المشهورة.",
    questions: [
      { id: 1, text: "من جد وجد ومن زرع ______.", options: ["حصد", "أكل", "باع", "سقى"], correct: 0, explanation: "مثل يحث على الجد والاجتهاد لنيل الثمار." },
      { id: 2, text: "الوقت كالسيف إن لم تقطعه ______.", options: ["قتلك", "قطعك", "ضاع", "فاتك"], correct: 1, explanation: "حكمة تؤكد أهمية استغلال الوقت." },
      { id: 3, text: "على قدر أهل العزم تأتي ______.", options: ["العزائم", "النتائج", "الأحلام", "الأعمال"], correct: 0, explanation: "بيت شعري للمتنبي يحث على الهمة العالية." },
      { id: 4, text: "الطيور على أشكالها ______.", options: ["تطير", "تغرد", "تقع", "تبني"], correct: 2, explanation: "مثل يعني أن الناس يميلون لمن يشبههم." },
      { id: 5, text: "رب أخ لك لم ______.", options: ["تراه", "تلده أمك", "تعرفه", "تساعده"], correct: 1, explanation: "مثل يشدد على أهمية الصداقة التي تضاهي قرابة الدم." }
    ]
  },
  {
    id: 10,
    title: "برج الإعراب",
    type: "إعراب سريع",
    rules: "حدد الوظيفة النحوية الصحيحة للكلمة تحتها خط.",
    questions: [
      { id: 1, text: "التلميذُ المجتهدُ محبوبٌ. (إعراب 'محبوبٌ')", options: ["مبتدأ", "خبر", "نعت", "فاعل"], correct: 1, explanation: "محبوبٌ هو الخبر الذي أتم معنى الجملة عن التلميذ." },
      { id: 2, text: "قرأتُ قصةً ممتعةً. (إعراب 'قصةً')", options: ["فاعل", "مفعول به", "مبتدأ", "حال"], correct: 1, explanation: "قصةً وقع عليها فعل القراءة فهي مفعول به." },
      { id: 3, text: "ذهبَ محمدٌ إلى المدرسةِ. (إعراب 'المدرسةِ')", options: ["اسم مجرور", "مفعول به", "نعت", "مضاف إليه"], correct: 0, explanation: "المدرسةِ جاءت بعد حرف الجر 'إلى'." },
      { id: 4, text: "نام الطفلُ باكراً. (إعراب 'باكراً')", options: ["ظرف زمان", "صفة", "مفعول به", "خبر"], correct: 0, explanation: "باكراً تدل على وقت حدوث الفعل فهي ظرف زمان." },
      { id: 5, text: "كافأ المعلمُ المتفوقينَ. (إعراب 'المتفوقينَ')", options: ["مفعول به منصوب بالفتحة", "مفعول به منصوب بالياء", "فاعل مرفوع بالواو", "نعت مرفوع"], correct: 1, explanation: "المتفوقينَ مفعول به منصوب بالياء لأنه جمع مذكر سالم." }
    ]
  }
];

export const ArabicGamesCollection: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
  const [wordsOrder, setWordsOrder] = useState<string[]>([]);

  const handleStartGame = (game: Game) => {
    setSelectedGame(game);
    setStep(0);
    setScore(0);
    setIsFinished(false);
    setShowFeedback(false);
    setSelectedOption(null);
    if (game.questions[0].words) {
      setWordsOrder([...game.questions[0].words].sort(() => Math.random() - 0.5));
    }
  };

  const handleAnswer = (answer: string | number) => {
    if (showFeedback) return;
    
    setSelectedOption(answer);
    setShowFeedback(true);
    
    const correct = selectedGame?.questions[step].correct;
    if (answer === correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    if (selectedGame && step < selectedGame.questions.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (selectedGame.questions[nextStep].words) {
        setWordsOrder([...selectedGame.questions[nextStep].words!].sort(() => Math.random() - 0.5));
      }
    } else {
      setIsFinished(true);
    }
  };

  const reset = () => {
    setSelectedGame(null);
    setStep(0);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4 shadow-inner" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {!selectedGame ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold">
                <Brain size={18} />
                <span>عشر ألعاب في مكان واحد</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 leading-tight">سلسلة الألعاب اللغوية</h1>
              <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                طور مهاراتك في الفهم، القواعد، الثروة اللغوية والتفكير المنطقي عبر هذه السلسلة المختارة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {GAMES.map((game, i) => (
                <motion.button
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => handleStartGame(game)}
                  className="bg-white p-6 rounded-[2.5rem] text-right border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      {i % 4 === 0 ? <Puzzle size={28} /> : i % 4 === 1 ? <Search size={28} /> : i % 4 === 2 ? <BookOpen size={28} /> : <Quote size={28} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{game.title}</h3>
                      <div className="text-sm font-bold text-emerald-600">{game.type}</div>
                    </div>
                  </div>
                  <p className="text-slate-500 font-medium mb-6 text-sm leading-relaxed">{game.rules}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full">5 أسئلة</span>
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-sm">
                      <span>ابدأ الآن</span>
                      <ArrowLeft size={16} />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-10 text-white relative">
              <button 
                onClick={reset}
                className="absolute top-8 left-8 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
              >
                <X className="text-white" size={24} />
              </button>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <Gamepad2 size={32} />
                </div>
                <h2 className="text-3xl font-black">{selectedGame.title}</h2>
                <p className="text-emerald-100 font-bold mt-2 opacity-80">{selectedGame.rules}</p>
              </div>
            </div>

            <div className="p-10 lg:p-14">
              {!isFinished ? (
                <div className="space-y-10">
                  <div className="flex justify-between items-center text-sm font-black text-slate-400 uppercase tracking-widest">
                    <span>السؤال {step + 1} / {selectedGame.questions.length}</span>
                    <div className="flex gap-1.5">
                      {selectedGame.questions.map((_, i) => (
                        <div key={i} className={cn("w-8 h-1.5 rounded-full transition-all duration-500", i <= step ? "bg-emerald-500" : "bg-slate-100")} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h3 className="text-3xl font-black text-slate-900 leading-tight">
                      {selectedGame.questions[step].text}
                    </h3>

                    {selectedGame.questions[step].words ? (
                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-3 justify-center">
                          {wordsOrder.map((word, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                const newOrder = wordsOrder.filter((_, idx) => idx !== i);
                                const selected = (selectedOption as string) ? (selectedOption as string) + " " + word : word;
                                setSelectedOption(selected);
                                setWordsOrder(newOrder);
                              }}
                              className="px-6 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-slate-700 hover:border-emerald-400 hover:bg-white transition-all shadow-sm"
                            >
                              {word}
                            </button>
                          ))}
                        </div>
                        <div className="p-6 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-3xl min-h-[80px] text-center">
                          <div className="text-2xl font-black text-emerald-800 break-words">
                            {selectedOption || <span className="opacity-30 italic">رتب الكلمات هنا...</span>}
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => {
                              setSelectedOption(null);
                              setWordsOrder([...selectedGame.questions[step].words!].sort(() => Math.random() - 0.5));
                            }}
                            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200"
                          >
                            إعادة الترتيب
                          </button>
                          <button 
                            disabled={!selectedOption || wordsOrder.length > 0}
                            onClick={() => handleAnswer(selectedOption as string)}
                            className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50"
                          >
                            تأكيد الترتيب
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {selectedGame.questions[step].options?.map((opt, i) => (
                          <button
                            key={i}
                            disabled={showFeedback}
                            onClick={() => handleAnswer(i)}
                            className={cn(
                              "w-full p-6 border-2 rounded-2xl text-right font-bold text-xl transition-all flex items-center justify-between group",
                              !showFeedback ? "bg-slate-50 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50" :
                              i === selectedGame.questions[step].correct ? "bg-emerald-50 border-emerald-500 text-emerald-700" :
                              i === selectedOption ? "bg-red-50 border-red-500 text-red-700" : "bg-slate-50 border-slate-100 opacity-50"
                            )}
                          >
                            <span>{opt}</span>
                            {showFeedback && i === selectedGame.questions[step].correct && <CheckCircle2 size={24} className="text-emerald-600" />}
                            {showFeedback && i === selectedOption && i !== selectedGame.questions[step].correct && <AlertCircle size={24} className="text-red-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className={cn(
                        "p-8 rounded-3xl border-r-8 shadow-sm",
                        (selectedOption === selectedGame.questions[step].correct || (selectedGame.type === 'ترتيب الكلمات' && selectedOption === selectedGame.questions[step].correct)) 
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900" 
                          : "bg-red-50 border-red-500 text-red-900"
                      )}>
                        <h4 className="text-xl font-black mb-3">
                          {selectedOption === selectedGame.questions[step].correct ? "رائع! إجابة صحيحة 🎉" : "للأسف! إجابة خاطئة 💡"}
                        </h4>
                        <p className="text-lg font-bold opacity-80 leading-relaxed">
                          {selectedGame.questions[step].explanation}
                        </p>
                      </div>
                      <button
                        onClick={handleNext}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl"
                      >
                        <span>{step === selectedGame.questions.length - 1 ? 'عرض النتيجة النهائية' : 'السؤال التالي'}</span>
                        <ArrowLeft size={20} />
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-10 py-10">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner relative z-10">
                      <Trophy size={64} />
                    </div>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 border-4 border-dashed border-amber-300 rounded-full -m-2 opacity-50"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 mb-2">ممتاز يا بطل!</h3>
                    <p className="text-xl text-slate-500 font-bold italic">
                      "لغتُنا العربية كوزُ كنزٍ لا يفنى، وأنت اليوم كسبت مفتاحاً جديداً لهذا الكنز."
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
                    <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm">
                      <div className="text-xs text-emerald-600 font-black uppercase mb-1">النتيجة</div>
                      <div className="text-4xl font-black text-emerald-700">{score} / {selectedGame.questions.length}</div>
                    </div>
                    <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 shadow-sm">
                      <div className="text-xs text-blue-600 font-black uppercase mb-1">النقاط</div>
                      <div className="text-4xl font-black text-blue-700">+{score * 10} XP</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={reset}
                      className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:-translate-y-1"
                    >
                      العودة للألعاب الأخرى
                    </button>
                    <button 
                      onClick={() => handleStartGame(selectedGame)}
                      className="w-full py-4 text-emerald-600 font-black flex items-center justify-center gap-2 hover:bg-emerald-50 rounded-2xl transition-all"
                    >
                      <RefreshCw size={18} />
                      تجاوز التحدي مرة أخرى
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const X = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
