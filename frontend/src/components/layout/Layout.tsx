import { Outlet, useNavigate } from 'react-router-dom';
import { Body } from './Body';
import { Footer } from './Footer';
import { Header } from './Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css';
import { FunctionComponent, useEffect } from 'react';
import { useAuthValue } from '../../contexts';

type LayoutProps = {
  isSecure?: boolean;
  isAdmin?: boolean;
};

export const Layout: FunctionComponent<LayoutProps> = ({
  isSecure = false,
  isAdmin = false,
}) => {
  const { userInfo } = useAuthValue();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSecure && !userInfo) navigate('/login', { replace: true });
    if (isAdmin && !userInfo?.isAdmin) navigate('/login', { replace: true });
  }, [userInfo, isSecure, navigate]);

  return (
    <>
      <Header />
      <Body>
        <Outlet />
      </Body>
      <Footer />
      <ToastContainer />
    </>
  );
};
