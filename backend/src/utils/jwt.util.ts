import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config/env';

export interface JWTPayload {
    userId: string;
    email: string;
}

export const generateAccessToken = (payload: JWTPayload): string => {
    const options: SignOptions = {
        expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, config.jwt.secret, options);
};

export const generateRefreshToken = (payload: JWTPayload): string => {
    const options: SignOptions = {
        expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, config.jwt.secret, options);
};

export const verifyToken = (token: string): JWTPayload => {
    try {
        const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const decodeToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.decode(token) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};
