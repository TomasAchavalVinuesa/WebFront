import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLogueado from "../../components/HeaderLogueado/HeaderLogueado";
import Loading from "../Loading/Loading";
import "./MyProjects.css";
import Boton from "../../components/Boton/Boton";
import ContenidoVacio from "../ContenidoVacio/ContenidoVacio";
import ProjectCard from "../../components/ProjectCard/ProjectCard";

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
    fetchProyectos();
    fetchUsuarios();
  }, []);

  const fetchProyectos = async () => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
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
    const token = localStorage.getItem("token");
      if (!token){
        navigate("/login");
        return
      }  
    try {
      const response = await fetch("http://localhost:5100/user", {
        method: "GET",
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

  const fetchUserNames = async (ids, token) => {
    const nombres = await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(`http://localhost:5100/user/${id}`, {
            method: "GET",
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
    if (!token){
      navigate("/login");
      return
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
        throw new Error(result.error || `Error desconocido al actualizar el proyecto y el id es ${project.id}`);
      }

      setMessage("Proyecto actualizado exitosamente.");
    } catch (error) {
      setMessage(`Error al actualizar: ${error.message}`);
      console.error("Error al hacer PUT:", error);
    }
  };

  const addProject = async (project) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  
    try {
      const response = await fetch(`http://localhost:5100/project`, {
        method: "POST",
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
        throw new Error(result.error || "Error desconocido al añadir el proyecto");
      }

      setMessage("Proyecto añadido exitosamente.");
    } catch (error) {
      setMessage(`Error al añadir el proyecto: ${error.message}`);
      console.error("Error al hacer POST:", error);
    }
  };

  const handleAddOrEdit = async(project) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  
    const { name, icon, description, members } = project;
    if (!name || !icon || !description || members.length === 0){
      setMessage("No pueden haber campos vacíos");
      return;
    }
    const memberNames = await fetchUserNames(members, token);

    const formattedProject = {
      ...project,
      memberNames: memberNames.join(", "),
      id: editingProject ? editingProject.id : Date.now(),
    };

    if (editingProject) {
      await updateProject(formattedProject); // nueva línea
      await fetchProyectos();
    } else {
      await addProject(formattedProject);
      await fetchProyectos();
    }
    
    setShowForm(false);
    setEditingProject(null);
    setFormData({ name: "", icon: "", description: "", members: [] });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  
    try {
      const response = await fetch(`http://localhost:5100/project/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Error desconocido al eliminar el proyecto");
      }
      setMessage("Proyecto Eliminado exitosamente.");
      setProjectToDelete(null);
      fetchProyectos();
    } catch (error) {
      setMessage(`Error al Eliminar: ${error.message}`);
      console.error("Error al hacer DELETE:", error);
    }
  };
  
  function handleAddProjectClick() {
    setFormData({ name: "", icon: "", description: "", members: [] });
    setEditingProject(null);
    setShowForm(true);
  }

  

  return (
    <div className="my-projects-container">
      <HeaderLogueado contenido="📂 My Projects" />
      {loading ? (
        <Loading contenido="Proyectos"/>
      ) : projects.length === 0 ? (
        <ContenidoVacio onClick={handleAddProjectClick} contenidoB="Añadir Proyecto" contenidoP="proyectos" />
      ) : (
        <>
          <div className="project-list">
            {projects.map((project) => (
              <ProjectCard project={project} 
                onDelete={() => setProjectToDelete(project)} 
                onEdit={() => {
                  setEditingProject(project); 
                  setFormData({
                    name: project.name,
                    icon: project.icon,
                    description: project.description,
                    members: project.members
                  });
                  setShowForm(true);
              }}/>
            ))}
          </div>
          <Boton clase="add-btn" onClick={handleAddProjectClick} contenido="Añadir Proyecto"/>
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
