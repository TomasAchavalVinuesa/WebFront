import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLogueado from "../../components/HeaderLogueado/HeaderLogueado";
import "./MyProjects.css";

export default function MyProjects() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [message, setMessage] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "",
    members: [],
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
          const proyectosFormateados = await Promise.all(
            data.map(async (p) => {
              const memberNames = await fetchUserNames(p.members, token);
              return {
                id: p._id,
                name: p.name,
                description: p.description,
                icon: p.icon,
                members: p.members,
                memberNames: memberNames.join(", "),
              };
            })
          );
          setProjects(proyectosFormateados);
        } else {
          alert(`Error al obtener proyectos: ${data.error || "Error desconocido"}`);
        }
      } catch (error) {
        alert("Error al conectarse con el servidor: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
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

    fetchProyectos();
    fetchUsuarios();
  }, []);

  const fetchUserNames = async (ids, token = localStorage.getItem("token")) => {
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

  const updateProject = async (project) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No estás autenticado.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5100/project/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: project.name,
          icon: project.icon,
          description: project.description,
          members: project.members
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error desconocido al actualizar el proyecto");
      }

      setMessage("Proyecto actualizado exitosamente.");
    } catch (error) {
      setMessage(`Error al actualizar: ${error.message}`);
      console.error("Error al hacer PUT:", error);
    }
  };

  const handleAddOrEdit = async(project) => {
    const { name, icon, description, members } = project;
    if (!name || !icon || !description || members.length === 0){
      setMessage("No pueden haber campos vacíos");
      return;
    }
    const token = localStorage.getItem("token");
    const memberNames = await fetchUserNames(members, token);

    const formattedProject = {
      ...project,
      memberNames: memberNames.join(", "),
      id: editingProject ? editingProject.id : Date.now(),
    };

    if (editingProject) {
      await updateProject(formattedProject); // nueva línea
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? formattedProject : p))
      );
    } else {
      setProjects((prev) => [...prev, formattedProject]);
    }

    setShowForm(false);
    setEditingProject(null);
    setFormData({ name: "", icon: "", description: "", members: [] });
  };

  const handleDelete = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setProjectToDelete(null);
    setMessage("Proyecto eliminado exitosamente");
  };

  return (
    <div className="my-projects-container">
      <HeaderLogueado contenido="📂 My Projects" />

      {loading ? (
        <div className="project-loader">
          <h2>Cargando proyectos</h2>
          <img src="src/assets/images/RelojArena.png" alt="Cargando..." className="loader-image" />
          <p>Esto puede tomar un momento</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-projects">
          <p className="empty-message">No tienes proyectos pendientes</p>
          <span className="empty-emoji">😟</span>
          <button className="add-project-btn" onClick={() => {
            setFormData({ name: "", icon: "", description: "", members: [] });
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
              <div
                key={project.id} className="project-card" onClick={() => navigate(`/projects/${project.id}`)} style={{ cursor: "pointer" }}>
                <div className="project-header">
                  <span className="project-icon">{project.icon}</span>
                  <span className="project-name">{project.name}</span>
                </div>
                <div className="project-description">{project.description}</div>
                <div className="project-members">👥 {project.memberNames}</div>
                <div className="project-actions">
                  <button onClick={(e) => { e.stopPropagation(); setFormData({ name: project.name, icon: project.icon, description: project.description, members: project.members}); setEditingProject(project); setShowForm(true); }}>Editar</button>
                  <button onClick={(e) => { e.stopPropagation(); setProjectToDelete(project); }}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={() => {
            setFormData({ name: "", icon: "", description: "", members: [] });
            setEditingProject(null);
            setShowForm(true);
          }}>
            Añadir Proyecto
          </button>
        </>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}</h3>
            <input type="text" placeholder="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input type="text" placeholder="Icono" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} />
            <input type="text" placeholder="Descripción" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <div className="user-select-container">
              <p>Seleccionar miembros:</p>
              <div className="user-buttons">
                {allUsers.map((user) => {
                  const isSelected = formData.members.includes(user._id);
                  return (
                    <button
                      key={user._id}
                      className={`user-btn ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        const newMembers = isSelected
                          ? formData.members.filter((id) => id !== user._id)
                          : [...formData.members, user._id];
                        setFormData({ ...formData, members: newMembers });
                      }}
                    >
                      {user.name.first} {user.name.last}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={() => { setShowForm(false); setEditingProject(null); }}>Cancelar</button>
              <button onClick={() => handleAddOrEdit({ ...formData, id: editingProject?.id })}>{editingProject ? "Guardar" : "Añadir"}</button>
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
