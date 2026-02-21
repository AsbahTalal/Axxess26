import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-8 border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Axxess 2026 Hackathon Entry
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
            Pediatric <span className="text-blue-600">Pulse</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Predictive health monitoring for children. Real-time vitals, 
            AI-driven stress detection, and seamless caregiver collaboration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/auth" 
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 group"
            >
              Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/about" 
              className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <FeatureCard 
            icon={<HeartPulse className="text-rose-500" />}
            title="Real-time Vitals"
            desc="Continuous monitoring of heart rate, oxygen levels, and activity patterns."
          />
          <FeatureCard 
            icon={<Zap className="text-amber-500" />}
            title="AI Predictions"
            desc="Detect stress spikes and potential health issues before they become emergencies."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-emerald-500" />}
            title="Secure Data"
            desc="HIPAA-compliant encryption ensuring your child's data stays private and safe."
          />
        </div>
      </main>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-emerald-400" />
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}