/**
 * Node modules
 */
import ms from 'ms';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

/**
 * Config
 */
import config from '@/config/env.config';

/**
 * Libs
 */
import logger from '@/lib/logger';

/**
 * Generate tokens
 */
export const generateTokens = (userId: string) => {
  try {
    const accessToken = jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
      expiresIn: config.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
      expiresIn: config.REFRESH_TOKEN_EXPIRY,
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    logger.error('Error generating tokens:', error);
    throw new Error('Failed to generate authentication tokens');
  }
};

/**
 * Set cookie
 */
export const setTokenCookie = (
  res: Response,
  cookieName: 'accessToken' | 'refreshToken',
  token: string,
  path?: string,
) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:
      cookieName === 'accessToken'
        ? ms(config.ACCESS_TOKEN_EXPIRY)
        : ms(config.REFRESH_TOKEN_EXPIRY),
    path: path ?? '/',
  });

  return res;
};

/**
 * Clear cookie
 */
export const clearTokenCookie = (
  res: Response,
  cookieName: 'accessToken' | 'refreshToken',
) => {
  res.clearCookie(cookieName);
};
