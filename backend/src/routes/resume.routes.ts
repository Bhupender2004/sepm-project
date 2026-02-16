import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import resumeController from '../controllers/resume.controller';
import { upload } from '../middleware/upload.middleware';
import Joi from 'joi';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All resume routes require authentication
router.use(authenticate);

// POST /api/resumes - Upload resume
router.post(
    '/',
    upload.single('resume'),
    resumeController.uploadResume
);

// GET /api/resumes - Get all resumes
router.get('/', resumeController.getResumes);

// GET /api/resumes/:id - Get single resume
router.get('/:id', resumeController.getResumeById);

// PATCH /api/resumes/:id - Update resume
router.patch(
    '/:id',
    validate(
        Joi.object({
            label: Joi.string().max(200).optional(),
            isDefault: Joi.boolean().optional(),
        })
    ),
    resumeController.updateResume
);

// DELETE /api/resumes/:id - Delete resume
router.delete('/:id', resumeController.deleteResume);

export default router;
