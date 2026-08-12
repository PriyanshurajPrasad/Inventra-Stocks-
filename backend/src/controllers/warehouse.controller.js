import Warehouse from '../models/Warehouse.js';
import { successResponse, paginatedResponse } from '../utils/apiResponse.js';

export const createWarehouse = async (req, res, next) => {
  try {
    const { name, location, description, isActive } = req.body;
    const warehouse = await Warehouse.create({ name, location, description, isActive });
    return successResponse(res, 'Warehouse created successfully', warehouse, 201);
  } catch (error) {
    next(error);
  }
};

export const getWarehouses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [warehouses, total] = await Promise.all([
      Warehouse.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Warehouse.countDocuments()
    ]);

    return paginatedResponse(res, 'Warehouses retrieved successfully', warehouses, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const getWarehouseById = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    return successResponse(res, 'Warehouse retrieved successfully', warehouse);
  } catch (error) {
    next(error);
  }
};

export const updateWarehouse = async (req, res, next) => {
  try {
    const { name, location, description, isActive } = req.body;
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { name, location, description, isActive },
      { new: true, runValidators: true }
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    return successResponse(res, 'Warehouse updated successfully', warehouse);
  } catch (error) {
    next(error);
  }
};

export const deleteWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    return successResponse(res, 'Warehouse deleted successfully', warehouse);
  } catch (error) {
    next(error);
  }
};
