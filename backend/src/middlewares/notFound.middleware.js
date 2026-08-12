import { errorResponse } from '../utils/apiResponse.js';

export const notFound = (req, res, next) => {
  return errorResponse(res, `Route ${req.originalUrl} not found`, null, 404);
};
