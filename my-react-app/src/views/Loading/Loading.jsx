import TitulosH2 from "../../components/TitulosH2/TitulosH2";
import Imagen from "../../components/imagen/imagen";
import Parrafo from "../../components/Parrafo/Parrafo";
import "./Loading.css";

function Loading({ contenido }){
    return(
        <div className="loader">
            <TitulosH2 contenido={ `Cargando ${contenido}`} />
            <Imagen src="src/assets/images/RelojArena.png" alt="Cargando..." clase="loader-image"/>
            <Parrafo contenido="Esto puede tomar un momento"/>
        </div>
    );
}

export default Loading;
