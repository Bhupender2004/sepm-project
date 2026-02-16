import { Request, Response, NextFunction } from 'express';
import jobDescriptionService from '../services/job-description.service';

export class JobDescriptionController {
    async createJobDescription(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { jobTitle, company, fullText } = req.body;

            const jobDescription = await jobDescriptionService.createJobDescription(
                userId,
                jobTitle,
                company,
                fullText
            );

            res.status(201).json({
                success: true,
                message: 'Job description created successfully',
                data: jobDescription,
            });
        } catch (error) {
            next(error);
        }
    }

    async getJobDescriptions(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await jobDescriptionService.getUserJobDescriptions(
                userId,
                page,
                limit
            );

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async getJobDescriptionById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;

            const jobDescription = await jobDescriptionService.getJobDescriptionById(
                id,
                userId
            );

            res.status(200).json({
                success: true,
                data: jobDescription,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateJobDescription(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;
            const { jobTitle, company, fullText } = req.body;

            const jobDescription = await jobDescriptionService.updateJobDescription(
                id,
                userId,
                { jobTitle, company, fullText }
            );

            res.status(200).json({
                success: true,
                message: 'Job description updated successfully',
                data: jobDescription,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteJobDescription(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;

            const result = await jobDescriptionService.deleteJobDescription(id, userId);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new JobDescriptionController();
