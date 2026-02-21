import React from 'react';
import { usePulse } from '../PulseContext'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, Droplets, Zap, Activity, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const pulseData = usePulse() || {}; 
  const { childData } = pulseData;
  const name = childData?.name || "Jamie";

  const chartData = [
    { time: '12pm', hr: 72 },
    { time: '1pm', hr: 85 },
    { time: '2pm', hr: 110 },
    { time: '3pm', hr: 88 },
    { time: '4pm', hr: 75 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Welcome back, {name}</h1>
          <p className="text-slate-500 font-medium">Here is your real-time pediatric health summary.</p>
        </div>
        <div className="text-left md:text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Status</span>
          <div className="flex items-center gap-2 text-green-500 font-bold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Syncing with Device
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-100 p-6 rounded-3xl mb-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="bg-red-500 p-4 rounded-2xl text-white">
          <AlertCircle size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-red-900 font-black text-lg">Predictive Health Alert</h3>
          <p className="text-red-700 font-medium">
            AI detected a significant BP/HR spike at 2:15 PM. 
            Cross-referenced with calendar: <span className="underline italic">Math Quiz in progress.</span>
          </p>
        </div>
        <button className="w-full md:w-auto bg-white text-red-600 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-red-100 transition-all border border-red-100">
          Dismiss
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Heart className="text-rose-500" />} label="Heart Rate" value="92" unit="bpm" trend="Stable" />
        <StatCard icon={<Droplets className="text-blue-500" />} label="Hydration" value="68" unit="%" trend="Low" />
        <StatCard icon={<Zap className="text-amber-500" />} label="Activity" value="4,210" unit="steps" trend="+12%" />
        <StatCard icon={<Activity className="text-emerald-500" />} label="Sleep" value="8.5" unit="hrs" trend="Good" />
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 text-xl">Vitals Trend</h3>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button className="px-4 py-1 text-xs font-bold text-slate-500">1H</button>
            <button className="bg-white px-4 py-1 text-xs font-bold text-blue-600 rounded-md shadow-sm">24H</button>
          </div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="hr" 
                stroke="#3b82f6" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, unit, trend }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <span className={`text-[10px] font-black uppercase tracking-tighter ${trend === 'Low' ? 'text-red-500' : 'text-slate-400'}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <div className="flex items-baseline gap-1">
          <h4 className="text-3xl font-black text-slate-900">{value}</h4>
          <span className="text-slate-400 font-bold text-xs">{unit}</span>
        </div>
      </div>
    </div>
  );
}