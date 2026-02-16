import { JobDescription } from '../models';
import aiService from './ai.service';
import { NotFoundError, ForbiddenError } from '../utils/errors.util';

export class JobDescriptionService {
    /**
     * Create a job description
     */
    async createJobDescription(
        userId: string,
        jobTitle: string,
        company: string,
        fullText: string
    ) {
        // Parse JD with AI
        const parsedRequirements = await aiService.parseJobDescription(fullText);

        // Create JD record
        const jobDescription = await JobDescription.create({
            userId,
            jobTitle,
            company,
            fullText,
            parsedRequirements,
        });

        return jobDescription;
    }

    /**
     * Get all job descriptions for a user
     */
    async getUserJobDescriptions(userId: string, page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;

        const { count, rows } = await JobDescription.findAndCountAll({
            where: { userId },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            attributes: {
                exclude: ['fullText', 'parsedRequirements'],
            },
        });

        return {
            jobDescriptions: rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit,
            },
        };
    }

    /**
     * Get single job description by ID
     */
    async getJobDescriptionById(jdId: string, userId: string) {
        const jobDescription = await JobDescription.findByPk(jdId);

        if (!jobDescription) {
            throw new NotFoundError('Job description not found');
        }

        if (jobDescription.userId !== userId) {
            throw new ForbiddenError('You do not have access to this job description');
        }

        return jobDescription;
    }

    /**
     * Update job description
     */
    async updateJobDescription(
        jdId: string,
        userId: string,
        data: { jobTitle?: string; company?: string; fullText?: string }
    ) {
        const jobDescription = await this.getJobDescriptionById(jdId, userId);

        if (data.jobTitle) jobDescription.jobTitle = data.jobTitle;
        if (data.company) jobDescription.company = data.company;

        if (data.fullText) {
            jobDescription.fullText = data.fullText;
            // Re-parse with AI
            jobDescription.parsedRequirements = await aiService.parseJobDescription(data.fullText);
        }

        await jobDescription.save();
        return jobDescription;
    }

    /**
     * Delete job description
     */
    async deleteJobDescription(jdId: string, userId: string) {
        const jobDescription = await this.getJobDescriptionById(jdId, userId);
        await jobDescription.destroy();
        return { message: 'Job description deleted successfully' };
    }
}

export default new JobDescriptionService();
