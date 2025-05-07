function inputCampo({ id, name, value, onChange}){
    return(
        <input id={id} name={name} value={value} onChange={onChange} required/>
    );
}

export default inputCampo;



