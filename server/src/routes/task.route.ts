/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middlewares
 */
import { authenticate } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';

/**
 * Controllers
 */
import { taskController } from '@/controllers/task.controller';

/**
 * Validations
 */
import { taskValidation } from '@/validations/task.validation';

/**
 * Routes
 */
import commentRouter from '@/routes/comment.route';

const taskRouter = Router();

taskRouter.use(authenticate);

taskRouter.use('/:taskId/comments', commentRouter);

taskRouter.get('/stats', taskController.getTaskStats);

taskRouter.post(
  '/',
  validate(taskValidation.createTaskSchema),
  taskController.createTask,
);
taskRouter.get('/', taskController.getTasks);

taskRouter.get(
  '/:id',
  validate(taskValidation.taskIdSchema),
  taskController.getTask,
);
taskRouter.patch(
  '/:id',
  validate(taskValidation.updateTaskSchema),
  taskController.updateTask,
);
taskRouter.delete(
  '/:id',
  validate(taskValidation.taskIdSchema),
  taskController.deleteTask,
);

export default taskRouter;
