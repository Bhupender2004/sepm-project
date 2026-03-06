import { Request, Response, NextFunction } from 'express';
import savedJobService, { GUEST_USER_ID } from '../services/saved-job.service';

class SavedJobController {
    /**
     * POST /api/saved-jobs
     * Body: job data from external search result
     */
    async save(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId ?? GUEST_USER_ID;
            const result = await savedJobService.saveJob(userId, req.body);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            console.error('Job Save Error (Controller):', error);
            next(error);
        }
    }

    /**
     * GET /api/saved-jobs
     */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId ?? GUEST_USER_ID;
            const jobs = await savedJobService.getSavedJobs(userId);
            res.status(200).json({ success: true, data: jobs });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/saved-jobs/:id
     * Body: { applicationStatus?, notes?, reminderDate? }
     */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId ?? GUEST_USER_ID;
            const { id } = req.params;
            const record = await savedJobService.updateSavedJob(id, userId, req.body);
            res.status(200).json({ success: true, data: record });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/saved-jobs/:id
     */
    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId ?? GUEST_USER_ID;
            const { id } = req.params;
            const result = await savedJobService.unsaveJob(id, userId);
            res.status(200).json({ success: true, message: result.message });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/saved-jobs/check?externalJobId=...&sourcePlatform=...
     */
    async check(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId ?? GUEST_USER_ID;
            const { externalJobId, sourcePlatform } = req.query as { externalJobId: string; sourcePlatform: string };
            const savedJobId = await savedJobService.isJobSaved(userId, externalJobId, sourcePlatform);
            res.status(200).json({ success: true, isSaved: !!savedJobId, savedJobId });
        } catch (error) {
            next(error);
        }
    }
}

export default new SavedJobController();
