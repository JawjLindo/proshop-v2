import express from 'express';
import { Controllers } from '../../controllers';
import { Middleware } from '../../middleware';

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} = Controllers.product;

export const productRouter = express.Router();

productRouter
  .route('/')
  .get(getProducts)
  .post(Middleware.protect, Middleware.admin, createProduct);
productRouter.route('/top').get(getTopProducts);
productRouter
  .route('/:id')
  .get(getProductById)
  .put(Middleware.protect, Middleware.admin, updateProduct)
  .delete(Middleware.protect, Middleware.admin, deleteProduct);
productRouter
  .route('/:id/reviews')
  .post(Middleware.protect, createProductReview);
