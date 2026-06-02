import React from 'react';
import { Clock, Play, CheckCircle2, Award, Sparkles, AlertCircle } from 'lucide-react';

interface ActivityItem {
  studentId: string;
  studentName: string;
  class: string;
  action: string;
  page?: string;
  timestamp: string;
  device?: string;
  duration?: number;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getIcon = (action: string) => {
    const lowercase = action.toLowerCase();
    if (lowercase.includes('دخول') || lowercase.includes('login')) {
      return <Sparkles size={16} className="text-emerald-500" />;
    }
    if (lowercase.includes('تمرين') || lowercase.includes('exercise') || lowercase.includes('حل')) {
      return <CheckCircle2 size={16} className="text-indigo-500" />;
    }
    if (lowercase.includes('اختبار') || lowercase.includes('intelligent') || lowercase.includes('ذكاء')) {
      return <Award size={16} className="text-amber-500" />;
    }
    return <Play size={16} className="text-sky-500" />;
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm font-sans flex flex-col h-112 overflow-hidden" dir="rtl">
      <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">مراقبة الأنشطة الحية</h3>
          <p className="text-xs text-slate-400 mt-1">تتبع نشاط التلاميذ على صفحات المنصة بشكل تفاعلي</p>
        </div>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4.5 pr-1">
        {activities.length > 0 ? (
          activities.map((item, index) => (
            <div key={index} className="flex gap-3.5 items-start bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
              <div className="mt-1 bg-white p-2.5 rounded-xl shadow-sm border border-slate-100/60 shrink-0">
                {getIcon(item.action)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-1">
                  <h4 className="text-sm font-bold text-slate-800 tracking-wide">{item.studentName}</h4>
                  <div className="flex items-center gap-1.5 text-slate-400 text-2xs font-medium shrink-0">
                    <Clock size={11} />
                    <span>{formatTime(item.timestamp)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium bg-white/70 py-1 px-2.5 rounded border border-slate-100/30 inline-block">
                  {item.action}
                </p>
                <div className="flex flex-wrap gap-2 items-center mt-2.5 text-3xs text-slate-400 font-semibold">
                  <span className="bg-indigo-50/50 text-indigo-500 px-2 py-0.5 rounded border border-indigo-100/10">{item.class}</span>
                  {item.page && <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono overflow-ellipsis overflow-hidden max-w-[200px] whitespace-nowrap">{item.page}</span>}
                  {item.device && <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{item.device}</span>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2.5 py-12">
            <AlertCircle size={32} className="opacity-30" />
            <span className="text-xs">لم يتم تسجيل أي نشاط تتبع حركي بعد.</span>
          </div>
        )}
      </div>
    </div>
  );
};
