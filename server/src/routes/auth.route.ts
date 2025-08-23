/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Controllers
 */
import { authController } from '@/controllers/auth.controller';
import passport from 'passport';

const router = Router();

router.use('/login', authController.login);
router.use('/register', authController.register);
router.use(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], session: false }),
);
router.use(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    session: false,
  }),
  authController.githubCallback,
);

export default router;
