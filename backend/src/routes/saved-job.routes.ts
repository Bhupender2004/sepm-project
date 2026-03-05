import { Router } from 'express';
import { optionalAuthenticate } from '../middleware/auth.middleware';
import savedJobController from '../controllers/saved-job.controller';

const router = Router();

// optionalAuthenticate: uses token if present, otherwise uses guest userId
router.use(optionalAuthenticate);

// GET  /api/saved-jobs/check?externalJobId=...&sourcePlatform=...
router.get('/check', savedJobController.check.bind(savedJobController));

// GET  /api/saved-jobs
router.get('/', savedJobController.getAll.bind(savedJobController));

// POST /api/saved-jobs
router.post('/', savedJobController.save.bind(savedJobController));

// PATCH /api/saved-jobs/:id
router.patch('/:id', savedJobController.update.bind(savedJobController));

// DELETE /api/saved-jobs/:id
router.delete('/:id', savedJobController.remove.bind(savedJobController));

export default router;
