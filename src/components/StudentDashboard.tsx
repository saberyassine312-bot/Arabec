import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Zap, Flame, 
  Award, Target, Clock, BookOpen,
  ChevronRight, ArrowRight, Sparkles,
  TrendingUp, Users, Medal, Crown
} from 'lucide-react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useGamification } from '../hooks/useGamification';
import { cn } from '../lib/utils';

interface LeaderboardEntry {
  uid: string;
  displayName: string;
  xp: number;
  level: string;
}

export const StudentDashboard: React.FC = () => {
  const { stats, loading: statsLoading, updateStreak } = useGamification();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      
      try {
        // Fetch Leaderboard
        const lbQuery = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(5));
        const lbSnapshot = await getDocs(lbQuery);
        setLeaderboard(lbSnapshot.docs.map(doc => ({
          uid: doc.id,
          displayName: doc.data().displayName || 'طالب مجهول',
          xp: doc.data().xp || 0,
          level: doc.data().level || 'مبتدئ'
        })));

        // Fetch Enrolled Courses
        const enrollQuery = query(collection(db, 'enrollments'), where('userId', '==', auth.currentUser.uid));
        const enrollSnapshot = await getDocs(enrollQuery);
        const enrollments = enrollSnapshot.docs.map(d => d.data());
        
        const coursesData = await Promise.all(enrollments.map(async (en) => {
          const courseDoc = await getDocs(query(collection(db, 'courses'), where('__name__', '==', en.courseId)));
          if (!courseDoc.empty) {
            return { ...courseDoc.docs[0].data(), progress: en.progress, id: courseDoc.docs[0].id };
          }
          return null;
        }));
        setEnrolledCourses(coursesData.filter(c => c !== null));

        // Update streak on dashboard load
        updateStreak();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome & Quick Stats */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-50 rounded-full -translate-x-16 -translate-y-16 opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                  <Sparkles size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900">أهلاً بك، {auth.currentUser?.displayName || 'طالبنا المتميز'}!</h1>
                  <p className="text-slate-500">أنت الآن في مستوى <span className="text-emerald-600 font-bold">{stats?.level}</span>. استمر في التألق!</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold mb-1 uppercase">إجمالي النقاط</div>
                  <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Zap size={20} className="text-amber-500" />
                    {stats?.xp} XP
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold mb-1 uppercase">سلسلة الأيام</div>
                  <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Flame size={20} className="text-orange-500" />
                    {stats?.streak} يوم
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold mb-1 uppercase">الأوسمة</div>
                  <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Award size={20} className="text-purple-500" />
                    {stats?.badges.length}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold mb-1 uppercase">الرتبة</div>
                  <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <TrendingUp size={20} className="text-emerald-500" />
                    {stats?.level}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-24 translate-y-24" />
            <div className="relative z-10 h-full flex flex-col">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                <Trophy size={24} />
                لوحة الأبطال
              </h2>
              <div className="space-y-4 flex-1">
                {leaderboard.map((entry, i) => (
                  <div key={entry.uid} className="flex items-center justify-between bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm",
                        i === 0 ? "bg-amber-400 text-amber-900" : 
                        i === 1 ? "bg-slate-300 text-slate-800" :
                        i === 2 ? "bg-amber-700 text-amber-100" : "bg-white/20 text-white"
                      )}>
                        {i === 0 ? <Crown size={16} /> : i + 1}
                      </div>
                      <span className="font-bold truncate max-w-[120px]">{entry.displayName}</span>
                    </div>
                    <span className="font-black">{entry.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <BookOpen size={24} className="text-emerald-600" />
              دوراتك الحالية
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <motion.div 
                  key={course.id}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <BookOpen size={24} />
                    </div>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{course.progress}% مكتمل</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{course.title}</h3>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    متابعة التعلم
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              ))}
              {enrolledCourses.length === 0 && (
                <div className="col-span-2 bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
                  <p className="text-slate-400 font-bold mb-4">لم تسجل في أي دورة بعد.</p>
                  <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold">استكشف الدورات</button>
                </div>
              )}
            </div>
          </div>

          {/* Badges & Achievements */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Medal size={24} className="text-purple-600" />
              أوسمة الإنجاز
            </h2>
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'lesson-expert', icon: <Medal />, color: 'text-amber-500', bg: 'bg-amber-50', label: 'خبير الدروس' },
                  { id: 'speed-demon', icon: <Zap />, color: 'text-blue-500', bg: 'bg-blue-50', label: 'سريع الإجابة' },
                  { id: 'mastermind', icon: <Crown />, color: 'text-purple-500', bg: 'bg-purple-50', label: 'متقن المحتوى' },
                  { id: 'streak-3', icon: <Flame />, color: 'text-orange-500', bg: 'bg-orange-50', label: '3 أيام متتالية' },
                  { id: 'streak-7', icon: <Flame />, color: 'text-red-500', bg: 'bg-red-50', label: 'أسبوع من الإبداع' },
                  { id: 'first-quiz', icon: <CheckCircle size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'أول اختبار' }
                ].map((badge) => {
                  const isUnlocked = stats?.badges.includes(badge.id);
                  return (
                    <div key={badge.id} className="flex flex-col items-center gap-2 group">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                        isUnlocked ? `${badge.bg} ${badge.color} shadow-lg` : "bg-slate-100 text-slate-300 grayscale"
                      )}>
                        {badge.icon}
                      </div>
                      <span className={cn(
                        "text-[10px] font-black text-center leading-tight",
                        isUnlocked ? "text-slate-900" : "text-slate-300"
                      )}>{badge.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

const CheckCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
