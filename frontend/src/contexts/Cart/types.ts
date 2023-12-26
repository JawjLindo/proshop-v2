import { Types } from '../../types';

export type CartItem = Types.Product & { qty: number };

export type ShippingAddress = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export type CartState = {
  cartItems: CartItem[];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  shippingAddress?: ShippingAddress | null;
  paymentMethod: string;
};
