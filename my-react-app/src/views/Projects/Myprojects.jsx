import { useEffect, useState } from "react";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectForm from "../components/projects/ProjectForm";
import ProjectLoader from "../components/projects/ProjectLoader";
import ProjectEmpty from "../components/projects/ProjectEmpty";
import ProjectConfirmDelete from "../components/projects/ProjectConfirmDelete";
import ProjectMessage from "../components/projects/ProjectMessage";
import "../styles/projects.css";

export default function MyProjects() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      // Simulación de carga de proyectos
      setProjects([]); // Cambiar a una lista para testear
      setLoading(false);
    }, 1500);
  }, []);

  const handleAddOrEdit = (project) => {
    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? project : p))
      );
    } else {
      setProjects((prev) => [...prev, { ...project, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingProject(null);
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
        <ProjectLoader />
      ) : projects.length === 0 ? (
        <ProjectEmpty onAdd={() => setShowForm(true)} />
      ) : (
        <>
          <div className="project-list">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => {
                  setEditingProject(project);
                  setShowForm(true);
                }}
                onDelete={() => setProjectToDelete(project)}
              />
            ))}
          </div>
          <button className="add-btn" onClick={() => setShowForm(true)}>
            Añadir Proyecto
          </button>
        </>
      )}

      {showForm && (
        <ProjectForm
          project={editingProject}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
          onSave={handleAddOrEdit}
        />
      )}

      {projectToDelete && (
        <ProjectConfirmDelete
          project={projectToDelete}
          onCancel={() => setProjectToDelete(null)}
          onConfirm={() => handleDelete(projectToDelete.id)}
        />
      )}

      {message && <ProjectMessage text={message} onClose={() => setMessage(null)} />}
    </div>
  );
}
