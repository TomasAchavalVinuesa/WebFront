import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; //Capaz luego eliminar
import "./Epics.css";


export default function Epics({ projectId }) {
  const [epics, setEpics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", icon: "" });
  const [editingEpic, setEditingEpic] = useState(null);
  //const [EpicToDelete, setEpicToDelete] = useState(null);
  //const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }  

    const fetchEpics = async () => {
      try {
        const res = await fetch(`http://localhost:5100/project/${projectId}/epics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setEpics(data);
        else console.error("Error al obtener épicas", data);
      } catch (err) {
        console.error("Error al conectar con el servidor", err);
      }
    };

    fetchEpics();
  }, [projectId]);

  const handleAddOrEdit = async () => {
    const { name, description, icon } = formData;
    if (!name || !description || !icon) return alert("Todos los campos son obligatorios");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5100/epic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, icon, project: projectId })
      });

      const data = await res.json();
      if (res.ok) {
        setEpics((prev) => [...prev, data]);
        setShowForm(false);
        setFormData({ name: "", description: "", icon: "" });
        setEditingEpic(null);
      } else {
        alert(data.error || "Error al crear épica");
      }
    } catch (err) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="epics-section">
      <h3>Épicas</h3>
      <button className="add-epic-btn" onClick={() => setShowForm(true)}>Añadir Épica</button>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editingEpic ? "Editar Épica" : "Nueva Épica"}</h3>
            <input type="text" placeholder="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input type="text" placeholder="Descripción" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <input type="text" placeholder="Icono" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} />
            <div className="modal-buttons">
              <button onClick={() => { setShowForm(false); setEditingEpic(null); }}>Cancelar</button>
              <button onClick={handleAddOrEdit}>{editingEpic ? "Guardar" : "Añadir"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="epic-list">
        {epics.map((epic) => (
          <div key={epic._id} className="epic-card" onClick={() => navigate(`/epics/${epic._id}`)} style={{ cursor: "pointer" }}>
            <p><strong>{epic.icon} {epic.name}</strong></p>
            <p>{epic.description}</p>
            <div className="epic-actions">
              <button onClick={() => {
                setEditingEpic(epic);
                setFormData({ name: epic.name, description: epic.description, icon: epic.icon });
                setShowForm(true);
              }}>Editar</button>
              <button onClick={() => setEpics(epics.filter((e) => e._id !== epic._id))}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
