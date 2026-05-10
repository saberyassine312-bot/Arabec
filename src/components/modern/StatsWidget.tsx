import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'indigo';
}

const colorMap = {
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  rose: 'bg-rose-50 text-rose-600 border-rose-100',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
};

export const StatsWidget: React.FC<StatsCardProps> = ({ 
  title, value, icon, trend, trendUp, color 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-4 rounded-2xl border", colorMap[color])}>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-black px-3 py-1 rounded-full",
            trendUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          )}>
            {trend}
          </div>
        )}
      </div>
      <div>
        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</div>
        <div className="text-3xl font-black text-gray-900 tracking-tight">{value}</div>
      </div>
    </motion.div>
  );
};
