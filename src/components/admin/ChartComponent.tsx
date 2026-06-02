import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface ChartComponentProps {
  type: 'line' | 'bar' | 'pie';
  data: any[];
  title: string;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({ type, data, title }) => {
  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-96 font-sans" dir="rtl">
      <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4">{title}</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {(() => {
            if (type === 'line') {
              return (
                <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 20]} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', borderColor: '#f1f5f9', fontFamily: 'sans-serif', direction: 'rtl' }} 
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend />
                  <Line 
                    name="معدل النقاط (من 20)" 
                    type="monotone" 
                    dataKey="avgScore" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              );
            }
            
            if (type === 'bar') {
              return (
                <BarChart data={data} margin={{ top: 10, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="title" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} unit="%" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', borderColor: '#f1f5f9', fontFamily: 'sans-serif', direction: 'rtl' }}
                  />
                  <Legend />
                  <Bar name="مستوى التحكم المكتسب" dataKey="mastery" fill="#6366f1" radius={[8, 8, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              );
            }

            if (type === 'pie') {
              return (
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', borderColor: '#f1f5f9', fontFamily: 'sans-serif', direction: 'rtl' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              );
            }

            return null;
          })()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
