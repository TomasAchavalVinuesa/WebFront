import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate, Link } from "react-router-dom";

const Home = ({ onLogin, onLogout }) => {
  const [user, setUser] = useState(null);
  const [projectsCount, setProjectsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5100/project/my-projects", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProjectsCount(Array.isArray(data) ? data.length : 0);

        // Si tu backend no retorna el usuario, podrías usar el token para obtenerlo.
        // Simulación simple de usuario si no viene del backend:
        setUser({ name: "Usuario" }); // Reemplazalo por info real si la tenés
      })
      .catch((err) => {
        console.error("Fallo al obtener proyectos:", err);
        setUser(null);
      });
  }, []);

  const isLoggedIn = !!user;

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-header">
          <span role="img" aria-label="menu">🍔</span>
          <h2>Home</h2>
          {!isLoggedIn && (
            <button
              onClick={() => {
                onLogin();
                navigate("/home");
              }}
              className="login-btn"
            >
              Iniciar sesión
            </button>
          )}
        </div>

        <div className="home-body">
          {isLoggedIn ? (
            <>
              <h1>Bienvenido {user.name}</h1>
              <p>Tienes {projectsCount} proyectos pendientes</p>
              <img
                src="/assets/images/Home.png"
                alt="trabajando"
                className="home-img"
              />
              <p>
                Prepara tu próxima taza de café<br />y ¡Manos a la obra!
              </p>
            </>
          ) : (
            <>
              <h1>Aún no has iniciado tu sesión</h1>
              <span className="emoji">😟</span>
              <p>¿Qué estás esperando para hacerlo?</p>
              <Link to={"/login"}>
                <button onClick={onLogin} className="login-btn">
                  Iniciar sesión
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
