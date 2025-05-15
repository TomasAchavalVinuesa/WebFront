import "./Span.css";

function Span({ contenido, clase="" }){
    return(
        <span className={clase}>{contenido}</span>
    );
}

export default Span;

