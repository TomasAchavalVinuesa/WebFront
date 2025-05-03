import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";



const Home = ({ user, projects, onLogin, onLogout }) => {
  const isLoggedIn = !!user;
  const navigate = useNavigate();


  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-header">
          <span role="img" aria-label="menu">🍔</span>
          <h2>Home</h2>
          {isLoggedIn && (
            <button onClick={() => {
              onLogin();         // actualiza el estado
              navigate("/home"); // redirige
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
              <p>Tienes {projects} proyectos pendientes</p>
              <img
                src="/assets/images/Home.png"
                alt="trabajando"
                className="home-img"
              />
              <p>Prepara tu próxima taza de café<br />y ¡Manos a la obra!</p>
            </>
          ) : (
            <>
              <h1>Aún no has iniciado tu sesión</h1>
              <span className="emoji">😟</span>
              <p>¿Qué estás esperando para hacerlo?</p>
              <button onClick={onLogin} className="login-btn">
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;