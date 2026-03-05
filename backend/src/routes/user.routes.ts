import { Router } from 'express';
import { optionalAuthenticate } from '../middleware/auth.middleware';
import userController from '../controllers/user.controller';
import {
    validate,
    updateProfileSchema,
    changePasswordSchema,
} from '../middleware/validation.middleware';
import Joi from 'joi';

const router = Router();

// Use optional auth — unauthenticated requests fall back to guest user in the controller
router.use(optionalAuthenticate);

// GET /api/users/me — get current user profile
router.get('/me', userController.getMe.bind(userController));

// PATCH /api/users/me — update profile
router.patch(
    '/me',
    validate(updateProfileSchema),
    userController.updateProfile.bind(userController)
);

// POST /api/users/me/change-password — change password
router.post(
    '/me/change-password',
    validate(changePasswordSchema),
    userController.changePassword.bind(userController)
);

// GET /api/users/me/preferences
router.get('/me/preferences', userController.getPreferences.bind(userController));

// PATCH /api/users/me/preferences
router.patch(
    '/me/preferences',
    validate(
        Joi.object({
            emailNotifications: Joi.boolean().optional(),
            jobAlerts: Joi.boolean().optional(),
            weeklyDigest: Joi.boolean().optional(),
            marketingEmails: Joi.boolean().optional(),
            preferredLocations: Joi.array().items(Joi.string()).optional(),
            preferredJobTypes: Joi.array().items(Joi.string()).optional(),
            industriesOfInterest: Joi.array().items(Joi.string()).optional(),
        })
    ),
    userController.updatePreferences.bind(userController)
);

// DELETE /api/users/me — soft-delete account (requires password in body)
router.delete(
    '/me',
    validate(Joi.object({ password: Joi.string().required() })),
    userController.deleteAccount.bind(userController)
);

export default router;
