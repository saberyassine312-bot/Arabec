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
  duration,
  rating = 0,
  enrolledCount = 0,
  className
}) => {
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
            <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-200">
              <BookOpen size={64} />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold rounded-full shadow-sm">
              {level}
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
