import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, BookOpen, Compass, PenTool, Award, 
  ListChecks, UserCheck, Sparkles, Brain, Loader2, 
  HelpCircle, CheckCircle, AlertCircle, ThumbsUp, RefreshCw
} from 'lucide-react';
import { CompositionLesson } from '../data/compositionData';

interface DashboardProps {
  lessons: CompositionLesson[];
  gradeName: string;
  onBack: () => void;
}

export const ArabicCompositionDashboard: React.FC<DashboardProps> = ({ lessons, gradeName, onBack }) => {
  const [selectedLesson, setSelectedLesson] = useState<CompositionLesson | null>(null);
  const [activeTab, setActiveTab] = useState<'acquisition' | 'production' | 'application' | 'correction' | 'sample' | 'coach'>('acquisition');
  
  // AI Coach state
  const [studentText, setStudentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLessonSelect = (lesson: CompositionLesson) => {
    setSelectedLesson(lesson);
    setActiveTab('acquisition');
    setStudentText('');
    setAiReport(null);
    setErrorMessage('');
  };

  const handleGradeWithAI = async () => {
    if (!studentText.trim() || studentText.trim().split(/\s+/).length < 15) {
      setErrorMessage('تنبيه: الرجاء كتابة موضوع غني وواضح لا يقل عن 15 كلمة لتحليله بدقّة.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    setAiReport(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/writing/ai-grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          lessonTitle: selectedLesson?.title,
          content: studentText
        })
      });

      if (!response.ok) {
        throw new Error('فشل تصحيح النص عبر الذكاء الاصطناعي');
      }

      const data = await response.json();
      setAiReport(data);
    } catch (error: any) {
      console.error(error);
      setErrorMessage('تعذر الاتصال بمرشد التعبير الذكي حالياً، الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'acquisition', label: '1. مهارة الاكتساب', icon: <Compass size={18} /> },
    { id: 'production', label: '2. مهارة الإنتاج', icon: <BookOpen size={18} /> },
    { id: 'application', label: '3. مهارة التطبيق', icon: <PenTool size={18} /> },
    { id: 'correction', label: '4. التقويم والدعم', icon: <ListChecks size={18} /> },
    { id: 'sample', label: '5. نموذج الإنتاج', icon: <Award size={18} /> },
    { id: 'coach', label: '6. المرشد الذكي بـ AI', icon: <Sparkles size={18} /> }
  ] as const;

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <AnimatePresence mode="wait">
        {!selectedLesson ? (
          // LESSONS LIST VIEW
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-gray-900 border-r-4 border-purple-600 pr-3">{gradeName}</h2>
                <p className="text-gray-400 font-bold mt-1">مكون التعبير والإنشاء • مهارات الكتابة المنهجية</p>
              </div>
              <button 
                onClick={onBack}
                className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm flex items-center gap-2 font-black text-sm"
              >
                <span>العودة للرئيسية</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {lessons.map((lesson, index) => (
                <motion.button
                  key={lesson.id}
                  whileHover={{ y: -5, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleLessonSelect(lesson)}
                  className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all text-right group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-black group-hover:bg-purple-600 group-hover:text-white transition-all">
                        {index + 1}
                      </div>
                      <PenTool className="text-purple-100 group-hover:text-purple-300 transition-colors" size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">{lesson.title}</h3>
                    <p className="text-gray-500 text-sm font-bold leading-relaxed line-clamp-2">{lesson.intro}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-purple-600 font-bold text-sm mt-6">
                    <span>دراسة تفاصيل وحقائق المهارة</span>
                    <ArrowRight size={14} className="rotate-180" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          // SINGLE LESSON STEPS & AI COACH VIEW
          <motion.div
            key="lesson"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            {/* Lesson Header */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedLesson(null)} 
                  className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 hover:text-purple-600 transition-all hover:bg-purple-50"
                >
                  <ArrowRight size={24} />
                </button>
                <div>
                  <h2 className="text-3xl font-black text-gray-900">{selectedLesson.title}</h2>
                  <div className="text-sm text-gray-400 font-bold mt-1">
                    {gradeName} • التعبير والإنشاء
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-2xl max-w-md hidden md:block">
                <span className="text-xs font-black text-purple-700 block mb-1">🎯 الكفاية المستهدفة</span>
                <p className="text-xs text-purple-900 leading-relaxed font-bold">{selectedLesson.competency}</p>
              </div>
            </div>

            {/* Stepper Navigation tabs */}
            <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-3xl border border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-black text-sm transition-all flex-1 justify-center whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white shadow-xl shadow-purple-100"
                      : "text-gray-500 hover:bg-white hover:text-purple-600"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tap Panel Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8"
            >
              {activeTab === 'acquisition' && (
                <div className="space-y-8">
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-[2rem] border border-purple-100">
                    <h4 className="text-xl font-black text-purple-800 mb-2 flex items-center gap-2">
                      <Compass size={22} className="text-purple-600" />
                      وضعية الانطلاق والتمهيد التربوي:
                    </h4>
                    <p className="text-gray-800 font-bold leading-relaxed">{selectedLesson.acquisition.startSituation}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-gray-900">أسئلة الملاحظة والاكتشاف والتأمل:</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {selectedLesson.acquisition.observationQuestions.map((q, idx) => (
                        <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                          <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700 font-bold text-sm leading-relaxed">{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 p-8 bg-purple-50/50 rounded-[2rem] border border-purple-100/40">
                    <h4 className="text-lg font-black text-purple-900 flex items-center gap-2">
                      <Brain size={22} className="text-purple-700" />
                      استخلاص خصائص وقواعد المهارة الإنشائية:
                    </h4>
                    <ul className="space-y-3">
                      {selectedLesson.acquisition.characteristics.map((char, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-800 font-bold leading-relaxed">
                          <CheckCircle size={18} className="text-purple-600 shrink-0 mt-1" />
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'production' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-gray-900">أولاً: أنشطة تفاعلية متدرجة لتطبيق التقنية:</h4>
                    <div className="space-y-3">
                      {selectedLesson.production.activities.map((act, idx) => (
                        <div key={idx} className="p-5 bg-purple-50/50 border border-purple-100/50 rounded-2xl text-purple-950 font-bold leading-relaxed">
                          {act}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-gray-900">ثانياً: تمارين تطبيقية قصيرة وموجهة:</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      {selectedLesson.production.shortExercises.map((ex, idx) => (
                        <div key={idx} className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm space-y-3">
                          <h5 className="font-black text-gray-900">تمرين ممهد رقم {idx + 1}:</h5>
                          <p className="text-gray-600 font-bold leading-relaxed text-sm">{ex}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-150">
                    <h4 className="text-lg font-black text-emerald-800 mb-3 flex items-center gap-2">
                      <CheckCircle size={20} className="text-emerald-600" />
                      الأجوبة والحلول النموذجية المقترحة للتمرّن:
                    </h4>
                    <ul className="space-y-3 text-emerald-950 font-bold text-sm leading-relaxed">
                      {selectedLesson.production.modelAnswers.map((ans, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="text-emerald-600 shrink-0 font-black">•</span>
                          <span>{ans}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'application' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-gray-900">مواضيع الإنجاز والتطبيق الكتابي الفردي:</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      {selectedLesson.application.topics.map((t, idx) => (
                        <div key={idx} className="p-6 bg-amber-50/50 border border-amber-100 rounded-[2rem] space-y-3 relative overflow-hidden flex flex-col justify-between">
                          <span className="absolute top-0 left-0 px-4 py-1.5 bg-amber-600 text-white rounded-br-2xl font-black text-xs">
                            الموضوع {idx + 1}
                          </span>
                          <div className="pt-4">
                            <p className="text-gray-800 font-bold leading-relaxed text-sm">{t}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-3">
                      <h4 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <AlertCircle size={20} className="text-gray-500" />
                        تعليمات هامة يتوجب احترامها لإصابة الغرض:
                      </h4>
                      <ul className="space-y-2 text-gray-700 font-bold text-sm leading-relaxed">
                        {selectedLesson.application.instructions.map((inst, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-600 font-black mt-0.5">•</span>
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 bg-purple-50/30 rounded-[2rem] border border-purple-100/30 space-y-3">
                      <h4 className="text-lg font-black text-purple-900 flex items-center gap-2">
                        <UserCheck size={20} className="text-purple-600" />
                        شبكة الإعانة والمساعدة للمتعلم:
                      </h4>
                      <ul className="space-y-2 text-purple-950 font-bold text-sm leading-relaxed">
                        {selectedLesson.application.helpGrid.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">✓</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'correction' && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white border border-gray-150 rounded-[2rem] space-y-2">
                      <span className="text-xs font-black text-gray-400">01 / التقويم الذاتي</span>
                      <h5 className="font-black text-gray-900">تقييم المتعلم لنفسه:</h5>
                      <p className="text-gray-600 font-bold text-sm leading-relaxed">{selectedLesson.correction.selfEval}</p>
                    </div>
                    <div className="p-6 bg-white border border-gray-150 rounded-[2rem] space-y-2">
                      <span className="text-xs font-black text-gray-400">02 / التقويم بالأقران</span>
                      <h5 className="font-black text-gray-900">تقييم متبادل مع الزملاء:</h5>
                      <p className="text-gray-600 font-bold text-sm leading-relaxed">{selectedLesson.correction.peerEval}</p>
                    </div>
                    <div className="p-6 bg-white border border-gray-150 rounded-[2rem] space-y-2">
                      <span className="text-xs font-black text-gray-400">03 / التقويم الجماعي</span>
                      <h5 className="font-black text-gray-900">الاستعراض العام والسبورة:</h5>
                      <p className="text-gray-600 font-bold text-sm leading-relaxed">{selectedLesson.correction.groupEval}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <h4 className="text-lg font-black text-gray-900 mb-3">شبكة التقييم سلم النقاط الرسمي بالتفصيل (من 20):</h4>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedLesson.correction.rubric.map((r, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 text-center flex flex-col justify-center">
                          <p className="text-gray-800 font-bold text-sm">{r}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-50/40 rounded-[2rem] border border-blue-100/50 space-y-2">
                      <h5 className="font-black text-blue-900">الدعم والمعالجة:</h5>
                      <p className="text-blue-950 font-bold text-sm leading-relaxed">{selectedLesson.support}</p>
                    </div>
                    <div className="p-6 bg-purple-50/40 rounded-[2rem] border border-purple-100/50 space-y-2">
                      <h5 className="font-black text-purple-900">الإثراء والتوسيع الفكري:</h5>
                      <p className="text-purple-950 font-bold text-sm leading-relaxed">{selectedLesson.enrichment}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sample' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h4 className="text-xl font-black text-gray-900">نموذج كامل محاكي للمجهود التعبيري والإنشائي:</h4>
                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs">نموذج ممتاز</span>
                  </div>
                  <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                    <p className="text-gray-800 font-bold leading-loose text-lg whitespace-pre-line text-justify">
                      {selectedLesson.modelSample}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'coach' && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="text-xl font-black text-purple-900 flex items-center gap-2">
                        <Sparkles size={24} className="text-purple-600 animate-pulse" />
                        ركن الكتابة الإنشائية والتقويم الذكي بـ AI
                      </h4>
                      <p className="text-gray-400 font-bold text-xs mt-1">اكتب موضوعاً إنشائياً تعبر فيه عن المهارة، وتلقَّ دليلاً تصحيحياً تربوياً شاملاً فوراً</p>
                    </div>
                    <div className="text-xs bg-purple-50 text-purple-700 px-4 py-2 rounded-xl font-black">
                      معايير التقييم المغربية الرسمية مفعّلة 🇲🇦
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-black text-gray-700 block">اكتب مسودة موضوعك الإنشائي هنا بالتفصيل:</label>
                    <textarea
                      value={studentText}
                      onChange={(e) => setStudentText(e.target.value)}
                      placeholder="ابدأ في كتابة موضوعك الإنشائي المحترم لعناصر المهارة هنا... مثلاً مقدمة، تحليل وعرض ممتلئ، تمثيل وتفاصيل، ثم خاتمة متزنة بليغة."
                      rows={8}
                      className="w-full p-6 bg-gray-50 border border-gray-200 rounded-[2rem] font-bold text-gray-850 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all text-justify"
                    />
                    
                    {errorMessage && (
                      <div className="p-4 bg-red-50 text-red-700 rounded-xl font-bold text-xs flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-3">
                      {studentText && (
                        <button 
                          onClick={() => { setStudentText(''); setAiReport(null); }}
                          disabled={isLoading}
                          className="px-6 py-4 bg-gray-50 border border-gray-100 text-gray-500 rounded-2xl hover:text-red-500 font-black text-sm transition-all"
                        >
                          مسح المسودة
                        </button>
                      )}
                      <button
                        onClick={handleGradeWithAI}
                        disabled={isLoading}
                        className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-purple-100 flex items-center gap-3 transition-all disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>يتم قراءة وتحليل موضوعك حالياً بـ AI...</span>
                          </>
                        ) : (
                          <>
                            <Brain size={18} />
                            <span>الحصول على تصحيح وتقييم ذكي فوري</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* AI Evaluation Report Panel */}
                  <AnimatePresence>
                    {aiReport && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="p-8 bg-purple-50/40 rounded-[2.5rem] border border-purple-100 space-y-6"
                      >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-purple-100/40 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-purple-600 text-white rounded-[2rem] flex flex-col items-center justify-center font-black">
                              <span className="text-xs">الدرجة</span>
                              <span className="text-xl leading-none">{aiReport.score}</span>
                            </div>
                            <div>
                              <h5 className="font-black text-purple-950 text-lg">تقرير وتوجيه الأستاذ مرشد التعبير الذكي</h5>
                              <p className="text-xs text-purple-700 font-bold">تقييم منهجي خاضع لسلم المعايير الرسمية</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs">
                            <ThumbsUp size={14} />
                            <span>تم التحليل بنجاح</span>
                          </div>
                        </div>

                        {/* General Feedback */}
                        <div className="space-y-2">
                          <span className="text-xs font-black text-purple-700 block">💬 ملاحظة عامة تربوية:</span>
                          <p className="text-gray-800 font-bold leading-relaxed text-sm bg-white p-5 rounded-2xl border border-purple-105">{aiReport.feedback}</p>
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-5 bg-white rounded-2xl border border-emerald-100 space-y-3">
                            <h6 className="font-black text-emerald-800 flex items-center gap-2 text-sm">
                              <CheckCircle size={16} className="text-emerald-500" />
                              مواطن القوة والجمال التعبيري المتميزة:
                            </h6>
                            <ul className="space-y-2 text-xs text-gray-700 font-bold">
                              {aiReport.strengths?.map((str: string, index: number) => (
                                <li key={index} className="flex gap-1.5 items-start">
                                  <span className="text-emerald-500 font-black">•</span>
                                  <span>{str}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-5 bg-white rounded-2xl border border-amber-100 space-y-3">
                            <h6 className="font-black text-amber-850 flex items-center gap-2 text-sm">
                              <AlertCircle size={16} className="text-amber-500" />
                              جوانب تحسين أو هفوات لغوية رصدت:
                            </h6>
                            <ul className="space-y-2 text-xs text-gray-700 font-bold">
                              {aiReport.weaknesses?.map((weak: string, index: number) => (
                                <li key={index} className="flex gap-1.5 items-start">
                                  <span className="text-amber-500 font-black">•</span>
                                  <span>{weak}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Comparative Redrafting / Corrections */}
                        {aiReport.corrections && aiReport.corrections.length > 0 && (
                          <div className="space-y-3 bg-white p-6 rounded-3xl border border-gray-100">
                            <h6 className="font-black text-gray-900 text-sm">مستند تعديل الجمل (النحو البلاغي):</h6>
                            <div className="space-y-4">
                              {aiReport.corrections.map((corr: any, idx: number) => (
                                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 grid md:grid-cols-3 gap-3 text-xs leading-relaxed font-bold">
                                  <div>
                                    <span className="block text-red-500 text-[10px] uppercase font-black mb-1">العبارة الواردة</span>
                                    <p className="text-red-700">{corr.original}</p>
                                  </div>
                                  <div>
                                    <span className="block text-emerald-600 text-[10px] uppercase font-black mb-1">صيغة بليغة بديلة</span>
                                    <p className="text-emerald-800">{corr.suggested}</p>
                                  </div>
                                  <div>
                                    <span className="block text-gray-400 text-[10px] uppercase font-black mb-1">ملحوظة وشرح القاعدة</span>
                                    <p className="text-gray-600">{corr.explanation}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Remedial Guidance */}
                        <div className="p-5 bg-purple-600 text-white rounded-2xl shadow-lg space-y-2">
                          <span className="font-black text-xs flex items-center gap-2">
                            <RefreshCw size={16} className="animate-spin" style={{ animationDuration: '6s' }} />
                            تأصيل المهارة (خطة دعم ومعالجة مخصصة):
                          </span>
                          <p className="text-xs text-purple-50 leading-relaxed font-bold">{aiReport.remedy}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
