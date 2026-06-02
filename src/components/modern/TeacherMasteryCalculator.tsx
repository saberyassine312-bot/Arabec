import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Trash2, 
  Calculator, 
  TrendingUp, 
  Zap, 
  BookOpen, 
  FileCheck, 
  AlertCircle, 
  Sparkles,
  ClipboardList,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface Student {
  id: string;
  fullName: string;
  classLevel: string;
  accessCode: string;
}

interface QuizAttempt {
  id: string;
  score: string;
  quizTitle: string;
  quizType: string;
  timestamp: any;
}

interface TeacherMasteryCalculatorProps {
  students: Student[];
  quizAttempts: QuizAttempt[];
}

export const TeacherMasteryCalculator: React.FC<TeacherMasteryCalculatorProps> = ({ 
  students, 
  quizAttempts 
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [mizanScore, setMizanScore] = useState<number>(75);
  const [derivativesScore, setDerivativesScore] = useState<number>(80);
  const [conjugationScore, setConjugationScore] = useState<number>(60);
  const [parsingScore, setParsingScore] = useState<number>(70);
  const [useLiveScores, setUseLiveScores] = useState<boolean>(true);
  const [diagnostic, setDiagnostic] = useState<any | null>(null);

  // Auto-calculate scores when selected student changes and useLiveScores is ON
  useEffect(() => {
    if (!selectedStudentId) {
      setDiagnostic(null);
      return;
    }

    const currentStudent = students.find(s => s.id === selectedStudentId);
    if (!currentStudent) return;

    // Filter quiz attempts for this student
    // Since names are matched, we filter by name
    const firstName = currentStudent.fullName.split(' ')[0];
    const studentAttempts = quizAttempts.filter(att => {
      const attFirstName = (att as any).studentData?.firstName || '';
      return attFirstName.toLowerCase().includes(firstName.toLowerCase());
    });

    if (useLiveScores && studentAttempts.length > 0) {
      // Calculate scores based on the attempts
      let mizanTotal = 0, mizanCount = 0;
      let derivTotal = 0, derivCount = 0;
      let conjTotal = 0, conjCount = 0;
      let parsTotal = 0, parsCount = 0;

      studentAttempts.forEach(att => {
        const scoreVal = parseFloat(att.score) || 0;
        const title = att.quizTitle.toLowerCase();
        
        if (title.includes('ميزان') || title.includes('وزن') || title.includes('الأوزان')) {
          mizanTotal += scoreVal;
          mizanCount++;
        } else if (title.includes('مشتق') || title.includes('فاعل') || title.includes('مفعول')) {
          derivTotal += scoreVal;
          derivCount++;
        } else if (title.includes('صحيح') || title.includes('معتل') || title.includes('تصريف')) {
          conjTotal += scoreVal;
          conjCount++;
        } else {
          parsTotal += scoreVal;
          parsCount++;
        }
      });

      setMizanScore(mizanCount > 0 ? Math.round((mizanTotal / mizanCount)) : 75);
      setDerivativesScore(derivCount > 0 ? Math.round((derivTotal / derivCount)) : 80);
      setConjugationScore(conjCount > 0 ? Math.round((conjTotal / conjCount)) : 60);
      setParsingScore(parsCount > 0 ? Math.round((parsTotal / parsCount)) : 70);
    }

    handleCalculateMastery(currentStudent, studentAttempts);
  }, [selectedStudentId, useLiveScores, students, quizAttempts]);

  const handleCalculateMastery = (student: Student, studentAttempts: any[]) => {
    // Calculated Composite Mastery
    const compositeScore = Math.round(
      (mizanScore * 0.3) + 
      (derivativesScore * 0.25) + 
      (conjugationScore * 0.2) + 
      (parsingScore * 0.25)
    );

    let level = 'مبتدئ';
    let colorClass = 'text-rose-600 bg-rose-50 border-rose-100';
    let recommendations: string[] = [];
    let badge = 'دارس مبتدئ 🏅';

    if (compositeScore >= 85) {
      level = 'متمكن جداً - مستوى متقدم (Advanced Mastery)';
      colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-100';
      badge = 'بطل الصرف والإعراب 👑';
      recommendations = [
        'إشراك الطالب في مسابقات الصرف واللغة الإبداعية.',
        'تكليفه بمساعدة ودعم أقرانه المتعثرين كمرشد بيداغوجي.',
        'توفير تحديات إعرابية لبحور الشعر والصيغ النادرة.'
      ];
    } else if (compositeScore >= 70) {
      level = 'في طور التمكن - مستقر (Capable)';
      colorClass = 'text-blue-700 bg-blue-50 border-blue-100';
      badge = 'نجم الصرف 🌟';
      recommendations = [
        'التركيز على حصر الأخطاء الطفيفة في تصريف الصحيح والمعتل.',
        'تعزيز مهارات إعراب الكلمات ذات الحروف المحذوفة.',
        'تشجيعه على تدوين الفقرات مع حركات أواخر الكلمات للضبط التام.'
      ];
    } else if (compositeScore >= 50) {
      level = 'يحتاج إلى تنمية ودعم إضافي (Developing)';
      colorClass = 'text-amber-700 bg-amber-50 border-amber-100';
      badge = 'مستكشف اللغة 📚';
      recommendations = [
        'جدولة جلسات مراجعة للميزان الصرفي وحروف الزيادة سألتمونيها.',
        'توفير تمارين مبسطة تفاعلية حول الأفعال الناقصة والأجوف.',
        'ربط الكلمات الصرفية بجذورها الثلاثية المجردة لتبسيط الإدراك اللغوي.'
      ];
    } else {
      level = 'متعثر - يحتاج إلى مواكبة فورية وعلاج بيداغوجي (Critical Guidance)';
      colorClass = 'text-rose-700 bg-rose-50 border-rose-100';
      badge = 'متعلم طموح 🪵';
      recommendations = [
        'بناء خطة علاجية مخصصة للتحقق من المكتسبات الأساسية للدروس الأولى.',
        'حضور حصص الدعم الصرفي المباشرة لفرز الحركات الأصلية والفرعية.',
        'استخدام بطاقات الألوان والمؤشرات اللمسية للتمييز بين الفعل المجرد والمزيد.'
      ];
    }

    setDiagnostic({
      studentName: student.fullName,
      compositeScore,
      level,
      badge,
      colorClass,
      recommendations,
      attemptsCount: studentAttempts.length,
      calculatedAt: new Date().toLocaleTimeString('ar-EG') + ' - ' + new Date().toLocaleDateString('ar-EG')
    });
  };

  const handleRecalculate = () => {
    if (!selectedStudentId) return;
    const currentStudent = students.find(s => s.id === selectedStudentId);
    if (currentStudent) {
      handleCalculateMastery(currentStudent, []);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8 rtl text-right" dir="rtl">
      
      {/* Parameters Panel */}
      <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
          <Calculator size={24} className="text-emerald-600" />
          <h3 className="text-xl font-black text-gray-900">حاسبة درجات الإتقان</h3>
        </div>

        {/* Student Selector */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block">اختر التلميذ للتقييم والتصنيف:</label>
          <select 
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-800"
          >
            <option value="">-- حدد تلميذاً من القائمة --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.classLevel})</option>
            ))}
          </select>
        </div>

        {/* Use Live Stats Check */}
        <div className="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/30">
          <input 
            type="checkbox"
            id="useLive"
            checked={useLiveScores}
            onChange={(e) => setUseLiveScores(e.target.checked)}
            className="h-5 w-5 rounded text-emerald-605 focus:ring-emerald-500"
          />
          <label htmlFor="useLive" className="text-xs font-bold text-emerald-800 cursor-pointer">
            تكامل تلقائي مع نتائج الاختبارات السابقة المخزنة
          </label>
        </div>

        {/* Skill Parameters Sliders */}
        <div className="space-y-5 pt-2">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">وزن المهارات الصرفية (%)</h4>

          {/* Mizan Sarfi */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-700 font-bold">1. الميزان الصرفي وحروف الزيادة</span>
              <span className="text-indigo-600 font-black">{mizanScore}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={mizanScore} 
              onChange={(e) => {
                setMizanScore(parseInt(e.target.value));
                if (useLiveScores) setUseLiveScores(false);
              }}
              className="w-full accent-indigo-600 h-1.5 rounded-lg bg-gray-100 appearance-none"
            />
          </div>

          {/* Derivatives */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-700 font-bold">2. صياغة المشتقات (اسم الفاعل والمفعول)</span>
              <span className="text-emerald-600 font-black">{derivativesScore}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={derivativesScore} 
              onChange={(e) => {
                setDerivativesScore(parseInt(e.target.value));
                if (useLiveScores) setUseLiveScores(false);
              }}
              className="w-full accent-emerald-600 h-1.5 rounded-lg bg-gray-100 appearance-none"
            />
          </div>

          {/* Conjugations */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-700 font-bold">3. تصنيف وتصريف الأفعال (الصحيح والمعتل)</span>
              <span className="text-amber-600 font-black">{conjugationScore}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={conjugationScore} 
              onChange={(e) => {
                setConjugationScore(parseInt(e.target.value));
                if (useLiveScores) setUseLiveScores(false);
              }}
              className="w-full accent-amber-500 h-1.5 rounded-lg bg-gray-100 appearance-none"
            />
          </div>

          {/* Parsing */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-700 font-bold">4. الإعراب وتطبيقات البناء الهيكلي</span>
              <span className="text-purple-600 font-black">{parsingScore}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={parsingScore} 
              onChange={(e) => {
                setParsingScore(parseInt(e.target.value));
                if (useLiveScores) setUseLiveScores(false);
              }}
              className="w-full accent-purple-600 h-1.5 rounded-lg bg-gray-100 appearance-none"
            />
          </div>
        </div>

        {/* Calculate Trigger */}
        <button 
          onClick={handleRecalculate}
          disabled={!selectedStudentId}
          className="w-full py-4 bg-emerald-650 hover:bg-emerald-600 text-white hover:text-white rounded-2xl transition-all cursor-pointer font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 disabled:opacity-45"
        >
          <Calculator size={18} />
          تحديث ومزامنة مؤشر الإتقان
        </button>
      </div>

      {/* Results Diagnostic Card Panel */}
      <div className="lg:col-span-3 space-y-6">
        {diagnostic ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-5">
              <div>
                <span className="text-xs font-bold text-gray-400 block">كشف تقويم ومستوى إتقان المتعلم:</span>
                <h4 className="text-2xl font-black text-gray-900 mt-1">{diagnostic.studentName}</h4>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-center font-bold text-xs bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full border border-slate-100">
                <Sparkles size={14} className="text-amber-500" />
                <span>جرى الحساب: {diagnostic.calculatedAt}</span>
              </div>
            </div>

            {/* Score Ring / Badge Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white flex flex-col items-center justify-center shadow-lg">
                  <span className="text-2xs font-bold opacity-85">معدل الإتقان</span>
                  <span className="text-2xl font-black">{diagnostic.compositeScore}%</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 block">التصنيف البيداغوجي:</span>
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mt-1.5 ${diagnostic.colorClass}`}>
                    {diagnostic.level}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center border-t sm:border-t-0 sm:border-r border-slate-200/60 pt-4 sm:pt-0 sm:pr-6">
                <span className="text-xs font-bold text-gray-400 block">الوسام الأكاديمي الممنوح:</span>
                <span className="text-sm font-black text-slate-800 mt-1 flex items-center gap-1.5">
                  <Award size={16} className="text-amber-500" />
                  {diagnostic.badge}
                </span>
                <span className="text-3xs text-gray-400 block mt-1">تحديد آلي بناءً على عتبة التمكن 80%</span>
              </div>
            </div>

            {/* Competency breakdown visual gauge */}
            <div className="space-y-4">
              <h5 className="text-sm font-black text-gray-800 flex items-center gap-2">
                <ClipboardList size={16} className="text-emerald-600" />
                تحليل دقة المهارات الصرفية الأساسية:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-gray-100 rounded-2xl space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>الميزان الصرفي</span>
                    <span className="text-indigo-600">{mizanScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${mizanScore}%` }}></div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-100 rounded-2xl space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>صياغة المشتقات</span>
                    <span className="text-emerald-600">{derivativesScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${derivativesScore}%` }}></div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-100 rounded-2xl space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>تصريف المعتل والصحيح</span>
                    <span className="text-amber-600">{conjugationScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${conjugationScore}%` }}></div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-100 rounded-2xl space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>تحليلات الإعراب</span>
                    <span className="text-purple-600">{parsingScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${parsingScore}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pedagogical recommendations lists */}
            <div className="space-y-3 bg-emerald-50/20 border border-emerald-100/50 p-5 rounded-3xl">
              <h5 className="text-sm font-black text-emerald-800 flex items-center gap-2">
                <BookOpen size={16} />
                توصيات ومسارات الدعم المقترحة (Pedagogical Strategy):
              </h5>
              <ul className="space-y-2 pt-1">
                {diagnostic.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-xs text-emerald-700 font-bold flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick action button to trigger direct communication */}
            <div className="flex justify-end pt-2 border-t border-slate-50">
              <span className="text-2xs text-gray-400 font-bold flex items-center gap-1">
                <UserCheck size={12} className="text-blue-500" />
                النتائج تعكس أحدث محاولات الاختبارات {diagnostic.attemptsCount > 0 ? `(${diagnostic.attemptsCount} محاولات فعّالة)` : ''}
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center h-full min-h-[350px]">
            <div className="w-20 h-20 bg-slate-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-5 border border-slate-100/50 shadow-inner">
              <TrendingUp size={36} />
            </div>
            <h4 className="text-xl font-black text-slate-800 mb-2">استكشاف وحساب مستويات التمكن والإتقان</h4>
            <p className="text-slate-450 text-sm max-w-sm leading-relaxed">
              اختر متمدرساً من القائمة المنسدلة للبدء في تشخيص ومعالجة معايير التحصيل الصرفي واستخلاص التوصيات البيداغوجية المناسبة.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
