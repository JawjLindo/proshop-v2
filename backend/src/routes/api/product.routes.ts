import express from 'express';
import { Controllers } from '../../controllers';
import { Middleware } from '../../middleware';

const { getProducts, getProductById, createProduct } = Controllers.product;

export const productRouter = express.Router();

productRouter
  .route('/')
  .get(getProducts)
  .post(Middleware.protect, Middleware.admin, createProduct);
productRouter.route('/:id').get(getProductById);
