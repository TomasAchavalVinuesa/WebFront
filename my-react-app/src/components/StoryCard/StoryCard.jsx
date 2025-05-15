import { useNavigate } from "react-router-dom";
import Boton from "../Boton/Boton";
import Span from "../Span/Span";
import "./StoryCard.css"

function StoryCard({ story, onEdit, onDelete }){
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/story/${story.id}`);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        onEdit(story);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(story);
    };

    return(
        <div key={story.id} className="project-card" onClick={handleNavigate}>
            <div className="project-header">
                <Span clase="project-name" contenido={story.name}/>
                <Span clase="project-name" contenido={story.points}/> 
                <Span clase="project-name" contenido={story.status}/> 
            </div>
            <div className="project-description">{story.description}</div>
            <div className="project-members">👥 Miembros: {story.memberNames}</div>
            <div className="project-members">👥 Owner: {story.owner}</div>
            <div className="project-actions">
                <Boton onClick={handleEditClick} contenido="Editar"/>
                <Boton onClick={handleDeleteClick} contenido="Eliminar"/>
            </div>
        </div>
    );
}

export default StoryCard;
