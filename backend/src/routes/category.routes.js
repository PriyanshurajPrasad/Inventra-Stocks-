import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE),
  createCategory
);
router.get(
  '/',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE, ROLES.SALES, ROLES.ACCOUNTS),
  getCategories
);
router.get(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE, ROLES.SALES, ROLES.ACCOUNTS),
  getCategoryById
);
router.put(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE),
  updateCategory
);
router.delete(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE),
  deleteCategory
);

export default router;
