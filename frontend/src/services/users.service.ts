import { AxiosResponse } from 'axios';
import { Types } from '../types';
import { createApiClient } from './apiClient';

const USERS_API_URL = '/users';

type LoginRequest = { email: string; password: string };
const login: (email: string, password: string) => Promise<Types.User> = async (
  email,
  password
) => {
  const { data } = await createApiClient().post<
    Types.User,
    AxiosResponse<Types.User, any>,
    LoginRequest
  >(`${USERS_API_URL}/auth`, { email, password });
  return {
    _id: data._id,
    name: data.name,
    email: data.email,
    isAdmin: data.isAdmin,
  };
};

const logout: () => Promise<void> = async () => {
  await createApiClient().post(`${USERS_API_URL}/logout`);
};

const register: (
  name: string,
  email: string,
  password: string
) => Promise<Types.User> = async (name, email, password) => {
  const { data } = await createApiClient().post<Types.User>(USERS_API_URL, {
    name,
    email,
    password,
  });

  return {
    _id: data._id,
    name: data.name,
    email: data.email,
    isAdmin: data.isAdmin,
  };
};

type UpdateProfileRequest = {
  _id: string;
  name: string;
  email: string;
  password: string;
};
const updateProfile: (
  _id: string,
  name: string,
  email: string,
  password: string
) => Promise<Types.User> = async (_id, name, email, password) => {
  const { data } = await createApiClient().put<
    Types.User,
    AxiosResponse<Types.User, any>,
    UpdateProfileRequest
  >(`${USERS_API_URL}/profile`, { _id, name, email, password });

  return {
    _id: data._id,
    name: data.name,
    email: data.email,
    isAdmin: data.isAdmin,
  };
};

export const users = {
  login,
  logout,
  register,
  updateProfile,
};
