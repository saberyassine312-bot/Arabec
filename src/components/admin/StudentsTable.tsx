import React, { useState } from 'react';
import { Search, Filter, BookOpen, ArrowLeft, Trophy } from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  email: string;
  class: string;
  xp: number;
  averageGrade: number;
  exerciseCount: number;
  performanceTier: 'ممتاز' | 'متوسط' | 'ضعيف';
}

interface StudentsTableProps {
  students: StudentData[];
  onViewProfile: (studentId: string) => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({ students, onViewProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.includes(searchTerm) || student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || student.class === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden font-sans" dir="rtl">
      {/* Filters Area */}
      <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="البحث عن تلميذ بالاسم أو البريد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex gap-2 items-center w-full sm:w-auto">
          <span className="text-slate-500 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap">
            <Filter size={14} />
            تصفية بالقسم:
          </span>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-white border rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">جميع الفصول</option>
            <option value="الأولى إعدادي">الأولى إعدادي</option>
            <option value="الثانية إعدادي">الثانية إعدادي</option>
            <option value="الثالثة إعدادي">الثالثة إعدادي</option>
          </select>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-100-muted/40 text-slate-500 border-b border-slate-100 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">الاسم الكامل</th>
              <th className="px-6 py-4">البريد الإلكتروني</th>
              <th className="px-6 py-4">القسم والمسار الدراسي</th>
              <th className="px-6 py-4 text-center">مستوى التحكم (Mastery)</th>
              <th className="px-6 py-4 text-center">مجموع النقاط (XP)</th>
              <th className="px-6 py-4 text-center">التمارين</th>
              <th className="px-6 py-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                let tierBadge = 'bg-amber-50 text-amber-600';
                if (student.performanceTier === 'ممتاز') {
                  tierBadge = 'bg-emerald-50 text-emerald-600';
                } else if (student.performanceTier === 'ضعيف') {
                  tierBadge = 'bg-rose-50 text-rose-600';
                }

                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4.5 font-bold text-slate-800">{student.name}</td>
                    <td className="px-6 py-4.5 text-xs text-slate-400 font-mono">{student.email}</td>
                    <td className="px-6 py-4.5">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100/30">
                        {student.class}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-xl text-xs font-bold ${tierBadge}`}>
                        {student.performanceTier}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <div className="flex items-center justify-center gap-1.5 font-bold text-slate-800">
                        <Trophy size={14} className="text-amber-500" />
                        {student.xp} نقطة
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-center font-semibold text-slate-600">
                      {student.exerciseCount} تمرينات
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <button
                        onClick={() => onViewProfile(student.id)}
                        className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100/80 px-3.5 py-1.5 rounded-full text-xs transition-all"
                      >
                        عرض ملف الطالب
                        <ArrowLeft size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <BookOpen size={36} className="opacity-40" />
                    <span>عذراً، لم يتم العثور على أي نتائج تلائم البحث المجرى.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
