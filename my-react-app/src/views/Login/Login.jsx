import React, { useState } from "react";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [loginForm, setLoginForm] = useState({ usuario: "", contraseña: "" });
  const [registerForm, setRegisterForm] = useState({
    usuario: "",
    email: "",
    contraseña: "",
    nombre: "",
    apellido: ""
  });

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    // Simulación: podés validar acá con lógica real
    if (loginForm.usuario && loginForm.contraseña) {
      onLogin({ name: loginForm.usuario });
    }
  };

  const handleRegister = () => {
    console.log("Registrando usuario:", registerForm);
    alert("Registro enviado (esto es solo una demo)");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span role="img" aria-label="menu">🍔</span>
          <h2>Iniciar Sesión</h2>
        </div>

        {/* Sección Login */}
        <div className="login-section">
          <h3>Iniciar sesión</h3>
          <div className="form-row">
            <label>Usuario</label>
            <input
              name="usuario"
              value={loginForm.usuario}
              onChange={handleLoginChange}
            />
          </div>
          <div className="form-row">
            <label>Contraseña</label>
            <input
              name="contraseña"
              type="password"
              value={loginForm.contraseña}
              onChange={handleLoginChange}
            />
          </div>
          <button onClick={handleLogin}>Ingresar</button>
        </div>

        {/* Sección Registro */}
        <div className="login-section">
          <h3>Registrarse</h3>
          <div className="form-row">
            <label>Usuario</label>
            <input
              name="usuario"
              value={registerForm.usuario}
              onChange={handleRegisterChange}
            />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={registerForm.email}
              onChange={handleRegisterChange}
            />
          </div>
          <div className="form-row">
            <label>Contraseña</label>
            <input
              name="contraseña"
              type="password"
              value={registerForm.contraseña}
              onChange={handleRegisterChange}
            />
          </div>
          <div className="form-row">
            <label>Nombre</label>
            <input
              name="nombre"
              value={registerForm.nombre}
              onChange={handleRegisterChange}
            />
          </div>
          <div className="form-row">
            <label>Apellido</label>
            <input
              name="apellido"
              value={registerForm.apellido}
              onChange={handleRegisterChange}
            />
          </div>
          <button onClick={handleRegister}>Registrar</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
