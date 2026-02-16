import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.util';
import logger from '../utils/logger.util';
import config from '../config/env';

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let isOperational = false;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
    }

    // Log error
    logger.error(`[${statusCode}] ${message}`, {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        ...(config.nodeEnv === 'development' && {
            error: err.message,
            stack: err.stack,
        }),
    });
};

export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
};
