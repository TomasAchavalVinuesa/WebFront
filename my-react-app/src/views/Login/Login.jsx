import React, { useState } from "react";
import "./Login.css";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const Login = ({ onLogin }) => {
  const [loginForm, setLoginForm] = useState({
    usuario: "",
    password: ""
  });

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };
  
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { usuario, password } = loginForm;
  
    if (!usuario || !password) {
      alert("Por favor, complete todos los campos.");
      return;
    }

  
    try {
      const response = await fetch("http://localhost:5100/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: usuario,
          password: password
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(`Login exitoso. Token: ${data.token}`);
        localStorage.setItem("token", data.token);
        if (onLogin) onLogin(data);
        navigate("/home");
      } else {
        alert(`Error al loguearse: ${data.message || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      alert("Ocurrió un error al conectarse con el servidor.");
    }
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
            />
          </div>
            <Link to="/register">
                <button>Registrarse</button>
            </Link>
            <Link to="/home">
                <button>Home</button>
            </Link>
          <button onClick={handleLogin}>Iniciar sesión</button>
        </div>
      </div>
    </div>
  );
};

export default Login;