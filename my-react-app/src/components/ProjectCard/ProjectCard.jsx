import { useNavigate } from "react-router-dom";
import Boton from "../Boton/Boton";
import Span from "../Span/Span";
import "./ProjectCard.css"

function ProjectCard({ project, onEdit, onDelete }){
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/projects/${project.id}`);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        onEdit(project);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(project);
    };

    return(
        <div key={project.id} className="project-card" onClick={handleNavigate}>
            <div className="project-header">
                <Span clase="project-icon" contenido={project.icon}/> 
                <Span clase="project-name" contenido={project.name}/>
            </div>
            <div className="project-description">{project.description}</div>
            <div className="project-members">👥 {project.memberNames}</div>
            <div className="project-actions">
                <Boton onClick={handleEditClick} contenido="Editar"/>
                <Boton onClick={handleDeleteClick} contenido="Eliminar"/>
            </div>
        </div>
    );
}

export default ProjectCard;
