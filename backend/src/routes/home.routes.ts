import express from 'express';

export const homeRouter = express.Router();

homeRouter.get('/', (_req, res) => {
  res.json({ message: 'API is running...' });
});
