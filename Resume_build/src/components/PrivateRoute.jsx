import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
}