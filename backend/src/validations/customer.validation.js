import { z } from 'zod';
import { CUSTOMER_TYPE_VALUES } from '../constants/customerType.js';
import { CUSTOMER_STATUS_VALUES } from '../constants/customerStatus.js';

export const createCustomerSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
  email: z.string().email('Invalid email address').optional(),
  businessName: z.string().optional(),
  gstNumber: z.string().optional(),
  customerType: z.enum(CUSTOMER_TYPE_VALUES).optional(),
  address: z.string().optional(),
  status: z.enum(CUSTOMER_STATUS_VALUES).optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional()
});

export const updateCustomerSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters').optional(),
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits').optional(),
  email: z.string().email('Invalid email address').optional(),
  businessName: z.string().optional(),
  gstNumber: z.string().optional(),
  customerType: z.enum(CUSTOMER_TYPE_VALUES).optional(),
  address: z.string().optional(),
  status: z.enum(CUSTOMER_STATUS_VALUES).optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional()
});
