import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Info, CheckCircle2, AlertCircle, Layers, ArrowRight, Sun, RotateCcw } from 'lucide-react';

export default function ParsingLesson() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 bg-white rounded-3xl shadow-sm border border-gray-100">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl mb-4">
          <BookOpen size={40} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 leading-tight">📘 الدرس الأول: الإعراب</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          رحلتنا الأولى في عالم النحو تبدأ بفهم كيف تتغير الكلمات وتتفاعل داخل الجملة.
        </p>
      </div>

      {/* 1. Definition of Parsing */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-2xl font-bold text-gray-800 border-r-4 border-emerald-500 pr-4">
          <Info className="text-emerald-500" />
          <h2>أولاً: ما هو الإعراب؟</h2>
        </div>
        <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
          <p className="text-lg text-gray-700 leading-relaxed">
            <span className="font-bold text-emerald-700">الإعراب</span> هو تغيير يحدث في <span className="underline decoration-emerald-300 decoration-2 underline-offset-4">آخر الكلمة</span> حسب موقعها في الجملة. هذا التغيير قد يكون:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {['الرفع ⬆️', 'النصب ⬇️', 'الجر ↘️', 'الجزم ⏹️'].map((type, i) => (
              <div key={i} className="bg-white p-4 rounded-xl text-center font-bold text-emerald-600 shadow-sm border border-emerald-100">
                {type}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Declined Word */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-2xl font-bold text-gray-800 border-r-4 border-blue-500 pr-4">
          <CheckCircle2 className="text-blue-500" />
          <h2>ثانياً: الكلمة المعربة</h2>
        </div>
        <div className="space-y-6">
          <p className="text-lg text-gray-700">
            الكلمة المعربة هي الكلمة التي يتغير شكل آخرها (حركتها) عندما يتغير مكانها في الجملة.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { phrase: "جاءَ الطالبُ", case: "مرفوع بالضمة", desc: "لأنه فاعل" },
              { phrase: "رأيتُ الطالبَ", case: "منصوب بالفتحة", desc: "لأنه مفعول به" },
              { phrase: "مررتُ بالطالبِ", case: "مجرور بالكسرة", desc: "لأنه مسبوق بحرف جر" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border-2 border-blue-50 shadow-sm hover:border-blue-200 transition-all text-center">
                <div className="text-2xl font-black text-blue-600 mb-2">{item.phrase}</div>
                <div className="text-sm font-bold text-gray-500">{item.case}</div>
                <div className="text-xs text-gray-400 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 italic text-center">
            لاحظ كيف تغيرت حركة حرف (الباء) في كلمة "الطالب" من الضمة إلى الفتحة ثم الكسرة.
          </p>
        </div>
      </section>

      {/* 3. Types of Parsing */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 text-2xl font-bold text-gray-800 border-r-4 border-purple-500 pr-4">
          <Layers className="text-purple-500" />
          <h2>ثالثاً: أنواع الإعراب</h2>
        </div>

        <div className="grid gap-6">
          {/* Apparent */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-6 items-start">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 text-emerald-600">
              <Sun size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-700 mb-2">🔹 الإعراب الظاهر</h3>
              <p className="text-gray-600 leading-relaxed">
                هو الإعراب الذي تظهر فيه علامة الإعراب (الضمة، الفتحة، الكسرة، السكون) بشكل واضح في آخر الكلمة وننطقها بسهولة.
              </p>
            </div>
          </motion.div>

          {/* Estimated */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-6 items-start">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 text-amber-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-700 mb-2">🔹 الإعراب التقديري</h3>
              <p className="text-gray-600 leading-relaxed">
                هو الإعراب الذي لا تظهر فيه علامة الإعراب على آخر الكلمة، بل <span className="font-bold">تُقدَّر</span> (نتخيل وجودها) بسبب وجود مانع يمنع ظهورها مثل:
                <span className="block mt-2 text-sm font-medium">• التعذر (صعوبة النطق) • الثقل • انشغال المحل بحركة أخرى.</span>
              </p>
            </div>
          </motion.div>

          {/* Proxy */}
          <motion.div whileHover={{ x: -5 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-6 items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
              <RotateCcw size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">🔹 الإعراب النيابي</h3>
              <p className="text-gray-600 leading-relaxed">
                هو الإعراب الذي تنوب فيه علامة عن علامة أخرى (علامة غير أصلية تقوم مقام العلامة الأصلية). وينقسم إلى:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-800 block mb-1">1. نيابة حرف عن حركة</span>
                  <span className="text-sm text-blue-600">مثل: يرفع جمع المذكر السالم بالواو بدل الضمة.</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-800 block mb-1">2. نيابة حركة عن حركة</span>
                  <span className="text-sm text-blue-600">مثل: جمع المؤنث السالم يُنصب بالكسرة بدل الفتحة.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer / Summary */}
      <div className="pt-8 border-t border-gray-100 text-center">
        <p className="text-gray-500 font-medium mb-6">هل فهمت الدرس جيداً؟ حان الوقت لاختبار معلوماتك!</p>
        <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all">
          <span>انتقل إلى التمارين</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
