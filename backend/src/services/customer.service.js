import Customer from '../models/Customer.js';

export const createCustomerService = async (customerData) => {
  const customer = await Customer.create(customerData);
  return customer;
};

export const getCustomersService = async (filters = {}) => {
  const { page = 1, limit = 10, search, status, customerType } = filters;

  const query = {};

  if (search) {
    query.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { mobileNumber: { $regex: search, $options: 'i' } },
      { businessName: { $regex: search, $options: 'i' } }
    ];
  }

  if (status) {
    query.status = status;
  }

  if (customerType) {
    query.customerType = customerType;
  }

  const skip = (page - 1) * limit;

  const [customers, total] = await Promise.all([
    Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Customer.countDocuments(query)
  ]);

  return {
    customers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getCustomerByIdService = async (id) => {
  const customer = await Customer.findById(id);
  
  if (!customer) {
    throw new Error('Customer not found');
  }

  return customer;
};

export const updateCustomerService = async (id, updateData) => {
  const customer = await Customer.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!customer) {
    throw new Error('Customer not found');
  }

  return customer;
};

export const deleteCustomerService = async (id) => {
  const customer = await Customer.findByIdAndDelete(id);

  if (!customer) {
    throw new Error('Customer not found');
  }

  return customer;
};
