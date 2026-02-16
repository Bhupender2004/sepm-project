import { Analysis, Resume, JobDescription } from '../models';
import aiService from './ai.service';
import { NotFoundError, ForbiddenError } from '../utils/errors.util';

export class AnalysisService {
    /**
     * Create a new analysis
     */
    async createAnalysis(
        userId: string,
        resumeId: string,
        jobDescriptionId: string
    ) {
        // Verify resume belongs to user
        const resume = await Resume.findByPk(resumeId);
        if (!resume || resume.userId !== userId) {
            throw new ForbiddenError('Invalid resume');
        }

        // Verify job description belongs to user
        const jobDescription = await JobDescription.findByPk(jobDescriptionId);
        if (!jobDescription || jobDescription.userId !== userId) {
            throw new ForbiddenError('Invalid job description');
        }

        // Create analysis record
        const analysis = await Analysis.create({
            userId,
            resumeId,
            jobDescriptionId,
            status: 'processing',
            overallScore: 0,
            categoryScores: {},
            matchedElements: {},
            missingElements: {},
            keywordSuggestions: [],
            atsScore: 0,
            recommendations: [],
            summary: '',
        });

        // Process analysis asynchronously
        this.processAnalysis(analysis.id, resume, jobDescription).catch((error) => {
            // Update analysis with error
            Analysis.update(
                {
                    status: 'failed',
                    errorMessage: error.message,
                },
                { where: { id: analysis.id } }
            );
        });

        return analysis;
    }

    /**
     * Process analysis with AI
     */
    private async processAnalysis(
        analysisId: string,
        resume: any,
        jobDescription: any
    ) {
        try {
            // Get AI analysis
            const aiAnalysis = await aiService.analyzeMatch(
                resume.parsedSections,
                jobDescription.parsedRequirements,
                resume.extractedText,
                jobDescription.fullText
            );

            // Update analysis with results
            await Analysis.update(
                {
                    status: 'completed',
                    overallScore: aiAnalysis.overallScore,
                    categoryScores: aiAnalysis.categoryScores,
                    matchedElements: aiAnalysis.matchedElements,
                    missingElements: aiAnalysis.missingElements,
                    keywordSuggestions: aiAnalysis.keywordSuggestions,
                    atsScore: aiAnalysis.atsScore,
                    recommendations: aiAnalysis.recommendations,
                    summary: aiAnalysis.summary,
                    completedAt: new Date(),
                },
                { where: { id: analysisId } }
            );
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all analyses for a user
     */
    async getUserAnalyses(userId: string, page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;

        const { count, rows } = await Analysis.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: Resume,
                    as: 'resume',
                    attributes: ['id', 'label', 'fileName'],
                },
                {
                    model: JobDescription,
                    as: 'jobDescription',
                    attributes: ['id', 'jobTitle', 'company'],
                },
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        return {
            analyses: rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit,
            },
        };
    }

    /**
     * Get single analysis by ID
     */
    async getAnalysisById(analysisId: string, userId: string) {
        const analysis = await Analysis.findByPk(analysisId, {
            include: [
                {
                    model: Resume,
                    as: 'resume',
                    attributes: ['id', 'label', 'fileName', 'parsedSections'],
                },
                {
                    model: JobDescription,
                    as: 'jobDescription',
                    attributes: ['id', 'jobTitle', 'company', 'parsedRequirements'],
                },
            ],
        });

        if (!analysis) {
            throw new NotFoundError('Analysis not found');
        }

        if (analysis.userId !== userId) {
            throw new ForbiddenError('You do not have access to this analysis');
        }

        return analysis;
    }

    /**
     * Delete analysis
     */
    async deleteAnalysis(analysisId: string, userId: string) {
        const analysis = await Analysis.findByPk(analysisId);

        if (!analysis) {
            throw new NotFoundError('Analysis not found');
        }

        if (analysis.userId !== userId) {
            throw new ForbiddenError('You do not have access to this analysis');
        }

        await analysis.destroy();
        return { message: 'Analysis deleted successfully' };
    }
}

export default new AnalysisService();
