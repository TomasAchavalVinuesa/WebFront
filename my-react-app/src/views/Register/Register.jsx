import React, { useState } from "react";
import "./Register.css";
import { Link } from 'react-router-dom';


const Register = ({ onRegister }) => {
  const [registerForm, setRegisterForm] = useState({
    usuario: "",
    email: "",
    password: "",
    nombre: "",
    apellido: ""
  });

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { usuario, email, password, nombre, apellido } = registerForm;
  
    if (!usuario || !email || !password || !nombre || !apellido) {
      alert("Por favor, complete todos los campos.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5100/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          username: usuario,
          password: password,
          first: nombre,
          last: apellido
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Registro exitoso.");
        if (onRegister) onRegister(data); // podrías usar esto para redirigir o guardar el token
      } else {
        alert(`Error al registrar: ${data.message || "Error desconocido"}`);
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
          <h2>Registrarse</h2>
        </div>

        <div className="login-section">
          <h3>Crear una cuenta</h3>

          <div className="form-row">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              name="usuario"
              value={registerForm.usuario}
              onChange={handleRegisterChange}
            />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={registerForm.email}
              onChange={handleRegisterChange}
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={registerForm.password}
              onChange={handleRegisterChange}
            />
          </div>

          <div className="form-row">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              value={registerForm.nombre}
              onChange={handleRegisterChange}
            />
          </div>

          <div className="form-row">
            <label htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              name="apellido"
              value={registerForm.apellido}
              onChange={handleRegisterChange}
            />
          </div>
            <Link to="/login">
                <button>Ya tengo una cuenta</button>
            </Link>
            <Link to="/home">
                <button>Home</button>
            </Link>
          <button onClick={handleRegister}>Registrar</button>
        </div>
      </div>
    </div>
  );
};

export default Register;