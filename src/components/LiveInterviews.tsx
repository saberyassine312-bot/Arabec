import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Calendar, Clock, Users, Plus, 
  ExternalLink, Trash2, Edit, CheckCircle, 
  AlertCircle, Timer, ChevronRight, Bell,
  VideoOff, Star, MessageSquare, ShieldCheck,
  History as LucideHistory
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---
interface LiveSession {
  id: string;
  title: string;
  dateTime: string;
  duration: number; // in minutes
  targetGroup: string;
  meetLink: string;
  status: 'upcoming' | 'live' | 'ended';
  participants?: number;
}

// --- Mock Data ---
const INITIAL_SESSIONS: LiveSession[] = [
  {
    id: '1',
    title: 'مراجعة شاملة لدرس المعرب والمبني',
    dateTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    duration: 45,
    targetGroup: 'السنة الأولى إعدادي',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'upcoming',
    participants: 0
  },
  {
    id: '2',
    title: 'ورشة عمل: كتابة موضوع إنشائي متميز',
    dateTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    duration: 60,
    targetGroup: 'السنة الثالثة إعدادي',
    meetLink: 'https://meet.google.com/xyz-pqrs-tuv',
    status: 'ended',
    participants: 24
  }
];

export const LiveInterviews: React.FC<{ userRole: 'teacher' | 'student' }> = ({ userRole }) => {
  const [sessions, setSessions] = useState<LiveSession[]>(INITIAL_SESSIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    date: '',
    time: '',
    duration: 45,
    targetGroup: 'السنة الأولى إعدادي'
  });

  // Countdown Timer Logic for Students
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = `${newSession.date}T${newSession.time}`;
    const session: LiveSession = {
      id: Math.random().toString(36).substr(2, 9),
      title: newSession.title,
      dateTime,
      duration: newSession.duration,
      targetGroup: newSession.targetGroup,
      meetLink: `https://meet.google.com/new-${Math.random().toString(36).substr(2, 4)}`,
      status: 'upcoming',
      participants: 0
    };
    setSessions([session, ...sessions]);
    setIsModalOpen(false);
    setNewSession({ title: '', date: '', time: '', duration: 45, targetGroup: 'السنة الأولى إعدادي' });
  };

  const getStatus = (dateTime: string, duration: number) => {
    const start = new Date(dateTime).getTime();
    const end = start + duration * 60000;
    const current = now.getTime();

    if (current < start) return 'upcoming';
    if (current >= start && current <= end) return 'live';
    return 'ended';
  };

  const formatTimeLeft = (dateTime: string) => {
    const diff = new Date(dateTime).getTime() - now.getTime();
    if (diff <= 0) return null;

    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-red-100">
              <Video size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-1">المقابلات المباشرة مع الأستاذ</h1>
              <p className="text-slate-500">تواصل مباشر، تعلم تفاعلي، وإجابات فورية على تساؤلاتك.</p>
            </div>
          </div>

          {userRole === 'teacher' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-100"
            >
              <Plus size={20} />
              إنشاء مقابلة جديدة
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid gap-8">
          
          {/* Upcoming / Live Sessions */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Calendar className="text-red-500" size={20} />
              المقابلات القادمة والحالية
            </h2>

            <div className="grid gap-6">
              {sessions.filter(s => getStatus(s.dateTime, s.duration) !== 'ended').map((session) => {
                const status = getStatus(session.dateTime, session.duration);
                const timeLeft = formatTimeLeft(session.dateTime);

                return (
                  <motion.div 
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "bg-white p-8 rounded-[2.5rem] border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8",
                      status === 'live' ? "border-red-500 shadow-2xl shadow-red-50" : "border-white shadow-xl shadow-slate-200/50"
                    )}
                  >
                    <div className="flex items-start gap-6">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                        status === 'live' ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 text-slate-400"
                      )}>
                        <Video size={28} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-black text-slate-900">{session.title}</h3>
                          {status === 'live' && (
                            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">مباشر الآن</span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {new Date(session.dateTime).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {new Date(session.dateTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users size={14} />
                            {session.targetGroup}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4">
                      {status === 'upcoming' && timeLeft && (
                        <div className="flex items-center gap-3 bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100">
                          <Timer size={18} className="text-red-500" />
                          <span className="font-mono font-black text-lg text-slate-700" dir="ltr">{timeLeft}</span>
                          <span className="text-xs font-bold text-slate-400">متبقي</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        {userRole === 'teacher' && (
                          <button className="p-3 text-slate-400 hover:text-red-600 transition-colors">
                            <Trash2 size={20} />
                          </button>
                        )}
                        <a 
                          href={session.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "px-8 py-3 rounded-xl font-black flex items-center gap-2 transition-all",
                            status === 'live' 
                              ? "bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700" 
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          )}
                          onClick={(e) => status !== 'live' && e.preventDefault()}
                        >
                          <ExternalLink size={18} />
                          انضم الآن
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {sessions.filter(s => getStatus(s.dateTime, s.duration) !== 'ended').length === 0 && (
                <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
                  <VideoOff size={48} className="text-slate-200 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-slate-400">لا توجد مقابلات قادمة حالياً</h3>
                </div>
              )}
            </div>
          </div>

          {/* Past Sessions (Teacher Only or Stats) */}
          <div className="space-y-6 pt-12">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <LucideHistory className="text-slate-400" size={20} />
              المقابلات السابقة
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {sessions.filter(s => getStatus(s.dateTime, s.duration) === 'ended').map((session) => (
                <div key={session.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">{session.title}</h4>
                    <div className="text-xs text-slate-400 font-bold">
                      {new Date(session.dateTime).toLocaleDateString('ar-EG')} • {session.participants} مشارك
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600"><Star size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-emerald-600"><MessageSquare size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Session Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden"
              >
                <div className="bg-red-600 p-8 text-white">
                  <h2 className="text-2xl font-black">جدولة مقابلة مباشرة جديدة</h2>
                  <p className="text-red-100 text-sm mt-1">سيتم توليد رابط Google Meet تلقائياً وإرسال إشعارات للطلاب.</p>
                </div>
                <form onSubmit={handleCreateSession} className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700">عنوان المقابلة</label>
                    <input 
                      required
                      type="text" 
                      placeholder="مثلاً: مراجعة درس الإعراب"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                      value={newSession.title}
                      onChange={e => setNewSession({...newSession, title: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700">التاريخ</label>
                      <input 
                        required
                        type="date" 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        value={newSession.date}
                        onChange={e => setNewSession({...newSession, date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700">الوقت</label>
                      <input 
                        required
                        type="time" 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        value={newSession.time}
                        onChange={e => setNewSession({...newSession, time: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700">المدة (بالدقائق)</label>
                      <select 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        value={newSession.duration}
                        onChange={e => setNewSession({...newSession, duration: parseInt(e.target.value)})}
                      >
                        <option value={30}>30 دقيقة</option>
                        <option value={45}>45 دقيقة</option>
                        <option value={60}>60 دقيقة</option>
                        <option value={90}>90 دقيقة</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700">الفئة المستهدفة</label>
                      <select 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        value={newSession.targetGroup}
                        onChange={e => setNewSession({...newSession, targetGroup: e.target.value})}
                      >
                        <option>السنة الأولى إعدادي</option>
                        <option>السنة الثانية إعدادي</option>
                        <option>السنة الثالثة إعدادي</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="submit"
                      className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-red-100 hover:bg-red-700 transition-all"
                    >
                      تأكيد وإنشاء الرابط
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Integration / Info Section */}
        <div className="mt-20 p-12 bg-white rounded-[3rem] border border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-12">
          <div className="w-32 h-32 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center shrink-0">
            <ShieldCheck size={64} />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-900">نظام آمن وموثوق</h3>
            <p className="text-slate-500 leading-relaxed">
              يتم التحقق من هوية جميع المشاركين قبل السماح لهم بالانضمام إلى الاجتماع. لا يمكن لأي شخص خارج المنصة الدخول دون إذن مسبق من الأستاذ. يتم تسجيل الحضور تلقائياً بمجرد دخولك للجلسة.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                <CheckCircle size={16} />
                توليد روابط تلقائي
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                <Bell size={16} />
                إشعارات فورية
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
                <Users size={16} />
                تسجيل حضور ذكي
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveInterviews;
