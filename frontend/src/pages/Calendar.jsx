import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react';

export default function Calendar() {
  const [currentDate] = useState(new Date());

  // Mock events based on your actual schedule
  const events = [
    { id: 1, title: 'Difi Calc - Duruoha', time: '9:00 AM', location: 'SCI 2.225', type: 'class' },
    { id: 2, title: 'GOVT - Bram', time: '11:30 AM', location: 'ECSW 1.315', type: 'class' },
    { id: 3, title: 'Pulse Alert: Elevated HR', time: '1:15 PM', location: 'Gym', type: 'alert' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Health & School Schedule</h1>
          <p className="text-slate-500 font-medium">Monitoring Jamie's day-to-day routine.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100">
          <Plus size={20} /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: MINI CALENDAR PICKER */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">February 2026</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-full"><ChevronLeft size={18} /></button>
              <button className="p-2 hover:bg-slate-50 rounded-full"><ChevronRight size={18} /></button>
            </div>
          </div>
          {/* Simple Grid for Days */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-4">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {/* Just a sample row */}
            {[...Array(28)].map((_, i) => (
              <div key={i} className={`py-2 text-sm font-bold rounded-lg cursor-pointer ${i + 1 === 23 ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-700'}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: TIMELINE LOG */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Schedule for Feb 23, 2026</h3>
          
          {events.map((event) => (
            <div 
              key={event.id} 
              className={`p-6 rounded-[2rem] border transition-all hover:shadow-md flex justify-between items-center ${
                event.type === 'alert' ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'
              }`}
            >
              <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-2xl ${event.type === 'alert' ? 'bg-red-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${event.type === 'alert' ? 'text-red-900' : 'text-slate-900'}`}>
                    {event.title}
                  </h4>
                  <div className="flex gap-4 mt-1">
                    <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">
                      <Clock size={14} /> {event.time}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">
                      <MapPin size={14} /> {event.location}
                    </span>
                  </div>
                </div>
              </div>
              {event.type === 'alert' && (
                <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-xs font-black uppercase">
                  Action Required
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}