import express from 'express';
import { signup, login, getMe } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { signupSchema, loginSchema } from '../validations/auth.validation.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', authMiddleware, getMe);

export default router;
