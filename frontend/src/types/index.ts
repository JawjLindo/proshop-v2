import type { ProductType } from './ProductType';
import type { UserType } from './UserType';
import type { OrderType, OrderItemType } from './OrderType';

export namespace Types {
  export type Product = ProductType;
  export type User = UserType;
  export type Order = OrderType;
  export type OrderItem = OrderItemType;
}
