import express from 'express';

const notFound = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const unhandled = (
  err: Error,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Check for Mongoose bad ObjectId
  if (err.name === 'BSONError') {
    message = 'Product not found';
    statusCode = 404;
  }

  res.status(statusCode);
  res.json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
  next();
};

export const setupErrorHandlers = (app: express.Application) => {
  app.use(notFound);
  app.use(unhandled);
};
