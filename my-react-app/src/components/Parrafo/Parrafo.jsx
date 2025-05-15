function Parrafo({ contenido, clase="" }){
    return(
        <p className={clase}>{contenido}</p>
    );
}

export default Parrafo;