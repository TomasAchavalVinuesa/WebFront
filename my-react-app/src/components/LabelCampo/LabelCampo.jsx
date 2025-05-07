function LabelCampo({ inputcampo, contenido}){
    return(
        <label htmlFor={inputcampo}>{contenido}</label>
    );
}

export default LabelCampo;
