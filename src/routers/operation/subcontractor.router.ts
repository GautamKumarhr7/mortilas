import { Router } from 'express';
import { SubcontractorController } from '../../controllers/operation/subcontractor.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/permission.middleware.js';

const router = Router();
const subcontractorController = new SubcontractorController();

router.get(
  '/',
  authenticate,
  asyncWrapper(subcontractorController.getAllSubcontractors),
);
router.get(
  '/:id',
  authenticate,
  asyncWrapper(subcontractorController.getSubcontractorById),
);
router.post(
  '/',
  authenticate,
  asyncWrapper(subcontractorController.createSubcontractor),
);
router.put(
  '/:id',
  authenticate,
  asyncWrapper(subcontractorController.updateSubcontractor),
);
router.delete(
  '/:id',authenticate,
  asyncWrapper(subcontractorController.deleteSubcontractor),
);

export { router as subcontractorRouter };
