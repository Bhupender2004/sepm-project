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
    : config.database.url
        ? new Sequelize(config.database.url, {
            dialect: 'postgres',
            logging: config.nodeEnv === 'development' ? (msg) => logger.debug(msg) : false,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        })
        : new Sequelize({
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

        // Use sync({ alter: false }) to avoid Sequelize's SQLite backup/drop/recreate loop.
        // The alter:true mode on SQLite triggers multiple table recreation cycles per model.
        // Plain sync() still creates tables that don't exist without touching existing ones.
        await sequelize.sync();
        logger.info('✅ Database synchronized');
    } catch (error) {
        logger.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
};

export default sequelize;
