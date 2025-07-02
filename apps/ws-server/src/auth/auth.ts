import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

const secret = process.env.JWT_SECRET;

export function authUser(token: string): string | null {
  try {
    if (!secret) {
      return null;
    }

    const decoded = jwt.verify(token, secret);

    if (!decoded || typeof (decoded) === 'string' || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch (error) {
    console.log(error);
    return null;
  }
}
