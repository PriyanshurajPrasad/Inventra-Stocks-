import { z } from 'zod';
import { MOVEMENT_TYPE_VALUES } from '../constants/movementType.js';

export const createStockMovementSchema = z.object({
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  quantityChanged: z.number().min(1, 'Quantity changed must be at least 1'),
  movementType: z.enum(MOVEMENT_TYPE_VALUES),
  reason: z.string().min(1, 'Reason is required')
});
