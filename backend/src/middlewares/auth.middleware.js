import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', null, 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found', null, 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'User account is inactive', null, 401);
    }

    req.user = {
      id: user._id,
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token', null, 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired', null, 401);
    }
    return errorResponse(res, 'Authentication failed', null, 401);
  }
};
