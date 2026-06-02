import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/admin/Sidebar';
import { StatCard } from '../../components/admin/StatCard';
import { ChartComponent } from '../../components/admin/ChartComponent';
import { StudentsTable } from '../../components/admin/StudentsTable';
import { ActivityFeed } from '../../components/admin/ActivityFeed';

// Sub Pages
import { Analytics } from './Analytics';
import { Students } from './Students';
import { StudentProfile } from './StudentProfile';
import { Ranking } from './Ranking';

// Icons
import { Users, BookCheck, ClipboardList, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface DashboardProps {
  token: string;
  adminUser: any;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ token, adminUser, onLogout }) => {
  const [currentView, setCurrentView] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States
  const [stats, setStats] = useState<any>({
    totalStudents: 0,
    totalExercises: 0,
    classAverage: 14.5,
    topStudent: '',
    bottomStudent: ''
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsJson = await statsRes.json();

      // 2. Fetch Activities
      const actRes = await fetch('/api/dashboard/activities', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const actJson = await actRes.json();

      // 3. Fetch Advanced Analytics
      const analyticsRes = await fetch('/api/dashboard/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const analyticsJson = await analyticsRes.json();

      if (statsRes.ok) setStats(statsJson);
      if (actRes.ok) setActivities(actJson);
      if (analyticsRes.ok) setAnalyticsData(analyticsJson);

    } catch (err: any) {
      setError('فشل الاتصال بسيرفر بيانات لوحة التحكم والمراقبة الخاصة بالإدارة.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // Handler for viewing a specific student's profile card
  const handleViewProfile = (studentId: string) => {
    setSelectedStudentId(studentId);
    setCurrentView('student_profile');
  };

  const handleBackToStudents = () => {
    setSelectedStudentId(null);
    setCurrentView('students');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans" dir="rtl">
      {/* Admin Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          setSelectedStudentId(null);
        }} 
        onLogout={onLogout} 
        adminName={adminUser?.name || 'الأستاذ صابر'} 
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              {currentView === 'overview' && 'لوحة التحليل والتحكم الشاملة'}
              {currentView === 'analytics' && 'لوحة تحليل المفاهيم الصرفية العميقة'}
              {currentView === 'students' && 'مستودع بطاقات التلاميذ'}
              {currentView === 'student_profile' && 'الملف الهيكلي الشامل للمتعلم'}
              {currentView === 'ranking' && 'جدول ترتيب الفصول الدراسية'}
              {currentView === 'activities' && 'سجل الأنشطة الحية والتتبع'}
            </h1>
            <p className="text-2xs text-slate-400 mt-0.5">مرحباً بك مجدداً، الإدارة العامة للأكاديمية</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-40"
              title="تحديث البيانات الفوري"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin text-emerald-500' : ''} />
            </button>
            <div className="h-5 w-[1px] bg-slate-150"></div>
            <span className="text-xs font-semibold text-slate-500 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100/40">
              التحديث التلقائي مفعّل
            </span>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading && !analyticsData ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-slate-500">جاري تجميع مصفوفة البيانات ومؤشرات الأداء...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold">
              {error}
            </div>
          ) : (
            <>
              {currentView === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Overview Stats Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatCard 
                      title="مجموع التلاميذ" 
                      value={`${stats.totalStudents} تلميذ`} 
                      icon={<Users size={22} className="text-emerald-500" />} 
                      delta="+12%" 
                      isPositive={true}
                    />
                    <StatCard 
                      title="التمارين المنجزة" 
                      value={`${stats.totalExercises} تمرير`} 
                      icon={<BookCheck size={22} className="text-indigo-500" />} 
                      delta="+34%" 
                      isPositive={true}
                    />
                    <StatCard 
                      title="معدل القسم العام" 
                      value={`${stats.classAverage} / 20`} 
                      icon={<ClipboardList size={22} className="text-amber-500" />} 
                      delta="متزن" 
                      isPositive={true}
                    />
                    <StatCard 
                      title="صاحب الصدارة" 
                      value={stats.topStudent || 'التلميذ دحماني 1'} 
                      icon={<TrendingUp size={22} className="text-emerald-600" />} 
                      delta="الأعلى XP" 
                      isPositive={true}
                    />
                    <StatCard 
                      title="أقل أداء" 
                      value={stats.bottomStudent || 'التلميذ دحماني 30'} 
                      icon={<TrendingDown size={22} className="text-rose-500" />} 
                      delta="يحتاج مراجعة" 
                      isPositive={false}
                    />
                  </div>

                  {/* Charts & Graphs Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <ChartComponent 
                        type="bar" 
                        data={analyticsData?.lessonMastery || []} 
                        title="مستوى التحكم البيداغوجي بالدروس (General Mastery)" 
                      />
                    </div>
                    <div>
                      <ChartComponent 
                        type="pie" 
                        data={[
                          { name: 'إجابات موفقة (صحيحة)', value: analyticsData?.successRate || 85 },
                          { name: 'إجابات خاطئة (متكررة)', value: 100 - (analyticsData?.successRate || 85) }
                        ]} 
                        title="معدل النجاح الشامل للتمارين المنجزة" 
                      />
                    </div>
                  </div>

                  {/* Live Feed and Top Students Table Box */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between border-b pb-4 mb-4">
                          <h3 className="text-base font-bold text-slate-800">مستودع بطاقات التلاميذ السريعة</h3>
                          <button 
                            onClick={() => setCurrentView('students')} 
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-bold"
                          >
                            عرض القائمة الشاملة
                          </button>
                        </div>
                        <StudentsTable 
                          students={analyticsData?.lessonMastery ? (activities.slice(0, 5).map(u => ({
                            id: u.studentId || 'std_1',
                            name: u.studentName,
                            email: `${u.studentId || 'std_1'}@school.ma`,
                            class: u.class || 'الأولى إعدادي',
                            xp: 540,
                            averageGrade: 14.8,
                            exerciseCount: 12,
                            performanceTier: 'ممتاز'
                          }))) : []} 
                          onViewProfile={handleViewProfile} 
                        />
                      </div>
                    </div>
                    <div>
                      <ActivityFeed activities={activities.slice(0, 6)} />
                    </div>
                  </div>
                </div>
              )}

              {currentView === 'analytics' && (
                <Analytics token={token} />
              )}

              {currentView === 'students' && (
                <Students token={token} onViewProfile={handleViewProfile} />
              )}

              {currentView === 'student_profile' && (
                <StudentProfile 
                  token={token} 
                  studentId={selectedStudentId} 
                  onBack={handleBackToStudents} 
                />
              )}

              {currentView === 'ranking' && (
                <Ranking token={token} onViewProfile={handleViewProfile} />
              )}

              {currentView === 'activities' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <ActivityFeed activities={activities} />
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h3 className="text-base font-bold text-slate-800 border-b pb-3 mb-4">إحصائيات المراقبة الحية</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <span className="text-sm font-semibold text-slate-500">نشاطات اليوم الإجمالية</span>
                        <span className="text-sm font-bold text-indigo-600">{activities.length} نشاطاً</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <span className="text-sm font-semibold text-slate-500">معدل البقاء في الدرس</span>
                        <span className="text-sm font-bold text-emerald-600">12.5 دقيقة</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <span className="text-sm font-semibold text-slate-500">مستخدمين نشطين الآن</span>
                        <span className="text-sm font-bold text-emerald-600">4 نشطين</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
