import axios, { AxiosInstance } from 'axios';
import { constants } from '../utils';

export const createApiClient = (): AxiosInstance => {
  return axios.create({
    baseURL: constants.BASE_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });
};
