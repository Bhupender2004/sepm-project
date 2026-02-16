import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SavedJobAttributes {
    id: string;
    userId: string;
    jobId: string;
    applicationStatus: 'saved' | 'applied' | 'interested' | 'not_interested';
    notes?: string | null;
    reminderDate?: Date | null;
    savedAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface SavedJobCreationAttributes extends Optional<SavedJobAttributes, 'id' | 'savedAt'> { }

class SavedJob extends Model<SavedJobAttributes, SavedJobCreationAttributes>
    implements SavedJobAttributes {
    public id!: string;
    public userId!: string;
    public jobId!: string;
    public applicationStatus!: 'saved' | 'applied' | 'interested' | 'not_interested';
    public notes!: string | null;
    public reminderDate!: Date | null;
    public savedAt!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

SavedJob.init(
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
        jobId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'jobs',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        applicationStatus: {
            type: DataTypes.ENUM('saved', 'applied', 'interested', 'not_interested'),
            defaultValue: 'saved',
            allowNull: false,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        reminderDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        savedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'saved_jobs',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'jobId'],
            },
        ],
    }
);

export default SavedJob;
