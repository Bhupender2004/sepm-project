import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import logger from '../utils/logger.util';

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({
                success: true,
                message: 'Registration successful.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.login(req.body);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;
            const result = await authService.verifyEmail(token);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const result = await authService.requestPasswordReset(email);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, newPassword } = req.body;
            const result = await authService.resetPassword(token, newPassword);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/refresh-token
     * Body: { refreshToken: string }
     */
    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                res.status(400).json({
                    success: false,
                    message: 'refreshToken is required',
                });
                return;
            }

            const result = await authService.refreshToken(refreshToken);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/logout
     * Client should discard both tokens.
     * Redis blacklisting available when Redis is configured.
     */
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const revokedToken = authHeader.split(' ')[1];
                // TODO: blacklist revokedToken in Redis when available
                logger.info(`Logout: token will be discarded client-side`);
                void revokedToken;
            }

            res.status(200).json({
                success: true,
                message: 'Logged out successfully. Please discard your tokens.',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
