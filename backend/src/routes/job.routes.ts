import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All job routes require authentication
router.use(authenticate);

// GET /api/jobs/search
router.get('/search', (req, res) => {
    res.json({ success: true, message: 'Job routes - coming soon' });
});

export default router;
