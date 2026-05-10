import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Mail, Calendar, 
  MapPin, Award, BookOpen, Trash2, Edit2,
  ChevronRight, ArrowLeft, MoreHorizontal,
  CheckCircle2, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  collection, query, where, onSnapshot, 
  doc, deleteDoc, updateDoc 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';

interface Student {
  id: string;
  displayName: string;
  email: string;
  role: string;
  points: number;
  createdAt: any;
  lastActive?: any;
  avatar?: string;
  status?: 'active' | 'inactive';
}

export const StudentManager: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'student'));
    const unsub = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
        setStudents(data);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'users');
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف حساب هذا المتعلم نهائياً؟')) {
      try {
        await deleteDoc(doc(db, 'users', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'users');
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">سجل المتعلمين</h1>
          <p className="text-slate-500 font-medium mt-1">إدارة بيانات الطلاب، متابعة تقدمهم، والتحقق من حساباتهم.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
           <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-sm shadow-lg shadow-emerald-100">الكل</button>
           <button className="px-6 py-3 text-slate-400 font-bold text-sm hover:text-slate-900 transition-all">النشطون</button>
           <button className="px-6 py-3 text-slate-400 font-bold text-sm hover:text-slate-900 transition-all">غير النشطين</button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'إجمالي المسجلين', value: students.length, icon: <Users size={24} />, color: 'text-blue-600 bg-blue-50' },
          { label: 'متوسط النقاط', value: '1,245 XP', icon: <Award size={24} />, color: 'text-amber-600 bg-amber-50' },
          { label: 'إتمام الدروس', value: '78%', icon: <CheckCircle2 size={24} />, color: 'text-emerald-600 bg-emerald-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 group hover:border-emerald-200 transition-all">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", item.color)}>
              {item.icon}
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full text-right">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="ابحث عن اسم طالب أو بريد إلكتروني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all">
          <Filter size={20} />
          <span>تصفية متقدمة</span>
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المتعلم</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المستوى</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">التحصيل (POINTS)</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ الانضمام</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">إدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="group hover:bg-slate-50/20 transition-all">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black overflow-hidden shadow-sm">
                        {student.avatar ? <img src={student.avatar} alt="" /> : student.displayName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">{student.displayName || 'مستخدم جديد'}</span>
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase">
                      الثالثة إعدادي
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${Math.min((student.points / 5000) * 100, 100)}%` }}
                           className="h-full bg-emerald-500"
                         />
                       </div>
                       <span className="font-black text-slate-700 text-sm">{student.points || 0} XP</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 font-bold text-slate-500 text-sm">
                    {student.createdAt && new Date(student.createdAt).toLocaleDateString('ar-MA')}
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 self-start px-3 py-1 rounded-full w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>نشط الآن</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center justify-end gap-2 pr-4">
                      <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-200 transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
               <Users size={40} />
             </div>
             <div className="font-black text-slate-400">لم يتم العثور على متعلمين بهذا الاسم</div>
          </div>
        )}
      </div>
    </div>
  );
};
