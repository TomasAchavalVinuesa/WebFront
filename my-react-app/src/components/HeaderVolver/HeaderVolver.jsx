import Boton from "../Boton/Boton";
import { useNavigate } from "react-router-dom";
import "./HeaderVolver.css";

function HeaderVolver({ contenido }){
    const navigate = useNavigate();

    return(
        <>
            <div className="hvolver">
                <Boton clase="hamburger" onClick={() => navigate(-1)} contenido="<"/>
                <h2>{contenido}</h2>
            </div>
            
        </>
    );
}

export default HeaderVolver;


