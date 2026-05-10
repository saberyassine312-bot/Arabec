import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where, doc, onSnapshot, getDoc, limit } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, BarChart3, Zap, Trophy, 
  Target, GraduationCap, School, Layers, 
  Gamepad2, Video, TrendingUp, Plus,
  Search, Filter, MoreVertical, Edit2, Trash2,
  Calendar, ArrowUpRight, ArrowDownRight,
  MessageSquare, Bell, Settings, Eye, Star,
  FolderOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { StatsWidget } from './StatsWidget';
import { 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export const ModernAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [roleVerified, setRoleVerified] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeToday: 124,
    completionRate: 85,
    newEnrollments: 32
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const checkRole = async () => {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
      if (userDoc.exists() && (userDoc.data().role === 'admin' || auth.currentUser?.email === 'wadifamaroc60@gmail.com')) {
        setRoleVerified(true);
      } else {
        setLoading(false);
      }
    };
    checkRole();
  }, []);

  useEffect(() => {
    if (!roleVerified) return;

    // Real-time subscriptions
    const unsubUsers = onSnapshot(collection(db, 'users'), 
      (snapshot) => {
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(users);
        setStats(prev => ({ ...prev, totalUsers: users.length }));
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'users');
      }
    );

    const unsubCourses = onSnapshot(collection(db, 'courses'), 
      (snapshot) => {
        const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesData);
        setStats(prev => ({ ...prev, totalCourses: coursesData.length }));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'courses');
      }
    );

    const unsubActivities = onSnapshot(
      query(collection(db, 'quizAttempts'), orderBy('timestamp', 'desc'), limit(5)),
      (snapshot) => {
        setRecentActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    );

    return () => {
      unsubUsers();
      unsubCourses();
      unsubActivities();
    };
  }, [roleVerified]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold">جاري تحميل لوحة التحكم الذكية...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 rtl" dir="rtl">
      {/* SaaS Premium Header */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
             <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
               <Shield size={14} />
               <span>نظام الإدارة المتكامل (LMS SaaS)</span>
             </div>
             <h1 className="text-4xl font-black text-slate-900 leading-tight">مرحباً بك في لوحة تحكم المنصة 👋</h1>
             <p className="text-slate-500 font-medium max-w-xl">
               تابع أداء الدروس، نشاط الأساتذة، وتفاعل المتعلمين في مكان واحد وبإحصائيات مباشرة.
             </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
             <button 
               onClick={() => navigate('/admin/lessons')}
               className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-[1.5rem] font-black shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-1"
             >
               <Plus size={20} />
               <span>إضافة درس جديد</span>
             </button>
             <button 
               onClick={() => navigate('/admin/insights')}
               className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-5 rounded-[1.5rem] font-black shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:-translate-y-1"
             >
               <BarChart3 size={20} />
               <span>تفضيلات المتعلمين</span>
             </button>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsWidget 
           title="إجمالي المتعلمين" 
           value={stats.totalUsers} 
           icon={<Users size={24} />} 
           trend="+12% زيادة" 
           trendUp={true}
           color="blue"
        />
        <StatsWidget 
           title="الدروس النشطة" 
           value={stats.totalCourses} 
           icon={<BookOpen size={24} />} 
           trend="8 دورات جديدة" 
           trendUp={true}
           color="emerald"
        />
        <StatsWidget 
           title="تفاعل الطلاب" 
           value={`${stats.completionRate}%`} 
           icon={<Zap size={24} />} 
           trend="+3% تحسن" 
           trendUp={true}
           color="amber"
        />
        <StatsWidget 
           title="نشاط اليوم" 
           value={stats.activeToday} 
           icon={<ActivityPulse size={24} />} 
           trend="مباشر الآن" 
           trendUp={true}
           color="rose"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-900">النمو والنشاط الشهري</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">تتبع تطور أعداد المستخدمين والتفاعل على مدار العام.</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 font-bold text-sm text-slate-600">
               <option>سنة 2026</option>
               <option>سنة 2025</option>
            </select>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Jan', value: 400 }, { name: 'Feb', value: 550 },
                { name: 'Mar', value: 480 }, { name: 'Apr', value: 800 },
                { name: 'May', value: 920 }, { name: 'Jun', value: 850 },
              ]}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-8">
           {/* Section Shortcuts */}
           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-900">وصول سريع</h3>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: 'الدروس', icon: <FolderOpen />, path: '/admin/lessons', color: 'bg-emerald-50 text-emerald-600' },
                   { label: 'الأساتذة', icon: <Users />, path: '/admin/teachers', color: 'bg-blue-50 text-blue-600' },
                   { label: 'الطلاب', icon: <GraduationCap />, path: '/admin/students', color: 'bg-purple-50 text-purple-600' },
                   { label: 'التقارير', icon: <BarChart3 />, path: '/admin/insights', color: 'bg-amber-50 text-amber-600' },
                 ].map((item, i) => (
                    <button 
                      key={i}
                      onClick={() => navigate(item.path)}
                      className="flex flex-col items-center gap-3 p-6 rounded-3xl border border-slate-50 hover:border-slate-200 hover:bg-slate-50 transition-all group"
                    >
                       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", item.color)}>
                         {item.icon}
                       </div>
                       <span className="text-xs font-black text-slate-700">{item.label}</span>
                    </button>
                 ))}
              </div>
           </div>

           {/* Real-time Activity Feed */}
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">نشاط مباشر</h3>
                <span className="px-2 py-1 bg-emerald-500 rounded-lg text-[10px] font-black animate-pulse uppercase tracking-wider">LIVE</span>
              </div>
              <div className="space-y-4">
                 {recentActivities.map((act, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                       <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                         <Star size={18} />
                       </div>
                       <div className="flex-1 space-y-1">
                          <div className="text-xs font-black leading-relaxed">
                             <span className="text-emerald-400">{act.studentData?.displayName || 'طالب'}</span> أكمل اختبار {act.quizTitle}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500">منذ {i + 1 * 5} دقائق</span>
                            <span className="text-[10px] font-black text-amber-400">{act.score}%</span>
                          </div>
                       </div>
                    </div>
                 ))}
                 {recentActivities.length === 0 && (
                   <p className="text-center py-6 text-slate-500 text-sm font-bold">لا توجد أنشطة مسجلة بعد.</p>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Featured Management Preview */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Popular Courses Preview */}
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900">الدروس الأكثر طلباً</h3>
            <button 
              onClick={() => navigate('/admin/lessons')}
              className="text-emerald-600 font-black text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>إدارة الجميع</span>
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
             {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="p-8 hover:bg-slate-50/50 transition-all flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 shrink-0">
                        {course.type === 'video' ? <Video size={24} /> : <BookOpen size={24} />}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 line-clamp-1">{course.title}</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{course.subject} • {course.level}</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="font-black text-slate-900">{course.views || 0}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">مشاهدة</div>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Top Performers Preview */}
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900">أبرز المتعلمين</h3>
            <button 
              onClick={() => navigate('/admin/students')}
              className="text-blue-600 font-black text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>عرض السجل</span>
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
             {students.sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 3).map((student, i) => (
                <div key={student.id} className="p-8 hover:bg-slate-50/50 transition-all flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 shadow-inner overflow-hidden">
                        {student.avatar ? <img src={student.avatar} alt="" /> : student.displayName?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{student.displayName || 'مستخدم'}</div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <Trophy size={10} className="text-amber-500" />
                           <span>الرتبة: {i + 1}</span>
                        </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="font-black text-emerald-600">{student.xp || 0} XP</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-center">الإنجاز</div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityPulse = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a0.25 0.25 0 0 1-0.48 0L9.24 2.18a0.25 0.25 0 0 0-0.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2" />
  </svg>
);

const Shield = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);

const ChevronLeft = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);
