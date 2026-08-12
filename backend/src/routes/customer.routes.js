import express from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from '../controllers/customer.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createCustomerSchema, updateCustomerSchema } from '../validations/customer.validation.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.SALES),
  validate(createCustomerSchema),
  createCustomer
);
router.get(
  '/',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.SALES),
  getCustomers
);
router.get(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.SALES),
  getCustomerById
);
router.put(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.SALES),
  validate(updateCustomerSchema),
  updateCustomer
);
router.delete(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.SALES),
  deleteCustomer
);

export default router;
