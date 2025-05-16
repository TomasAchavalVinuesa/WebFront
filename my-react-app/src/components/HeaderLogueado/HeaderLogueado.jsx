import Boton from "../Boton/Boton";
import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./HeaderLogueado.css";


function HeaderLogueado({ contenido }){

    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    return(
        <>
            <div className="hLogueado">
                <Boton clase="hamburger" onClick={toggleMenu} contenido="☰"/>
                <Sidebar isOpen={menuOpen} toggleMenu={toggleMenu}/>
                <h2>{contenido}</h2>
            </div>
            
        </>
    );
}

export default HeaderLogueado;



