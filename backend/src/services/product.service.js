import Product from '../models/Product.js';
import { AppError } from '../utils/AppError.js';

export const createProductService = async (productData) => {
  const product = await Product.create(productData);
  return await Product.findById(product._id).populate('category').populate('warehouse');
};

export const getProductsService = async (filters = {}) => {
  const { page = 1, limit = 10, search, category, warehouse } = filters;

  const query = {};

  if (search) {
    query.$or = [
      { productName: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } }
    ];
  }

  if (category) {
    query.category = category;
  }

  if (warehouse) {
    query.warehouse = warehouse;
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category')
      .populate('warehouse')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Product.countDocuments(query)
  ]);

  return {
    products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getProductByIdService = async (id) => {
  const product = await Product.findById(id).populate('category').populate('warehouse');
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

export const updateProductService = async (id, updateData) => {
  const product = await Product.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('category').populate('warehouse');

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

export const deleteProductService = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};
