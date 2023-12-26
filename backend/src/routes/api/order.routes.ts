import express from 'express';
import { Controllers } from '../../controllers';
import { Middleware } from '../../middleware';

const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} = Controllers.order;

export const orderRouter = express.Router();

orderRouter
  .route('/')
  .post(Middleware.protect, addOrderItems)
  .get(Middleware.protect, Middleware.admin, getOrders);
orderRouter.route('/mine').get(Middleware.protect, getMyOrders);
orderRouter.route('/:id').get(Middleware.protect, getOrderById);
orderRouter.route('/:id/pay').put(Middleware.protect, updateOrderToPaid);
orderRouter
  .route('/:id/deliver')
  .put(Middleware.protect, Middleware.admin, updateOrderToDelivered);
