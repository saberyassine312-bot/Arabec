import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, BookOpen, Gamepad2, Sword, 
  Layers, Users, Activity, Settings, 
  LogOut, LayoutDashboard, Database,
  Brain, Type, PenTool, BookMarked,
  X, ChevronRight, Video, BookCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';

interface SidebarProps {
  onClose?: () => void;
  onNavigate?: () => void;
  userRole?: string;
  userEmail?: string;
}

export const EnhancedSidebar: React.FC<SidebarProps> = ({ onClose, onNavigate, userRole, userEmail }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isTeacher = userEmail === 'wadifamaroc60@gmail.com';
  const [activeSession, setActiveSession] = useState<any>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'liveSessions'),
      where('status', '==', 'live'),
      limit(1)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setActiveSession({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setActiveSession(null);
      }
    });
    return unsub;
  }, []);

  const handleMeetAction = (path: string) => {
    if (path === '/remote-communication') {
      if (activeSession?.meetLink) {
        window.open(activeSession.meetLink, '_blank');
      } else {
        navigate(path);
      }
      onNavigate?.();
    } else {
      navigate(path);
      onNavigate?.();
    }
  };

  const menuGroups = [
    {
      label: 'الرئيسية',
      items: [
        { icon: <Home size={20} />, label: 'الرئيسية', path: '/' },
        { icon: <LayoutDashboard size={20} />, label: 'لوحتي التعليمية', path: '/student-dashboard' },
      ]
    },
    {
      label: 'التعلم والتفاعل',
      items: [
        { icon: <BookOpen size={20} />, label: 'المسارات الدراسية', path: '/levels' },
        { icon: <Video size={20} />, label: 'التواصل عن بعد', path: '/remote-communication' },
        { icon: <Gamepad2 size={20} />, label: 'ساحة الألعاب', path: '/game-arena' },
        { icon: <Sword size={20} />, label: 'مغامرة الإعراب', path: '/parsing-adventure' },
        { icon: <BookCheck size={20} />, label: 'التمارين التفاعلية', path: '/exercises' },
        { icon: <Layers size={20} />, label: 'السبورة الإلكترونية', path: '/whiteboard' },
      ]
    },
    {
      label: 'مكونات اللغة',
      items: [
        { icon: <BookMarked size={20} />, label: 'قواعد النحو', path: '/courses?category=grammar' },
        { icon: <Brain size={20} />, label: 'علم الصرف', path: '/courses?category=morphology' },
        { icon: <PenTool size={20} />, label: 'مهارات الإملاء', path: '/courses?category=spelling' },
        { icon: <Type size={20} />, label: 'الإنشاء والتعبير', path: '/composition' },
      ]
    }
  ];

  if (isTeacher || userRole === 'admin' || userRole === 'teacher') {
    menuGroups.push({
      label: 'إدارة المنصة (SaaS)',
      items: [
        { icon: <Activity size={20} />, label: 'الإحصائيات العامة', path: '/admin/stats' },
        { icon: <BookOpen size={20} />, label: 'إدارة الدروس', path: '/admin/lessons' },
        { icon: <Users size={20} />, label: 'إدارة الأساتذة', path: '/admin/teachers' },
        { icon: <Users size={20} />, label: 'قائمة المتعلمين', path: '/admin/students' },
        { icon: <Activity size={20} />, label: 'اختيارات المتعلمين', path: '/admin/insights' },
        { icon: <Database size={20} />, label: 'إدارة البيانات', path: '/seed-data' },
      ]
    });
  }

  return (
    <div className="h-full bg-white border-l border-gray-100 flex flex-col w-72 lg:w-80 rtl select-none overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
        <Link to="/" className="flex items-center gap-4 transition-transform hover:scale-105">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-200">ل</div>
          <div className="flex flex-col text-right">
            <span className="text-2xl font-black text-gray-900 leading-none">لغتي</span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">المنصة الذكية</span>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar space-y-8">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <div className="px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none flex items-center gap-4">
               <span>{group.label}</span>
               <div className="flex-1 h-px bg-gray-50"></div>
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                const isMeet = item.path === '/remote-communication';
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleMeetAction(item.path)}
                    className={cn(
                      "w-full group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 font-bold text-right",
                      isActive 
                        ? "bg-emerald-600 text-white shadow-xl shadow-emerald-100" 
                        : isMeet && activeSession 
                        ? "bg-red-50 text-red-600 border border-red-100 shadow-lg shadow-red-50"
                        : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "transition-transform duration-300 group-hover:scale-110",
                        isActive ? "text-white" : isMeet && activeSession ? "text-red-500 animate-pulse" : "text-gray-400 group-hover:text-emerald-500"
                      )}>
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm">{item.label}</span>
                        {isMeet && activeSession && (
                          <span className="text-[10px] font-black italic">اضغط للانضمام فوراً</span>
                        )}
                      </div>
                    </div>
                    {isActive ? (
                      <motion.div layoutId="active" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-1.5 h-1.5 rounded-full bg-white transition-all"></motion.div>
                    ) : isMeet && activeSession ? (
                        <div className="flex items-center gap-1">
                            <span className="text-[8px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">LIVE</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></div>
                        </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 mt-auto border-t border-gray-50">
        <div className="p-4 bg-gray-50 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-gray-400">تحديثات المنصة مباشرة</span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium leading-relaxed">استفد من آخر التحديثات والأخبار حول تعلم اللغة العربية.</p>
        </div>
      </div>
    </div>
  );
};
