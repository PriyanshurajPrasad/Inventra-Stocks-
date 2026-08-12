import {
  createCustomerService,
  getCustomersService,
  getCustomerByIdService,
  updateCustomerService,
  deleteCustomerService
} from '../services/customer.service.js';
import { successResponse, paginatedResponse } from '../utils/apiResponse.js';

export const createCustomer = async (req, res, next) => {
  try {
    const customer = await createCustomerService(req.validatedData);
    return successResponse(res, 'Customer created successfully', customer, 201);
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      status: req.query.status,
      customerType: req.query.customerType
    };

    const result = await getCustomersService(filters);
    return paginatedResponse(res, 'Customers retrieved successfully', result.customers, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await getCustomerByIdService(req.params.id);
    return successResponse(res, 'Customer retrieved successfully', customer);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const customer = await updateCustomerService(req.params.id, req.validatedData);
    return successResponse(res, 'Customer updated successfully', customer);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await deleteCustomerService(req.params.id);
    return successResponse(res, 'Customer deleted successfully', customer);
  } catch (error) {
    next(error);
  }
};
