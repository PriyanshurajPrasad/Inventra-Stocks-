import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService
} from '../services/product.service.js';
import { successResponse, paginatedResponse } from '../utils/apiResponse.js';

export const createProduct = async (req, res, next) => {
  try {
    const product = await createProductService(req.validatedData);
    return successResponse(res, 'Product created successfully', product, 201);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      category: req.query.category,
      warehouse: req.query.warehouse
    };

    const result = await getProductsService(filters);
    return paginatedResponse(res, 'Products retrieved successfully', result.products, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req.params.id);
    return successResponse(res, 'Product retrieved successfully', product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await updateProductService(req.params.id, req.validatedData);
    return successResponse(res, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await deleteProductService(req.params.id);
    return successResponse(res, 'Product deleted successfully', product);
  } catch (error) {
    next(error);
  }
};
