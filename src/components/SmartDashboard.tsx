import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, BookOpen, Zap, Trophy, Clock, 
  ArrowRight, Play, CheckCircle2, BarChart3,
  Brain, PenTool, BookMarked, LayoutDashboard,
  GraduationCap, Target, Flame, Star
} from 'lucide-react';
import { collection, query, where, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function SmartDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [lastLesson, setLastLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribeProfile = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data());
      }
    });

    const qAttempts = query(
      collection(db, 'quizAttempts'),
      where('studentData.uid', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsubscribeAttempts = onSnapshot(qAttempts, (snapshot) => {
      setRecentAttempts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Fetch last lesson if exists
    const fetchLastLesson = async () => {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
      if (userDoc.exists() && userDoc.data().lastLessonId) {
        const lessonDoc = await getDoc(doc(db, 'lessons', userDoc.data().lastLessonId));
        if (lessonDoc.exists()) {
          setLastLesson({ id: lessonDoc.id, ...lessonDoc.data() });
        }
      }
      setLoading(false);
    };

    fetchLastLesson();

    return () => {
      unsubscribeProfile();
      unsubscribeAttempts();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const paths = [
    { id: 'grammar', title: 'النحو', icon: <BookMarked className="text-blue-600" />, color: 'bg-blue-50', count: 12 },
    { id: 'morphology', title: 'الصرف', icon: <Brain className="text-purple-600" />, color: 'bg-purple-50', count: 8 },
    { id: 'spelling', title: 'الإملاء', icon: <PenTool className="text-amber-600" />, color: 'bg-amber-50', count: 10 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-24" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header / Profile Card */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-[3rem] p-8 shadow-xl shadow-indigo-100/50 border border-indigo-50 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50 rounded-full -translate-x-32 -translate-y-32 opacity-50" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200 rotate-3">
                <User size={64} className="-rotate-3" />
              </div>
              <div className="flex-1 text-center md:text-right">
                <div className="flex flex-wrap items-center gap-3 mb-2 justify-center md:justify-start">
                  <h1 className="text-4xl font-black text-gray-900">{profile?.firstName} {profile?.lastName}</h1>
                  <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-black">المستوى: {profile?.gradeLevel}</span>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-gray-500 font-bold justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard size={18} className="text-indigo-400" />
                    <span>القسم: {profile?.section}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HashIcon size={18} className="text-indigo-400" />
                    <span>الرقم: {profile?.orderNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={18} className="text-amber-500" />
                    <span>{profile?.points || 0} نقطة</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-black text-gray-400 uppercase tracking-wider">مستوى التقدم العام</span>
                <span className="text-indigo-600 font-black">65%</span>
              </div>
              <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="h-full bg-gradient-to-l from-indigo-600 to-blue-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3rem] p-8 text-white shadow-xl shadow-indigo-200 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 -translate-y-16" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Trophy size={24} className="text-amber-300" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-indigo-100 uppercase">الرتبة الحالية</div>
                  <div className="text-xl font-black">خبير اللغة</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/courses')}
                  className="w-full bg-white text-indigo-600 rounded-2xl py-4 font-black flex items-center justify-center gap-3 shadow-xl shadow-black/10 hover:bg-indigo-50 transition-all"
                >
                  <Play size={20} fill="currentColor" />
                  ابدأ التعلم الآن
                </button>
                <button 
                  onClick={() => navigate('/exercises')}
                  className="w-full bg-indigo-500/30 text-white border border-white/20 rounded-2xl py-4 font-black flex items-center justify-center gap-3 backdrop-blur-md hover:bg-indigo-500/40 transition-all"
                >
                  <Target size={20} />
                  اختبار اليوم
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Learning Paths */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <GraduationCap size={28} className="text-indigo-600" />
                مسارات التعلم الرئيسية
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {paths.map((path) => (
                <motion.div
                  key={path.id}
                  whileHover={{ y: -8 }}
                  className="bg-white p-6 rounded-[2.5rem] shadow-lg shadow-gray-200/50 border border-gray-50 flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className={`w-20 h-20 ${path.color} rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    {path.icon}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{path.title}</h3>
                  <p className="text-gray-400 font-bold text-sm mb-6">{path.count} درساً متاحاً</p>
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-6">
                    <div className="w-1/3 h-full bg-indigo-500 rounded-full" />
                  </div>
                  <button className="text-indigo-600 font-black text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    استكشف المسار
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Last Lesson Card */}
            {lastLesson && (
              <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-48 aspect-video bg-indigo-100 rounded-[2rem] flex items-center justify-center">
                  <BookOpen size={48} className="text-indigo-600" />
                </div>
                <div className="flex-1 text-center md:text-right">
                  <div className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-block mb-3">آخر درس تم إنجازه</div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{lastLesson.title}</h3>
                  <p className="text-gray-500 font-medium mb-4">أكملت هذا الدرس بنجاح. هل تريد مراجعة المفاهيم الأساسية؟</p>
                  <button className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black hover:bg-gray-800 transition-all flex items-center gap-2 mx-auto md:mr-0">
                    مراجعة الدرس
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Analytics & History */}
          <div className="space-y-8">
            <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-50">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <BarChart3 size={24} className="text-indigo-600" />
                تحليل الأداء الذكي
              </h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <Star size={18} />
                    </div>
                    <span className="font-black text-blue-900">نمط التعلم</span>
                  </div>
                  <p className="text-sm text-blue-700 font-bold">متعلم {profile?.learningStyle === 'visual' ? 'بصري' : profile?.learningStyle === 'applied' ? 'تطبيقي' : profile?.learningStyle === 'analytical' ? 'تحليلي' : 'قيد التحليل...'}</p>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white">
                      <Target size={18} />
                    </div>
                    <span className="font-black text-amber-900">نقاط القوة</span>
                  </div>
                  <p className="text-sm text-amber-700 font-bold">النحو، الصرف</p>
                </div>

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white">
                      <Flame size={18} />
                    </div>
                    <span className="font-black text-rose-900">مجالات التحسين</span>
                  </div>
                  <p className="text-sm text-rose-700 font-bold">الإملاء (الهمزات)</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-50">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Clock size={24} className="text-indigo-600" />
                سجل النتائج
              </h2>
              <div className="space-y-4">
                {recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-gray-900">{attempt.quizType}</div>
                        <div className="text-[10px] text-gray-400 font-bold">{new Date(attempt.timestamp).toLocaleDateString('ar-EG')}</div>
                      </div>
                    </div>
                    <div className="text-lg font-black text-indigo-600">{attempt.score}</div>
                  </div>
                ))}
                {recentAttempts.length === 0 && (
                  <p className="text-center text-gray-400 font-bold text-sm py-4">لا توجد نتائج مسجلة بعد</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const HashIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);
