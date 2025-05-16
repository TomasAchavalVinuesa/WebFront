import TitulosH2 from "../TitulosH2/TitulosH2";
import Parrafo from "../Parrafo/Parrafo";
function StoryD({ name, description, memberNames, ownerName, points }){
    return(
        <div className="project-detail-card">
            <TitulosH2 contenido="Información de la Story"/>
            <Parrafo contenido={<><strong>Nombre:</strong> {name}</>} />
            <Parrafo contenido={<><strong>Descripción:</strong> {description}</>} />
            <Parrafo contenido={<><strong>Miembros:</strong> {memberNames}</>} />
            <Parrafo contenido={<><strong>Owner:</strong> {ownerName}</>} />
            <Parrafo contenido={<><strong>Puntos:</strong> {points}</>} />
        </div>
    );
}

export default StoryD;

