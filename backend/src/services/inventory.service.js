import Product from '../models/Product.js';
import StockMovement from '../models/StockMovement.js';
import { MOVEMENT_TYPE } from '../constants/movementType.js';

export const createStockMovementService = async (movementData, userId) => {
  const { product, quantityChanged, movementType, reason } = movementData;

  const productDoc = await Product.findById(product);
  
  if (!productDoc) {
    throw new Error('Product not found');
  }

  const currentStock = productDoc.currentStock;

  if (movementType === MOVEMENT_TYPE.OUT) {
    if (currentStock < quantityChanged) {
      throw new Error(`Insufficient stock. Available: ${currentStock}, Requested: ${quantityChanged}`);
    }
  }

  // Try to use transactions if available (replica set)
  try {
    const session = await Product.startSession();

    try {
      await session.withTransaction(async () => {
        if (movementType === MOVEMENT_TYPE.OUT) {
          productDoc.currentStock = currentStock - quantityChanged;
        } else {
          productDoc.currentStock = currentStock + quantityChanged;
        }

        await productDoc.save({ session });

        await StockMovement.create([{
          product,
          quantityChanged,
          movementType,
          reason,
          createdBy: userId
        }], { session });
      });

      await session.endSession();

      return await StockMovement.findOne({ product, createdBy: userId })
        .populate('product')
        .sort({ createdAt: -1 });
    } catch (error) {
      await session.endSession();
      throw error;
    }
  } catch (transactionError) {
    // Fallback for standalone MongoDB (no replica set)
    if (transactionError.message.includes('replica set') || transactionError.message.includes('mongos')) {
      console.warn('Transactions not available, using fallback method');
      
      // Perform operations without transaction
      if (movementType === MOVEMENT_TYPE.OUT) {
        productDoc.currentStock = currentStock - quantityChanged;
      } else {
        productDoc.currentStock = currentStock + quantityChanged;
      }

      await productDoc.save();

      return await StockMovement.create({
        product,
        quantityChanged,
        movementType,
        reason,
        createdBy: userId
      }).then(movement => movement.populate('product'));
    }
    
    throw transactionError;
  }
};

export const getStockMovementsService = async (filters = {}) => {
  const { page = 1, limit = 10, product, movementType, startDate, endDate } = filters;

  const query = {};

  if (product) {
    query.product = product;
  }

  if (movementType) {
    query.movementType = movementType;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  const skip = (page - 1) * limit;

  const [movements, total] = await Promise.all([
    StockMovement.find(query)
      .populate('product')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    StockMovement.countDocuments(query)
  ]);

  return {
    movements,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
