import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, PenTool, FileText, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function SecondYearDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const navigate = useNavigate();

  const components = [
    { 
      id: 'texts', 
      title: 'مكون النصوص', 
      icon: <FileText size={24} />, 
      color: 'bg-indigo-50 text-indigo-600',
      lessons: []
    },
    { 
      id: 'grammar', 
      title: 'مكون الدرس اللغوي', 
      icon: <BookOpen size={24} />, 
      color: 'bg-emerald-50 text-emerald-600',
      lessons: [
        { title: 'المثنى وصيغه', path: '/lessons/dual' }
      ]
    },
    { 
      id: 'writing', 
      title: 'مكون التعبير والإنشاء', 
      icon: <PenTool size={24} />, 
      color: 'bg-rose-50 text-rose-600',
      lessons: []
    },
  ];

  return (
    <div className="max-w-md mx-auto p-6" dir="rtl">
      <div className="relative">
        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-5 rounded-2xl shadow-sm border-2 transition-all duration-300 ${
            isOpen ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-100' : 'bg-white border-gray-100 text-gray-800 hover:border-indigo-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold ${isOpen ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
              2
            </div>
            <span className="text-xl font-black">السنة الثانية إعدادي</span>
          </div>
          {isOpen ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </button>

        {/* Dropdown Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 10, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="mt-4 space-y-3 overflow-hidden"
            >
              {components.map((comp, index) => (
                <div key={comp.id} className="space-y-2">
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveComponent(activeComponent === comp.id ? null : comp.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 bg-white rounded-2xl border transition-all text-right",
                      activeComponent === comp.id ? "border-indigo-500 shadow-md" : "border-gray-100 shadow-sm hover:border-indigo-100"
                    )}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${comp.color}`}>
                      {comp.icon}
                    </div>
                    <span className="text-lg font-bold text-gray-700 flex-1">{comp.title}</span>
                    {comp.lessons.length > 0 && (
                      <ChevronDown size={20} className={cn("text-gray-400 transition-transform", activeComponent === comp.id && "rotate-180")} />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {activeComponent === comp.id && comp.lessons.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pr-16 space-y-2"
                      >
                        {comp.lessons.map((lesson, lIndex) => (
                          <button
                            key={lIndex}
                            onClick={() => navigate(lesson.path)}
                            className="w-full flex items-center gap-3 p-3 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm transition-all"
                          >
                            <PlayCircle size={16} />
                            {lesson.title}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
