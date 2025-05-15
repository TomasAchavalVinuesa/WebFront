import "./ContenidoVacio.css"

function ContenidoVacio({ onClick, contenidoB, contenidoP }){
    return(
        <div className="empty-projects">
            <Parrafo contenido={`No tienes ${contenidoP} pendientes`} clase="empty-message"/>
            <Span clase="empty-emoji" contenido="😟"/>
            <Boton clase="add-project-btn" onClick={onClick} contenido={contenidoB}/>
        </div>
    );
}

export default ContenidoVacio;
