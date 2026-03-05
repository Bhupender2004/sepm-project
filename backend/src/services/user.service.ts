import { User } from '../models';
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors.util';

interface UpdateProfileData {
    fullName?: string;
    phone?: string;
    location?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
}

interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

interface UpdatePreferencesData {
    emailNotifications?: boolean;
    jobAlerts?: boolean;
    weeklyDigest?: boolean;
    marketingEmails?: boolean;
    preferredLocations?: string[];
    preferredJobTypes?: string[];
    industriesOfInterest?: string[];
}

export class UserService {
    /**
     * Get user profile (safe — no passwordHash)
     */
    async getProfile(userId: string) {
        const user = await User.findByPk(userId, {
            attributes: {
                exclude: [
                    'passwordHash',
                    'emailVerificationToken',
                    'emailVerificationExpires',
                    'passwordResetToken',
                    'passwordResetExpires',
                    'deletedAt',
                ],
            },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user;
    }

    /**
     * Update user profile fields
     */
    async updateProfile(userId: string, data: UpdateProfileData) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (data.fullName !== undefined) user.fullName = data.fullName;
        if (data.phone !== undefined) user.phone = data.phone ?? null;
        if (data.location !== undefined) user.location = data.location ?? null;
        if (data.linkedinUrl !== undefined) user.linkedinUrl = data.linkedinUrl ?? null;
        if (data.portfolioUrl !== undefined) user.portfolioUrl = data.portfolioUrl ?? null;

        await user.save();

        return this.getProfile(userId);
    }

    /**
     * Change user's password
     */
    async changePassword(userId: string, data: ChangePasswordData) {
        const { currentPassword, newPassword } = data;

        const user = await User.findByPk(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Verify current password
        const isValid = await user.comparePassword(currentPassword);
        if (!isValid) {
            throw new UnauthorizedError('Current password is incorrect');
        }

        // Ensure new password differs
        if (currentPassword === newPassword) {
            throw new ValidationError('New password must differ from current password');
        }

        // Hash and save new password
        user.passwordHash = await User.hashPassword(newPassword);
        await user.save();

        return { message: 'Password changed successfully' };
    }

    /**
     * Get user preferences
     */
    async getPreferences(userId: string) {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'preferences'],
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user.preferences || {};
    }

    /**
     * Update user preferences
     */
    async updatePreferences(userId: string, data: UpdatePreferencesData) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const current = (user.preferences as Record<string, any>) || {};
        user.preferences = { ...current, ...data };
        await user.save();

        return user.preferences;
    }

    /**
     * Soft-delete user account
     */
    async deleteAccount(userId: string, password: string) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Require password confirmation before deletion
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            throw new UnauthorizedError('Password is incorrect');
        }

        await user.destroy(); // Sequelize paranoid soft-delete

        return { message: 'Account deleted successfully' };
    }
}

export default new UserService();
