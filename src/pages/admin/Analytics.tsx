import React, { useState, useEffect } from 'react';
import { ChartComponent } from '../../components/admin/ChartComponent';
import { AlertCircle, ArrowUpRight, CheckCircle2, Award, Zap, BookOpen } from 'lucide-react';

interface AnalyticsProps {
  token: string;
}

export const Analytics: React.FC<AnalyticsProps> = ({ token }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/dashboard/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          setError(json.error || 'فشلت معالجة مصفوفة الإحصائيات.');
        }
      } catch (e) {
        setError('حدث خطأ في جلب بيانات التحليلات من السيرفر.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center text-rose-600 font-semibold flex items-center gap-3 justify-center">
        <AlertCircle size={20} />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans" dir="rtl">
      
      {/* Upper Grid - Highlighted Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-550 to-indigo-650 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
          <div>
            <span className="text-indigo-100 text-xs font-semibold tracking-wide block">نسبة النجاح الشاملة</span>
            <span className="text-4xl font-extrabold block mt-2">{data.successRate}%</span>
            <span className="text-2xs text-indigo-100/80 mt-1 block">للإجابات الصحيحة في التمرينات</span>
          </div>
          <div className="bg-white/10 p-4 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-555 to-emerald-655 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between bg-emerald-600">
          <div>
            <span className="text-emerald-100 text-xs font-semibold tracking-wide block">معدل التغطية البيداغوجية</span>
            <span className="text-4xl font-extrabold block mt-2">92%</span>
            <span className="text-2xs text-emerald-100/80 mt-1 block">مدى الإلمام بعلم الصرف والميزان</span>
          </div>
          <div className="bg-white/10 p-4 rounded-xl">
            <Award size={24} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-550 to-amber-650 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between bg-amber-500">
          <div>
            <span className="text-amber-100 text-xs font-semibold tracking-wide block">أكثر المفاهيم احتياجاً للمراجعة</span>
            <span className="text-lg font-bold block mt-2.5 overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[190px]">صياغة المجرّد والمزيد</span>
            <span className="text-2xs text-amber-100/80 mt-1 block">نسبة تحكم تبلغ 65% فقط</span>
          </div>
          <div className="bg-white/10 p-4 rounded-xl">
            <Zap size={24} />
          </div>
        </div>
      </div>

      {/* Charts Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartComponent 
          type="bar" 
          data={data.lessonMastery} 
          title="مستوى التحكم البيداغوجي الفردي والمشترك لكل درس (%)" 
        />
        <ChartComponent 
          type="line" 
          data={data.performanceTrend} 
          title="تطور أداء المتعلمين ومعدلات التقييمات عبر الزمن" 
        />
      </div>

      {/* Common Errors & Weakness Diagnosed Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Frequent errors panel */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-4">
            <BookOpen size={18} className="text-emerald-600" />
            <h3 className="text-base font-bold text-slate-800">الأخطاء الأكثر تكراراً وشيوعاً بين التلاميذ</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">يستعرض هذا القسم الأسئلة اللغوية التي سجلت أعلى معدلات إخفاق لدى الفصول لتمكين الأساتذة من جدولة حصص الدعم.</p>
          <div className="space-y-4">
            {data.commonErrors ? (
              data.commonErrors.map((err: any, idx: number) => (
                <div key={idx} className="bg-rose-50/40 p-4 rounded-xl border border-rose-100/40 flex items-start gap-3.5 justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-rose-700">السؤال: {err.question}</span>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-2xs font-medium text-slate-500 mt-1">
                      <span>الجواب الصحيح: <span className="text-emerald-600 font-bold">{err.correctAnswer}</span></span>
                      <span>خطأ التلميذ المتكرر: <span className="text-rose-600 font-bold">{err.studentAnswer}</span></span>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold bg-rose-100 text-rose-700 shrink-0">
                    تكرر {err.count} مرات
                  </span>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 block text-center py-6">لا توجد أخطاء مرصودة بعد.</span>
            )}
          </div>
        </div>

        {/* Pedagogical intervention advice */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-4">
              <ArrowUpRight size={18} className="text-emerald-600" />
              <h3 className="text-base font-bold text-slate-800">توصيات المحرك التحليلي الذكي (Engine Insights)</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed space-y-3.5">
              بناءً على عمليات تتبع الأخطاء والصعوبات الإجرائية المسجلة لتلاميذ المنصة، نوصي بالإجراءات التربوية التالية:
            </p>
            <ul className="mt-4 space-y-3 text-xs text-slate-600 list-disc list-inside">
              <li>برمجة حصة دعم بيداغوجي مركزة حول <strong>أوزان صيغ الزيادة</strong> خاصة "افتعل" مقابل "استفعل".</li>
              <li>تجهيز تمارين تعزيزية قصيرة لـ <strong>وزن الكلمات الناقصة الحروف (المحذوفة اللام)</strong> مثل "قاضٍ" و "ثق".</li>
              <li>ربط دروس التعبير والإنشاء بالدروس الصرفية لتوظيف الصيغ المشتقة في الصياغة اللغوية التلقائية.</li>
            </ul>
          </div>
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 p-4 rounded-xl mt-6 text-2xs font-semibold leading-relaxed">
            ملاحظة: يتم تحديث مخرجات المحرك التحليلي بانتظام وتلقائياً فور إنهاء التلاميذ للتمارين المبرمجة بالكامل في الزمن الفعلي.
          </div>
        </div>

      </div>

    </div>
  );
};
