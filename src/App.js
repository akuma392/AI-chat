// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/SignUp";
import Layout from "./component/Layout";
import "./stylesheets/app.scss";
import Home from "./component/Home";
import Playground from "./Sidebar/Sidebar";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    setSidebarOpen(!isMobile);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Playground>
              <Home />
            </Playground>
          }
        />
        <Route
          path="/login"
          element={
            <Playground>
              <Login />
            </Playground>
          }
        />
        <Route
          path="/signup"
          element={
            <Playground>
              <Signup />
            </Playground>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
