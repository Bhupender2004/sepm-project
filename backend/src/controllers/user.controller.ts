import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { GUEST_USER_ID } from '../services/saved-job.service';

export class UserController {
    /**
     * GET /api/users/me
     */
    async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId ?? GUEST_USER_ID;
            const profile = await userService.getProfile(userId);

            res.status(200).json({
                success: true,
                data: profile,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/users/me
     */
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId ?? GUEST_USER_ID;
            const { fullName, phone, location, linkedinUrl, portfolioUrl } = req.body;

            const updated = await userService.updateProfile(userId, {
                fullName,
                phone,
                location,
                linkedinUrl,
                portfolioUrl,
            });

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updated,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/users/me/change-password
     */
    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId ?? GUEST_USER_ID;
            const { currentPassword, newPassword } = req.body;

            const result = await userService.changePassword(userId, {
                currentPassword,
                newPassword,
            });

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/users/me/preferences
     */
    async getPreferences(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId ?? GUEST_USER_ID;
            const prefs = await userService.getPreferences(userId);

            res.status(200).json({
                success: true,
                data: prefs,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/users/me/preferences
     */
    async updatePreferences(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId ?? GUEST_USER_ID;
            const data = req.body;

            const prefs = await userService.updatePreferences(userId, data);

            res.status(200).json({
                success: true,
                message: 'Preferences updated successfully',
                data: prefs,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/users/me
     * Requires password confirmation in body
     */
    async deleteAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId ?? GUEST_USER_ID;
            const { password } = req.body;

            if (!password) {
                res.status(400).json({
                    success: false,
                    message: 'Password is required to delete your account',
                });
                return;
            }

            const result = await userService.deleteAccount(userId, password);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
