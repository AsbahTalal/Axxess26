import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, UserCircle, Activity, HeartPulse } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Aesthetic: Pediatric Blue & Slate
  const theme = {
    primary: '#3B82F6',
    activeBg: '#EFF6FF',
    textMain: '#1E293B',
    textMuted: '#94A3B8'
  };

  const navLinkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    borderRadius: '12px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: isActive(path) ? theme.activeBg : 'transparent',
    color: isActive(path) ? theme.primary : theme.textMuted,
    fontWeight: isActive(path) ? '700' : '500',
  });

  return (
    <nav className="fixed top-0 left-0 right-0 h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-200 z-[1000] flex items-center px-8">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2 no-underline">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <HeartPulse size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900">PULSE</span>
        </Link>

        {/* Dynamic Tabs */}
        <div className="flex items-center gap-2">
          <Link to="/dashboard" style={navLinkStyle('/dashboard')}>
            <LayoutDashboard size={20} />
            <span className="hidden md:inline">Dashboard</span>
          </Link>

          <Link to="/calendar" style={navLinkStyle('/calendar')}>
            <Calendar size={20} />
            <span className="hidden md:inline">Schedule</span>
          </Link>

          <Link to="/vitals" style={navLinkStyle('/vitals')}>
            <Activity size={20} />
            <span className="hidden md:inline">Vitals</span>
          </Link>

          <Link to="/create-profile" style={navLinkStyle('/create-profile')}>
            <UserCircle size={20} />
            <span className="hidden md:inline">Profile</span>
          </Link>
        </div>

        {/* Profile Badge */}
        <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-none">Axxess User</p>
            <p className="text-[10px] text-slate-400 font-medium">Caregiver</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">
            💙
          </div>
        </div>
      </div>
    </nav>
  );
}