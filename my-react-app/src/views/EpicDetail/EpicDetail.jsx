// src/views/Epic/EpicDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Epics from "../Epics/Epics";
import "./EpicDetail.css";
import HeaderVolver from "../../components/HeaderVolver/HeaderVolver";

export default function EpicDetail() {
  const { epicid } = useParams();
  const navigate = useNavigate();
  const [epic, setEpic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpic = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      console.log("Obteniendo épica con ID:", epicid); // ✅ Log correcto

      try {
        const res = await fetch(`http://localhost:5100/epic/${epicid}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (res.ok) {
          setEpic(data);
        } else {
          alert(data.error || "No se pudo cargar la épica");
        }
      } catch (err) {
        alert("Error de red");
      } finally {
        setLoading(false);
      }
    };

    fetchEpic();
  }, [epicid]);

  if (loading) return <p>Cargando...</p>;
  if (!epic) return <p>Épica no encontrada</p>;

  return (
    <div className="project-detail-container">
      <HeaderVolver contenido={`Épica: ${epic.name}`} />

      <div className="project-detail-card">
        <h2>Información de la épica</h2>
        <p><strong>Nombre:</strong> {epic.name}</p>
        <p><strong>Descripción:</strong> {epic.description}</p>
        <p><strong>Icono:</strong> {epic.icon}</p>
      </div>

      {/* Muestra otras épicas del mismo proyecto si es necesario */}
      {epic.project && (
        <Epics projectId={epic.project} />
      )}

      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  );
}
