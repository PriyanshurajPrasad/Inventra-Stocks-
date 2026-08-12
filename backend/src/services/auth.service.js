import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';
import { generateToken } from '../utils/generateToken.js';
import { ROLES } from '../constants/roles.js';
import { AppError } from '../utils/AppError.js';

export const signupService = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: ROLES.SALES
  });

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

export const loginService = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);
  
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is inactive', 403);
  }

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

export const getMeService = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};
