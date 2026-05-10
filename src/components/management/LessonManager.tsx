import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, 
  Edit2, Trash2, Video, FileText, 
  Users, Star, Eye, Calendar,
  ArrowRight, ArrowLeft, Check, X,
  LayoutGrid, List, BookOpen,
  Image as ImageIcon, Link as LinkIcon, 
  Sparkles, MessageCircle, HelpCircle,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  collection, onSnapshot, addDoc, 
  updateDoc, deleteDoc, doc, 
  serverTimestamp, query, orderBy 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';

interface Lesson {
  id: string;
  title: string;
  description: string;
  teacher: string;
  level: string;
  subject: string;
  type: 'video' | 'pdf' | 'document' | 'smart';
  url: string;
  media?: {
    type: 'video' | 'image' | 'local-video';
    url: string;
    title: string;
  }[];
  questions?: {
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
  views: number;
  rating: number;
  createdAt: any;
}

export const LessonManager: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    teacher: '',
    level: 'السنة الثالثة إعدادي',
    subject: 'اللغة العربية',
    type: 'video',
    url: '',
    media: [],
    questions: []
  });

  useEffect(() => {
    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
        setLessons(data);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'courses');
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        await updateDoc(doc(db, 'courses', editingLesson.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'courses'), {
          ...formData,
          views: 0,
          rating: 4.5,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      setEditingLesson(null);
      setFormData({
        title: '',
        description: '',
        teacher: '',
        level: 'السنة الثالثة إعدادي',
        subject: 'اللغة العربية',
        type: 'video',
        url: '',
        media: [],
        questions: []
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'courses');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
      try {
        await deleteDoc(doc(db, 'courses', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'courses');
      }
    }
  };

  const filteredLessons = lessons.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">إدارة المحتوى التعليمي</h1>
          <p className="text-slate-500 font-medium mt-1">عرض وتنظيم الدروس والمواد التعليمية المتاحة.</p>
        </div>
        <button 
          onClick={() => {
            setEditingLesson(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:-translate-y-1 active:scale-95"
        >
          <Plus size={20} />
          <span>إضافة درس جديد</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="ابحث عن درس، مادة، أو أستاذ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setViewMode('list')}
            className={cn("p-3 rounded-xl transition-all", viewMode === 'list' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-slate-50 text-slate-400 hover:bg-slate-100")}
          >
            <List size={20} />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-3 rounded-xl transition-all", viewMode === 'grid' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-slate-50 text-slate-400 hover:bg-slate-100")}
          >
            <LayoutGrid size={20} />
          </button>
          <div className="w-px h-8 bg-slate-100 mx-2 hidden md:block"></div>
          <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold">جاري تحميل الدروس...</p>
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <BookOpen size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900">لا توجد دروس حالياً</h3>
          <p className="text-slate-400 font-medium mt-2">ابدأ بإضافة أول درس لمنصتك التعليمية.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLessons.map((lesson) => (
            <motion.div 
              key={lesson.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-emerald-200 transition-all shadow-sm hover:shadow-xl group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={() => {
                    setEditingLesson(lesson);
                    setFormData({
                      title: lesson.title,
                      description: lesson.description,
                      teacher: lesson.teacher,
                      level: lesson.level,
                      subject: lesson.subject,
                      type: lesson.type,
                      url: lesson.url,
                      media: lesson.media || [],
                      questions: lesson.questions || []
                    });
                    setIsModalOpen(true);
                  }}
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-lg"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(lesson.id)}
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="w-full aspect-video bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-slate-300 relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                {lesson.type === 'video' ? <Video size={48} /> : <FileText size={48} />}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-black text-sm">عرض التفاصيل</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg tracking-wider uppercase">
                    {lesson.subject}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star size={12} fill="currentColor" />
                    <span>{lesson.rating}</span>
                  </div>
                </div>
                <h3 className="font-black text-slate-900 line-clamp-1">{lesson.title}</h3>
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Users size={14} />
                  </div>
                  <span className="text-xs font-bold text-slate-500">{lesson.teacher}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px]">
                    <Eye size={12} />
                    <span>{lesson.views} مشاهدة</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px]">
                    <Calendar size={12} />
                    <span>{lesson.createdAt && new Date(lesson.createdAt.toDate ? lesson.createdAt.toDate() : lesson.createdAt).toLocaleDateString('ar-MA')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">الدرس</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">الأستاذ / المادة</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">المستوى</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">التفاعل</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLessons.map((lesson) => (
                <tr key={lesson.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                        {lesson.type === 'video' ? <Video size={20} /> : <FileText size={20} />}
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{lesson.title}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{lesson.type} • {lesson.description.substring(0, 30)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{lesson.teacher}</span>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 self-start px-2 py-0.5 rounded-md mt-1">{lesson.subject}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden lg:table-cell">
                    <span className="text-sm font-bold text-slate-500">{lesson.level}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <div className="text-sm font-black text-slate-900">{lesson.views}</div>
                        <div className="text-[10px] font-bold text-slate-400">مشاهدة</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-black text-emerald-600 flex items-center justify-center gap-1">
                          <Star size={10} fill="currentColor" />
                          {lesson.rating}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400">تقييم</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                         onClick={() => {
                          setEditingLesson(lesson);
                          setFormData({
                            title: lesson.title,
                            description: lesson.description,
                            teacher: lesson.teacher,
                            level: lesson.level,
                            subject: lesson.subject,
                            type: lesson.type as any,
                            url: lesson.url,
                            media: lesson.media || [],
                            questions: lesson.questions || []
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-2 hover:bg-emerald-50 text-emerald-500 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(lesson.id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden border border-white/20"
            >
              <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black">{editingLesson ? 'تعديل الدرس' : 'إضافة درس جديد'}</h3>
                  <p className="text-slate-400 text-sm font-bold mt-1">يرجى ملء جميع البيانات المطلوبة بدقة.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full space-y-2">
                    <label className="text-sm font-black text-slate-700 block mr-2">عنوان الدرس</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-slate-900 transition-all"
                      placeholder="أدخل عنواناً جذاباً للدرس..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 block mr-2">اسم الأستاذ</label>
                    <input 
                      required
                      type="text" 
                      value={formData.teacher}
                      onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-slate-900 transition-all"
                      placeholder="اسم المحاضر..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 block mr-2">المادة</label>
                    <select 
                       value={formData.subject}
                       onChange={(e) => setFormData({...formData, subject: e.target.value})}
                       className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-slate-900 transition-all appearance-none"
                    >
                      <option>اللغة العربية</option>
                      <option>التربية الإسلامية</option>
                      <option>الاجتماعيات</option>
                      <option>الفلسفة</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 block mr-2">المستوى الدراسي</label>
                    <select 
                       value={formData.level}
                       onChange={(e) => setFormData({...formData, level: e.target.value})}
                       className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-slate-900 transition-all appearance-none"
                    >
                      <option>الأولى إعدادي</option>
                      <option>الثانية إعدادي</option>
                      <option>الثالثة إعدادي</option>
                      <option>الجذع المشترك</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 block mr-2">نوع المحتوى</label>
                    <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl">
                      {(['video', 'pdf', 'smart'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({...formData, type: t})}
                          className={cn(
                            "flex-1 py-3 rounded-xl font-black text-xs transition-all",
                            formData.type === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          {t === 'video' ? 'فيديو' : t === 'pdf' ? 'ملف PDF' : 'درس ذكي'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.type !== 'smart' && (
                    <div className="col-span-full space-y-2">
                      <label className="text-sm font-black text-slate-700 block mr-2">رابط المحتوى (URL)</label>
                      <input 
                        required
                        type="url" 
                        value={formData.url}
                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-slate-900 transition-all text-left"
                        placeholder="https://..."
                        dir="ltr"
                      />
                    </div>
                  )}

                  {formData.type === 'smart' && (
                    <div className="col-span-full space-y-8 py-6 border-y border-slate-100">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-slate-900 flex items-center gap-2">
                             <Video size={18} className="text-blue-500" />
                             الوسائط المتعددة (فيديو / صور)
                          </h4>
                          <div className="flex gap-2">
                             <button 
                               type="button"
                               onClick={() => setFormData({
                                 ...formData, 
                                 media: [...(formData.media || []), { type: 'video', url: '', title: '' }]
                               })}
                               className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg hover:bg-blue-100"
                             >+ فيديو YouTube</button>
                             <button 
                               type="button"
                               onClick={() => setFormData({
                                 ...formData, 
                                 media: [...(formData.media || []), { type: 'image', url: '', title: '' }]
                               })}
                               className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg hover:bg-emerald-100"
                             >+ صورة</button>
                             <button 
                               type="button"
                               onClick={() => {
                                 const url = prompt('أدخل رابط الفيديو المباشر أو مسار الملف:');
                                 if (url) {
                                   setFormData({
                                     ...formData, 
                                     media: [...(formData.media || []), { type: 'local-video', url: url, title: '' }]
                                   });
                                 }
                               }}
                               className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black rounded-lg hover:bg-purple-100"
                             >+ فيديو محلي</button>
                          </div>
                        </div>

                        <div className="space-y-4">
                           {formData.media?.map((m, idx) => (
                             <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group animate-in slide-in-from-right-4">
                                <button 
                                  type="button"
                                  onClick={() => setFormData({
                                    ...formData, 
                                    media: formData.media?.filter((_, i) => i !== idx)
                                  })}
                                  className="absolute top-2 left-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={16} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div className="space-y-1">
                                      <label className="text-[10px] font-black text-slate-400">العنوان التوضيحي</label>
                                      <input 
                                        type="text" 
                                        value={m.title}
                                        onChange={(e) => {
                                          const newMedia = [...(formData.media || [])];
                                          newMedia[idx].title = e.target.value;
                                          setFormData({...formData, media: newMedia});
                                        }}
                                        className="w-full bg-white border-none rounded-xl text-xs font-bold p-2 px-3"
                                        placeholder="مثلاً: شرح الهمزة المتوسطة"
                                      />
                                   </div>
                                   <div className="space-y-1">
                                      <label className="text-[10px] font-black text-slate-400">الرابط / المسار</label>
                                      <input 
                                        type="text" 
                                        value={m.url}
                                        onChange={(e) => {
                                          const newMedia = [...(formData.media || [])];
                                          newMedia[idx].url = e.target.value;
                                          setFormData({...formData, media: newMedia});
                                        }}
                                        className="w-full bg-white border-none rounded-xl text-xs font-bold p-2 px-3 text-left"
                                        dir="ltr"
                                        placeholder="https://..."
                                      />
                                   </div>
                                </div>
                             </div>
                           ))}
                           {formData.media?.length === 0 && (
                             <div className="text-center py-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100 text-slate-400 text-sm font-bold">
                                لا توجد وسائط مضافة حالياً.
                             </div>
                           )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-slate-900 flex items-center gap-2">
                             <HelpCircle size={18} className="text-amber-500" />
                             الأنشطة التفاعلية (أسئلة)
                          </h4>
                          <button 
                            type="button"
                            onClick={() => setFormData({
                              ...formData, 
                              questions: [...(formData.questions || []), { text: '', options: ['', '', ''], correctAnswer: 0, explanation: '' }]
                            })}
                            className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-xs font-black shadow-sm"
                          >+ إضافة سؤال</button>
                        </div>
                        
                        <div className="space-y-6">
                           {formData.questions?.map((q, idx) => (
                             <div key={idx} className="bg-amber-50/30 p-6 rounded-[2rem] border border-amber-100 relative group">
                                <button 
                                  type="button"
                                  onClick={() => setFormData({
                                    ...formData, 
                                    questions: formData.questions?.filter((_, i) => i !== idx)
                                  })}
                                  className="absolute top-4 left-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={18} />
                                </button>
                                <div className="space-y-4">
                                   <input 
                                     placeholder="نص السؤال..."
                                     value={q.text}
                                     onChange={(e) => {
                                       const newQs = [...(formData.questions || [])];
                                       newQs[idx].text = e.target.value;
                                       setFormData({...formData, questions: newQs});
                                     }}
                                     className="w-full bg-white border-none rounded-xl font-bold p-3 px-4 shadow-sm"
                                   />
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                      {q.options.map((opt, oIdx) => (
                                        <input 
                                          key={oIdx}
                                          placeholder={`خيار ${oIdx + 1}`}
                                          value={opt}
                                          onChange={(e) => {
                                            const newQs = [...(formData.questions || [])];
                                            newQs[idx].options[oIdx] = e.target.value;
                                            setFormData({...formData, questions: newQs});
                                          }}
                                          className={cn(
                                            "bg-white border-2 rounded-xl text-xs font-bold p-2 px-3 transition-all",
                                            q.correctAnswer === oIdx ? "border-emerald-500" : "border-transparent"
                                          )}
                                          onClick={() => {
                                            const newQs = [...(formData.questions || [])];
                                            newQs[idx].correctAnswer = oIdx;
                                            setFormData({...formData, questions: newQs});
                                          }}
                                        />
                                      ))}
                                   </div>
                                   <textarea 
                                      placeholder="شرح الإجابة الصحيحة..."
                                      value={q.explanation}
                                      onChange={(e) => {
                                        const newQs = [...(formData.questions || [])];
                                        newQs[idx].explanation = e.target.value;
                                        setFormData({...formData, questions: newQs});
                                      }}
                                      className="w-full bg-white/50 border-none rounded-xl text-xs font-medium p-3 px-4 resize-none"
                                      rows={2}
                                   />
                                </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="col-span-full space-y-2">
                    <label className="text-sm font-black text-slate-700 block mr-2">وصف الدرس</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-slate-900 transition-all resize-none"
                      placeholder="اكتب نبذة قصيرة عن محتوى الدرس وأهدافه..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all"
                  >
                    {editingLesson ? 'حفظ التعديلات' : 'نشر الدرس الآن'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
