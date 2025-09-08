/**
 * Middlewares
 */
import { asyncHandler } from '@/middlewares/error.middleware';

/**
 * Constants
 */
import { STATUS_CODE } from '@/constants/error.constant';

/**
 * Services
 */
import { commentService } from '@/services/comment.service';

export const commentController = {
  getComments: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const { taskId } = req.params;

    const comments = await commentService.getCommentsByTask(taskId, userId);

    res.status(STATUS_CODE.OK).json({
      message: 'Comments fetched successfully',
      data: { comments },
    });
  }),
  createComment: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const { taskId } = req.params;
    const { content } = req.body;

    const file = req.file;

    const comment = await commentService.createComment(taskId, userId, {
      content,
      file,
    });

    res.status(STATUS_CODE.CREATED).json({
      message: 'Comment created successfully',
      data: { comment },
    });
  }),

  updateComment: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const { commentId } = req.params;

    const updatedComment = await commentService.updateComment(
      commentId,
      userId,
      req.body,
      req.file,
    );

    res.status(STATUS_CODE.OK).json({
      message: 'Comment updated successfully!',
      data: {
        comment: updatedComment,
      },
    });
  }),

  deleteComment: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const { commentId } = req.params;

    await commentService.deleteComment(commentId, userId);

    res.status(STATUS_CODE.NO_CONTENT).send();
  }),
};
