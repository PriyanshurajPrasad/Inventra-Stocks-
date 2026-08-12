import { errorResponse } from '../utils/apiResponse.js';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return errorResponse(res, 'Validation failed', errors, 400);
      }

      req.validatedData = result.data;
      next();
    } catch (error) {
      return errorResponse(res, 'Validation error', null, 400);
    }
  };
};
