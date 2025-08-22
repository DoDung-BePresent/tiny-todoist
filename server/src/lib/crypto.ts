/**
 * Node modules
 */
import bcryptjs from 'bcryptjs';

/**
 * Custom modules
 */
import logger from '@/lib/logger';

/**
 * Hash password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashed = await bcryptjs.hash(password, 12);
    return hashed;
  } catch (error) {
    logger.error('Fail to hashed password', error);
    throw new Error('Password hashing failed');
  }
};
