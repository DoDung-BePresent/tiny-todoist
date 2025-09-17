/**
 * Node modules
 */
import passport from 'passport';
import { Router } from 'express';

/**
 * Controllers
 */
import { authController } from '@/controllers/auth.controller';

/**
 * Middlewares
 */
import { authenticate } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { authValidation } from '@/validations/auth.validation';

const authRouter = Router();

authRouter.post('/login', validate(authValidation.login), authController.login);
authRouter.post(
  '/register',
  validate(authValidation.register),
  authController.register,
);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.post('/logout', authenticate, authController.logout);
authRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], session: false }),
);
authRouter.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    session: false,
  }),
  authController.githubCallback,
);

export default authRouter;
