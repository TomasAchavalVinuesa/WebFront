// src/views/Home/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Home.css";
import HeaderSimple from "../../components/HeaderSimple/HeaderSimple";

export default function Home() {
  const [user, setUser] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cantProyectos, setCantProyectos] = useState(0);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Obtener perfil del usuario
    fetch('http://localhost:5100/user/profile', { headers })
      .then((res) => {
        if (!res.ok) throw new Error('Error en la solicitud de perfil');
        return res.json();
      })
      .then((data) => {
        setUser(data.name.first);
      })
      .catch((err) => {
        console.error('Error al obtener el perfil:', err);
      });

    // Obtener lista de proyectos
    fetch('http://localhost:5100/project/my-projects', { headers })
      .then((res) => {
        if (!res.ok) throw new Error('Error en la solicitud de proyectos');
        return res.json();
      })
      .then((data) => {
        setCantProyectos(data.length);
      })
      .catch((err) => {
        console.error('Error al obtener los proyectos:', err);
      });
  }, []);

  return (
      <div className="home-card">
        <div className="home-header">
        {user ? (
              <>
                <button className="hamburger" onClick={toggleMenu}>☰</button>
                <Sidebar isOpen={menuOpen} toggleMenu={toggleMenu}/>
                <h2>Home</h2>
              </>
            ) : (
              <HeaderSimple contenido="Home"/>
            )}
        </div>

        <div className="home-body">
          {user ? (
            <>
              <h1>Bienvenido {user}</h1>
              <p>Tienes {cantProyectos || 0} proyectos pendientes</p>
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
  );
}
