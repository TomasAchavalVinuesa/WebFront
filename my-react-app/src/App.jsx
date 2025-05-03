// App.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = () => setUser({ name: "Martín" });
  const handleLogout = () => setUser(null);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="app-layout">
      <button className="hamburger" onClick={toggleMenu}>🍔</button>

      <Sidebar
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isOpen={menuOpen}
        toggleMenu={toggleMenu}
      />

      <div className="main-content">
        <Outlet context={{ user, handleLogin, handleLogout }} />
      </div>
    </div>
  );
};

export default App;
