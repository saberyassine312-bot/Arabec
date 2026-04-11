import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { motion } from 'framer-motion';
import { Award, Download, Share2, ArrowRight, CheckCircle } from 'lucide-react';

export const CertificateView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!courseId || !auth.currentUser) return;
      try {
        const q = query(
          collection(db, 'certificates'),
          where('userId', '==', auth.currentUser.uid),
          where('courseId', '==', courseId)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setCertificate(snapshot.docs[0].data());
        } else {
          navigate(`/course/${courseId}`);
        }
      } catch (error) {
        console.error("Error fetching certificate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [courseId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!certificate) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-all"
          >
            <ArrowRight size={20} />
            العودة
          </button>
          
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">
              <Download size={18} />
              تحميل PDF
            </button>
            <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
              <Share2 size={18} />
              مشاركة
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 md:p-20 rounded-[40px] shadow-2xl border-8 border-emerald-50 relative overflow-hidden text-center"
          ref={certRef}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-50 rounded-br-full opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-50 rounded-tl-full opacity-50"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl mb-12">
              <Award size={48} />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">شهادة إتمام دورة</h1>
            <p className="text-xl text-gray-500 mb-12">تُمنح هذه الشهادة تقديراً لإتمام متطلبات الدورة التدريبية بنجاح</p>

            <div className="space-y-4 mb-16">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">مقدمة إلى</p>
              <h2 className="text-3xl md:text-4xl font-black text-emerald-600 underline decoration-emerald-200 underline-offset-8">
                {certificate.studentName}
              </h2>
            </div>

            <div className="space-y-4 mb-20">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">عن دورة</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                {certificate.courseTitle}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-gray-100">
              <div className="text-right">
                <p className="text-xs text-gray-400 font-bold mb-1">تاريخ الإصدار</p>
                <p className="font-bold text-gray-900">{new Date(certificate.issueDate).toLocaleDateString('ar-EG')}</p>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-bold mb-1">رقم الشهادة</p>
                <p className="font-mono font-bold text-gray-900">{certificate.certificateId}</p>
              </div>
            </div>

            <div className="mt-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white mb-4">
                <CheckCircle size={40} />
              </div>
              <p className="text-emerald-600 font-bold">تم التحقق من صحة الشهادة</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
