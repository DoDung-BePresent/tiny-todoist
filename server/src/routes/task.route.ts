import { Router } from 'express';
import { taskController } from '@/controllers/task.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { taskValidation } from '@/validations/task.validation';

const taskRouter = Router();

taskRouter.use(authenticate);

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
