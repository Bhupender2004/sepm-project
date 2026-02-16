import { Resume } from '../models';
import documentParser from './document-parser.service';
import aiService from './ai.service';
import * as fs from 'fs/promises';
import { NotFoundError, ForbiddenError } from '../utils/errors.util';

export class ResumeService {
    /**
     * Upload and process a resume
     */
    async uploadResume(
        userId: string,
        file: Express.Multer.File,
        label?: string
    ) {
        // Extract text from document
        const extractedText = await documentParser.parseDocument(file.path);
        const cleanedText = documentParser.cleanText(extractedText);

        // Parse resume with AI
        const parsedSections = await aiService.parseResume(cleanedText);

        // Create resume record
        const resume = await Resume.create({
            userId,
            label: label || file.originalname,
            fileName: file.originalname,
            filePath: file.path,
            extractedText: cleanedText,
            parsedSections,
            fileSize: file.size,
            fileType: file.mimetype,
            isDefault: false,
        });

        // Check if this is the first resume, make it default
        const resumeCount = await Resume.count({ where: { userId } });
        if (resumeCount === 1) {
            resume.isDefault = true;
            await resume.save();
        }

        return resume;
    }

    /**
     * Get all resumes for a user
     */
    async getUserResumes(userId: string, page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;

        const { count, rows } = await Resume.findAndCountAll({
            where: { userId },
            limit,
            offset,
            order: [['uploadedAt', 'DESC']],
            attributes: {
                exclude: ['extractedText', 'parsedSections'],
            },
        });

        return {
            resumes: rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit,
            },
        };
    }

    /**
     * Get single resume by ID
     */
    async getResumeById(resumeId: string, userId: string) {
        const resume = await Resume.findByPk(resumeId);

        if (!resume) {
            throw new NotFoundError('Resume not found');
        }

        if (resume.userId !== userId) {
            throw new ForbiddenError('You do not have access to this resume');
        }

        return resume;
    }

    /**
     * Update resume label
     */
    async updateResume(resumeId: string, userId: string, data: { label?: string; isDefault?: boolean }) {
        const resume = await this.getResumeById(resumeId, userId);

        if (data.label) {
            resume.label = data.label;
        }

        if (data.isDefault !== undefined && data.isDefault) {
            // Set all other resumes to non-default
            await Resume.update(
                { isDefault: false },
                { where: { userId } }
            );
            resume.isDefault = true;
        }

        await resume.save();
        return resume;
    }

    /**
     * Delete resume
     */
    async deleteResume(resumeId: string, userId: string) {
        const resume = await this.getResumeById(resumeId, userId);

        // Delete file from filesystem
        try {
            await fs.unlink(resume.filePath);
        } catch (error) {
            // File might already be deleted, continue
        }

        await resume.destroy();

        // If this was the default resume, set another as default
        if (resume.isDefault) {
            const nextResume = await Resume.findOne({
                where: { userId },
                order: [['uploadedAt', 'DESC']],
            });

            if (nextResume) {
                nextResume.isDefault = true;
                await nextResume.save();
            }
        }

        return { message: 'Resume deleted successfully' };
    }
}

export default new ResumeService();
