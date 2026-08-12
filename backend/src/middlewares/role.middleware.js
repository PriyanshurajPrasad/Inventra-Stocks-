import { errorResponse } from '../utils/apiResponse.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', null, 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        'Insufficient permissions',
        { required: allowedRoles, current: req.user.role },
        403
      );
    }

    next();
  };
};
