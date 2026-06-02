import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle, BookOpen } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (token: string, adminUser: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('saberyassine312@gmail.com');
  const [password, setPassword] = useState('saber1997');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشلت عملية التحقق. يرجى مراجعة بيانات الدخول.');
      }

      // Safe saving configurations
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));

      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الاتصال بالسيرفر.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <center>
          <div className="bg-emerald-500 text-slate-950 p-4 rounded-3xl inline-flex shadow-xl shadow-emerald-500/20">
            <BookOpen size={36} className="animate-pulse" />
          </div>
        </center>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          لوحة الإشراف والمراقبة
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          مسؤول الإدارة العامة والمنسق البيداغوجي للمنصة
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-800 py-8 px-6 shadow-2xl rounded-3xl border border-slate-700/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-2xl flex items-start gap-3 text-sm">
                <AlertCircle className="shrink-0 mt-0.5 text-red-400" size={18} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-300">
                البريد الإلكتروني للإدارة
              </label>
              <div className="mt-2 relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                  placeholder="name@school.ma"
                  dir="ltr"
                />
                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500">
                  <Mail size={16} />
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-300">
                كلمة المرور
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                  placeholder="••••••••"
                  dir="ltr"
                />
                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500">
                  <Lock size={16} />
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2.5 py-3 px-4 border border-transparent rounded-2xl shadow-lg shadow-emerald-500/10 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-350 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
              >
                {loading ? 'جاري التحقق والمصادقة...' : 'دخول لوحة التحكم'}
                <LogIn size={18} />
              </button>
            </div>
          </form>

          {/* Credentials quick helpful tips */}
          <div className="mt-6 border-t border-slate-700/60 pt-4 text-center">
            <span className="text-2xs text-slate-400 block font-semibold">حساب تجريبي للإدارة العامة:</span>
            <div className="inline-grid mt-2 text-3xs font-mono text-slate-400 gap-1 bg-slate-950/40 p-3 rounded-2xl border border-slate-700/25">
              <span>البريد: saberyassine312@gmail.com</span>
              <span>كلمة المرور: saber1997</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
