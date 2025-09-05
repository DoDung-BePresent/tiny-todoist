/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middlewares
 */
import { validate } from '@/middlewares/validate.middleware';

/**
 * Validations
 */
import { commentValidation } from '@/validations/comment.validation';

/**
 * Controllers
 */
import { commentController } from '@/controllers/comment.controller';

const commentRouter = Router({ mergeParams: true });

commentRouter.get(
  '/',
  validate(commentValidation.getCommentsSchema),
  commentController.getComments,
);

commentRouter.post(
  '/',
  validate(commentValidation.createCommentSchema),
  commentController.createComment,
);

export default commentRouter;
