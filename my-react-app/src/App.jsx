// src/App.jsx 
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]); // 👈 Estado global de proyectos

  const handleLogin = () => {
    setUser({ name: "Martín", projects: [] });
  };

  const handleLogout = () => {
    setMenuOpen(false);
    setUser(null);
  };

  const toggleMenu = () => setMenuOpen(open => !open);

  return (
    <div className="app-layout">
      {user && (
        <Sidebar
          user={user}
          onLogout={handleLogout}
          isOpen={menuOpen}
          toggleMenu={toggleMenu}
        />
      )}

      <div className={`main-content ${menuOpen ? "blurred" : ""}`}>
        {user && !menuOpen && (
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>
        )}

        {/* Pasamos también projects y setProjects */}
        <Outlet context={{ user, handleLogin, handleLogout, projects, setProjects }} />
      </div>
    </div>
  );
}
