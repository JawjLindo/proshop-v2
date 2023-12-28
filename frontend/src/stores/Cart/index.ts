import { create } from 'zustand';
import { CartItem, CartState, ShippingAddress } from './types';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { updateCart } from './utilities';
export type { CartItem } from './types';

type CartActions = {
  addItem: (cartItem: CartItem) => void;
  removeItem: (id: string) => void;
  updateShippingAddress: (address: ShippingAddress) => void;
  updatePaymentMethod: (paymentMethod: string) => void;
  clearItems: () => void;
};

type Cart = CartState & CartActions;

export const useCart = create<Cart>()(
  devtools(
    persist(
      immer((set) => ({
        cartItems: [],
        itemsPrice: 0,
        paymentMethod: 'PayPal',
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,

        addItem: (cartItem) => {
          set(
            (state) => {
              const existItemIndex = state.cartItems.findIndex(
                (x) => x._id === cartItem._id
              );

              if (existItemIndex < 0) {
                state.cartItems.push(cartItem);
              } else {
                state.cartItems[existItemIndex] = cartItem;
              }

              updateCart(state);
            },
            false,
            'addItem'
          );
        },
        removeItem: (id) => {
          set(
            (state) => {
              state.cartItems = state.cartItems.filter((x) => x._id !== id);

              updateCart(state);
            },
            false,
            'removeItem'
          );
        },
        updateShippingAddress: (address) => {
          set(
            (state) => {
              state.shippingAddress = address;
              updateCart(state);
            },
            false,
            'updateShippingAddress'
          );
        },
        updatePaymentMethod: (paymentMethod) => {
          set(
            (state) => {
              state.paymentMethod = paymentMethod;
              updateCart(state);
            },
            false,
            'updatePaymentMethod'
          );
        },
        clearItems: () => {
          set(
            (state) => {
              state.cartItems = [];
              updateCart(state);
            },
            false,
            'clearItems'
          );
        },
      })),
      {
        name: 'Cart',
      }
    ),

    {
      name: 'ProShop',
      store: 'Cart',
    }
  )
);
