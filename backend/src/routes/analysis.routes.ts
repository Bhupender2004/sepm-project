import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import analysisController from '../controllers/analysis.controller';
import jobDescriptionController from '../controllers/job-description.controller';
import Joi from 'joi';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All analysis routes require authentication
router.use(authenticate);

// POST /api/analyses - Create new analysis
router.post(
    '/',
    validate(
        Joi.object({
            resumeId: Joi.string().uuid().required(),
            jobDescriptionId: Joi.string().uuid().required(),
        })
    ),
    analysisController.createAnalysis
);

// GET /api/analyses - Get all analyses
router.get('/', analysisController.getAnalyses);

// GET /api/analyses/:id - Get single analysis
router.get('/:id', analysisController.getAnalysisById);

// DELETE /api/analyses/:id - Delete analysis
router.delete('/:id', analysisController.deleteAnalysis);

// Job Description routes
// POST /api/analyses/job-descriptions - Create JD
router.post(
    '/job-descriptions',
    validate(
        Joi.object({
            jobTitle: Joi.string().max(200).required(),
            company: Joi.string().max(200).required(),
            fullText: Joi.string().required(),
        })
    ),
    jobDescriptionController.createJobDescription
);

// GET /api/analyses/job-descriptions - Get all JDs
router.get('/job-descriptions', jobDescriptionController.getJobDescriptions);

// GET /api/analyses/job-descriptions/:id - Get single JD
router.get('/job-descriptions/:id', jobDescriptionController.getJobDescriptionById);

// PATCH /api/analyses/job-descriptions/:id - Update JD
router.patch(
    '/job-descriptions/:id',
    validate(
        Joi.object({
            jobTitle: Joi.string().max(200).optional(),
            company: Joi.string().max(200).optional(),
            fullText: Joi.string().optional(),
        })
    ),
    jobDescriptionController.updateJobDescription
);

// DELETE /api/analyses/job-descriptions/:id - Delete JD
router.delete('/job-descriptions/:id', jobDescriptionController.deleteJobDescription);

export default router;
