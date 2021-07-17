import { Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
       { path: 'dashboard', element: <Dashboard /> },
       { path: 'dogs', element: <Dashboard  /> },
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '/', element: <Navigate to="/login" /> },
      // { path: 'register', element: <Register /> },
      // { path: '404', element: <NotFound /> },       
      // { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
