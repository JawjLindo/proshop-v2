import express from 'express';

import { homeRouter } from './home.routes';
import { apiRouter } from './api';

export const setupRoutes = (app: express.Application): void => {
  app.use('/api', apiRouter);
  app.use('/', homeRouter);
};
