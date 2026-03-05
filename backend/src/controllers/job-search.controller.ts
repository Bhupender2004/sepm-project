import { Request, Response } from 'express';
import jobScraperService from '../services/job-scraper.service';
import logger from '../utils/logger.util';

class JobSearchController {
    /**
     * GET /api/jobs/search?keywords=react,typescript&location=remote&limit=20
     */
    async searchJobs(req: Request, res: Response) {
        try {
            const keywordsParam = (req.query.keywords as string) || '';
            const location = (req.query.location as string) || '';
            const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

            // Parse comma-separated or space-separated keywords
            const keywords = keywordsParam
                .split(/[,\s]+/)
                .map(k => k.trim())
                .filter(k => k.length > 0);

            if (keywords.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide at least one keyword (e.g., ?keywords=react,typescript)',
                });
            }

            logger.info(`Job search request — keywords: [${keywords.join(', ')}], location: ${location}`);
            const jobs = await jobScraperService.scrapeJobs(keywords, location, limit);

            return res.status(200).json({
                success: true,
                count: jobs.length,
                keywords,
                data: jobs,
            });
        } catch (error: any) {
            logger.error('Job search error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch jobs. Please try again.',
            });
        }
    }

    /**
     * POST /api/jobs/search-from-resume
     * Body: { skills: string[], location?: string, limit?: number }
     */
    async searchJobsFromResume(req: Request, res: Response) {
        try {
            const { skills, location, limit: limitParam } = req.body;

            if (!skills || !Array.isArray(skills) || skills.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a non-empty "skills" array in the request body.',
                });
            }

            const limit = Math.min(parseInt(limitParam) || 20, 50);
            const cleanedSkills = skills.map((s: string) => String(s).trim()).filter(Boolean);

            logger.info(`Resume-based job search — skills: [${cleanedSkills.join(', ')}], location: ${location || 'any'}`);
            const jobs = await jobScraperService.scrapeJobs(cleanedSkills, location || '', limit);

            return res.status(200).json({
                success: true,
                count: jobs.length,
                skills: cleanedSkills,
                data: jobs,
            });
        } catch (error: any) {
            logger.error('Resume job search error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch jobs from resume skills. Please try again.',
            });
        }
    }
}

export default new JobSearchController();
