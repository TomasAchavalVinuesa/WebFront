import Imagen from "../imagen/imagen";

function LogoSideBar({ src, alt, clase}){
    return(
        <div className={clase}>
            <Imagen src={src} alt={alt}/>
        </div>
    );
}

export default LogoSideBar;
