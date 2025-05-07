import Campo from "../Campo/Campo";
function FormularioLogin({ usuario, password, onChange }) {
    return (
        <>
            <Campo name="usuario" contenido="usuario" id="usuario" value={usuario} onChange={onChange} />
            <Campo name="password" tipo="password" contenido="password" id="password" value={password} onChange={onChange} />
        </>
    );
}

export default FormularioLogin;