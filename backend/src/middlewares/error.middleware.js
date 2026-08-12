import mongoose from 'mongoose';
import { errorResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  if (err.isOperational || statusCode < 500) {
    console.log(`[${req.method}] ${req.originalUrl} - ${statusCode}: ${err.message}`);
  } else {
    console.error('Unhandled Error:', err);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return errorResponse(res, 'Validation failed', errors, 400);
  }

  if (err.name === 'CastError') {
    return errorResponse(res, 'Invalid ID format', null, 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(res, `${field} already exists`, null, 409);
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', null, 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', null, 401);
  }

  if (err.name === 'MongooseError') {
    return errorResponse(res, 'Database error', null, 500);
  }

  const message = err.message || 'Internal server error';

  return errorResponse(res, message, null, statusCode);
};
