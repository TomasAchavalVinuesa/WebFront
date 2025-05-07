import { Link } from "react-router-dom";

function Linker({  contenido, direccion, onClick =() => {} }){ //le asgina por defecto nada a onClick 
    return(
        <Link to={direccion} onClick={onClick}>{contenido}</Link>
    );
}

export default Linker;
