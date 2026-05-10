import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Gamepad2, Trophy, Star, Zap, Flame, 
  Gift, Target, Timer, Users, Lock, 
  Unlock, ChevronLeft, ChevronRight, Award,
  CheckCircle2, AlertCircle, RefreshCw, Crown,
  TrendingUp, Calendar, Box, Sword, Compass,
  Brain, Puzzle
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---
interface Badge {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface GameMode {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  locked?: boolean;
  type: 'daily' | 'mystery' | 'boss' | 'leaderboard' | 'time' | 'external';
}

// --- Constants ---
const BADGES: Badge[] = [
  { id: 'parsing-expert', name: 'خبير الإعراب', icon: <Award size={20} />, color: 'bg-amber-500', description: 'إتقان قواعد الإعراب الأساسية' },
  { id: 'fast-responder', name: 'سريع الإجابة', icon: <Zap size={20} />, color: 'bg-blue-500', description: 'إنهاء تحدي السرعة في وقت قياسي' },
  { id: 'streak-master', name: 'متسلسل التحديات', icon: <Flame size={20} />, color: 'bg-orange-500', description: 'الدخول للمنصة 7 أيام متتالية' },
  { id: 'grammar-genius', name: 'عبقري النحو', icon: <Crown size={20} />, color: 'bg-purple-500', description: 'إكمال التحدي النهائي بدون أخطاء' },
];

const GAME_MODES: GameMode[] = [
  { id: 'daily', title: 'التحدي اليومي', description: '3 أسئلة سريعة يومياً لزيادة نقاطك واستمراريتك.', icon: <Calendar size={24} />, color: 'bg-emerald-500', type: 'daily' },
  { id: 'mystery', title: 'الصندوق السري', description: 'افتح الصندوق بعد كل نشاط لتحصل على مكافآت مفاجئة!', icon: <Box size={24} />, color: 'bg-purple-500', type: 'mystery' },
  { id: 'boss', title: 'التحدي النهائي', description: 'واجه الزعيم في نهاية كل وحدة لتحصل على نقاط مضاعفة.', icon: <Sword size={24} />, color: 'bg-red-500', type: 'boss', locked: true },
  { id: 'time', title: 'تحدي السرعة', description: 'أجب بأسرع ما يمكن! كلما كنت أسرع زادت نقاطك.', icon: <Timer size={24} />, color: 'bg-blue-500', type: 'time' },
  { id: 'leaderboard', title: 'لوحة الترتيب', description: 'نافس زملائك وكن من بين أفضل 10 متعلمين أسبوعياً.', icon: <Users size={24} />, color: 'bg-amber-500', type: 'leaderboard' },
  { id: 'linguistic-series', title: 'سلسلة الألعاب اللغوية', description: '10 ألعاب متنوعة لتنمية مهارات التفكير والمعاني.', icon: <Puzzle size={24} />, color: 'bg-rose-500', type: 'external' },
  { id: 'advanced', title: 'تحدي عباقرة اللغة', description: 'أسئلة متقدمة تشمل ملء الفراغات والصور مع شروحات مفصلة.', icon: <Brain size={24} />, color: 'bg-indigo-600', type: 'external' },
  { id: 'external', title: 'ألعاب خارجية', description: 'استمتع بألعاب Kahoot و Quizizz و Wordwall المدمجة.', icon: <Gamepad2 size={24} />, color: 'bg-pink-500', type: 'external' },
];

const DAILY_QUESTIONS = [
  { id: 1, text: "ما هو إعراب كلمة 'التلميذ' في جملة: 'جاء التلميذُ'؟", options: ["فاعل مرفوع", "مفعول به منصوب", "مبتدأ مرفوع", "خبر مرفوع"], correct: 0, explanation: "التلميذُ فاعل لأنه هو من قام بالفعل (المجيء)، وعلامة رفعه الضمة الظاهرة." },
  { id: 2, text: "أي من هذه الأفعال هو فعل ماضٍ؟", options: ["يكتب", "اكتب", "كتب", "سيكتب"], correct: 2, explanation: "الفعل 'كتب' يدل على حدث وقع وانتهى في الزمن الماضي." },
  { id: 3, text: "ما هي علامة رفع جمع المذكر السالم؟", options: ["الضمة", "الألف", "الواو", "الفتحة"], correct: 2, explanation: "جمع المذكر السالم يُرفع بالواو (مثل: المؤمنون) وينصب ويجر بالياء." },
];

export const GameArena: React.FC = () => {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(3);
  const [activeView, setActiveView] = useState<'arena' | 'daily' | 'leaderboard' | 'mystery' | 'advanced'>('arena');
  const [userBadges, setUserBadges] = useState<string[]>(['streak-master']);
  
  // Daily Challenge State
  const [dailyStep, setDailyStep] = useState(0);
  const [dailyScore, setDailyScore] = useState(0);
  const [dailyFinished, setDailyFinished] = useState(false);
  const [showDailyFeedback, setShowDailyFeedback] = useState(false);
  const [selectedDailyOption, setSelectedDailyOption] = useState<number | null>(null);

  // Level Calculation
  const getLevel = (points: number) => {
    if (points <= 100) return { name: 'مبتدئ', color: 'text-slate-500', bg: 'bg-slate-100' };
    if (points <= 300) return { name: 'متوسط', color: 'text-blue-500', bg: 'bg-blue-100' };
    if (points <= 600) return { name: 'متقدم', color: 'text-purple-500', bg: 'bg-purple-100' };
    return { name: 'خبير', color: 'text-amber-500', bg: 'bg-amber-100' };
  };

  const currentLevel = getLevel(xp);
  const navigate = useNavigate();

  const handleDailyAnswer = (idx: number) => {
    if (showDailyFeedback) return;
    
    setSelectedDailyOption(idx);
    setShowDailyFeedback(true);
    const isCorrect = idx === DAILY_QUESTIONS[dailyStep].correct;
    if (isCorrect) {
      setDailyScore(prev => prev + 10);
      setXp(prev => prev + 10);
    } else {
      setXp(prev => Math.max(0, prev - 5));
    }
  };

  const nextDailyStep = () => {
    setShowDailyFeedback(false);
    setSelectedDailyOption(null);
    if (dailyStep < DAILY_QUESTIONS.length - 1) {
      setDailyStep(prev => prev + 1);
    } else {
      setDailyFinished(true);
      setXp(prev => prev + 20); // Completion bonus
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-200 rotate-3">
              <Gamepad2 size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">ساحة الألعاب التعليمية</h1>
              <p className="text-slate-500 text-lg">فضاء التحديات والتعلم باللعب.. اجمع النقاط وكن البطل!</p>
            </div>
          </div>

          {/* Student Stats Mini-Dashboard */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-8">
            <div className="text-center">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">نقاط الخبرة (XP)</div>
              <div className="text-3xl font-black text-emerald-600">{xp}</div>
            </div>
            <div className="h-12 w-px bg-slate-100"></div>
            <div className="text-center">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">المستوى</div>
              <div className={cn("px-4 py-1 rounded-full text-sm font-black", currentLevel.bg, currentLevel.color)}>
                {currentLevel.name}
              </div>
            </div>
            <div className="h-12 w-px bg-slate-100"></div>
            <div className="text-center">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">سلسلة الأيام</div>
              <div className="flex items-center gap-1 text-orange-500 font-black text-2xl">
                <Flame size={24} fill="currentColor" />
                {streak}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeView === 'arena' && (
            <motion.div 
              key="arena"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid lg:grid-cols-[1fr_350px] gap-8"
            >
              {/* Game Modes Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {GAME_MODES.map((mode) => (
                  <motion.button
                    key={mode.id}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (mode.locked) return;
                      if (mode.id === 'advanced') {
                        navigate('/advanced-quiz');
                      } else if (mode.id === 'linguistic-series') {
                        navigate('/linguistic-games');
                      } else if (mode.id !== 'external') {
                        setActiveView(mode.id as any);
                      }
                    }}
                    className={cn(
                      "relative p-8 rounded-[2.5rem] text-right transition-all border-2 group overflow-hidden",
                      mode.locked ? "bg-slate-50 border-slate-100 cursor-not-allowed" : "bg-white border-white shadow-xl shadow-slate-200/50 hover:border-emerald-100"
                    )}
                  >
                    {/* Background Decoration */}
                    <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150", mode.color)}></div>
                    
                    <div className="relative z-10">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", mode.color)}>
                        {mode.locked ? <Lock size={24} /> : mode.icon}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-2">
                        {mode.title}
                        {mode.locked && <span className="text-xs font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded-lg">مغلق</span>}
                      </h3>
                      <p className="text-slate-500 leading-relaxed">{mode.description}</p>
                      
                      {!mode.locked && (
                        <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold text-sm">
                          <span>ابدأ التحدي الآن</span>
                          <ChevronLeft size={16} />
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Sidebar: Leaderboard & Badges */}
              <div className="space-y-8">
                {/* Weekly Leaderboard Preview */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Trophy className="text-amber-500" size={24} />
                    أبطال الأسبوع
                  </h3>
                  <div className="space-y-4">
                    {[
                      { name: 'أحمد محمد', xp: 1250, rank: 1 },
                      { name: 'سارة علي', xp: 1100, rank: 2 },
                      { name: 'ياسين خالد', xp: 950, rank: 3 },
                    ].map((user, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm",
                            user.rank === 1 ? "bg-amber-100 text-amber-600" : 
                            user.rank === 2 ? "bg-slate-200 text-slate-600" : "bg-orange-100 text-orange-600"
                          )}>
                            {user.rank}
                          </div>
                          <span className="font-bold text-slate-700">{user.name}</span>
                        </div>
                        <span className="font-black text-emerald-600">{user.xp} XP</span>
                      </div>
                    ))}
                    <button 
                      onClick={() => setActiveView('leaderboard')}
                      className="w-full py-3 text-slate-400 hover:text-emerald-600 font-bold text-sm transition-colors"
                    >
                      عرض القائمة الكاملة
                    </button>
                  </div>
                </div>

                {/* Badges Section */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-300">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <Award className="text-emerald-400" size={24} />
                    شاراتي المحصلة
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {BADGES.map((badge) => {
                      const isOwned = userBadges.includes(badge.id);
                      return (
                        <div 
                          key={badge.id} 
                          className={cn(
                            "p-4 rounded-2xl text-center transition-all border-2",
                            isOwned ? "bg-white/10 border-white/20" : "bg-black/20 border-transparent opacity-40 grayscale"
                          )}
                        >
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-white shadow-lg", badge.color)}>
                            {badge.icon}
                          </div>
                          <div className="text-[10px] font-black truncate">{badge.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'daily' && (
            <motion.div 
              key="daily"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-3xl mx-auto bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden"
            >
              <div className="bg-emerald-600 p-12 text-white text-center relative">
                <button 
                  onClick={() => setActiveView('arena')}
                  className="absolute top-8 left-8 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Calendar size={40} />
                </div>
                <h2 className="text-3xl font-black mb-2">التحدي اليومي</h2>
                <p className="text-emerald-100 font-bold">أجب عن 3 أسئلة لتربح نقاطاً إضافية!</p>
              </div>

              <div className="p-12">
                {!dailyFinished ? (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between">
                      <div className="text-slate-400 font-black uppercase tracking-wider">السؤال {dailyStep + 1} من 3</div>
                      <div className="flex gap-2">
                        {[0, 1, 2].map(i => (
                          <div key={i} className={cn("w-12 h-2 rounded-full transition-all", i <= dailyStep ? "bg-emerald-500" : "bg-slate-100")}></div>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 leading-relaxed">
                      {DAILY_QUESTIONS[dailyStep].text}
                    </h3>

                    <div className="grid gap-4">
                      {DAILY_QUESTIONS[dailyStep].options.map((opt, i) => (
                        <button
                          key={i}
                          disabled={showDailyFeedback}
                          onClick={() => handleDailyAnswer(i)}
                          className={cn(
                            "w-full p-6 border-2 rounded-2xl text-right font-bold text-lg transition-all group flex items-center justify-between",
                            !showDailyFeedback ? "bg-slate-50 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50" :
                            i === DAILY_QUESTIONS[dailyStep].correct ? "bg-emerald-50 border-emerald-500 text-emerald-700" :
                            i === selectedDailyOption ? "bg-red-50 border-red-500 text-red-700" : "bg-slate-50 border-slate-100 opacity-50"
                          )}
                        >
                          <span>{opt}</span>
                          {showDailyFeedback && i === DAILY_QUESTIONS[dailyStep].correct && <CheckCircle2 size={24} className="text-emerald-600" />}
                          {showDailyFeedback && i === selectedDailyOption && i !== DAILY_QUESTIONS[dailyStep].correct && <AlertCircle size={24} className="text-red-600" />}
                        </button>
                      ))}
                    </div>

                    {showDailyFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className={cn(
                          "p-6 rounded-2xl border-l-4",
                          selectedDailyOption === DAILY_QUESTIONS[dailyStep].correct ? "bg-emerald-50 border-emerald-500 text-emerald-800" : "bg-red-50 border-red-500 text-red-800"
                        )}>
                          <div className="font-black mb-2">
                            {selectedDailyOption === DAILY_QUESTIONS[dailyStep].correct ? "إجابة صحيحة! 🎉" : "إجابة خاطئة.. 💡"}
                          </div>
                          <p className="text-sm font-bold opacity-80">{DAILY_QUESTIONS[dailyStep].explanation}</p>
                        </div>
                        <button
                          onClick={nextDailyStep}
                          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all"
                        >
                          <span>{dailyStep === DAILY_QUESTIONS.length - 1 ? 'عرض النتيجة' : 'السؤال التالي'}</span>
                          <ChevronLeft />
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-8 py-8">
                    <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <Trophy size={48} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 mb-2">عمل رائع!</h3>
                      <p className="text-slate-500 text-lg">لقد أتممت التحدي اليومي بنجاح.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                      <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                        <div className="text-xs text-emerald-600 font-bold mb-1">نقاط الأسئلة</div>
                        <div className="text-3xl font-black text-emerald-700">+{dailyScore}</div>
                      </div>
                      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                        <div className="text-xs text-amber-600 font-bold mb-1">مكافأة الإكمال</div>
                        <div className="text-3xl font-black text-amber-700">+20</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveView('arena');
                        setDailyStep(0);
                        setDailyFinished(false);
                        setDailyScore(0);
                      }}
                      className="px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
                    >
                      العودة للساحة
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeView === 'leaderboard' && (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-4xl mx-auto bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden"
            >
              <div className="bg-amber-500 p-12 text-white text-center relative">
                <button 
                  onClick={() => setActiveView('arena')}
                  className="absolute top-8 left-8 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <h2 className="text-4xl font-black mb-2">لوحة الترتيب الأسبوعية</h2>
                <p className="text-amber-100 font-bold">أفضل 10 متعلمين لهذا الأسبوع</p>
              </div>
              <div className="p-8">
                <div className="space-y-3">
                  {[
                    { name: 'أحمد محمد', xp: 1250, level: 'خبير', streak: 12 },
                    { name: 'سارة علي', xp: 1100, level: 'خبير', streak: 8 },
                    { name: 'ياسين خالد', xp: 950, level: 'متقدم', streak: 5 },
                    { name: 'ليلى حسن', xp: 820, level: 'متقدم', streak: 15 },
                    { name: 'عمر فاروق', xp: 750, level: 'متقدم', streak: 3 },
                    { name: 'مريم يوسف', xp: 680, level: 'متقدم', streak: 4 },
                    { name: 'زيد إبراهيم', xp: 610, level: 'متقدم', streak: 7 },
                    { name: 'هدى كريم', xp: 590, level: 'متوسط', streak: 2 },
                    { name: 'علي محمود', xp: 540, level: 'متوسط', streak: 6 },
                    { name: 'نور الدين', xp: 490, level: 'متوسط', streak: 1 },
                  ].map((user, i) => (
                    <div key={i} className={cn(
                      "flex items-center justify-between p-5 rounded-3xl border transition-all",
                      i < 3 ? "bg-amber-50 border-amber-100" : "bg-white border-slate-50 hover:border-slate-200"
                    )}>
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg",
                          i === 0 ? "bg-amber-500 text-white shadow-lg shadow-amber-200" :
                          i === 1 ? "bg-slate-400 text-white shadow-lg shadow-slate-200" :
                          i === 2 ? "bg-orange-400 text-white shadow-lg shadow-orange-200" : "bg-slate-100 text-slate-400"
                        )}>
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-lg">{user.name}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{user.level}</span>
                            <span className="text-xs font-bold text-orange-500 flex items-center gap-1">
                              <Flame size={12} fill="currentColor" />
                              {user.streak} يوم
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-600">{user.xp}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">نقطة خبرة</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Integration Section */}
        <div className="mt-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Compass size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">تكامل مع ألعاب خارجية</h2>
              <p className="text-slate-500">استمتع بمحتوى إضافي من منصات عالمية</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'Kahoot!', desc: 'مسابقات مباشرة حماسية', color: 'bg-purple-600' },
              { name: 'Quizizz', desc: 'اختبارات منزلية ممتعة', color: 'bg-indigo-600' },
              { name: 'Wordwall', desc: 'ألعاب لغوية تفاعلية', color: 'bg-blue-600' },
            ].map((tool, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg flex items-center gap-4 group hover:border-blue-200 transition-all">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl", tool.color)}>
                  {tool.name[0]}
                </div>
                <div>
                  <div className="font-black text-slate-900">{tool.name}</div>
                  <div className="text-xs text-slate-400">{tool.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameArena;
