import { Request, Response, NextFunction } from 'express';
import analysisService from '../services/analysis.service';

export class AnalysisController {
    async createAnalysis(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { resumeId, jobDescriptionId } = req.body;

            const analysis = await analysisService.createAnalysis(
                userId,
                resumeId,
                jobDescriptionId
            );

            res.status(201).json({
                success: true,
                message: 'Analysis started',
                data: analysis,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAnalyses(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await analysisService.getUserAnalyses(userId, page, limit);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAnalysisById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;

            const analysis = await analysisService.getAnalysisById(id, userId);

            res.status(200).json({
                success: true,
                data: analysis,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAnalysis(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;

            const result = await analysisService.deleteAnalysis(id, userId);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AnalysisController();
