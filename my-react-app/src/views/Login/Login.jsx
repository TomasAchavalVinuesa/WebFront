import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [loginForm, setLoginForm] = useState({ usuario: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { usuario, password } = loginForm;

    if (!usuario || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Simulamos login exitoso:
    login({
      name: usuario,
      projects: 3 // o cualquier número simulado
    });
    navigate("/home");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Iniciar sesión</h2>
        </div>
        <div className="login-section">
          <h3>Ingresa a tu cuenta</h3>

          <div className="form-row">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              name="usuario"
              value={loginForm.usuario}
              onChange={handleLoginChange}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
            />
          </div>

          <div className="actions">
            <Link to="/register">
              <button type="button">Registrarse</button>
            </Link>
            <Link to="/home">
              <button type="button">Home</button>
            </Link>
            <button type="button" onClick={handleLogin}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
