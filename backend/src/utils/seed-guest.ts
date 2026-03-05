import { User } from '../models';
import { GUEST_USER_ID } from '../services/saved-job.service';
import logger from './logger.util';

/**
 * Ensures the shared guest user row exists in the database.
 * Called once at server startup so that saved_jobs FK constraints never fail
 * when running the app without real authentication.
 */
export const seedGuestUser = async (): Promise<void> => {
    try {
        const [, created] = await User.findOrCreate({
            where: { id: GUEST_USER_ID },
            defaults: {
                id: GUEST_USER_ID,
                fullName: 'Guest User',
                email: 'guest@localhost.local',
                passwordHash: '$2a$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                emailVerified: true,
            },
        });

        if (created) {
            logger.info('🌱 Guest user seeded successfully');
        }
    } catch (error) {
        // Non-fatal — app still works if the guest row already exists
        logger.warn('⚠️  Could not seed guest user (may already exist):', error);
    }
};
