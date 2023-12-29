import { AxiosResponse } from 'axios';
import { Types } from '../types';
import { createApiClient } from './apiClient';

const PRODUCTS_API_URL = '/products';
const UPLOAD_API_URL = '/upload';

type GetProductsType = {
  products: Types.Product[];
  page: number;
  pages: number;
};
const getProducts: (
  pageNumber: number,
  keyword?: string
) => Promise<GetProductsType> = async (pageNumber, keyword) => {
  const { data } = await createApiClient().get<GetProductsType>(
    PRODUCTS_API_URL,
    { params: { pageNumber, keyword } }
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

const deleteProduct: (id: string) => Promise<{ message: string }> = async (
  id
) => {
  const { data } = await createApiClient().delete<{ message: string }>(
    `${PRODUCTS_API_URL}/${id}`
  );
  return data;
};

const createReview: (
  productId: string,
  rating: number,
  comment: string
) => Promise<Types.Product> = async (productId, rating, comment) => {
  const { data } = await createApiClient().post<
    Types.Product,
    AxiosResponse<Types.Product, any>,
    { productId: string; rating: number; comment: string }
  >(`${PRODUCTS_API_URL}/${productId}/reviews`, { productId, rating, comment });
  return data;
};

const getTopProducts: () => Promise<Types.Product[]> = async () => {
  const { data } = await createApiClient().get<Types.Product[]>(
    `${PRODUCTS_API_URL}/top`
  );
  return data;
};

export const products = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  uploadProductImage,
  deleteProduct,
  createReview,
  getTopProducts,
};

export type { GetProductsType };
