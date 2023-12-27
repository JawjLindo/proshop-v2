import { createBrowserRouter } from 'react-router-dom';
import { Components } from './components';
import { Pages } from './Pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Components.Layout />,
    children: [
      { path: '', element: <Pages.Home /> },
      { path: 'product/:id', element: <Pages.Product /> },
      { path: 'cart', element: <Pages.Cart /> },
      { path: 'login', element: <Pages.Login /> },
      { path: 'register', element: <Pages.Register /> },
    ],
  },
  {
    path: '/shipping',
    element: <Components.Layout isSecure />,
    children: [{ path: '', element: <Pages.Shipping /> }],
  },
  {
    path: '/payment',
    element: <Components.Layout isSecure />,
    children: [{ path: '', element: <Pages.Payment /> }],
  },
  {
    path: '/placeorder',
    element: <Components.Layout isSecure />,
    children: [{ path: '', element: <Pages.PlaceOrder /> }],
  },
  {
    path: '/order/:id',
    element: <Components.Layout isSecure />,
    children: [{ path: '', element: <Pages.Order /> }],
  },
  {
    path: '/profile',
    element: <Components.Layout isSecure />,
    children: [{ path: '', element: <Pages.Profile /> }],
  },
  {
    path: '/admin/orderlist',
    element: <Components.Layout isSecure isAdmin />,
    children: [{ path: '', element: <Pages.OrderList /> }],
  },
  {
    path: '/admin/productlist',
    element: <Components.Layout isSecure isAdmin />,
    children: [{ path: '', element: <Pages.ProductList /> }],
  },
  {
    path: '/admin/product/:id/edit',
    element: <Components.Layout isSecure isAdmin />,
    children: [{ path: '', element: <Pages.ProductEdit /> }],
  },
]);
