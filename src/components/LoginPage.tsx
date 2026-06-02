import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LogIn, Mail, Key, AlertCircle, ChevronRight, 
  ArrowRight, User, GraduationCap, ShieldCheck 
} from 'lucide-react';
import { 
  auth, db 
} from '../lib/firebase';
import { 
  signInWithPopup, GoogleAuthProvider, 
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  doc, getDoc, setDoc, collection, query, where, getDocs 
} from 'firebase/firestore';
import { cn } from '../lib/utils';
import { MadrasaNetLogo } from './modern/MadrasaNetLogo';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loginMethod, setLoginMethod] = useState<'google' | 'student'>('student');
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          role: result.user.email === 'wadifamaroc60@gmail.com' ? 'teacher' : 'student',
          points: 0,
          progress: {},
          createdAt: new Date().toISOString(),
          isProfileComplete: true
        });
      }
      onLoginSuccess();
    } catch (err: any) {
      console.error("Google Login error:", err);
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول بجوجل");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !accessCode) {
      setError("يرجى إدخال البريد الإلكتروني ورمز الدخول");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Verify against students collection using accessCode as ID
      const studentDoc = await getDoc(doc(db, 'students', accessCode));
      
      if (!studentDoc.exists()) {
        throw new Error("رمز الدخول غير صحيح.");
      }

      const studentData = studentDoc.data();
      
      if (studentData.email !== email) {
        throw new Error("البريد الإلكتروني لا يتطابق مع رمز الدخول.");
      }

      // 2. Try to Sign In or Create Auth User
      // Note: We use the accessCode as the password for Firebase Auth
      try {
        await signInWithEmailAndPassword(auth, email, accessCode);
      } catch (authErr: any) {
        if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
          // Create new user if they don't exist in Auth yet
          const userCredential = await createUserWithEmailAndPassword(auth, email, accessCode);
          await updateProfile(userCredential.user, {
            displayName: studentData.fullName
          });

          // Create corresponding user profile in 'users' collection
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            email: email,
            displayName: studentData.fullName,
            role: 'student',
            points: 0,
            progress: {},
            studentCode: accessCode,
            classLevel: studentData.classLevel,
            createdAt: new Date().toISOString(),
            isProfileComplete: true
          });
        } else {
          throw authErr;
        }
      }

      onLoginSuccess();
    } catch (err: any) {
      console.error("Student Login error:", err);
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 border border-gray-100 overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-8">
              <MadrasaNetLogo size="lg" showTagline={true} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">تسجيل دخول التلميذ</h1>
            <p className="text-gray-500 font-bold">قسم الثالثة إعدادي</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key="student-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleStudentLogin}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 mr-2 block">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@edu.local"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pr-12 pl-4 focus:border-emerald-500 outline-none transition-all font-bold text-right"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 mr-2 block">كلمة المرور</label>
                <div className="relative">
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="password" 
                    required
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pr-12 pl-4 focus:border-emerald-500 outline-none transition-all font-bold text-right ltr"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center px-2">
                <button 
                  type="button"
                  onClick={() => alert("يرجى التواصل مع أستاذ المادة أو الإدارة لاسترجاع كلمة المرور الخاصة بك.")}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-2xl text-xs font-bold border border-red-100"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span>البريد الإلكتروني أو كلمة المرور غير صحيحة</span>
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    <LogIn size={20} />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          <p className="text-center mt-10 text-gray-400 text-sm font-bold">
            هل تواجه مشكلة؟ اتصل بالدعم الفني للمنصة
          </p>
          
          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <button 
              onClick={handleGoogleLogin}
              className="text-xs font-bold text-gray-400 hover:text-emerald-600 transition-colors"
            >
              دخول الإدارة والأساتذة
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

import { AnimatePresence } from 'framer-motion';
