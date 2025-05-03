// components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ user, onLogin, onLogout, isOpen, toggleMenu }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={toggleMenu}>✖</button>
      <div className="logo">
        <img src="src/assets/images/Logo.png" alt="Logo" />
      </div>

      <nav className="nav-links">
        <Link to="/" onClick={toggleMenu}>Home</Link>
        <Link to="/my-projects" onClick={toggleMenu}>My Projects</Link>
        <Link to="/my-stories" onClick={toggleMenu}>My Stories</Link>
        <Link to="/settings" onClick={toggleMenu}>Settings</Link>
      </nav>

      <div className="auth-section">
        <Link to="/Login">
        {user ? (
          <button onClick={() => { onLogout(); toggleMenu(); }}>Cerrar sesión</button>
        ) : (
          <button onClick={() => { onLogin(); toggleMenu(); }}>Iniciar sesión</button>
        )}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
