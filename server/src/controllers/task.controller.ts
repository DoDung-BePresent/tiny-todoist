import { taskValidation } from '@/validations/task.validation';
import { asyncHandler } from '@/middlewares/error.middleware';
import { taskService } from '@/services/task.service';
import { STATUS_CODE } from '@/constants/error.constant';

export const taskController = {
  createTask: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const validatedBody = taskValidation.createTaskSchema.parse(req.body);

    const task = await taskService.createTask(userId, validatedBody);

    res.status(STATUS_CODE.CREATED).json({
      message: 'Task created successfully',
      data: { task },
    });
  }),
  getTasks: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const filter = req.query.filter as string | undefined;

    const tasks = await taskService.getTasksByUser(userId, filter);

    res.status(STATUS_CODE.OK).json({
      message: 'Tasks fetched successfully',
      data: { tasks },
    });
  }),
  getTask: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const { id: taskId } = taskValidation.taskIdSchema.parse(req.params);

    const task = await taskService.getTaskById(taskId, userId);

    res.status(STATUS_CODE.OK).json({
      message: 'Task fetched successfully',
      data: { task },
    });
  }),
  updateTask: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const { id: taskId } = taskValidation.taskIdSchema.parse(req.params);
    const validatedBody = taskValidation.updateTaskSchema.parse(req.body);

    const updatedTask = await taskService.updateTask(
      taskId,
      userId,
      validatedBody,
    );

    res.status(STATUS_CODE.OK).json({
      message: 'Task updated successfully',
      data: { updatedTask },
    });
  }),
  deleteTask: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const { id: taskId } = taskValidation.taskIdSchema.parse(req.params);

    await taskService.deleteTask(taskId, userId);

    res.status(STATUS_CODE.NO_CONTENT).send();
  }),
};
