import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // This is the function your Auth.jsx is looking for!
  const loginMock = (userData) => {
    // We'll simulate a successful login
    const fakeUser = userData || { name: "Guardian", role: "Parent" };
    setUser(fakeUser);
    console.log("Pediatric Pulse: Login Successful");
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loginMock, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// This is the hook your pages use to "talk" to this file
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // This helps you debug if you forgot to wrap your app in main.jsx or App.jsx
    return { loginMock: () => console.error("AuthProvider missing!") };
  }
  return context;
};