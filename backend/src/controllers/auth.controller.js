import { signupService, loginService, getMeService } from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.validatedData;
    const result = await signupService(name, email, password);
    return successResponse(res, 'Signup successful', result, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;
    const result = await loginService(email, password);
    return successResponse(res, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const result = await getMeService(req.user.userId);
    return successResponse(res, 'User retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};
