import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, getDocs, orderBy, addDoc, serverTimestamp, where, limit } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { CourseRating } from './CourseRating';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Users, 
  BarChart, 
  ChevronDown, 
  Lock, 
  CheckCircle, 
  Star, 
  MessageSquare,
  Share2,
  Award,
  ArrowRight,
  Video
} from 'lucide-react';
import { cn } from '../lib/utils';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId));
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() });
          
          // Fetch modules
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
          if (modulesData.length > 0) setExpandedModule(modulesData[0].id);
        }

        // Check enrollment
        if (auth.currentUser) {
          const enrollmentQuery = query(
            collection(db, 'enrollments'),
            where('userId', '==', auth.currentUser.uid),
            where('courseId', '==', courseId)
          );
          const enrollmentSnapshot = await getDocs(enrollmentQuery);
          setIsEnrolled(!enrollmentSnapshot.empty);
        }

        // Fetch comments
        const commentsQuery = query(
          collection(db, 'comments'),
          where('courseId', '==', courseId),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        setComments(commentsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!auth.currentUser) {
      // Trigger login
      return;
    }
    if (!courseId) return;

    try {
      await addDoc(collection(db, 'enrollments'), {
        userId: auth.currentUser.uid,
        courseId: courseId,
        progress: 0,
        completedLessons: [],
        status: 'enrolled',
        enrolledAt: serverTimestamp()
      });
      setIsEnrolled(true);
    } catch (error) {
      console.error("Enrollment error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) return <div className="text-center py-20">الدورة غير موجودة</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                  {course.level}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-bold text-white">{course.rating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 max-w-2xl leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-emerald-500" />
                  <span>{course.enrolledCount || 0} طالب مسجل</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-emerald-500" />
                  <span>{course.duration || 'غير محدد'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart size={18} className="text-emerald-500" />
                  <span>المستوى: {course.level}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-2xl text-gray-900">
              <div className="aspect-video bg-gray-100 rounded-2xl mb-6 overflow-hidden relative group">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Play size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-xl">
                    <Play size={32} fill="currentColor" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {isEnrolled ? (
                  <button 
                    onClick={() => navigate(`/course/${courseId}/learn`)}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    متابعة التعلم
                    <ArrowRight size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={handleEnroll}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all"
                  >
                    سجل الآن مجاناً
                  </button>
                )}
                <p className="text-center text-xs text-gray-400">وصول مدى الحياة للمحتوى والشهادة</p>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                <h4 className="font-bold text-sm text-gray-900">تتضمن هذه الدورة:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Video size={14} className="text-emerald-500" />
                    <span>فيديوهات تعليمية</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Award size={14} className="text-emerald-500" />
                    <span>شهادة إتمام</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MessageSquare size={14} className="text-emerald-500" />
                    <span>دعم مباشر</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Share2 size={14} className="text-emerald-500" />
                    <span>مشاركة المحتوى</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">محتوى الدورة</h2>
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <button 
                      onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                          {module.order}
                        </div>
                        <div className="text-right">
                          <h4 className="font-bold text-gray-900">{module.title}</h4>
                          <span className="text-xs text-gray-400">{module.lessons?.length || 0} دروس</span>
                        </div>
                      </div>
                      <ChevronDown 
                        size={20} 
                        className={cn("text-gray-400 transition-transform", expandedModule === module.id && "rotate-180")} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {expandedModule === module.id && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t border-gray-50"
                        >
                          <div className="p-2">
                            {module.lessons?.map((lesson: any) => (
                              <div 
                                key={lesson.id}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  {isEnrolled ? (
                                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                      <Play size={14} fill="currentColor" />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center">
                                      <Lock size={14} />
                                    </div>
                                  )}
                                  <span className="text-sm font-medium text-gray-700">{lesson.title}</span>
                                </div>
                                {lesson.type === 'video' && (
                                  <span className="text-xs text-gray-400">فيديو</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">آراء الطلاب</h2>
              <div className="space-y-6">
                {isEnrolled && (
                  <CourseRating 
                    courseId={courseId!} 
                    onRatingSubmitted={() => {
                      // Refresh comments
                    }} 
                  />
                )}

                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-6 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400">
                          {comment.userName?.[0] || 'ط'}
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900">{comment.userName}</h5>
                          <p className="text-xs text-gray-400">{new Date(comment.createdAt?.toDate()).toLocaleDateString('ar-EG')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-bold">{comment.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{comment.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="font-bold mb-6">عن المدرس</h4>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-2xl">
                  ي
                </div>
                <div>
                  <h5 className="font-bold text-gray-900">ياسين صابر</h5>
                  <p className="text-xs text-gray-500">خبير في اللغة العربية</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                مدرس متخصص في تبسيط قواعد اللغة العربية لغير الناطقين بها وللطلاب في مختلف المراحل الدراسية.
              </p>
              <button className="w-full py-3 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
                عرض الملف الشخصي
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
