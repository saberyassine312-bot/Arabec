import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, BookOpen, Gamepad2, Sword, 
  Layers, Users, Activity, Settings, 
  LogOut, LayoutDashboard, Database,
  Brain, Type, PenTool, BookMarked,
  Video, ChevronDown, BookCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';

interface HorizontalNavProps {
  userRole?: string;
  userEmail?: string;
  onNavigate?: () => void;
}

export const HorizontalNav: React.FC<HorizontalNavProps> = ({ userRole, userEmail, onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isTeacher = userEmail === 'wadifamaroc60@gmail.com';
  const [activeSession, setActiveSession] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

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
    } else {
      navigate(path);
    }
    setActiveDropdown(null);
    onNavigate?.();
  };

  const menuGroups = [
    {
      label: 'الرئيسية',
      items: [
        { icon: <Home size={18} />, label: 'الرئيسية', path: '/' },
        { icon: <LayoutDashboard size={18} />, label: 'لوحتي التعليمية', path: '/student-dashboard' },
      ]
    },
    {
      label: 'التعلم والتفاعل',
      items: [
        { icon: <BookOpen size={18} />, label: 'المسارات الدراسية', path: '/levels' },
        { icon: <Video size={18} />, label: 'التواصل عن بعد', path: '/remote-communication' },
        { icon: <Gamepad2 size={18} />, label: 'ساحة الألعاب', path: '/game-arena' },
        { icon: <Sword size={18} />, label: 'مغامرة الإعراب', path: '/parsing-adventure' },
        { icon: <BookCheck size={18} />, label: 'التمارين التفاعلية', path: '/exercises' },
        { icon: <Layers size={18} />, label: 'السبورة الإلكترونية', path: '/whiteboard' },
      ]
    },
    {
      label: 'مكونات اللغة',
      items: [
        { icon: <BookMarked size={18} />, label: 'قواعد النحو', path: '/courses?category=grammar' },
        { icon: <Brain size={18} />, label: 'علم الصرف', path: '/courses?category=morphology' },
        { icon: <PenTool size={18} />, label: 'مهارات الإملاء', path: '/courses?category=spelling' },
        { icon: <Type size={18} />, label: 'الإنشاء والتعبير', path: '/composition' },
      ]
    }
  ];

  if (isTeacher || userRole === 'admin' || userRole === 'teacher') {
    menuGroups.push({
      label: 'إدارة المنصة',
      items: [
        { icon: <Activity size={18} />, label: 'الإحصائيات العامة', path: '/admin/stats' },
        { icon: <BookOpen size={18} />, label: 'إدارة الدروس', path: '/admin/lessons' },
        { icon: <Users size={18} />, label: 'إدارة الأساتذة', path: '/admin/teachers' },
        { icon: <Users size={18} />, label: 'قائمة المتعلمين', path: '/admin/students' },
        { icon: <Activity size={18} />, label: 'اختيارات المتعلمين', path: '/admin/insights' },
        { icon: <Database size={18} />, label: 'إدارة البيانات', path: '/seed-data' },
      ]
    });
  }

  return (
    <div className="w-full bg-white border-b border-gray-100 px-6 py-2 shadow-sm flex items-center justify-center gap-2 rtl select-none z-50">
      {menuGroups.map((group, idx) => (
        <div 
          key={idx} 
          className="relative"
          onMouseEnter={() => setActiveDropdown(idx)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all duration-300 whitespace-nowrap",
            activeDropdown === idx ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-50"
          )}>
            <span>{group.label}</span>
            <ChevronDown size={14} className={cn("transition-transform duration-300", activeDropdown === idx && "rotate-180")} />
          </button>

          <AnimatePresence>
            {activeDropdown === idx && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-100 shadow-2xl rounded-[2rem] overflow-hidden z-[60] p-2"
              >
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    const isMeet = item.path === '/remote-communication';
                    
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleMeetAction(item.path)}
                        className={cn(
                          "w-full group flex items-center justify-between p-3.5 rounded-[1.5rem] transition-all duration-300 font-bold text-right",
                          isActive 
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
                            : isMeet && activeSession 
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "transition-transform duration-300 group-hover:scale-110",
                            isActive ? "text-white" : isMeet && activeSession ? "text-red-500 animate-pulse" : "text-gray-400 group-hover:text-emerald-500"
                          )}>
                            {item.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs">{item.label}</span>
                            {isMeet && activeSession && (
                              <span className="text-[9px] font-black italic">مباشر الآن</span>
                            )}
                          </div>
                        </div>
                        {isMeet && activeSession && !isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
