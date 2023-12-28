import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'colors';
import { setupRoutes } from './routes';
import { connectDb } from './config';
import { Middleware } from './middleware';
import path from 'path';

dotenv.config();

const app = express();

const configureApp = () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );
  const __dirname = path.resolve();
  app.use('/images', express.static(path.join(__dirname, '/images')));
  setupRoutes(app);
  Middleware.setupErrorHandlers(app);
};

const startServer = () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.info(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
        .bold
    )
  );
};

connectDb().then(() => {
  configureApp();
  startServer();
});
