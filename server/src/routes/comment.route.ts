/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middlewares
 */
import { upload } from '@/middlewares/upload.middleware';
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
  upload.single('file'),
  validate(commentValidation.createCommentSchema),
  commentController.createComment,
);

commentRouter.patch(
  '/:commentId',
  validate(commentValidation.updateCommentSchema),
  commentController.updateComment,
);

commentRouter.delete(
  '/:commentId',
  validate(commentValidation.deleteCommentSchema),
  commentController.deleteComment,
);

export default commentRouter;
