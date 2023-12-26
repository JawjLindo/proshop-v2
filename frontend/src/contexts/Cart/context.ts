import React, {
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  createContext,
  useReducer,
} from 'react';
import { CartItem, CartState, ShippingAddress } from './types';
import { updateCart } from './utilities';
import { produce } from 'immer';

type CartAction =
  | {
      type: 'cart/addItem';
      payload: CartItem;
    }
  | {
      type: 'cart/removeItem';
      payload: string;
    }
  | {
      type: 'cart/updateShippingAddress';
      payload: ShippingAddress;
    }
  | {
      type: 'cart/updatePaymentMethod';
      payload: string;
    }
  | {
      type: 'cart/clearItems';
    };

const reducer: (state: CartState, action: CartAction) => CartState = (
  state,
  action
) => {
  switch (action.type) {
    case 'cart/addItem':
      return produce(state, (draft) => {
        const existItemIndex = draft.cartItems.findIndex(
          (x) => x._id === action.payload._id
        );

        if (existItemIndex < 0) {
          draft.cartItems.push(action.payload);
        } else {
          draft.cartItems[existItemIndex] = action.payload;
        }

        updateCart(draft);
      });
    case 'cart/removeItem':
      return produce(state, (draft) => {
        draft.cartItems = draft.cartItems.filter(
          (x) => x._id !== action.payload
        );

        updateCart(draft);
      });
    case 'cart/updateShippingAddress':
      return produce(state, (draft) => {
        draft.shippingAddress = action.payload;
        updateCart(draft);
      });
    case 'cart/updatePaymentMethod':
      return produce(state, (draft) => {
        draft.paymentMethod = action.payload;
        updateCart(draft);
      });
    case 'cart/clearItems':
      return produce(state, (draft) => {
        draft.cartItems = [];
        updateCart(draft);
      });
    default:
      throw new Error('Invalid action');
  }
};

type CartValue = CartState;
type CartDispatch = Dispatch<CartAction>;

export const CartValue = createContext<CartValue | null>(null);
export const CartDispatch = createContext<CartDispatch | null>(null);

const initialState: CartState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart')!)
  : { cartItems: [], paymentMethod: 'PayPal', shippingAddress: {} };

export const CartProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const valueProvider = React.createElement(CartValue.Provider, {
    value: state,
    children,
  });
  const dispatchProvider = React.createElement(CartDispatch.Provider, {
    value: dispatch,
    children: valueProvider,
  });

  return dispatchProvider;
};
