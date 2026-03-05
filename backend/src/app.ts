import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import resumeRoutes from './routes/resume.routes';
import analysisRoutes from './routes/analysis.routes';
import jobRoutes from './routes/job.routes';
import publicRoutes from './routes/public.routes';
import savedJobRoutes from './routes/saved-job.routes';



const app: Application = express();

// ── Rate limiters ──────────────────────────────────────────────────────────────
// Global limiter applied to all /api routes
const globalLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});

// Stricter limiter for auth routes (prevents brute-force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

// ── Security middleware ────────────────────────────────────────────────────────
app.use(helmet());

// CORS configuration — supports multiple origins (comma-separated FRONTEND_URL)
const allowedOrigins = config.frontendUrl
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. mobile apps, curl)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS: origin '${origin}' not allowed`));
            }
        },
        credentials: true,
    })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ── Health check (no rate limit) ───────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// ── API routes (with rate limiting) ───────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', globalLimiter, userRoutes);
app.use('/api/resumes', globalLimiter, resumeRoutes);
app.use('/api/analyses', globalLimiter, analysisRoutes);
app.use('/api/jobs', globalLimiter, jobRoutes);
app.use('/api/public', globalLimiter, publicRoutes);
app.use('/api/saved-jobs', globalLimiter, savedJobRoutes);



// ── 404 & error handler ────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
