import { User } from '@prisma/client';
import prisma from '@/lib/prisma';
import { UnauthorizedError } from '@/lib/error';
import {
  clearTokenCookie,
  generateTokens,
  setTokenCookie,
  verifyToken,
} from '@/lib/jwt';
import { authService } from '@/services/auth.service';
import { STATUS_CODE } from '@/constants/error.constant';
import { loginSchema, registerSchema } from '@/validations/auth.validation';
import config from '@/config/env.config';
import { asyncHandler } from '@/middlewares/error.middleware';

export const authController = {
  register: asyncHandler(async (req, res, next) => {
    const { email, password } = registerSchema.parse(req.body);

    const user = await authService.register({ email, password });

    const { accessToken, refreshToken } = generateTokens(user.id);

    setTokenCookie(
      res,
      'refreshToken',
      refreshToken,
      '/api/v1/auth/refresh-token',
    );

    res.status(STATUS_CODE.CREATED).json({
      message: 'User created successfully',
      data: {
        user,
        accessToken,
      },
    });
  }),
  login: asyncHandler(async (req, res, next) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await authService.login({ email, password });

    const { accessToken, refreshToken } = generateTokens(user.id);

    setTokenCookie(
      res,
      'refreshToken',
      refreshToken,
      '/api/v1/auth/refresh-token',
    );

    res.status(STATUS_CODE.OK).json({
      message: 'Login successfully',
      data: {
        user,
        accessToken,
      },
    });
  }),
  logout: asyncHandler(async (req, res, next) => {
    clearTokenCookie(res, 'refreshToken', '/api/v1/auth/refresh-token');
    res.status(STATUS_CODE.OK).json({
      message: 'Logged out successfully',
    });
  }),
  githubCallback: asyncHandler(async (req, res, next) => {
    const user = req.user as User;

    const { accessToken, refreshToken } = generateTokens(user.id);

    setTokenCookie(
      res,
      'refreshToken',
      refreshToken,
      '/api/v1/auth/refresh-token',
    );

    res.redirect(`${config.CLIENT_URL}/auth/callback?token=${accessToken}`);
  }),
  refreshToken: asyncHandler(async (req, res, next) => {
    const refreshTokenFromCookie = req.cookies.refreshToken;
    if (!refreshTokenFromCookie) {
      throw new UnauthorizedError('Refresh token not found');
    }

    const decoded = verifyToken(
      refreshTokenFromCookie,
      config.JWT_REFRESH_SECRET,
    );

    const userExists = await prisma.user.count({
      where: { id: decoded.userId },
    });

    if (!userExists) {
      throw new UnauthorizedError('User for this token no longer exists');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.userId,
    );

    setTokenCookie(
      res,
      'refreshToken',
      newRefreshToken,
      '/api/v1/auth/refresh-token',
    );

    res.status(STATUS_CODE.OK).json({
      message: 'Token refreshed successfully',
      data: {
        accessToken,
      },
    });
  }),
};
