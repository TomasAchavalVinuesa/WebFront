import Linker from "../Linker/Linker";

function NavSideBar({ direccion1, direccion2, direccion3, direccion4, contenido1, contenido2, contenido3, contenido4, onClick}){
    return(
        <nav className="sidebar-links">
            <Linker direccion={direccion1} contenido={contenido1} onClick={onClick}/>
            <Linker direccion={direccion2} contenido={contenido2} onClick={onClick}/>
            <Linker direccion={direccion3} contenido={contenido3} onClick={onClick}/>
            <div className="sidebar-bottom">
                <Linker direccion={direccion4} contenido={contenido4} onClick={onClick}/>
            </div>
        </nav>
    );
}

export default NavSideBar;
