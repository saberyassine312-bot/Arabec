import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { cn } from '../lib/utils';

interface CourseRatingProps {
  courseId: string;
  onRatingSubmitted?: () => void;
}

export const CourseRating: React.FC<CourseRatingProps> = ({ courseId, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || rating === 0) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        courseId,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'طالب',
        text: comment,
        rating,
        createdAt: serverTimestamp()
      });
      setRating(0);
      setComment('');
      if (onRatingSubmitted) onRatingSubmitted();
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="text-xl font-bold mb-6">ما رأيك في هذه الدورة؟</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={cn(
                  "transition-colors",
                  (hover || rating) >= star ? "text-amber-400 fill-amber-400" : "text-gray-200"
                )}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="اكتب رأيك هنا..."
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[120px]"
          required
        ></textarea>

        <button
          type="submit"
          disabled={submitting || rating === 0}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
        </button>
      </form>
    </div>
  );
};
