import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Calendar, Clock, Users, Plus, 
  ExternalLink, Trash2, Edit, CheckCircle, 
  AlertCircle, Timer, ChevronRight, Bell,
  VideoOff, Star, MessageSquare, ShieldCheck,
  History as LucideHistory, MapPin, 
  MoreVertical, Share2, UserCheck, 
  BarChart3, Mic, Camera, Monitor, 
  LayoutDashboard, Search, Filter,
  ArrowRight, ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db, auth } from '../lib/firebase';
import { 
  collection, query, onSnapshot, addDoc, 
  deleteDoc, doc, updateDoc, serverTimestamp,
  orderBy, where
} from 'firebase/firestore';

interface LiveSession {
  id: string;
  title: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  dateTime: string;
  duration: number;
  meetLink: string;
  status: 'upcoming' | 'live' | 'ended';
  targetLevel: string;
  participantsCount?: number;
}

export const RemoteCommunicationDashboard: React.FC<{ user: any }> = ({ user }) => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('all');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);
  
  const isTeacher = user?.email === 'wadifamaroc60@gmail.com' || user?.role === 'teacher';

  const [newSession, setNewSession] = useState({
    title: '',
    date: '',
    time: '',
    duration: 45,
    subject: 'اللغة العربية',
    targetLevel: 'السنة الثالثة إعدادي'
  });

  useEffect(() => {
    const q = query(
      collection(db, 'liveSessions'), 
      orderBy('dateTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const sessionData = doc.data() as any;
        const start = new Date(sessionData.dateTime).getTime();
        const end = start + (sessionData.duration || 45) * 60000;
        const current = now.getTime();

        let status = sessionData.status;
        if (current < start) status = 'upcoming';
        else if (current >= start && current <= end) status = 'live';
        else status = 'ended';

        return {
          id: doc.id,
          ...sessionData,
          status
        };
      }) as LiveSession[];
      setSessions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [now]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateTime = `${newSession.date}T${newSession.time}`;
      const meetId = Math.random().toString(36).substring(2, 5) + '-' + 
                     Math.random().toString(36).substring(2, 6) + '-' + 
                     Math.random().toString(36).substring(2, 5);
      
      const sessionData = {
        title: newSession.title,
        teacherId: user.uid,
        teacherName: user.displayName || 'أستاذ المادة',
        subject: newSession.subject,
        dateTime,
        duration: newSession.duration,
        meetLink: `https://meet.google.com/${meetId}`,
        status: 'upcoming',
        targetLevel: newSession.targetLevel,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'liveSessions'), sessionData);
      setIsModalOpen(false);
      setNewSession({
        title: '',
        date: '',
        time: '',
        duration: 45,
        subject: 'اللغة العربية',
        targetLevel: 'السنة الثالثة إعدادي'
      });
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الحصة؟')) {
      try {
        await deleteDoc(doc(db, 'liveSessions', id));
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'live': return { text: 'مباشر الآن', color: 'bg-red-600' };
      case 'upcoming': return { text: 'قادمة', color: 'bg-emerald-600' };
      case 'ended': return { text: 'منتهية', color: 'bg-gray-500' };
      default: return { text: 'غير محدد', color: 'bg-gray-400' };
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (activeTab === 'upcoming') return session.status !== 'ended';
    if (activeTab === 'past') return session.status === 'ended';
    return true;
  });

  const stats = {
    total: sessions.length,
    upcoming: sessions.filter(s => s.status === 'upcoming').length,
    live: sessions.filter(s => s.status === 'live').length,
    totalHours: sessions.reduce((acc, s) => acc + (s.duration / 60), 0).toFixed(1)
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-8 px-4 lg:px-8 font-sans rtl" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <div className="p-1.5 bg-emerald-100 rounded-lg">
                <Video size={16} />
              </div>
              <span className="text-sm">مركز التواصل المباشر</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 leading-tight">التواصل عن بعد</h1>
            <p className="text-slate-500 max-w-lg font-medium text-lg italic">
              "العلم يؤتى ولا يأتي.. والحوار المباشر جسر العبور نحو المعرفة."
            </p>
          </div>

            <div className="flex flex-wrap gap-3">
            <button 
                onClick={() => window.open('https://meet.google.com/new', '_blank')}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 group"
              >
                <Video size={24} className="text-emerald-400" />
                <span>دخول Meet فوري</span>
              </button>
            {isTeacher && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 group"
              >
                <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>جدول حصة</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {[
            { label: 'إجمالي الحصص', value: stats.total, icon: <LayoutDashboard />, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'حصص قادمة', value: stats.upcoming, icon: <Calendar />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'مباشر الآن', value: stats.live, icon: <Video />, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'ساعات البث', value: stats.totalHours, icon: <BarChart3 />, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                {stat.icon}
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-black text-slate-900">{stat.value}</span>
                <p className="text-sm font-bold text-slate-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Interface Group */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Filter & List */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tabs & Search */}
            <div className="bg-white p-2 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-4">
              <div className="flex p-1 bg-slate-50 rounded-xl gap-1 w-full md:w-auto overflow-x-auto">
                {(['all', 'upcoming', 'past'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-6 py-2.5 rounded-lg text-sm font-black transition-all whitespace-nowrap",
                      activeTab === tab ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {tab === 'all' ? 'جميع الحصص' : tab === 'upcoming' ? 'الحصص القادمة' : 'السجل السابق'}
                  </button>
                ))}
              </div>
              
              <div className="relative flex-1 group w-full">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="ابحث عن حصة أو أستاذ..."
                  className="w-full bg-slate-50 border-none rounded-xl py-3 pr-11 pl-4 outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold transition-all"
                />
              </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session, i) => (
                    <motion.div
                      layout
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        "group bg-white p-6 rounded-[2.5rem] border-2 transition-all relative overflow-hidden",
                        session.status === 'live' 
                          ? "border-emerald-500 shadow-2xl shadow-emerald-50 ring-4 ring-emerald-500/5" 
                          : "border-slate-50 shadow-sm hover:shadow-xl hover:border-emerald-100"
                      )}
                    >
                      {/* Decorative Background for Live */}
                      {session.status === 'live' && (
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
                      )}

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-start gap-6">
                          {/* Left: Icon or Teacher Avatar */}
                          <div className={cn(
                            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-lg relative",
                            session.status === 'live' ? "bg-emerald-600 text-white animate-pulse" : "bg-slate-50 text-slate-400"
                          )}>
                            <Video size={32} />
                            {session.status === 'live' && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>

                          {/* Middle: Info */}
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                                {session.title}
                              </h3>
                              <span className={cn(
                                "text-[10px] font-black px-3 py-1 rounded-full text-white uppercase tracking-wider",
                                getStatusLabel(session.status).color
                              )}>
                                {getStatusLabel(session.status).text}
                              </span>
                              <span className="text-[10px] font-black px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                                {session.targetLevel}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-slate-400">
                              <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-emerald-500/60" />
                                <span>{new Date(session.dateTime).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-emerald-500/60" />
                                <span>{new Date(session.dateTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <UserCheck size={16} className="text-emerald-500/60" />
                                <span>{session.teacherName}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                          {session.status === 'upcoming' && (
                            <div className="text-center md:text-left px-4">
                              <span className="text-[10px] font-black text-slate-300 block mb-1">وقت الحصة</span>
                              <div className="flex items-center gap-2 text-emerald-600 font-mono font-black text-xl">
                                <span>{new Date(session.dateTime).getHours().toString().padStart(2, '0')}:</span>
                                <span>{new Date(session.dateTime).getMinutes().toString().padStart(2, '0')}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {isTeacher && (
                              <>
                                <button 
                                  onClick={() => handleDeleteSession(session.id)}
                                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                  title="حذف الحصة"
                                >
                                  <Trash2 size={20} />
                                </button>
                                <button 
                                  className="p-3 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                  title="تعديل"
                                >
                                  <Edit size={20} />
                                </button>
                              </>
                            )}
                            
                            <a 
                              href={session.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                "px-8 py-4 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg",
                                session.status === 'live' 
                                  ? "bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700" 
                                  : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                              )}
                              onClick={(e) => session.status !== 'live' && e.preventDefault()}
                            >
                              <ExternalLink size={20} />
                              <span>انضم للحصة</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-slate-100 text-center"
                  >
                    <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Video size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-400">لا توجد حصص متاحة في هذا القسم</h3>
                    <p className="text-slate-400 mt-2 font-medium">ابدأ بجدولة حصصك التعليمية لتبدأ التواصل المباشر.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Calendar & Tips */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Quick Tips */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-black">نصائح الحصة المباشرة</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    'تأكد من استقرار سرعة الإنترنت لديك.',
                    'قم بتجهيز الميكروفون والكاميرا قبل الموعد بـ 5 دقائق.',
                    'استخدم العروض التقديمية التفاعلية لجذب الطلاب.',
                    'شجع الطلاب على طرح الأسئلة عبر الدردشة.'
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-4 group/tip">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 group-hover/tip:bg-emerald-500 transition-colors">
                        <CheckCircle size={14} className="text-emerald-400 group-hover/tip:text-white" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium group-hover/tip:text-white transition-colors">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Student Request Feature (Conceptual) */}
            {!isTeacher && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center">
                  <MessageSquare size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">طلب لقاء فردي</h3>
                  <p className="text-slate-400 font-medium italic">تحتاج لمساعدة خاصة في درس معين؟ يمكنك طلب لقاء فردي مع أستاذك.</p>
                </div>
                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-100">
                  إرسال طلب للأستاذ
                </button>
              </div>
            )}

            {/* Attendance Chart (Conceptual for Teacher) */}
            {isTeacher && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900 text-right">تحليلات الحضور</h3>
                    <p className="text-xs font-bold text-slate-400">آخر 7 حصص مباشرة</p>
                  </div>
                  <BarChart3 size={24} className="text-emerald-500" />
                </div>
                <div className="h-32 flex items-end justify-between gap-2 px-2">
                  {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                    <div key={i} className="flex-1 space-y-2 group cursor-help">
                      <div 
                        className="w-full bg-emerald-100 group-hover:bg-emerald-500 transition-all rounded-lg relative"
                        style={{ height: `${h}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {Math.floor(h * 0.4)} طالب
                        </div>
                      </div>
                      <div className="h-1 w-full bg-slate-50 rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-black text-slate-400">
                  <span>الأسبوع الماضي</span>
                  <span>اليوم</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="text-[10px] font-black text-emerald-700">توقيت الذروة: السبت 18:00</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.1)] overflow-hidden"
              >
                {/* Modal Header */}
                <div className="bg-emerald-600 p-10 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <div className="relative z-10 space-y-2">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                      <Camera size={32} />
                    </div>
                    <h2 className="text-3xl font-black">جدولة حصة جديدة</h2>
                    <p className="text-emerald-100 text-sm font-medium italic opacity-80">
                      سيتم إنشاء رابط Google Meet تلقائياً وإضافته لجدول الطلاب.
                    </p>
                  </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleCreateSession} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 pr-2">عنوان الحصة الدراسية</label>
                    <input 
                      required
                      type="text" 
                      placeholder="مثلاً: مراجعة شاملة لدرس الممنوع من الصرف"
                      className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800"
                      value={newSession.title}
                      onChange={e => setNewSession({...newSession, title: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700 pr-2">التاريخ</label>
                      <input 
                        required
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold"
                        value={newSession.date}
                        onChange={e => setNewSession({...newSession, date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700 pr-2">الوقت</label>
                      <input 
                        required
                        type="time" 
                        className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold"
                        value={newSession.time}
                        onChange={e => setNewSession({...newSession, time: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700 pr-2">المدة (بالدقائق)</label>
                      <select 
                        className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold"
                        value={newSession.duration}
                        onChange={e => setNewSession({...newSession, duration: parseInt(e.target.value)})}
                      >
                        <option value={30}>30 دقيقة</option>
                        <option value={45}>45 دقيقة</option>
                        <option value={60}>60 دقيقة</option>
                        <option value={90}>90 دقيقة</option>
                        <option value={120}>ساعتان</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700 pr-2">الفئة المستهدفة</label>
                      <select 
                        className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold"
                        value={newSession.targetLevel}
                        onChange={e => setNewSession({...newSession, targetLevel: e.target.value})}
                      >
                        <option>السنة الأولى إعدادي</option>
                        <option>السنة الثانية إعدادي</option>
                        <option>السنة الثالثة إعدادي</option>
                        <option>جدع مشترك</option>
                        <option>الأولى بكالوريا</option>
                        <option>الثانية بكالوريا</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="submit"
                      className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black shadow-2xl shadow-slate-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                    >
                      <Video size={24} />
                      تأكيد وحفظ الجدولة
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-10 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
