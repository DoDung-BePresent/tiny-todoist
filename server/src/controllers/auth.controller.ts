/**
 * Node modules
 */
import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

/**
 * Libs
 */
import { generateTokens, setTokenCookie } from '@/lib/jwt';

/**
 * Services
 */
import { authService } from '@/services/auth.service';

/**
 * Constants
 */
import { STATUS_CODE } from '@/constants/error.constant';

/**
 * Validations
 */
import { loginSchema, registerSchema } from '@/validations/auth.validation';

/**
 * Configs
 */
import config from '@/config/env.config';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = registerSchema.parse(req.body);

      const user = await authService.register({ email, password });

      const { accessToken, refreshToken } = generateTokens(user.id);

      setTokenCookie(res, 'refreshToken', refreshToken, '/refresh-token');

      res.status(STATUS_CODE.CREATED).json({
        message: 'User created successfully',
        data: {
          user,
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await authService.login({ email, password });

      const { accessToken, refreshToken } = generateTokens(user.id);

      setTokenCookie(res, 'refreshToken', refreshToken, '/refresh-token');

      res.status(STATUS_CODE.OK).json({
        message: 'Login successfully',
        data: {
          user,
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  async githubCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as User;

      const { accessToken, refreshToken } = generateTokens(user.id);

      setTokenCookie(res, 'refreshToken', refreshToken);

      res.redirect(`${config.CLIENT_URL}/auth/callback?token=${accessToken}`);
    } catch (error) {
      next(error);
    }
  },
};
