import { createClient, RedisClientType } from 'redis';
import config from './env';
import logger from '../utils/logger.util';

let redisClient: RedisClientType | null = null;

export const connectRedis = async (): Promise<RedisClientType> => {
    if (redisClient) {
        return redisClient;
    }

    try {
        redisClient = createClient({
            url: config.redis.url,
        });

        redisClient.on('error', (err) => {
            logger.error('Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
            logger.info('✅ Redis connected successfully');
        });

        await redisClient.connect();
        return redisClient;
    } catch (error) {
        logger.error('❌ Failed to connect to Redis:', error);
        throw error;
    }
};

export const getRedisClient = (): RedisClientType => {
    if (!redisClient) {
        throw new Error('Redis client not initialized. Call connectRedis() first.');
    }
    return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
        logger.info('Redis disconnected');
    }
};

export default { connectRedis, getRedisClient, disconnectRedis };
