import { Router } from 'express';
import { taskController } from '@/controllers/task.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const taskRouter = Router();

taskRouter.use(authenticate);

taskRouter.get('/', taskController.getTasks);
taskRouter.get('/:id', taskController.getTask);
taskRouter.post('/', taskController.createTask);
taskRouter.patch('/:id', taskController.updateTask);
taskRouter.delete('/:id', taskController.deleteTask);

export default taskRouter;
