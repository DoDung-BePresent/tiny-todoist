/**
 * Constants
 */
import { STATUS_CODE } from '@/constants/error.constant';

/**
 * Middlewares
 */
import { asyncHandler } from '@/middlewares/error.middleware';

/**
 * Services
 */
import { taskService } from '@/services/task.service';

export const taskController = {
  createTask: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;

    const task = await taskService.createTask(userId, req.body);

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
  getTaskStats: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const stats = await taskService.getTaskStats(userId);
    res.status(STATUS_CODE.OK).json({
      message: 'Task stats fetched successfully',
      data: stats,
    });
  }),
  getTask: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const { id: taskId } = req.params;

    const task = await taskService.getTaskById(taskId, userId);

    res.status(STATUS_CODE.OK).json({
      message: 'Task fetched successfully',
      data: { task },
    });
  }),
  updateTask: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const { id: taskId } = req.params;

    const updatedTask = await taskService.updateTask(taskId, userId, req.body);

    res.status(STATUS_CODE.OK).json({
      message: 'Task updated successfully',
      data: { updatedTask },
    });
  }),
  deleteTask: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const { id: taskId } = req.params;

    await taskService.deleteTask(taskId, userId);

    res.status(STATUS_CODE.NO_CONTENT).send();
  }),
};
