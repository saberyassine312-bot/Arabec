/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { BookOpen, Play, CheckCircle, User, LogIn, LogOut, Layout, Video, Award, Menu, X, ChevronDown, ArrowRight, Clock, Target, GraduationCap, AlertCircle, Sun, Star, Lightbulb, Layers, BookCheck, Sparkles, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

import QuizGame from './components/QuizGame';
import VerbalSentenceQuiz from './components/VerbalSentenceQuiz';
import VerbTypesQuiz from './components/VerbTypesQuiz';
import ObjectQuiz from './components/ObjectQuiz';
import VerbalSentenceExam from './components/VerbalSentenceExam';
import NominalSentenceQuiz from './components/NominalSentenceQuiz';
import SubjectQuiz from './components/SubjectQuiz';
import PredicateQuiz from './components/PredicateQuiz';
import SubjectPredicateStatesQuiz from './components/SubjectPredicateStatesQuiz';
import NominalSentenceExam from './components/NominalSentenceExam';
import SubjectAndPredicateQuiz from './components/SubjectAndPredicateQuiz';
import PhraseQuiz from './components/PhraseQuiz';
import ParsingLesson from './components/ParsingLesson';
import FirstYearDropdown from './components/FirstYearDropdown';
import SecondYearDropdown from './components/SecondYearDropdown';
import ThirdYearDropdown from './components/ThirdYearDropdown';

// Components
const Navbar = ({ user, loading }: { user: any; loading: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          role: 'student',
          points: 0,
          progress: {},
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const prepLevels = ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة'];
  const secondaryLevels = ['جدع مشترك', 'الأولى بكالوريا', 'الثانية بكالوريا'];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">ل</div>
              <span className="text-2xl font-bold text-gray-900">لغتي</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {/* Preparatory Level Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('prep')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors py-5">
                <span>السلك الإعدادي</span>
                <ChevronDown size={16} className={cn("transition-transform duration-200", activeDropdown === 'prep' && "rotate-180")} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'prep' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 w-48 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden py-2"
                  >
                    {prepLevels.map((level) => (
                      <Link 
                        key={level} 
                        to={`/lessons?level=${level}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      >
                        {level}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Secondary Level Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('secondary')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors py-5">
                <span>السلك الثانوي التأهيلي</span>
                <ChevronDown size={16} className={cn("transition-transform duration-200", activeDropdown === 'secondary' && "rotate-180")} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'secondary' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden py-2"
                  >
                    {secondaryLevels.map((level) => (
                      <Link 
                        key={level} 
                        to={`/lessons?level=${level}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      >
                        {level}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/exercises" className="text-gray-600 hover:text-emerald-600 transition-colors">التمارين</Link>
            <Link to="/live" className="text-gray-600 hover:text-emerald-600 transition-colors">حصص مباشرة</Link>
            {user && <Link to="/dashboard" className="text-gray-600 hover:text-emerald-600 transition-colors">لوحة التحكم</Link>}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-500 font-medium border-l border-gray-100 pl-6 ml-2">
              <User size={18} className="text-emerald-600" />
              <span>ياسين صابر</span>
            </div>
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">{user.displayName}</span>
                <button onClick={() => signOut(auth)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-full hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200">
                <LogIn size={18} />
                <span>دخول</span>
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <div className="py-2">
                <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">السلك الإعدادي</div>
                {prepLevels.map(level => (
                  <Link key={level} to={`/lessons?level=${level}`} className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg">{level}</Link>
                ))}
              </div>
              <div className="py-2 border-t border-gray-50">
                <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">السلك الثانوي التأهيلي</div>
                {secondaryLevels.map(level => (
                  <Link key={level} to={`/lessons?level=${level}`} className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg">{level}</Link>
                ))}
              </div>
              <Link to="/exercises" className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg border-t border-gray-50">التمارين</Link>
              <Link to="/live" className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg">حصص مباشرة</Link>
              {!user && (
                <button onClick={handleLogin} className="w-full text-right px-3 py-2 text-emerald-600 font-bold border-t border-gray-50">تسجيل الدخول</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Home = () => (
  <div className="space-y-20 pb-20">
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
        >
          تعلم اللغة العربية <br />
          <span className="text-emerald-600">بكل سهولة ومتعة</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
        >
          منصة تعليمية تفاعلية تجمع بين الدروس المنهجية، التمارين الذكية، والحصص المباشرة مع أفضل المعلمين.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/lessons" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">ابدأ التعلم الآن</Link>
          <Link to="/live" className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all">استكشف الحصص المباشرة</Link>
        </motion.div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: <BookOpen className="text-emerald-600" />, title: "دروس شاملة", desc: "محتوى تعليمي غني يغطي النحو والصرف والإملاء لكل المستويات.", link: "/lessons" },
          { icon: <Play className="text-blue-600" />, title: "تمارين تفاعلية", desc: "تعلم بأسلوب اللعب مع نظام نقاط وتحديات تجعل الدراسة ممتعة.", link: "/exercises" },
          { icon: <Video className="text-purple-600" />, title: "بث مباشر", desc: "تواصل مباشرة مع المعلمين واطرح أسئلتك في حصص تفاعلية.", link: "/live" }
        ].map((feature, i) => (
          <Link to={feature.link} key={i}>
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  </div>
);

const Lessons = () => {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  if (selectedLesson === 'parsing') return (
    <div className="relative">
      <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للمكتبة</button>
      <ParsingLesson />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">اختر مستواك الدراسي (السلك الإعدادي)</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FirstYearDropdown />
          <SecondYearDropdown />
          <ThirdYearDropdown />
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-8">مكتبة الدروس العامة</h2>
      <div className="grid md:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h3 className="font-bold mb-4">التصنيفات</h3>
            <div className="space-y-2">
              {['الكل', 'النحو', 'الصرف', 'الإملاء', 'الأدب'].map(cat => (
                <button key={cat} className="w-full text-right px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors">{cat}</button>
              ))}
            </div>
          </div>
        </div>
        {/* Lessons Grid */}
        <div className="md:col-span-3 grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
            <div className="h-40 bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <BookOpen size={48} className="text-emerald-200" />
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-3">
                <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">مبتدئ</span>
                <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-md">نحو</span>
              </div>
              <h4 className="font-bold text-lg mb-2">📘 الدرس الأول: الإعراب</h4>
              <p className="text-sm text-gray-500 mb-4">تعرف على مفهوم الإعراب، الكلمة المعربة، وأنواع الإعراب الثلاثة...</p>
              <button 
                onClick={() => setSelectedLesson('parsing')}
                className="w-full py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
              >
                ابدأ الدرس
              </button>
            </div>
          </div>

          {[2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group opacity-60">
              <div className="h-40 bg-gray-50 flex items-center justify-center">
                <BookOpen size={48} className="text-gray-200" />
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-3">
                  <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-md">قريباً</span>
                </div>
                <h4 className="font-bold text-lg mb-2">درس جديد قادماً</h4>
                <p className="text-sm text-gray-400 mb-4">نحن نعمل على تحضير محتوى تعليمي مميز لك...</p>
                <button disabled className="w-full py-2 bg-gray-200 text-gray-400 rounded-xl font-bold cursor-not-allowed">قريباً</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Exercises = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  if (selectedGame === 'types') return (
    <div className="relative">
      <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للقائمة</button>
      <QuizGame />
    </div>
  );
  
  if (selectedGame === 'verbal') return (
    <div className="relative">
      <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للقائمة</button>
      <VerbalSentenceQuiz />
    </div>
  );

  if (selectedGame === 'verbs') return (
    <div className="relative">
      <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للقائمة</button>
      <VerbTypesQuiz />
    </div>
  );

  if (selectedGame === 'object') return (
    <div className="relative">
      <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للقائمة</button>
      <ObjectQuiz />
    </div>
  );

  if (selectedGame === 'nominal') return (
    <div className="relative">
      <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للقائمة</button>
      <NominalSentenceQuiz />
    </div>
  );

  if (selectedGame === 'subject') return (
    <div className="relative">
      <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للقائمة</button>
      <SubjectQuiz />
    </div>
  );

  if (selectedGame === 'predicate') return (
    <div className="relative">
      <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للقائمة</button>
      <PredicateQuiz />
    </div>
  );

  if (selectedGame === 'states') return (
    <div className="relative">
      <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للقائمة</button>
      <SubjectPredicateStatesQuiz />
    </div>
  );

  if (selectedGame === 'subject-predicate') return (
    <div className="relative">
      <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للقائمة</button>
      <SubjectAndPredicateQuiz />
    </div>
  );

  if (selectedGame === 'phrase') return (
    <div className="relative">
      <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للقائمة</button>
      <PhraseQuiz />
    </div>
  );

  if (selectedGame === 'nominal-exam') return (
    <div className="relative">
      <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للقائمة</button>
      <NominalSentenceExam />
    </div>
  );

  if (selectedGame === 'exam') return (
    <div className="relative">
      <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للقائمة</button>
      <VerbalSentenceExam />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-gray-900 mb-4">الألعاب التعليمية</h2>
        <p className="text-xl text-gray-600">اختر تحدياً وابدأ في اختبار معلوماتك بأسلوب ممتع</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedGame('types')}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-right group flex flex-col h-full"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <BookOpen size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">أنواع الجمل</h3>
          <p className="text-gray-600 mb-6 flex-grow">تحدي التمييز بين الجملة الاسمية، الفعلية، وشبه الجملة.</p>
          <div className="flex items-center gap-2 text-emerald-600 font-bold mt-auto">
            <span>ابدأ اللعب</span>
            <ArrowRight size={20} />
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedGame('nominal')}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-right group flex flex-col h-full"
        >
          <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-all">
            <Sun size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">الجملة الاسمية</h3>
          <p className="text-gray-600 mb-6 flex-grow">تعرف على أركان الجملة الاسمية: المبتدأ والخبر بأسلوب ممتع.</p>
          <div className="flex items-center gap-2 text-yellow-600 font-bold mt-auto">
            <span>ابدأ اللعب</span>
            <ArrowRight size={20} />
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedGame('subject')}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-right group flex flex-col h-full"
        >
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-all">
            <Star size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">المبتدأ</h3>
          <p className="text-gray-600 mb-6 flex-grow">أتقن تحديد المبتدأ في الجملة الاسمية وتعرف على قواعده.</p>
          <div className="flex items-center gap-2 text-teal-600 font-bold mt-auto">
            <span>ابدأ اللعب</span>
            <ArrowRight size={20} />
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedGame('predicate')}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-right group flex flex-col h-full"
        >
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all">
            <Lightbulb size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">الخبر</h3>
          <p className="text-gray-600 mb-6 flex-grow">تعرف على الخبر وأنواعه وكيف يكمل معنى الجملة مع المبتدأ.</p>
          <div className="flex items-center gap-2 text-rose-600 font-bold mt-auto">
            <span>ابدأ اللعب</span>
            <ArrowRight size={20} />
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedGame('states')}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-right group flex flex-col h-full"
        >
          <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-600 group-hover:text-white transition-all">
            <Layers size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">أحوال المبتدأ والخبر</h3>
          <p className="text-gray-600 mb-6 flex-grow">تحدي متقدم حول حالات تقديم الخبر وتأخير المبتدأ وجوباً وجوازاً.</p>
          <div className="flex items-center gap-2 text-cyan-600 font-bold mt-auto">
            <span>ابدأ اللعب</span>
            <ArrowRight size={20} />
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedGame('subject-predicate')}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-right group flex flex-col h-full"
        >
          <div className="w-16 h-16 bg-lime-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-lime-500 group-hover:text-white transition-all">
            <Sparkles size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">المبتدأ والخبر</h3>
          <p className="text-gray-600 mb-6 flex-grow">تحدي متوازن يجمع بين تعريف المبتدأ والخبر وتطبيقات عملية عليهما.</p>
          <div className="flex items-center gap-2 text-lime-600 font-bold mt-auto">
            <span>ابدأ اللعب</span>
            <ArrowRight size={20} />
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedGame('phrase')}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-right group flex flex-col h-full"
        >
          <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:text-white transition-all">
            <Compass size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">شبه الجملة</h3>
          <p className="text-gray-600 mb-6 flex-grow">تعرف على الجار والمجرور والظرف ودورهما في الجملة الاسمية.</p>
          <div className="flex items-center gap-2 text-sky-600 font-bold mt-auto">
            <span>ابدأ اللعب</span>
            <ArrowRight size={20} />
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedGame('nominal-exam')}
          className="bg-white p-8 rounded-3xl border-2 border-amber-100 shadow-sm hover:shadow-xl transition-all text-right group flex flex-col h-full relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-600"></div>
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
            <BookCheck size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">امتحان الجملة الاسمية</h3>
          <p className="text-gray-600 mb-6 flex-grow">اختبار شامل من 15 سؤالاً يغطي المبتدأ والخبر وأحوالهما بالكامل.</p>
          <div className="flex items-center gap-2 text-amber-600 font-bold mt-auto">
            <span>ابدأ الامتحان</span>
            <ArrowRight size={20} />
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedGame('verbal')}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-right group flex flex-col h-full"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Play size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">الجملة الفعلية</h3>
          <p className="text-gray-600 mb-6 flex-grow">تعرف على أركان الجملة الفعلية: الفعل، الفاعل، والمفعول به.</p>
          <div className="flex items-center gap-2 text-blue-600 font-bold mt-auto">
            <span>ابدأ اللعب</span>
            <ArrowRight size={20} />
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedGame('verbs')}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-right group flex flex-col h-full"
        >
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all">
            <Clock size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">أنواع الفعل</h3>
          <p className="text-gray-600 mb-6 flex-grow">ميز بين الفعل الماضي والمضارع والأمر بأسلوب تفاعلي.</p>
          <div className="flex items-center gap-2 text-orange-500 font-bold mt-auto">
            <span>ابدأ اللعب</span>
            <ArrowRight size={20} />
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedGame('object')}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-right group flex flex-col h-full"
        >
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
            <Target size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">المفعول به</h3>
          <p className="text-gray-600 mb-6 flex-grow">أتقن تحديد المفعول به وعلامات إعرابه وأنواعه المختلفة.</p>
          <div className="flex items-center gap-2 text-purple-600 font-bold mt-auto">
            <span>ابدأ اللعب</span>
            <ArrowRight size={20} />
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedGame('exam')}
          className="bg-white p-8 rounded-3xl border-2 border-indigo-100 shadow-sm hover:shadow-xl transition-all text-right group flex flex-col h-full relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <GraduationCap size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">الامتحان الشامل</h3>
          <p className="text-gray-600 mb-6 flex-grow">اختبر كل مهاراتك في الجملة الفعلية في امتحان من 15 سؤالاً مع شروط نجاح صارمة.</p>
          <div className="flex items-center gap-2 text-indigo-600 font-bold mt-auto">
            <span>ابدأ الامتحان</span>
            <ArrowRight size={20} />
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar user={user} loading={loading} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/live" element={<div className="p-20 text-center">صفحة الحصص المباشرة قيد التطوير...</div>} />
            <Route path="/dashboard" element={<div className="p-20 text-center">لوحة التحكم قيد التطوير...</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

