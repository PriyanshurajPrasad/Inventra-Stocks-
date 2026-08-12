import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema } from '../validations/product.validation.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE),
  validate(createProductSchema),
  createProduct
);
router.get(
  '/',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE, ROLES.SALES, ROLES.ACCOUNTS),
  getProducts
);
router.get(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE, ROLES.SALES, ROLES.ACCOUNTS),
  getProductById
);
router.put(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE),
  validate(updateProductSchema),
  updateProduct
);
router.delete(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.WAREHOUSE),
  deleteProduct
);

export default router;
