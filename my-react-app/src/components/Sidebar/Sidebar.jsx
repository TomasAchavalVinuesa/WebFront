// src/components/Sidebar/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ isOpen, toggleMenu }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={toggleMenu}>✖</button>

      <div className="sidebar-logo">
        <img src="src/assets/images/Logo.png" alt="Logo" />
      </div>

      <nav className="sidebar-links">
        <Link to="/home" onClick={toggleMenu}>Home</Link>
        <Link to="/my-projects" onClick={toggleMenu}>My projects</Link>
        <Link to="/my-stories" onClick={toggleMenu}>My Stories</Link>
      </nav>

      <div className="sidebar-bottom">
        <Link to="/settings" onClick={toggleMenu}>Settings</Link>
      </div>
    </div>
  );
}
