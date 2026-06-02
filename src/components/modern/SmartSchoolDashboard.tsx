import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Activity, GraduationCap, Award, BookOpen, 
  Clock, CheckCircle2, AlertCircle, Play, Sparkles, 
  Send, Calendar, Zap, FileText, ChevronLeft, 
  FolderPlus, UserCheck, Shield, Key, PenTool, 
  Bell, FileSpreadsheet, RefreshCw, BarChart3, ArrowLeft,
  Search, Brain, Star, Check, HelpCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  schoolApi, StudentSafe, ExamResult, 
  MultipleIntelligenceResult, ExerciseSubmission, 
  WritingSubmission, SystemNotification, SchoolAnalytics 
} from '../../services/schoolApi';
import { useSchool } from '../../context/SchoolContext';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer, BarChart, 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

type ActiveTab = 'stats' | 'students' | 'writing' | 'exams' | 'intelligence' | 'exercises' | 'notifications';

export const SmartSchoolDashboard: React.FC = () => {
  const { user, login: contextLogin, logout: contextLogout, notifications, refreshNotifications, realtimeAlerts, removeRealtimeAlert } = useSchool();
  const [activeTab, setActiveTab] = useState<ActiveTab>('stats');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<SchoolAnalytics | null>(null);
  const [students, setStudents] = useState<StudentSafe[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Login States
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Forms and Modals
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Teacher Forms
  const [examForm, setExamForm] = useState({
    studentId: '',
    subject: 'مكون الصرف والتحويل',
    examType: 'فرض',
    score: '',
    semester: 'الدورة الأولى',
    academicYear: '2025/2026'
  });
  const [examSubmitSuccess, setExamSubmitSuccess] = useState(false);

  // Essay scoring state
  const [pendingWritings, setPendingWritings] = useState<WritingSubmission[]>([]);
  const [gradingWritingId, setGradingWritingId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  // Student Actions
  const [essayTitle, setEssayTitle] = useState('وصف مشهد طبيعي خريفي بجبال الأطلس المتوسط');
  const [essayContent, setEssayContent] = useState('');
  const [essaySuccess, setEssaySuccess] = useState(false);
  
  // Multiple Intelligences Diagnoses questions
  const [intelligenceQuestions, setIntelligenceQuestions] = useState<any[]>([
    { id: 'l1', cat: 'linguistic', text: 'أستمتع بكتابة القصص والنصوص النثرية وتدوين الخواطر الأدبية.', val: 3 },
    { id: 'l2', cat: 'logical', text: 'أجد متعة في حل الألغاز الإعرابية والتراكيب الصرفية المعقدة.', val: 3 },
    { id: 'l3', cat: 'visual', text: 'أستوعب القاعدة الصرفية أفضل عند تلخيصها بخرائط ذهنية ملونة.', val: 3 },
    { id: 'l4', cat: 'kinesthetic', text: 'أحب المشاركة في مسرحيات مدرسية تجسد حركات الأدوات والحروف.', val: 3 },
    { id: 'l5', cat: 'musical', text: 'تلحين الكلمات والبحور الشعرية يجعل حفظها أسهل بالنسبة لي.', val: 3 },
    { id: 'l6', cat: 'interpersonal', text: 'أفضل العمل في مجموعات لشرح وتصحيح النصوص اللغوية مع زملائي.', val: 3 },
    { id: 'l7', cat: 'intrapersonal', text: 'أحب التفكير بمفردي في معاني الكلمات العميقة وأسرار البلاغة.', val: 3 },
    { id: 'l8', cat: 'naturalistic', text: 'أستلهم الأبيات الشعرية والنصوص الوصفية من جمال الجبال والغابات في المغرب.', val: 3 }
  ]);
  const [intelSuccess, setIntelSuccess] = useState(false);

  // Homework Question Worksheet
  const [homeworkAnswer, setHomeworkAnswer] = useState('');
  const [homeworkStatus, setHomeworkStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Load dashboards data
  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const stats = await schoolApi.getAnalytics();
      setAnalyticsData(stats);
      
      const allStudents = await schoolApi.getStudents();
      setStudents(allStudents);

      if (user.role === 'teacher' || user.role === 'admin') {
        const writs = await schoolApi.getWritings();
        setPendingWritings(writs.filter(w => w.status === 'pending'));
      }
    } catch (err) {
      console.error('LMS Load metrics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleLmsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await contextLogin(emailInput, passwordInput);
    } catch (err: any) {
      setLoginError(err.message || 'خطأ في المصادقة');
    }
  };

  const loadStudentDetails = async (id: string) => {
    setSelectedStudentId(id);
    setDetailsLoading(true);
    try {
      const details = await schoolApi.getStudentDetails(id);
      setStudentDetails(details);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setExamSubmitSuccess(false);
    try {
      await schoolApi.submitExam({
        studentId: examForm.studentId,
        subject: examForm.subject,
        examType: examForm.examType,
        score: parseFloat(examForm.score),
        semester: examForm.semester,
        academicYear: examForm.academicYear
      });
      setExamSubmitSuccess(true);
      setExamForm({ ...examForm, score: '' });
      fetchData();
      setTimeout(() => setExamSubmitSuccess(false), 3000);
    } catch (err) {
      alert('خطأ في تقديم العلامة');
    }
  };

  const handleGradeWriting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingWritingId) return;
    try {
      await schoolApi.gradeWriting(gradingWritingId, parseFloat(gradeInput), feedbackInput);
      setGradingWritingId(null);
      setGradeInput('');
      setFeedbackInput('');
      fetchData();
    } catch (err) {
      alert('فشل حفظ التصحيح');
    }
  };

  const submitStudentEssay = async () => {
    if (!essayContent.trim()) return;
    try {
      await schoolApi.submitWriting(essayTitle, essayContent, essayContent.trim().split(/\s+/).length);
      setEssaySuccess(true);
      setEssayContent('');
      setTimeout(() => setEssaySuccess(false), 4000);
      fetchData();
    } catch (err) {
      alert('خطأ في إيداع الإنشاء');
    }
  };

  const submitIntelligenceProfile = async () => {
    const scores: any = {
      linguistic: 0,
      logical: 0,
      visual: 0,
      kinesthetic: 0,
      musical: 0,
      interpersonal: 0,
      intrapersonal: 0,
      naturalistic: 0
    };

    intelligenceQuestions.forEach(q => {
      // mapping 1-5 scale to percentage (e.g. 1=20%, 3=60%, 5=100%)
      scores[q.cat] = q.val * 20;
    });

    try {
      await schoolApi.submitIntelligence(scores);
      setIntelSuccess(true);
      setTimeout(() => setIntelSuccess(false), 4000);
      fetchData();
    } catch (err) {
      alert('خطأ في إيداع الإجابات');
    }
  };

  const handleHomeworkCheck = async () => {
    const cleanAns = homeworkAnswer.trim();
    const isCorrect = cleanAns === 'استفعل';
    setHomeworkStatus(isCorrect ? 'correct' : 'wrong');
    try {
      await schoolApi.submitExercise({
        exerciseId: 'morph_interactive_1',
        title: 'حل واجب الميزان الصرفي الأسبوعي الالكتروني',
        question: 'زن الفعل السداسي "استكبر"',
        studentAnswer: cleanAns,
        correctAnswer: 'استفعل',
        isCorrect,
        score: isCorrect ? 20 : 5
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden rtl" dir="rtl">
        <div className="absolute top-0 right-0 p-8 text-indigo-50 -mr-10 -mt-10">
          <Shield size={160} />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="text-center">
            <GraduationCap size={48} className="text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-slate-900 leading-tight">بوابة المدرسة الذكية</h2>
            <p className="text-slate-400 font-bold mt-2">نظام إدارة وقياس تحليلي متكامل للأقسام الإعدادية</p>
          </div>

          <form onSubmit={handleLmsLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700">البريد الإلكتروني الذكي</label>
              <input 
                type="email" 
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="student1@school.ma أو بريد الأستاذ"
                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold text-slate-700 text-center"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700">كلمة المرور الحامية</label>
              <input 
                type="password" 
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="password123 أو teacher123"
                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold text-slate-700 text-center"
              />
            </div>

            {loginError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-black flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
            >
              <Key size={18} />
              <span>تسجيل الدخول الآمن</span>
            </button>
          </form>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700 text-xs text-center font-bold space-y-2">
            <div>💡 حسابات للاختبار السريع:</div>
            <div>• تلميذ (أولى إعدادي): <span className="font-black select-all">student1@school.ma</span> كود <span className="font-black select-all">password123</span></div>
            <div>• الأستاذ المشرف: <span className="font-black select-all">wadifamaroc60@gmail.com</span> كود <span className="font-black select-all">teacher123</span></div>
            <div>• مدير المنصة: <span className="font-black select-all">admin@school.ma</span> كود <span className="font-black select-all">admin123</span></div>
          </div>
        </div>
      </div>
    );
  }

  // Filter students based on category & search term
  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === 'الكل' || s.class === selectedClass;
    const matchesSearch = s.name.includes(searchTerm) || s.email.includes(searchTerm);
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-10 rtl select-none" dir="rtl">
      {/* Realtime Socket.io Toast Stack */}
      <div className="fixed bottom-6 left-6 z-[120] space-y-4 max-w-sm">
        <AnimatePresence>
          {realtimeAlerts.map(alert => (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, x: -100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.9 }}
              className={cn(
                "p-4 rounded-2xl border shadow-xl flex items-start gap-4 text-slate-800",
                alert.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-white border-slate-100'
              )}
            >
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <Bell size={18} />
              </div>
              <div className="flex-1 text-right">
                <h4 className="text-sm font-black mb-1">{alert.title}</h4>
                <p className="text-xs font-bold opacity-80 leading-relaxed">{alert.message}</p>
              </div>
              <button onClick={() => removeRealtimeAlert(alert.id)} className="text-slate-400 hover:text-slate-600">
                <ArrowLeft size={16} className="rotate-45" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Primary Header */}
      <div className="bg-indigo-600 p-10 rounded-[4rem] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 text-white/5 -mr-16 -mt-16">
          <GraduationCap size={240} />
        </div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 text-white rounded-3xl flex items-center justify-center backdrop-blur-md">
            <GraduationCap size={36} />
          </div>
          <div>
            <h1 className="text-3xl font-black">{user.role === 'student' ? 'فضاء التلميذ الذكي' : user.role === 'teacher' ? 'بوابة الأستاذ والمصحح الذكية' : 'منظومة الإدارة والمتابعة الكبرى'}</h1>
            <p className="text-indigo-100 font-bold mt-1">مرحباً بك، {user.name} ({user.class || 'مشرف تربوي'}) 👋</p>
          </div>
        </div>

        <button 
          onClick={contextLogout}
          className="relative z-10 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black backdrop-blur-md transition-all flex items-center gap-3 self-start md:self-auto border border-white/15"
        >
          <Key size={18} />
          <span>خروج آمن</span>
        </button>
      </div>

      {/* Role Separated Navigation Dashboard */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar Controls */}
        <div className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm space-y-4 h-fit">
          <h3 className="px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-6">قائمة الفضاءات</h3>
          
          {(user.role === 'teacher' || user.role === 'admin') ? (
            <>
              <button 
                onClick={() => setActiveTab('stats')}
                className={cn(
                  "w-full p-4 rounded-2xl font-black text-right flex items-center gap-4 transition-all",
                  activeTab === 'stats' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                <BarChart3 size={20} />
                <span>إحصائيات المنصة الكلية</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('students')}
                className={cn(
                  "w-full p-4 rounded-2xl font-black text-right flex items-center gap-4 transition-all",
                  activeTab === 'students' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                <Users size={20} />
                <span>فصول وتلاميذ الإعدادي</span>
              </button>

              <button 
                onClick={() => setActiveTab('writing')}
                className={cn(
                  "w-full p-4 rounded-2xl font-black text-right flex items-center justify-between transition-all",
                  activeTab === 'writing' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                <div className="flex items-center gap-4">
                  <PenTool size={20} />
                  <span>تصحيح التعبير والإنشاء</span>
                </div>
                {pendingWritings.length > 0 && (
                  <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full font-black animate-pulse">
                    {pendingWritings.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('exams')}
                className={cn(
                  "w-full p-4 rounded-2xl font-black text-right flex items-center gap-4 transition-all",
                  activeTab === 'exams' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                <FileSpreadsheet size={20} />
                <span>تسجيل وعرض النقط</span>
              </button>
            </>
          ) : (
            // Student Tabs
            <>
              <button 
                onClick={() => setActiveTab('stats')}
                className={cn(
                  "w-full p-4 rounded-2xl font-black text-right flex items-center gap-4 transition-all",
                  activeTab === 'stats' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                <BarChart3 size={20} />
                <span>إنجازاتي ومعدلي العمومي</span>
              </button>

              <button 
                onClick={() => setActiveTab('intelligence')}
                className={cn(
                  "w-full p-4 rounded-2xl font-black text-right flex items-center gap-4 transition-all",
                  activeTab === 'intelligence' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                <Brain size={20} />
                <span>اختبار الذكاءات المنهجي</span>
              </button>

              <button 
                onClick={() => setActiveTab('exercises')}
                className={cn(
                  "w-full p-4 rounded-2xl font-black text-right flex items-center gap-4 transition-all",
                  activeTab === 'exercises' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                <BookOpen size={20} />
                <span>واجباتي الصرفية واللغوية</span>
              </button>

              <button 
                onClick={() => setActiveTab('writing')}
                className={cn(
                  "w-full p-4 rounded-2xl font-black text-right flex items-center gap-4 transition-all",
                  activeTab === 'writing' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                <PenTool size={20} />
                <span>كتابة وإنشاء التعبيرات</span>
              </button>

              <button 
                onClick={() => setActiveTab('notifications')}
                className={cn(
                  "w-full p-4 rounded-2xl font-black text-right flex items-center justify-between transition-all",
                  activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                <div className="flex items-center gap-4">
                  <Bell size={20} />
                  <span>إشعاراتي وتنبيهاتي</span>
                </div>
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-black">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
            </>
          )}
        </div>

        {/* Dynamic Display Board Area */}
        <div className="lg:col-span-3 space-y-8">
          {/* TAB 1: Analytics / Progress */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              {/* Overviews widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Users size={28} />
                  </div>
                  <div>
                    <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider">إجمالي التلاميذ</h4>
                    <p className="text-2xl font-black text-slate-900 mt-1">{analyticsData?.totalStudents || 30} تلميذ</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <UserCheck size={28} />
                  </div>
                  <div>
                    <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider">معدل الانضباط والحضور</h4>
                    <p className="text-2xl font-black text-slate-900 mt-1">{analyticsData?.avgAttendance || 91}%</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                  <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                    <Award size={28} />
                  </div>
                  <div>
                    <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider">التحصيل اللغوي الصرفي</h4>
                    <p className="text-2xl font-black text-slate-900 mt-1">{analyticsData?.avgExamsScore || 15}/20</p>
                  </div>
                </div>
              </div>

              {/* charts layouts */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Chart A: Multi Intelligences Average radar chart */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-2">رادار الذكاءات المدرسية الموسط</h3>
                  <p className="text-slate-400 font-bold text-xs mb-6">توزيع الذكاءات المتعددة لدى الفئات الحالية</p>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                        { subject: 'لغوي', A: analyticsData?.averageIntelligence.linguistic || 75 },
                        { subject: 'رياضي', A: analyticsData?.averageIntelligence.logical || 68 },
                        { subject: 'بصري', A: analyticsData?.averageIntelligence.visual || 71 },
                        { subject: 'حركي', A: analyticsData?.averageIntelligence.kinesthetic || 62 },
                        { subject: 'موسيقي', A: analyticsData?.averageIntelligence.musical || 55 },
                        { subject: 'اجتماعي', A: analyticsData?.averageIntelligence.interpersonal || 80 },
                        { subject: 'ذاتي', A: analyticsData?.averageIntelligence.intrapersonal || 78 },
                        { subject: 'بيئي', A: analyticsData?.averageIntelligence.naturalistic || 64 }
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="الوسط العام" dataKey="A" stroke="#4f46e5" fill="#818cf8" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart B: Class Distribution Pie Chart */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-2">توزيع فصول تلاميذ الإعدادي</h3>
                  <p className="text-slate-400 font-bold text-xs mb-6">التقسيم العددي للتلاميذ بمستوياتهم المنهجية</p>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'الأولى إعدادي', value: analyticsData?.classesDist['الأولى إعدادي'] || 10 },
                            { name: 'الثانية إعدادي', value: analyticsData?.classesDist['الثانية إعدادي'] || 10 },
                            { name: 'الثالثة إعدادي', value: analyticsData?.classesDist['الثالثة إعدادي'] || 10 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#4f46e5" />
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Leaderboard panel */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">ترتيب وصدارة المتعلمين</h3>
                    <p className="text-slate-400 font-bold text-xs">العشرة الأوائل المتميزين بالمنظومة بنقاط الخبرة (XP)</p>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
                    <Zap size={20} />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-50 text-slate-400">
                        <th className="py-4 font-black">المرتبة</th>
                        <th className="py-4 font-black">الاسم</th>
                        <th className="py-4 font-black">الفصل</th>
                        <th className="py-4 font-black text-center">النقاط مجمعة</th>
                        <th className="py-4 font-black text-center">نسبة الإنجاز</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(analyticsData?.leaderboard || []).slice(0, 5).map((student, idx) => (
                        <tr key={student.id} className="border-b border-light hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 font-black text-indigo-600">#{idx + 1}</td>
                          <td className="py-4 font-black text-slate-700">{student.name}</td>
                          <td className="py-4 font-bold text-slate-400">{student.class}</td>
                          <td className="py-4 font-black text-center text-slate-900">{student.xp} XP</td>
                          <td className="py-4 text-center">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-black text-xs">
                              {student.progressPercentage}% متاح
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Students List */}
          {activeTab === 'students' && (
            <div className="space-y-8">
              {/* Header and filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-72">
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث باسم المتعلم..."
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-600 pl-10 pr-4 font-bold outline-none text-slate-700 placeholder-slate-400"
                  />
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="flex bg-slate-50 p-1 rounded-2xl w-full md:w-auto overflow-x-auto">
                  {['الكل', 'الأولى إعدادي', 'الثانية إعدادي', 'الثالثة إعدادي'].map((clsName) => (
                    <button
                      key={clsName}
                      onClick={() => setSelectedClass(clsName)}
                      className={cn(
                        "px-6 py-2.5 rounded-xl font-black text-xs transition-all shrink-0",
                        selectedClass === clsName ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400'
                      )}
                    >
                      {clsName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Students responsive grid list */}
              <div className="grid md:grid-cols-2 gap-6">
                {filteredStudents.map(student => (
                  <div key={student.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{student.class}</span>
                        <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full font-bold text-[10px] flex items-center gap-1">
                          <Clock size={12} />
                          <span>نشط مؤخراً</span>
                        </span>
                      </div>
                      <h4 className="text-xl font-black text-slate-900">{student.name}</h4>
                      <p className="text-slate-400 font-bold text-xs mt-1">{student.email}</p>
                      
                      {/* Attendance & Engagement details */}
                      <div className="grid grid-cols-2 gap-4 mt-6 bg-slate-50 p-4 rounded-2xl">
                        <div>
                          <div className="text-[10px] font-black text-slate-400">معدل الانضباط</div>
                          <div className="text-lg font-black text-emerald-600 mt-0.5">{student.attendanceRate}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-slate-400">رصيد الخبرة</div>
                          <div className="text-lg font-black text-amber-500 mt-0.5">{student.xp} XP</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-50 pt-6">
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                        <Zap size={14} className="text-yellow-500" />
                        <span>منفذ {student.loginCount} جلسات</span>
                      </div>

                      <button 
                        onClick={() => loadStudentDetails(student.id)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                      >
                        <FileText size={14} />
                        <span>تحليل الملف</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Essay Writing Board */}
          {activeTab === 'writing' && (
            <div className="space-y-8">
              {(user.role === 'teacher' || user.role === 'admin') ? (
                // Teacher scoring pending writings list
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-2">منصة تصحيح التعبيرات العربية</h3>
                    <p className="text-slate-400 font-bold text-xs">مراجعة نصوص الإنشاء المقدمة من ذوي الفصول الإعدادية وصنع الملحوظات ونقط /20.</p>
                  </div>

                  {pendingWritings.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-slate-50 shrink-0 text-slate-400 font-bold">
                       لا توجد إنشاءات جديدة معلقة بحاجة لتصحيح في الوقت الحالي!
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {pendingWritings.map(writing => (
                        <div key={writing.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-black text-xs">{writing.class}</span>
                              <h4 className="text-lg font-extrabold text-slate-900 mt-2">{writing.topicTitle}</h4>
                              <p className="text-slate-400 font-bold text-xs mt-1">تأليف: {writing.studentName} ({writing.wordCount} كلمة)</p>
                            </div>
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-black text-xs animate-pulse">
                              بانتظار تصحيح
                            </span>
                          </div>

                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic leading-relaxed text-slate-700 font-bold text-base select-text whitespace-pre-wrap">
                            "{writing.content}"
                          </div>

                          {gradingWritingId === writing.id ? (
                            <form onSubmit={handleGradeWriting} className="space-y-6 border-t border-slate-100 pt-6">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-700">معدل النقطة /20 (وفق الطريقة الرسمية)</label>
                                  <input 
                                    type="number" 
                                    required
                                    min="0"
                                    max="20"
                                    step="0.25"
                                    value={gradeInput}
                                    onChange={(e) => setGradeInput(e.target.value)}
                                    placeholder="مثلا: 16.5"
                                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 font-bold outline-none focus:border-indigo-600 text-center"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-700">التوجيه والدعم البيداغوجي (ملحوظة المعلم)</label>
                                  <textarea 
                                    required
                                    value={feedbackInput}
                                    onChange={(e) => setFeedbackInput(e.target.value)}
                                    placeholder="اكتب توجيهات بيداغوجية لمساعدة التلميذ على تحسين أسلوبه ورسمه الصرفي..."
                                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 font-bold outline-none focus:border-indigo-600 text-right h-20"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-4">
                                <button type="submit" className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">تحميل التقييم لملف التلميذ</button>
                                <button type="button" onClick={() => setGradingWritingId(null)} className="px-6 py-3 bg-slate-150 text-slate-500 rounded-xl font-black text-xs hover:bg-slate-200 transition">إلغاء</button>
                              </div>
                            </form>
                          ) : (
                            <button 
                              onClick={() => { setGradingWritingId(writing.id); setGradeInput(''); setFeedbackInput(''); }}
                              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2"
                            >
                              <PenTool size={14} />
                              <span>تصحيح ووضع النقطة</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Student Essay submission studio
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">استوديو التعبير والإنشاء</h3>
                    <p className="text-slate-400 font-bold text-xs">اكتب موضوع تعبير لغوي بليغ متماشياً مع الموازين الصرفية والصيغ المشتقة، وسيقوم أستاذك بتصحيحه.</p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                      <Star className="text-amber-400 fill-amber-400" size={16} />
                      العنوان التدريبي المقرر حالياً
                    </label>
                    <input 
                      type="text" 
                      readOnly
                      value={essayTitle}
                      className="w-full p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 font-black text-indigo-900 outline-none text-right text-lg"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-black text-slate-700">محرر الصياغة الأدبية والإنشاء</label>
                      <span className="text-xs font-bold text-slate-400">إجمالي الكلمات: {essayContent.trim() ? essayContent.trim().split(/\s+/).length : 0} كلمة</span>
                    </div>
                    <textarea 
                      value={essayContent}
                      onChange={(e) => setEssayContent(e.target.value)}
                      placeholder="ابدأ في كتابة موضوع تعبيرك هنا بأسلوب لغوي دقيق وبلاغة جميلة وصياغة محكمة..."
                      className="w-full p-8 rounded-[2rem] bg-slate-50 border border-slate-100 font-bold outline-none focus:border-indigo-600 text-slate-700 text-right leading-loose text-lg min-h-[250px] select-text"
                    />
                  </div>

                  {essaySuccess && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black flex items-center gap-2 border border-emerald-100">
                      <CheckCircle2 size={16} />
                      <span>تم رفع موضوع الإنشاء لنظام تصحيح الأستاذ المشرف بنجاح! ستتلقى تنبيهاً فور انتهائه.</span>
                    </motion.div>
                  )}

                  <button 
                    onClick={submitStudentEssay}
                    disabled={!essayContent.trim()}
                    className={cn(
                      "px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all shadow-xl",
                      essayContent.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    )}
                  >
                    <Send size={16} />
                    <span>رفع الإنشاء للتصحيح</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Exams & results entry */}
          {activeTab === 'exams' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-2xl font-black text-slate-900">سجل إدخال النقط والامتحانات</h3>
                <p className="text-slate-400 font-bold text-xs">إدخال الفروض والتقويمات لربطها بملفات المتعلمين لحظياً وتحديث الرسوم البيانية لوحدة الصرف والنحو.</p>
                
                <form onSubmit={handleExamSubmit} className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700">اختر المتعلم المستهدف</label>
                    <select 
                      required
                      value={examForm.studentId}
                      onChange={(e) => setExamForm({ ...examForm, studentId: e.target.value })}
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-150 font-bold outline-none text-slate-700"
                    >
                      <option value="">-- اختر من اللائحة --</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.class})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700">مكون الدرس المبرهن</label>
                    <select 
                      value={examForm.subject}
                      onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-150 font-bold outline-none text-slate-700"
                    >
                      <option value="مكون الصرف والتحويل">مكون الصرف والتحويل</option>
                      <option value="مكون قواعد النحو">مكون قواعد النحو</option>
                      <option value="مكون التطبيقات اللغوية">مكون التطبيقات اللغوية</option>
                      <option value="علم الميزان الصرفي">علم الميزان الصرفي</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700">نوع التقويم</label>
                    <select 
                      value={examForm.examType}
                      onChange={(e) => setExamForm({ ...examForm, examType: e.target.value })}
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-150 font-bold outline-none text-slate-700"
                    >
                      <option value="فرض">فرض مراقبة مستمرة</option>
                      <option value="محلي">امتحان موحد محلي</option>
                      <option value="جهوي">امتحان جهوي موحد</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700">النقطة المسجلة /20</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      max="20"
                      step="0.25"
                      value={examForm.score}
                      onChange={(e) => setExamForm({ ...examForm, score: e.target.value })}
                      placeholder="امثلة: 15.75"
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-150 font-bold outline-none text-slate-700 text-center"
                    />
                  </div>

                  {examSubmitSuccess && (
                    <div className="md:col-span-2 p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl text-xs font-black flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>تم تسجيل النقطة بنجاح، وتوليد إشعار فوري للتلميذ!</span>
                    </div>
                  )}

                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition">تحميل النقطة فوراً</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: Multiple Intelligence Slides (Student View) */}
          {activeTab === 'intelligence' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-2xl font-black text-slate-900">مقياس دانييل غولمان والذكاءات المتعددة التربوي</h3>
                <p className="text-slate-400 font-bold text-xs leading-relaxed">أجب على المعايير السلوكية التالية بدقة لنضع لك مخططاً رادارياً بذكاءاتك المهيمنة، ونقترح خطة تعلم تليق بأسلوبك العقلي المتميز.</p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                <div className="space-y-6">
                  {intelligenceQuestions.map((q, idx) => (
                    <div key={q.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                      <div className="flex items-start gap-4">
                        <span className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm shrink-0 mt-0.5">{idx + 1}</span>
                        <p className="text-slate-700 font-bold text-base leading-relaxed text-right">{q.text}</p>
                      </div>
                      
                      {/* Scales 1 to 5 */}
                      <div className="flex justify-between items-center max-w-md mr-12 bg-white p-3 rounded-xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-450 shrink-0">لا ينطبق أبداً</span>
                        <div className="flex gap-4">
                          {[1, 2, 3, 4, 5].map(v => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => {
                                const updated = [...intelligenceQuestions];
                                updated[idx].val = v;
                                setIntelligenceQuestions(updated);
                              }}
                              className={cn(
                                "w-10 h-10 rounded-full font-black text-sm transition-all flex items-center justify-center border",
                                q.val === v 
                                  ? 'bg-indigo-600 text-white border-transparent scale-110 shadow-md shadow-indigo-100' 
                                  : 'text-slate-400 border-slate-100 hover:bg-slate-50'
                              )}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-indigo-600 shrink-0">ينطبق تماماً</span>
                      </div>
                    </div>
                  ))}
                </div>

                {intelSuccess && (
                  <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl text-xs font-black flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>تم تحليل إاباتك وحفظ رادار ذكائك المتعدد بنجاح! طالع مخططاتك بفضاء إنجازاتك.</span>
                  </div>
                )}

                <button 
                  onClick={submitIntelligenceProfile}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition"
                >
                  إيداع نتائج المقياس وتحليل الملخص
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: Interactive exercises workbook tasks */}
          {activeTab === 'exercises' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div>
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-black text-xs">واجب منزلي صرفي الكتروني</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">تأكيد المهارة: الميزان الصرفي</h3>
                  <p className="text-slate-400 font-bold text-xs mt-1">حل الواجب لتقديمه للمعلم تلقائياً وكسب نقاط خبرة (XP).</p>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold text-base leading-relaxed space-y-3">
                   <div className="font-black text-indigo-600">❓ السؤال المطلوب إجابته:</div>
                   <div>زن بدقة الفعل السداسي المزيد التالي: <span className="underline font-black text-lg text-indigo-900">"استكبر"</span> مع نقل دقيق للحركات الموازية في اللغة.</div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-700">إجابتك الذاتية</label>
                  <input 
                    type="text" 
                    value={homeworkAnswer}
                    onChange={(e) => setHomeworkAnswer(e.target.value)}
                    placeholder="مثلا: استفعل..."
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-150 font-bold outline-none focus:border-indigo-600 text-center text-lg text-slate-700"
                  />
                </div>

                {homeworkStatus === 'correct' && (
                  <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl text-xs font-black flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>أجبت بامتياز وصحة مطلقة! رصيدك زاد +20 XP.</span>
                  </div>
                )}

                {homeworkStatus === 'wrong' && (
                  <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-xs font-black flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>الإجابة غير مطابقة للصياغة الصرفية الصحيحة، كرر المحاولة مرة أخرى!</span>
                  </div>
                )}

                <button 
                  onClick={handleHomeworkCheck}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                >
                  إيداع وتصحيح التمرين تلقائياً
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: Notifications list */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-2xl font-black text-slate-900">سجل الإشعارات والتنبيهات المنهجية</h3>
              
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-bold text-xs">لا تتوفر إشعارات جديدة حالياً بتنبيهاتك.</div>
              ) : (
                <div className="space-y-4">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={cn(
                        "p-6 rounded-2xl border flex items-start justify-between gap-4 transition-all",
                        n.isRead ? 'bg-slate-50/55 border-slate-100 opacity-70' : 'bg-indigo-50/50 border-indigo-100'
                      )}
                    >
                      <div className="text-right space-y-1">
                        <h4 className="font-extrabold text-slate-950 text-base">{n.title}</h4>
                        <p className="text-slate-650 font-bold text-sm leading-relaxed">{n.text}</p>
                        <span className="text-[10px] text-slate-400 mt-2 block">{new Date(n.timestamp).toLocaleDateString('ar-MA')}</span>
                      </div>

                      {!n.isRead && (
                        <button 
                          onClick={async () => {
                            await schoolApi.markNotificationRead(n.id);
                            refreshNotifications();
                          }}
                          className="px-4 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-[10px] shrink-0"
                        >
                          تحديد كمقروء
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* STUDENT PROFILE ANALYZER MODAL (Admin & Teacher views popup) */}
      <AnimatePresence>
        {selectedStudentId && studentDetails && (
          <div className="fixed inset-0 z-[110] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="bg-slate-950 text-white p-8 shrink-0 flex items-center justify-between">
                <div>
                  <span className="text-indigo-400 font-black text-xs uppercase tracking-widest">{studentDetails.student.class}</span>
                  <h2 className="text-2xl font-black text-slate-100 leading-tight mt-1">{studentDetails.student.name}</h2>
                  <p className="text-slate-400 font-bold text-xs mt-0.5">{studentDetails.student.email}</p>
                </div>
                <button 
                  onClick={() => setSelectedStudentId(null)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-slate-100 transition"
                >
                  <ArrowLeft size={18} />
                </button>
              </div>

              {/* Scrollable contents */}
              <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 space-y-10 text-right" dir="rtl">
                {/* Stats row info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400">مرات الدخول</div>
                    <div className="text-xl font-black text-slate-950 mt-1">{studentDetails.student.loginCount || 0} مرات</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400">إجمالي مدة الدراسة</div>
                    <div className="text-xl font-black text-slate-950 mt-1">{studentDetails.student.totalTimeSpent || 0} دقيقة</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400">معدل الحضور</div>
                    <div className="text-xl font-black text-slate-950 mt-1">{studentDetails.student.attendanceRate || 0}%</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400">معدل الإنجاز</div>
                    <div className="text-xl font-black text-slate-950 mt-1">{studentDetails.student.progressPercentage || 0}%</div>
                  </div>
                </div>

                {/* Radar IQ representation */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-110 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-4">التحليل الذهني (الذكاءات المتعددة)</h3>
                    {studentDetails.intelligence ? (
                      <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                            { subject: 'لغوي', A: studentDetails.intelligence.linguistic },
                            { subject: 'رياضي', A: studentDetails.intelligence.logical },
                            { subject: 'بصري', A: studentDetails.intelligence.visual },
                            { subject: 'حركي', A: studentDetails.intelligence.kinesthetic },
                            { subject: 'اجتماعي', A: studentDetails.intelligence.interpersonal },
                            { subject: 'ذاتي', A: studentDetails.intelligence.intrapersonal }
                          ]}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 11, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="نتائج التلميذ" dataKey="A" stroke="#4f46e5" fill="#818cf8" fillOpacity={0.4} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs font-bold leading-relaxed">لم يجري التلميذ هذا الاختبار التشخيصي بعد لمعرفة نوع ذكائه المهيمن.</div>
                    )}
                  </div>

                  {/* Log tracking */}
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-110 shadow-sm space-y-4">
                    <h3 className="text-lg font-black text-slate-900">سجل تعقب النشاط الصفوي والموقع</h3>
                    
                    <div className="space-y-3 max-h-[220px] overflow-y-auto">
                      {(studentDetails.student.activityLogs || []).map((log: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                          <div className="text-right">
                            <span className="font-extrabold text-slate-900 block">{log.action}</span>
                            <span className="text-slate-400 mt-0.5 block">{log.page} • بمعدل {log.duration} دقيقة</span>
                          </div>
                          <div className="text-left text-slate-400 font-bold shrink-0">
                            <span>{log.device}</span>
                            <span className="text-[9px] block text-indigo-600 mt-1 select-all">{log.ipAddress}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Exam ratings history */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-110 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 mb-4">كشف نقط التقويم المستمر والامتحانات</h3>
                  
                  {studentDetails.exams.length === 0 ? (
                    <div className="text-center text-slate-400 text-xs py-4">لم تدون أي تقييمات في دفتر العلامات إلى الآن للتلميذ.</div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {studentDetails.exams.map((ex: any) => (
                        <div key={ex.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-black text-slate-400">{ex.semester} ({ex.examType})</span>
                            <h5 className="font-extrabold text-slate-800 text-sm mt-0.5">{ex.subject}</h5>
                          </div>
                          <div className="text-left">
                            <span className="text-lg font-black text-indigo-600">{ex.score}/20</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
