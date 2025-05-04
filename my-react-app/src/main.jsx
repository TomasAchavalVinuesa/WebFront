import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import App from './App.jsx';
import Home from './views/Home/Home.jsx';
import Login from './views/Login/Login.jsx';
import Register from './views/Register/Register.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/home', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/my-projects', element: <div>Esto debería de ser my projects</div> },
      { path: '/my-stories', element: <div>Esto debería de ser my stories</div> },
      { path: '/projects/:projectid', element: <div>Esto me tendría que mostrar 1 proyecto específico</div> },
      { path: '/epics/:epicid', element: <div>Esto me tendría que mostrar 1 épica específica</div> },
      { path: '/story/:storyid', element: <div>Esto me tendría que mostrar 1 story específica</div> },
      { path: '/settings', element: <div>Esto me tendría que mostrar la vista settings</div> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
