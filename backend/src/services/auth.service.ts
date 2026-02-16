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

        // Generate email verification token
        const emailVerificationToken = uuidv4();
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user
        const user = await User.create({
            fullName,
            email,
            passwordHash,
            emailVerificationToken,
            emailVerificationExpires,
            emailVerified: false,
        });

        // TODO: Send verification email
        // await emailService.sendVerificationEmail(email, emailVerificationToken);

        return {
            userId: user.id,
            email: user.email,
            emailVerificationSent: true,
        };
    }

    async login(data: LoginData) {
        const { email, password, rememberMe } = data;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // Check if email is verified
        if (!user.emailVerified) {
            throw new UnauthorizedError('Please verify your email before logging in');
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
}

export default new AuthService();
