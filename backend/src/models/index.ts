import * as UserModel from './user.model';
import * as ProductModel from './product.model';
import * as OrderModel from './order.model';

export namespace Models {
  export type IUser = UserModel.IUser;
  export const User = UserModel.User;

  export type IProduct = ProductModel.IProduct;
  export const Product = ProductModel.Product;

  export type IOrder = OrderModel.IOrder;
  export const Order = OrderModel.Order;
}
