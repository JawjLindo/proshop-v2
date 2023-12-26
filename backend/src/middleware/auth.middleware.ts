import { Models } from '../models';
import { asyncHandler } from './asyncHandler.middleware';
import jwt from 'jsonwebtoken';
import express from 'express';

export const protect = asyncHandler(async (req, res, next) => {
  const token: string | null = req.cookies.jwt;

  if (token) {
    try {
      const decoded = <jwt.JwtPayload>(
        jwt.verify(token, process.env.JWT_SECRET!)
      );
      req.user! = await Models.User.findById(decoded.userId).select(
        '-password'
      );
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized; token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized; no token');
  }
});

export const admin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized; not an admin');
  }
};
