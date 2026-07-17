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
  authorize('SUBCONTRACTOR', 'READ'),
  asyncWrapper(subcontractorController.getAllSubcontractors),
);
router.get(
  '/:id',
  authenticate,
  authorize('SUBCONTRACTOR', 'READ'),
  asyncWrapper(subcontractorController.getSubcontractorById),
);
router.post(
  '/',
  authenticate,
  authorize('SUBCONTRACTOR', 'CREATE'),
  asyncWrapper(subcontractorController.createSubcontractor),
);
router.put(
  '/:id',
  authenticate,
  authorize('SUBCONTRACTOR', 'UPDATE'),
  asyncWrapper(subcontractorController.updateSubcontractor),
);
router.delete(
  '/:id',
  authenticate,
  authorize('SUBCONTRACTOR', 'DELETE'),
  asyncWrapper(subcontractorController.deleteSubcontractor),
);

export { router as subcontractorRouter };
