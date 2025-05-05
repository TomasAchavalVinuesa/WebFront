// src/views/Home/Home.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Home.css";

export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log("Menu abierto:", !menuOpen); // Debug
  };

  return (
    <div className="home-container">
      {user && (
        <Sidebar
          user={user}
          onLogout={logout}
          onLogin={() => {}}
          isOpen={menuOpen}
          toggleMenu={toggleMenu}
        />
      )}

      <div className="home-card">
        <div className="home-header">
        {user ? (
              <>
                {!menuOpen && (
                  <button onClick={toggleMenu} className="hamburger-btn">🍔</button>
                )}
                <h2>Home</h2>
              </>
            ) : (
              <h2>Home</h2>
            )}
        </div>

        <div className="home-body">
          {user ? (
            <>
              <h1>Bienvenido {user.name}</h1>
              <p>Tienes {user.projects || 0} proyectos pendientes</p>
              <img
                src="src/assets/images/Home.png"
                alt="trabajando"
                className="home-img"
              />
              <p>Prepara tu próxima taza de café<br />y ¡Manos a la obra!</p>
            </>
          ) : (
            <>
              <h1>Bienvenido al mejor gestor de proyectos</h1>
              <img
                src="src/assets/images/Logo.png"
                alt="Logo"
                className="home-logo"
              />
              <p>Para Iniciar tu experiencia puedes</p>
              <Link to="/login">
                <button className="primary-btn">Iniciar sesión</button>
              </Link>
              <p>o</p>
              <Link to="/register">
                <button className="primary-btn">Registrarte</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
