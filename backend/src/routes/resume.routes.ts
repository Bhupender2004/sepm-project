import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All resume routes require authentication
router.use(authenticate);

// POST /api/resumes
router.post('/', (req, res) => {
    res.json({ success: true, message: 'Resume routes - coming soon' });
});

export default router;
