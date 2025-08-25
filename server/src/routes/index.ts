/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Routes
 */
import userRoutes from '@/routes/user.route';
import taskRouter from '@/routes/task.route';
import authRouter from '@/routes/auth.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRoutes);
router.use('/tasks', taskRouter);

export default router;
