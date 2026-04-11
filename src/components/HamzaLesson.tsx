import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, AlertCircle, Info, ArrowRight, HelpCircle, Eye, EyeOff, Sparkles, ListChecks, ArrowUpCircle, MousePointer2 } from 'lucide-react';

export default function HamzaLesson() {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans" dir="rtl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-4">
          <Sparkles size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">قواعد كتابة الهمزة</h1>
        <p className="text-gray-500">دليل شامل لكتابة الهمزة في أول ووسط وآخر الكلمة</p>
      </motion.div>

      {/* Introduction */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
            <Info size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">مقدمة</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm leading-relaxed text-lg">
          <p className="mb-4">
            الهمزة هي صوت يخرج من الحنجرة، وتعتبر من أهم قواعد الإملاء في اللغة العربية. كتابتها بشكل صحيح تعكس تمكنك من اللغة وتجعل كتابتك واضحة وجميلة.
          </p>
          <p className="text-gray-600">تنقسم الهمزة حسب موقعها إلى ثلاثة أنواع: <span className="font-bold text-blue-600">أول الكلمة</span>، <span className="font-bold text-emerald-600">وسط الكلمة</span>، و<span className="font-bold text-purple-600">آخر الكلمة</span>.</p>
        </div>
      </section>

      {/* Rules Section */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <ListChecks size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">القواعد الأساسية</h2>
        </div>

        <div className="space-y-8">
          {/* Beginning Hamza */}
          <div className="bg-white p-6 rounded-2xl border-r-8 border-blue-400 shadow-sm">
            <h3 className="text-xl font-bold text-blue-700 mb-4">1. الهمزة في أول الكلمة</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">همزة القطع (أ، إ)</h4>
                <p className="text-sm text-gray-600">تُنطق وتُكتب دائماً. مثل: <span className="font-bold">أَكَلَ، إِحْسَان</span>.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">همزة الوصل (ا)</h4>
                <p className="text-sm text-gray-600">تُنطق في أول الكلام وتسقط في وصله. مثل: <span className="font-bold">اسْم، اسْتَخْرَجَ</span>.</p>
              </div>
            </div>
          </div>

          {/* Middle Hamza */}
          <div className="bg-white p-6 rounded-2xl border-r-8 border-emerald-400 shadow-sm">
            <h3 className="text-xl font-bold text-emerald-700 mb-4">2. الهمزة في وسط الكلمة (المتوسطة)</h3>
            <p className="mb-4 text-gray-700">تعتمد كتابتها على <span className="font-bold text-emerald-600 underline">مقارنة حركتها مع حركة الحرف الذي قبلها</span>، ونكتبها على الحرف الذي يناسب الحركة الأقوى.</p>
            
            <div className="bg-emerald-50 p-4 rounded-xl mb-6 border border-emerald-100">
              <h4 className="font-bold text-emerald-800 mb-2 text-center">قاعدة أقوى الحركات</h4>
              <div className="flex items-center justify-center gap-4 text-lg font-bold">
                <span className="text-purple-600">الكسرة (ئ)</span>
                <ArrowRight size={16} className="rotate-180" />
                <span className="text-blue-600">الضمة (ؤ)</span>
                <ArrowRight size={16} className="rotate-180" />
                <span className="text-orange-600">الفتحة (أ)</span>
                <ArrowRight size={16} className="rotate-180" />
                <span className="text-gray-400">السكون (ـ)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-white border border-emerald-100 rounded-xl text-center">
                <span className="text-2xl font-bold text-emerald-600 block">ئ</span>
                <span className="text-xs text-gray-500">على الياء</span>
              </div>
              <div className="p-3 bg-white border border-emerald-100 rounded-xl text-center">
                <span className="text-2xl font-bold text-emerald-600 block">ؤ</span>
                <span className="text-xs text-gray-500">على الواو</span>
              </div>
              <div className="p-3 bg-white border border-emerald-100 rounded-xl text-center">
                <span className="text-2xl font-bold text-emerald-600 block">أ</span>
                <span className="text-xs text-gray-500">على الألف</span>
              </div>
              <div className="p-3 bg-white border border-emerald-100 rounded-xl text-center">
                <span className="text-2xl font-bold text-emerald-600 block">ء</span>
                <span className="text-xs text-gray-500">على السطر</span>
              </div>
            </div>
          </div>

          {/* End Hamza */}
          <div className="bg-white p-6 rounded-2xl border-r-8 border-purple-400 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-4">3. الهمزة في آخر الكلمة (المتطرفة)</h3>
            <p className="mb-4 text-gray-700">تعتمد كتابتها فقط على <span className="font-bold text-purple-600 underline">حركة الحرف الذي يسبقها</span>:</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <span className="w-8 h-8 bg-white text-purple-600 rounded-lg flex items-center justify-center font-bold">أ</span>
                <span>إذا كان ما قبلها <span className="font-bold">مفتوحاً</span> (بَدَأَ)</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <span className="w-8 h-8 bg-white text-purple-600 rounded-lg flex items-center justify-center font-bold">ؤ</span>
                <span>إذا كان ما قبلها <span className="font-bold">مضموماً</span> (تَبَاطُؤ)</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <span className="w-8 h-8 bg-white text-purple-600 rounded-lg flex items-center justify-center font-bold">ئ</span>
                <span>إذا كان ما قبلها <span className="font-bold">مكسوراً</span> (شَاطِئ)</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <span className="w-8 h-8 bg-white text-purple-600 rounded-lg flex items-center justify-center font-bold">ء</span>
                <span>إذا كان ما قبلها <span className="font-bold">ساكناً أو حرف مد</span> (سَمَاء، بَدْء)</span>
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

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-blue-600 mb-4 border-b pb-2">أول الكلمة</h4>
            <div className="space-y-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <span className="font-bold text-lg block">أَحْمَدُ</span>
                <span className="text-xs text-gray-500">قطع: لأنها اسم</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <span className="font-bold text-lg block">اسْتَمَعَ</span>
                <span className="text-xs text-gray-500">وصل: فعل خماسي</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-emerald-600 mb-4 border-b pb-2">وسط الكلمة</h4>
            <div className="space-y-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <span className="font-bold text-lg block">سُؤَالٌ</span>
                <span className="text-xs text-gray-500">على الواو: الضمة أقوى من الفتحة</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <span className="font-bold text-lg block">بِئْرٌ</span>
                <span className="text-xs text-gray-500">على الياء: الكسرة أقوى من السكون</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-purple-600 mb-4 border-b pb-2">آخر الكلمة</h4>
            <div className="space-y-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <span className="font-bold text-lg block">لُؤْلُؤٌ</span>
                <span className="text-xs text-gray-500">على الواو: ما قبلها مضموم</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <span className="font-bold text-lg block">دُعَاءٌ</span>
                <span className="text-xs text-gray-500">على السطر: ما قبلها حرف مد</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="mb-12 bg-gray-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle size={28} className="text-amber-400" />
            <h2 className="text-2xl font-bold">ملاحظات ذكية</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-amber-400 text-gray-900 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                <p>للتمييز بين همزة الوصل والقطع، ضع حرف <span className="text-amber-400 font-bold">"و"</span> قبل الكلمة؛ إذا نُطقت فهي قطع (وأحمد)، وإذا لم تُنطق فهي وصل (واسم).</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-amber-400 text-gray-900 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                <p>الكسرة هي "ملكة الحركات"، إذا وجدت في المقارنة فزت الهمزة بالجلوس على الياء (ئ).</p>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <h4 className="font-bold text-amber-400 mb-2">تجنب هذا الخطأ:</h4>
              <p className="text-sm text-gray-300 italic">كتابة "شئ" بدلاً من "شيء". الهمزة المتطرفة بعد السكون تُكتب على السطر وليس على الياء.</p>
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
            <h4 className="font-bold mb-4 text-gray-700">📝 تمرين 1: صنّف الكلمات (سأل، أخذ، ملجأ)</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <span className="text-xs text-blue-600 block mb-1">أول</span>
                {showAnswers && <span className="font-bold">أخذ</span>}
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                <span className="text-xs text-emerald-600 block mb-1">وسط</span>
                {showAnswers && <span className="font-bold">سأل</span>}
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-center">
                <span className="text-xs text-purple-600 block mb-1">آخر</span>
                {showAnswers && <span className="font-bold">ملجأ</span>}
              </div>
            </div>
          </div>

          {/* Exercise 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-700">📝 تمرين 2: أكمل بالهمزة المناسبة</h4>
            <div className="space-y-3 text-lg">
              <p>1. مـ....ـمن (مؤمن)</p>
              <p>2. ذِ....ـب (ذئب)</p>
              <p>3. قـ....ـرأ (قرأ)</p>
            </div>
            {showAnswers && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                الحل: 1. مؤمن (ؤ) | 2. ذئب (ئ) | 3. قرأ (أ)
              </div>
            )}
          </div>

          {/* Exercise 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-700">📝 تمرين 3: اختر الإجابة الصحيحة</h4>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="mb-3 font-bold">كلمة "سَمَاء" كتبت الهمزة على السطر لأن ما قبلها:</p>
              <div className="flex gap-4">
                <span className={`px-4 py-2 rounded-lg border ${showAnswers ? 'bg-gray-200 text-gray-400' : 'bg-white border-gray-200'}`}>مفتوح</span>
                <span className={`px-4 py-2 rounded-lg border ${showAnswers ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-gray-200'}`}>حرف مد ساكن</span>
              </div>
            </div>
          </div>

          {/* Exercise 4 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-700">📝 تمرين 4: علّل سبب كتابة الهمزة في "رَأْس"</h4>
            {showAnswers && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                السبب: الهمزة ساكنة وما قبلها مفتوح، والفتحة أقوى من السكون، لذا كتبت على الألف.
              </div>
            )}
          </div>

          {/* Exercise 5 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-700">📝 تمرين 5: صحّح الخطأ في الجملة: "الولد بداء القرائة"</h4>
            {showAnswers && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                التصحيح: "الولد <span className="font-bold underline">بَدَأَ</span> <span className="font-bold underline">الْقِرَاءَةَ</span>"
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pb-12">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg"
        >
          <ArrowUpCircle size={20} />
          العودة لأعلى الدرس
        </button>
      </div>
    </div>
  );
}
