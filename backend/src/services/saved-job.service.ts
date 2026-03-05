import { SavedJob, Job } from '../models';
import { NotFoundError, ConflictError } from '../utils/errors.util';

// In no-auth mode: all guests share this ID.
// When auth is added, replace with req.user.userId.
export const GUEST_USER_ID = '00000000-0000-0000-0000-000000000001';

export interface SaveJobData {
    externalJobId: string;
    sourcePlatform: string;
    jobTitle: string;
    company: string;
    location: string;
    jobType?: string;
    experienceLevel?: string;
    description?: string;
    postingUrl: string;
    salaryRange?: string;
    postedDate?: string; // ISO string from external API
    tags?: string[];
}

export class SavedJobService {
    /**
     * Save a job for a user — creates the Job record if it doesn't exist yet.
     */
    async saveJob(userId: string, jobData: SaveJobData) {
        const [job] = await Job.findOrCreate({
            where: {
                externalJobId: jobData.externalJobId,
                sourcePlatform: jobData.sourcePlatform,
            },
            defaults: {
                externalJobId: jobData.externalJobId,
                sourcePlatform: jobData.sourcePlatform,
                jobTitle: jobData.jobTitle,
                company: jobData.company,
                location: jobData.location || 'Remote',
                jobType: jobData.jobType || 'full-time',
                experienceLevel: jobData.experienceLevel || 'mid',
                description: jobData.description || '',
                postingUrl: jobData.postingUrl,
                postedDate: jobData.postedDate ? new Date(jobData.postedDate) : new Date(),
                salaryRange: jobData.salaryRange || null,
            },
        });

        // Check if already saved
        const existing = await SavedJob.findOne({ where: { userId, jobId: job.id } });
        if (existing) {
            throw new ConflictError('Job already saved');
        }

        const saved = await SavedJob.create({
            userId,
            jobId: job.id,
            applicationStatus: 'saved',
        });

        return { savedJobId: saved.id, jobId: job.id };
    }

    /**
     * Get all saved jobs for a user with full job details.
     */
    async getSavedJobs(userId: string) {
        return SavedJob.findAll({
            where: { userId },
            include: [{ model: Job, as: 'job' }],
            order: [['savedAt', 'DESC']],
        });
    }

    /**
     * Update application status or notes.
     */
    async updateSavedJob(
        savedJobId: string,
        userId: string,
        updates: {
            applicationStatus?: 'saved' | 'applied' | 'interested' | 'not_interested';
            notes?: string;
            reminderDate?: Date;
        }
    ) {
        const record = await SavedJob.findOne({ where: { id: savedJobId, userId } });
        if (!record) throw new NotFoundError('Saved job not found');

        if (updates.applicationStatus) record.applicationStatus = updates.applicationStatus;
        if (updates.notes !== undefined) record.notes = updates.notes;
        if (updates.reminderDate !== undefined) record.reminderDate = updates.reminderDate;
        await record.save();

        return record;
    }

    /**
     * Remove a saved job.
     */
    async unsaveJob(savedJobId: string, userId: string) {
        const record = await SavedJob.findOne({ where: { id: savedJobId, userId } });
        if (!record) throw new NotFoundError('Saved job not found');
        await record.destroy();
        return { message: 'Job removed from saved list' };
    }

    /**
     * Check if an external job is already saved. Returns savedJobId or null.
     */
    async isJobSaved(userId: string, externalJobId: string, sourcePlatform: string): Promise<string | null> {
        const job = await Job.findOne({ where: { externalJobId, sourcePlatform } });
        if (!job) return null;
        const saved = await SavedJob.findOne({ where: { userId, jobId: job.id } });
        return saved ? saved.id : null;
    }
}

export default new SavedJobService();
