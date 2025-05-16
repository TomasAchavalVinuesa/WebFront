import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Tasks.css";
import Loading from "../Loading/Loading";
import TaskCard from "../../components/TaskCard/TaskCard.jsx";
import ContenidoVacio from "../ContenidoVacio/ContenidoVacio.jsx"


export default function Tasks({ storyId }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "", dueDate: "", done: false });
    const [editingTask, setEditingTask] = useState(null);
    const [TaskToDelete, setTaskToDelete] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const token = localStorage.getItem("token");
        if (!token){
            navigate("/login");
            return
        }  
        try {
            const res = await fetch(`http://localhost:5100/story/${storyId}/tasks`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (await handleUnauthorized(res)) return;
            const data = await res.json();
            if (res.ok) setTasks(data);
            else console.error("Error al obtener las tareas", data);
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

    const addTask = async (task) => {
        const token = localStorage.getItem("token");
        if (!token){
            navigate("/login");
            return
        }  
        try {
            const response = await fetch(`http://localhost:5100/task`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: task.name,
                    dueDate: task.dueDate,
                    description: task.description,
                    done: false,
                    story: storyId
                })
            });
            const result = await response.json();
            if (await handleUnauthorized(response)) return;
            if (!response.ok) {
                throw new Error(result.error || "Error desconocido al añadir la tarea");
            }
            setMessage("Tarea añadida exitosamente.");
        } catch (error) {
            setMessage(`Error al añadir la tarea: ${error.message}`);
            console.error("Error al hacer POST:", error);
        }
        };

    const toggleTaskDone = async (task, isDone) => {
        const token = localStorage.getItem("token");
        if (!token){
            navigate("/login");
            return
        }

        try {
            const response = await fetch(`http://localhost:5100/task/${task._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: task.name,
                    dueDate: task.dueDate,
                    description: task.description,
                    story: storyId,
                    done: isDone
                })
            });

            const result = await response.json();
            if (await handleUnauthorized(response)) return;
            if (!response.ok) {
                throw new Error(result.error || "Error desconocido al actualizar el estado de la tarea");
            }

            // Actualizar el estado local
            setTasks(prevTasks =>
                prevTasks.map(t =>
                    t._id === task._id ? { ...t, done: isDone } : t
                )
            );
        } catch (error) {
            console.error("Error al cambiar estado done:", error);
            setMessage(`Error al cambiar estado done: ${error.message}`);
        }
    };

    const updateTask = async (task) => {
        const token = localStorage.getItem("token");
        if (!token){
            navigate("/login");
            return
        }  
        console.log(`${task._id}`)
        try {
            const response = await fetch(`http://localhost:5100/task/${task._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: task.name,
                    dueDate: task.dueDate,
                    description: task.description,
                    story: storyId
                })
            });
            const result = await response.json();
            if (await handleUnauthorized(response)) return;
            if (!response.ok) {
                throw new Error(result.error || `Error desconocido al actualizar la Tarea y el id es ${task._id}`);
            }
            setMessage("Tarea actualizada exitosamente.");
        } catch (error) {
            setMessage(`Error al actualizar: ${error.message}`);
            console.error("Error al hacer PUT:", error);
        }
    };

    const handleAddOrEdit = async(task) => {
        const token = localStorage.getItem("token");
        if (!token){
            navigate("/login");
            return
        }  
        const { name, dueDate, description} = task;
        if (!name || !dueDate || !description ){
            setMessage("No pueden haber campos vacíos");
            return;
        }
        const formattedTask = {
            ...task,
            dueDate: new Date(task.dueDate).toISOString(),
            _id: editingTask ? editingTask._id : Date.now(),
        };
        if (editingTask) {
            await updateTask(formattedTask);
            await fetchTasks();
        } else {
            await addTask(formattedTask);
            await fetchTasks();
        }
        setShowForm(false);
        setEditingTask(null);
        setFormData({ name: "", dueDate: "", description: "", done: false});
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!token){
            navigate("/login");
            return
        }
        try {    
            const response = await fetch(`http://localhost:5100/task/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (await handleUnauthorized(response)) return;
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Error desconocido al eliminar la tarea");
            }
            setMessage("Tarea Eliminada exitosamente.");
            setTaskToDelete(null)
            fetchTasks();
        } catch (error) {
            setMessage(`Error al Eliminar: ${error.message}`);
            setTaskToDelete(null)
            console.error("Error al hacer DELETE:", error);
        }
    };


    function handleAddTaskClick() {
        setFormData({ name: "", description: "", dueDate: "", done: false });
        setEditingTask(null);
        setShowForm(true);
    }

    return (
        <>
            {loading ? (
                <Loading contenido="Tasks"/>
            ) : tasks.length === 0 ? (
                <ContenidoVacio onClick={handleAddTaskClick} contenidoB="Añadir Tarea" contenidoP="Tareas" />
            ) : (
                <div>
                    <div className="task-section">
                        <h2>Tareas</h2>
                        <button className="add-task-btn" onClick={() => setShowForm(true)}>Añadir Tarea</button>
                            {tasks.length === 0 ? (
                                <p>No hay tareas aún.</p>
                            ) : (
                                tasks.map((task) => (
                                <TaskCard task={task} 
                                onDelete={() => setTaskToDelete(task)} 
                                onEdit={() => { 
                                    setEditingTask(task); 
                                    setFormData({
                                        name: task.name,
                                        description: task.description,
                                        dueDate:  task.dueDate.slice(0, 10),
                                    });
                                    setShowForm(true);
                                    }}
                                onToggleDone={toggleTaskDone}
                                /> 
                                ))
                            )}
                    </div>
                    
                    

                    {TaskToDelete && (
                        <div className="modal-backdrop">
                            <div className="modal">
                                <h3>¿Estás seguro de eliminar esta Tarea?</h3>
                                <div className="modal-buttons">
                                    <button onClick={() => setTaskToDelete(null)}>Cancelar</button>
                                    <button onClick={() => handleDelete(TaskToDelete._id)}>Eliminar</button>
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
            {showForm && (
                        <div className="modal-backdrop">
                            <div className="modal">
                                <h3>{editingTask ? "Editar Tarea" : "Nueva Tarea"}</h3>
                                <input type="text" placeholder="Nombre" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                <input type="date" placeholder="Fecha límite" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} />
                                <input type="text" placeholder="Descripción" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                <div className="modal-buttons">
                                    <button onClick={() => { setShowForm(false); setEditingTask(null); }}>Cancelar</button>
                                    <button onClick={() => handleAddOrEdit(formData)}>{editingTask ? "Guardar" : "Añadir"}</button>
                                </div>
                            </div>
                        </div>
                    )}
        </>
    );
}






