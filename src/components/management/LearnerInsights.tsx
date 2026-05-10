import React from 'react';
import { 
  TrendingUp, Users, BookOpen, Star, 
  ArrowUpRight, ArrowDownRight, Search, 
  Filter, Calendar, Download, PieChart as PieIcon,
  BarChart as BarIcon, Share2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, 
  Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const SUBJECT_DATA = [
  { name: 'النحو', students: 4500, color: '#10b981' },
  { name: 'الصرف', students: 3200, color: '#3b82f6' },
  { name: 'الإملاء', students: 2800, color: '#f59e0b' },
  { name: 'الإنشاء', students: 2100, color: '#8b5cf6' },
  { name: 'البلاغة', students: 1500, color: '#ec4899' },
];

const ENGAGEMENT_DATA = [
  { name: 'السبت', views: 400, active: 240 },
  { name: 'الأحد', views: 300, active: 139 },
  { name: 'الاثنين', views: 200, active: 980 },
  { name: 'الثلاثاء', views: 278, active: 390 },
  { name: 'الأربعاء', views: 189, active: 480 },
  { name: 'الخميس', views: 239, active: 380 },
  { name: 'الجمعة', views: 349, active: 430 },
];

const POPULAR_LESSONS = [
  { id: 1, title: 'المبتدأ والخبر وأنواعه', subject: 'النحو', requests: 1245, trend: '+15%', rating: 4.9 },
  { id: 2, title: 'الهمزة المتوسطة وقواعدها', subject: 'الإملاء', requests: 980, trend: '+8%', rating: 4.7 },
  { id: 3, title: 'أوزان الفعل الثلاثي', subject: 'الصرف', requests: 850, trend: '-2%', rating: 4.8 },
  { id: 4, title: 'مهارات كتابة المقال', subject: 'الإنشاء', requests: 720, trend: '+22%', rating: 4.6 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

export const LearnerInsights: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">رؤى واختيارات المتعلمين</h1>
          <p className="text-slate-500 font-medium mt-1">تحليل معمق لسلوك الطلاب والمواد الأكثر طلباً وتفاعلاً.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-sm">
            <Calendar size={18} />
            <span>آخر 30 يوم</span>
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all">
            <Download size={18} />
            <span>تصدير البيانات</span>
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'أكثر درس مطلوب', value: 'المبتدأ والخبر', meta: 'إقبال مرتفع جداً', icon: <TrendingUp />, color: 'bg-emerald-500' },
          { label: 'متوسط وقت التعلم', value: '45 دقيقة', meta: '+12% عن الشهر الماضي', icon: <Calendar />, color: 'bg-blue-500' },
          { label: 'نسبة رضا الطلاب', value: '94%', meta: 'بناءً على 1.2k تقييم', icon: <Star />, color: 'bg-amber-500' },
          { label: 'المتعلمون النشطون', value: '3,842', meta: 'نشط الآن: 124', icon: <Users />, color: 'bg-purple-500' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700", item.color)}></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</div>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", item.color)}>
                  {item.icon}
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900">{item.value}</div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 mt-1">
                  <ArrowUpRight size={12} />
                  <span>{item.meta}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Subjects Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">توزيع الطلاب حسب المواد</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">إحصائيات الإقبال على المسارات التعليمية المختلفة.</p>
            </div>
            <div className="flex p-1 bg-slate-50 rounded-xl">
              <button className="p-2 bg-white rounded-lg shadow-sm text-emerald-600"><BarIcon size={18} /></button>
              <button className="p-2 text-slate-400"><PieIcon size={18} /></button>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SUBJECT_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                  cursor={{ fill: '#f8fafc', radius: 12 }}
                />
                <Bar dataKey="students" radius={[12, 12, 0, 0]}>
                  {SUBJECT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Trend */}
        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white space-y-8">
          <div>
            <h3 className="text-xl font-black">نشاط المنصة الأسبوعي</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">معدل التفاعل طوال أيام الأسبوع.</p>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENGAGEMENT_DATA}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="active" stroke="#10b981" fillOpacity={1} fill="url(#colorActive)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
              <div className="text-2xl font-black">450</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">أقصى تفاعل</div>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
              <div className="text-2xl font-black text-emerald-500">12%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">نمو النشاط</div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Lessons List */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">الدروس الأكثر اختياراً</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">قائمة المواد التي حازت على اهتمام المتعلمين هذا الشهر.</p>
          </div>
          <button className="p-4 hover:bg-slate-50 rounded-2xl text-slate-400">
            <Share2 size={20} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">الدرس</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">المادة</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">عدد الطلبات</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">الاتجاه</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">التقييم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {POPULAR_LESSONS.map((lesson) => (
                <tr key={lesson.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black shrink-0">
                        {lesson.id}
                      </div>
                      <span className="font-black text-slate-900">{lesson.title}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-black">
                      {lesson.subject}
                    </span>
                  </td>
                  <td className="px-10 py-8 font-black text-slate-700">{lesson.requests.toLocaleString()} طلب</td>
                  <td className="px-10 py-8">
                    <div className={cn(
                      "flex items-center gap-1 font-black text-sm",
                      lesson.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {lesson.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      <span>{lesson.trend}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-1.5 text-amber-500 font-black">
                      <Star size={18} fill="currentColor" />
                      <span>{lesson.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
