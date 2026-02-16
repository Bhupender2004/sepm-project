import User from './User.model';
import Resume from './Resume.model';
import JobDescription from './JobDescription.model';
import Analysis from './Analysis.model';
import Job from './Job.model';
import SavedJob from './SavedJob.model';

// Define associations
User.hasMany(Resume, { foreignKey: 'userId', as: 'resumes' });
Resume.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(JobDescription, { foreignKey: 'userId', as: 'jobDescriptions' });
JobDescription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Analysis, { foreignKey: 'userId', as: 'analyses' });
Analysis.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Resume.hasMany(Analysis, { foreignKey: 'resumeId', as: 'analyses' });
Analysis.belongsTo(Resume, { foreignKey: 'resumeId', as: 'resume' });

JobDescription.hasMany(Analysis, { foreignKey: 'jobDescriptionId', as: 'analyses' });
Analysis.belongsTo(JobDescription, { foreignKey: 'jobDescriptionId', as: 'jobDescription' });

User.hasMany(SavedJob, { foreignKey: 'userId', as: 'savedJobs' });
SavedJob.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Job.hasMany(SavedJob, { foreignKey: 'jobId', as: 'savedBy' });
SavedJob.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

export { User, Resume, JobDescription, Analysis, Job, SavedJob };
