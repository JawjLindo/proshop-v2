import express from 'express';
import { productRouter } from './product.routes';
import { userRouter } from './user.routes';
import { orderRouter } from './order.routes';
import { uploadRouter } from './upload.routes';

export const apiRouter = express.Router();

apiRouter.use('/products', productRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/upload', uploadRouter);

apiRouter.get('/config/paypal', (_req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});
