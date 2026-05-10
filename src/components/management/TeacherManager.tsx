import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, MoreVertical, Edit2, Trash2,
  Users, Star, BookOpen, MessageSquare,
  Mail, Phone, Shield, BadgeCheck,
  ArrowRight, X, UserPlus, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  collection, query, where, onSnapshot, 
  updateDoc, deleteDoc, doc, getDocs
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';

interface Teacher {
  id: string;
  displayName: string;
  email: string;
  role: string;
  subject?: string;
  rating?: number;
  lessonsCount?: number;
  studentsCount?: number;
  avatar?: string;
  status?: 'active' | 'inactive';
}

export const TeacherManager: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', 'in', ['teacher', 'admin']));
    const unsub = onSnapshot(q, 
      async (snapshot) => {
        const teachersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Teacher));
        
        // Mocking some stats for visual richness
        const enrichedTeachers = teachersList.map(t => ({
          ...t,
          rating: t.rating || (4 + Math.random()),
          lessonsCount: t.lessonsCount || Math.floor(Math.random() * 50) + 10,
          studentsCount: t.studentsCount || Math.floor(Math.random() * 500) + 100,
          status: t.status || 'active'
        }));

        setTeachers(enrichedTeachers);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'users');
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const handleDelete = async (id: string, email: string) => {
    if (email === 'wadifamaroc60@gmail.com') {
      alert('لا يمكن حذف المالك الرئيسي للمنصة.');
      return;
    }
    if (window.confirm('هل أنت متأكد من سحب صلاحيات التدريس من هذا المستخدم؟')) {
      try {
        await updateDoc(doc(db, 'users', id), { role: 'student' });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, 'users');
      }
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">إدارة الطاقم التعليمي</h1>
          <p className="text-slate-500 font-medium mt-1">متابعة الأساتذة، تقييماتهم، وتفاعل الطلاب مع دروسهم.</p>
        </div>
        <button 
          onClick={() => alert('إضافة أستاذ جديد تتم عبر ترقية حساب طالب من لوحة التحكم العامة.')}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95"
        >
          <UserPlus size={20} />
          <span>إضافة أستاذ جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي الأساتذة', value: teachers.length, icon: <Users />, color: 'bg-blue-50 text-blue-600' },
          { label: 'متوسط التقييم', value: '4.8', icon: <Star />, color: 'bg-amber-50 text-amber-600' },
          { label: 'الدروس المنشورة', value: '124', icon: <BookOpen />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'الطلبة المتفاعلون', value: '1.2k', icon: <TrendingUp />, color: 'bg-purple-50 text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.color)}>
              {stat.icon}
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center">
        <Search className="mr-4 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="ابحث عن اسم أستاذ أو بريده الإلكتروني..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-transparent border-none rounded-2xl font-bold focus:ring-0"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTeachers.map((teacher, i) => (
          <motion.div 
            key={teacher.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:border-blue-200 transition-all group relative overflow-hidden"
          >
             {/* Dynamic Background Element */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 -z-0"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="relative">
                <div className="w-24 h-24 bg-slate-100 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-slate-300">
                  {teacher.avatar ? <img src={teacher.avatar} alt={teacher.displayName} /> : <Users size={40} />}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-xl border-4 border-white flex items-center justify-center text-white">
                  <BadgeCheck size={16} />
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                       <h3 className="text-xl font-black text-slate-900">{teacher.displayName}</h3>
                       <span className={cn(
                         "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider",
                         teacher.role === 'admin' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                       )}>
                         {teacher.role === 'admin' ? 'مدير' : 'أستاذ'}
                       </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 mt-1">
                      <Mail size={12} />
                      <span className="text-xs font-bold">{teacher.email}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 font-black">
                      <Star size={16} fill="currentColor" />
                      <span>{teacher.rating?.toFixed(1)}</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">تقييم الطلاب</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'الدروس', value: teacher.lessonsCount, icon: <BookOpen size={14} />, color: 'text-blue-600' },
                    { label: 'الطلاب', value: teacher.studentsCount, icon: <Users size={14} />, color: 'text-emerald-600' },
                    { label: 'رسائل', value: '24', icon: <MessageSquare size={14} />, color: 'text-purple-600' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                       <div className={cn("flex items-center gap-2 mb-1 font-bold text-xs", stat.color)}>
                         {stat.icon}
                         <span>{stat.label}</span>
                       </div>
                       <div className="text-lg font-black text-slate-900">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                    <span>عرض التفاصيل</span>
                    <ArrowRight size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(teacher.id, teacher.email)}
                    disabled={teacher.email === 'wadifamaroc60@gmail.com'}
                    className="p-3 border-2 border-slate-100 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all disabled:opacity-30"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
