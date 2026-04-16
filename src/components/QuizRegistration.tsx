import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, GraduationCap, School, Hash, ArrowRight, ClipboardList, X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { cn } from '../lib/utils';
import { onAuthStateChanged } from 'firebase/auth';
import { analyzePerformance } from '../services/SmartAnalysisService';

interface StudentData {
  firstName: string;
  lastName: string;
  level: string;
  section: string;
  number: string;
}

interface QuizResult {
  score: string;
  wrongAnswers?: string[];
  totalQuestions?: number;
  correctCount?: number;
  primaryIntelligence?: string;
  secondaryIntelligence?: string;
  isIntelligenceTest?: boolean;
  timeSpent?: number;
  learningStyle?: string;
}

interface QuizRegistrationProps {
  quizTitle: string;
  quizType: string;
  children: (studentData: StudentData, onComplete: (result: QuizResult | string) => void) => React.ReactNode;
}

export const QuizRegistration: React.FC<QuizRegistrationProps> = ({ quizTitle, quizType, children }) => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [formData, setFormData] = useState<StudentData>({
    firstName: '',
    lastName: '',
    level: '',
    section: '',
    number: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.firstName && data.lastName) {
              setStudentData({
                firstName: data.firstName,
                lastName: data.lastName,
                level: data.gradeLevel || '',
                section: data.section || '',
                number: data.orderNumber || ''
              });
            }
          }
        } catch (err) {
          console.error("Error fetching profile in QuizRegistration:", err);
        }
      }
      setIsLoadingProfile(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).every(val => val.trim() !== '')) {
      setStudentData(formData);
      setShowModal(false);
    }
  };

  const handleComplete = (result: QuizResult | string) => {
    if (typeof result === 'string') {
      setQuizResult({ score: result });
    } else {
      setQuizResult(result);
    }
    setIsFinished(true);
  };

  const sendResults = async () => {
    if (!studentData || !quizResult) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const errorsToFocus = quizResult.wrongAnswers && quizResult.wrongAnswers.length > 0
        ? quizResult.wrongAnswers.join(' - ')
        : 'لا يوجد (أداء ممتاز)';

      // 1. Save to Firestore (Control Panel)
      await addDoc(collection(db, 'quizAttempts'), {
        studentData,
        quizType,
        quizTitle,
        score: quizResult.score,
        wrongAnswers: quizResult.wrongAnswers || [],
        errorsToFocus,
        timestamp: serverTimestamp()
      });

      // 2. Smart Analysis & Profile Update
      if (auth.currentUser) {
        await analyzePerformance({
          userId: auth.currentUser.uid,
          quizType: quizType,
          score: quizResult.correctCount || 0,
          totalQuestions: quizResult.totalQuestions || 10,
          wrongAnswers: quizResult.wrongAnswers || [],
          timeSpent: quizResult.timeSpent,
          learningStyle: quizResult.learningStyle,
          isIntelligenceTest: quizResult.isIntelligenceTest
        });
      }

      // 3. Send to WhatsApp
      const message = `السلام عليكم أستاذي الكريم،

📊 تم تسجيل نتيجة اختبار جديدة، التفاصيل كما يلي:

👤 الاسم: ${studentData.firstName} ${studentData.lastName}  
🎓 المستوى: ${studentData.level}  
🏫 القسم: ${studentData.section}  
🔢 الرقم الترتيبي: ${studentData.number}  
📝 موضوع الاختبار: ${quizTitle}  
✔️ النتيجة: ${quizResult.score}  

يرجى الاطلاع، وشكرًا لجهودكم.`;

      const encodedMessage = encodeURIComponent(message);
      
      // Using the teacher's specific short link with the message text
      const teacherWhatsappUrl = `https://wa.me/message/N2EPRSE4OZQGC1?text=${encodedMessage}`;
      window.open(teacherWhatsappUrl, '_blank');

      // Reset state after successful send
      setIsFinished(false);
      setStudentData(null);
    } catch (err) {
      console.error("Error saving quiz attempt:", err);
      setError("حدث خطأ أثناء حفظ النتيجة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white w-full max-w-md p-8 rounded-[2.5rem] border border-emerald-100 shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">أحسنت يا بطل!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            لقد أنهيت الاختبار بنجاح. هل توافق على إرسال نتيجتك ({quizResult?.score}) إلى الأستاذ عبر واتساب وحفظها في لوحة التحكم؟
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2 justify-center">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={sendResults}
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الإرسال...' : 'نعم، أرسل النتيجة'}
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => {
                setIsFinished(false);
                setStudentData(null);
              }}
              className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all"
            >
              إلغاء
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ClipboardList size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">{quizTitle}</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            أهلاً بك! يرجى الضغط على الزر أدناه لإدخال بياناتك والبدء في الاختبار.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
          >
            ابدأ الاختبار
            <ArrowRight size={24} />
          </button>
        </motion.div>

        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-md p-6 md:p-8 rounded-[2rem] shadow-2xl relative z-10 border border-gray-50 max-h-[90vh] overflow-y-auto"
              >
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">إنشاء ملف تعريف سريع</h2>
                  <p className="text-gray-500 text-sm">أدخل معلوماتك لمتابعة تقدمك وحفظ نتائجك</p>
                </div>

                <form onSubmit={handleStart} className="space-y-5" dir="rtl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 mr-1">الاسم الشخصي</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-gray-800 font-medium"
                        placeholder="مثال: محمد"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 mr-1">الاسم العائلي</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-gray-800 font-medium"
                        placeholder="مثال: العلمي"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 mr-1">المستوى الدراسي</label>
                    <input
                      type="text"
                      required
                      value={formData.level}
                      onChange={e => setFormData({...formData, level: e.target.value})}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-gray-800 font-medium"
                      placeholder="مثال: الثالثة إعدادي"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 mr-1">القسم</label>
                      <input
                        type="text"
                        required
                        value={formData.section}
                        onChange={e => setFormData({...formData, section: e.target.value})}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-gray-800 font-medium"
                        placeholder="مثال: 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 mr-1">رقم الترتيب</label>
                      <input
                        type="text"
                        required
                        value={formData.number}
                        onChange={e => setFormData({...formData, number: e.target.value})}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-gray-800 font-medium"
                        placeholder="مثال: 15"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 mt-4 group"
                  >
                    <span>تأكيد والبدء الآن</span>
                    <ArrowRight size={22} className="group-hover:translate-x-[-4px] transition-transform" />
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return <>{children(studentData, handleComplete)}</>;
};
