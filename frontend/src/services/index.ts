import { products, GetProductsType } from './products.service';
import { users } from './users.service';
import { orders } from './orders.service';

export const services = {
  products,
  users,
  orders,
};

export type { GetProductsType };
