import React, { useState, useEffect } from 'react';
import { EnhancedSidebar } from './EnhancedSidebar';
import { EnhancedNavbar } from './EnhancedNavbar';
import { HorizontalNav } from './HorizontalNav';
import { MobileBottomNav } from './MobileBottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { cn } from '../../lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: any;
}

import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';
import { updateDoc } from 'firebase/firestore';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user?.uid) {
      const unsub = onSnapshot(doc(db, 'users', user.uid), 
        async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setProfile(data);
            
            // Auto-fix admin role if email matches but role doesn't
            if (user.email === 'wadifamaroc60@gmail.com' && data.role !== 'admin') {
              try {
                await updateDoc(doc(db, 'users', user.uid), { role: 'admin' });
              } catch (e) {
                console.error("Failed to auto-fix admin role:", e);
              }
            }
          }
        },
        (error) => {
          if (auth.currentUser) {
            handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          }
        }
      );
      return () => unsub();
    }
  }, [user?.uid, user?.email]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleNav = () => setIsNavHidden(!isNavHidden);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans rtl overflow-hidden select-none" dir="rtl">
      {/* Top Header Section */}
      <div className="flex flex-col sticky top-0 z-50">
        <AnimatePresence>
          {!isNavHidden && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="w-full bg-white"
            >
              <EnhancedNavbar 
                user={user} 
                onOpenMobileMenu={toggleMobileMenu}
                xp={profile?.xp || 0}
                streak={profile?.streak || 0}
              />
              <div className="hidden lg:block border-t border-gray-50">
                <HorizontalNav 
                  userRole={profile?.role} 
                  userEmail={user?.email} 
                  onNavigate={() => setIsNavHidden(true)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Menu Toggle Button for Single View Mode */}
        <AnimatePresence>
          {isNavHidden && (
            <motion.button
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              onClick={toggleNav}
              className="fixed top-4 right-1/2 translate-x-1/2 z-[100] bg-emerald-600 text-white px-10 py-4 rounded-[2rem] font-black shadow-[0_20px_50px_rgba(16,185,129,0.3)] border-2 border-white/20 flex items-center gap-4 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 group"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform">
                <span className="text-xl">☰</span>
              </div>
              <span className="text-lg tracking-tight">القائمة الرئيسية</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar Mobile Overlay (Keeping it for mobile convenience) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[70] lg:hidden shadow-2xl"
            >
              <EnhancedSidebar 
                onClose={toggleMobileMenu} 
                onNavigate={() => {
                  toggleMobileMenu();
                  setIsNavHidden(true);
                }}
                userRole={profile?.role} 
                userEmail={user?.email} 
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <main className={cn(
          "flex-1 overflow-y-auto custom-scrollbar pb-24 lg:pb-12 transition-all duration-500",
          isNavHidden 
            ? "px-4 py-20 lg:px-20 lg:py-24 h-screen" 
            : "px-4 py-8 lg:px-10 lg:py-12 h-[calc(100vh-5rem)] lg:h-[calc(100vh-8.5rem)]"
        )}>
           <div className={cn(
             "mx-auto space-y-12 transition-all duration-500",
             isNavHidden ? "max-w-screen-2xl" : "max-w-7xl"
           )}>
             <motion.div
               layout
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4 }}
             >
                {children}
             </motion.div>
           </div>
        </main>
      </div>

      <AnimatePresence>
        {!isNavHidden && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
          >
            <MobileBottomNav onNavigate={() => setIsNavHidden(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

