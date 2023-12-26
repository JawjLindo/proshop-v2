import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ContextProviders } from './contexts';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PayPalScriptProvider options={{ clientId: '' }} deferLoading>
        <ContextProviders.Auth>
          <ContextProviders.Cart>
            <RouterProvider router={router} />
            <ReactQueryDevtools />
          </ContextProviders.Cart>
        </ContextProviders.Auth>
      </PayPalScriptProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
