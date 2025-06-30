import { JWT_SECRET } from '@repo/server-common/config';
import jwt from 'jsonwebtoken';

export function generateToken(userId: string) {
    try {
        if (!JWT_SECRET || typeof JWT_SECRET !== 'string') {
            return { error: 'secret not provided' };
        }

        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
        return { token };

    } catch (error) {
        console.error('Error while generating token', error);
        return { error: 'Failed to generate token' };
    }
}

export function verifyToken(token: string) {
    try {
        if(! token){
            return { error: `token not provided` }
        }

        if (!JWT_SECRET || typeof JWT_SECRET !== 'string') {
            return {  error: 'secret not provided' };
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'string') {
            return { error: 'invalid token payload' };
        }
        return { decoded };

    } catch (error) {
        console.error('Error while verifying token', error);
        return { error: 'Failed to verify token' };
    }
}
