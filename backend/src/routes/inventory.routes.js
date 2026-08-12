import express from 'express';
import {
  createStockMovement,
  getStockMovements
} from '../controllers/inventory.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createStockMovementSchema } from '../validations/inventory.validation.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.post(
  '/movements',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE),
  validate(createStockMovementSchema),
  createStockMovement
);
router.get(
  '/movements',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE),
  getStockMovements
);

export default router;
