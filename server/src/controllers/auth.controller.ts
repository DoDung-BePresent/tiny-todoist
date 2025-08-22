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
import { registerSchema } from '@/validations/auth.validation';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = registerSchema.parse(req.body);

      const user = await authService.register({ email, password });

      res.status(STATUS_CODE.CREATED).json({
        message: 'User created successfully',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  async login() {
    // TODO:
  },
};
