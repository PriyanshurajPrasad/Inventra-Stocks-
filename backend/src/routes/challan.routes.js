import express from 'express';
import {
  createChallan,
  getChallans,
  getChallanById,
  updateChallan,
  confirmChallan,
  cancelChallan,
  deleteChallan
} from '../controllers/challan.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createChallanSchema, updateChallanSchema } from '../validations/challan.validation.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.SALES),
  validate(createChallanSchema),
  createChallan
);
router.get(
  '/',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.SALES, ROLES.ACCOUNTS),
  getChallans
);
router.get(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.SALES, ROLES.ACCOUNTS),
  getChallanById
);
router.put(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.SALES),
  validate(updateChallanSchema),
  updateChallan
);
router.post(
  '/:id/confirm',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.SALES),
  confirmChallan
);
router.post(
  '/:id/cancel',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.SALES),
  cancelChallan
);
router.delete(
  '/:id',
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.SALES),
  deleteChallan
);

export default router;
