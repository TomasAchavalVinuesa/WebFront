import React, { useState } from "react";
import "./Register.css";
import AccionesSesion from "../../components/AccionesSesion/AccionesSesion";
import HeaderSimple from "../../components/HeaderSimple/HeaderSimple";
import FormularioRegister from "../../components/FormularioRegister/FormularioRegister";


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
        <HeaderSimple contenido="Registrarse"/>
        <div className="login-section">
          <FormularioRegister usuario={registerForm.usuario} email={registerForm.email} password={registerForm.password} nombre={registerForm.nombre} apellido={registerForm.apellido} onChange={handleRegisterChange} />
          <AccionesSesion dire1="/login" dire2="/home" clase="" onClick={handleRegister} contenido1="Ya tengo una cuenta" contenido2="Home" contenido3="Registrar"/>
        </div>
      </div>
    </div>
  );
};

export default Register;