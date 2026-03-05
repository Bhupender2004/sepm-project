import { User } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import { ConflictError, UnauthorizedError, ValidationError } from '../utils/errors.util';

interface RegisterData {
    fullName: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export class AuthService {
    async register(data: RegisterData) {
        const { fullName, email, password } = data;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictError('Email already registered');
        }

        // Hash password
        const passwordHash = await User.hashPassword(password);

        // Create user (auto-verified since email service is not configured)
        const user = await User.create({
            fullName,
            email,
            passwordHash,
            emailVerified: true,
        });

        return {
            userId: user.id,
            email: user.email,
            emailVerificationSent: false,
        };
    }

    async login(data: LoginData) {
        const { email, password, rememberMe: _rememberMe } = data;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // Check if email is verified (always true in dev since we auto-verify)
        if (!user.emailVerified) {
            throw new UnauthorizedError('Account not verified. Please contact support.');
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
        });

        const refreshToken = generateRefreshToken({
            userId: user.id,
            email: user.email,
        });

        // Return user data and tokens
        return {
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                emailVerified: user.emailVerified,
                profilePicture: user.profilePicture,
            },
            accessToken,
            refreshToken,
            expiresIn: 3600, // 1 hour
        };
    }

    async verifyEmail(token: string) {
        const user = await User.findOne({
            where: {
                emailVerificationToken: token,
            },
        });

        if (!user) {
            throw new ValidationError('Invalid verification token');
        }

        if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
            throw new ValidationError('Verification token has expired');
        }

        // Mark email as verified
        user.emailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        await user.save();

        return {
            message: 'Email verified successfully',
        };
    }

    async requestPasswordReset(email: string) {
        const user = await User.findOne({ where: { email } });

        // Always return success to prevent email enumeration
        if (!user) {
            return {
                message: 'If the email exists, a password reset link has been sent',
            };
        }

        // Generate reset token
        const passwordResetToken = uuidv4();
        const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.passwordResetToken = passwordResetToken;
        user.passwordResetExpires = passwordResetExpires;
        await user.save();

        // TODO: Send password reset email
        // await emailService.sendPasswordResetEmail(email, passwordResetToken);

        return {
            message: 'If the email exists, a password reset link has been sent',
        };
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await User.findOne({
            where: {
                passwordResetToken: token,
            },
        });

        if (!user) {
            throw new ValidationError('Invalid reset token');
        }

        if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
            throw new ValidationError('Reset token has expired');
        }

        // Hash new password
        const passwordHash = await User.hashPassword(newPassword);

        // Update password and clear reset token
        user.passwordHash = passwordHash;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        return {
            message: 'Password reset successfully',
        };
    }
    async refreshToken(token: string) {
        try {
            const { verifyToken, generateAccessToken } = await import('../utils/jwt.util');
            const decoded = verifyToken(token);

            // Verify user still exists and is active
            const user = await User.findByPk(decoded.userId, {
                attributes: ['id', 'email', 'emailVerified', 'deletedAt'],
            });

            if (!user || !user.emailVerified) {
                throw new UnauthorizedError('User account is not active');
            }

            // Issue new access token
            const accessToken = generateAccessToken({
                userId: decoded.userId,
                email: decoded.email,
            });

            return { accessToken, expiresIn: 3600 };
        } catch (error) {
            throw new UnauthorizedError('Invalid or expired refresh token');
        }
    }
}

export default new AuthService();

