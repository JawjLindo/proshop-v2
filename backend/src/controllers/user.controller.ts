import { Middleware } from '../middleware';
import { Models } from '../models';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import express from 'express';

const authUser = Middleware.asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id.toString());

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

const registerUser = Middleware.asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await Models.User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await Models.User.create({ name, email, password });

  if (user) {
    generateToken(res, user._id.toString());

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const logoutUser = Middleware.asyncHandler(async (_req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
});

const getUserProfile = Middleware.asyncHandler(async (req, res) => {
  const user = await Models.User.findById(req.user?.id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserProfile = Middleware.asyncHandler(async (req, res) => {
  const user = await Models.User.findById(req.user?.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUsers = Middleware.asyncHandler(async (_req, res) => {
  const users = await Models.User.find({});
  res.status(200).json(users);
});

const deleteUser = Middleware.asyncHandler(async (req, res) => {
  const user = await Models.User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }

    await Models.User.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'User deleted' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUserById = Middleware.asyncHandler(async (req, res) => {
  const user = await Models.User.findById(req.params.id).select('-password');

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUser = Middleware.asyncHandler(async (req, res) => {
  const user = await Models.User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.user?._id.toString() != user._id.toString()) {
      user.isAdmin = Boolean(req.body.isAdmin);
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const userController = {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};

const generateToken = (res: express.Response, userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '1000d',
  });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 1000 * 60 * 60 * 1000,
  });
};
