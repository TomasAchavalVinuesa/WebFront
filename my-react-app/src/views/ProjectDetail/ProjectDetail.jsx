import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Epics from "../Epics/Epics";
import "./ProjectDetail.css";
import HeaderVolver from "../../components/HeaderVolver/HeaderVolver";
import Loading from "../Loading/Loading";
import ProjectD from "../../components/ProjectD/ProjectD";

export default function ProjectDetail() {
  const { projectid } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [projectid]);

  const fetchProject = async () => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }
    try {
      const res = await fetch(`http://localhost:5100/project/${projectid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (await handleUnauthorized(res)) return;
      const data = await res.json();
      if (res.ok) {
        const memberNames = await fetchUserNames(data.members, token);
        const proyectoFormateado = {
          id: data._id,
          name: data.name,
          description: data.description,
          icon: data.icon,
          members: data.members,
          memberNames: memberNames.join(", "),
        };
        setProject(proyectoFormateado);
      } else {
        alert(data.error || "No se pudo cargar el proyecto");
      }
    } catch (err) {
      alert("Error de red");
    }finally{
      setLoading(false);
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
  const handleUnauthorized = async (response) => {
    if (response.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return true;
    }
    return false;
  };

  return (
    <>
      {loading? (
        <Loading contenido="Proyecto"/>
      ): (
        <div className="project-detail-container">
          <HeaderVolver contenido={`Proyect: ${project.name}`} />
          <ProjectD name={project.name} description={project.description} memberNames={project.memberNames} icon={project.icon}/>
          <Epics projectId={projectid} />
        </div>
      )}
    </>
  );
}
