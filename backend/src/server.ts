import app from './app';
import config from './config/env';
import { connectDatabase } from './config/database';

import logger from './utils/logger.util';
import { seedGuestUser } from './utils/seed-guest';
import './models'; // Initialize models and associations

const startServer = async () => {
    try {
        // Guard: refuse to start with the default insecure JWT secret
        if (config.jwt.secret.startsWith('your-super-secret')) {
            logger.error('❌ JWT_SECRET is still set to the default placeholder. Set a strong secret in .env before running.');
            process.exit(1);
        }

        // Connect to database
        await connectDatabase();

        // Seed the shared guest user so saved_jobs FK never fails in no-auth mode
        await seedGuestUser();



        // Start server
        const PORT = config.port;
        app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
            logger.info(`📝 API available at http://localhost:${PORT}/api`);
            logger.info(`❤️  Health check at http://localhost:${PORT}/health`);
        });
    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Rejection:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

startServer();
