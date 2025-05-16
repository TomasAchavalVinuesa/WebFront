import Boton from "../Boton/Boton";
import Parrafo from "../Parrafo/Parrafo";
import "./TaskCard.css"

function TaskCard({ task, onEdit, onDelete, onToggleDone }){

    const handleEditClick = (e) => {
        e.stopPropagation();
        onEdit(task);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(task);
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        onToggleDone(task, e.target.checked);
    };

    return(
        <div key={task._id} className="task-card">
            <div className="project-header">
                <input type="checkbox" checked={task.done} onChange={handleCheckboxChange}/>
                <Parrafo contenido={<><strong className={task.done ? "task-done" : ""}>{task.name}</strong></>} />
            </div>
                <Parrafo contenido={<><strong>Descripción: </strong> {task.description}</>} />
                <Parrafo contenido={<><strong>Fecha límite: </strong> {task.dueDate.slice(0, 10)}</>} />
            <div className="task-actions">
                <Boton onClick={handleEditClick} contenido="Editar"/>
                <Boton onClick={handleDeleteClick} contenido="Eliminar"/>
            </div>
        </div>
    );
}

export default TaskCard;
