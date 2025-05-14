import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; //Capaz luego eliminar
import "./Stories.css";


export default function Story({ projectId }) {
  const [story, setStory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", icon: "" });
  const [editingStory, setEditingStory] = useState(null);
  //const [EpicToDelete, setEpicToDelete] = useState(null);
  //const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch(`http://localhost:5100/epic/${epictId}/stories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setStory(data);
        else console.error("Error al obtener épicas", data);
      } catch (err) {
        console.error("Error al conectar con el servidor", err);
      }
    };

    fetchStory();
  }, [projectId]);

  const handleAddOrEdit = async () => {
    const { name, description, icon } = formData;
    if (!name || !description || !icon) return alert("Todos los campos son obligatorios");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5100/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, icon, project: projectId })
      });

      const data = await res.json();
      if (res.ok) {
        setStory((prev) => [...prev, data]);
        setShowForm(false);
        setFormData({ name: "", description: "", icon: "" });
        setEditingStory(null);
      } else {
        alert(data.error || "Error al crear Stories");
      }
    } catch (err) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="epics-section">
      <h3>Storys</h3>
      <button className="add-epic-btn" onClick={() => setShowForm(true)}>Añadir Story</button>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editingEpic ? "Editar Story" : "Nueva Story"}</h3>
            <input type="text" placeholder="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input type="text" placeholder="Descripción" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <input type="text" placeholder="Icono" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} />
            <div className="modal-buttons">
              <button onClick={() => { setShowForm(false); setEditingEpic(null); }}>Cancelar</button>
              <button onClick={handleAddOrEdit}>{editingStory ? "Guardar" : "Añadir"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="epic-list">
        {story.map((story) => (
          <div key={story._id} className="epic-card" onClick={() => navigate(`/story/${story._id}`)} style={{ cursor: "pointer" }}>
            <p><strong>{story.icon} {story.name}</strong></p>
            <p>{story.description}</p>
            <div className="epic-actions">
              <button onClick={() => {
                setEditingStory(story);
                setFormData({ name: story.name, description: story.description, icon: story.icon });
                setShowForm(true);
              }}>Editar</button>
              <button onClick={() => setEpics(story.filter((e) => e._id !== story._id))}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
