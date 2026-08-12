import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.get('/', authMiddleware, requireRole(ROLES.ADMIN), getAllUsers);
router.get('/:id', authMiddleware, requireRole(ROLES.ADMIN), getUserById);
router.put('/:id', authMiddleware, requireRole(ROLES.ADMIN), updateUser);
router.delete('/:id', authMiddleware, requireRole(ROLES.ADMIN), deleteUser);

export default router;
