import { Router } from 'express';
import { upload } from '../middleware/upload.middleware';
import publicAnalysisController from '../controllers/public-analysis.controller';

const router = Router();

/**
 * POST /api/public/analyze
 * No authentication required.
 * Accepts multipart/form-data:
 *   - resume: File (PDF or DOCX, max 5MB)
 *   - jobDescription: string
 */
router.post(
    '/analyze',
    upload.single('resume'),
    (req, res) => publicAnalysisController.analyze(req, res)
);

export default router;
