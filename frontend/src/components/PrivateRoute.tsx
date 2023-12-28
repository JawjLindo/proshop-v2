import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../stores';

export const PrivateRoute = () => {
  const userInfo = useAuth((state) => state.userInfo);

  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};
