// src/App.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Login simulado
  const handleLogin = () => {
    setUser({ name: "Martín", projects: [] });
  };
  // Logout: cierra también el menú
  const handleLogout = () => {
    setMenuOpen(false);
    setUser(null);
  };

  const toggleMenu = () => setMenuOpen(open => !open);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      {user && (
        <Sidebar
          user={user}
          onLogout={handleLogout}
          isOpen={menuOpen}
          toggleMenu={toggleMenu}
        />
      )}
  
      {/* Contenido principal */}
      <div className={`main-content ${menuOpen ? "blurred" : ""}`}>
        {/* Botón hamburguesa solo si está cerrado */}
        {user && !menuOpen && (
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>
        )}
  
        {/* Rutas */}
        <Outlet context={{ user, handleLogin, handleLogout }} />
      </div>
    </div>
  );
}
