// src/views/StoryDetail/StoryDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderVolver from "../../components/HeaderVolver/HeaderVolver";
import "./StoryDetail.css";

export default function StoryDetail() {
  const { storyid } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", dueDate: "" });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

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
          setStory(data);
          setTasks(data.tasks || []);
        } else {
          alert(data.error || "No se pudo cargar la Story");
        }
      } catch (err) {
        alert("Error de red");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyid]);

  const handleAddOrEdit = () => {
    const { name, description, dueDate } = formData;
    if (!name || !description || !dueDate) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (editingTask) {
      setTasks(prev => prev.map(t => t._id === editingTask._id ? { ...editingTask, ...formData } : t));
    } else {
      const nuevaTarea = { ...formData, _id: Date.now(), completed: false };
      setTasks(prev => [...prev, nuevaTarea]);
    }

    setFormData({ name: "", description: "", dueDate: "" });
    setShowForm(false);
    setEditingTask(null);
  };

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  if (loading) return <p>Cargando...</p>;
  if (!story) return <p>Story no encontrada</p>;

  return (
    <div className="project-detail-container">
      <HeaderVolver contenido={`Story: ${story.name}`} />

      <div className="project-detail-card">
        <h2>Información de la Story</h2>
        <p><strong>Nombre:</strong> {story.name}</p>
        <p><strong>Descripción:</strong> {story.description}</p>
        <p><strong>Dueño:</strong> {story.owner}</p>
        <p><strong>Miembros:</strong> {story.members}</p>
        <p><strong>Puntos:</strong> {story.points}</p>
      </div>

      <div className="task-section">
        <h2>Tareas</h2>
        <button className="add-task-btn" onClick={() => setShowForm(true)}>Añadir Tarea</button>

        {showForm && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>{editingTask ? "Editar Tarea" : "Nueva Tarea"}</h3>
              <input type="text" placeholder="Nombre" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <input type="date" placeholder="Fecha límite" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} />
              <input type="text" placeholder="Descripción" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              <div className="modal-buttons">
                <button onClick={() => { setShowForm(false); setEditingTask(null); }}>Cancelar</button>
                <button onClick={handleAddOrEdit}>{editingTask ? "Guardar" : "Añadir"}</button>
              </div>
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          <p>No hay tareas aún.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="task-card">
              <p><strong>{task.completed ? "✅" : "⬜"} {task.name}</strong></p>
              <p>Descripción: {task.description}</p>
              <p>Fecha límite: {task.dueDate}</p>
              <div className="task-actions">
                <button onClick={() => { setEditingTask(task); setFormData(task); setShowForm(true); }}>Editar</button>
                <button onClick={() => handleDelete(task._id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>

      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  );
}
