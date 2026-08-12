import Challan from '../models/Challan.js';
import Product from '../models/Product.js';
import StockMovement from '../models/StockMovement.js';
import Customer from '../models/Customer.js';
import { CHALLAN_STATUS, VALID_STATUS_TRANSITIONS } from '../constants/challanStatus.js';
import { MOVEMENT_TYPE } from '../constants/movementType.js';
import { generateChallanNumber } from '../utils/generateChallanNumber.js';

export const createChallanService = async (challanData, userId) => {
  const { customer, items, status } = challanData;

  const customerDoc = await Customer.findById(customer);
  if (!customerDoc) {
    throw new Error('Customer not found');
  }

  const productIds = items.map(item => item.product);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw new Error('One or more products not found');
  }

  const productMap = new Map(products.map(p => [p._id.toString(), p]));

  const challanItems = items.map(item => {
    const product = productMap.get(item.product);
    return {
      product: item.product,
      productNameSnapshot: product.productName,
      skuSnapshot: product.sku,
      unitPriceSnapshot: product.unitPrice,
      quantity: item.quantity
    };
  });

  const lastChallan = await Challan.findOne().sort({ challanNumber: -1 });
  const challanNumber = generateChallanNumber(lastChallan?.challanNumber);

  const challan = await Challan.create({
    challanNumber,
    customer,
    items: challanItems,
    status: status || CHALLAN_STATUS.DRAFT,
    createdBy: userId
  });

  return await Challan.findById(challan._id)
    .populate('customer')
    .populate('items.product')
    .populate('createdBy', 'name email');
};

export const getChallansService = async (filters = {}) => {
  const { page = 1, limit = 10, search, status, customer, startDate, endDate } = filters;

  const query = {};

  if (search) {
    query.challanNumber = { $regex: search, $options: 'i' };
  }

  if (status) {
    query.status = status;
  }

  if (customer) {
    query.customer = customer;
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

  const [challans, total] = await Promise.all([
    Challan.find(query)
      .populate('customer')
      .populate('items.product')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Challan.countDocuments(query)
  ]);

  return {
    challans,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getChallanByIdService = async (id) => {
  const challan = await Challan.findById(id)
    .populate('customer')
    .populate('items.product')
    .populate('createdBy', 'name email');

  if (!challan) {
    throw new Error('Challan not found');
  }

  return challan;
};

export const updateChallanService = async (id, updateData, userId) => {
  const challan = await Challan.findById(id);

  if (!challan) {
    throw new Error('Challan not found');
  }

  if (challan.status !== CHALLAN_STATUS.DRAFT) {
    throw new Error('Only draft challans can be updated');
  }

  if (updateData.customer) {
    const customerDoc = await Customer.findById(updateData.customer);
    if (!customerDoc) {
      throw new Error('Customer not found');
    }
  }

  if (updateData.items && updateData.items.length > 0) {
    const productIds = updateData.items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      throw new Error('One or more products not found');
    }

    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    updateData.items = updateData.items.map(item => {
      const product = productMap.get(item.product);
      return {
        product: item.product,
        productNameSnapshot: product.productName,
        skuSnapshot: product.sku,
        unitPriceSnapshot: product.unitPrice,
        quantity: item.quantity
      };
    });
  }

  const updatedChallan = await Challan.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('customer').populate('items.product').populate('createdBy', 'name email');

  return updatedChallan;
};

export const confirmChallanService = async (id, userId) => {
  const challan = await Challan.findById(id).populate('items.product');

  if (!challan) {
    throw new Error('Challan not found');
  }

  if (challan.status !== CHALLAN_STATUS.DRAFT) {
    throw new Error('Only draft challans can be confirmed');
  }

  // First validate all products have sufficient stock
  for (const item of challan.items) {
    const product = await Product.findById(item.product._id);
    
    if (!product) {
      throw new Error(`Product ${item.productNameSnapshot} not found`);
    }

    if (product.currentStock < item.quantity) {
      throw new Error(
        `Insufficient stock for ${item.productNameSnapshot}. Available: ${product.currentStock}, Requested: ${item.quantity}`
      );
    }
  }

  // Try to use transactions if available (replica set)
  try {
    const session = await Challan.startSession();

    try {
      await session.withTransaction(async () => {
        for (const item of challan.items) {
          const product = await Product.findById(item.product._id).session(session);
          
          product.currentStock -= item.quantity;
          await product.save({ session });

          await StockMovement.create([{
            product: item.product._id,
            quantityChanged: item.quantity,
            movementType: MOVEMENT_TYPE.OUT,
            reason: `Challan ${challan.challanNumber} confirmation`,
            createdBy: userId
          }], { session });
        }

        challan.status = CHALLAN_STATUS.CONFIRMED;
        await challan.save({ session });
      });

      await session.endSession();

      return await Challan.findById(id)
        .populate('customer')
        .populate('items.product')
        .populate('createdBy', 'name email');
    } catch (error) {
      await session.endSession();
      throw error;
    }
  } catch (transactionError) {
    // Fallback for standalone MongoDB (no replica set)
    if (transactionError.message.includes('replica set') || transactionError.message.includes('mongos')) {
      console.warn('Transactions not available, using fallback method');
      
      // Perform operations without transaction (less safe but works on standalone)
      for (const item of challan.items) {
        const product = await Product.findById(item.product._id);
        
        // Double-check stock
        if (product.currentStock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${item.productNameSnapshot}. Available: ${product.currentStock}, Requested: ${item.quantity}`
          );
        }

        product.currentStock -= item.quantity;
        await product.save();

        await StockMovement.create({
          product: item.product._id,
          quantityChanged: item.quantity,
          movementType: MOVEMENT_TYPE.OUT,
          reason: `Challan ${challan.challanNumber} confirmation`,
          createdBy: userId
        });
      }

      challan.status = CHALLAN_STATUS.CONFIRMED;
      await challan.save();

      return await Challan.findById(id)
        .populate('customer')
        .populate('items.product')
        .populate('createdBy', 'name email');
    }
    
    throw transactionError;
  }
};

export const cancelChallanService = async (id, userId) => {
  const challan = await Challan.findById(id).populate('items.product');

  if (!challan) {
    throw new Error('Challan not found');
  }

  if (challan.status === CHALLAN_STATUS.CANCELLED) {
    throw new Error('Challan is already cancelled');
  }

  if (challan.status === CHALLAN_STATUS.DRAFT) {
    challan.status = CHALLAN_STATUS.CANCELLED;
    await challan.save();

    return await Challan.findById(id)
      .populate('customer')
      .populate('items.product')
      .populate('createdBy', 'name email');
  }

  // Try to use transactions if available (replica set)
  try {
    const session = await Challan.startSession();

    try {
      await session.withTransaction(async () => {
        for (const item of challan.items) {
          const product = await Product.findById(item.product._id).session(session);
          
          product.currentStock += item.quantity;
          await product.save({ session });

          await StockMovement.create([{
            product: item.product._id,
            quantityChanged: item.quantity,
            movementType: MOVEMENT_TYPE.IN,
            reason: `Challan ${challan.challanNumber} cancellation`,
            createdBy: userId
          }], { session });
        }

        challan.status = CHALLAN_STATUS.CANCELLED;
        await challan.save({ session });
      });

      await session.endSession();

      return await Challan.findById(id)
        .populate('customer')
        .populate('items.product')
        .populate('createdBy', 'name email');
    } catch (error) {
      await session.endSession();
      throw error;
    }
  } catch (transactionError) {
    // Fallback for standalone MongoDB (no replica set)
    if (transactionError.message.includes('replica set') || transactionError.message.includes('mongos')) {
      console.warn('Transactions not available, using fallback method');
      
      // Perform operations without transaction
      for (const item of challan.items) {
        const product = await Product.findById(item.product._id);
        
        product.currentStock += item.quantity;
        await product.save();

        await StockMovement.create({
          product: item.product._id,
          quantityChanged: item.quantity,
          movementType: MOVEMENT_TYPE.IN,
          reason: `Challan ${challan.challanNumber} cancellation`,
          createdBy: userId
        });
      }

      challan.status = CHALLAN_STATUS.CANCELLED;
      await challan.save();

      return await Challan.findById(id)
        .populate('customer')
        .populate('items.product')
        .populate('createdBy', 'name email');
    }
    
    throw transactionError;
  }
};

export const deleteChallanService = async (id) => {
  const challan = await Challan.findById(id);

  if (!challan) {
    throw new Error('Challan not found');
  }

  if (challan.status !== CHALLAN_STATUS.DRAFT) {
    throw new Error('Only draft challans can be deleted');
  }

  await Challan.findByIdAndDelete(id);

  return challan;
};
