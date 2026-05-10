import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, getDocs, orderBy, where, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  Trophy, 
  UserCircle, 
  Search, 
  LayoutDashboard, 
  ChevronLeft, 
  TrendingUp, 
  Target, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Plus,
  Save,
  X,
  FileText,
  CheckCircle2,
  AlertTriangle
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
  Cell
} from 'recharts';

interface Student {
  id: string;
  displayName: string;
  email: string;
  orderNumber: string;
  gradeLevel: string;
  role: string;
}

interface Exam {
  id: string;
  title: string;
  type: string;
}

interface Result {
  id: string;
  studentId: string;
  examId: string;
  examTitle: string;
  studentName: string;
  score: number;
  timestamp: any;
}

export const ThirdPrepDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'ranking' | 'analytics'>('overview');
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Scoring Modal
  const [scoringModal, setScoringModal] = useState<{show: boolean, student: Student | null, exam: Exam | null}>({
    show: false,
    student: null,
    exam: null
  });
  const [inputScore, setInputScore] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Students
      const studentsQuery = query(collection(db, 'users'), where('gradeLevel', '==', 'الثالثة إعدادي'));
      const studentsSnap = await getDocs(studentsQuery);
      const studentsData = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Student[];
      setStudents(studentsData.sort((a, b) => a.orderNumber.localeCompare(b.orderNumber)));

      // Exams
      const examsSnap = await getDocs(collection(db, 'exams'));
      const examsData = examsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Exam[];
      setExams(examsData);

      // Results
      const resultsSnap = await getDocs(collection(db, 'examResults'));
      const resultsData = resultsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Result[];
      setResults(resultsData);

    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'dashboard_data');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalStudents: students.length,
    totalExams: exams.length,
    averageScore: results.length > 0 
      ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length) 
      : 0,
    topScore: results.length > 0 ? Math.max(...results.map(r => r.score)) : 0,
    lowestScore: results.length > 0 ? Math.min(...results.map(r => r.score)) : 0
  };

  const filteredResults = results.filter(r => {
    const matchesExam = selectedExam === 'all' || r.examId === selectedExam;
    const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesExam && matchesSearch;
  });

  const rankings = students.map(student => {
    const studentResults = results.filter(r => r.studentId === student.id);
    const avgScore = studentResults.length > 0
      ? studentResults.reduce((acc, r) => acc + r.score, 0) / studentResults.length
      : 0;
    return {
      student,
      avgScore: Math.round(avgScore * 10) / 10,
      count: studentResults.length
    };
  }).sort((a, b) => b.avgScore - a.avgScore);

  const chartData = exams.map(exam => {
    const examResults = results.filter(r => r.examId === exam.id);
    const avg = examResults.length > 0 
      ? Math.round(examResults.reduce((acc, r) => acc + r.score, 0) / examResults.length)
      : 0;
    return {
      name: exam.title,
      الدرجة: avg
    };
  });

  const saveScore = async () => {
    if (!scoringModal.student || !scoringModal.exam) return;
    try {
      const resultId = `${scoringModal.student.id}-${scoringModal.exam.id}`;
      await addDoc(collection(db, 'examResults'), {
        studentId: scoringModal.student.id,
        examId: scoringModal.exam.id,
        examTitle: scoringModal.exam.title,
        studentName: scoringModal.student.displayName,
        score: inputScore,
        timestamp: serverTimestamp()
      });
      setScoringModal({ show: false, student: null, exam: null });
      fetchData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'examResults');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">لوحة نتائج الثالثة إعدادي</h1>
            <p className="text-gray-500 font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" />
              تتبع الأداء الدراسي والترتيب العام للقسم
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3">
                <Users size={24} className="text-emerald-600" />
                <div>
                   <div className="text-[10px] text-gray-400 font-black uppercase">إجمالي القسم</div>
                   <div className="text-xl font-black text-gray-900">{stats.totalStudents} تلميذ</div>
                </div>
             </div>
             <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3">
                <Target size={24} className="text-blue-600" />
                <div>
                   <div className="text-[10px] text-gray-400 font-black uppercase">المعدل العام</div>
                   <div className="text-xl font-black text-gray-900">{stats.averageScore}%</div>
                </div>
             </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-white p-2 rounded-2xl border border-gray-100 w-fit">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "px-6 py-2.5 rounded-xl font-black transition-all flex items-center gap-2",
              activeTab === 'overview' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-gray-500 hover:bg-emerald-50"
            )}
          >
            <LayoutDashboard size={18} />
            نظرة عامة
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={cn(
              "px-6 py-2.5 rounded-xl font-black transition-all flex items-center gap-2",
              activeTab === 'results' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-gray-500 hover:bg-emerald-50"
            )}
          >
            <FileText size={18} />
            النتائج التفصيلية
          </button>
          <button 
            onClick={() => setActiveTab('ranking')}
            className={cn(
              "px-6 py-2.5 rounded-xl font-black transition-all flex items-center gap-2",
              activeTab === 'ranking' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-gray-500 hover:bg-emerald-50"
            )}
          >
            <Trophy size={18} />
            ترتيب التميز
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={cn(
              "px-6 py-2.5 rounded-xl font-black transition-all flex items-center gap-2",
              activeTab === 'analytics' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-gray-500 hover:bg-emerald-50"
            )}
          >
            <BarChart3 size={18} />
            تحليل الأداء
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                      <Target size={24} />
                    </div>
                    <div className="text-3xl font-black text-gray-900">{stats.averageScore}%</div>
                    <div className="text-sm font-bold text-gray-400 mt-1">متوسط نقط القسم</div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                      <ArrowUpRight size={24} />
                    </div>
                    <div className="text-3xl font-black text-gray-900">{stats.topScore}/100</div>
                    <div className="text-sm font-bold text-gray-400 mt-1">أعلى نقطة مسجلة</div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                      <ArrowDownRight size={24} />
                    </div>
                    <div className="text-3xl font-black text-gray-900">{stats.lowestScore}/100</div>
                    <div className="text-sm font-bold text-gray-400 mt-1">أدنى نقطة مسجلة</div>
                  </div>
                </div>

                {/* Progress Chart */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
                  <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <Activity className="text-emerald-600" />
                    توزيع النقاط حسب كل اختبار
                  </h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                        <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                          cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="الدرجة" fill="#10b981" radius={[10, 10, 0, 0]}>
                          {chartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.الدرجة > 80 ? '#10b981' : entry.الدرجة > 60 ? '#3b82f6' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Top Students Sidebar */}
              <div className="space-y-6">
                <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-900/10">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                    <Trophy className="text-amber-400" />
                    لوحة الشرف (Top 5)
                  </h3>
                  <div className="space-y-4">
                    {rankings.slice(0, 5).map((rank, i) => (
                      <div key={rank.student.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-black",
                          i === 0 ? "bg-amber-400 text-amber-900" :
                          i === 1 ? "bg-gray-300 text-gray-900" :
                          i === 2 ? "bg-orange-400 text-orange-900" :
                          "bg-white/10 text-white"
                        )}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-black text-sm">{rank.student.displayName}</div>
                          <div className="text-[10px] text-gray-400">{rank.count} اختبارات منجزة</div>
                        </div>
                        <div className="text-xl font-black text-emerald-400">{rank.avgScore}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                   <h3 className="font-black text-gray-900 mb-4">نشاطات مقترحة</h3>
                   <div className="space-y-3">
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                         <div className="font-bold text-emerald-900 text-sm">مراجعة الجملة الفعلية</div>
                         <p className="text-[10px] text-emerald-600 mt-1">أداء القسم دون المتوسط في هذا الاختبار</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                         <div className="font-bold text-blue-900 text-sm">تكريم المتفوقين</div>
                         <p className="text-[10px] text-blue-600 mt-1">يوجد 5 تلاميذ بمعدل يفوق 95%</p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'results' && (
            <motion.div 
               key="results"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
            >
              {/* Filters Toolbar */}
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="بحث عن تلميذ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
                <div className="flex gap-4">
                   <div className="relative">
                      <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select 
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        className="pr-10 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 appearance-none font-bold min-w-[200px]"
                      >
                         <option value="all">كل الاختبارات</option>
                         {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                      </select>
                   </div>
                   <button 
                    onClick={() => setScoringModal({ show: true, student: null, exam: null })}
                    className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black hover:bg-gray-800 transition-all flex items-center gap-2"
                   >
                     <Plus size={18} />
                     إضافة نقطة يدوية
                   </button>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-right">
                       <thead>
                          <tr className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-wider">
                             <th className="px-8 py-4">ر.ت</th>
                             <th className="px-8 py-4">التلميذ</th>
                             <th className="px-8 py-4">الاختبار</th>
                             <th className="px-8 py-4">النقطة</th>
                             <th className="px-8 py-4">التاريخ</th>
                             <th className="px-8 py-4">الحالة</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {filteredResults.map((result) => {
                             const student = students.find(s => s.id === result.studentId);
                             return (
                               <tr key={result.id} className="hover:bg-gray-50/50 transition-colors">
                                  <td className="px-8 py-6">
                                     <span className="text-sm font-black text-gray-400">{student?.orderNumber || '-'}</span>
                                  </td>
                                  <td className="px-8 py-6">
                                     <div className="font-black text-gray-900">{result.studentName}</div>
                                     <div className="text-[10px] text-gray-400">{student?.email}</div>
                                  </td>
                                  <td className="px-8 py-6">
                                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                                        {result.examTitle}
                                     </span>
                                  </td>
                                  <td className="px-8 py-6">
                                     <div className={cn(
                                        "text-xl font-black",
                                        result.score >= 80 ? "text-emerald-600" : result.score >= 60 ? "text-blue-600" : "text-red-500"
                                     )}>
                                        {result.score}/100
                                     </div>
                                  </td>
                                  <td className="px-8 py-6">
                                     <div className="text-sm font-bold text-gray-500">
                                        {result.timestamp?.toDate().toLocaleDateString('ar-EG')}
                                     </div>
                                  </td>
                                  <td className="px-8 py-6">
                                     <div className={cn(
                                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black",
                                        result.score >= 60 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                     )}>
                                        {result.score >= 60 ? 'ناجح' : 'مستدرك'}
                                     </div>
                                  </td>
                               </tr>
                             )
                          })}
                       </tbody>
                    </table>
                 </div>
                 {filteredResults.length === 0 && (
                    <div className="p-20 text-center text-gray-400 font-bold">
                       لا توجد نتائج مسجلة لهذا الاختبار بـعد...
                    </div>
                 )}
              </div>
            </motion.div>
          )}

          {activeTab === 'ranking' && (
             <motion.div 
               key="ranking"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
             >
                {rankings.map((rank, i) => (
                   <div key={rank.student.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative group hover:border-emerald-200 transition-all">
                      <div className={cn(
                        "absolute top-6 left-6 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl",
                        i === 0 ? "bg-amber-400 text-amber-900 shadow-lg shadow-amber-200" :
                        i === 1 ? "bg-gray-200 text-gray-700" :
                        i === 2 ? "bg-orange-200 text-orange-800" :
                        "bg-gray-50 text-gray-400"
                      )}>
                        {i + 1}
                      </div>
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                            {rank.student.displayName[0]}
                         </div>
                         <div>
                            <h4 className="font-black text-gray-900 line-clamp-1">{rank.student.displayName}</h4>
                            <div className="text-xs text-gray-400 font-bold">رمز: {rank.student.orderNumber}</div>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-end">
                            <span className="text-gray-400 text-sm font-bold">المعدل العام</span>
                            <span className="text-3xl font-black text-emerald-600">{rank.avgScore}%</span>
                         </div>
                         <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${rank.avgScore}%` }}
                               className={cn(
                                  "h-full",
                                  rank.avgScore >= 80 ? "bg-emerald-500" : rank.avgScore >= 60 ? "bg-blue-500" : "bg-red-500"
                               )}
                            />
                         </div>
                         <div className="flex justify-between text-[10px] font-black text-gray-400">
                            <span>اختبارات منجزة: {rank.count}</span>
                            <span>الرتبة: {i + 1}</span>
                         </div>
                      </div>
                      <button 
                        onClick={() => setSelectedStudent(rank.student)}
                        className="mt-6 w-full py-3 bg-gray-50 group-hover:bg-emerald-600 group-hover:text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                      >
                         <UserCircle size={16} />
                         عرض الملف الشخصي
                      </button>
                   </div>
                ))}
             </motion.div>
          )}

          {activeTab === 'analytics' && (
             <motion.div 
               key="analytics"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="space-y-8"
             >
                <div className="grid lg:grid-cols-2 gap-8">
                   <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-black text-gray-900 mb-8">منحنى تطور متوسط القسم</h3>
                      <div className="h-80 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                               <XAxis dataKey="name" hide />
                               <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                               <Tooltip 
                                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                               />
                               <Line 
                                  type="monotone" 
                                  dataKey="الدرجة" 
                                  stroke="#10b981" 
                                  strokeWidth={4} 
                                  dot={{ fill: '#10b981', r: 6, strokeWidth: 4, stroke: '#fff' }} 
                                  activeDot={{ r: 8, strokeWidth: 0 }}
                               />
                            </LineChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-6">
                      <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-200">
                         <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                            <CheckCircle2 size={24} />
                            تحليل التقدم
                         </h4>
                         <p className="text-emerald-100 leading-relaxed font-bold">
                            يظهر القسم تحسناً ملحوظاً بنسبة 12% مقارنة بالاختبار الأول. 
                            أدوات الربط والجملة الاسمية هي نقاط القوة حالياً.
                         </p>
                      </div>
                      <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
                         <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                            <AlertTriangle size={24} />
                            توصيات الأسبوع
                         </h4>
                         <p className="text-blue-100 leading-relaxed font-bold">
                            يجب التركيز على الفروقات بين الفاعل والمفعول به في الجملة الفعلية، 
                            حيث لوحظ تراجع طفيف في النتائج الأخيرة لهذه الظاهرة.
                         </p>
                      </div>
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Student Profile Modal */}
        <AnimatePresence>
          {selectedStudent && (
             <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setSelectedStudent(null)}
                  className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                >
                   <div className="bg-emerald-600 p-10 text-white relative flex items-center gap-8">
                      <button 
                        onClick={() => setSelectedStudent(null)} 
                        className="absolute top-8 left-8 p-3 bg-white/20 rounded-2xl hover:bg-white/30"
                      >
                         <ChevronLeft size={24} className="rotate-180" />
                      </button>
                      <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center text-4xl font-black">
                         {selectedStudent.displayName[0]}
                      </div>
                      <div>
                         <h2 className="text-3xl font-black">{selectedStudent.displayName}</h2>
                         <div className="text-emerald-100 font-bold opacity-80">{selectedStudent.email} • {selectedStudent.orderNumber}</div>
                      </div>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-10 space-y-10">
                      <div className="grid grid-cols-4 gap-6">
                         <div className="bg-gray-50 p-6 rounded-[2rem] text-center">
                            <div className="text-3xl font-black text-gray-900">{results.filter(r => r.studentId === selectedStudent.id).length}</div>
                            <div className="text-[10px] text-gray-400 font-black uppercase mt-1">امتحانات مجتازة</div>
                         </div>
                         <div className="bg-emerald-50 p-6 rounded-[2rem] text-center border border-emerald-100">
                            <div className="text-3xl font-black text-emerald-600">
                               {Math.round(results.filter(r => r.studentId === selectedStudent.id).reduce((acc, r) => acc + r.score, 0) / (results.filter(r => r.studentId === selectedStudent.id).length || 1))}%
                            </div>
                            <div className="text-[10px] text-emerald-400 font-black uppercase mt-1">المعدل الشخصي</div>
                         </div>
                         <div className="bg-blue-50 p-6 rounded-[2rem] text-center border border-blue-100">
                            <div className="text-3xl font-black text-blue-600">
                               {rankings.findIndex(r => r.student.id === selectedStudent.id) + 1}
                            </div>
                            <div className="text-[10px] text-blue-400 font-black uppercase mt-1">الرتبة في القسم</div>
                         </div>
                         <div className="bg-amber-50 p-6 rounded-[2rem] text-center border border-amber-100">
                            <div className="text-3xl font-black text-amber-600">
                               {results.filter(r => r.studentId === selectedStudent.id && r.score === 100).length}
                            </div>
                            <div className="text-[10px] text-amber-400 font-black uppercase mt-1">العلامات الكاملة</div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h4 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <FileText size={20} className="text-emerald-600" />
                            تاريخ الاختبارات
                         </h4>
                         <div className="grid gap-3">
                            {results.filter(r => r.studentId === selectedStudent.id).map(res => (
                               <div key={res.id} className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between shadow-sm">
                                  <div className="font-bold text-gray-900">{res.examTitle}</div>
                                  <div className="flex items-center gap-6">
                                     <div className="text-gray-400 text-xs">{res.timestamp?.toDate().toLocaleDateString('ar-EG')}</div>
                                     <div className="text-2xl font-black text-emerald-600">{res.score}/100</div>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </motion.div>
             </div>
          )}
        </AnimatePresence>

        {/* Scoring Modal */}
        <AnimatePresence>
          {scoringModal.show && (
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setScoringModal({ show: false, student: null, exam: null })}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
              >
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                   <h3 className="text-xl font-black text-gray-900">رصد النقطة يدويًا</h3>
                   <button onClick={() => setScoringModal({ show: false, student: null, exam: null })} className="text-gray-400 hover:text-red-500">
                      <X size={24} />
                   </button>
                </div>
                <div className="p-8 space-y-6">
                   <div className="space-y-2">
                      <label className="text-sm font-black text-gray-400 px-2">اختر التلميذ</label>
                      <select 
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                        onChange={(e) => setScoringModal(prev => ({ ...prev, student: students.find(s => s.id === e.target.value) || null }))}
                      >
                         <option value="">-- اختر التلميذ --</option>
                         {students.map(s => <option key={s.id} value={s.id}>{s.displayName} ({s.orderNumber})</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-black text-gray-400 px-2">اختر الاختبار</label>
                      <select 
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                        onChange={(e) => setScoringModal(prev => ({ ...prev, exam: exams.find(ex => ex.id === e.target.value) || null }))}
                      >
                         <option value="">-- اختر الاختبار --</option>
                         {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-black text-gray-400 px-2">النقطة (/100)</label>
                      <input 
                        type="number" 
                        max={100}
                        min={0}
                        value={inputScore}
                        onChange={(e) => setInputScore(parseInt(e.target.value) || 0)}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-black text-2xl text-center"
                      />
                   </div>
                   <button 
                     onClick={saveScore}
                     disabled={!scoringModal.student || !scoringModal.exam}
                     className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-emerald-200"
                   >
                     <Save size={24} />
                     حفظ النتيجة
                   </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
