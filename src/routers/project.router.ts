import { Router } from "express";
import { ProjectController } from "../controllers/project.controller.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";

const router = Router();
const projectController = new ProjectController();

router.get(
  "/",
  authenticate,
  authorize("PROJECT", "READ"),
  asyncWrapper(projectController.getAllProjects),
);
router.get(
  "/:id",
  authenticate,
  authorize("PROJECT", "READ"),
  asyncWrapper(projectController.getProjectById),
);
router.post(
  "/",
  authenticate,
  authorize("PROJECT", "CREATE"),
  asyncWrapper(projectController.createProject),
);
router.put(
  "/:id",
  authenticate,
  authorize("PROJECT", "UPDATE"),
  asyncWrapper(projectController.updateProject),
);
router.delete(
  "/:id",
  authenticate,
  authorize("PROJECT", "DELETE"),
  asyncWrapper(projectController.deleteProject),
);

export { router as projectRouter };
