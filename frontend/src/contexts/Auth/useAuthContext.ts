import { useContext } from 'react';
import { AuthDispatch, AuthValue } from './context';

export const useAuthValue = () => {
  const value = useContext(AuthValue);
  if (value == null) throw new Error('Must be used within a Context Provider');
  return value;
};

export const useAuthDispatch = () => {
  const value = useContext(AuthDispatch);
  if (value == null) throw new Error('Must be used within a Context Provider');
  return value;
};
