import { useEffect, useState } from "react";
import "./MyStories.css";
import { useNavigate } from "react-router-dom";
import HeaderLogueado from "../../components/HeaderLogueado/HeaderLogueado";

export default function MyStories() {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ //revisar
    name: "",
    owner: "",
    members: "",
    description: "",
    points: ""
  });

  useEffect(() => {
    const fetchStories = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        navigate("/login");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:5100/story/my-stories", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          const storiesFormateados = data.map((p) => ({
            id: p._id,
            name: p.name,
            owner: p.owner,
            members: p.assignedTo,
            description: p.description,
            points: p.points
          }));
  
          setStories(storiesFormateados);
        } else {
          alert(`Error al obtener las stories: ${data.error || "Error desconocido"}`);
        }
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
        alert("Ocurrió un error al conectarse con el servidor.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchStories();
  }, []);

  const handleAddOrEdit = (story) => {
    const { name, owner, members, description, points } = story;

    if (!name || !owner || !description || !members || !points) {
      setMessage("No pueden haber campos vacíos");
      return;
    }

    if (editingStory) {
      setStories((prev) =>
        prev.map((p) => (p.id === editingStory.id ? story : p))
      );
    } else {
      setStories((prev) => [...prev, { ...story, id: Date.now() }]);
    }

    setShowForm(false);
    setEditingStory(null);
    setFormData({ name: "", owner: "", members: "", description: "", points: "" });
  };

  const handleDelete = (id) => {
    setStories((prev) => prev.filter((p) => p.id !== id));
    setStoryToDelete(null);
    setMessage("Story eliminada exitosamente");
  };

  return (
    <div className="my-projects-container">
      <HeaderLogueado contenido="📂 My Stories"/>

      {loading ? (
        <div className="project-loader">
          <h2>Cargando Stories</h2>
          <img
            src="src/assets/images/RelojArena.png"
            alt="Cargando..."
            className="loader-image"
          />
          <p>Esto puede tomar un momento</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="empty-projects">
          <p className="empty-message">No tienes stories pendientes</p>
          <span role="img" aria-label="triste" className="empty-emoji">😟</span>
          <button className="add-project-btn" onClick={() => {
            setFormData({ name: "", owner: "", members: "", description: "", points: "" });
            setEditingStory(null);
            setShowForm(true);
          }}>
            Añadir Story
          </button>
        </div>
      ) : (
        <>
          <div className="project-list">
            {stories.map((story) => (
              <div key={story.id} className="project-card">
                <div className="project-header">
                  <span className="project-icon">{story.name}</span>
                  <span className="project-name">{story.points}</span>
                </div>
                <div className="project-description">{story.description}</div>
                <div className="project-members">👥 {story.members}</div>
                <div className="project-members">👥 {story.owner}</div>
                <div className="project-actions">
                  <button onClick={() => {
                    setFormData({ ...story });
                    setEditingStory(story);
                    setShowForm(true);
                  }}>Editar</button>
                  <button onClick={() => setStoryToDelete(story)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={() => {
            setFormData({ name: "", owner: "", members: "", description: "", points: "" });
            setEditingStory(null);
            setShowForm(true);
          }}>
            Añadir Story
          </button>
        </>
      )}

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editingStory ? "Editar Story" : "Nueva Story"}</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Puntaje"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
            />
            <input
              type="text"
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Miembros"
              value={formData.members}
              onChange={(e) => setFormData({ ...formData, members: e.target.value })}
            />
            <input
              type="text"
              placeholder="Owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            />
            <div className="modal-buttons">
              <button onClick={() => {
                setShowForm(false);
                setEditingStory(null);
              }}>Cancelar</button>
              <button onClick={() => handleAddOrEdit({ ...formData, id: editingStory?.id })}>
                {editingStory ? "Guardar" : "Añadir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {storyToDelete && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>¿Estás seguro de eliminar esta story?</h3>
            <div className="modal-buttons">
              <button onClick={() => setStoryToDelete(null)}>Cancelar</button>
              <button onClick={() => handleDelete(storyToDelete.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>{message}</p>
            <div className="modal-buttons">
              <button onClick={() => setMessage(null)}>Aceptar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
