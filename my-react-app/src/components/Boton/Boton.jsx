function Boton({ clase, contenido, onClick}){
    return(
        <button type="button" className={clase} onClick={onClick}>{contenido}</button>
    );
}

export default Boton;
