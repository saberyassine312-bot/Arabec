import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
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
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';

interface QuizAttempt {
  id: string;
  studentData: {
    firstName: string;
    lastName: string;
    level: string;
    section: string;
    number: string;
  };
  quizType: string;
  quizTitle: string;
  score: string;
  wrongAnswers: string[];
  errorsToFocus: string;
  timestamp: any;
}

interface StudentProfile {
  firstName: string;
  lastName: string;
  number: string;
  level: string;
  section: string;
  attempts: QuizAttempt[];
}

interface StudentLMSProfile {
  uid: string;
  displayName: string;
  email: string;
  xp: number;
  level: string;
  streak: number;
  badges: string[];
  enrollments: any[];
  quizAttempts: QuizAttempt[];
}

interface StoredStudent {
  id: string;
  fullName: string;
  email: string;
  accessCode: string;
  classLevel: string;
}

export const TeacherDashboard: React.FC = () => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [lmsStudents, setLmsStudents] = useState<StudentLMSProfile[]>([]);
  const [storedStudents, setStoredStudents] = useState<StoredStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [selectedLmsStudent, setSelectedLmsStudent] = useState<StudentLMSProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'students' | 'lms' | 'integration' | 'database'>('database');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Quiz Attempts
        const q = query(collection(db, 'quizAttempts'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const attemptsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as QuizAttempt[];
        setAttempts(attemptsData);

        // Fetch Stored Students
        const studentsSnapshot = await getDocs(collection(db, 'students'));
        const studentsData = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StoredStudent[];
        setStoredStudents(studentsData);

        // Fetch Users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        }));

        // Fetch Enrollments
        const enrollSnapshot = await getDocs(collection(db, 'enrollments'));
        const enrollData = enrollSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];

        // Link everything
        const linkedStudents = usersData.map((user: any) => {
          const userEnrollments = enrollData.filter(e => e.userId === user.uid);
          const userAttempts = attemptsData.filter(a => a.studentData?.firstName === user.displayName?.split(' ')[0]); // Fallback matching
          
          return {
            uid: user.uid,
            displayName: user.displayName || 'طالب مجهول',
            email: user.email || '',
            xp: user.xp || 0,
            level: calculateLevel(user.xp || 0),
            streak: user.streak || 0,
            badges: user.badges || [],
            enrollments: userEnrollments,
            quizAttempts: userAttempts
          };
        });

        setLmsStudents(linkedStudents);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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

  const levels = Array.from(new Set(attempts.map(a => a.studentData.level)));
  const sections = Array.from(new Set(attempts.map(a => a.studentData.section)));

  const filteredAttempts = attempts.filter(a => {
    const matchesLevel = selectedLevel === 'all' || a.studentData.level === selectedLevel;
    const matchesSection = selectedSection === 'all' || a.studentData.section === selectedSection;
    const matchesSearch = 
      `${a.studentData.firstName} ${a.studentData.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.studentData.number.includes(searchTerm);
    return matchesLevel && matchesSection && matchesSearch;
  });

  // Group by student
  const studentsMap = new Map<string, StudentProfile>();
  filteredAttempts.forEach(attempt => {
    const key = `${attempt.studentData.level}-${attempt.studentData.section}-${attempt.studentData.number}`;
    if (!studentsMap.has(key)) {
      studentsMap.set(key, {
        firstName: attempt.studentData.firstName,
        lastName: attempt.studentData.lastName,
        number: attempt.studentData.number,
        level: attempt.studentData.level,
        section: attempt.studentData.section,
        attempts: []
      });
    }
    studentsMap.get(key)!.attempts.push(attempt);
  });

  const studentsList = Array.from(studentsMap.values()).sort((a, b) => parseInt(a.number) - parseInt(b.number));

  // Analyze common errors for the current view
  const allWrongAnswers = filteredAttempts.flatMap(a => a.wrongAnswers || []);
  const errorFrequency: Record<string, number> = {};
  allWrongAnswers.forEach(err => {
    errorFrequency[err] = (errorFrequency[err] || 0) + 1;
  });
  const commonErrors = Object.entries(errorFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">لوحة تحكم المدرس</h1>
              <p className="text-gray-500">إدارة نتائج التلاميذ وتحليل الأداء</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveTab('database')}
              className={cn(
                "px-6 py-2.5 rounded-2xl font-bold transition-all",
                activeTab === 'database' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-white text-gray-600 border border-gray-100"
              )}
            >
              قاعدة بيانات التلاميذ
            </button>
            <button 
              onClick={() => setActiveTab('lms')}
              className={cn(
                "px-6 py-2.5 rounded-2xl font-bold transition-all",
                activeTab === 'lms' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-white text-gray-600 border border-gray-100"
              )}
            >
              تحليلات المنصة
            </button>
            <button 
              onClick={() => setActiveTab('students')}
              className={cn(
                "px-6 py-2.5 rounded-2xl font-bold transition-all",
                activeTab === 'students' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-white text-gray-600 border border-gray-100"
              )}
            >
              نتائج الاختبارات
            </button>
            <button 
              onClick={() => setActiveTab('integration')}
              className={cn(
                "px-6 py-2.5 rounded-2xl font-bold transition-all",
                activeTab === 'integration' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-white text-gray-600 border border-gray-100"
              )}
            >
              دليل الألعاب
            </button>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <Users className="text-emerald-600" size={24} />
              <div>
                <div className="text-xs text-gray-400 font-bold">إجمالي التلاميذ</div>
                <div className="text-xl font-black text-gray-900">{studentsList.length}</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <FileText className="text-blue-600" size={24} />
              <div>
                <div className="text-xs text-gray-400 font-bold">إجمالي الاختبارات</div>
                <div className="text-xl font-black text-gray-900">{attempts.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          {activeTab === 'database' ? (
            <div className="lg:col-span-2 space-y-6">
              {/* Database View */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text"
                    placeholder="ابحث عن تلميذ (الاسم، البريد، الكود)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <select 
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="pr-10 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 appearance-none min-w-[140px]"
                  >
                    <option value="all">كل المستويات</option>
                    <option value="الثالثة إعدادي">الثالثة إعدادي</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <Database size={24} className="text-blue-600" />
                    سجل تلاميذ المؤسسة
                  </h3>
                  <div className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    {storedStudents.filter(s => 
                      (selectedLevel === 'all' || s.classLevel === selectedLevel) &&
                      (s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       s.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       s.accessCode.toLowerCase().includes(searchTerm.toLowerCase()))
                    ).length} تلميذ مسجل
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-wider">
                        <th className="px-8 py-4">كود الدخول</th>
                        <th className="px-8 py-4">الاسم الكامل</th>
                        <th className="px-8 py-4">البريد الإلكتروني</th>
                        <th className="px-8 py-4">القسم</th>
                        <th className="px-8 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {storedStudents
                        .filter(s => 
                          (selectedLevel === 'all' || s.classLevel === selectedLevel) &&
                          (s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.accessCode.toLowerCase().includes(searchTerm.toLowerCase()))
                        )
                        .map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-4">
                            <span className="font-mono text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg">
                              {student.accessCode}
                            </span>
                          </td>
                          <td className="px-8 py-4">
                            <div className="font-black text-gray-900">{student.fullName}</div>
                          </td>
                          <td className="px-8 py-4 text-gray-500 font-medium">
                            {student.email}
                          </td>
                          <td className="px-8 py-4">
                            <span className="text-xs font-bold text-gray-400">{student.classLevel}</span>
                          </td>
                          <td className="px-8 py-4 text-left">
                            <button className="text-emerald-600 font-bold text-sm hover:underline">تتبع الأداء</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'lms' ? (
            <div className="lg:col-span-2 space-y-8">
              {/* LMS Analytics Table */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <GraduationCap size={24} className="text-emerald-600" />
                    بيانات المتعلمين والتقدم
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="بحث عن طالب..."
                        className="pr-10 pl-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-wider">
                        <th className="px-8 py-4">المتعلم</th>
                        <th className="px-8 py-4">المستوى (XP)</th>
                        <th className="px-8 py-4">التقدم في الدروس</th>
                        <th className="px-8 py-4">الأوسمة</th>
                        <th className="px-8 py-4">آخر نشاط</th>
                        <th className="px-8 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {lmsStudents
                        .filter(s => s.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((student) => (
                        <tr key={student.uid} className="hover:bg-gray-50/50 transition-colors">
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
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-black text-gray-900">{student.level}</span>
                              <span className="text-xs text-amber-600 font-bold">{student.xp} XP</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-2 min-w-[150px]">
                              <div className="flex justify-between text-[10px] font-black">
                                <span className="text-gray-400">{student.enrollments.length} دورات</span>
                                <span className="text-emerald-600">
                                  {student.enrollments.length > 0 
                                    ? Math.round(student.enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / student.enrollments.length)
                                    : 0}% معدل التقدم
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-emerald-500 h-full" 
                                  style={{ width: `${student.enrollments.length > 0 ? Math.round(student.enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / student.enrollments.length) : 0}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex -space-x-2">
                              {student.badges.slice(0, 3).map((b, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-purple-50 border-2 border-white flex items-center justify-center text-purple-600 shadow-sm">
                                  <Award size={14} />
                                </div>
                              ))}
                              {student.badges.length > 3 && (
                                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-gray-400">
                                  +{student.badges.length - 3}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                              <Clock size={14} />
                              {student.streak > 0 ? `سلسلة ${student.streak} أيام` : 'غير نشط'}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-left">
                            <button 
                              onClick={() => setSelectedLmsStudent(student)}
                              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                            >
                              <ChevronLeft size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'students' ? (
            <>
              {/* Main Content */}
              <div className="space-y-6">
                {/* Filters */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text"
                  placeholder="ابحث عن تلميذ بالاسم أو الرقم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <GraduationCap className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select 
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="pr-10 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 appearance-none min-w-[140px]"
                  >
                    <option value="all">كل المستويات</option>
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <School className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select 
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="pr-10 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 appearance-none min-w-[120px]"
                  >
                    <option value="all">كل الأقسام</option>
                    {sections.map(s => <option key={s} value={s}>قسم {s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-black text-gray-900 flex items-center gap-2">
                  <Users size={20} className="text-emerald-600" />
                  قائمة التلاميذ
                </h3>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                  {studentsList.length} تلميذ
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-wider">
                      <th className="px-6 py-4">الرقم</th>
                      <th className="px-6 py-4">الاسم الكامل</th>
                      <th className="px-6 py-4">المستوى / القسم</th>
                      <th className="px-6 py-4">عدد الاختبارات</th>
                      <th className="px-6 py-4">آخر نتيجة</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {studentsList.map((student) => {
                      const lastAttempt = student.attempts[0];
                      return (
                        <tr key={`${student.level}-${student.section}-${student.number}`} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <span className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center font-bold text-sm">
                              {student.number}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{student.firstName} {student.lastName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">{student.level} - قسم {student.section}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                              {student.attempts.length} اختبارات
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-black text-emerald-600">{lastAttempt.score}</div>
                            <div className="text-[10px] text-gray-400">{new Date(lastAttempt.timestamp?.toDate()).toLocaleDateString('ar-EG')}</div>
                          </td>
                          <td className="px-6 py-4 text-left">
                            <button 
                              onClick={() => setSelectedStudent(student)}
                              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                            >
                              <ChevronLeft size={20} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {studentsList.length === 0 && (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={40} />
                  </div>
                  <h4 className="text-gray-900 font-bold mb-1">لا توجد نتائج مطابقة</h4>
                  <p className="text-gray-400 text-sm">حاول تغيير معايير البحث أو الفلترة</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Analytics */}
          <div className="space-y-6">
            {/* Common Errors */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-500" />
                تحليل الأخطاء الشائعة
              </h3>
              <div className="space-y-4">
                {commonErrors.length > 0 ? commonErrors.map(([error, count]) => (
                  <div key={error} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-gray-700 line-clamp-1">{error}</span>
                      <span className="text-amber-600 font-black">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-400 h-full" 
                        style={{ width: `${(count / filteredAttempts.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-400 text-sm">لا توجد بيانات كافية للتحليل</div>
                )}
              </div>
              <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                  ⚠️ هذه الأسئلة تمثل أكبر تحدي للتلاميذ في هذا القسم. يوصى بإعادة شرح المفاهيم المتعلقة بها.
                </p>
              </div>
            </div>

            {/* General Report */}
            <div className="bg-gray-900 p-6 rounded-3xl text-white shadow-xl shadow-gray-200">
              <h3 className="font-black mb-6 flex items-center gap-2">
                <BarChart3 size={20} className="text-emerald-400" />
                تقرير الأداء العام
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">متوسط النتائج</span>
                  <span className="text-2xl font-black text-emerald-400">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">نسبة النجاح</span>
                  <span className="text-2xl font-black text-blue-400">92%</span>
                </div>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                  <TrendingUp size={16} />
                  استخراج تقرير مفصل
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Zap className="text-amber-500" />
              <span>دليل دمج الألعاب التعليمية (Gamification)</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-emerald-600">1. كيفية الإدراج في Google Classroom</h3>
                <ul className="space-y-3 text-gray-600 text-sm list-disc pr-4">
                  <li>افتح صفك الدراسي واضغط على "الواجب الدراسي".</li>
                  <li>اختر "إنشاء" ثم "مهمة للاختبار" أو "رابط".</li>
                  <li>انسخ رابط اللعبة من المنصة (مثلاً: /parsing-adventure) وألصقه كرابط خارجي.</li>
                  <li>حدد النقاط (مثلاً 100 نقطة) لتتوافق مع نظام الدرجات في اللعبة.</li>
                </ul>
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-blue-600">2. أدوات خارجية مقترحة</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="font-black text-gray-900">Kahoot!</div>
                    <div className="text-xs text-gray-400">للمسابقات المباشرة</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="font-black text-gray-900">Quizizz</div>
                    <div className="text-xs text-gray-400">للاختبارات المنزلية</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="font-black text-gray-900">Wordwall</div>
                    <div className="text-xs text-gray-400">للألعاب التفاعلية</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="font-black text-gray-900">Genially</div>
                    <div className="text-xs text-gray-400">للعروض التفاعلية</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
              <h3 className="font-black text-emerald-800 mb-4">🏆 نظام التحفيز المقترح</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                  <Award className="text-amber-500 mx-auto mb-2" size={32} />
                  <div className="font-bold text-sm">خبير المعرب والمبني</div>
                  <div className="text-[10px] text-gray-400">عند إتقان المستوى الأول</div>
                </div>
                <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                  <Zap className="text-blue-500 mx-auto mb-2" size={32} />
                  <div className="font-bold text-sm">سريع الإجابة</div>
                  <div className="text-[10px] text-gray-400">لإنهاء الاختبار في أقل من دقيقتين</div>
                </div>
                <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                  <Crown className="text-purple-500 mx-auto mb-2" size={32} />
                  <div className="font-bold text-sm">بطل الإعراب</div>
                  <div className="text-[10px] text-gray-400">للحصول على الدرجة الكاملة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-emerald-600 p-8 text-white relative">
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-6 left-6 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <ArrowRight size={24} />
                </button>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-3xl font-black">
                    {selectedStudent.number}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                    <p className="text-emerald-100 font-bold">{selectedStudent.level} - قسم {selectedStudent.section}</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl text-center">
                    <div className="text-2xl font-black text-gray-900">{selectedStudent.attempts.length}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">اختبارات</div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl text-center">
                    <div className="text-2xl font-black text-emerald-600">{selectedStudent.attempts[0].score}</div>
                    <div className="text-[10px] text-emerald-400 font-bold uppercase">آخر نتيجة</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-2xl text-center">
                    <div className="text-2xl font-black text-blue-600">
                      {Math.round(selectedStudent.attempts.reduce((acc, a) => acc + (parseInt(a.score) || 0), 0) / selectedStudent.attempts.length)}
                    </div>
                    <div className="text-[10px] text-blue-400 font-bold uppercase">المعدل</div>
                  </div>
                </div>

                {/* History */}
                <div>
                  <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-emerald-600" />
                    سجل الاختبارات
                  </h4>
                  <div className="space-y-3">
                    {selectedStudent.attempts.map((attempt) => (
                      <div key={attempt.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center">
                            <FileText size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{attempt.quizTitle}</div>
                            <div className="text-[10px] text-gray-400 flex items-center gap-2">
                              <Calendar size={12} />
                              {new Date(attempt.timestamp?.toDate()).toLocaleString('ar-EG')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-emerald-600">{attempt.score}</div>
                          <div className="text-[10px] text-gray-400">{attempt.quizType}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recurring Errors */}
                <div>
                  <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-500" />
                    الأخطاء المتكررة للتلميذ
                  </h4>
                  <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(selectedStudent.attempts.flatMap(a => a.wrongAnswers || []))).map((err, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white text-amber-700 rounded-xl text-xs font-bold border border-amber-200">
                          {err}
                        </span>
                      ))}
                      {selectedStudent.attempts.every(a => !a.wrongAnswers || a.wrongAnswers.length === 0) && (
                        <span className="text-amber-600 font-bold text-sm">لا توجد أخطاء مسجلة، أداء ممتاز!</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LMS Student Detail Modal */}
      <AnimatePresence>
        {selectedLmsStudent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLmsStudent(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-slate-900 p-10 text-white relative">
                <button 
                  onClick={() => setSelectedLmsStudent(null)}
                  className="absolute top-8 left-8 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <ArrowRight size={24} />
                </button>
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-lg shadow-emerald-500/20">
                    {selectedLmsStudent.displayName[0]}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black mb-2">{selectedLmsStudent.displayName}</h2>
                    <div className="flex items-center gap-4 text-slate-400 font-bold">
                      <span className="flex items-center gap-2"><User size={16} /> {selectedLmsStudent.email}</span>
                      <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                      <span className="text-emerald-400">مستوى {selectedLmsStudent.level}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                {/* Gamification Stats */}
                <div className="grid grid-cols-4 gap-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                    <Zap className="text-amber-500 mx-auto mb-2" size={24} />
                    <div className="text-2xl font-black text-slate-900">{selectedLmsStudent.xp}</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase">إجمالي XP</div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                    <Flame className="text-orange-500 mx-auto mb-2" size={24} />
                    <div className="text-2xl font-black text-slate-900">{selectedLmsStudent.streak}</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase">أيام متتالية</div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                    <Award className="text-purple-500 mx-auto mb-2" size={24} />
                    <div className="text-2xl font-black text-slate-900">{selectedLmsStudent.badges.length}</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase">أوسمة</div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                    <BookOpen className="text-blue-500 mx-auto mb-2" size={24} />
                    <div className="text-2xl font-black text-slate-900">{selectedLmsStudent.enrollments.length}</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase">دورات</div>
                  </div>
                </div>

                {/* Course Progress */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <TrendingUp size={20} className="text-emerald-600" />
                    التقدم في الدورات التعليمية
                  </h3>
                  <div className="grid gap-4">
                    {selectedLmsStudent.enrollments.map((en, i) => (
                      <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">
                            {i + 1}
                          </div>
                          <div>
                            <div className="font-black text-slate-900">دورة {en.courseId}</div>
                            <div className="text-xs text-slate-400 font-bold">تاريخ التسجيل: {new Date(en.enrolledAt?.toDate?.() || en.enrolledAt).toLocaleDateString('ar-EG')}</div>
                          </div>
                        </div>
                        <div className="text-right space-y-2 min-w-[120px]">
                          <div className="text-lg font-black text-emerald-600">{en.progress}%</div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: `${en.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedLmsStudent.enrollments.length === 0 && (
                      <div className="p-8 bg-slate-50 rounded-3xl text-center text-slate-400 font-bold">
                        لم يسجل هذا الطالب في أي دورة بعد.
                      </div>
                    )}
                  </div>
                </div>

                {/* Quiz Attempts */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <FileText size={20} className="text-blue-600" />
                    نتائج الاختبارات والتقييم
                  </h3>
                  <div className="grid gap-4">
                    {selectedLmsStudent.quizAttempts.map((attempt) => (
                      <div key={attempt.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center font-black",
                            parseInt(attempt.score) >= 80 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                          )}>
                            {attempt.score}
                          </div>
                          <div>
                            <div className="font-black text-slate-900">{attempt.quizTitle}</div>
                            <div className="text-xs text-slate-400 font-bold">{attempt.quizType} • {new Date(attempt.timestamp?.toDate?.() || attempt.timestamp).toLocaleDateString('ar-EG')}</div>
                          </div>
                        </div>
                        <button className="text-blue-600 font-bold text-sm hover:underline">عرض التفاصيل</button>
                      </div>
                    ))}
                    {selectedLmsStudent.quizAttempts.length === 0 && (
                      <div className="p-8 bg-slate-50 rounded-3xl text-center text-slate-400 font-bold">
                        لا توجد محاولات اختبار مسجلة لهذا الطالب.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
