import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Settings, 
  Key, 
  Code2, 
  Database, 
  Layout, 
  ShieldCheck, 
  Bell, 
  CheckCircle, 
  Lightbulb, 
  ChevronRight, 
  ExternalLink,
  Copy,
  Terminal
} from 'lucide-react';

export default function GoogleMeetGuide() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: "مقدمة", icon: <Video className="text-blue-500" /> },
    { title: "المتطلبات", icon: <Settings className="text-gray-500" /> },
    { title: "إعداد Cloud", icon: <Key className="text-amber-500" /> },
    { title: "إنشاء الاجتماع", icon: <Code2 className="text-emerald-500" /> },
    { title: "الربط بالمنصة", icon: <Database className="text-purple-500" /> },
    { title: "واجهة المستخدم", icon: <Layout className="text-pink-500" /> },
    { title: "الأمان", icon: <ShieldCheck className="text-red-500" /> },
    { title: "الإشعارات", icon: <Bell className="text-orange-500" /> },
    { title: "الاختبار", icon: <CheckCircle className="text-green-500" /> },
    { title: "نصائح", icon: <Lightbulb className="text-yellow-500" /> }
  ];

  const codeExample = `
// Node.js Example using googleapis
const { google } = require('googleapis');

async function createMeetLink(auth, eventDetails) {
  const calendar = google.calendar({ version: 'v3', auth });
  
  const event = {
    summary: eventDetails.title,
    description: eventDetails.description,
    start: { dateTime: eventDetails.startTime },
    end: { dateTime: eventDetails.endTime },
    conferenceData: {
      createRequest: {
        requestId: "sample123",
        conferenceSolutionKey: { type: "hangoutsMeet" }
      }
    }
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1,
  });

  return response.data.hangoutLink; // رابط Google Meet
}`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white min-h-screen font-sans" dir="rtl">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block p-3 bg-blue-50 rounded-2xl mb-4"
        >
          <Video size={48} className="text-blue-600" />
        </motion.div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">دليل ربط المنصة التعليمية بـ Google Meet</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">دليل عملي للمطورين لإنشاء نظام حصص مباشرة متكامل واحترافي.</p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar Navigation */}
        <aside className="space-y-2">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all text-right ${
                activeStep === index 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 font-bold' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className={activeStep === index ? 'text-white' : ''}>{step.icon}</span>
              <span>{step.title}</span>
              {activeStep === index && <ChevronRight size={18} className="mr-auto rotate-180" />}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="bg-gray-50 rounded-3xl p-6 md:p-10 border border-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeStep === 0 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">1. مقدمة</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    يعتبر Google Meet أحد أقوى الحلول لعقد الاجتماعات المرئية. بدلاً من بناء نظام بث خاص مكلف ومعقد، يمكنك استغلال البنية التحتية لشركة Google لتوفير تجربة تعليمية سلسة لطلابك.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-white p-4 rounded-2xl border border-blue-100">
                      <h4 className="font-bold text-blue-600 mb-2">سهولة الاستخدام</h4>
                      <p className="text-sm text-gray-500">واجهة مألوفة للطلاب والمدرسين لا تحتاج لتدريب.</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-emerald-100">
                      <h4 className="font-bold text-emerald-600 mb-2">جودة البث</h4>
                      <p className="text-sm text-gray-500">بث مستقر بجودة عالية حتى مع سرعات الإنترنت الضعيفة.</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-purple-100">
                      <h4 className="font-bold text-purple-600 mb-2">توفير التكلفة</h4>
                      <p className="text-sm text-gray-500">لا حاجة لخوادم بث خاصة أو دفع مبالغ طائلة لمنصات خارجية.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">2. المتطلبات الأساسية</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200">
                      <CheckCircle className="text-green-500 mt-1 shrink-0" />
                      <div>
                        <span className="font-bold block">حساب Google Workspace:</span>
                        <span className="text-gray-600">يفضل حساب تعليمي أو تجاري للحصول على ميزات إضافية مثل التسجيل.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200">
                      <CheckCircle className="text-green-500 mt-1 shrink-0" />
                      <div>
                        <span className="font-bold block">مشروع على Google Cloud:</span>
                        <span className="text-gray-600">المكان الذي ستدير فيه صلاحيات الوصول للـ API.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200">
                      <CheckCircle className="text-green-500 mt-1 shrink-0" />
                      <div>
                        <span className="font-bold block">تفعيل Calendar API:</span>
                        <span className="text-gray-600">لأن روابط Meet يتم إنشاؤها كجزء من أحداث التقويم.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">3. إعداد Google Cloud</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border-r-4 border-amber-400 rounded-lg">
                      <p className="font-bold text-amber-800">خطوات التنفيذ:</p>
                      <ol className="list-decimal list-inside mt-2 space-y-2 text-amber-900">
                        <li>توجه إلى <a href="https://console.cloud.google.com" target="_blank" className="underline font-bold">Google Cloud Console</a>.</li>
                        <li>أنشئ مشروعاً جديداً باسم منصتك التعليمية.</li>
                        <li>من قسم <span className="font-bold">APIs & Services</span>، ابحث عن <span className="font-bold">Google Calendar API</span> وقم بتفعيله.</li>
                        <li>انتقل إلى <span className="font-bold">OAuth consent screen</span> وقم بتهيئة المعلومات الأساسية.</li>
                        <li>في قسم <span className="font-bold">Credentials</span>، أنشئ <span className="font-bold">OAuth 2.0 Client ID</span> من نوع "Web Application".</li>
                        <li>أضف رابط منصتك في <span className="font-bold">Authorized redirect URIs</span>.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">4. إنشاء الاجتماع تلقائياً</h2>
                  <p className="text-gray-700">السر يكمن في إرسال طلب لإنشاء حدث في التقويم مع تفعيل خاصية <span className="font-mono bg-gray-200 px-1 rounded">conferenceData</span>.</p>
                  
                  <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-400 text-xs">
                      <span className="flex items-center gap-2"><Terminal size={14} /> server.js</span>
                      <button className="hover:text-white flex items-center gap-1"><Copy size={14} /> نسخ</button>
                    </div>
                    <pre className="p-4 text-emerald-400 font-mono text-sm overflow-x-auto ltr">
                      <code>{codeExample}</code>
                    </pre>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-2">كيف تحصل على الرابط؟</h4>
                    <p className="text-sm text-blue-700">بعد نجاح الطلب، سيعيد الـ API كائناً يحتوي على <span className="font-mono font-bold">hangoutLink</span>. هذا هو الرابط الذي ستحفظه في قاعدة بياناتك.</p>
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">5. ربط الاجتماع بالمنصة</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h4 className="font-bold mb-4 flex items-center gap-2 text-purple-600">
                        <Database size={20} /> قاعدة البيانات
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">يجب إضافة حقل <span className="font-mono bg-gray-100 px-1">meet_link</span> في جدول الحصص (Lessons/Sessions).</p>
                      <div className="bg-gray-50 p-3 rounded-lg font-mono text-xs text-gray-500">
                        TABLE sessions (<br/>
                        &nbsp;&nbsp;id INT,<br/>
                        &nbsp;&nbsp;title VARCHAR,<br/>
                        &nbsp;&nbsp;meet_link TEXT,<br/>
                        &nbsp;&nbsp;start_time DATETIME<br/>
                        )
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h4 className="font-bold mb-4 flex items-center gap-2 text-emerald-600">
                        <Layout size={20} /> الربط المنطقي
                      </h4>
                      <p className="text-sm text-gray-600">عندما يقوم المدرس بجدولة حصة، يتم استدعاء الـ API وحفظ الرابط الناتج فوراً ليكون متاحاً للطلاب في الوقت المحدد.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">6. واجهة المستخدم (UI)</h2>
                  <div className="space-y-8">
                    <div className="border-2 border-dashed border-gray-200 p-6 rounded-3xl">
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 text-center">معاينة واجهة المدرس</h4>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold">حصة اللغة العربية - النحو</h5>
                          <p className="text-xs text-gray-500">اليوم، 10:00 صباحاً</p>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                          <Video size={16} /> إنشاء رابط الاجتماع
                        </button>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 p-6 rounded-3xl">
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 text-center">معاينة واجهة الطالب</h4>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold">حصة اللغة العربية - النحو</h5>
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded mt-1">مباشر الآن</span>
                        </div>
                        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                          <ExternalLink size={16} /> انضم للحصة الآن
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 6 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">7. الصلاحيات والأمان</h2>
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                    <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                      <ShieldCheck size={20} /> إجراءات أمنية ضرورية
                    </h4>
                    <ul className="space-y-3 text-red-900">
                      <li className="flex gap-2">
                        <span className="font-bold">•</span>
                        <span>تحقق من هوية المستخدم (Role Check) قبل السماح بطلب إنشاء رابط.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">•</span>
                        <span>لا تظهر رابط الاجتماع للطالب إلا قبل موعد الحصة بـ 5-10 دقائق.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">•</span>
                        <span>استخدم <span className="font-bold">Refresh Tokens</span> لضمان عدم انقطاع اتصال المدرس بـ Google.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeStep === 7 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">8. الإشعارات</h2>
                  <p className="text-gray-700">لضمان حضور الطلاب، يجب تفعيل نظام إشعارات ذكي:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <h5 className="font-bold mb-2 flex items-center gap-2">
                        <Bell size={16} className="text-orange-500" /> قبل الحصة بـ 15 دقيقة
                      </h5>
                      <p className="text-sm text-gray-500">إرسال بريد إلكتروني يحتوي على تفاصيل الحصة ورابط الدخول.</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <h5 className="font-bold mb-2 flex items-center gap-2">
                        <Bell size={16} className="text-blue-500" /> عند بدء البث
                      </h5>
                      <p className="text-sm text-gray-500">إشعار فوري (Push Notification) داخل المنصة يخبر الطالب أن المدرس دخل القاعة.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 8 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">9. اختبار التكامل</h2>
                  <div className="space-y-4">
                    <p className="text-gray-700">قبل الإطلاق، تأكد من تجربة السيناريوهات التالية:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>إنشاء حصة وتغيير موعدها (هل يتحدث الرابط؟).</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>دخول طالب قبل الموعد (هل تظهر رسالة انتظار؟).</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>انتهاء صلاحية الـ Access Token (هل يتم التجديد تلقائياً؟).</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 9 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">10. نصائح احترافية</h2>
                  <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb size={24} className="text-yellow-600" />
                      <h4 className="font-bold text-yellow-800">للمحترفين فقط:</h4>
                    </div>
                    <ul className="space-y-4 text-yellow-900">
                      <li>
                        <span className="font-bold">Webhooks:</span> استخدم Webhooks لمراقبة حالة الاجتماع (هل بدأ؟ هل انتهى؟).
                      </li>
                      <li>
                        <span className="font-bold">المزامنة:</span> اسمح للمدرسين برؤية حصص المنصة داخل تطبيق Google Calendar الخاص بهم.
                      </li>
                      <li>
                        <span className="font-bold">التسجيل:</span> إذا كنت تستخدم Google Workspace، يمكنك جلب رابط التسجيل بعد انتهاء الحصة ووضعه في أرشيف المنصة تلقائياً.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer CTA */}
      <div className="mt-12 p-8 bg-gray-900 rounded-3xl text-white text-center">
        <h3 className="text-2xl font-bold mb-4">هل أنت مستعد للبدء؟</h3>
        <p className="text-gray-400 mb-6">ابدأ بتهيئة مشروعك على Google Cloud اليوم وارفع مستوى منصتك التعليمية.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="https://developers.google.com/calendar/api/guides/auth" 
            target="_blank" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            وثائق Google Calendar API <ExternalLink size={18} />
          </a>
          <button 
            onClick={() => window.print()}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            تحميل الدليل بصيغة PDF <Copy size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
