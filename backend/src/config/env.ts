import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    database: {
        url: string;
        host: string;
        port: number;
        name: string;
        user: string;
        password: string;
    };

    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    openrouter: {
        apiKey: string;
        model: string;
    };
    rapidApi: {
        key: string;
    };
    email: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        password: string;
        from: string;
    };
    upload: {
        maxFileSize: number;
        uploadDir: string;
    };
    frontendUrl: string;
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    logLevel: string;
}

const config: Config = {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL || '',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        name: process.env.DB_NAME || 'resume_analyzer',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    openrouter: {
        apiKey: process.env.OPENROUTER_API_KEY || '',
        model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1:free',
    },
    rapidApi: {
        key: process.env.RAPIDAPI_KEY || '',
    },
    email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: process.env.EMAIL_SECURE === 'true',
        user: process.env.EMAIL_USER || '',
        password: process.env.EMAIL_PASSWORD || '',
        from: process.env.EMAIL_FROM || 'noreply@resumeanalyzer.com',
    },
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
        uploadDir: process.env.UPLOAD_DIR || './uploads',
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
    logLevel: process.env.LOG_LEVEL || 'info',
};

export default config;
