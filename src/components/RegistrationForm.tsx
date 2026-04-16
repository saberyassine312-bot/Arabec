import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, School, Hash, ArrowRight, CheckCircle2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface RegistrationFormProps {
  userId: string;
  onComplete: () => void;
}

export default function RegistrationForm({ userId, onComplete }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gradeLevel: '',
    section: '',
    orderNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...formData,
        isProfileComplete: true,
        displayName: `${formData.firstName} ${formData.lastName}`,
      });
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 p-8 border border-indigo-50"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 rotate-3">
            <User size={40} className="text-white -rotate-3" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">مرحباً بك في منصتك</h1>
          <p className="text-gray-500 font-medium">لنقم بإعداد ملفك الشخصي للبدء في رحلة التعلم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 mr-1">الاسم الشخصي</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold"
                  placeholder="مثال: محمد"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 mr-1">النسب (العائلي)</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold"
                  placeholder="مثال: العلمي"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 mr-1">المستوى الدراسي</label>
            <div className="relative">
              <select
                required
                value={formData.gradeLevel}
                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold appearance-none"
              >
                <option value="">اختر مستواك</option>
                <option value="1apic">الأولى إعدادي</option>
                <option value="2apic">الثانية إعدادي</option>
                <option value="3apic">الثالثة إعدادي</option>
              </select>
              <School size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 mr-1">القسم</label>
              <input
                required
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold"
                placeholder="مثال: 1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 mr-1">الرقم الترتيبي</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold"
                  placeholder="مثال: 15"
                />
                <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>تأكيد التسجيل</span>
                <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 font-bold">
          <CheckCircle2 size={14} />
          <span>سيتم حفظ بياناتك بأمان ولن يطلب منك التسجيل مرة أخرى</span>
        </div>
      </motion.div>
    </div>
  );
}
