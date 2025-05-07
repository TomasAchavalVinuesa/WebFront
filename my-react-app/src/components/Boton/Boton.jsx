function Boton({ clase, contenido, onClick}){
    return(
        <button type="button" ClassName={clase} onClick={onClick}>{contenido}</button>
    );
}

export default Boton;
