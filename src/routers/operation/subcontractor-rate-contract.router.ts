import { Router } from 'express';
import { SubcontractorRateContractController } from '../../controllers/operation/subcontractor-rate-contract.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/permission.middleware.js';

const router = Router();
const subcontractorRateContractController = new SubcontractorRateContractController();

router.get(
  '/',
  authenticate,
  authorize('SUBCONTRACTOR_RATE_CONTRACT', 'READ'),
  asyncWrapper(subcontractorRateContractController.getAllSubcontractorRateContracts),
);
router.get(
  '/:id',
  authenticate,
  authorize('SUBCONTRACTOR_RATE_CONTRACT', 'READ'),
  asyncWrapper(subcontractorRateContractController.getSubcontractorRateContractById),
);
router.post(
  '/',
  authenticate,
  authorize('SUBCONTRACTOR_RATE_CONTRACT', 'CREATE'),
  asyncWrapper(subcontractorRateContractController.createSubcontractorRateContract),
);
router.put(
  '/:id',
  authenticate,
  authorize('SUBCONTRACTOR_RATE_CONTRACT', 'UPDATE'),
  asyncWrapper(subcontractorRateContractController.updateSubcontractorRateContract),
);
router.delete(
  '/:id',
  authenticate,
  authorize('SUBCONTRACTOR_RATE_CONTRACT', 'DELETE'),
  asyncWrapper(subcontractorRateContractController.deleteSubcontractorRateContract),
);

export { router as subcontractorRateContractRouter };
