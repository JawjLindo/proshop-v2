import { productController } from './product.controller';
import { userController } from './user.controller';
import { orderController } from './order.controller';

export namespace Controllers {
  export const product = productController;
  export const user = userController;
  export const order = orderController;
}
