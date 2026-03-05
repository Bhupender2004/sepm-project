import { Router } from 'express';
import jobSearchController from '../controllers/job-search.controller';

const router = Router();

// GET /api/jobs/search?keywords=react,typescript&location=remote&limit=20
router.get('/search', (req, res) => jobSearchController.searchJobs(req, res));

// POST /api/jobs/search-from-resume  { skills: string[], location?: string }
router.post('/search-from-resume', (req, res) => jobSearchController.searchJobsFromResume(req, res));

export default router;
