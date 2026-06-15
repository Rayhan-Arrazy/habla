"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { name: 'Mon', xp: 120 },
  { name: 'Tue', xp: 210 },
  { name: 'Wed', xp: 180 },
  { name: 'Thu', xp: 300 },
  { name: 'Fri', xp: 250 },
  { name: 'Sat', xp: 400 },
  { name: 'Sun', xp: 350 },
];

export function ProgressChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#aa151b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#aa151b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ color: '#64748b', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="xp" 
            stroke="#aa151b" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorXp)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
