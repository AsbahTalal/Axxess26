import React from "react";
import { Routes, Route } from "react-router-dom";
import { PulseProvider } from './PulseContext'; 
import { AuthProvider } from './AuthContext'; // ADDED THIS

// Components
import Navbar from "./components/Navbar";

// Your Custom Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Vitals from "./pages/Vitals";
import Lifestyle from "./pages/Lifestyle";
import MedicalRecords from "./pages/MedicalRecords";
import Settings from "./pages/Settings";
import CreateProfile from "./pages/CreateProfile";
import Calendar from "./pages/Calendar";
import Alerts from "./pages/Alerts";

export default function App() {
  return (
    <AuthProvider> {/* WRAPPED HERE */}
      <PulseProvider>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          {/* Added pt-20 (padding-top) so the fixed Navbar doesn't hide your content */}
          <div className="pt-20"> 
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vitals" element={<Vitals />} />
              <Route path="/lifestyle" element={<Lifestyle />} />
              <Route path="/records" element={<MedicalRecords />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/alerts" element={<Alerts />} />
            </Routes>
          </div>
        </div>
      </PulseProvider>
    </AuthProvider>
  );
}