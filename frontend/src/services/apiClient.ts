import axios, { AxiosInstance } from 'axios';
import { BASE_API_URL } from './constants';

export const createApiClient = (): AxiosInstance => {
  return axios.create({
    baseURL: BASE_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    // proxy: {
    //   protocol: 'http',
    //   host: '127.0.0.1',
    //   port: 5000,
    // },
  });
};
