/**
 * Node modules
 */
import { authController } from '@/controllers/auth.controller';
import { Router } from 'express';

const router = Router();

router.use('/login', authController.login);
router.use('/register', authController.register);
router.use('/github', () => {});
router.use('/github/callback', () => {});

export default router;
