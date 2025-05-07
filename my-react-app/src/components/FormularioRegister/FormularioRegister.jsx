import Campo from "../Campo/Campo";
function FormularioRegister({ usuario, email, password, nombre, apellido, onChange }) {
    return (
        <>
            <Campo name="usuario" contenido="usuario" id="usuario" value={usuario} onChange={onChange} />
            <Campo name="email" contenido="email" id="email" value={email} onChange={onChange} />
            <Campo name="password" contenido="password" id="password" value={password} onChange={onChange} />
            <Campo name="nombre" contenido="nombre" id="nombre" value={nombre} onChange={onChange} />
            <Campo name="apellido" contenido="apellido" id="apellido" value={apellido} onChange={onChange} />
        </>
    );
}

export default FormularioRegister;