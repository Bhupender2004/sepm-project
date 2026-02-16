import { Sequelize } from 'sequelize';
import config from './env';
import logger from '../utils/logger.util';

// Use SQLite for development if DATABASE_URL contains sqlite
const isSQLite = config.database.url.includes('sqlite');

const sequelize = isSQLite
    ? new Sequelize({
        dialect: 'sqlite',
        storage: config.database.url.replace('sqlite:', ''),
        logging: config.nodeEnv === 'development' ? (msg) => logger.debug(msg) : false,
    })
    : new Sequelize(config.database.url || {
        database: config.database.name,
        username: config.database.user,
        password: config.database.password,
        host: config.database.host,
        port: config.database.port,
        dialect: 'postgres',
        logging: config.nodeEnv === 'development' ? (msg) => logger.debug(msg) : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    });

export const connectDatabase = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        logger.info('✅ Database connection established successfully');

        if (config.nodeEnv === 'development') {
            await sequelize.sync({ alter: true });
            logger.info('✅ Database synchronized');
        }
    } catch (error) {
        logger.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
};

export default sequelize;
