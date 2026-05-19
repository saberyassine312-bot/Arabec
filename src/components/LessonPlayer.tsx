import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, getDocs, orderBy, updateDoc, arrayUnion, setDoc, serverTimestamp, where } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  Menu, 
  X, 
  Award,
  ArrowRight,
  FileText,
  Video,
  Box,
  Gift,
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { QuizComponent } from './QuizComponent';
import { AssessmentType } from '../lib/smartCorrector';
import { QuizRegistration } from './QuizRegistration';
import { InteractiveLesson } from './InteractiveLesson';
import { cn } from '../lib/utils';

import { useGamification } from '../hooks/useGamification';

export const LessonPlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [mysteryReward, setMysteryReward] = useState<number | null>(null);
  const navigate = useNavigate();
  const { addXP } = useGamification();

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || !auth.currentUser) return;
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId));
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() });
          
          // Fetch modules and lessons
          const modulesSnapshot = await getDocs(
            query(collection(db, `courses/${courseId}/modules`), orderBy('order'))
          );
          const modulesData = await Promise.all(
            modulesSnapshot.docs.map(async (moduleDoc) => {
              const lessonsSnapshot = await getDocs(
                query(collection(db, `courses/${courseId}/modules/${moduleDoc.id}/lessons`), orderBy('order'))
              );
              return {
                id: moduleDoc.id,
                ...moduleDoc.data(),
                lessons: lessonsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
              };
            })
          );
          setModules(modulesData);
          
          // Set initial lesson if none selected
          if (modulesData.length > 0 && modulesData[0].lessons.length > 0) {
            setCurrentLesson(modulesData[0].lessons[0]);
          }
        }

        // Fetch enrollment
        const enrollmentQuery = query(
          collection(db, 'enrollments'),
          where('userId', '==', auth.currentUser.uid),
          where('courseId', '==', courseId)
        );
        const enrollmentSnapshot = await getDocs(enrollmentQuery);
        if (!enrollmentSnapshot.empty) {
          setEnrollment({ id: enrollmentSnapshot.docs[0].id, ...enrollmentSnapshot.docs[0].data() });
        } else {
          // Not enrolled, redirect
          navigate(`/course/${courseId}`);
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, navigate]);

  const handleLessonComplete = async (lessonId: string) => {
    if (!enrollment || !auth.currentUser || !courseId) return;

    try {
      const completedLessons = enrollment.completedLessons || [];
      if (!completedLessons.includes(lessonId)) {
        const newCompleted = [...completedLessons, lessonId];
        const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
        const progress = Math.round((newCompleted.length / totalLessons) * 100);

        await updateDoc(doc(db, 'enrollments', enrollment.id), {
          completedLessons: arrayUnion(lessonId),
          progress: progress,
          status: progress === 100 ? 'completed' : 'enrolled',
          completedAt: progress === 100 ? serverTimestamp() : null
        });

        // Reward XP
        await addXP(50); // 50 XP for completing a lesson

        // Update last lesson in user profile
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          lastLessonId: lessonId
        });

        // Chance for Mystery Box (20%)
        if (Math.random() < 0.2) {
          const reward = Math.floor(Math.random() * 20) + 10; // 10-30 XP
          setMysteryReward(reward);
          setShowMysteryBox(true);
        }

        setEnrollment({ ...enrollment, completedLessons: newCompleted, progress });

        if (progress === 100) {
          // Generate certificate
          const certId = `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          await setDoc(doc(db, 'certificates', certId), {
            userId: auth.currentUser.uid,
            courseId: courseId,
            studentName: auth.currentUser.displayName || 'طالب',
            courseTitle: course.title,
            issueDate: new Date().toISOString(),
            certificateId: certId
          });
        }
      }
    } catch (error) {
      console.error("Error completing lesson:", error);
    }
  };

  const claimMysteryReward = async () => {
    if (mysteryReward) {
      await addXP(mysteryReward);
    }
    setShowMysteryBox(false);
    setMysteryReward(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isCompleted = (id: string) => enrollment?.completedLessons?.includes(id);

  return (
    <div className="flex h-screen bg-white overflow-hidden" dir="rtl">
      {/* Mystery Box Modal */}
      <AnimatePresence>
        {showMysteryBox && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={claimMysteryReward}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[3rem] p-12 text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
                <Box size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">صندوق المفاجآت!</h2>
              <p className="text-slate-500 mb-8">لقد حصلت على مكافأة إضافية لتميزك في الدرس.</p>
              
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 mb-8">
                <div className="text-xs text-amber-600 font-bold mb-1 uppercase">نقاط إضافية</div>
                <div className="text-4xl font-black text-amber-700 flex items-center justify-center gap-2">
                  <Sparkles size={24} />
                  +{mysteryReward} XP
                </div>
              </div>

              <button 
                onClick={claimMysteryReward}
                className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
              >
                <Gift size={20} />
                استلام المكافأة
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside 
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              className="fixed md:relative w-80 border-l border-gray-100 flex flex-col h-full bg-gray-50 z-50 md:z-30"
            >
            <div className="p-6 border-b border-gray-100 bg-white">
              <button onClick={() => navigate(`/course/${courseId}`)} className="flex items-center gap-2 text-gray-400 hover:text-emerald-600 mb-4 transition-colors">
                <ArrowRight size={18} />
                <span className="text-sm font-bold">العودة لتفاصيل الدورة</span>
              </button>
              <h2 className="font-black text-gray-900 line-clamp-2 mb-4">{course?.title}</h2>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${enrollment?.progress || 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                <span>{enrollment?.progress || 0}% مكتمل</span>
                <span>{enrollment?.completedLessons?.length || 0}/{modules.reduce((acc, m) => acc + m.lessons.length, 0)} دروس</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {modules.map((module) => (
                <div key={module.id}>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3 px-2">
                    {module.title}
                  </h4>
                  <div className="space-y-1">
                    {module.lessons.map((lesson: any) => (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-right",
                          currentLesson?.id === lesson.id 
                            ? "bg-white shadow-sm border border-gray-100 text-emerald-600" 
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                          isCompleted(lesson.id) ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-400"
                        )}>
                          {isCompleted(lesson.id) ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-current rounded-full" />}
                        </div>
                        <span className="text-sm font-medium line-clamp-1">{lesson.title}</span>
                        {lesson.type === 'video' ? <Video size={14} className="mr-auto opacity-40" /> : <FileText size={14} className="mr-auto opacity-40" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white z-20">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex items-center gap-4">
            {enrollment?.progress === 100 && (
              <button 
                onClick={() => navigate(`/certificate/${courseId}`)}
                className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold border border-amber-100 hover:bg-amber-100 transition-all"
              >
                <Award size={18} />
                عرض الشهادة
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLesson?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h1 className="text-3xl font-black text-gray-900">{currentLesson?.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      {currentLesson?.type === 'video' ? <Video size={16} /> : <FileText size={16} />}
                      {currentLesson?.type === 'video' ? 'فيديو تعليمي' : 'درس نصي'}
                    </span>
                  </div>
                </div>

                {currentLesson?.type === 'video' ? (
                  <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
                    <iframe
                      src={currentLesson.content}
                      className="w-full h-full"
                      allowFullScreen
                      title={currentLesson.title}
                    ></iframe>
                  </div>
                ) : currentLesson?.type === 'quiz' ? (
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <QuizRegistration quizTitle={currentLesson.title} quizType="اختبار وحدة">
                      {(studentData, onCompleteResult) => (
                        <QuizComponent 
                          type={AssessmentType.FORMATIVE}
                          questions={currentLesson.questions || []} 
                          onComplete={(result) => {
                            onCompleteResult(result);
                            if (result.correctCount >= (result.totalQuestions || 0) * 0.7) {
                              handleLessonComplete(currentLesson.id);
                            }
                          }} 
                        />
                      )}
                    </QuizRegistration>
                  </div>
                ) : currentLesson?.type === 'interactive' || currentLesson?.type === 'smart' ? (
                  <div className="space-y-12">
                    {/* Text Content */}
                    {currentLesson.content && (
                      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm prose prose-emerald max-w-none">
                        <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                      </div>
                    )}

                    {/* Media Items */}
                    {currentLesson.media && currentLesson.media.map((item: any, idx: number) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                      >
                        {item.type === 'video' && (
                          <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl">
                             <iframe
                              src={item.url.includes('youtube') ? item.url.replace('watch?v=', 'embed/') : item.url}
                              className="w-full h-full"
                              allowFullScreen
                              title={item.title || "فيديو تعليمي"}
                            ></iframe>
                          </div>
                        )}
                        {item.type === 'image' && (
                          <div className="rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
                            <img src={item.url} alt={item.title || "صورة توضيحية"} className="w-full h-auto" referrerPolicy="no-referrer" />
                            {item.title && <div className="p-4 bg-gray-50 text-center font-bold text-gray-600">{item.title}</div>}
                          </div>
                        )}
                        {item.type === 'local-video' && (
                          <div className="aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <video controls className="w-full h-full">
                              <source src={item.url} type="video/mp4" />
                              متصفحك لا يدعم تشغيل الفيديو.
                            </video>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Interactive Component Fallback */}
                    {currentLesson.type === 'interactive' && !currentLesson.media && (
                      <InteractiveLesson onComplete={() => handleLessonComplete(currentLesson.id)} />
                    )}

                    {/* Lesson Quiz */}
                    {currentLesson.questions && currentLesson.questions.length > 0 && (
                      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center">
                              <Sparkles size={24} />
                           </div>
                           <h3 className="text-2xl font-black text-gray-900">اختبر فهمك للدرس</h3>
                        </div>
                        <QuizComponent 
                          type={AssessmentType.INTERACTIVE}
                          questions={currentLesson.questions} 
                          onComplete={(result) => {
                            if (result.correctCount >= result.totalQuestions * 0.7) {
                              handleLessonComplete(currentLesson.id);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm prose prose-emerald max-w-none">
                    <ReactMarkdown>{currentLesson?.content}</ReactMarkdown>
                  </div>
                )}

                <div className="pt-12 border-t border-gray-100 flex items-center justify-between">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-all">
                    <ChevronRight size={20} />
                    الدرس السابق
                  </button>
                  
                  {!isCompleted(currentLesson?.id) ? (
                    <button 
                      onClick={() => handleLessonComplete(currentLesson.id)}
                      className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
                    >
                      <CheckCircle size={20} />
                      تحديد كمكتمل
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 text-emerald-600 font-bold">
                      الدرس التالي
                      <ChevronLeft size={20} />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};
