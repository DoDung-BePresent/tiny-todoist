import { Router } from 'express';
import { taskController } from '@/controllers/task.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const taskRouter = Router();

taskRouter.use(authenticate);

taskRouter.get('/stats', taskController.getTaskStats);

taskRouter.get('/', taskController.getTasks);
taskRouter.post('/', taskController.createTask);

taskRouter.get('/:id', taskController.getTask);
taskRouter.patch('/:id', taskController.updateTask);
taskRouter.delete('/:id', taskController.deleteTask);

export default taskRouter;
