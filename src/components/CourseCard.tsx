import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  level: string;
  category?: string;
  duration?: string;
  rating?: number;
  enrolledCount?: number;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  thumbnail,
  level,
  category,
  duration,
  rating = 0,
  enrolledCount = 0,
  className
}) => {
  const getCategoryLabel = (cat?: string) => {
    switch(cat) {
      case 'grammar': return 'نحو';
      case 'morphology': return 'صرف';
      case 'spelling': return 'إملاء';
      default: return cat;
    }
  };

  const getLevelLabel = (lvl: string) => {
    switch(lvl) {
      case '1apic': return 'الأولى إعدادي';
      case '2apic': return 'الثانية إعدادي';
      case '3apic': return 'الثالثة إعدادي';
      case 'beginner': return 'مبتدئ';
      case 'intermediate': return 'متوسط';
      case 'advanced': return 'متقدم';
      default: return lvl;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group",
        className
      )}
    >
      <Link to={`/course/${id}`}>
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
              <BookOpen size={64} />
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            {category && (
              <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full shadow-lg">
                {getCategoryLabel(category)}
              </span>
            )}
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-black rounded-full shadow-sm">
              {getLevelLabel(level)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Users size={14} />
                <span>{enrolledCount}</span>
              </div>
              {duration && (
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock size={14} />
                  <span>{duration}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-gray-700">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
