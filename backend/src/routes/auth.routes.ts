import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate, registerSchema, loginSchema } from '../middleware/validation.middleware';
import Joi from 'joi';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), authController.login);

// GET /api/auth/verify-email/:token
router.get('/verify-email/:token', authController.verifyEmail);

// POST /api/auth/forgot-password
router.post(
    '/forgot-password',
    validate(
        Joi.object({
            email: Joi.string().email().required(),
        })
    ),
    authController.forgotPassword
);

// POST /api/auth/reset-password
router.post(
    '/reset-password',
    validate(
        Joi.object({
            token: Joi.string().required(),
            newPassword: Joi.string()
                .min(8)
                .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
                .required(),
            confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
        })
    ),
    authController.resetPassword
);

// POST /api/auth/logout
router.post('/logout', authController.logout);

export default router;
