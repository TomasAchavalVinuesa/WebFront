import TitulosH1 from "../TitulosH1/TitulosH1";
import Parrafo from "../Parrafo/Parrafo";
import Imagen from "../imagen/imagen";
function ContHomeLogueado({ user, cantProyectos }){
    return(
        <>
            <TitulosH1 contenido={`Bienvenido ${user}`}/>
            <Parrafo contenido={`Tienes ${cantProyectos || 0} proyectos pendientes`}/>
            <Imagen src="src/assets/images/Home.png" alt="trabajando" clase="home-img"/>
            <Parrafo contenido= {<> Prepara tu próxima taza de café <br/> y ¡Manos a la obra!         </>} /> 
        </>
    );
}
/* Acá hubiera sido mil veces más fácil hacer 2 párrafos pero "El flow se respeta" */
export default ContHomeLogueado;