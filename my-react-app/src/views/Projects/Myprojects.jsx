// src/views/Projects/MyProjects.jsx
import { useEffect, useState } from "react";
import "./projects.css";
import { useNavigate } from "react-router-dom";

export default function MyProjects() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "",
    members: ""
  });

  useEffect(() => {
    const fetchProyectos = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        navigate("/login");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:5100/project/my-projects", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          const proyectosFormateados = data.map((p) => ({
            id: p._id,
            name: p.name,
            members: p.members,
            description: p.description,
            icon: p.icon,
          }));
  
          setProjects(proyectosFormateados);
        } else {
          alert(`Error al obtener proyectos: ${data.error || "Error desconocido"}`);
        }
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
        alert("Ocurrió un error al conectarse con el servidor.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProyectos();
  }, []);

  const handleAddOrEdit = (project) => {
    const { name, icon, description, members } = project;

    if (!name || !icon || !description || !members) {
      setMessage("No pueden haber campos vacíos");
      return;
    }

    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? project : p))
      );
    } else {
      setProjects((prev) => [...prev, { ...project, id: Date.now() }]);
    }

    setShowForm(false);
    setEditingProject(null);
    setFormData({ name: "", icon: "", description: "", members: "" });
  };

  const handleDelete = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setProjectToDelete(null);
    setMessage("Proyecto eliminado exitosamente");
  };

  return (
    <div className="my-projects-container">
      <h2>📂 My Projects</h2>

      {loading ? (
        <div className="project-loader">
          <h2>Cargando proyectos</h2>
          <img
            src="src/assets/images/RelojArena.png"
            alt="Cargando..."
            className="loader-image"
          />
          <p>Esto puede tomar un momento</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-projects">
          <p className="empty-message">No tienes proyectos pendientes</p>
          <span role="img" aria-label="triste" className="empty-emoji">😟</span>
          <button className="add-project-btn" onClick={() => {
            setFormData({ name: "", icon: "", description: "", members: "" });
            setEditingProject(null);
            setShowForm(true);
          }}>
            Añadir Proyecto
          </button>
        </div>
      ) : (
        <>
          <div className="project-list">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <span className="project-icon">{project.icon}</span>
                  <span className="project-name">{project.name}</span>
                </div>
                <div className="project-description">{project.description}</div>
                <div className="project-members">👥 {project.members}</div>
                <div className="project-actions">
                  <button onClick={() => {
                    setFormData({ ...project });
                    setEditingProject(project);
                    setShowForm(true);
                  }}>Editar</button>
                  <button onClick={() => setProjectToDelete(project)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={() => {
            setFormData({ name: "", icon: "", description: "", members: "" });
            setEditingProject(null);
            setShowForm(true);
          }}>
            Añadir Proyecto
          </button>
        </>
      )}

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Icono"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
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
            <div className="modal-buttons">
              <button onClick={() => {
                setShowForm(false);
                setEditingProject(null);
              }}>Cancelar</button>
              <button onClick={() => handleAddOrEdit({ ...formData, id: editingProject?.id })}>
                {editingProject ? "Guardar" : "Añadir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {projectToDelete && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>¿Estás seguro de eliminar este proyecto?</h3>
            <div className="modal-buttons">
              <button onClick={() => setProjectToDelete(null)}>Cancelar</button>
              <button onClick={() => handleDelete(projectToDelete.id)}>Eliminar</button>
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
