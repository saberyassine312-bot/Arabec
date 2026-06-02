import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where, doc, updateDoc, deleteDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  School, 
  Search, 
  Filter, 
  ChevronLeft, 
  Calendar, 
  BarChart3, 
  AlertTriangle,
  User,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  Zap,
  Award,
  Crown,
  Flame,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Video,
  Settings,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  XCircle,
  Layers,
  Gamepad2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface StudentLMSProfile {
  uid: string;
  displayName: string;
  email: string;
  xp: number;
  level: string;
  streak: number;
  badges: string[];
  enrollments: any[];
  quizAttempts: any[];
  role: string;
  section?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  modules: any[];
  enrolledCount: number;
}

interface ClassSection {
  id: string;
  name: string;
  level: string;
  studentCount: number;
}

export const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'students' | 'classes' | 'levels' | 'courses' | 'gamification' | 'live' | 'analytics'>('overview');
  const [students, setStudents] = useState<StudentLMSProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentLMSProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        })) as any[];

        // Fetch Courses
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Course[];

        // Fetch Classes (Mocking for now if not in DB, or fetch if exists)
        // In a real app, these would be in Firestore
        const classesData: ClassSection[] = [
          { id: '1a', name: '1A', level: 'السنة الأولى', studentCount: 12 },
          { id: '2b', name: '2B', level: 'السنة الثانية', studentCount: 8 },
          { id: '3c', name: '3C', level: 'السنة الثالثة', studentCount: 15 },
        ];

        setStudents(usersData.map(u => ({
          ...u,
          level: calculateLevel(u.xp || 0),
          enrollments: [], // Would fetch from enrollments collection
          quizAttempts: [] // Would fetch from quizAttempts collection
        })));
        setCourses(coursesData);
        setClasses(classesData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateLevel = (xp: number) => {
    if (xp <= 100) return 'مبتدئ';
    if (xp <= 300) return 'متوسط';
    if (xp <= 600) return 'متقدم';
    return 'خبير';
  };

  const chartData = [
    { name: 'السبت', students: 40, progress: 24 },
    { name: 'الأحد', students: 30, progress: 13 },
    { name: 'الاثنين', students: 20, progress: 98 },
    { name: 'الثلاثاء', students: 27, progress: 39 },
    { name: 'الأربعاء', students: 18, progress: 48 },
    { name: 'الخميس', students: 23, progress: 38 },
    { name: 'الجمعة', students: 34, progress: 43 },
  ];

  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444'];

  const SidebarItem = ({ id, icon: Icon, label }: { id: typeof activeSection; icon: any; label: string }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all",
        activeSection === id 
          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
          : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
      )}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-l border-gray-100 p-6 flex flex-col gap-8 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl">ل</div>
          <div className="font-black text-xl text-gray-900">لوحة الإدارة</div>
        </div>

        <nav className="flex flex-col gap-2">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-2">الرئيسية</div>
          <SidebarItem id="overview" icon={LayoutDashboard} label="نظرة عامة" />
          <SidebarItem id="analytics" icon={BarChart3} label="الإحصائيات" />
          
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mt-6 mb-2">الإدارة</div>
          <SidebarItem id="students" icon={Users} label="المتعلمين" />
          <SidebarItem id="classes" icon={School} label="الأقسام" />
          <SidebarItem id="levels" icon={Layers} label="المستويات" />
          <SidebarItem id="courses" icon={BookOpen} label="الدورات والدروس" />
          
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mt-6 mb-2">الأنشطة</div>
          <SidebarItem id="gamification" icon={Gamepad2} label="الألعاب والجوائز" />
          <SidebarItem id="live" icon={Video} label="المقابلات المباشرة" />
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-50">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
              {auth.currentUser?.displayName?.[0]}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-black text-gray-900 truncate">{auth.currentUser?.displayName}</span>
              <span className="text-[10px] text-gray-400 font-bold">مدير المنصة</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              {activeSection === 'overview' && "نظرة عامة"}
              {activeSection === 'analytics' && "تحليلات الأداء"}
              {activeSection === 'students' && "إدارة المتعلمين"}
              {activeSection === 'classes' && "إدارة الأقسام التعليمية"}
              {activeSection === 'levels' && "نظام المستويات"}
              {activeSection === 'courses' && "إدارة المحتوى التعليمي"}
              {activeSection === 'gamification' && "نظام التحفيز والألعاب"}
              {activeSection === 'live' && "المقابلات المباشرة"}
            </h1>
            <p className="text-gray-500 mt-1">مرحباً بك في مركز التحكم بـ منصة MadrasaNet</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="بحث سريع..." 
                className="pr-12 pl-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 w-64 shadow-sm"
              />
            </div>
            <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-600 transition-all shadow-sm">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <Users size={24} />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12%</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">{students.length}</div>
                  <div className="text-sm text-gray-400 font-bold">إجمالي المتعلمين</div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <BookOpen size={24} />
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">8 دورات</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">{courses.length}</div>
                  <div className="text-sm text-gray-400 font-bold">المحتوى التعليمي</div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                      <Zap size={24} />
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">نشط</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">85%</div>
                  <div className="text-sm text-gray-400 font-bold">متوسط التقدم</div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                      <Award size={24} />
                    </div>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">92%</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">1.2k</div>
                  <div className="text-sm text-gray-400 font-bold">الأوسمة الممنوحة</div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-gray-900 mb-8">نشاط المتعلمين الأسبوعي</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="students" fill="#059669" radius={[6, 6, 0, 0]} barSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-gray-900 mb-8">توزيع المستويات</h3>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'مبتدئ', value: 400 },
                            { name: 'متوسط', value: 300 },
                            { name: 'متقدم', value: 200 },
                            { name: 'خبير', value: 100 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[0,1,2,3].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-3 pr-8">
                      {['مبتدئ', 'متوسط', 'متقدم', 'خبير'].map((level, i) => (
                        <div key={level} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          <span className="text-sm font-bold text-gray-600">{level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Top Students */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900">آخر المسجلين</h3>
                    <button className="text-emerald-600 font-bold text-sm">عرض الكل</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {students.slice(0, 5).map((student) => (
                      <div key={student.uid} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-black text-xl">
                            {student.displayName[0]}
                          </div>
                          <div>
                            <div className="font-black text-gray-900">{student.displayName}</div>
                            <div className="text-xs text-gray-400 font-bold">{student.email}</div>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-black text-emerald-600">{student.level}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{student.xp} XP</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-gray-900 mb-6">أفضل المتعلمين</h3>
                  <div className="space-y-6">
                    {students.sort((a, b) => b.xp - a.xp).slice(0, 5).map((student, i) => (
                      <div key={student.uid} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black",
                            i === 0 ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-400"
                          )}>
                            {i + 1}
                          </div>
                          <div className="font-bold text-gray-900">{student.displayName}</div>
                        </div>
                        <div className="text-sm font-black text-emerald-600">{student.xp}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'students' && (
            <motion.div 
              key="students"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text"
                    placeholder="ابحث عن متعلم..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                  <Plus size={20} />
                  <span>إضافة متعلم</span>
                </button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-wider">
                      <th className="px-8 py-4">المتعلم</th>
                      <th className="px-8 py-4">المستوى</th>
                      <th className="px-8 py-4">القسم</th>
                      <th className="px-8 py-4">النقاط (XP)</th>
                      <th className="px-8 py-4">الحالة</th>
                      <th className="px-8 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {students.map((student) => (
                      <tr key={student.uid} className="hover:bg-gray-50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl">
                              {student.displayName[0]}
                            </div>
                            <div>
                              <div className="font-black text-gray-900">{student.displayName}</div>
                              <div className="text-xs text-gray-400 font-bold">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-bold text-gray-700">{student.level}</td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                            {student.section || 'غير محدد'}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-black text-emerald-600">{student.xp}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            نشط الآن
                          </div>
                        </td>
                        <td className="px-8 py-6 text-left">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                              <Edit2 size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeSection === 'courses' && (
            <motion.div 
              key="courses"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">إدارة الدورات والدروس</h3>
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                  <Plus size={20} />
                  <span>إنشاء دورة جديدة</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group">
                    <div className="h-48 bg-gray-100 relative">
                      <img 
                        src={`https://picsum.photos/seed/${course.id}/600/400`} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase text-emerald-600">
                        {course.level}
                      </div>
                    </div>
                    <div className="p-8">
                      <h4 className="text-xl font-black text-gray-900 mb-2">{course.title}</h4>
                      <p className="text-gray-400 text-sm mb-6 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                          <Users size={16} />
                          <span>{course.enrolledCount} متعلم</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <Edit2 size={18} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'classes' && (
            <motion.div 
              key="classes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">إدارة الأقسام التعليمية</h3>
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                  <Plus size={20} />
                  <span>إضافة قسم جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <div key={cls.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                        {cls.name}
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 rounded-xl transition-all"><Edit2 size={18} /></button>
                        <button className="p-2 text-gray-400 hover:text-red-600 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-1">قسم {cls.name}</h4>
                    <p className="text-gray-400 text-sm font-bold mb-6">{cls.level}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-gray-500 font-bold">
                        <Users size={18} className="text-emerald-600" />
                        <span>{cls.studentCount} متعلم</span>
                      </div>
                      <button className="text-emerald-600 font-bold text-sm hover:underline">عرض القائمة</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'levels' && (
            <motion.div 
              key="levels"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-8">إعدادات نظام المستويات</h3>
                <div className="grid gap-6">
                  {[
                    { id: 'beg', name: 'مبتدئ', xp: 0, lessons: 12, success: 70, color: 'bg-emerald-500' },
                    { id: 'int', name: 'متوسط', xp: 100, lessons: 24, success: 75, color: 'bg-blue-500' },
                    { id: 'adv', name: 'متقدم', xp: 300, lessons: 36, success: 80, color: 'bg-amber-500' },
                    { id: 'exp', name: 'خبير', xp: 600, lessons: 50, success: 90, color: 'bg-purple-500' },
                  ].map((lvl) => (
                    <div key={lvl.id} className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg", lvl.color)}>
                        {lvl.name[0]}
                      </div>
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-[10px] text-gray-400 font-black uppercase mb-1">اسم المستوى</div>
                          <div className="font-black text-gray-900">{lvl.name}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 font-black uppercase mb-1">XP المطلوب</div>
                          <div className="font-black text-gray-900">{lvl.xp} XP</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 font-black uppercase mb-1">عدد الدروس</div>
                          <div className="font-black text-gray-900">{lvl.lessons} درس</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 font-black uppercase mb-1">نسبة النجاح</div>
                          <div className="font-black text-emerald-600">{lvl.success}%</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">تعديل</button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'gamification' && (
            <motion.div 
              key="gamification"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-gray-900 mb-6">إدارة الأوسمة (Badges)</h3>
                  <div className="grid gap-4">
                    {[
                      { id: 'first', name: 'أول خطوة', icon: <CheckCircle />, color: 'text-emerald-500' },
                      { id: 'streak', name: 'المثابر', icon: <Flame />, color: 'text-orange-500' },
                      { id: 'master', name: 'متقن النحو', icon: <Award />, color: 'text-blue-500' },
                    ].map(badge => (
                      <div key={badge.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm", badge.color)}>
                            {badge.icon}
                          </div>
                          <div className="font-bold text-gray-900">{badge.name}</div>
                        </div>
                        <button className="text-gray-400 hover:text-blue-600"><Edit2 size={16} /></button>
                      </div>
                    ))}
                    <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
                      <Plus size={18} />
                      <span>إضافة وسام جديد</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-gray-900 mb-6">إعدادات النقاط (XP)</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'إكمال درس', value: 50 },
                      { label: 'إكمال اختبار', value: 100 },
                      { label: 'سلسلة يومية', value: 20 },
                      { label: 'المشاركة في حصة مباشرة', value: 150 },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="font-bold text-gray-700">{item.label}</span>
                        <div className="flex items-center gap-3">
                          <input type="number" defaultValue={item.value} className="w-20 px-3 py-1 bg-white border border-gray-200 rounded-lg text-center font-black text-emerald-600" />
                          <span className="text-xs font-bold text-gray-400">XP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'live' && (
            <motion.div 
              key="live"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">إدارة المقابلات المباشرة</h3>
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                  <Plus size={20} />
                  <span>جدولة مقابلة جديدة</span>
                </button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                  <h4 className="font-black text-gray-900">الجلسات القادمة</h4>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { title: 'مراجعة النحو الشاملة', date: '2024-04-15', time: '18:00', attendees: 45 },
                    { title: 'ورشة التعبير الإنشائي', date: '2024-04-18', time: '20:00', attendees: 32 },
                  ].map((session, i) => (
                    <div key={i} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                          <Video size={32} />
                        </div>
                        <div>
                          <div className="text-xl font-black text-gray-900">{session.title}</div>
                          <div className="flex items-center gap-4 mt-1 text-gray-400 font-bold text-sm">
                            <span className="flex items-center gap-2"><Calendar size={16} /> {session.date}</span>
                            <span className="flex items-center gap-2"><Clock size={16} /> {session.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-lg font-black text-gray-900">{session.attendees}</div>
                          <div className="text-[10px] text-gray-400 font-black uppercase">مسجل</div>
                        </div>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">إدارة</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-gray-900 mb-8">معدل النجاح في الاختبارات</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-gray-900 mb-8">أداء الأقسام</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: '1A', score: 85 },
                        { name: '2B', score: 72 },
                        { name: '3C', score: 90 },
                        { name: '4D', score: 65 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
