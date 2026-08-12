import {
  createChallanService,
  getChallansService,
  getChallanByIdService,
  updateChallanService,
  confirmChallanService,
  cancelChallanService,
  deleteChallanService
} from '../services/challan.service.js';
import { successResponse, paginatedResponse } from '../utils/apiResponse.js';

export const createChallan = async (req, res, next) => {
  try {
    const challan = await createChallanService(req.validatedData, req.user.userId);
    return successResponse(res, 'Challan created successfully', challan, 201);
  } catch (error) {
    next(error);
  }
};

export const getChallans = async (req, res, next) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      status: req.query.status,
      customer: req.query.customer,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const result = await getChallansService(filters);
    return paginatedResponse(res, 'Challans retrieved successfully', result.challans, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getChallanById = async (req, res, next) => {
  try {
    const challan = await getChallanByIdService(req.params.id);
    return successResponse(res, 'Challan retrieved successfully', challan);
  } catch (error) {
    next(error);
  }
};

export const updateChallan = async (req, res, next) => {
  try {
    const challan = await updateChallanService(req.params.id, req.validatedData, req.user.userId);
    return successResponse(res, 'Challan updated successfully', challan);
  } catch (error) {
    next(error);
  }
};

export const confirmChallan = async (req, res, next) => {
  try {
    const challan = await confirmChallanService(req.params.id, req.user.userId);
    return successResponse(res, 'Challan confirmed successfully', challan);
  } catch (error) {
    next(error);
  }
};

export const cancelChallan = async (req, res, next) => {
  try {
    const challan = await cancelChallanService(req.params.id, req.user.userId);
    return successResponse(res, 'Challan cancelled successfully', challan);
  } catch (error) {
    next(error);
  }
};

export const deleteChallan = async (req, res, next) => {
  try {
    const challan = await deleteChallanService(req.params.id);
    return successResponse(res, 'Challan deleted successfully', challan);
  } catch (error) {
    next(error);
  }
};
