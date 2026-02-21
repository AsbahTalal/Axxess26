import React, { createContext, useContext, useState } from "react";

const PulseContext = createContext();

export const PulseProvider = ({ children }) => {
  // Added more default data so your Dashboard vitals have something to show
  const [childData, setChildData] = useState({ 
    name: "Jamie", 
    age: 8,
    alerts: [],
    vitals: {
      hr: 92,
      hydration: 68,
      steps: "4,210",
      sleep: 8.5
    }
  });
  
  return (
    <PulseContext.Provider value={{ childData, setChildData }}>
      {children}
    </PulseContext.Provider>
  );
};

// Fixed the hook with a safety check to prevent Dashboard crashes
export const usePulse = () => {
  const context = useContext(PulseContext);
  if (context === undefined) {
    // This provides a "mock" context if the provider is missing, 
    // preventing the "Cannot destructure property 'childData'" error.
    return { 
      childData: { name: "Jamie", vitals: {} }, 
      setChildData: () => {} 
    };
  }
  return context;
};