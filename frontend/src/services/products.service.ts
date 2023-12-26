import { Types } from '../types';
import { createApiClient } from './apiClient';

const PRODUCTS_API_URL = '/products';

const getProducts: () => Promise<Types.Product[]> = async () => {
  const { data } = await createApiClient().get<Types.Product[]>(
    PRODUCTS_API_URL
  );
  return data;
};

const getProductById: (id: string) => Promise<Types.Product> = async (id) => {
  const { data } = await createApiClient().get<Types.Product>(
    `${PRODUCTS_API_URL}/${id}`
  );
  return data;
};

const createProduct: () => Promise<Types.Product> = async () => {
  const { data } = await createApiClient().post<Types.Product>(
    PRODUCTS_API_URL
  );
  return data;
};

export const products = {
  getProducts,
  getProductById,
  createProduct,
};
