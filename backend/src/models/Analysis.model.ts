import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AnalysisAttributes {
    id: string;
    userId: string;
    resumeId: string;
    jobDescriptionId: string;
    status: 'processing' | 'completed' | 'failed';
    overallScore: number;
    categoryScores: object;
    matchedElements: object;
    missingElements: object;
    keywordSuggestions: object[];
    atsScore: number;
    recommendations: string[];
    summary: string;
    errorMessage?: string | null;
    completedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface AnalysisCreationAttributes extends Optional<AnalysisAttributes, 'id'> { }

class Analysis extends Model<AnalysisAttributes, AnalysisCreationAttributes>
    implements AnalysisAttributes {
    public id!: string;
    public userId!: string;
    public resumeId!: string;
    public jobDescriptionId!: string;
    public status!: 'processing' | 'completed' | 'failed';
    public overallScore!: number;
    public categoryScores!: object;
    public matchedElements!: object;
    public missingElements!: object;
    public keywordSuggestions!: object[];
    public atsScore!: number;
    public recommendations!: string[];
    public summary!: string;
    public errorMessage!: string | null;
    public completedAt!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Analysis.init(
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
        resumeId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'resumes',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        jobDescriptionId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'job_descriptions',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'processing',
            allowNull: false,
            validate: {
                isIn: [['processing', 'completed', 'failed']],
            },
        },
        overallScore: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 100,
            },
        },
        categoryScores: {
            type: DataTypes.JSON,
            defaultValue: {
                technicalSkills: 0,
                softSkills: 0,
                experience: 0,
                education: 0,
                keywords: 0,
            },
        },
        matchedElements: {
            type: DataTypes.JSON,
            defaultValue: {
                skills: [],
                experience: [],
                education: [],
                keywords: [],
            },
        },
        missingElements: {
            type: DataTypes.JSON,
            defaultValue: {
                skills: [],
                experience: [],
                keywords: [],
            },
        },
        keywordSuggestions: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
        atsScore: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 100,
            },
        },
        recommendations: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
        summary: {
            type: DataTypes.TEXT,
            defaultValue: '',
        },
        errorMessage: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'analyses',
        timestamps: true,
    }
);

export default Analysis;
