import express from 'express';
import { Controllers } from '../../controllers';
import { Middleware } from '../../middleware';

const {
  authUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  logoutUser,
  registerUser,
  updateUser,
  updateUserProfile,
} = Controllers.user;

export const userRouter = express.Router();

userRouter
  .route('/')
  .get(Middleware.protect, Middleware.admin, getUsers)
  .post(registerUser);
userRouter.route('/logout').post(logoutUser);
userRouter.route('/auth').post(authUser);
userRouter
  .route('/profile')
  .get(Middleware.protect, getUserProfile)
  .put(Middleware.protect, updateUserProfile);
userRouter
  .route('/:id')
  .delete(Middleware.protect, Middleware.admin, deleteUser)
  .get(Middleware.protect, Middleware.admin, getUserById)
  .put(Middleware.protect, Middleware.admin, updateUser);
