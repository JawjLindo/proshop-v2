import { CartState } from './types';
import { Draft } from 'immer';

export const updateCart: (draft: Draft<CartState>) => void = (draft) => {
  draft.itemsPrice = draft.cartItems.reduce((acc, item) => {
    const priceForItem = item.price * item.qty;
    return acc + priceForItem;
  }, 0);
  draft.shippingPrice = draft.itemsPrice > 100 ? 0 : 10;
  draft.taxPrice = draft.itemsPrice * 0.15;
  draft.totalPrice = draft.itemsPrice + draft.shippingPrice + draft.taxPrice;

  // localStorage.setItem('cart', JSON.stringify(draft));
};
