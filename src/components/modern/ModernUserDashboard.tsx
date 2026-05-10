import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Trophy, Clock, Play, GraduationCap, 
  Target, Flame, Star, BookOpen, CheckCircle2,
  TrendingUp, Award, Calendar, ChevronLeft,
  Brain, Sparkles, ArrowRight
} from 'lucide-react';
import { collection, query, where, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { StatsWidget } from './StatsWidget';
import { 
  AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const data = [
  { name: 'الأحد', xp: 400 },
  { name: 'الاثنين', xp: 300 },
  { name: 'الثلاثاء', xp: 500 },
  { name: 'الأربعاء', xp: 200 },
  { name: 'الخميس', xp: 600 },
  { name: 'الجمعة', xp: 800 },
  { name: 'السبت', xp: 450 },
];

import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';

export const ModernUserDashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [lastLesson, setLastLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribeProfile = onSnapshot(doc(db, 'users', auth.currentUser.uid), 
      (doc) => {
        if (doc.exists()) {
          setProfile(doc.data());
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${auth.currentUser?.uid}`);
      }
    );

    const qAttempts = query(
      collection(db, 'quizAttempts'),
      where('studentData.uid', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsubscribeAttempts = onSnapshot(qAttempts, 
      (snapshot) => {
        setRecentAttempts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'quizAttempts');
      }
    );


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

  if (loading) return null;

  return (
    <div className="space-y-10 rtl" dir="rtl">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-gray-900 mb-2">أهلاً بك مجدداً، {profile?.firstName || auth.currentUser?.displayName || 'تلميذنا'} 👋</h1>
           <p className="text-gray-500 font-bold">لقد حققت تقدماً رائعاً هذا الأسبوع.. استمر في العطاء!</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-white border border-gray-100 p-4 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
              <Calendar size={20} />
           </button>
           <Link to="/levels" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2">
              <span>استكمال التعلم</span>
              <Play size={18} fill="currentColor" />
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsWidget 
           title="إجمالي النقاط" 
           value={`${profile?.xp || 0} XP`} 
           icon={<Zap size={24} />} 
           trend="+12% اليوم" 
           trendUp={true}
           color="emerald"
        />
        <StatsWidget 
           title="سلسلة الأيام" 
           value={`${profile?.streak || 0} يوم`} 
           icon={<Flame size={24} />} 
           trend="مستقر" 
           trendUp={true}
           color="amber"
        />
        <StatsWidget 
           title="الدروس المكتملة" 
           value="12 درس" 
           icon={<CheckCircle2 size={24} />} 
           trend="+2 هذا الأسبوع" 
           trendUp={true}
           color="blue"
        />
        <StatsWidget 
           title="الترتيب العالمي" 
           value="#42" 
           icon={<Trophy size={24} />} 
           trend="-3 مراكز" 
           trendUp={false}
           color="purple"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="text-2xl font-black text-gray-900">تحليلات النشاط الأسبوعي</h3>
                 <p className="text-gray-400 font-bold text-sm">معدل كسب نقاط الخبرة خلال الأيام السبعة الماضية</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                 <TrendingUp size={24} />
              </div>
           </div>

           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorXp)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Level Progress */}
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full translate-x-20 -translate-y-20 blur-3xl"></div>
           
           <div className="text-center relative z-10">
              <div className="w-24 h-24 bg-white/10 rounded-full border-4 border-white/20 flex items-center justify-center mx-auto mb-6 relative">
                 <GraduationCap size={40} className="text-emerald-400" />
                 <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-10 h-10 rounded-full border-4 border-slate-900 flex items-center justify-center font-black">
                    8
                 </div>
              </div>
              <h3 className="text-2xl font-black mb-2">المستوى الثامن</h3>
              <p className="text-gray-400 font-bold">باقي 240 XP للوصول للمستوى التالي</p>
           </div>

           <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                 <span className="text-xs font-black text-gray-500 uppercase tracking-widest text-right">التقدم الحالي</span>
                 <span className="text-2xl font-black text-white leading-none">75%</span>
              </div>
              <div className="h-4 bg-white/10 rounded-full overflow-hidden p-1">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '75%' }}
                   transition={{ duration: 1, ease: 'easeOut' }}
                   className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                 />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10">
                 <div className="text-[10px] font-black text-gray-500 uppercase mb-2">أعلى نتيجة</div>
                 <div className="text-xl font-black">98%</div>
              </div>
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10">
                 <div className="text-[10px] font-black text-gray-500 uppercase mb-2">ساعات التعلم</div>
                 <div className="text-xl font-black">14.5</div>
              </div>
           </div>

           <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all relative z-10">
              عرض تفاصيل المستوى
           </button>
        </div>
      </div>

      {/* Recommended for you */}
      <div className="space-y-8">
         <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-900">موصى به لك اليوم</h3>
            <Link to="/courses" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
               <span>عرض الكل</span>
               <ChevronLeft size={20} />
            </Link>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-100 flex flex-col justify-between group cursor-pointer" onClick={() => navigate('/grammar-smart-path')}>
               <div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                     <Brain size={28} className="text-white" />
                  </div>
                  <h4 className="text-xl font-black mb-2">مسارات التعلم الذكي</h4>
                  <p className="text-indigo-100 font-bold text-sm mb-8 leading-relaxed">نظام تكيفي متكامل لإتقان قواعد النحو العربي بأسلوب شخصي مبتكر.</p>
               </div>
               <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-white font-black text-xs">
                     <Sparkles size={14} className="text-amber-300" />
                     <span>نظام ذكي</span>
                  </div>
                  <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white group-hover:text-indigo-600 transition-all">
                     <ArrowRight size={20} className="rotate-180" />
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen size={28} />
               </div>
               <h4 className="text-xl font-black text-gray-900 mb-2">المفعول المطلق</h4>
               <p className="text-gray-400 font-bold text-sm mb-8 leading-relaxed line-clamp-2">تعلم أنواع المفعول المطلق وكيفية إعرابه في الجملة بأسلوب مبسط وممتع.</p>
               <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-blue-600 font-black text-xs">
                     <Zap size={14} />
                     <span>+50 XP</span>
                  </div>
                  <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                     <Play size={20} fill="currentColor" />
                  </button>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
               <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Star size={28} />
               </div>
               <h4 className="text-xl font-black text-gray-900 mb-2">أوزان الثلاثي المزيد</h4>
               <p className="text-gray-400 font-bold text-sm mb-8 leading-relaxed line-clamp-2">تعمق في علم الصرف واكتشف أوزان الفعل الثلاثي المزيد بحرف أو حرفين أو ثلاثة.</p>
               <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-purple-600 font-black text-xs">
                     <Zap size={14} />
                     <span>+80 XP</span>
                  </div>
                  <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                     <Play size={20} fill="currentColor" />
                  </button>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
               <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <Award size={28} />
               </div>
               <h4 className="text-xl font-black text-gray-900 mb-2">تحدي الهمزة المتطرفة</h4>
               <p className="text-gray-400 font-bold text-sm mb-8 leading-relaxed line-clamp-2">اختبر مهاراتك الإملائية في كتابة الهمزة المتطرفة في وضعيات مختلفة.</p>
               <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-amber-600 font-black text-xs">
                     <Zap size={14} />
                     <span>+120 XP</span>
                  </div>
                  <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                     <Play size={20} fill="currentColor" />
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
