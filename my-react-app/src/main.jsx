import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';


import Home from './views/Home/Home.jsx';
import Login from './views/Login/Login.jsx';
import Register from './views/Register/Register.jsx';
import Settings from './views/Setting/Settings.jsx';
import MyProjects from './views/MyProjects/MyProjects.jsx';
import ProjectDetail from './views/ProjectDetail/ProjectDetail.jsx';
import MyStories from './views/MyStories/MyStories.jsx';
import EpicDetail from './views/EpicDetail/EpicDetail.jsx';
import StoryDetail from './views/StoryDetail/StoryDetail.jsx';

const router = createBrowserRouter([
      { path: '/', element: <Home /> },
      { path: '/home', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/my-projects', element: <MyProjects/> },
      { path: '/my-stories', element: <MyStories/> },
      { path: '/projects/:projectid', element: <ProjectDetail /> },
      { path: '/epics/:epicid', element: <EpicDetail /> },
      { path: '/story/:storyid', element: <StoryDetail /> },
      { path: '/settings', element: <Settings /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
