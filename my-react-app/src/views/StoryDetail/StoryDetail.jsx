// src/views/Epic/EpicDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Story from "../Stories/Stories";
import "./StoryDetail.css";
import HeaderVolver from "../../components/HeaderVolver/HeaderVolver";

export default function StoryDetail() {
  const { storyid } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      console.log("Obteniendo story con ID:", storyid); // ✅ Log correcto

      try {
        const res = await fetch(`http://localhost:5100/story/${storyid}`, {
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

    fetchStory();
  }, [storyid]);

  if (loading) return <p>Cargando...</p>;
  if (!story) return <p>Storie no encontrada</p>;

  return (
    <div className="project-detail-container">
      <HeaderVolver contenido={`Story: ${story.name}`} />

      <div className="project-detail-card">
        <h2>Información de la Story</h2>
        <p><strong>Nombre:</strong> {story.name}</p>
        <p><strong>Descripción:</strong> {story.description}</p>
        <p><strong>Icono:</strong> {story.icon}</p>
      </div>

      {/* Muestra otras épicas del mismo proyecto si es necesario */}
      {story.project && (
        <story projectId={story.project} />
      )}

      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  );
}
