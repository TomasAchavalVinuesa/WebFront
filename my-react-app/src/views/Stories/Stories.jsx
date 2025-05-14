import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; //Capaz luego eliminar
import "./Stories.css";


export default function Story({ epicId }) {
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ //corregir
    points: 0,
    status: "todo",
    name: "",
    description: "",
    owner: "",
    members: [],
  });
  const [editingStory, setEditingStory] = useState(null);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [message, setMessage] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [owner, setOwner] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  

    const fetchStory = async () => {
      try {
        const res = await fetch(`http://localhost:5100/epic/${epicId}/stories`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok) {
          const storiesFormateadas = await Promise.all(
            data.map(async (s) => {
              const memberNames = await fetchUserNames(s.members, token);
              return {
                id: s._id,
                name: s.name,
                description: s.description,
                points: s.points,
                status: s.status,
                owner: s.owner,
                members: s.members,
                memberNames: memberNames.join(", "),
              };
            })
          );
          setStory(storiesFormateadas);
        } else {
          alert(`Error al obtener las stories: ${data.error || "Error desconocido"}`);
        }
      } catch (error) {
        alert("Error al conectarse con el servidor: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://localhost:5100/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("Error al obtener usuarios");
        const users = await response.json();
        setAllUsers(users);
      }catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };

    fetchStory();
    fetchUsuarios();
  }, [epicId]);

  const fetchUserNames = async (ids, token) => {
    const nombres = await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(`http://localhost:5100/user/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            return `${data.name.first} ${data.name.last}`;
          } else {
            return "Usuario desconocido";
          }
        } catch {
          return "Error al obtener usuario";
        }
      })
    );
    return nombres;
  };
  
  const updateStory = async (story) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  
    try {
      const response = await fetch(`http://localhost:5100/story/${story.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: story.name,
          points: story.points,
          status: story.status,
          description: story.description,
          owner: story.owner,
          members: story.members
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error desconocido al actualizar el proyecto");
      }

      setMessage("Story actualizada exitosamente.");
    } catch (error) {
      setMessage(`Error al actualizar: ${error.message}`);
      console.error("Error al hacer PUT:", error);
    }
  };
  

  const handleAddOrEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    } 

    const { name, description, icon, members, owner } = formData;
    if (!name || !description || !icon || members.length === 0 || !owner){
      setMessage("No pueden haber campos vacíos");
      return;
    }
    try {
      const res = await fetch("http://localhost:5100/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, icon, epic: epicId })
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

  const handleDelete = (id) => {
    setStory(prev => prev.filter(p => p.id !== id));
    setStoryToDelete(null);
    setMessage("Story eliminada exitosamente");
  };

  return (
    <div className="epics-section">
      <h3>Storys</h3>
      <button className="add-epic-btn" onClick={() => setShowForm(true)}>Añadir Story</button>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editingStory ? "Editar Story" : "Nueva Story"}</h3>
            <input type="text" placeholder="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input type="text" placeholder="Descripción" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <input type="text" placeholder="Icono" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} />
            <div className="modal-buttons">
              <button onClick={() => { setShowForm(false); setEditingStory(null); }}>Cancelar</button>
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
              <button onClick={() => setStory(story.filter((e) => e._id !== story._id))}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
