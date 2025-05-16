import { useNavigate } from "react-router-dom";
import Span from "../Span/Span";
import "./MyStoryCard.css"

function MyStoryCard({ story }){
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/story/${story.id}`);
    };

    return(
        <div key={story.id} className="project-card" onClick={handleNavigate}>
            <Span clase="project-name" contenido={<>Story: {story.name}<br/></>}/>
            <Span clase="project-name" contenido={<>Dificultad: {story.points}<br/></>}/> 
            <Span clase="project-name" contenido={<>Estado: {story.status}<br/></>}/> 
            <div className="project-description">Descripción: {story.description}</div>
            <div className="project-members">👥 Miembros: {story.memberNames}</div>
            <div className="project-members">👥 Owner: {story.ownerName}</div>
        </div>
    );
}

export default MyStoryCard;

