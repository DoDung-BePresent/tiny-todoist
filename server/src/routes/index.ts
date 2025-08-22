/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Routes
 */
import authRoutes from '@/routes/auth.route';

const router = Router();

router.use('/auth', authRoutes);

export default router;
