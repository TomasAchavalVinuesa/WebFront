// src/views/StoryDetail/StoryDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderVolver from "../../components/HeaderVolver/HeaderVolver";
import "./StoryDetail.css";
import StoryD from "../../components/StoryD/StoryD";
import Loading from "../Loading/Loading";
import Tasks from "../Tasks/Tasks";

export default function StoryDetail() {
  const { storyid } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStory() 
  }, [storyid]);

  const fetchStory = async () => {
    const token = localStorage.getItem("token");
    if (!token){
      navigate("/login");
      return
    }
    try {
      const res = await fetch(`http://localhost:5100/story/${storyid}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (await handleUnauthorized(res)) return;
      const data = await res.json();
      if (res.ok) {
        const memberNames = await fetchUserNames(data.assignedTo, token);
        const ownerName = await fetchUserNames([data.owner], token);
        const storyFormateado = {
          name: data.name,
          points: data.points,
          status: data.status,
          description: data.description,
          owner: data.owner,
          assignedTo: data.assignedTo,
          ownerName: ownerName,
          memberNames: memberNames.join(", "),
        };
        setStory(storyFormateado);
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
        <Loading contenido="Story"/>
      ): (
    <div className="project-detail-container">
      <HeaderVolver contenido={`Story: ${story.name}`} />
      <StoryD name={story.name} description={story.description} memberNames={story.memberNames} ownerName={story.ownerName} points={story.points}/>
      <Tasks storyId={storyid}/>
    </div>
    )}
    </>
  );
}