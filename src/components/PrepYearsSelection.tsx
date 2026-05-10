import React from 'react';
import { motion } from 'framer-motion';
import { Layout, ArrowLeft, Home, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const years = [
  {
    id: '1',
    title: 'السنة الأولى إعدادي',
    description: 'دروس اللغة العربية المتكاملة للدورة الأولى بأسلوب مشوق.',
    path: '/first-year-lms',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600',
    number: '1'
  },
  {
    id: '2',
    title: 'السنة الثانية إعدادي',
    description: 'بناء المهارات اللغوية والتحليلية للمستوى الإعدادي المتوسط.',
    path: '/second-year-lms',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-600',
    number: '2'
  },
  {
    id: '3',
    title: 'السنة الثالثة إعدادي',
    description: 'جاهزية تامة للامتحان الجهوي وتطوير الكفايات اللغوية العليا.',
    path: '/third-year-lms',
    color: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600',
    number: '3'
  }
];

export default function PrepYearsSelection() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 bg-white p-3 rounded-2xl border border-gray-100 w-fit shadow-sm">
           <Link to="/levels" className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-bold text-sm">
              <Home size={16} />
              <span>الأسلاك</span>
           </Link>
           <ChevronLeft size={14} className="text-gray-300" />
           <span className="text-emerald-600 font-bold text-sm">السلك الإعدادي</span>
        </div>

        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-gray-900 mb-6 tracking-tight"
          >
            السلك الإعدادي
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 font-bold"
          >
            اختر سنتك الدراسية للوصول إلى الدروس والتمارين التفاعلية
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {years.map((year, index) => (
            <motion.div
              key={year.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={year.path}
                className="group relative block bg-white p-12 rounded-[4rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full text-center"
              >
                <div className={cn(
                  "w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-4xl font-black transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-inner",
                  year.color.split(' ').slice(0, 2).join(' ')
                )}>
                  {year.number}
                </div>

                <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                  {year.title}
                </h3>
                
                <p className="text-gray-500 font-bold leading-relaxed mb-8">
                  {year.description}
                </p>

                <div className="inline-flex items-center gap-2 px-8 py-3 bg-gray-50 rounded-full font-black text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:-translate-y-1">
                  <span>تصفح الدروس</span>
                  <ArrowLeft size={18} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
