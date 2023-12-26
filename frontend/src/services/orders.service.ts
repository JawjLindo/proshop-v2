import { Types } from '../types';
import { createApiClient } from './apiClient';

const ORDERS_API_URL = '/orders';
const PAYPAL_CLIENT_ID_URL = '/config/paypal';

const createOrder: (order: Types.Order) => Promise<Types.Order> = async (
  order
) => {
  const { data } = await createApiClient().post<Types.Order>(ORDERS_API_URL, {
    ...order,
  });
  return data;
};

const getOrderDetails: (orderId: string) => Promise<Types.Order> = async (
  orderId
) => {
  const { data } = await createApiClient().get<Types.Order>(
    `${ORDERS_API_URL}/${orderId}`
  );
  return data;
};

const getPaypalClientId: () => Promise<string> = async () => {
  const { data } = await createApiClient().get<{ clientId: string }>(
    PAYPAL_CLIENT_ID_URL
  );
  return data.clientId;
};

const payOrder: (orderId: string, details: any) => Promise<void> = async (
  orderId,
  details
) => {
  await createApiClient().put<void>(`${ORDERS_API_URL}/${orderId}/pay`, {
    ...details,
  });
};

const getMyOrders: () => Promise<Types.Order[]> = async () => {
  const { data } = await createApiClient().get<Types.Order[]>(
    `${ORDERS_API_URL}/mine`
  );
  return data;
};

const getOrders: () => Promise<Types.Order[]> = async () => {
  const { data } = await createApiClient().get<Types.Order[]>(ORDERS_API_URL);
  return data;
};

const deliverOrder: (orderId: string) => Promise<void> = async (orderId) => {
  await createApiClient().put<void>(`${ORDERS_API_URL}/${orderId}/deliver`);
};

export const orders = {
  createOrder,
  getOrderDetails,
  getPaypalClientId,
  payOrder,
  getMyOrders,
  getOrders,
  deliverOrder,
};
