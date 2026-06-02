import React, { useState, useEffect } from 'react';
import { Award, Trophy, ArrowLeft, Heart, RefreshCw, AlertCircle } from 'lucide-react';

interface RankingProps {
  token: string;
  onViewProfile: (studentId: string) => void;
}

export const Ranking: React.FC<RankingProps> = ({ token, onViewProfile }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [classFilter, setClassFilter] = useState<string>('الأولى إعدادي');
  const [error, setError] = useState<string | null>(null);

  const fetchRankings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ranking?class=${encodeURIComponent(classFilter)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        setError(json.error || 'فشلت معالجة حساب الترتيب والمراكز للفصول.');
      }
    } catch (e: any) {
      setError('حدث خطأ أثناء تحميل الترتيب اللحظي.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [classFilter, token]);

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans" dir="rtl">
      
      {/* Upper Filter Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="text-amber-500" size={20} />
            <h2 className="text-base font-bold text-slate-800">ترتيب الفصول الصرحية واللوائح التنافسية</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">تحديث ديناميكي وترتيب تراكمي للتلاميذ بالنقاط وخبرات تحضير الدروس الصرفية.</p>
        </div>

        <div className="flex gap-2.5 items-center shrink-0">
          <button 
            onClick={() => setClassFilter('الأولى إعدادي')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${classFilter === 'الأولى إعدادي' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/15' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            الأولى إعدادي
          </button>
          <button 
            onClick={() => setClassFilter('الثانية إعدادي')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${classFilter === 'الثانية إعدادي' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/15' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            الثانية إعدادي
          </button>
          <button 
            onClick={() => setClassFilter('الثالثة إعدادي')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${classFilter === 'الثالثة إعدادي' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/15' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            الثالثة إعدادي
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center text-rose-600 font-semibold">
          {error}
        </div>
      ) : !data ? (
        <span className="text-xs text-slate-400 block text-center py-12">لا تتوفر مصفوفات ترتيب للفصل المحدد.</span>
      ) : (
        <div className="space-y-8">
          
          {/* Visual Podium Row for Top 3 */}
          {data.top10 && data.top10.length >= 3 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-800 tracking-wide text-center mb-6">منصة التتويج البيداغوجية لقسم {classFilter}</h3>
              
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto items-end pt-12 pb-6">
                {/* 2nd Place */}
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-600 shadow-sm">٢</div>
                  <span className="text-xs font-bold text-slate-700 text-center overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[90px]">{data.top10[1]?.name}</span>
                  <span className="text-4xs text-slate-400 font-bold">{data.top10[1]?.xp} XP</span>
                  <div className="w-full bg-slate-150 h-24 rounded-t-xl flex items-center justify-center font-extrabold text-slate-400 shadow-inner">
                    الفضة
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center gap-2">
                  <Trophy className="text-amber-500 animate-bounce" size={28} />
                  <div className="h-12 w-12 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-700 shadow-md transform -translate-y-1">١</div>
                  <span className="text-xs font-extrabold text-slate-800 text-center overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[110px]">{data.top10[0]?.name}</span>
                  <span className="text-3xs text-amber-600 font-extrabold">{data.top10[0]?.xp} XP</span>
                  <div className="w-full bg-amber-400 h-32 rounded-t-xl flex items-center justify-center font-extrabold text-amber-900 shadow-inner">
                    الذهب
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center font-bold text-amber-750 shadow-sm">٣</div>
                  <span className="text-xs font-bold text-slate-700 text-center overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[90px]">{data.top10[2]?.name}</span>
                  <span className="text-4xs text-slate-400 font-bold">{data.top10[2]?.xp} XP</span>
                  <div className="w-full bg-amber-600/30 h-16 rounded-t-xl flex items-center justify-center font-extrabold text-amber-800 shadow-inner">
                    البرونز
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Lists Columns: Top 10 and Bottom 10 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Top 10 List */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-4">
                <Trophy size={16} className="text-amber-550" />
                <h3 className="text-sm font-extrabold text-slate-800">التلاميذ العشرة الأوائل (لوحة الشرف)</h3>
              </div>
              <div className="space-y-3">
                {data.top10?.map((student: any, idx: number) => (
                  <div key={student.id} className="bg-slate-50/50 p-3.5 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <span className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center mb-0.5 border border-emerald-100/30">{idx + 1}</span>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{student.name}</span>
                        <span className="text-4xs text-slate-400 font-mono mt-0.5 block">{student.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <span className="text-xs font-extrabold text-emerald-600 block">{student.xp} XP</span>
                        <span className="text-4xs text-slate-400 block mt-0.5">المعدل: {student.averageGrade}/20</span>
                      </div>
                      <button
                        onClick={() => onViewProfile(student.id)}
                        className="p-1 px-3 bg-white hover:bg-slate-100 rounded-lg text-3xs font-bold border text-slate-500 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        الملف
                        <ArrowLeft size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom 10 List */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-4">
                <Heart size={16} className="text-rose-500" />
                <h3 className="text-sm font-extrabold text-slate-800">تلاميذ يحتاجون مواكبة بيداغوجية ودعم (الدعم الإيجابي)</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">تلاميذ سجلوا أدنى كسب من نقاط الأداء ويحتاجون خطة إنعاش علمية ودعم مباشر بإشراف الوكيل أو الأكاديمية.</p>
              
              <div className="space-y-3">
                {data.bottom10?.map((student: any, idx: number) => (
                  <div key={student.id} className="bg-slate-50/50 p-3.5 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <span className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold flex items-center justify-center mb-0.5 border border-rose-100/30">!</span>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{student.name}</span>
                        <span className="text-4xs text-slate-400 font-mono mt-0.5 block">{student.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <span className="text-xs font-extrabold text-rose-500 block">{student.xp} XP</span>
                        <span className="text-4xs text-slate-400 block mt-0.5">المعدل: {student.averageGrade}/20</span>
                      </div>
                      <button
                        onClick={() => onViewProfile(student.id)}
                        className="p-1 px-3 bg-white hover:bg-slate-100 rounded-lg text-3xs font-bold border text-slate-500 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        الملف
                        <ArrowLeft size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
