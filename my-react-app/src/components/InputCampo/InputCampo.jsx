function InputCampo({ id, name, value, onChange, tipo = "text"}){
    return(
        <input id={id} type={tipo} name={name} value={value} onChange={onChange} required/>
    );
}

export default InputCampo;



