import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Esto seria el Home</div>,
  },
  {
    path: "/home",
    element: <div>Esto también debería ser el home</div>,
  },
  {
    path: "/iniciar-sesion",
    element: <div>Esto debería ser el login o iniciar sessión</div>,
  },
  {
    path: "/my-projects",
    element: <div>Esto debería de ser my projects</div>,
  },
  {
    path: "/my-stories",
    element: <div>Esto debería de ser my stories</div>,
  },
  {
    path: "/projects/:projectid",
    element: <div>Esto me tendría que mostrar 1 proyecto específico</div>,
  },
  {
    path: "/epics/:epicid",
    element: <div>Esto me tendría que mostrar 1 epica específica</div>,
  },
  {
    path: "/story/:storyid",
    element: <div>Esto me tendría que mostrar 1 story específica</div>,
  },
  {
    path: "/settings",
    element: <div>Esto me tendría que mostar la vista settings</div>,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
