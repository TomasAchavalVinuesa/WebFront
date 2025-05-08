import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";
import "./Settings.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HeaderLogueado from "../../components/HeaderLogueado/HeaderLogueado";


const Settings = () => {
  const [form, setForm] = useState({
    usuario: "",
    email: "",
    password: "",
    nombre: "",
    apellido: "",
  });
  const [originalForm, setOriginalForm] = useState(null); 

  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  
    fetch("http://localhost:5100/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener el perfil");
        return res.json();
      })
      .then((data) => {
        const newForm = {
          usuario: data.username || "",
          email: data.email || "",
          password: "",
          nombre: data.name?.first || "",
          apellido: data.name?.last || "",
        };
        setForm(newForm);
        setOriginalForm(newForm); 
      })
      .catch((err) => {
        console.error("Error al precargar el perfil:", err);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = () =>{
    localStorage.removeItem("token");
    navigate("/home");
  }

  const handleGuardar = () => {
    if (Object.values(form).some(val => val.trim() === "")) {
      setShowError(true);
      return;
    }
    setShowConfirm(true);
  };

  const confirmarCambios = async () => {
    const token = localStorage.getItem("token");

    try {
      // Validar si el email ya existe
      if (form.email !== originalForm.email) {
        const emailRes = await fetch(`http://localhost:5100/auth/check-email?email=${encodeURIComponent(form.email)}`);
        const emailData = await emailRes.json();
        if (emailData.exists) {
          alert("Este email ya está registrado.");
          return;
        }
      }
  
      // Validar si el nombre de usuario ya existe
      if (form.usuario !== originalForm.usuario) {
        const usernameRes = await fetch(`http://localhost:5100/auth/check-username?username=${encodeURIComponent(form.usuario)}`);
        const usernameData = await usernameRes.json();
        if (usernameData.exists) {
          alert("Este nombre de usuario ya está en uso.");
          return;
        }
      }
  
      // Enviar los cambios del perfil al servidor
      const updateRes = await fetch("http://localhost:5100/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: form.email,
          username: form.usuario,
          first: form.nombre,
          last: form.apellido,
          password: form.password,
        }),
      });
  
      if (!updateRes.ok) {
        throw new Error("Error al guardar los cambios");
      }
  
      setShowConfirm(false);
      alert("Cambios guardados correctamente");
  
      // Reautenticar para obtener nuevo token
      const loginRes = await fetch("http://localhost:5100/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: form.usuario,
          password: form.password
        })
      });
  
      const loginData = await loginRes.json();
  
      if (loginRes.ok) {
        localStorage.setItem("token", loginData.token);
        navigate("/home"); // o redireccioná a donde necesites
      } else {
        alert(`Error al reautenticarse: ${loginData.error || "Error desconocido"}`);
      }
  
    } catch (err) {
      console.error("Error al guardar o reautenticarse:", err);
      setShowConfirm(false);
      alert("Hubo un error al guardar los cambios");
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <HeaderLogueado contenido="Settings"></HeaderLogueado>
        <h3>Configurar mi perfil</h3>

        {["usuario", "email", "password", "nombre", "apellido"].map((campo, i) => (
          <div className="form-row" key={i}>
            <label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
            <input
              type={campo === "password" ? "password" : "text"}
              name={campo}
              value={form[campo]}
              placeholder={campo === "password" ? "Ingrese la nueva contraseña" : ""}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="actions">
          <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
          <button className="btn-save" onClick={handleGuardar}>Guardar</button>
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal isOpen={showConfirm}>
        <h3>¿Está seguro de realizar estos cambios?</h3>
        <button onClick={() => setShowConfirm(false)}>Cancelar</button>
        <button onClick={confirmarCambios}>Guardar cambios</button>
      </Modal>

      {/* Modal de error */}
      <Modal isOpen={showError}>
        <h3>No pueden haber campos vacíos</h3>
        <button onClick={() => setShowError(false)}>Aceptar</button>
      </Modal>
    </div>
  );
};

export default Settings;
