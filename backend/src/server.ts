import app from './app';
import config from './config/env';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import logger from './utils/logger.util';

const startServer = async () => {
    try {
        // Connect to database
        await connectDatabase();

        // Connect to Redis
        try {
            await connectRedis();
        } catch (error) {
            logger.warn('⚠️  Redis connection failed, continuing without caching');
        }

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
