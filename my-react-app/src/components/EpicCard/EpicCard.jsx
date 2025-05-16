import { useNavigate } from "react-router-dom";
import Boton from "../Boton/Boton";
import Span from "../Span/Span";
import "./EpicCard.css"

function EpicCard({ epic, onEdit, onDelete }){
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/epics/${epic._id}`);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        onEdit(epic);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(epic);
    };

    return(
        <div key={epic.id} className="epic-card" onClick={handleNavigate}>
            <div className="project-header">
                <Span clase="project-icon" contenido={epic.icon}/> 
                <Span clase="project-name" contenido={epic.name}/>
            </div>
            <div className="project-description">{epic.description}</div>
            <div className="epic-actions">
                <Boton onClick={handleEditClick} contenido="Editar"/>
                <Boton onClick={handleDeleteClick} contenido="Eliminar"/>
            </div>
        </div>
    );
}

export default EpicCard;
