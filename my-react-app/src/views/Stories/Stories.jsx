import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; //Capaz luego eliminar
import Boton from "../../components/Boton/Boton";
import "./Stories.css";
import StoryCard from "../../components/StoryCard/StoryCard.jsx"


export default function Stories({ epicId }) {
  const [story, setStory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ //corregir
    points: 0,
    status: "todo",
    name: "",
    description: "",
    owner: "",
    members: [],
  });
  const [editingStory, setEditingStory] = useState(null);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [message, setMessage] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStory();
    fetchUsuarios();
  }, [epicId]);

  const fetchStory = async () => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  
    try {
        const res = await fetch(`http://localhost:5100/epic/${epicId}/stories`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (await handleUnauthorized(res)) return;
        const data = await res.json();
        if (res.ok) {
          const storiesFormateadas = await Promise.all(
            data.map(async (s) => {
              const memberNames = await fetchUserNames(s.assignedTo, token);
              const ownerName = await fetchUserNames([s.owner], token);
              return {
                id: s._id,
                name: s.name,
                description: s.description,
                owner: s.owner,
                points: s.points,
                status: s.status,
                members: s.assignedTo,
                ownerName: ownerName,
                memberNames: memberNames.join(", "),
              };
            })
          );
          setStory(storiesFormateadas);
        } else {
          alert(`Error al obtener las stories: ${data.error || "Error desconocido"}`);
        }
      } catch (error) {
        alert("Error al conectarse con el servidor (I): " + error.message);
      }
  };

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
  
  const updateStory = async (story) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  
    try {
      const response = await fetch(`http://localhost:5100/story/${story.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: story.name,
          points: story.points,
          status: story.status,
          description: story.description,
          owner: story.owner,
          members: story.members
        })
      });

      const result = await response.json();
      if (await handleUnauthorized(response)) return;

      if (!response.ok) {
        throw new Error(result.error || "Error desconocido al actualizar el proyecto");
      }

      setMessage("Story actualizada exitosamente.");
    } catch (error) {
      setMessage(`Error al actualizar: ${error.message}`);
      console.error("Error al hacer PUT:", error);
    }
  };

  const handleUnauthorized = async (response) => {
    if (response.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return true;
    }
    return false;
  };
  
  const addStory = async (story) => {
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
          name: story.name,
          points: story.points,
          status: story.status,
          description: story.description,
          owner: story.owner,
          members: story.members
        })
      });

      const result = await response.json();
      if (await handleUnauthorized(response)) return;
      if (!response.ok) {
        throw new Error(result.error || "Error desconocido al añadir la story");
      }

      setMessage("Story añadida exitosamente.");
    } catch (error) {
      setMessage(`Error al añadir La story: ${error.message}`);
      console.error("Error al hacer POST:", error);
    }
  };

  const handleAddOrEdit = async (story) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    } 

    const { name, description, members, owner, points, status } = formData;
    if (!name || !description || members.length === 0 || !owner || !status || !points){
      setMessage("No pueden haber campos vacíos");
      return;
    }
    const memberNames = await fetchUserNames(members, token);

    const formattedStory = {
      //copia todas las propiedades del proyecto original
      ...story,
      //transforma el array de nombres en 1 string
      memberNames: memberNames.join(", "),
      //si se edita un proyecto conservará su id, si se está creando entonces se generará un ID único basado en el tiempo actual (Esto tendríamos que consultar si no conviene hacer que el back se encargue de generar el ID pero de momento queda así)
      id: editingStory ? editingStory.id : Date.now(),
    };

    //si el valor actual del estado editingProject es true entonces usa la función para actualizar el proyecto y le pasa el proyecto formateado 
    if (editingStory) {
      await updateStory(formattedStory);
      //Acá actualiza los proyectos que están en el estado para que cargue los cambios según aparezca en la base de datos
      await fetchStory();
    } else { //si el estado de editingProject es false entonces añadimos un proyecto nuevo pasando el proyecto formateado  y también actualizamos el estado de los proyectos para que muestre el nuevo
      await addStory(formattedStory);
      await fetchStory();
    }

    setShowForm(false);
    setEditingStory(null);
    setFormData({ 
    points: 0,
    status: "todo",
    name: "",
    description: "",
    owner: "",
    members: [],
  });
  };


  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }
    try {
      //acá revisamos que no tenga epicas dentro antes de borrarlo
      const res = await fetch(`http://localhost:5100/story/${id}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // y de paso revisamos que el token no se haya vencido 
      if (await handleUnauthorized(res)) return;
      if (!res.ok) {
        throw new Error("Error en la Comprobación de Epicas pendientes dentro del proyecto a eliminar");
      }
      const tasks = await res.json();
      if (tasks.length !== 0) {
        setMessage("No puedes eliminar una Story que tiene tareas pendientes");
        //si ese proyecto tiene epicas entonces lo sacamos del estado de eliminar y salimos de la función mostrando en pantalla que no debe tener epicas para poder eliminarlo
        setStoryToDelete(null)
        return;
      }
      //se elimina el proyecto (Generalmente optaría por usar un valor binario de elemento eliminado para ahorrarnos problemas en caso de borrar algo que no se debía borrar pero por tratarse de un proyecto de prueba simplemente se borra)
      const response = await fetch(`http://localhost:5100/story/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (await handleUnauthorized(response)) return;
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Error desconocido al eliminar la story");
      }
      setMessage("Story Eliminada exitosamente.");
      //estas 2 ultimas invocaciones de funciones son para evitar errores como que se repita el mensaje de "seguro quiere eliminar esto" y la otra invocacion es para reflejar los cambios en la BD 
      setStoryToDelete(null)
      fetchStory();
    } catch (error) {
      //informa del error y saca del estado al proyecto para evitar que se repita varias veces los cuadros de dialogo
      setMessage(`Error al Eliminar: ${error.message}`);
      setStoryToDelete(null)
      console.error("Error al hacer DELETE:", error);
    }
  };
  
  //Función manejadora sobre lo que sucede al clickear la parte de añadir proyecto 
  function handleAddStoryClick() {
    //aseguramos que los datos del form estén en blanco, que se marque que no se está editando y que nos muestre el formulario que queremos
    setFormData({ 
    points: 0,
    status: "todo",
    name: "",
    description: "",
    owner: "",
    members: [],
  });
    setEditingStory(null);
    setShowForm(true);
  }

  return (
    <div className="epics-section">
      <h3>Storys</h3>
      <Boton clase="add-epic-btn" onClick={handleAddStoryClick} contenido="Añadir Story"/>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editingStory ? "Editar Story" : "Nueva Story"}</h3>
            <input type="text" placeholder="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input type="text" placeholder="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
            <input type="text" placeholder="points" value={formData.points} onChange={(e) => setFormData({ ...formData, points: e.target.value })} />
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
              <button onClick={() => { setShowForm(false); setEditingStory(null); }}>Cancelar</button>
              <button onClick={() => handleAddOrEdit({ ...formData, id: editingStory?.id })}>{editingStory ? "Guardar" : "Añadir"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="epic-list">
        {story.map((story) => (
              <StoryCard story={story} 
                onDelete={() => setStoryToDelete(story)} 
                onEdit={() => { 
                  setEditingStory(story); 
                  setFormData({
                    name: story.name,
                    points: story.points,
                    status: story.status,
                    description: story.description,
                    owner: story.owner,
                    members: story.members
                  });
                  setShowForm(true);
              }}/> 
            ))}
      </div>

      {storyToDelete && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>¿Estás seguro de eliminar esta Story?</h3>
            <div className="modal-buttons">
              <button onClick={() => setStoryToDelete(null)}>Cancelar</button>
              <button onClick={() => handleDelete(storyToDelete.id)}>Eliminar</button>
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
