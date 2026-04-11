import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, AlertCircle, Info, ArrowRight, HelpCircle, Eye, EyeOff, PenTool, ListChecks, ArrowUpCircle } from 'lucide-react';

export default function AlifAfterWawLesson() {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans" dir="rtl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
          <PenTool size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">الألف الفارقة (بعد واو الجماعة)</h1>
        <p className="text-gray-500">متى نكتب الألف بعد حرف الواو ومتى نحذفها؟</p>
      </motion.div>

      {/* Introduction */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
            <Info size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">مقدمة</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm leading-relaxed text-lg">
          <p className="mb-4">
            هل لاحظت يوماً وجود ألف زائدة بعد حرف الواو في بعض الكلمات مثل <span className="font-bold text-indigo-600">"كَتَبُوا"</span>؟ 
            هذه الألف تُسمى <span className="font-bold text-indigo-600 underline">"الألف الفارقة"</span>.
          </p>
          <p className="text-gray-600">
            سُميت بالفارقة لأنها تساعدنا على <span className="font-bold">التفريق</span> بين واو الجماعة والواو الأصلية في الكلمة. وهي ألف تُكتب ولا تُنطق.
          </p>
        </div>
      </section>

      {/* Rules Section */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <ListChecks size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">القاعدة</h2>
        </div>

        <div className="space-y-8">
          {/* When to write */}
          <div className="bg-white p-6 rounded-2xl border-r-8 border-indigo-400 shadow-sm">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">1. متى نكتب الألف بعد الواو؟</h3>
            <p className="mb-4 text-gray-700">نكتبها فقط بعد <span className="font-bold text-indigo-600 underline">واو الجماعة</span> المتصلة بالأفعال:</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
                <span className="font-bold">الماضي:</span>
                <span>لَعِبُوا، خَرَجُوا، نَامُوا.</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
                <span className="font-bold">الأمر:</span>
                <span>اُدْرُسُوا، اِسْمَعُوا، اِجْلِسُوا.</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
                <span className="font-bold">المضارع المحذوف النون:</span>
                <span>لَمْ يَذْهَبُوا، لَنْ يَتَكاسَلُوا.</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-500 italic">ملاحظة: نضعها لنعرف أن هذه الواو ليست جزءاً أصلياً من الكلمة بل هي ضمير يدل على الجماعة.</p>
          </div>

          {/* When NOT to write */}
          <div className="bg-white p-6 rounded-2xl border-r-8 border-rose-400 shadow-sm">
            <h3 className="text-xl font-bold text-rose-700 mb-4">2. متى لا نكتب الألف بعد الواو؟</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                <span className="font-bold">الواو الأصلية:</span>
                <span>إذا كانت الواو من أصل الكلمة (يَدْعُو، نَرْجُو، يَنْمُو).</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                <span className="font-bold">في الأسماء:</span>
                <span>مثل (دَلْو، جَوّ، نُمُوّ، ضَوْء).</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                <span className="font-bold">واو جمع المذكر السالم:</span>
                <span>عندما يكون اسماً (مُعَلِّمُو الْمَدْرَسَةِ، مُهَنْدِسُو الْمَشْرُوعِ).</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                <span className="font-bold">عند اتصال ضمير:</span>
                <span>إذا جاء بعد واو الجماعة ضمير آخر (كَتَبُوهُ، نَصَرُوكُمْ).</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <Eye size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">أمثلة توضيحية</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-indigo-600 mb-4 border-b pb-2">تُكتب الألف (واو الجماعة)</h4>
            <ul className="space-y-4">
              <li className="p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold mb-1">حَفِظُوا</div>
                <div className="text-xs text-gray-500">فعل ماضٍ اتصلت به واو الجماعة.</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold mb-1">اِعْمَلُوا</div>
                <div className="text-xs text-gray-500">فعل أمر موجه لمجموعة من الأشخاص.</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold mb-1">لَمْ يَقُولُوا</div>
                <div className="text-xs text-gray-500">فعل مضارع مجزوم بحذف النون.</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold mb-1">سَافَرُوا</div>
                <div className="text-xs text-gray-500">واو الجماعة تدل على المسافرين.</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold mb-1">اِصْبِرُوا</div>
                <div className="text-xs text-gray-500">فعل أمر يحتاج للألف الفارقة.</div>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-rose-600 mb-4 border-b pb-2">لا تُكتب الألف</h4>
            <ul className="space-y-4">
              <li className="p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold mb-1">يَدْعُو</div>
                <div className="text-xs text-gray-500">واو أصلية (المفرد يدعو).</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold mb-1">مُهَنْدِسُو</div>
                <div className="text-xs text-gray-500">واو جمع المذكر السالم (اسم).</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold mb-1">نَرْجُو</div>
                <div className="text-xs text-gray-500">واو أصلية للفعل.</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold mb-1">ضَوْء</div>
                <div className="text-xs text-gray-500">اسم ينتهي بواو أصلية.</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold mb-1">كَتَبُوهُ</div>
                <div className="text-xs text-gray-500">اتصال الضمير (الهاء) يحذف الألف.</div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="mb-12 bg-indigo-600 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle size={28} className="text-amber-400" />
            <h2 className="text-2xl font-bold">ملاحظات هامة</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                <p>الألف الفارقة <span className="font-bold underline">تُكتب ولا تُنطق</span> أبداً، وظيفتها بصرية فقط.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                <p>للتمييز: إذا حذفت الواو وبقي الفعل صحيحاً فهي واو جماعة (كتبوا {"->"} كتب)، أما إذا اختل المعنى فهي أصلية (يدعو {"->"} يدع؟).</p>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <h4 className="font-bold text-amber-400 mb-2">خطأ شائع:</h4>
              <p className="text-sm text-gray-200 italic">كتابة الألف بعد الواو في كلمة "نرجو" أو "ندعو". الصحيح هو حذفها لأنها واو أصلية.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Exercises Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
              <HelpCircle size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">تمارين تطبيقية</h2>
          </div>
          <button 
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
          >
            {showAnswers ? <><EyeOff size={18} /> إخفاء الحل</> : <><Eye size={18} /> إظهار الحل</>}
          </button>
        </div>

        <div className="space-y-6">
          {/* Exercise 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-700">📝 تمرين 1: صنّف الكلمات (رسموا، ينمو، معلمو، اخرجوا)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 min-h-[100px]">
                <span className="text-xs font-bold text-indigo-600 block mb-2">تحتاج ألف فارقة</span>
                {showAnswers && <div className="text-lg font-bold text-indigo-800">رسموا، اخرجوا</div>}
              </div>
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 min-h-[100px]">
                <span className="text-xs font-bold text-rose-600 block mb-2">لا تحتاج ألف فارقة</span>
                {showAnswers && <div className="text-lg font-bold text-rose-800">ينمو، معلمو</div>}
              </div>
            </div>
          </div>

          {/* Exercise 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-700">📝 تمرين 2: أكمل الكلمات بإضافة الألف عند الحاجة</h4>
            <div className="space-y-3 text-lg">
              <p>1. الطلاب فَهِمـ.... الدرس.</p>
              <p>2. المؤمن يَرْجـ.... رحمة ربه.</p>
              <p>3. اِحْمِلـ.... حقائبكم.</p>
            </div>
            {showAnswers && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                الحل: 1. فَهِمُوا (ألف) | 2. يَرْجُو (بدون ألف) | 3. اِحْمِلُوا (ألف)
              </div>
            )}
          </div>

          {/* Exercise 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-700">📝 تمرين 3: اختر الإجابة الصحيحة</h4>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="mb-3 font-bold">تُسمى الألف بعد واو الجماعة بـ:</p>
              <div className="flex gap-4">
                <span className={`px-4 py-2 rounded-lg border ${showAnswers ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-gray-200'}`}>الألف الفارقة</span>
                <span className={`px-4 py-2 rounded-lg border ${showAnswers ? 'bg-gray-200 text-gray-400' : 'bg-white border-gray-200'}`}>ألف المد</span>
              </div>
            </div>
          </div>

          {/* Exercise 4 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-700">📝 تمرين 4: صحّح الخطأ في الكلمات التالية</h4>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-100 font-bold italic">نرجوا</div>
              <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-100 font-bold italic">لعبو</div>
            </div>
            {showAnswers && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                التصحيح: نرجو | لعبوا
              </div>
            )}
          </div>

          {/* Exercise 5 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-700">📝 تمرين 5: كوّن جملة تحتوي على واو الجماعة</h4>
            {showAnswers && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                مثال: "المسلمون صَامُوا شهر رمضان" أو "اُدْرُسُوا بجد للنجاح".
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pb-12">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg"
        >
          <ArrowUpCircle size={20} />
          العودة لأعلى الدرس
        </button>
      </div>
    </div>
  );
}
