import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

interface UserAttributes {
    id: string;
    fullName: string;
    email: string;
    passwordHash: string;
    emailVerified: boolean;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: Date | null;
    passwordResetToken?: string | null;
    passwordResetExpires?: Date | null;
    profilePicture?: string | null;
    phone?: string | null;
    location?: string | null;
    linkedinUrl?: string | null;
    portfolioUrl?: string | null;
    preferences?: object | null;
    lastLoginAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public fullName!: string;
    public email!: string;
    public passwordHash!: string;
    public emailVerified!: boolean;
    public emailVerificationToken!: string | null;
    public emailVerificationExpires!: Date | null;
    public passwordResetToken!: string | null;
    public passwordResetExpires!: Date | null;
    public profilePicture!: string | null;
    public phone!: string | null;
    public location!: string | null;
    public linkedinUrl!: string | null;
    public portfolioUrl!: string | null;
    public preferences!: object | null;
    public lastLoginAt!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public deletedAt!: Date | null;

    // Method to compare password
    public async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.passwordHash);
    }

    // Method to hash password
    public static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        passwordHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        emailVerificationToken: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        emailVerificationExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        passwordResetToken: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        passwordResetExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        profilePicture: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        location: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        linkedinUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        portfolioUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        preferences: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                emailNotifications: true,
                jobAlerts: true,
                weeklyDigest: false,
                marketingEmails: false,
                preferredLocations: [],
                preferredJobTypes: [],
                industriesOfInterest: [],
            },
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        paranoid: true,
    }
);

export default User;
