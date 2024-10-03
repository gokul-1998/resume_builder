import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { user } = useSelector((state) => state.auth);
  console.log(user,"private route")
  return user ? <Outlet /> : <Navigate to='/sign-in' />;
}