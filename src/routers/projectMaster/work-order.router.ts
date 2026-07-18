import { Router } from 'express';
import { WorkOrderController } from '../../controllers/projectMaster/work-order.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/permission.middleware.js';

const router = Router();
const workOrderController = new WorkOrderController();

router.get(
  '/',
  authenticate,
  asyncWrapper(workOrderController.getAllWorkOrders),
);
router.get(
  '/:id',
  authenticate,
  asyncWrapper(workOrderController.getWorkOrderById),
);
router.post(
  '/',
  authenticate,
  asyncWrapper(workOrderController.createWorkOrder),
);
router.put(
  '/:id',
  authenticate,
  asyncWrapper(workOrderController.updateWorkOrder),
);
router.delete(
  '/:id',
  authenticate,
  asyncWrapper(workOrderController.deleteWorkOrder),
);

export { router as workOrderRouter };
