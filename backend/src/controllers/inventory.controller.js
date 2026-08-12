import {
  createStockMovementService,
  getStockMovementsService
} from '../services/inventory.service.js';
import { successResponse, paginatedResponse } from '../utils/apiResponse.js';

export const createStockMovement = async (req, res, next) => {
  try {
    const movement = await createStockMovementService(req.validatedData, req.user.userId);
    return successResponse(res, 'Stock movement created successfully', movement, 201);
  } catch (error) {
    next(error);
  }
};

export const getStockMovements = async (req, res, next) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      product: req.query.product,
      movementType: req.query.movementType,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const result = await getStockMovementsService(filters);
    return paginatedResponse(res, 'Stock movements retrieved successfully', result.movements, result.pagination);
  } catch (error) {
    next(error);
  }
};
