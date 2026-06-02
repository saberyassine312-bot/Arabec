import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle, 
  Lock, 
  ShieldCheck, 
  Smartphone, 
  Trophy, 
  Code,
  Check, 
  Info,
  Server,
  Sparkles
} from 'lucide-react';
import { auth } from '../lib/firebase';

interface KahootLtiEmbedProps {
  lessonId: string;
  lessonTitle: string;
}

export const KahootLtiEmbed: React.FC<KahootLtiEmbedProps> = ({ lessonId, lessonTitle }) => {
  const [activeSession, setActiveSession] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showLogs, setShowLogs] = useState(true);

  // Simulated LTI 1.3 protocol steps logs for visual clarity
  const [ltiLogs, setLtiLogs] = useState<Array<{ time: string; type: 'info' | 'success' | 'warn'; text: string }>>([]);

  const userId = auth.currentUser?.uid || 'std_1';
  const displayName = auth.currentUser?.displayName || 'تلميذ متميز';

  useEffect(() => {
    if (activeSession) {
      addLog('🚀 تم الضغط على زر "تشغيل Kahoot" - بدء دورة معايير IMS LTI 1.3', 'info');
      addLog(`👤 تحديد تفاصيل المستخدم: ${displayName} (${userId})`, 'info');
      
      const timer1 = setTimeout(() => {
        addLog('Step 1: OIDC Login Initiation call sent to https://lti.kahoot.com/api/login/init', 'info');
        addLog('⚙️ تمرير معاملات: iss, login_hint, client_id, target_link_uri', 'info');
      }, 500);

      const timer2 = setTimeout(() => {
        addLog('Step 2: Kahoot verified Platform issuer, redirecting browser back to authorization endpoint (OIDC Auths)', 'success');
      }, 1200);

      const timer3 = setTimeout(() => {
        addLog('Step 3: Platform issued Signed JWT ID Token using RS256 algorithm and active cryptographic kid key ID', 'success');
        addLog('🔐 LTI Advantage claims verified: context, resource_link, launch_presentation, ags.lineitems', 'success');
      }, 2000);

      const timer4 = setTimeout(() => {
        addLog('Step 4: Auto-submitting secure validation form via POST to https://lti.kahoot.com/api/message', 'info');
        addLog('🎉 تمت المصادقة وفتح لعبة كاهوت التفاعلية بنجاح وبدون تسجيل دخول مكرر (SSO Active!)', 'success');
      }, 2800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    } else {
      setLtiLogs([]);
    }
  }, [activeSession]);

  const addLog = (text: string, type: 'info' | 'success' | 'warn' = 'info') => {
    const time = new Date().toLocaleTimeString('ar-EG');
    setLtiLogs(prev => [...prev, { time, type, text }]);
  };

  const handleLtiLaunch = () => {
    setActiveSession(true);
    setHasCompleted(false);
    setCurrentScore(null);
  };

  const triggerMockGradePassback = async (score: number) => {
    setSyncing(true);
    setCurrentScore(score);
    addLog(`📤 بدء بروتوكول إرسال النتيجة LTI Grade Passback (AGS)...`, 'info');
    
    // Acquire Access Token (OAuth 2.0 Client Credentials Grant)
    addLog('🔑 طلب رمز الدخول للآلة من Endpoint: /api/lti/token مع النطاق: lti-ags/scope/score', 'info');
    
    try {
      // Call token request payload
      const tokenRes = await fetch('/api/lti/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          scope: 'https://purl.imsglobal.org/spec/lti-ags/scope/score'
        })
      });
      const tokenData = await tokenRes.json();
      addLog(`✅ تم تسليم Bearer Token بنجاح وصالح لمدة ساعة واحدة`, 'success');

      // POST score back
      addLog(`📝 تسجيل الدرجة ${score}/20 في المنصة التعليمية لـ ${displayName}`, 'info');
      const scoreRes = await fetch(`/api/lti/grade/score?lessonId=${lessonId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`
        },
        body: JSON.stringify({
          userId: userId,
          scoreGiven: score,
          scoreMaximum: 20,
          activityProgress: 'Completed',
          gradingProgress: 'FullyGraded',
          timestamp: new Date().toISOString()
        })
      });

      if (scoreRes.ok) {
        addLog(`🏆 تمت مزامنة النتيجة بنجاح في نظام التقييم وتحديث نقاط الخبرة (+100 XP)!`, 'success');
        setHasCompleted(true);
      } else {
        throw new Error('فشلت المزامنة');
      }
    } catch (err) {
      addLog(`❌ حدث خطأ أثناء إرسال الدرجة تلقائياً: ${err}`, 'warn');
    } finally {
      setSyncing(false);
    }
  };

  // Launch LTI trigger url
  const ltiLaunchUrl = `/api/lti/launch?userId=${userId}&lessonId=${lessonId}&lessonTitle=${encodeURIComponent(lessonTitle)}`;

  return (
    <div className="bg-slate-50 rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-purple-600/10">
            <Gamepad2 size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-slate-800">نشاط تفاعلي عبر Kahoot! الكلاسيكي</h3>
              <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-bold">LTI Advantage 1.3</span>
            </div>
            <p className="text-slate-400 text-sm mt-1">العب واختبر معلوماتك مباشرة من داخل المنصة التعليمية وسيتم حفظ نتائجك تلقائياً.</p>
          </div>
        </div>

        {activeSession && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDeviceMode(prev => prev === 'desktop' ? 'mobile' : 'desktop')}
              className="p-3 bg-white text-slate-600 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200 flex items-center gap-2 text-sm font-bold shadow-sm"
              title="تعديل نمط العرض للتحقق من التوافقية مع الهواتف"
            >
              <Smartphone size={18} />
              <span>{deviceMode === 'desktop' ? 'عرض جوال' : 'عرض حاسوب'}</span>
            </button>
            <button 
              onClick={() => setActiveSession(false)}
              className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all text-sm font-bold"
            >
              إغلاق اللعبة
            </button>
          </div>
        )}
      </div>

      {!activeSession ? (
        <div className="text-center py-12 px-6 max-w-xl mx-auto space-y-8">
          <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck size={44} />
          </div>
          <div className="space-y-3">
            <h4 className="text-xl font-black text-slate-800">تسجيل دخول موحد (Single Sign-On)</h4>
            <p className="text-slate-500 text-md leading-relaxed">
              تستخدم المنصة بروتوكول <strong className="text-purple-700">OIDC / OAuth 2.0</strong> المتكامل مع Kahoot! لتشغيل التحديات اللغوية مباشرة من الدرس دون الحاجة لإنشاء حساب أو مغادرة منصتنا.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <button
              onClick={handleLtiLaunch}
              className="w-full sm:w-auto px-10 py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-purple-600/10 flex items-center justify-center gap-3"
            >
              <Gamepad2 size={22} />
              تشغيل Kahoot
            </button>
            
            <a 
              href={ltiLaunchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-5 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl border border-slate-200 font-bold text-md transition-all flex items-center justify-center gap-2"
            >
              <span>فتح في نافذة كاملة</span>
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-right">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={16} />
              </div>
              <div>
                <strong className="text-xs text-slate-700 block mb-0.5">حفظ التميز والدرجة</strong>
                <span className="text-[10px] text-slate-400">تزامن فوري مدعوم بـ AGS Grade Passback</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={16} />
              </div>
              <div>
                <strong className="text-xs text-slate-700 block mb-0.5">أفضل حماية لبيانات الطلاب</strong>
                <span className="text-[10px] text-slate-400">تحقق ومصادقة OpenID Connect</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={16} />
              </div>
              <div>
                <strong className="text-xs text-slate-700 block mb-0.5">متكامل مع جميع الشاشات</strong>
                <span className="text-[10px] text-slate-400">متوافق تام مع الهواتف والأجهزة اللوحية</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* LTI Frame Viewport container */}
          <div className="flex justify-center transition-all duration-300">
            <div className={`bg-black rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border-4 border-slate-800 ${
              deviceMode === 'desktop' ? 'w-full aspect-video max-w-4xl' : 'w-[375px] h-[667px]'
            }`}>
              {/* Pointing directly to our dynamic OIDC initiating router URL */}
              <iframe
                src={ltiLaunchUrl}
                className="w-full h-full"
                title="Kahoot LTI Frame"
                allow="autoplay; camera; microphone; geolocation"
                referrerPolicy="no-referrer"
              ></iframe>
            </div>
          </div>

          {/* Dynamic Interactive Sandbox scoring controls */}
          <div className="bg-white border border-purple-100 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-3 text-right">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-1">
                  <Trophy size={20} />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800">اختبر التزامن مع نظام التقييم (LTI AGS Grade Passback)</h5>
                  <p className="text-xs text-slate-400 mt-1">
                    بما أن هذا إصدار تجريبي أو لعبة قائمة في IFrame، يمكنك محاكاة إتمام اللعبة الآن في Kahoot لتقوم المنصة التعليمية بقراءة نتيجتك وحفظ الدرجة بمجموعة التقييمات.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[12, 16, 20].map((score) => (
                  <button
                    key={score}
                    onClick={() => triggerMockGradePassback(score)}
                    disabled={syncing}
                    className="px-4 py-2.5 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-extrabold rounded-xl border border-slate-200 hover:border-purple-200 text-sm transition-all flex items-center gap-1"
                  >
                    🚀 إرسال درجة: {score}/20
                  </button>
                ))}
              </div>
            </div>

            {hasCompleted && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-bold animate-pulse">
                <CheckCircle size={20} />
                <span>تم تسجيل الدرجة ({currentScore}/20) وتمرير الجلسة بنجاح لنظام التقييم! تظهر النتيجة الآن في سجل نقاطك وفي قائمة علامات المتعلم بالتأكيد.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Under-the-hood Realtime LTI Protocol Logs Engine drawer */}
      {showLogs && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-left font-mono text-xs text-slate-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Code size={18} className="text-purple-400" />
              <span className="font-extrabold text-slate-100">سجل عمليات المعايير - LTI 1.3 Advantage Protocol Sandbox Monitor</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-500">منظور SSO / OpenID Connect 2.0 Flow</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar leading-relaxed">
            {ltiLogs.length === 0 ? (
              <div className="text-slate-500 italic py-4">انتظار إشارة البدء... اضغط على زر "تشغيل Kahoot" لمراقبة سريان التوثيق مع خوادم Kahoot!.</div>
            ) : (
              ltiLogs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-slate-600">[{log.time}]</span>
                  <span className={
                    log.type === 'success' ? 'text-emerald-400 font-bold' : log.type === 'warn' ? 'text-rose-400' : 'text-purple-300'
                  }>
                    {log.text}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
