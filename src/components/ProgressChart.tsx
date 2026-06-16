"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', xp: 120 },
  { name: 'Tue', xp: 250 },
  { name: 'Wed', xp: 180 },
  { name: 'Thu', xp: 450 },
  { name: 'Fri', xp: 580 },
  { name: 'Sat', xp: 850 },
  { name: 'Sun', xp: 1100 },
];

export function ProgressChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#aa151b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f1bf00" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#aa151b', fontWeight: 'bold' }}
          />
          <Area type="monotone" dataKey="xp" stroke="#aa151b" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
