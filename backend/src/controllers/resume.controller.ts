import { Request, Response, NextFunction } from 'express';
import resumeService from '../services/resume.service';

export class ResumeController {
    async uploadResume(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const file = req.file;
            const { label } = req.body;

            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded',
                });
            }

            const resume = await resumeService.uploadResume(userId, file, label);

            res.status(201).json({
                success: true,
                message: 'Resume uploaded successfully',
                data: resume,
            });
        } catch (error) {
            next(error);
        }
    }

    async getResumes(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await resumeService.getUserResumes(userId, page, limit);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async getResumeById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;

            const resume = await resumeService.getResumeById(id, userId);

            res.status(200).json({
                success: true,
                data: resume,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateResume(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;
            const { label, isDefault } = req.body;

            const resume = await resumeService.updateResume(id, userId, {
                label,
                isDefault,
            });

            res.status(200).json({
                success: true,
                message: 'Resume updated successfully',
                data: resume,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteResume(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;

            const result = await resumeService.deleteResume(id, userId);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ResumeController();
