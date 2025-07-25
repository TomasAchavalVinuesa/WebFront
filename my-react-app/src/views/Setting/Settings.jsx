import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";
import "./Settings.css";

const Settings = () => {
  const [form, setForm] = useState({
    usuario: "",
    email: "",
    password: "",
    nombre: "",
    apellido: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    if (Object.values(form).some(val => val.trim() === "")) {
      setShowError(true);
      return;
    }
    setShowConfirm(true);
  };

  const confirmarCambios = () => {
    setShowConfirm(false);
    alert("Cambios guardados correctamente");
    // Acá podrías hacer el fetch PUT/POST
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2>🍔 Settings</h2>
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
          <button className="btn-logout">Cerrar sesión</button>
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
