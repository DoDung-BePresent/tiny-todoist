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

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], session: false }),
);
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    session: false,
  }),
  authController.githubCallback,
);

export default router;
