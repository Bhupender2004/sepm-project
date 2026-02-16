import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface JobDescriptionAttributes {
    id: string;
    userId: string;
    jobTitle: string;
    company: string;
    fullText: string;
    parsedRequirements: object;
    createdAt?: Date;
    updatedAt?: Date;
}

interface JobDescriptionCreationAttributes extends Optional<JobDescriptionAttributes, 'id'> { }

class JobDescription extends Model<JobDescriptionAttributes, JobDescriptionCreationAttributes>
    implements JobDescriptionAttributes {
    public id!: string;
    public userId!: string;
    public jobTitle!: string;
    public company!: string;
    public fullText!: string;
    public parsedRequirements!: object;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

JobDescription.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        jobTitle: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        company: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        fullText: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        parsedRequirements: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {
                requiredSkills: [],
                desiredSkills: [],
                experienceLevel: '',
                educationRequirements: [],
                responsibilities: [],
                keywords: [],
            },
        },
    },
    {
        sequelize,
        tableName: 'job_descriptions',
        timestamps: true,
    }
);

export default JobDescription;
