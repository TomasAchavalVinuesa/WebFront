import { useEffect, useState } from "react";
import "./MyStories.css";
import { useNavigate } from "react-router-dom";
import HeaderLogueado from "../../components/HeaderLogueado/HeaderLogueado";
import MyStoryCard from "../../components/MyStoryCard/MyStoryCard";

export default function MyStories() {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetchStories();
  }, []);


  const fetchStories = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch("http://localhost:5100/story/my-stories", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
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
          setStories(storiesFormateadas);
        } else {
          alert(`Error al obtener las stories: ${data.error || "Error desconocido"}`);
        }
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
        alert("Ocurrió un error al conectarse con el servidor.");
      } finally {
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
    <div className="my-projects-container">
      <HeaderLogueado contenido="📂 My Stories"/>

      {loading ? (
        <div className="project-loader">
          <h2>Cargando Stories</h2>
          <img
            src="src/assets/images/RelojArena.png"
            alt="Cargando..."
            className="loader-image"
          />
          <p>Esto puede tomar un momento</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="empty-projects">
          <p className="empty-message">No tienes stories pendientes</p>
          <span role="img" aria-label="triste" className="empty-emoji">😟</span>
        </div>
      ) : (
        <>
          <div className="project-list">
            {stories.map((story) => (
              <MyStoryCard story={story}/>
            ))}
          </div>
        </>
      )}

      
    </div>
  );
}
