import React from 'react';
import { QuizComponent } from './QuizComponent';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export default function AdvancedArabicQuiz() {
  const handleComplete = (result: any) => {
    console.log('Quiz completed:', result);
  };

  const questions = [
    {
      id: 1,
      text: "ما نوع الفعل 'قَالَ'؟",
      type: 'multiple-choice' as const,
      options: ["صحيح سالم", "معتل أجوف", "معتل ناقص", "صحيح مهموز"],
      correctAnswer: 1,
      explanation: "الفعل 'قَالَ' معتل أجوف لأن حرف العلة (الألف) جاء في وسطه.",
      image: "https://picsum.photos/seed/arabic1/800/400"
    },
    {
      id: 2,
      text: "أكمل الجملة التالية: 'العلمُ _____' (اكتب كلمة واحدة)",
      type: 'fill-in-the-blank' as const,
      correctAnswer: "نور",
      explanation: "الجملة الاسمية 'العلمُ نورٌ' مكونة من مبتدأ (العلم) وخبر (نور).",
      placeholder: "أدخل الخبر المناسب..."
    },
    {
      id: 3,
      text: "اختر الصورة التي تعبر عن 'الغابة':",
      type: 'image-choice' as const,
      options: [
        "https://picsum.photos/seed/forest/400/400",
        "https://picsum.photos/seed/desert/400/400",
        "https://picsum.photos/seed/ocean/400/400",
        "https://picsum.photos/seed/city/400/400"
      ],
      correctAnswer: 0,
      explanation: "الصورة الأولى تمثل الغابة بأشجارها الكثيفة."
    },
    {
      id: 4,
      text: "ما هو الفاعل في جملة 'كَتَبَ التلميذُ الدرسَ'؟",
      type: 'multiple-choice' as const,
      options: ["كتب", "التلميذ", "الدرس", "ضمير مستتر"],
      correctAnswer: 1,
      explanation: "الفاعل هو من قام بالفعل، وفي هذه الجملة 'التلميذ' هو الذي قام بالكتابة."
    },
    {
      id: 5,
      text: "اكتب جمع كلمة 'قلم':",
      type: 'fill-in-the-blank' as const,
      correctAnswer: "أقلام",
      explanation: "جمع 'قلم' هو 'أقلام'، وهو جمع تكسير.",
      placeholder: "جمع كلمة قلم..."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl mb-6 shadow-lg shadow-emerald-100">
            <Brain size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">التحدي اللغوي المتقدم</h1>
          <p className="text-slate-500 text-lg font-medium">اختبر مهاراتك بأنواع مختلفة من الأسئلة التفاعلية</p>
        </motion.div>

        <QuizComponent 
          questions={questions} 
          onComplete={handleComplete} 
          title="تحدي اللغة العربية"
        />
      </div>
    </div>
  );
}
