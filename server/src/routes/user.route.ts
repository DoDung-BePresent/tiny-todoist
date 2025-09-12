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
import { upload } from '@/middlewares/upload.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { userValidation } from '@/validations/user.validation';

const userRouter = Router();

userRouter.use(authenticate);
userRouter.get('/me', userController.getMe);
userRouter.patch(
  '/me',
  upload.single('avatar'),
  validate(userValidation.updateProfileSchema),
  userController.updateProfile,
);
userRouter.patch(
  '/me/password',
  validate(userValidation.updatePasswordSchema),
  userController.updatePassword,
);

export default userRouter;
