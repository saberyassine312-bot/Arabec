import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, Bell, User, LogOut, 
  Menu, X, Sparkles, Zap, Flame,
  Target, GraduationCap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { MadrasaNetLogo } from './MadrasaNetLogo';

interface EnhancedNavbarProps {
  user: any;
  onOpenMobileMenu: () => void;
  xp?: number;
  streak?: number;
}

export const EnhancedNavbar: React.FC<EnhancedNavbarProps> = ({ 
  user, onOpenMobileMenu, xp = 0, streak = 0 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="h-20 bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-[40] flex items-center px-6 lg:px-10 justify-between rtl">
      {/* Left items: Search and Mobile Menu */}
      <div className="flex items-center gap-4 lg:gap-8 flex-1">
        <button 
          onClick={onOpenMobileMenu}
          className="lg:hidden p-3 bg-gray-50 text-gray-500 rounded-2xl border border-gray-100 hover:bg-white transition-all shadow-sm"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-2.5 w-72 lg:w-96 group focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
          <Search size={18} className="text-gray-400 group-focus-within:text-emerald-500" />
          <input 
            type="text" 
            placeholder="ابحث عن درس، قاعدة، أو لعبة..." 
            className="bg-transparent border-none outline-none w-full text-sm font-bold text-gray-700 placeholder:text-gray-400 text-right"
          />
        </div>
      </div>

      {/* 🌟 Center Branding: MadrasaNet Logo Integration */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center pointer-events-auto z-10 transition-all">
        <Link to="/" className="flex items-center">
          <MadrasaNetLogo size="md" showTagline={true} />
        </Link>
      </div>

      {/* 📱 Mobile Branding (Slightly smaller, fits all smaller devices) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex md:hidden items-center justify-center pointer-events-auto z-10 transition-all">
        <Link to="/" className="flex items-center">
          <MadrasaNetLogo size="sm" showTagline={false} />
        </Link>
      </div>

      {/* Right items: Stats and Profile */}
      <div className="flex items-center gap-3 md:gap-6">
        {user && (
          <div className="hidden sm:flex items-center gap-4 bg-emerald-50/50 rounded-2xl px-5 py-2.5 border border-emerald-100/50">
             <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                <span className="text-sm font-black text-emerald-700">{xp} XP</span>
             </div>
             <div className="w-px h-4 bg-emerald-200"></div>
             <div className="flex items-center gap-2">
                <Flame size={16} className="text-orange-500" />
                <span className="text-sm font-black text-emerald-700">{streak}</span>
             </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 bg-gray-50 text-gray-500 rounded-2xl border border-gray-100 hover:bg-white transition-all relative group"
          >
            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
            <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1.5 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all group"
            >
              <div className="hidden md:flex flex-col text-right mr-2 ml-1">
                 <span className="text-xs font-black text-gray-900 leading-tight truncate max-w-[120px]">{user?.displayName || 'المستخدم'}</span>
                 <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">الحساب الشخصي</span>
              </div>
              <div className="w-11 h-11 bg-emerald-600 rounded-xl overflow-hidden shadow-lg border-2 border-white transition-transform group-hover:scale-105">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <User size={24} />
                  </div>
                )}
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-3 w-64 bg-white border border-gray-100 shadow-2xl rounded-[2rem] overflow-hidden z-50 p-3"
                  >
                     <div className="p-4 border-b border-gray-50 mb-2 space-y-3">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                              <GraduationCap size={24} />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-gray-400">مستوى التعلم</span>
                              <span className="text-sm font-black text-indigo-600">جدع مشترك</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="space-y-1">
                        <Link to="/student-dashboard" className="flex items-center gap-3 p-4 text-sm font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition-all">
                           <Target size={18} />
                           <span>تطور أهدافي</span>
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 p-4 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                        >
                           <LogOut size={18} />
                           <span>تسجيل الخروج</span>
                        </button>
                     </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};
