/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { BookOpen, Play, CheckCircle, User, LogIn, LogOut, Layout, Video, Award, Menu, X, ChevronDown, ArrowRight, Clock, Target, GraduationCap, AlertCircle, Sun, Star, Lightbulb, Layers, BookCheck, Sparkles, Compass, Type, PenTool, Scale, Wind, History, MessageSquare, Sword, Gamepad2, Zap, Flame, LayoutDashboard, BookMarked, Brain, Users, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

import { seedDatabase } from './lib/seed';
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
import SunMoonLesson from './components/SunMoonLesson';
import TaMarbutaLesson from './components/TaMarbutaLesson';
import HamzaLesson from './components/HamzaLesson';
import AlifAfterWawLesson from './components/AlifAfterWawLesson';
import MorphologicalScaleLesson from './components/MorphologicalScaleLesson';
import VerbClassificationLesson from './components/VerbClassificationLesson';
import PastTenseVerbLesson from './components/PastTenseVerbLesson';
import PresentTenseVerbLesson from './components/PresentTenseVerbLesson';
import ImperativeVerbLesson from './components/ImperativeVerbLesson';
import DualLesson from './components/DualLesson';
import ArabicComposition from './components/ArabicComposition';
import Whiteboard from './components/Whiteboard';
import SmartAdminPanel from './components/SmartAdminPanel';
import FirstYearArabicCourse from './components/FirstYearArabicCourse';
import ParsingCourse from './components/ParsingCourse';
import GameArena from './components/GameArena';
import LiveInterviews from './components/LiveInterviews';
import GoogleMeetGuide from './components/GoogleMeetGuide';
import { CourseList } from './components/CourseList';
import { CourseCard } from './components/CourseCard';
import { CourseDetail } from './components/CourseDetail';
import { LessonPlayer } from './components/LessonPlayer';
import { CertificateView } from './components/CertificateView';
import { IntelligenceTest } from './components/IntelligenceTest';
import { QuizRegistration } from './components/QuizRegistration';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import SmartDashboard from './components/SmartDashboard';
import { InteractiveLesson } from './components/InteractiveLesson';

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
  const isTeacher = user?.email === 'wadifamaroc60@gmail.com';

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-200">ل</div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-gray-900 leading-none">لغتي</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">منصة التعلم الذكي</span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-emerald-600 transition-colors font-bold">الرئيسية</Link>
            <Link to="/whiteboard" className="text-gray-600 hover:text-emerald-600 transition-colors font-bold flex items-center gap-2">
              <Layers size={18} className="text-emerald-500" />
              <span>السبورة الإلكترونية</span>
            </Link>
            {/* Preparatory Level Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('prep')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors py-5 font-bold">
                <span>السلك الإعدادي</span>
                <ChevronDown size={16} className={cn("transition-transform duration-200", activeDropdown === 'prep' && "rotate-180")} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'prep' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden py-3 z-50"
                  >
                    {prepLevels.map((level) => (
                      <Link 
                        key={level} 
                        to={`/lessons?level=${level}`}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-200"></div>
                        {level}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/courses" className="text-gray-600 hover:text-emerald-600 transition-colors font-bold">الدورات</Link>
            <Link to="/exercises" className="text-gray-600 hover:text-emerald-600 transition-colors font-bold">التمارين</Link>
            <Link to="/game-arena" className="text-gray-600 hover:text-emerald-600 transition-colors font-bold flex items-center gap-2">
              <Gamepad2 size={18} className="text-purple-500" />
              <span>ساحة الألعاب</span>
            </Link>
            <Link to="/live-interviews" className="text-gray-600 hover:text-emerald-600 transition-colors font-bold flex items-center gap-2">
              <Video size={18} className="text-red-500" />
              <span>المقابلات المباشرة</span>
            </Link>
            <Link to="/parsing-adventure" className="text-gray-600 hover:text-emerald-600 transition-colors font-bold flex items-center gap-2">
              <Sword size={18} className="text-amber-500" />
              <span>مغامرة الإعراب</span>
            </Link>
            <Link to="/first-year-course" className="text-gray-600 hover:text-emerald-600 transition-colors font-bold flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-600" />
              <span>دروس الأولى إعدادي</span>
            </Link>
            <Link to="/student-dashboard" className="text-gray-600 hover:text-emerald-600 transition-colors font-bold flex items-center gap-2">
              <LayoutDashboard size={18} className="text-indigo-500" />
              <span>لوحة التحكم</span>
            </Link>
            <Link to="/composition" className="text-gray-600 hover:text-emerald-600 transition-colors font-bold flex items-center gap-2">
              <PenTool size={18} className="text-emerald-500" />
              <span>التعبير</span>
            </Link>
            {isTeacher && (
              <Link to="/smart-admin" className="text-emerald-600 hover:text-emerald-700 transition-colors font-black flex items-center gap-2">
                <Activity size={18} />
                <span>لوحة التحكم الذكية</span>
              </Link>
            )}
            {user && (
              <Link to={isTeacher ? "/dashboard" : "/student-dashboard"} className="text-emerald-600 hover:text-emerald-700 transition-colors font-black">
                {isTeacher ? "لوحة التحكم" : "لوحتي التعليمية"}
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-400">مرحباً بك</span>
                  <span className="text-sm font-black text-gray-900">{user.displayName}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <button onClick={() => signOut(auth)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
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
              <Link to="/" className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg">الرئيسية</Link>
              <Link to="/whiteboard" className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg flex items-center gap-2">
                <Layers size={18} className="text-emerald-500" />
                <span>السبورة الإلكترونية</span>
              </Link>
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
              <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg">حصص مباشرة</a>
              {isTeacher && <Link to="/dashboard" className="block px-3 py-2 text-emerald-600 font-bold hover:bg-emerald-50 rounded-lg">لوحة التحكم</Link>}
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

import { useGamification } from './hooks/useGamification';

const Home = ({ user }: { user: any }) => {
  const { stats } = useGamification();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-20 pb-20">
      <QuizRegistration quizTitle="اختبار الذكاءات المتعددة" quizType="ذكاءات متعددة">
        {(studentData, onComplete) => (
          <IntelligenceTest onComplete={(results) => onComplete(results)} />
        )}
      </QuizRegistration>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-right relative z-10">
              {user && stats && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-4 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full text-sm font-bold mb-6 border border-emerald-100"
                >
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-amber-500" />
                    <span>{stats.xp} XP</span>
                  </div>
                  <div className="w-px h-4 bg-emerald-200" />
                  <div className="flex items-center gap-2">
                    <Flame size={16} className="text-orange-500" />
                    <span>سلسلة {stats.streak} أيام</span>
                  </div>
                </motion.div>
              )}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-[1.1]"
              >
                منصة لغتي <br />
                <span className="text-emerald-600">مستقبلك يبدأ هنا</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-xl md:text-2xl text-gray-700 font-medium mb-8 text-center lg:text-right"
              >
                تعلّم العربية بأسلوب ممتع وتفاعلي، عبر دروس منظمة وألعاب تعليمية تعزّز الفهم والتطبيق.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-600 mb-10 max-w-xl"
              >
                أول منصة تعليمية ذكية تعتمد على الألعاب والذكاء الاصطناعي لتعليم اللغة العربية بأسلوب ممتع وتفاعلي.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/courses" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center gap-2">
                  <span>استكشف الدورات</span>
                  <ArrowRight size={20} />
                </Link>
                <Link to="/game-arena" className="bg-white text-gray-900 border border-gray-200 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
                  <Gamepad2 size={20} className="text-purple-500" />
                  <span>ساحة الألعاب</span>
                </Link>

                {user?.email === 'wadifamaroc60@gmail.com' && (
                  <button 
                    onClick={async () => {
                      const success = await seedDatabase();
                      if (success) alert('تم تحديث قاعدة البيانات بنجاح!');
                    }}
                    className="bg-amber-50 text-amber-700 border border-amber-100 px-6 py-4 rounded-2xl text-sm font-bold hover:bg-amber-100 transition-all flex items-center gap-2"
                  >
                    تحديث المحتوى (Seed)
                  </button>
                )}
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80" 
                  alt="Learning Arabic" 
                  className="w-full h-[600px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-12">
                  <div className="text-white">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex -space-x-3">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="User" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                      <span className="text-lg font-bold">+5000 طالب انضموا إلينا</span>
                    </div>
                    <p className="text-gray-200 text-lg max-w-md font-medium">انضم إلى مجتمعنا التعليمي المتميز وابدأ رحلة النجاح اليوم.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black text-gray-900">مسارات التعلم الذكية</h2>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
            اختر المسار الذي تريد تطويره اليوم، ودع نظامنا الذكي يوجهك نحو الإتقان.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { id: 'grammar', title: 'النحو', icon: <BookMarked size={40} />, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-200', desc: 'أتقن قواعد بناء الجملة العربية وإعرابها بأسلوب تفاعلي.' },
            { id: 'morphology', title: 'الصرف', icon: <Brain size={40} />, color: 'from-purple-500 to-indigo-600', shadow: 'shadow-purple-200', desc: 'اكتشف أوزان الكلمات وكيفية اشتقاقها وتصريف الأفعال.' },
            { id: 'spelling', title: 'الإملاء', icon: <PenTool size={40} />, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-200', desc: 'تعلم قواعد الرسم الإملائي الصحيح والهمزات وعلامات الترقيم.' },
          ].map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/courses?category=${path.id}`)}
              className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-100 border border-gray-50 flex flex-col items-center text-center group cursor-pointer"
            >
              <div className={`w-24 h-24 bg-gradient-to-br ${path.color} rounded-[2.5rem] flex items-center justify-center text-white mb-8 shadow-2xl ${path.shadow} group-hover:scale-110 transition-transform duration-500`}>
                {path.icon}
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">{path.title}</h3>
              <p className="text-gray-500 font-bold leading-relaxed mb-8">
                {path.desc}
              </p>
              <div className="mt-auto flex items-center gap-2 text-indigo-600 font-black group-hover:gap-4 transition-all">
                <span>ابدأ المسار</span>
                <ArrowRight size={20} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Interactive Lesson */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md">
                <Sparkles size={16} className="text-amber-300" />
                <span>درس تفاعلي جديد</span>
              </div>
              <h2 className="text-4xl font-black leading-tight">اسم الفاعل وعمله <br /> (السنة الثالثة إعدادي)</h2>
              <p className="text-blue-100 text-lg max-w-xl">
                اكتشف أسرار اسم الفاعل من خلال وضعية مشكل تفاعلية، وابنِ قاعدتك اللغوية بأسلوب حديث يركز على الفهم والاكتشاف.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/interactive-lesson" className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all flex items-center gap-2 shadow-xl shadow-black/10">
                  <Play size={20} />
                  ابدأ الدرس الآن
                </Link>
                <div className="flex items-center gap-4 text-blue-100 font-bold">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>15 دقيقة</span>
                  </div>
                  <div className="w-1 h-1 bg-white/40 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Zap size={16} className="text-amber-300" />
                    <span>+100 XP</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-white/10 rounded-[2.5rem] backdrop-blur-md border border-white/20 flex items-center justify-center relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <BookOpen size={64} />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-400 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-12">
                <Star size={32} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">لماذا تختار منصة لغتي؟</h2>
          <p className="text-gray-500 text-lg">نقدم تجربة تعليمية فريدة تجمع بين العلم والمتعة</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1 space-y-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Gamepad2 size={32} />
                </div>
                <h3 className="text-3xl font-black">التعلم القائم على الألعاب</h3>
                <p className="text-gray-600 text-lg leading-relaxed">حولنا القواعد النحوية الجافة إلى مغامرات شيقة. اجمع النقاط، افتح الصناديق السرية، ونافس زملائك في ساحة الألعاب.</p>
                <Link to="/game-arena" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-4 transition-all">
                  <span>اكتشف ساحة الألعاب</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
              <div className="w-full md:w-1/2 aspect-square rounded-[2rem] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80" alt="Gamification" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                <PenTool size={32} />
              </div>
              <h3 className="text-3xl font-black">التصحيح الذكي</h3>
              <p className="text-gray-400 text-lg leading-relaxed">اكتب مواضيعك الإنشائية واحصل على تحليل فوري للأخطاء النحوية والإملائية مع نصائح للتحسين.</p>
            </div>
            <Link to="/composition" className="bg-white text-slate-900 py-4 rounded-2xl font-bold text-center hover:bg-emerald-50 transition-all">ابدأ الكتابة الآن</Link>
          </div>

          <div className="bg-emerald-600 p-10 rounded-[3rem] text-white space-y-8 flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center">
                <Video size={32} />
              </div>
              <h3 className="text-3xl font-black">حصص مباشرة</h3>
              <p className="text-emerald-100 text-lg leading-relaxed">تواصل مباشرة مع أفضل الأساتذة عبر Google Meet في حصص تفاعلية مباشرة.</p>
            </div>
            <Link to="/live-interviews" className="bg-emerald-500 text-white py-4 rounded-2xl font-bold text-center hover:bg-emerald-400 transition-all border border-emerald-400">احجز مكانك</Link>
          </div>

          <div className="md:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
              <div className="flex-1 space-y-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Award size={32} />
                </div>
                <h3 className="text-3xl font-black">شهادات معتمدة</h3>
                <p className="text-gray-600 text-lg leading-relaxed">أكمل مساراتك التعليمية واحصل على شهادات إتمام تثبت مهاراتك في اللغة العربية.</p>
                <Link to="/courses" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all">
                  <span>استعرض المسارات</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
              <div className="w-full md:w-1/2 aspect-video rounded-[2rem] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80" alt="Certificates" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">دوراتنا المميزة</h2>
            <p className="text-gray-500 text-lg">اختر من بين أفضل الدورات التعليمية المصممة بعناية</p>
          </div>
          <Link to="/courses" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            <span>عرض كل الدورات</span>
            <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <CourseCard 
            id="grammar-basics"
            title="أساسيات النحو العربي"
            description="دورة شاملة تغطي أساسيات النحو من المبتدئ إلى المتوسط."
            level="beginner"
            duration="4 أسابيع"
            rating={4.9}
            enrolledCount={1250}
          />
          <CourseCard 
            id="spelling-mastery"
            title="إتقان الإملاء والكتابة"
            description="تعلم قواعد الهمزة والألف الفارقة وكل ما يخص الكتابة الصحيحة."
            level="beginner"
            duration="3 أسابيع"
            rating={4.8}
            enrolledCount={850}
          />
          <CourseCard 
            id="advanced-parsing"
            title="فن الإعراب للمتقدمين"
            description="تعمق في أسرار الإعراب وتحليل الجمل المعقدة في اللغة العربية."
            level="advanced"
            duration="6 أسابيع"
            rating={5.0}
            enrolledCount={420}
          />
        </div>
      </section>
    </div>
  );
};

const Lessons = () => {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const lessons = [
    {
      id: 'composition',
      title: '🖋️ التعبير والإنشاء الذكي',
      description: 'اكتب موضوعك واحصل على تصحيح فوري ذكي مع شرح للقواعد اللغوية...',
      category: 'إنشاء',
      level: 'مبتدئ',
      icon: <PenTool size={48} className="text-emerald-200" />,
      bgColor: 'bg-emerald-50',
      hoverBg: 'group-hover:bg-emerald-100',
      btnColor: 'hover:bg-emerald-600',
      type: 'link',
      path: '/composition'
    },
    {
      id: 'imperative-verb',
      title: '📌 فعل الأمر وإعرابه',
      description: 'تعلم حالات بناء فعل الأمر (السكون، حذف النون) مع نماذج إعرابية تطبيقية شاملة...',
      category: 'نحو',
      level: 'مبتدئ',
      icon: <MessageSquare size={48} className="text-orange-200" />,
      bgColor: 'bg-orange-50',
      hoverBg: 'group-hover:bg-orange-100',
      btnColor: 'hover:bg-orange-600',
      type: 'lesson'
    },
    {
      id: 'present-tense-verb',
      title: '📌 الفعل المضارع وإعرابه',
      description: 'تعلم حالات الرفع والنصب والجزم للمضارع مع نماذج إعرابية تطبيقية شاملة...',
      category: 'نحو',
      level: 'مبتدئ',
      icon: <Clock size={48} className="text-blue-200" />,
      bgColor: 'bg-blue-50',
      hoverBg: 'group-hover:bg-blue-100',
      btnColor: 'hover:bg-blue-600',
      type: 'lesson'
    },
    {
      id: 'past-tense-verb',
      title: '📌 الفعل الماضي وإعرابه',
      description: 'اكتشف حالات بناء الفعل الماضي وكيفية إعرابه مع الضمائر المختلفة بأسلوب مبسط...',
      category: 'نحو',
      level: 'مبتدئ',
      icon: <History size={48} className="text-indigo-200" />,
      bgColor: 'bg-indigo-50',
      hoverBg: 'group-hover:bg-indigo-100',
      btnColor: 'hover:bg-indigo-600',
      type: 'lesson'
    },
    {
      id: 'verb-classification',
      title: '📌 الصحيح والمعتل',
      description: 'تعلم كيفية تصنيف الأفعال إلى صحيحة ومعتلة ومعرفة أنواع كل منهما بوضوح...',
      category: 'صرف',
      level: 'مبتدئ',
      icon: <Wind size={48} className="text-blue-200" />,
      bgColor: 'bg-blue-50',
      hoverBg: 'group-hover:bg-blue-100',
      btnColor: 'hover:bg-blue-600',
      type: 'lesson'
    },
    {
      id: 'morphological-scale',
      title: '⚖️ الميزان الصرفي',
      description: 'تعرف على كيفية وزن الكلمات العربية ومعرفة أصولها وزوائدها بأسلوب مبسط...',
      category: 'صرف',
      level: 'مبتدئ',
      icon: <Scale size={48} className="text-emerald-200" />,
      bgColor: 'bg-emerald-50',
      hoverBg: 'group-hover:bg-emerald-100',
      btnColor: 'hover:bg-emerald-600',
      type: 'lesson'
    },
    {
      id: 'dual',
      title: '👥 المثنى وصيغه',
      description: 'تعلم كيفية تحويل المفرد إلى مثنى، علامات إعرابه، وما يلحق به بأسلوب تفاعلي ممتع...',
      category: 'نحو',
      level: 'متوسط',
      icon: <Users size={48} className="text-indigo-200" />,
      bgColor: 'bg-indigo-50',
      hoverBg: 'group-hover:bg-indigo-100',
      btnColor: 'hover:bg-indigo-600',
      type: 'lesson'
    },
    {
      id: 'parsing',
      title: '📘 الدرس الأول: الإعراب',
      description: 'تعرف على مفهوم الإعراب، الكلمة المعربة، وأنواع الإعراب الثلاثة...',
      category: 'نحو',
      level: 'مبتدئ',
      icon: <BookOpen size={48} className="text-emerald-200" />,
      bgColor: 'bg-emerald-50',
      hoverBg: 'group-hover:bg-emerald-100',
      btnColor: 'hover:bg-emerald-600',
      type: 'lesson'
    },
    {
      id: 'sun-moon',
      title: '☀️ اللام الشمسية والقمرية',
      description: 'تعلم كيفية التمييز بين اللام الشمسية والقمرية بسهولة مع أمثلة وتمارين...',
      category: 'إملاء',
      level: 'مبتدئ',
      icon: <Sun size={48} className="text-amber-200" />,
      bgColor: 'bg-amber-50',
      hoverBg: 'group-hover:bg-amber-100',
      btnColor: 'hover:bg-amber-600',
      type: 'lesson'
    },
    {
      id: 'ta-marbuta',
      title: '🎀 التاء المربوطة والمبسوطة',
      description: 'تعلم متى تكتب التاء مربوطة أو مبسوطة مع قواعد النطق والتمييز...',
      category: 'إملاء',
      level: 'مبتدئ',
      icon: <Type size={48} className="text-rose-200" />,
      bgColor: 'bg-rose-50',
      hoverBg: 'group-hover:bg-rose-100',
      btnColor: 'hover:bg-rose-600',
      type: 'lesson'
    },
    {
      id: 'hamza',
      title: '🖋️ الهمزة في وسط الكلمة',
      description: 'قواعد كتابة الهمزة المتوسطة على الألف، الواو، الياء، أو السطر بأسلوب ممتع...',
      category: 'إملاء',
      level: 'مبتدئ',
      icon: <PenTool size={48} className="text-indigo-200" />,
      bgColor: 'bg-indigo-50',
      hoverBg: 'group-hover:bg-indigo-100',
      btnColor: 'hover:bg-indigo-600',
      type: 'lesson'
    },
    {
      id: 'alif-after-waw',
      title: '🖋️ الألف بعد واو الجماعة',
      description: 'تعلم متى تضاف الألف بعد الواو ومتى لا تضاف مع أمثلة توضيحية شاملة...',
      category: 'إملاء',
      level: 'مبتدئ',
      icon: <PenTool size={48} className="text-emerald-200" />,
      bgColor: 'bg-emerald-50',
      hoverBg: 'group-hover:bg-emerald-100',
      btnColor: 'hover:bg-emerald-600',
      type: 'lesson'
    }
  ];

  const filteredLessons = selectedCategory === 'الكل' 
    ? lessons 
    : lessons.filter(lesson => lesson.category === selectedCategory);

  const categories = [
    { name: 'الكل', icon: <Layers size={18} />, color: 'text-gray-600', bg: 'bg-gray-100' },
    { name: 'النحو', icon: <BookCheck size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'الصرف', icon: <Zap size={18} />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'إملاء', icon: <PenTool size={18} />, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'إنشاء', icon: <PenTool size={18} />, color: 'text-rose-600', bg: 'bg-rose-100' }
  ];

  if (selectedLesson === 'parsing') return (
    <div className="relative">
      <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للمكتبة</button>
      <ParsingLesson />
    </div>
  );

  if (selectedLesson === 'sun-moon') return (
    <div className="relative">
      <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للمكتبة</button>
      <SunMoonLesson />
    </div>
  );

  if (selectedLesson === 'ta-marbuta') return (
    <div className="relative">
      <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للمكتبة</button>
      <TaMarbutaLesson />
    </div>
  );

  if (selectedLesson === 'hamza') return (
    <div className="relative">
      <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للمكتبة</button>
      <HamzaLesson />
    </div>
  );

  if (selectedLesson === 'alif-after-waw') return (
    <div className="relative">
      <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للمكتبة</button>
      <AlifAfterWawLesson />
    </div>
  );

  if (selectedLesson === 'morphological-scale') return (
    <div className="relative">
      <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للمكتبة</button>
      <MorphologicalScaleLesson />
    </div>
  );

  if (selectedLesson === 'verb-classification') return (
    <div className="relative">
      <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للمكتبة</button>
      <VerbClassificationLesson />
    </div>
  );

  if (selectedLesson === 'past-tense-verb') return (
    <div className="relative">
      <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للمكتبة</button>
      <PastTenseVerbLesson />
    </div>
  );

  if (selectedLesson === 'present-tense-verb') return (
    <div className="relative">
      <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للمكتبة</button>
      <PresentTenseVerbLesson />
    </div>
  );

  if (selectedLesson === 'imperative-verb') return (
    <div className="relative">
      <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للمكتبة</button>
      <ImperativeVerbLesson />
    </div>
  );

  if (selectedLesson === 'google-meet-guide') return (
    <div className="relative">
      <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للمكتبة</button>
      <GoogleMeetGuide />
    </div>
  );

  if (selectedLesson === 'dual') return (
    <div className="relative">
      <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للمكتبة</button>
      <DualLesson />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center px-4">اختر مستواك الدراسي (السلك الإعدادي)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FirstYearDropdown />
          <SecondYearDropdown />
          <ThirdYearDropdown />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold">مكتبة الدروس العامة</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button 
              key={cat.name} 
              onClick={() => setSelectedCategory(cat.name)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border-2",
                selectedCategory === cat.name 
                  ? `${cat.bg} ${cat.color} border-transparent shadow-md scale-105` 
                  : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
              )}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        <AnimatePresence mode="popLayout">
          {filteredLessons.map((lesson) => (
            <motion.div 
              key={lesson.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col"
            >
              <div className={cn("h-48 flex items-center justify-center transition-colors", lesson.bgColor, lesson.hoverBg)}>
                {lesson.icon}
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex gap-2 mb-4">
                  <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{lesson.level}</span>
                  <span className={cn("text-xs font-bold px-3 py-1 rounded-full", 
                    lesson.category === 'النحو' ? 'bg-emerald-100 text-emerald-700' :
                    lesson.category === 'الصرف' ? 'bg-blue-100 text-blue-700' :
                    lesson.category === 'إملاء' ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  )}>
                    {lesson.category}
                  </span>
                </div>
                <h4 className="font-black text-xl mb-3 text-gray-900">{lesson.title}</h4>
                <p className="text-gray-500 mb-8 flex-1 leading-relaxed">{lesson.description}</p>
                
                {lesson.type === 'link' ? (
                  <Link 
                    to={lesson.path!}
                    className={cn("block w-full py-4 bg-gray-900 text-white text-center rounded-2xl font-bold transition-all", lesson.btnColor)}
                  >
                    ابدأ الآن
                  </Link>
                ) : (
                  <button 
                    onClick={() => setSelectedLesson(lesson.id)}
                    className={cn("w-full py-4 bg-gray-900 text-white rounded-2xl font-bold transition-all", lesson.btnColor)}
                  >
                    ابدأ الدرس
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Exercises = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const renderQuiz = (title: string, type: string, QuizComponent: any) => (
    <div className="relative">
      <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 hover:bg-white transition-all">العودة للقائمة</button>
      <QuizRegistration quizTitle={title} quizType={type}>
        {(studentData, onComplete) => (
          <QuizComponent onComplete={onComplete} />
        )}
      </QuizRegistration>
    </div>
  );

  if (selectedGame === 'types') return renderQuiz("لعبة أنواع الجمل", "اختبار وحدة", QuizGame);
  if (selectedGame === 'verbal') return renderQuiz("تحدي الجملة الفعلية", "اختبار وحدة", VerbalSentenceQuiz);
  if (selectedGame === 'verbs') return renderQuiz("أنواع الفعل", "اختبار وحدة", VerbTypesQuiz);
  if (selectedGame === 'object') return renderQuiz("المفعول به", "اختبار وحدة", ObjectQuiz);
  if (selectedGame === 'nominal') return renderQuiz("الجملة الاسمية", "اختبار وحدة", NominalSentenceQuiz);
  if (selectedGame === 'subject') return renderQuiz("المبتدأ", "اختبار وحدة", SubjectQuiz);
  if (selectedGame === 'predicate') return renderQuiz("الخبر", "اختبار وحدة", PredicateQuiz);
  if (selectedGame === 'states') return renderQuiz("أحوال المبتدأ والخبر", "اختبار وحدة", SubjectPredicateStatesQuiz);
  if (selectedGame === 'subject-predicate') return renderQuiz("المبتدأ والخبر", "اختبار وحدة", SubjectAndPredicateQuiz);
  if (selectedGame === 'phrase') return renderQuiz("شبه الجملة", "اختبار وحدة", PhraseQuiz);
  if (selectedGame === 'nominal-exam') return renderQuiz("الامتحان الشامل (الجملة الاسمية)", "امتحان شامل", NominalSentenceExam);
  if (selectedGame === 'exam') return renderQuiz("الامتحان الشامل (الجملة الفعلية)", "امتحان شامل", VerbalSentenceExam);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-gray-900 mb-4">الألعاب التعليمية</h2>
        <p className="text-xl text-gray-600">اختر تحدياً وابدأ في اختبار معلوماتك بأسلوب ممتع</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
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

const LiveRedirect = () => {
  useEffect(() => {
    window.location.href = "https://meet.google.com/new";
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-900">جاري توجيهك إلى الحصة المباشرة...</h2>
        <p className="text-gray-500 mt-2">يرجى الانتظار لحظة</p>
      </div>
    </div>
  );
};

import RegistrationForm from './components/RegistrationForm';

const InteractiveLessonWrapper = () => {
  const navigate = useNavigate();
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <InteractiveLesson onComplete={() => navigate('/student-dashboard')} />
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        // Listen to user profile changes
        const unsubscribeProfile = onSnapshot(doc(db, 'users', u.uid), (doc) => {
          if (doc.exists()) {
            setUserProfile(doc.data());
          } else {
            setUserProfile(null);
          }
          setLoading(false);
        });
        return () => unsubscribeProfile();
      } else {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If logged in but profile is not complete, show registration form
  if (user && !userProfile?.isProfileComplete && user.email !== 'wadifamaroc60@gmail.com') {
    return <RegistrationForm userId={user.uid} onComplete={() => {}} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar user={user} loading={loading} />
        <main>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            <Route path="/course/:courseId/learn" element={<LessonPlayer />} />
            <Route path="/certificate/:courseId" element={<CertificateView />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/composition" element={<ArabicComposition />} />
            <Route path="/whiteboard" element={<Whiteboard />} />
            <Route path="/first-year-course" element={<FirstYearArabicCourse />} />
            <Route path="/smart-admin" element={<SmartAdminPanel />} />
            <Route path="/parsing-adventure" element={<ParsingCourse />} />
            <Route path="/game-arena" element={<GameArena />} />
            <Route path="/live-interviews" element={<LiveInterviews userRole={user?.email === 'wadifamaroc60@gmail.com' ? 'teacher' : 'student'} />} />
            <Route path="/student-dashboard" element={<SmartDashboard />} />
            <Route path="/lessons/dual" element={<DualLesson />} />
            <Route path="/interactive-lesson" element={<InteractiveLessonWrapper />} />
            <Route path="/live" element={<LiveRedirect />} />
            <Route path="/dashboard" element={user?.email === 'wadifamaroc60@gmail.com' ? <AdminDashboard /> : <Home user={user} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

