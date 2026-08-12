import { z } from 'zod';
import { CHALLAN_STATUS_VALUES } from '../constants/challanStatus.js';

export const createChallanSchema = z.object({
  customer: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid customer ID'),
  items: z.array(z.object({
    product: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    quantity: z.number().min(1, 'Quantity must be at least 1')
  })).min(1, 'At least one item is required'),
  status: z.enum(CHALLAN_STATUS_VALUES).optional()
});

export const updateChallanSchema = z.object({
  customer: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid customer ID').optional(),
  items: z.array(z.object({
    product: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    quantity: z.number().min(1, 'Quantity must be at least 1')
  })).optional(),
  status: z.enum(CHALLAN_STATUS_VALUES).optional()
});
