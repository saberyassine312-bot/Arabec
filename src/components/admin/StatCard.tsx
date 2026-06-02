import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  delta?: string;
  isPositive?: boolean;
  colorClass?: string;
  note?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  delta,
  isPositive = true,
  colorClass = 'emerald',
  note
}) => {
  const badgeColor = isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 font-sans" dir="rtl">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{title}</span>
        <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-1">{value}</h3>
        {delta && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold ${badgeColor}`}>
              {delta}
            </span>
            {note && <span className="text-2xs text-slate-400 font-medium">{note}</span>}
          </div>
        )}
      </div>
      
      <div className={`p-4 rounded-xl shadow-inner bg-slate-50 text-slate-700`}>
        {icon}
      </div>
    </div>
  );
};
