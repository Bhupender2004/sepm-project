import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All analysis routes require authentication
router.use(authenticate);

// POST /api/analyses
router.post('/', (req, res) => {
    res.json({ success: true, message: 'Analysis routes - coming soon' });
});

export default router;
