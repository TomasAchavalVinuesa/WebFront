function Imagen({ src, alt, clase="" }){
    return(
        <img src={src} alt={alt} className={clase}/>
    );
}

export default Imagen;
