import Linker from "../Linker/Linker";
import Boton from "../Boton/Boton";

function AccionesSesion({ dire1, dire2, clase, onClick, contenido1, contenido2, contenido3 }){
    return(
        <div className="actions">
            <Linker direccion={dire1} contenido={<Boton clase={clase} onClick="none" contenido={contenido1}/>} />
            <Linker direccion={dire2} contenido={<Boton clase={clase} onClick="none" contenido={contenido2}/>}/>
            <Boton ClassName={clase} onClick={onClick} contenido={contenido3}/>
        </div>
    );
}
    
export default AccionesSesion;
