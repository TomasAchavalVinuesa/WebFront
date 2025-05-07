import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import AccionesSesion from "../../components/AccionesSesion/AccionesSesion";
import HeaderSimple from "../../components/HeaderSimple/HeaderSimple";
import FormularioLogin from "../../components/FormularioLogin/FormularioLogin";

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
      localStorage.setItem("token", data.token);
      if (onLogin) onLogin(data);
      navigate("/home");
    } else {
      alert(`Error al loguearse: ${data.error || "Error desconocido"}`);
    }
  } catch (error) {
    console.error("Error al hacer la solicitud:", error);
    alert("Ocurrió un error al conectarse con el servidor.");
  }
}
  return (
    <div className="login-container">
      <div className="login-card">
        <HeaderSimple contenido="Iniciar sesión"/>
        <div className="login-section">
          <FormularioLogin usuario={loginForm.usuario} password={loginForm.password} onChange={handleLoginChange} />
          <AccionesSesion dire1="/register" dire2="/home" clase="" onClick={handleLogin} contenido1="Registrarse" contenido2="Home" contenido3="Iniciar sesión"/>
        </div>
      </div>
    </div>
  );
}

export default Login;