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
import { projectService } from '@/services/project.service';

export const projectController = {
  createProject: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const project = await projectService.createProject(userId, req.body);

    res.status(STATUS_CODE.CREATED).json({
      message: 'Project created successfully',
      data: {
        project,
      },
    });
  }),
  getProjects: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const projects = await projectService.getProjectsByUser(userId);

    res.status(STATUS_CODE.OK).json({
      message: 'Projects fetched successfully',
      data: { projects },
    });
  }),
  getProject: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const { id: projectId } = req.params;

    const project = await projectService.getProjectById(projectId, userId);

    res.status(STATUS_CODE.OK).json({
      message: 'Project fetched successfully',
      data: { project },
    });
  }),
  updateProject: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const { id: projectId } = req.params;

    const project = await projectService.updateProject(
      projectId,
      userId,
      req.body,
    );

    res.status(STATUS_CODE.OK).json({
      message: 'Project updated successfully',
      data: { project },
    });
  }),
  deleteProject: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const { id: projectId } = req.params;

    await projectService.deleteProject(projectId, userId);
    res.status(STATUS_CODE.NO_CONTENT).send();
  }),
};
