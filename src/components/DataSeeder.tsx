import React, { useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, writeBatch, query, where, serverTimestamp } from 'firebase/firestore';
import { Database, Users, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const studentsData = [
  { name: 'منى مطهار', email: 'mona.matthar1@edu.local', code: '3A-001' },
  { name: 'فاطمة الزهراء أعزيزي', email: 'fatimazahra.aazizi2@edu.local', code: '3A-002' },
  { name: 'جهان البكرة', email: 'jihan.bakkra3@edu.local', code: '3A-003' },
  { name: 'شيماء بالفقير', email: 'chaymae.balfakir4@edu.local', code: '3A-004' },
  { name: 'سكينة حفيان', email: 'sakina.hafian5@edu.local', code: '3A-005' },
  { name: 'حليمة كزيز', email: 'halima.kziz6@edu.local', code: '3A-006' },
  { name: 'غزلان أفاريد', email: 'ghizlane.afarid7@edu.local', code: '3A-007' },
  { name: 'حليمة اسماعيلي', email: 'halima.ismaili8@edu.local', code: '3A-008' },
  { name: 'فاطمة الزهراء صاديق', email: 'fatimazahra.sadiq9@edu.local', code: '3A-009' },
  { name: 'نورة عريف', email: 'noura.arif10@edu.local', code: '3A-010' },
  { name: 'يوسف النكشاوي', email: 'youssef.nakchawi11@edu.local', code: '3A-011' },
  { name: 'لبنى بقادير', email: 'lobna.bqadir12@edu.local', code: '3A-012' },
  { name: 'يوسف فكاك', email: 'youssef.fkak13@edu.local', code: '3A-013' },
  { name: 'سهام أخي', email: 'siham.akhi14@edu.local', code: '3A-014' },
  { name: 'وداد البقالي', email: 'wadad.baqali15@edu.local', code: '3A-015' },
  { name: 'محمد أزراولي', email: 'mohamed.azraouli16@edu.local', code: '3A-016' },
  { name: 'فاطمة الزهراء أدميني', email: 'fatimazahra.admini17@edu.local', code: '3A-017' },
  { name: 'إكرام الحجوجي', email: 'ikram.hajouji18@edu.local', code: '3A-018' },
  { name: 'يوسف أحميمصة', email: 'youssef.ahmimsa19@edu.local', code: '3A-019' },
  { name: 'جميلة العرصاوي', email: 'jamila.arsawi20@edu.local', code: '3A-020' },
  { name: 'زينب كرومي', email: 'zineb.karoumi21@edu.local', code: '3A-021' },
  { name: 'لكبيرة أعربان', email: 'lakbira.aerban22@edu.local', code: '3A-022' },
  { name: 'ياسين صابر', email: 'yassin.saber23@edu.local', code: '3A-023' },
  { name: 'سعد المتوكل', email: 'saad.motawakil24@edu.local', code: '3A-024' },
  { name: 'هجار الهواري', email: 'hajar.houwari25@edu.local', code: '3A-025' },
  { name: 'منى أرحى', email: 'mona.arha26@edu.local', code: '3A-026' },
  { name: 'آية تمسنا', email: 'aya.temsna27@edu.local', code: '3A-027' },
  { name: 'محمد الأمغاري', email: 'mohamed.amghari28@edu.local', code: '3A-028' },
  { name: 'حميد العلواني', email: 'hamid.alwani29@edu.local', code: '3A-029' },
  { name: 'أنس جنان', email: 'anas.jnan30@edu.local', code: '3A-030' },
];

const examsData = [
  'اختبار الذكاءات المتعددة',
  'أنواع الجمل',
  'الجملة الاسمية',
  'المبتدأ',
  'الخبر',
  'أحوال المبتدأ والخبر',
  'المبتدأ والخبر',
  'شبه الجملة',
  'امتحان الجملة الاسمية',
  'الجملة الفعلية',
  'أنواع الفعل',
  'المفعول به',
  'الامتحان الشامل',
].map(title => ({ title, type: 'exam' }));

export const DataSeeder: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const seedData = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const batch = writeBatch(db);

      // Seed Students
      studentsData.forEach((student, idx) => {
        const studentRef = doc(db, 'users', student.code); // Using code as ID for easy seeding
        const num = idx + 1;
        let gradeLevel = 'الأولى إعدادي';
        if (num >= 11 && num <= 20) {
          gradeLevel = 'الثانية إعدادي';
        } else if (num >= 21) {
          gradeLevel = 'الثالثة إعدادي';
        }

        batch.set(studentRef, {
          displayName: student.name,
          email: student.email,
          orderNumber: student.code,
          gradeLevel,
          role: 'student',
          createdAt: serverTimestamp(),
        }, { merge: true });
      });

      // Seed Exams
      for (const exam of examsData) {
        const examId = exam.title.replace(/\s+/g, '-').toLowerCase();
        const examRef = doc(db, 'exams', examId);
        batch.set(examRef, exam, { merge: true });
      }

      await batch.commit();
      setSuccess('تم إدخال جميع البيانات بنجاح في قاعدة البيانات.');
      
      // Optionally seed some random results for demo
      await seedRandomResults();
      
    } catch (err) {
      setError('حدث خطأ أثناء إدخال البيانات: ' + (err instanceof Error ? err.message : String(err)));
      handleFirestoreError(err, OperationType.WRITE, 'seeding');
    } finally {
      setLoading(false);
    }
  };

  const seedRandomResults = async () => {
    try {
      const batch = writeBatch(db);
      for (const student of studentsData) {
        // Give each student random scores for first 3 exams
        for (let i = 0; i < 3; i++) {
          const exam = examsData[i];
          const examId = exam.title.replace(/\s+/g, '-').toLowerCase();
          const resultId = `${student.code}-${examId}`;
          const resultRef = doc(db, 'examResults', resultId);
          batch.set(resultRef, {
            studentId: student.code,
            examId: examId,
            examTitle: exam.title,
            studentName: student.name,
            score: Math.floor(Math.random() * 41) + 60, // 60-100
            timestamp: serverTimestamp()
          });
        }
      }
      await batch.commit();
    } catch (err) {
      console.error("Error seeding random results:", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <Database className="text-emerald-600" size={24} />
        <h2 className="text-xl font-black text-gray-900">أداة تهيئة البيانات (Seeding)</h2>
      </div>

      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        سيتم إدخال قائمة الـ 30 تلميذاً وقائمة الـ 13 اختباراً المحددة في قاعدة البيانات (Firestore). 
        هذا الإجراء يضمن توافق النظام مع المعطيات المطلوبة.
      </p>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 flex items-center gap-3 font-bold">
          <CheckCircle2 size={20} />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 flex items-center gap-3 font-bold">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <button
        onClick={seedData}
        disabled={loading}
        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <Users size={24} />
            <span>بدء إدخال البيانات التلقائي</span>
          </>
        )}
      </button>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="text-2xl font-black text-emerald-700">{studentsData.length}</div>
          <div className="text-xs text-emerald-600 font-bold">تلميذ (الثالثة إعدادي)</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="text-2xl font-black text-blue-700">{examsData.length}</div>
          <div className="text-xs text-blue-600 font-bold">اختبار (امتحانات رسمية)</div>
        </div>
      </div>
    </div>
  );
};
