// src/views/Projects/ProjectDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Epics from "../Epics/Epics";
import "./ProjectDetail.css";
import HeaderVolver from "../../components/HeaderVolver/HeaderVolver";
import ListadoTareas from "../../components/ListadoTareas/ListadoTareas";

export default function ProjectDetail() {
  const { projectid } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch(`http://localhost:5100/project/${projectid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setProject(data);
        } else {
          alert(data.error || "No se pudo cargar el proyecto");
        }
      } catch (err) {
        alert("Error de red");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectid]);

  if (loading) return <p>Cargando...</p>;
  if (!project) return <p>Proyecto no encontrado</p>;

  return (
    <div className="project-detail-container">
      <HeaderVolver contenido={`Proyect: ${project.name}`} />

      <div className="project-detail-card">
        <h2>Información del proyecto</h2>
        <p><strong>Nombre:</strong> {project.name}</p>
        <p><strong>Descripción:</strong> {project.description}</p>
        <p><strong>Miembros:</strong> {project.members}</p>
        <p><strong>Icono:</strong> {project.icon}</p>
      </div>

      {/* Épicas delegadas al componente Epics */}
      <ListadoTareas storyId={storyId} />
    </div>
  );
}
