'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Jan', receivables: 4000, payables: 2400 },
  { name: 'Feb', receivables: 3000, payables: 1398 },
  { name: 'Mar', receivables: 2000, payables: 9800 },
  { name: 'Apr', receivables: 2780, payables: 3908 },
  { name: 'May', receivables: 1890, payables: 4800 },
  { name: 'Jun', receivables: 2390, payables: 3800 },
  { name: 'Jul', receivables: 3490, payables: 4300 },
];

export default function CashFlowChart() {
  return (
    <div className="bg-white p-6 rounded-xl border border-zoho-border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-slate-800 text-lg">Cash Flow</h3>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-zoho-green rounded-full"></div>
            <span>Receivables</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Payables</span>
          </div>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22ae60" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#22ae60" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="receivables" 
              stroke="#22ae60" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRec)" 
            />
            <Area 
              type="monotone" 
              dataKey="payables" 
              stroke="#f97316" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPay)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
