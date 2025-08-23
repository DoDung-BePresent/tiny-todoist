/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Routes
 */
import authRoutes from '@/routes/auth.route';
import userRoutes from '@/routes/user.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
