import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, BookOpen, Gamepad2, 
  LayoutDashboard, User, BookCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface MobileBottomNavProps {
  onNavigate?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onNavigate }) => {
  const location = useLocation();

  const items = [
    { icon: <Home size={22} />, label: 'الرئيسية', path: '/' },
    { icon: <BookOpen size={22} />, label: 'المسارات', path: '/levels' },
    { icon: <Gamepad2 size={22} />, label: 'الألعاب', path: '/game-arena' },
    { icon: <BookCheck size={22} />, label: 'التمارين', path: '/exercises' },
    { icon: <LayoutDashboard size={22} />, label: 'لوحتي', path: '/student-dashboard' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around h-20 px-4 pb-2 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => onNavigate?.()}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              isActive ? "text-emerald-600 scale-110" : "text-gray-400"
            )}
          >
            <div className={cn(
                "p-2 rounded-xl transition-all",
                isActive ? "bg-emerald-50" : "bg-transparent"
            )}>
              {item.icon}
            </div>
            <span className="text-[10px] font-black">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
