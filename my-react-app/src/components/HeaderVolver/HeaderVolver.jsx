import Boton from "../Boton/Boton";
import { useNavigate } from "react-router-dom";

function HeaderVolver({ contenido }){
    const navigate = useNavigate();

    return(
        <>
            <Boton clase="hamburger" onClick={() => navigate(-1)} contenido="<"/>
            <h2>{contenido}</h2>
        </>
    );
}

export default HeaderVolver;


