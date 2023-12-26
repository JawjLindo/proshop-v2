import { Navigate, Outlet } from 'react-router-dom';
import { useAuthValue } from '../contexts';

export const PrivateRoute = () => {
  const { userInfo } = useAuthValue();

  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};
