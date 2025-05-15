//Importaciones
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLogueado from "../../components/HeaderLogueado/HeaderLogueado";
import Loading from "../Loading/Loading";
import "./MyProjects.css";
import Boton from "../../components/Boton/Boton";
import ContenidoVacio from "../ContenidoVacio/ContenidoVacio";
import ProjectCard from "../../components/ProjectCard/ProjectCard";


//Declaración del componente
export default function MyProjects() {
  //useStates y useNavigate inicializaciones
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [message, setMessage] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "",
    members: [],
  });

  //Al cargar el componente se ejecutan esas 2 funciones (Profundizar funcionamiento de este caso del useEffect)
  useEffect(() => {
    fetchProyectos();
    fetchUsuarios();
  }, []);

  //Trae todos los proyectos asociados al usuario del token
  const fetchProyectos = async () => {
    //Comprueba que haya almenos un token almacenado, si no nos tira al /login
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  

    //Hace la petición a la API para que me traiga los proyectos
    try {
      const response = await fetch("http://localhost:5100/project/my-projects", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      //llama a otra función que revisa que no tire un error 401 que sería que el token es inválido o está vencido
      if (await handleUnauthorized(response)) return;

      //almacena la data de los proyectos 
      const data = await response.json();

      //En caso de que la consulta sea exitosa hace un mapeo de los datos 
      if (response.ok) {
        //Promise.all espera que todas las promesas generadas por el .map se resuelvan  (el await detiene la ejecución hasta que las transformaciones estén listas)
        const proyectosFormateados = await Promise.all(
          //como data es un array con los proyectos entonces lo que hacemos es transformar cada proyecto en otro objeto de forma asíncrona 
          data.map(async (p) => {
            //Se llama a una función que recibe el id de los usuarios y el token y devuelve un array de los nombres de usuario
            const memberNames = await fetchUserNames(p.members, token);
            return {
              id: p._id,
              name: p.name,
              description: p.description,
              icon: p.icon,
              //en members se guardan los id de los miembros, en memberNames se guarda los nombres del fetch que hicimos antes, separdos con comas para que sea legible
              members: p.members,
              memberNames: memberNames.join(", "),
            };
          })
        );
        //Se guardan los objetos en un estado (como un array de los objetos)
        setProjects(proyectosFormateados);
      } else {
        alert(`Error al obtener proyectos: ${data.error || "Error desconocido"}`);
      }
    } catch (error) {
      alert("Error al conectarse con el servidor: ", error);
      //al finalizar este intento se cambia el estado del Login haciendo que desaparezca esa pantalla de carga
    } finally {
      setLoading(false);
    }
  };

  //Trae todos los usuarios
  const fetchUsuarios = async () => {
    const token = localStorage.getItem("token");
      if (!token){
        navigate("/login");
        return
      }  
    try {
      const response = await fetch("http://localhost:5100/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (await handleUnauthorized(response)) return;
      if (!response.ok) throw new Error("Error al obtener usuarios");
      //Guarda el array de usuarios en users y posteriormente ese array en un estado
      const users = await response.json();
      setAllUsers(users);
    }catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  //Esta función busca id por id el nombre y apellido del usuario y los mapea 
  const fetchUserNames = async (ids, token) => {
    const nombres = await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(`http://localhost:5100/user/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (await handleUnauthorized(res)) return;
          if (res.ok) {
            const data = await res.json();
            return `${data.name.first} ${data.name.last}`;
          } else {
            return "Usuario desconocido";
          }
        } catch {
          return "Error al obtener usuario";
        }
      })
    );
    //acá retorna los nombres mapeados como un array de Strings
    return nombres;
  };

  //Función para actualizar los datos de un proyecto
  const updateProject = async (project) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  
    try {
      const response = await fetch(`http://localhost:5100/project/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        //Acá convierte el contenido del proyecto en un Json que el servidor pueda procesar
        body: JSON.stringify({
          name: project.name,
          icon: project.icon,
          description: project.description,
          members: project.members
        })
      });
      //Aca nos interesa saber si la actualización se realizó exitosamente o si hubo un error
      const result = await response.json();
      if (await handleUnauthorized(response)) return;
      if (!response.ok) {
        throw new Error(result.error || `Error desconocido al actualizar el proyecto y el id es ${project.id}`);
      }

      setMessage("Proyecto actualizado exitosamente.");
    } catch (error) {
      setMessage(`Error al actualizar: ${error.message}`);
      console.error("Error al hacer PUT:", error);
    }
  };

  //Función que revisa si el token está vencido o si es inválido y en dicho caso lo borra y nos manda al /login
  const handleUnauthorized = async (response) => {
    if (response.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return true;
    }
    return false;
  };

  //Función para añadir un proyecto 
  const addProject = async (project) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  
    try {
      const response = await fetch(`http://localhost:5100/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: project.name,
          icon: project.icon,
          description: project.description,
          members: project.members
        })
      });

      const result = await response.json();
      if (await handleUnauthorized(response)) return;
      if (!response.ok) {
        throw new Error(result.error || "Error desconocido al añadir el proyecto");
      }

      setMessage("Proyecto añadido exitosamente.");
    } catch (error) {
      setMessage(`Error al añadir el proyecto: ${error.message}`);
      console.error("Error al hacer POST:", error);
    }
  };

  //Función manejadora para editar o añadir un proyecto usando el mismo formulario pero de distinta manera
  const handleAddOrEdit = async(project) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  
    //acá desestructura el proyecto que recibe y luego comprueba que no tenga campos vacios 
    const { name, icon, description, members } = project;
    if (!name || !icon || !description || members.length === 0){
      setMessage("No pueden haber campos vacíos");
      return;
    }

    //acá almacenamos los nombres de los usuarios
    const memberNames = await fetchUserNames(members, token);

    const formattedProject = {
      //copia todas las propiedades del proyecto original
      ...project,
      //transforma el array de nombres en 1 string
      memberNames: memberNames.join(", "),
      //si se edita un proyecto conservará su id, si se está creando entonces se generará un ID único basado en el tiempo actual (Esto tendríamos que consultar si no conviene hacer que el back se encargue de generar el ID pero de momento queda así)
      id: editingProject ? editingProject.id : Date.now(),
    };

    //si el valor actual del estado editingProject es true entonces usa la función para actualizar el proyecto y le pasa el proyecto formateado 
    if (editingProject) {
      await updateProject(formattedProject);
      //Acá actualiza los proyectos que están en el estado para que cargue los cambios según aparezca en la base de datos
      await fetchProyectos();
    } else { //si el estado de editingProject es false entonces añadimos un proyecto nuevo pasando el proyecto formateado  y también actualizamos el estado de los proyectos para que muestre el nuevo
      await addProject(formattedProject);
      await fetchProyectos();
    }
    
    //Esto va a hacer que desaparezca el formulario de editar/crear proyecto
    setShowForm(false);
    //acá sacamos el proyecto que se está editando para evitar posibles errores
    setEditingProject(null);
    //reiniciamos el estado del form para que no hayan datos de anteriores proyectos creados/editados
    setFormData({ name: "", icon: "", description: "", members: [] });
  };

  //Función manejadora para eliminar proyectos
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }
    try {
      //acá revisamos que no tenga epicas dentro antes de borrarlo
      const res = await fetch(`http://localhost:5100/project/${id}/epics`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // y de paso revisamos que el token no se haya vencido 
      if (await handleUnauthorized(res)) return;
      if (!res.ok) {
        throw new Error("Error en la Comprobación de Epicas pendientes dentro del proyecto a eliminar");
      }
      const epics = await res.json();
      if (epics.length !== 0) {
        setMessage("No puedes eliminar un proyecto que tiene Épicas pendientes");
        //si ese proyecto tiene epicas entonces lo sacamos del estado de eliminar y salimos de la función mostrando en pantalla que no debe tener epicas para poder eliminarlo
        setProjectToDelete(null)
        return;
      }
      //se elimina el proyecto (Generalmente optaría por usar un valor binario de elemento eliminado para ahorrarnos problemas en caso de borrar algo que no se debía borrar pero por tratarse de un proyecto de prueba simplemente se borra)
      const response = await fetch(`http://localhost:5100/project/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (await handleUnauthorized(response)) return;
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Error desconocido al eliminar el proyecto");
      }
      setMessage("Proyecto Eliminado exitosamente.");
      //estas 2 ultimas invocaciones de funciones son para evitar errores como que se repita el mensaje de "seguro quiere eliminar esto" y la otra invocacion es para reflejar los cambios en la BD 
      setProjectToDelete(null)
      fetchProyectos();
    } catch (error) {
      //informa del error y saca del estado al proyecto para evitar que se repita varias veces los cuadros de dialogo
      setMessage(`Error al Eliminar: ${error.message}`);
      setProjectToDelete(null)
      console.error("Error al hacer DELETE:", error);
    }
  };
  
  //Función manejadora sobre lo que sucede al clickear la parte de añadir proyecto 
  function handleAddProjectClick() {
    //aseguramos que los datos del form estén en blanco, que se marque que no se está editando y que nos muestre el formulario que queremos
    setFormData({ name: "", icon: "", description: "", members: [] });
    setEditingProject(null);
    setShowForm(true);
  }

  return (
    <div className="my-projects-container">
      <HeaderLogueado contenido="📂 My Projects" />
      {loading ? (
        <Loading contenido="Proyectos"/>
      ) : projects.length === 0 ? (
        <ContenidoVacio onClick={handleAddProjectClick} contenidoB="Añadir Proyecto" contenidoP="proyectos" />
      ) : (
        <>
          <div className="project-list"> {/*Aca esta el listado de proyectos donde se mapea los proyectos con un componente projectCard */}
            {projects.map((project) => (
              <ProjectCard project={project} 
                onDelete={() => setProjectToDelete(project)} 
                onEdit={() => { 
                  setEditingProject(project); 
                  setFormData({
                    name: project.name,
                    icon: project.icon,
                    description: project.description,
                    members: project.members
                  });
                  setShowForm(true);
                  {/*Como posibilidad de mejora se podría buscar quitar estas declaraciones de funciones fuera del return */}
              }}/> 
            ))}
          </div>
          <Boton clase="add-btn" onClick={handleAddProjectClick} contenido="Añadir Proyecto"/>
        </>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}</h3>
            <input type="text" placeholder="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input type="text" placeholder="Icono" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} />
            <input type="text" placeholder="Descripción" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <div className="user-select-container">
              <p>Seleccionar miembros:</p>
              <div className="user-buttons">
                {allUsers.map((user) => {
                  const isSelected = formData.members.includes(user._id);
                  return (
                    <button
                      key={user._id}
                      className={`user-btn ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        const newMembers = isSelected
                          ? formData.members.filter((id) => id !== user._id)
                          : [...formData.members, user._id];
                        setFormData({ ...formData, members: newMembers });
                      }}
                    >
                      {user.name.first} {user.name.last}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={() => { setShowForm(false); setEditingProject(null); }}>Cancelar</button>
              <button onClick={() => handleAddOrEdit({ ...formData, id: editingProject?.id })}>{editingProject ? "Guardar" : "Añadir"}</button>
            </div>
          </div>
        </div>
      )}

      {projectToDelete && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>¿Estás seguro de eliminar este proyecto?</h3>
            <div className="modal-buttons">
              <button onClick={() => setProjectToDelete(null)}>Cancelar</button>
              <button onClick={() => handleDelete(projectToDelete.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>{message}</p>
            <div className="modal-buttons">
              <button onClick={() => setMessage(null)}>Aceptar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
