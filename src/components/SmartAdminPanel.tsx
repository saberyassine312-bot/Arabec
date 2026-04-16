import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  orderBy, 
  where,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Plus, 
  History, 
  Upload, 
  FileText, 
  Video, 
  Archive, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft,
  MoreVertical,
  ArrowRight,
  Save,
  X,
  Clock,
  User,
  Shield,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LessonVersion {
  id: string;
  lessonId: string;
  content: string;
  videoUrl?: string;
  fileUrl?: string;
  versionNumber: number;
  createdAt: any;
  createdBy: string;
  adminName: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string;
  status: 'active' | 'archived';
  currentVersionId: string;
  updatedAt: any;
}

interface AdminLog {
  id: string;
  action: string;
  targetId: string;
  targetType: string;
  timestamp: any;
  adminId: string;
  adminName: string;
}

const SmartAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'upload' | 'logs' | 'versions'>('lessons');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [versions, setVersions] = useState<LessonVersion[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form States
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDesc, setNewLessonDesc] = useState('');
  const [newLessonLevel, setNewLessonLevel] = useState('السنة الأولى');
  const [lessonContent, setLessonContent] = useState('');

  const adminEmail = 'wadifamaroc60@gmail.com';
  const isAdmin = auth.currentUser?.email === adminEmail;

  useEffect(() => {
    if (isAdmin) {
      fetchLessons();
      fetchLogs();
    }
  }, [isAdmin]);

  const fetchLessons = async () => {
    try {
      const q = query(collection(db, 'lessons'), orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);
      const lessonsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Lesson[];
      setLessons(lessonsData);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'lessons');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const q = query(collection(db, 'admin_logs'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const logsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AdminLog[];
      setLogs(logsData);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'admin_logs');
    }
  };

  const fetchVersions = async (lessonId: string) => {
    try {
      const q = query(
        collection(db, 'lesson_versions'), 
        where('lessonId', '==', lessonId),
        orderBy('versionNumber', 'desc')
      );
      const snapshot = await getDocs(q);
      const versionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LessonVersion[];
      setVersions(versionsData);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'lesson_versions');
    }
  };

  const logAction = async (action: string, targetId: string, targetType: string) => {
    try {
      await addDoc(collection(db, 'admin_logs'), {
        action,
        targetId,
        targetType,
        timestamp: serverTimestamp(),
        adminId: auth.currentUser?.uid,
        adminName: auth.currentUser?.displayName || 'Admin'
      });
      fetchLogs();
    } catch (error) {
      console.error("Error logging action:", error);
    }
  };

  const handleCreateLesson = async () => {
    if (!newLessonTitle) return;
    try {
      setLoading(true);
      const lessonRef = await addDoc(collection(db, 'lessons'), {
        title: newLessonTitle,
        description: newLessonDesc,
        level: newLessonLevel,
        status: 'active',
        currentVersionId: '',
        updatedAt: serverTimestamp()
      });

      // Create initial version
      const versionRef = await addDoc(collection(db, 'lesson_versions'), {
        lessonId: lessonRef.id,
        content: lessonContent,
        versionNumber: 1,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid,
        adminName: auth.currentUser?.displayName || 'Admin'
      });

      await updateDoc(doc(db, 'lessons', lessonRef.id), {
        currentVersionId: versionRef.id
      });

      await logAction('انشاء درس جديد', lessonRef.id, 'lesson');
      
      setNewLessonTitle('');
      setNewLessonDesc('');
      setLessonContent('');
      fetchLessons();
      setActiveTab('lessons');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLesson = async () => {
    if (!selectedLesson || !lessonContent) return;
    try {
      setLoading(true);
      
      // Get latest version number
      const q = query(
        collection(db, 'lesson_versions'), 
        where('lessonId', '==', selectedLesson.id),
        orderBy('versionNumber', 'desc')
      );
      const snapshot = await getDocs(q);
      const lastVersion = snapshot.docs[0]?.data()?.versionNumber || 0;

      // Create new version (Non-destructive)
      const versionRef = await addDoc(collection(db, 'lesson_versions'), {
        lessonId: selectedLesson.id,
        content: lessonContent,
        versionNumber: lastVersion + 1,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid,
        adminName: auth.currentUser?.displayName || 'Admin'
      });

      // Update main lesson reference
      await updateDoc(doc(db, 'lessons', selectedLesson.id), {
        currentVersionId: versionRef.id,
        updatedAt: serverTimestamp()
      });

      await logAction('تحديث نسخة الدرس', selectedLesson.id, 'lesson');
      
      setIsEditing(false);
      fetchLessons();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveLesson = async (lessonId: string) => {
    if (!window.confirm('هل أنت متأكد من أرشفة هذا الدرس؟ لن يتم حذفه نهائياً.')) return;
    try {
      await updateDoc(doc(db, 'lessons', lessonId), {
        status: 'archived',
        updatedAt: serverTimestamp()
      });
      await logAction('أرشفة درس', lessonId, 'lesson');
      fetchLessons();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'lessons');
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md">
          <Shield size={64} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-black text-gray-900 mb-4">وصول غير مصرح به</h2>
          <p className="text-gray-500 mb-8">عذراً، هذه اللوحة مخصصة لمديري المنصة فقط. يرجى تسجيل الدخول بحساب المدير.</p>
          <button onClick={() => window.location.href = '/'} className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all">العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-l border-gray-100 p-6 flex flex-col gap-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-200">ل</div>
          <div className="font-black text-xl text-gray-900">لوحة التحكم الذكية</div>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('lessons')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all",
              activeTab === 'lessons' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-gray-500 hover:bg-emerald-50"
            )}
          >
            <LayoutDashboard size={20} />
            <span>إدارة الدروس</span>
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all",
              activeTab === 'upload' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-gray-500 hover:bg-emerald-50"
            )}
          >
            <Plus size={20} />
            <span>إضافة درس جديد</span>
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all",
              activeTab === 'logs' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-gray-500 hover:bg-emerald-50"
            )}
          >
            <Activity size={20} />
            <span>سجل العمليات</span>
          </button>
        </nav>

        <div className="mt-auto p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-3 mb-3">
            <Shield size={20} className="text-emerald-600" />
            <span className="text-sm font-black text-emerald-900">وضع المدير</span>
          </div>
          <p className="text-[10px] text-emerald-700 font-bold leading-relaxed">جميع التعديلات يتم حفظها كنسخ جديدة للحفاظ على سلامة البيانات.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              {activeTab === 'lessons' && "إدارة الدروس"}
              {activeTab === 'upload' && "رفع ونشر محتوى جديد"}
              {activeTab === 'logs' && "سجل النشاط الإداري"}
              {activeTab === 'versions' && `نسخ الدرس: ${selectedLesson?.title}`}
            </h1>
            <p className="text-gray-500 mt-1">نظام إدارة المحتوى غير التدميري (Non-destructive CMS)</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-left">
              <div className="text-sm font-black text-gray-900">{auth.currentUser?.displayName}</div>
              <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Super Admin</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xl border-2 border-white shadow-sm">
              {auth.currentUser?.displayName?.[0]}
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'lessons' && (
            <motion.div 
              key="lessons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className={cn(
                    "bg-white p-6 rounded-[2.5rem] border shadow-sm transition-all group",
                    lesson.status === 'archived' ? "opacity-60 border-gray-100" : "border-gray-100 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                        lesson.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                      )}>
                        {lesson.status === 'active' ? 'نشط' : 'مؤرشف'}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setActiveTab('versions');
                            fetchVersions(lesson.id);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="تاريخ النسخ"
                        >
                          <History size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setIsEditing(true);
                            // Fetch current version content
                            const fetchContent = async () => {
                              const vDoc = await getDoc(doc(db, 'lesson_versions', lesson.currentVersionId));
                              if (vDoc.exists()) setLessonContent(vDoc.data().content);
                            };
                            fetchContent();
                          }}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          title="تعديل"
                        >
                          <FileText size={18} />
                        </button>
                        <button 
                          onClick={() => handleArchiveLesson(lesson.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="أرشفة"
                        >
                          <Archive size={18} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">{lesson.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">{lesson.description}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="text-[10px] font-bold text-gray-400">
                        آخر تحديث: {lesson.updatedAt?.toDate().toLocaleDateString('ar-EG')}
                      </div>
                      <div className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-500">
                        {lesson.level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl">
                <div className="grid gap-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700 px-2">عنوان الدرس</label>
                      <input 
                        type="text" 
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                        placeholder="مثال: المبتدأ والخبر"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700 px-2">المستوى الدراسي</label>
                      <select 
                        value={newLessonLevel}
                        onChange={(e) => setNewLessonLevel(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold appearance-none"
                      >
                        <option>السنة الأولى</option>
                        <option>السنة الثانية</option>
                        <option>السنة الثالثة</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 px-2">وصف مختصر</label>
                    <textarea 
                      value={newLessonDesc}
                      onChange={(e) => setNewLessonDesc(e.target.value)}
                      placeholder="اكتب وصفاً موجزاً لمحتوى الدرس..."
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold h-32 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 px-2">محتوى الدرس (نصي)</label>
                    <textarea 
                      value={lessonContent}
                      onChange={(e) => setLessonContent(e.target.value)}
                      placeholder="اكتب محتوى الدرس هنا..."
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold h-64 resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:border-emerald-200 transition-all cursor-pointer group">
                      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Video size={32} />
                      </div>
                      <div className="text-center">
                        <div className="font-black text-gray-900">رفع فيديو الدرس</div>
                        <div className="text-xs text-gray-400 font-bold">MP4, MOV (Max 500MB)</div>
                      </div>
                    </div>
                    <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:border-emerald-200 transition-all cursor-pointer group">
                      <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText size={32} />
                      </div>
                      <div className="text-center">
                        <div className="font-black text-gray-900">رفع ملفات PDF</div>
                        <div className="text-xs text-gray-400 font-bold">PDF, DOCX (Max 50MB)</div>
                      </div>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span className="text-emerald-600">جاري الرفع...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-6">
                    <button 
                      onClick={handleCreateLesson}
                      disabled={loading || !newLessonTitle}
                      className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      <Save size={24} />
                      <span>نشر الدرس الآن</span>
                    </button>
                    <button 
                      onClick={simulateUpload}
                      className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black hover:bg-gray-200 transition-all"
                    >
                      اختبار الرفع
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div 
              key="logs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">سجل النشاط الإداري</h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                  <Clock size={18} />
                  <span>تحديث تلقائي</span>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {logs.map((log) => (
                  <div key={log.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                        <Activity size={24} />
                      </div>
                      <div>
                        <div className="font-black text-gray-900">{log.action}</div>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          <span>{log.targetType}: {log.targetId}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span>{log.adminName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-black text-gray-900">
                        {log.timestamp?.toDate().toLocaleTimeString('ar-EG')}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold">
                        {log.timestamp?.toDate().toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'versions' && (
            <motion.div 
              key="versions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setActiveTab('lessons')}
                className="flex items-center gap-2 text-emerald-600 font-black hover:gap-4 transition-all"
              >
                <ArrowRight size={20} />
                <span>العودة لقائمة الدروس</span>
              </button>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                  {versions.map((v) => (
                    <div 
                      key={v.id} 
                      className={cn(
                        "p-6 rounded-3xl border transition-all cursor-pointer",
                        selectedLesson?.currentVersionId === v.id 
                          ? "bg-emerald-50 border-emerald-200 shadow-md" 
                          : "bg-white border-gray-100 hover:border-emerald-100"
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                          نسخة #{v.versionNumber}
                        </span>
                        {selectedLesson?.currentVersionId === v.id && (
                          <CheckCircle size={16} className="text-emerald-600" />
                        )}
                      </div>
                      <div className="text-sm font-bold text-gray-900 mb-2">بواسطة: {v.adminName}</div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                        <Clock size={14} />
                        {v.createdAt?.toDate().toLocaleString('ar-EG')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl">
                  <h3 className="text-2xl font-black text-gray-900 mb-8">محتوى النسخة الحالية</h3>
                  <div className="prose prose-emerald max-w-none">
                    <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 font-bold text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {versions.find(v => v.id === selectedLesson?.currentVersionId)?.content || 'لا يوجد محتوى متاح'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditing(false)}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">تعديل الدرس: {selectedLesson?.title}</h3>
                    <p className="text-sm text-emerald-600 font-bold mt-1">سيتم حفظ التعديلات كنسخة جديدة (Non-destructive)</p>
                  </div>
                  <button onClick={() => setIsEditing(false)} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 transition-all">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-8 overflow-y-auto flex-1 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 px-2">محتوى الدرس</label>
                    <textarea 
                      value={lessonContent}
                      onChange={(e) => setLessonContent(e.target.value)}
                      className="w-full h-96 px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold resize-none"
                    />
                  </div>
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                  <button 
                    onClick={handleUpdateLesson}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-3"
                  >
                    <Save size={24} />
                    <span>حفظ كنسخة جديدة</span>
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-10 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black hover:bg-gray-100 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SmartAdminPanel;
