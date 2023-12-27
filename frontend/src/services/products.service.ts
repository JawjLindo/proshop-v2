import { AxiosResponse } from 'axios';
import { Types } from '../types';
import { createApiClient } from './apiClient';

const PRODUCTS_API_URL = '/products';
const UPLOAD_API_URL = '/upload';

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

const updateProduct: (
  product: Types.Product
) => Promise<Types.Product> = async (product) => {
  const { data } = await createApiClient().put<
    Types.Product,
    AxiosResponse<Types.Product, any>,
    Types.Product
  >(`${PRODUCTS_API_URL}/${product._id}`, product);
  return data;
};

const uploadProductImage: (
  file: File
) => Promise<{ message: string; image: string }> = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await createApiClient().post<
    { message: string; image: string },
    AxiosResponse<{ message: string; image: string }, any>,
    FormData
  >(UPLOAD_API_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const products = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  uploadProductImage,
};
