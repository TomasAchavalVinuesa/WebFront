import InputCampo from "../InputCampo/InputCampo";
import LabelCampo from "../LabelCampo/LabelCampo";
function Campo({ name, contenido, id, value, onChange }){
    return(
        <div className="form-row">
            <LabelCampo inputcampo={name} contenido={contenido} />
            <InputCampo id={id} name={name} value={value} onChange={onChange}/>
        </div>
    );
}

export default Campo;
