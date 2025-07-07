import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET;

export function generateToken(userId: string) {
    try {
        if (!secret) {
            return { error: 'secret not provided' };
        }

        const encoded = jwt.sign({ userId }, secret, { expiresIn: '10d' });
        return { encoded };

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

        if (!secret) {
            return {  error: 'secret not provided' };
        }

        const decoded = jwt.verify(token, secret);
        if (typeof decoded === 'string') {
            return { error: 'invalid token payload' };
        }
        return { decoded };

    } catch (error) {
        console.error('Error while verifying token', error);
        return { error: 'Failed to verify token' };
    }
}
