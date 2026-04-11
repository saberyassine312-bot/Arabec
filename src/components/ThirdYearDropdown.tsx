import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, PenTool, FileText, Library, ChevronDown, ChevronUp } from 'lucide-react';

export default function ThirdYearDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const components = [
    { id: 'texts', title: 'مكون النصوص', icon: <FileText size={24} />, color: 'bg-cyan-50 text-cyan-600' },
    { id: 'grammar', title: 'مكون الدرس اللغوي', icon: <BookOpen size={24} />, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'writing', title: 'مكون التعبير والإنشاء', icon: <PenTool size={24} />, color: 'bg-orange-50 text-orange-600' },
    { id: 'authors', title: 'مكون المؤلفات', icon: <Library size={24} />, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="max-w-md mx-auto p-6" dir="rtl">
      <div className="relative">
        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-5 rounded-2xl shadow-sm border-2 transition-all duration-300 ${
            isOpen ? 'bg-emerald-700 border-emerald-700 text-white shadow-emerald-100' : 'bg-white border-gray-100 text-gray-800 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold ${isOpen ? 'bg-white/20' : 'bg-emerald-50 text-emerald-700'}`}>
              3
            </div>
            <span className="text-xl font-black">السنة الثالثة إعدادي</span>
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
                <motion.button
                  key={comp.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all text-right"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${comp.color}`}>
                    {comp.icon}
                  </div>
                  <span className="text-lg font-bold text-gray-700">{comp.title}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
