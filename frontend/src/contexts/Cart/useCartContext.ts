import { useContext } from 'react';
import { CartDispatch, CartValue } from './context';

export const useCartValue = () => {
  const value = useContext(CartValue);
  if (value == null) throw new Error('Must be used within a Context Provider');
  return value;
};

export const useCartDispatch = () => {
  const value = useContext(CartDispatch);
  if (value == null) throw new Error('Must be used within a Context Provider');
  return value;
};
