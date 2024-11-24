// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

// Create Context
export const AuthContext = createContext();

// Create Provider
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  // Login function
  const login = (userData, token) => {
    setAuthState({
      isAuthenticated: true,
      user: userData,
      token: token,
    });
    // Optionally, persist data in localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };
  // Load auth state from localStorage when the app initializes
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("userData"));
    if (token && user) {
      setAuthState({
        isAuthenticated: true,
        user: user,
        token: token,
      });
    }
  }, []);

  // Context value
  const contextValue = {
    authState,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
