import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, School, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const levels = [
  {
    id: 'primary',
    title: 'السلك الابتدائي',
    description: 'تعلّم المبادئ الأساسية وقواعد اللغة بأسلوب ممتع ومبسط.',
    icon: <BookOpen size={40} />,
    color: 'bg-amber-50 text-amber-600 border-amber-100 ring-amber-100 hover:bg-amber-600',
    path: '/lessons?level=primary'
  },
  {
    id: 'prep',
    title: 'السلك الإعدادي',
    description: 'دروس وتمارين تعمق الفهم في الظواهر اللغوية والنصوص الأدبية.',
    icon: <School size={40} />,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-100 hover:bg-emerald-600',
    path: '/prep-years'
  },
  {
    id: 'secondary',
    title: 'الثانوي التأهيلي',
    description: 'تحضير شامل للامتحانات الإشهادية وتحليل دقيق للنصوص.',
    icon: <GraduationCap size={40} />,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100 ring-indigo-100 hover:bg-indigo-600',
    path: '/lessons?level=secondary'
  }
];

export default function LevelSelection() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-gray-900 mb-6 tracking-tight"
          >
            اختر السلك الدراسي
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 font-bold max-w-2xl mx-auto"
          >
            نحن هنا لنرافقك في رحلتك التعليمية من الابتدائي إلى البكالوريا بأسلوب تفاعلي ذكي.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {levels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={level.path}
                className="group relative block bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-current to-transparent opacity-10 group-hover:opacity-100 transition-opacity" />
                
                <div className={cn(
                  "w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg rotate-0",
                  level.color.split(' ').slice(0, 2).join(' ')
                )}>
                  {level.icon}
                </div>

                <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                  {level.title}
                </h3>
                
                <p className="text-gray-500 font-bold leading-relaxed mb-8">
                  {level.description}
                </p>

                <div className="flex items-center gap-2 font-black text-emerald-600 mt-auto">
                  <span>ابدأ الآن</span>
                  <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-2" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
