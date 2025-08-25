/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Controllers
 */
import { userController } from '@/controllers/user.controller';

/**
 * Middlewares
 */
import { authenticate } from '@/middlewares/auth.middleware';

const userRouter = Router();

userRouter.get('/me', authenticate, userController.getMe);

export default userRouter;
