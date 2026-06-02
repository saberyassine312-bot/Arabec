import React from 'react';
import { 
  Home, 
  Users, 
  BarChart2, 
  Award, 
  Activity, 
  LogOut, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  adminName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  onLogout, 
  adminName 
}) => {
  const menuItems = [
    { id: 'overview', label: 'الرئيسية والملخص', icon: <Home size={20} /> },
    { id: 'analytics', label: 'تحليل الأداء اللغوي', icon: <BarChart2 size={20} /> },
    { id: 'students', label: 'قائمة التلاميذ والملفات', icon: <Users size={20} /> },
    { id: 'ranking', label: 'ترتيب الفصول والأولياء', icon: <Award size={20} /> },
    { id: 'activities', label: 'مراقبة أنشطة المنصة', icon: <Activity size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen overflow-y-auto border-l border-slate-700 font-sans" dir="rtl">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-800 flex flex-col items-center justify-center gap-2">
        <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
          <BookOpen size={28} className="animate-pulse" />
        </div>
        <div className="text-center mt-2">
          <h2 className="text-lg font-bold text-white tracking-wide">بوابة الإدارة الذكية</h2>
          <p className="text-xs text-slate-400 mt-1">لوحة التتبع والتحليل</p>
        </div>
      </div>

      {/* Admin Profile Mini */}
      <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            {adminName.substring(0, 2)}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{adminName}</h4>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-2xs font-medium bg-emerald-500/10 text-emerald-400 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              مدير النظام
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-250 font-medium ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 text-emerald-400 border-r-4 border-emerald-500 shadow-sm shadow-emerald-500/5' 
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`transition-colors duration-200 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </div>
              <ChevronRight size={14} className={`opacity-40 transition-transform ${isActive ? 'rotate-90 text-emerald-400' : ''}`} />
            </button>
          );
        })}
      </nav>

      {/* Logout Row */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-semibold transition-all duration-200"
        >
          <LogOut size={20} />
          <span>تسجيل الخروج الآمن</span>
        </button>
      </div>
    </div>
  );
};
