import React, { useState, useEffect } from 'react';
import { StudentsTable } from '../../components/admin/StudentsTable';
import { AlertCircle, Users } from 'lucide-react';

interface StudentsProps {
  token: string;
  onViewProfile: (studentId: string) => void;
}

export const Students: React.FC<StudentsProps> = ({ token, onViewProfile }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/students', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (res.ok) {
          setStudents(json);
        } else {
          setError(json.error || 'فشل تحميل سجلات التلاميذ.');
        }
      } catch (e) {
        setError('حدث خطأ أثناء تحميل مستودع التلاميذ.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center text-rose-600 font-semibold flex items-center gap-3 justify-center">
        <AlertCircle size={20} />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans" dir="rtl">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Users size={20} className="text-emerald-500" />
            <h2 className="text-base font-bold text-slate-800">قائمة التلاميذ المسجلين بالمنصة</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">تتبع كشوف النقاط وسجلات الأداء لكل تلميذ بشكل فردي ومفصل.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold border border-indigo-100/35">
          مجموع التلاميذ الحاليين: {students.length} تلميذ ومسجل
        </div>
      </div>

      {/* Main Students Table Wrapper */}
      <StudentsTable students={students} onViewProfile={onViewProfile} />

    </div>
  );
};
