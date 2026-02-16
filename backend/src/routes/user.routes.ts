import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// GET /api/users/me
router.get('/me', (req, res) => {
    res.json({ success: true, message: 'User routes - coming soon' });
});

export default router;
