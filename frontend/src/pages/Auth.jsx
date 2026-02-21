import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Heart, Lock, Mail, User, Baby } from 'lucide-react';

export default function Auth() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Sign Up
  const { loginMock } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Simulate a brief check then log in
    setTimeout(() => {
      loginMock();
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 bg-[#FDFCFE]">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl shadow-pink-100/50 border border-pink-50 relative overflow-hidden">
        
        {/* Cute Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full opacity-50" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-pink-50 rounded-full opacity-50" />

        <div className="text-center mb-10 relative">
          <div className="inline-flex p-4 bg-pink-100 rounded-3xl text-pink-500 mb-4 shadow-inner">
            <Baby size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">
            {isLogin ? "Hello Again!" : "Join Us!"}
          </h2>
          <p className="text-slate-400 font-medium mt-2">
            {isLogin ? "Welcome back to Pediatric Pulse" : "Start monitoring your little one"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          {!isLogin && (
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-pink-200 rounded-2xl focus:ring-0 outline-none transition-all placeholder:text-slate-300"
                  placeholder="Your Full Name"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
              <input 
                type="email" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-200 rounded-2xl focus:ring-0 outline-none transition-all placeholder:text-slate-300"
                placeholder="Email Address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
              <input 
                type="password" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-purple-200 rounded-2xl focus:ring-0 outline-none transition-all placeholder:text-slate-300"
                placeholder="Password"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isVerifying}
            className="w-full py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-[1.5rem] font-black text-xl shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isVerifying ? "Sparkling..." : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        {/* The Toggle Option */}
        <div className="mt-8 text-center relative">
          <p className="text-slate-400 font-bold">
            {isLogin ? "New to the family?" : "Already have an account?"}
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="mt-1 text-pink-500 font-black hover:underline underline-offset-4 transition-all"
          >
            {isLogin ? "Create an account here ✨" : "Log in to your dashboard 🏠"}
          </button>
        </div>
      </div>
    </div>
  );
}