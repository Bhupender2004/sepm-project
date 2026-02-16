import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ResumeAttributes {
    id: string;
    userId: string;
    label: string;
    fileName: string;
    filePath: string;
    extractedText: string;
    parsedSections: object;
    fileSize: number;
    fileType: string;
    isDefault: boolean;
    uploadedAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ResumeCreationAttributes extends Optional<ResumeAttributes, 'id' | 'uploadedAt'> { }

class Resume extends Model<ResumeAttributes, ResumeCreationAttributes> implements ResumeAttributes {
    public id!: string;
    public userId!: string;
    public label!: string;
    public fileName!: string;
    public filePath!: string;
    public extractedText!: string;
    public parsedSections!: object;
    public fileSize!: number;
    public fileType!: string;
    public isDefault!: boolean;
    public uploadedAt!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Resume.init(
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
        label: {
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: 'My Resume',
        },
        fileName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        filePath: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        extractedText: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        parsedSections: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {
                contact: {},
                experience: [],
                education: [],
                skills: [],
                certifications: [],
            },
        },
        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fileType: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        uploadedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'resumes',
        timestamps: true,
    }
);

export default Resume;
