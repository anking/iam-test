import { Outlet } from 'react-router-dom';
import Cognito from 'authentication/cognito';
import { Navigate } from 'react-router-dom';

const DashboardLayout = () => Cognito.getUser() ? <Outlet/> : <Navigate to="/login" />

export default DashboardLayout;
