import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sword, Shield, Trophy, Star, Target, Zap, 
  Lock, Unlock, ChevronLeft, ChevronRight, 
  Award, List, Play, HelpCircle, AlertCircle,
  CheckCircle, RefreshCw, BarChart2, Crown
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---
interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Game {
  id: string;
  title: string;
  type: 'sorting' | 'quiz' | 'matching';
  description: string;
  questions?: Question[];
  items?: { id: number; text: string; category: string }[];
}

interface Level {
  id: number;
  title: string;
  slug: string;
  story: string;
  explanation: string;
  examples: { original: string; analysis: string }[];
  games: Game[];
  locked: boolean;
  minScoreToUnlockNext: number;
}

// --- Data ---
const LEVELS: Level[] = [
  {
    id: 1,
    title: "بوابة الثبات والتغيير (المعرب والمبني)",
    slug: "mubrab-mabni",
    locked: false,
    minScoreToUnlockNext: 150,
    story: "في قديم الزمان، كانت هناك مملكة تسمى 'لغتي'. في هذه المملكة، كان هناك نوعان من السكان: 'المتغيرون' الذين يغيرون ملابسهم (حركاتهم) حسب المكان الذي يذهبون إليه، و'الثابتون' الذين يرتدون ملابس واحدة لا تتغير أبداً مهما كان المكان. مهمتك هي التمييز بينهم لتفتح بوابة المملكة!",
    explanation: "المعرب هو ما يتغير آخر حرف فيه بتغير مكانه في الجملة (مثل: الولدُ، الولدَ، الولدِ). أما المبني فهو ما يلزم حالة واحدة ولا يتغير آخره أبداً (مثل: هؤلاءِ، الذي، نحنُ).",
    examples: [
      { original: "جاءَ التلميذُ (مرفوع)", analysis: "التلميذ: معرب لأنه تغيرت حركته" },
      { original: "رأيتُ التلميذَ (منصوب)", analysis: "التلميذ: معرب" },
      { original: "سلمتُ على التلميذِ (مجرور)", analysis: "التلميذ: معرب" },
      { original: "جاءَ هؤلاءِ / رأيتُ هؤلاءِ / سلمتُ على هؤلاءِ", analysis: "هؤلاء: مبني لأنه لزم الكسرة دائماً" }
    ],
    games: [
      {
        id: "sorting-1",
        title: "لعبة المصنف الذكي",
        type: "sorting",
        description: "اسحب الكلمات إلى الصندوق الصحيح: معرب أو مبني.",
        items: [
          { id: 1, text: "الكتابُ", category: "معرب" },
          { id: 2, text: "هؤلاءِ", category: "مبني" },
          { id: 3, text: "الذي", category: "مبني" },
          { id: 4, text: "المعلمَ", category: "معرب" },
          { id: 5, text: "نحنُ", category: "مبني" },
          { id: 6, text: "شجرةٍ", category: "معرب" },
          { id: 7, text: "متى", category: "مبني" },
          { id: 8, text: "السماءُ", category: "معرب" }
        ]
      },
      {
        id: "quiz-1",
        title: "تحدي الفرسان",
        type: "quiz",
        description: "أجب عن الأسئلة بدقة لتجمع النقاط.",
        questions: [
          {
            id: 1,
            text: "أي من هذه الكلمات تعتبر مبنية دائماً؟",
            options: ["البيت", "هذا", "الرجل", "القلم"],
            correctAnswer: 1,
            explanation: "أسماء الإشارة (مثل هذا) من المبنيات."
          },
          {
            id: 2,
            text: "ما هو تعريف المعرب؟",
            options: ["ما لا يتغير آخره", "ما يتغير آخره بتغير موقعه", "ما ينتهي بسكون دائماً", "ما ليس له إعراب"],
            correctAnswer: 1,
            explanation: "المعرب هو الذي يتأثر بالعوامل الداخلة عليه فيتغير آخره."
          },
          {
            id: 3,
            text: "كلمة 'أين' تعتبر:",
            options: ["معربة", "مبنية", "فعل ماض", "حرف جر"],
            correctAnswer: 1,
            explanation: "أسماء الاستفهام مبنية."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "مختبر الأسماء والأفعال",
    slug: "nouns-verbs",
    locked: true,
    minScoreToUnlockNext: 300,
    story: "بعد تجاوزك البوابة، وصلت إلى المختبر الملكي. هنا تتعلم كيف تفرق بين إعراب الأسماء وإعراب الأفعال. احذر! فبعض الأفعال تحب الثبات وبعضها يحب التغيير.",
    explanation: "الأسماء معظمها معرب، والأفعال الماضي والأمر مبنيان دائماً، أما المضارع فهو معرب إلا إذا اتصلت به نون النسوة أو نون التوكيد.",
    examples: [],
    games: []
  }
];

const ParsingCourse: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [view, setView] = useState<'map' | 'lesson' | 'game' | 'result'>('map');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [score, setScore] = useState(0);
  const [levelScores, setLevelScores] = useState<Record<number, number>>({});
  const [badges, setBadges] = useState<string[]>([]);
  
  // Game State
  const [gameScore, setGameScore] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [sortingItems, setSortingItems] = useState<{ id: number; text: string; category: string }[]>([]);
  const [sortingFeedback, setSortingFeedback] = useState<Record<number, 'correct' | 'wrong' | null>>({});

  const currentLevel = LEVELS[currentLevelIdx];

  const updateGlobalScore = (points: number) => {
    setScore(prev => Math.max(0, prev + points));
  };

  const startLevel = (idx: number) => {
    if (LEVELS[idx].locked && score < LEVELS[idx-1]?.minScoreToUnlockNext) return;
    setCurrentLevelIdx(idx);
    setView('lesson');
  };

  const startGame = (game: Game) => {
    setActiveGame(game);
    setGameScore(0);
    setView('game');
    if (game.type === 'sorting') {
      setSortingItems(game.items || []);
      setSortingFeedback({});
    } else {
      setCurrentQuestionIdx(0);
    }
  };

  const handleSorting = (itemId: number, category: string) => {
    const item = sortingItems.find(i => i.id === itemId);
    if (!item || sortingFeedback[itemId]) return;

    if (item.category === category) {
      setSortingFeedback(prev => ({ ...prev, [itemId]: 'correct' }));
      setGameScore(prev => prev + 10);
      updateGlobalScore(10);
    } else {
      setSortingFeedback(prev => ({ ...prev, [itemId]: 'wrong' }));
      setGameScore(prev => prev - 5);
      updateGlobalScore(-5);
    }

    // Check if all items are sorted
    const updatedFeedback = { ...sortingFeedback, [itemId]: item.category === category ? 'correct' : 'wrong' };
    if (Object.keys(updatedFeedback).length === sortingItems.length) {
      setTimeout(() => finishGame(), 1500);
    }
  };

  const handleQuizAnswer = (optionIdx: number) => {
    if (!activeGame?.questions) return;
    const q = activeGame.questions[currentQuestionIdx];
    
    if (optionIdx === q.correctAnswer) {
      setGameScore(prev => prev + 10);
      updateGlobalScore(10);
      // Show success feedback then move next
      setTimeout(() => {
        if (currentQuestionIdx < activeGame.questions!.length - 1) {
          setCurrentQuestionIdx(prev => prev + 1);
        } else {
          finishGame();
        }
      }, 1000);
    } else {
      setGameScore(prev => prev - 5);
      updateGlobalScore(-5);
    }
  };

  const finishGame = () => {
    updateGlobalScore(50); // Level completion bonus
    if (gameScore >= 30 && !badges.includes('خبير المعرب والمبني')) {
      setBadges(prev => [...prev, 'خبير المعرب والمبني']);
    }
    setView('result');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-right" dir="rtl">
      {/* Header / HUD */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-2xl flex items-center gap-2 font-black shadow-sm">
              <Trophy size={20} />
              <span>{score} نقطة</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              {badges.map((b, i) => (
                <div key={i} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1">
                  <Award size={14} />
                  {b}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-900">مغامرة فرسان الإعراب</h1>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Sword size={24} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {view === 'map' && (
            <motion.div 
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-slate-900">خريطة المملكة التعليمية</h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                  انطلق في رحلة عبر مستويات القواعد، اجمع النقاط، وافتح الأسرار لتصبح بطلاً في الإعراب!
                </p>
              </div>

              <div className="relative py-20">
                {/* Path Line */}
                <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-200 -translate-y-1/2 rounded-full"></div>
                
                <div className="relative flex justify-around items-center">
                  {LEVELS.map((level, idx) => {
                    const isLocked = level.locked && (idx > 0 && score < LEVELS[idx-1].minScoreToUnlockNext);
                    return (
                      <div key={level.id} className="relative flex flex-col items-center gap-6">
                        <motion.button
                          whileHover={!isLocked ? { scale: 1.1, y: -10 } : {}}
                          whileTap={!isLocked ? { scale: 0.9 } : {}}
                          onClick={() => startLevel(idx)}
                          className={cn(
                            "w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl transition-all border-4",
                            isLocked 
                              ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed" 
                              : "bg-white border-emerald-500 text-emerald-600 cursor-pointer"
                          )}
                        >
                          {isLocked ? <Lock size={32} /> : <span className="text-3xl font-black">{level.id}</span>}
                        </motion.button>
                        <div className="text-center">
                          <div className="font-black text-slate-900">{level.title}</div>
                          {isLocked && (
                            <div className="text-xs text-slate-400 mt-1">يتطلب {LEVELS[idx-1].minScoreToUnlockNext} نقطة</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'lesson' && (
            <motion.div 
              key="lesson"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <button onClick={() => setView('map')} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-8 font-bold">
                  <ChevronRight size={20} />
                  العودة للخريطة
                </button>

                <div className="space-y-10">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Shield size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2">{currentLevel.title}</h2>
                      <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                        <Star size={14} />
                        المستوى {currentLevel.id}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 italic text-lg leading-relaxed text-slate-700">
                    " {currentLevel.story} "
                  </div>

                  <div className="prose prose-slate max-w-none">
                    <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
                      <Zap className="text-emerald-500" size={24} />
                      القاعدة الذهبية
                    </h3>
                    <p className="text-xl leading-relaxed text-slate-600">
                      {currentLevel.explanation}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {currentLevel.examples.map((ex, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-emerald-600 font-black text-lg mb-2" dir="rtl">{ex.original}</div>
                        <div className="text-slate-500 text-sm">{ex.analysis}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 mb-6">الألعاب التعليمية المتاحة:</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {currentLevel.games.map((game) => (
                        <div key={game.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-emerald-200 transition-colors">
                          <h4 className="font-black text-lg mb-2">{game.title}</h4>
                          <p className="text-slate-500 text-sm mb-6">{game.description}</p>
                          <button 
                            onClick={() => startGame(game)}
                            className="w-full py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                          >
                            <Play size={18} />
                            ابدأ اللعب
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'game' && activeGame && (
            <motion.div 
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setView('lesson')} className="p-2 text-slate-400 hover:text-slate-600">
                      <ChevronRight size={24} />
                    </button>
                    <h2 className="text-2xl font-black">{activeGame.title}</h2>
                  </div>
                  <div className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-2xl font-black text-xl">
                    {gameScore}
                  </div>
                </div>

                {activeGame.type === 'sorting' && (
                  <div className="space-y-12">
                    <div className="flex flex-wrap justify-center gap-4 min-h-[200px] items-center">
                      <AnimatePresence>
                        {sortingItems.filter(item => !sortingFeedback[item.id]).map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, y: 50 }}
                            className="px-8 py-6 bg-white border-2 border-slate-100 rounded-[2rem] font-black text-xl shadow-xl shadow-slate-100 text-slate-700 flex flex-col items-center gap-4"
                          >
                            <span>{item.text}</span>
                            <div className="flex gap-3">
                              <button 
                                onClick={() => handleSorting(item.id, 'معرب')} 
                                className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                              >
                                معرب
                              </button>
                              <button 
                                onClick={() => handleSorting(item.id, 'مبني')} 
                                className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-600 hover:text-white transition-all border border-slate-100"
                              >
                                مبني
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {sortingItems.every(item => sortingFeedback[item.id]) && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center py-10"
                        >
                          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={40} />
                          </div>
                          <h3 className="text-2xl font-black text-slate-900">تم التصنيف بنجاح!</h3>
                          <p className="text-slate-500">جاري الانتقال للنتائج...</p>
                        </motion.div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-8 h-48">
                      <div className="bg-emerald-50 border-4 border-dashed border-emerald-200 rounded-[2.5rem] flex flex-col items-center justify-center text-emerald-600 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Shield size={48} className="mb-2 relative z-10" />
                        <span className="font-black relative z-10">صندوق المعرب</span>
                        <div className="mt-2 flex flex-wrap justify-center gap-1 px-4">
                          {sortingItems.filter(item => sortingFeedback[item.id] && item.category === 'معرب').map(item => (
                            <motion.div 
                              key={item.id}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={cn(
                                "w-2 h-2 rounded-full",
                                sortingFeedback[item.id] === 'correct' ? "bg-emerald-500" : "bg-red-500"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-600 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Shield size={48} className="mb-2 relative z-10" />
                        <span className="font-black relative z-10">صندوق المبني</span>
                        <div className="mt-2 flex flex-wrap justify-center gap-1 px-4">
                          {sortingItems.filter(item => sortingFeedback[item.id] && item.category === 'مبني').map(item => (
                            <motion.div 
                              key={item.id}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={cn(
                                "w-2 h-2 rounded-full",
                                sortingFeedback[item.id] === 'correct' ? "bg-emerald-500" : "bg-red-500"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeGame.type === 'quiz' && activeGame.questions && (
                  <div className="max-w-2xl mx-auto space-y-8">
                    <div className="text-center">
                      <div className="text-slate-400 text-sm font-bold mb-2">السؤال {currentQuestionIdx + 1} من {activeGame.questions.length}</div>
                      <h3 className="text-2xl font-black text-slate-900">{activeGame.questions[currentQuestionIdx].text}</h3>
                    </div>

                    <div className="grid gap-4">
                      {activeGame.questions[currentQuestionIdx].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuizAnswer(i)}
                          className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl text-right font-bold text-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group flex items-center justify-between"
                        >
                          <span>{opt}</span>
                          <div className="w-8 h-8 rounded-full border-2 border-slate-200 group-hover:border-emerald-500 flex items-center justify-center text-xs">
                            {i + 1}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-12 text-center"
            >
              <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Crown size={48} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">أحسنت يا بطل!</h2>
              <p className="text-xl text-slate-500 mb-12">لقد أتممت التحدي بنجاح وجمعت نقاطاً قيمة لمملكتك.</p>
              
              <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-12">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-sm text-slate-400 mb-1">نقاط اللعبة</div>
                  <div className="text-3xl font-black text-emerald-600">+{gameScore}</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-sm text-slate-400 mb-1">مكافأة المستوى</div>
                  <div className="text-3xl font-black text-amber-600">+50</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setView('map')}
                  className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2"
                >
                  <List size={20} />
                  العودة للخريطة
                </button>
                <button 
                  onClick={() => setView('lesson')}
                  className="px-10 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <RefreshCw size={20} />
                  إعادة المستوى
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sidebar for Stats (Mobile Hidden) */}
      <aside className="fixed left-8 bottom-8 hidden lg:block space-y-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl w-64">
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
            <BarChart2 size={18} className="text-emerald-500" />
            إحصائياتك
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-400">التقدم في الدورة</span>
                <span className="text-emerald-600">50%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-1/2"></div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">المستويات المكتملة</span>
              <span className="font-black">1 / 5</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">الرتبة الحالية</span>
              <span className="font-black text-amber-600">فارس مبتدئ</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ParsingCourse;
