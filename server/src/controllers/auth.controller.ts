/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Libs
 */
import { BadRequestError } from '@/lib/error';

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
import { generateTokens, setTokenCookie } from '@/lib/jwt';

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
};
