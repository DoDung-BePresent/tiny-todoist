import { projectController } from '@/controllers/project.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { projectValidation } from '@/validations/project.validation';
import { Router } from 'express';

const projectRouter = Router();

projectRouter.use(authenticate);

projectRouter.post(
  '/',
  validate(projectValidation.createProjectSchema),
  projectController.createProject,
);
projectRouter.get('/', projectController.getProjects);
projectRouter.get(
  '/:id',
  validate(projectValidation.projectIdSchema),
  projectController.getProject,
);
projectRouter.patch(
  '/:id',
  validate(projectValidation.updateProjectSchema),
  projectController.updateProject,
);
projectRouter.delete(
  '/:id',
  validate(projectValidation.projectIdSchema),
  projectController.deleteProject,
);

export default projectRouter;
