import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  User, 
  Calendar, 
  Award, 
  BookOpen, 
  Clock, 
  ShieldAlert, 
  Trophy, 
  Compass, 
  Monitor, 
  Activity 
} from 'lucide-react';

interface StudentProfileProps {
  token: string;
  studentId: string | null;
  onBack: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ token, studentId, onBack }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentProfile = async () => {
      try {
        const res = await fetch(`/api/student/${studentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          setError(json.error || 'عذراً، فشل جلب بطاقة المتعلم.');
        }
      } catch (e) {
        setError('تعذر تحميل معلومات ملف المتعلم الفردي.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [studentId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
          <ArrowRight size={16} />
          الرجوع لمستودع التلاميذ
        </button>
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center text-rose-600 font-semibold">
          {error || 'بيانات متعلم غير متوفرة.'}
        </div>
      </div>
    );
  }

  const { student, exams, intelligence, exercises, writings, masterySummary, activityLogs } = data;

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12" dir="rtl">
      
      {/* Return Row & Overview Cards */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button 
          onClick={onBack} 
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-800 font-bold bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-sm transition-all"
        >
          <ArrowRight size={16} />
          الرجوع لقائمة جميع التلاميذ
        </button>
        <span className="text-2xs text-slate-400 font-semibold">تاريخ آخر تصفح للملف: {new Date().toLocaleDateString('ar-EG')}</span>
      </div>

      {/* 1. Student Personal Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
        <div className="flex items-center gap-4 lg:col-span-2">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shrink-0">
            {student.name.substring(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-wide">{student.name}</h2>
            <p className="text-xs text-slate-400 font-mono mt-1">{student.email}</p>
            <div className="flex flex-wrap gap-2 items-center mt-3">
              <span className="inline-flex px-3 py-0.5 rounded-full text-2xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100/20">{student.class}</span>
              <span className="inline-flex px-3 py-0.5 rounded-full text-2xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/20">رصيد XP: {student.xp}</span>
              <span className="inline-flex px-3 py-0.5 rounded-full text-2xs font-bold bg-amber-50 text-amber-600 border border-amber-100/20">سلسلة الأيام: {student.streak}</span>
            </div>
          </div>
        </div>

        <div className="border-t lg:border-t-0 lg:border-r border-slate-100 pt-4 lg:pt-0 lg:pr-6 grid grid-cols-2 gap-4 lg:col-span-2">
          <div>
            <span className="text-4xs text-slate-400 uppercase tracking-wider block font-bold">الحضور الكلي بالحصص</span>
            <span className="text-2xl font-extrabold text-slate-700 block mt-1">{student.attendanceRate || 95}%</span>
          </div>
          <div>
            <span className="text-4xs text-slate-400 uppercase tracking-wider block font-bold">زمن التعلم الإجمالي</span>
            <span className="text-2xl font-extrabold text-slate-700 block mt-1">{student.totalTimeSpent || 120} دقيقة</span>
          </div>
          <div>
            <span className="text-4xs text-slate-400 uppercase tracking-wider block font-bold">نسبة إنجاز المقررات</span>
            <span className="text-2xl font-extrabold text-slate-700 block mt-1">{student.progressPercentage || 65}%</span>
          </div>
          <div>
            <span className="text-4xs text-slate-400 uppercase tracking-wider block font-bold">جلسات الدخول الكلية</span>
            <span className="text-2xl font-extrabold text-slate-700 block mt-1">{student.loginCount || 10} جلسة</span>
          </div>
        </div>
      </div>

      {/* 2. Side-by-side: Exams History and Lessons mastery progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Exams Log sheet */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-112 overflow-hidden">
          <div className="flex items-center gap-2 border-b pb-4 mb-4">
            <Award size={18} className="text-emerald-500" />
            <h3 className="text-base font-bold text-slate-800">سجل نتائج الامتحانات والفروض</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {exams && exams.length > 0 ? (
              exams.map((ex: any) => (
                <div key={ex.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">{ex.subject}</span>
                    <div className="flex items-center gap-3 text-4xs text-slate-400 font-semibold">
                      <span>{ex.examType}</span>
                      <span>•</span>
                      <span>{ex.semester}</span>
                    </div>
                  </div>
                  <div className="text-left font-sans">
                    <span className={`text-lg font-extrabold block ${ex.score >= 15 ? 'text-emerald-500' : ex.score < 10 ? 'text-rose-500' : 'text-slate-700'}`}>
                      {ex.score} / 20
                    </span>
                    <span className="text-5xs text-slate-400 block mt-0.5">بإشراف: {ex.teacher}</span>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 text-center block py-12">لم يتم تسجيل نتائج اختبارات رسمية لهذا التلميذ حتى الآن.</span>
            )}
          </div>
        </div>

        {/* Master levels progress bars */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-112 overflow-hidden">
          <div className="flex items-center gap-2 border-b pb-4 mb-4">
            <BookOpen size={18} className="text-emerald-500" />
            <h3 className="text-base font-bold text-slate-800">مستويات التمكن المستهدفة بمصفوفات الصرف</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 py-2">
            {masterySummary && masterySummary.length > 0 ? (
              masterySummary.map((item: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">{item.title}</span>
                    <span className="text-indigo-600">{item.mastery}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${item.mastery >= 85 ? 'bg-emerald-500' : item.mastery < 60 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${item.mastery}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-4xs text-slate-400 font-semibold">
                    <span>تحليل إجرائي آلي للتمرينات</span>
                    <span>المحاولات الفردية: {item.total} محاولات</span>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 text-center block py-12">لا توجد سجلات تمرين بعد لحساب التحكم البيداغوجي.</span>
            )}
          </div>
        </div>

      </div>

      {/* 3. Side-by-side: Multiple Intelligences Diagnosed and Recent Activity log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Intelligence Radar profile */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b pb-4 mb-4">
            <Compass size={18} className="text-emerald-500" />
            <h3 className="text-base font-bold text-slate-800">الخريطة السيكولوجية للذكاءات المتعددة (MI Profile)</h3>
          </div>
          {intelligence ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-100/40 rounded-xl">
                <span className="text-3xs text-emerald-700/80 font-bold block uppercase">الذكاء الغالب والمسيطر</span>
                <span className="text-base font-extrabold text-emerald-800 mt-1 block">{intelligence.dominantIntelligence}</span>
              </div>
              <div className="grid grid-cols-2 gap-3.5 text-xs font-semibold">
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-500">الذكاء اللغوي</span>
                  <span className="text-slate-800 font-bold">{intelligence.linguistic}%</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-500">الذكاء الرياضي</span>
                  <span className="text-slate-800 font-bold">{intelligence.logical}%</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-500">الذكاء الفضائي البصري</span>
                  <span className="text-slate-800 font-bold">{intelligence.visual}%</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-500">الذكاء الاجتماعي</span>
                  <span className="text-slate-800 font-bold">{intelligence.interpersonal}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              <ShieldAlert size={28} className="mx-auto text-slate-300 mb-2" />
              لم يجرى اختبار تشخيص الذكاءات المتعددة الشامل بعد لهذا المتعلم بالكامل.
            </div>
          )}
        </div>

        {/* Activity Logs history list */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-96 overflow-hidden">
          <div className="flex items-center gap-2 border-b pb-4 mb-4">
            <Activity size={18} className="text-emerald-500" />
            <h3 className="text-base font-bold text-slate-800">سجل أنشطة التعلم للمتعلم (Session Logs)</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {activityLogs && activityLogs.length > 0 ? (
              activityLogs.map((log: any, idx: number) => (
                <div key={idx} className="flex gap-3 items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div className="shrink-0 bg-white p-2 rounded-lg border border-slate-100">
                    <Monitor size={14} className="text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-800 block text-ellipsis overflow-hidden">{log.action || 'تصفح صفحة بالمنصة'}</span>
                    <span className="text-4xs text-slate-400 block mt-0.5 font-mono">{new Date(log.timestamp).toLocaleString('ar-EG')}</span>
                  </div>
                  <div className="text-left font-mono text-3xs text-slate-500 shrink-0">
                    {log.duration || 1} دقيقة
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 text-center block py-12">لا توجد سجلات تصفح تاريخية مسجلة بعد.</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
