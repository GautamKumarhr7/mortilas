import { Router } from "express";
import { WorkOrderController } from "../controllers/work-order.controller.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";

const router = Router();
const workOrderController = new WorkOrderController();

router.get(
  "/",
  authenticate,
  authorize("WORK_ORDER", "READ"),
  asyncWrapper(workOrderController.getAllWorkOrders),
);
router.get(
  "/:id",
  authenticate,
  authorize("WORK_ORDER", "READ"),
  asyncWrapper(workOrderController.getWorkOrderById),
);
router.post(
  "/",
  authenticate,
  authorize("WORK_ORDER", "CREATE"),
  asyncWrapper(workOrderController.createWorkOrder),
);
router.put(
  "/:id",
  authenticate,
  authorize("WORK_ORDER", "UPDATE"),
  asyncWrapper(workOrderController.updateWorkOrder),
);
router.delete(
  "/:id",
  authenticate,
  authorize("WORK_ORDER", "DELETE"),
  asyncWrapper(workOrderController.deleteWorkOrder),
);

export { router as workOrderRouter };
