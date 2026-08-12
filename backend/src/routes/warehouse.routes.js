import express from 'express';
import {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse
} from '../controllers/warehouse.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE),
  createWarehouse
);
router.get(
  '/',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE, ROLES.SALES, ROLES.ACCOUNTS),
  getWarehouses
);
router.get(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE, ROLES.SALES, ROLES.ACCOUNTS),
  getWarehouseById
);
router.put(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE),
  updateWarehouse
);
router.delete(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE),
  deleteWarehouse
);

export default router;
