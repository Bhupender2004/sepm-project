import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface JobAttributes {
    id: string;
    externalJobId: string;
    sourcePlatform: string;
    jobTitle: string;
    company: string;
    location: string;
    jobType: string;
    experienceLevel: string;
    description: string;
    postingUrl: string;
    postedDate: Date;
    salaryRange?: string | null;
    companyLogo?: string | null;
    expirationDate?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface JobCreationAttributes extends Optional<JobAttributes, 'id'> { }

class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
    public id!: string;
    public externalJobId!: string;
    public sourcePlatform!: string;
    public jobTitle!: string;
    public company!: string;
    public location!: string;
    public jobType!: string;
    public experienceLevel!: string;
    public description!: string;
    public postingUrl!: string;
    public postedDate!: Date;
    public salaryRange!: string | null;
    public companyLogo!: string | null;
    public expirationDate!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Job.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        externalJobId: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        sourcePlatform: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        jobTitle: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        company: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        jobType: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        experienceLevel: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        postingUrl: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        postedDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        salaryRange: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        companyLogo: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        expirationDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'jobs',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['externalJobId', 'sourcePlatform'],
            },
        ],
    }
);

export default Job;
