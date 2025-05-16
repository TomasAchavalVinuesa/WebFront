import TitulosH2 from "../TitulosH2/TitulosH2";
import Parrafo from "../Parrafo/Parrafo";
function ProjectD({ name, description, memberNames, icon }){
    return(
        <div className="project-detail-card">
            <TitulosH2 contenido="Información del proyecto"/>
            <Parrafo contenido={<><strong>Nombre:</strong> {name}</>} />
            <Parrafo contenido={<><strong>Descripción:</strong> {description}</>} />
            <Parrafo contenido={<><strong>Miembros:</strong> {memberNames}</>} />
            <Parrafo contenido={<><strong>Icono:</strong> {icon}</>} />
        </div>
    );
}

export default ProjectD;
