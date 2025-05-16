import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; //Capaz luego eliminar
import "./Epics.css";
import Loading from "../Loading/Loading";
import Boton from "../../components/Boton/Boton";
import TitulosH3 from "../../components/TitulosH3/TitulosH3";
import EpicCard from "../../components/EpicCard/EpicCard";

export default function Epics({ projectId }) {
  const [epics, setEpics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", icon: "" });
  const [editingEpic, setEditingEpic] = useState(null);
  const [EpicToDelete, setEpicToDelete] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEpics();
  }, []);

  const fetchEpics = async () => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  
    try {
      const res = await fetch(`http://localhost:5100/project/${projectId}/epics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (await handleUnauthorized(res)) return;
      const data = await res.json();
      if (res.ok) setEpics(data);
      else console.error("Error al obtener épicas", data);
    } catch (err) {
      console.error("Error al conectar con el servidor", err);
    }finally {
      setLoading(false);
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

  const addEpic = async (epic) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  
    try {
      const response = await fetch(`http://localhost:5100/epic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: epic.name,
          icon: epic.icon,
          description: epic.description,
          project: projectId
        })
      });

      const result = await response.json();
      if (await handleUnauthorized(response)) return;
      if (!response.ok) {
        throw new Error(result.error || "Error desconocido al añadir La epica");
      }
      setMessage("Epica añadida exitosamente.");
    } catch (error) {
      setMessage(`Error al añadir la epica: ${error.message}`);
      console.error("Error al hacer POST:", error);
    }
  };

  const updateEpic = async (epic) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  
    try {
      const response = await fetch(`http://localhost:5100/epic/${epic._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: epic.name,
          icon: epic.icon,
          description: epic.description,
          project: projectId
        })
      });
      const result = await response.json();
      if (await handleUnauthorized(response)) return;
      if (!response.ok) {
        throw new Error(result.error || `Error desconocido al actualizar la epic y el id es ${epic._id}`);
      }

      setMessage("Epic actualizada exitosamente.");
    } catch (error) {
      setMessage(`Error al actualizar: ${error.message}`);
      console.error("Error al hacer PUT:", error);
    }
  };

const handleAddOrEdit = async(epic) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  
    const { name, icon, description} = epic;
    if (!name || !icon || !description ){
      setMessage("No pueden haber campos vacíos");
      return;
    }

    const formattedEpic = {
      ...epic,
      _id: editingEpic ? editingEpic._id : Date.now(),
    };

    if (editingEpic) {
      await updateEpic(formattedEpic);
      await fetchEpics();
    } else {
      await addEpic(formattedEpic);
      await fetchEpics();
    }
    
    setShowForm(false);
    setEditingEpic(null);
    setFormData({ name: "", icon: "", description: ""});
  };

const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }
    try {
      const res = await fetch(`http://localhost:5100/epic/${id}/stories`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (await handleUnauthorized(res)) return;
      if (!res.ok) {
        throw new Error("Error en la Comprobación de stories pendientes dentro de la epica a eliminar");
      }
      const stories = await res.json();
      if (stories.length !== 0) {
        setMessage(`No puedes eliminar una epica que tiene Stories pendientes`);
        setEpicToDelete(null)
        return;
      }      
      const response = await fetch(`http://localhost:5100/epic/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (await handleUnauthorized(response)) return;
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Error desconocido al eliminar la épica");
      }
      setMessage("Epica Eliminada exitosamente.");
      //estas 2 ultimas invocaciones de funciones son para evitar errores como que se repita el mensaje de "seguro quiere eliminar esto" y la otra invocacion es para reflejar los cambios en la BD 
      setEpicToDelete(null)
      fetchEpics();
    } catch (error) {
    
      setMessage(`Error al Eliminar: ${error.message}`);
      setEpicToDelete(null)
      console.error("Error al hacer DELETE:", error);
    }
  };
  

  function handleAddEpicClick() {
    setFormData({ name: "", icon: "", description: ""});
    setEditingEpic(null);
    setShowForm(true);
  }




  return (
    <>  
      {loading ? (
        <Loading contenido="Epicas"/>
      ) : epics.length === 0 ? (
        <ContenidoVacio onClick={handleAddEpicClick} contenidoB="Añadir Épica" contenidoP="Epicas" />
      ) : (
        <div className="epics-section">
          <TitulosH3 contenido="Épicas"></TitulosH3>
          <Boton clase="add-epic-btn" onClick={handleAddEpicClick} contenido="Añadir Épica"/>

          <div className="project-list"> 
            {epics.map((epic) => (
              <EpicCard epic={epic} 
                onDelete={() => setEpicToDelete(epic)} 
                onEdit={() => { 
                  setEditingEpic(epic); 
                  setFormData({
                    name: epic.name,
                    icon: epic.icon,
                    description: epic.description,
                  });
                  setShowForm(true);
                  
              }}/> 
            ))}
          </div>


          {showForm && (
            <div className="modal-backdrop">
              <div className="modal">
                <h3>{editingEpic ? "Editar Épica" : "Nueva Épica"}</h3>
                <input type="text" placeholder="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input type="text" placeholder="Descripción" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                <input type="text" placeholder="Icono" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} />
                <div className="modal-buttons">
                  <button onClick={() => { setShowForm(false); setEditingEpic(null); }}>Cancelar</button>
                  <button onClick={() => handleAddOrEdit(formData)}>{editingEpic ? "Guardar" : "Añadir"}</button>
                </div>
              </div>
            </div>
          )}

        {EpicToDelete && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>¿Estás seguro de eliminar esta épica?</h3>
            <div className="modal-buttons">
              <button onClick={() => setEpicToDelete(null)}>Cancelar</button>
              <button onClick={() => handleDelete(EpicToDelete._id)}>Eliminar</button>
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
      )}
    </>
  );
}
