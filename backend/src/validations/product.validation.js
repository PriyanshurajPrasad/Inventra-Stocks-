import { z } from 'zod';

export const createProductSchema = z.object({
  productName: z.string().min(2, 'Product name must be at least 2 characters'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative'),
  currentStock: z.number().min(0, 'Stock cannot be negative').optional(),
  minimumStockAlertQuantity: z.number().min(0, 'Minimum stock alert quantity cannot be negative').optional(),
  warehouse: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid warehouse ID')
});

export const updateProductSchema = z.object({
  productName: z.string().min(2, 'Product name must be at least 2 characters').optional(),
  sku: z.string().min(1, 'SKU is required').optional(),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID').optional(),
  unitPrice: z.number().min(0, 'Unit price cannot be negative').optional(),
  currentStock: z.number().min(0, 'Stock cannot be negative').optional(),
  minimumStockAlertQuantity: z.number().min(0, 'Minimum stock alert quantity cannot be negative').optional(),
  warehouse: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid warehouse ID').optional()
});
