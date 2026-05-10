import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, LayoutDashboard, GraduationCap, School, 
  Search, Filter, Calendar, BarChart3, 
  AlertTriangle, FileText, Clock, Zap,
  Award, Database, ChevronLeft, ArrowRight, Plus
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { StatsWidget } from './StatsWidget';
import { 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';

export const ModernTeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'lms' | 'database'>('database');
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [roleVerified, setRoleVerified] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const checkRole = async () => {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
      const role = userDoc.exists() ? userDoc.data().role : null;
      if (role === 'teacher' || role === 'admin' || auth.currentUser?.email === 'wadifamaroc60@gmail.com') {
        setRoleVerified(true);
      } else {
        setLoading(false);
      }
    };
    checkRole();
  }, []);

  useEffect(() => {
    if (!roleVerified) return;

    // Simplified fetching for the modern view
    const unsubStudents = onSnapshot(collection(db, 'students'), 
      (snapshot) => {
        setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'students');
      }
    );

    const unsubAttempts = onSnapshot(
      query(collection(db, 'quizAttempts'), orderBy('timestamp', 'desc')), 
      (snapshot) => {
        setAttempts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'quizAttempts');
      }
    );

    return () => {
      unsubStudents();
      unsubAttempts();
    };
  }, [roleVerified]);



  if (loading) return null;

  return (
    <div className="space-y-10 rtl" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-emerald-100">
              <GraduationCap size={32} />
           </div>
           <div>
              <h1 className="text-4xl font-black text-gray-900 mb-1">فصلي الدراسي 🎓</h1>
              <p className="text-gray-500 font-bold">متابعة دقيقة لأداء التلاميذ وتحليل مخرجات التعلم.</p>
           </div>
        </div>
        <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
           <button 
             onClick={() => setActiveTab('database')}
             className={cn("px-6 py-3 rounded-xl font-black text-sm transition-all", activeTab === 'database' ? "bg-emerald-600 text-white shadow-lg" : "text-gray-400 hover:text-gray-900")}
           >قاعدة البيانات</button>
           <button 
             onClick={() => setActiveTab('students')}
             className={cn("px-6 py-3 rounded-xl font-black text-sm transition-all", activeTab === 'students' ? "bg-emerald-600 text-white shadow-lg" : "text-gray-400 hover:text-gray-900")}
           >نتائج الاختبارات</button>
           <button 
             onClick={() => setActiveTab('lms')}
             className={cn("px-6 py-3 rounded-xl font-black text-sm transition-all", activeTab === 'lms' ? "bg-emerald-600 text-white shadow-lg" : "text-gray-400 hover:text-gray-900")}
           >إحصائيات المنصة</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatsWidget 
            title="تلاميذ القسم" 
            value={students.length} 
            icon={<Users size={24} />} 
            trend="مكتمل" 
            trendUp={true}
            color="blue"
         />
         <StatsWidget 
            title="اختبارات منجزة" 
            value={attempts.length} 
            icon={<FileText size={24} />} 
            trend="+12 هذا الأسبوع" 
            trendUp={true}
            color="emerald"
         />
         <StatsWidget 
            title="متوسط الأداء" 
            value="82%" 
            icon={<BarChart3 size={24} />} 
            trend="+5%" 
            trendUp={true}
            color="amber"
         />
         <StatsWidget 
            title="تحديات لغوية" 
            value="8" 
            icon={<Zap size={24} />} 
            trend="نشط" 
            trendUp={true}
            color="purple"
         />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'database' && (
          <motion.div 
            key="db"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <h3 className="text-2xl font-black text-gray-900">سجل تلاميذ المؤسسة</h3>
               <div className="flex items-center gap-4">
                  <div className="relative">
                     <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                     <input type="text" placeholder="بحث باسم التلميذ..." className="bg-gray-50 border border-gray-100 pr-12 pl-4 py-3 rounded-2xl text-sm outline-none w-full md:w-64" />
                  </div>
                  <button className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all">
                     <Plus size={24} />
                  </button>
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-right">
                  <thead>
                     <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                        <th className="px-10 py-6">كود الدخول</th>
                        <th className="px-10 py-6">الاسم الكامل</th>
                        <th className="px-10 py-6">القسم</th>
                        <th className="px-10 py-6">الحالة</th>
                        <th className="px-10 py-6"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {students.slice(0, 8).map((student) => (
                       <tr key={student.id} className="hover:bg-gray-50/50 transition-all">
                          <td className="px-10 py-6">
                             <code className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-black">{student.accessCode}</code>
                          </td>
                          <td className="px-10 py-6 font-black text-gray-900">{student.fullName}</td>
                          <td className="px-10 py-6">
                             <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">{student.classLevel}</span>
                          </td>
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                نشط
                             </div>
                          </td>
                          <td className="px-10 py-6 text-left">
                             <button className="text-emerald-600 font-bold hover:underline">عرض الملف</button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'students' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
             <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                   <div className="p-8 border-b border-gray-50">
                      <h3 className="text-2xl font-black text-gray-900">آخر نتائج الاختبارات</h3>
                   </div>
                   <div className="divide-y divide-gray-50">
                      {attempts.slice(0, 10).map((attempt) => (
                         <div key={attempt.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-all">
                            <div className="flex items-center gap-5">
                               <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner">
                                  {attempt.studentData?.firstName?.[0]}
                               </div>
                               <div>
                                  <div className="text-lg font-black text-gray-900">{attempt.studentData?.firstName} {attempt.studentData?.lastName}</div>
                                  <div className="text-sm text-gray-400 font-bold">{attempt.quizTitle}</div>
                               </div>
                            </div>
                            <div className="text-left">
                               <div className={cn("text-2xl font-black mb-1", parseInt(attempt.score) >= 80 ? "text-emerald-600" : "text-amber-500")}>
                                  {attempt.score}
                               </div>
                               <div className="text-[10px] text-gray-400 font-black uppercase">الدرجة النهائية</div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-6">
                      <h3 className="text-xl font-black">تحليل الأخطاء الشائعة</h3>
                      <div className="space-y-4">
                         {[
                           { name: 'همزة الوصل والقطع', percent: 65 },
                           { name: 'إعراب المثنى', percent: 42 },
                           { name: 'الميزان الصرفي', percent: 38 },
                         ].map(error => (
                            <div key={error.name} className="space-y-2">
                               <div className="flex justify-between text-xs font-bold">
                                  <span className="text-gray-400">{error.name}</span>
                                  <span>{error.percent}%</span>
                               </div>
                               <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-emerald-500 rounded-full" 
                                    style={{ width: `${error.percent}%` }}
                                  />
                               </div>
                            </div>
                         ))}
                      </div>
                      <button className="w-full py-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all font-black text-sm">تنزيل تقرير التحليل</button>
                   </div>

                   <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-black text-gray-900 mb-6 font-black capitalize">توزيع الدرجات</h3>
                      <div className="h-[200px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { name: '0-50', count: 2 },
                              { name: '50-70', count: 5 },
                              { name: '70-90', count: 12 },
                              { name: '90-100', count: 8 },
                            ]}>
                               <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
