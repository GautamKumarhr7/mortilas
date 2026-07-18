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
  asyncWrapper(subcontractorRateContractController.getAllSubcontractorRateContracts),
);
router.get(
  '/:id',
  authenticate,
  asyncWrapper(subcontractorRateContractController.getSubcontractorRateContractById),
);
router.post(
  '/',
  asyncWrapper(subcontractorRateContractController.createSubcontractorRateContract),
);
router.put(
  '/:id',
  asyncWrapper(subcontractorRateContractController.updateSubcontractorRateContract),
);
router.delete(
  '/:id',
  asyncWrapper(subcontractorRateContractController.deleteSubcontractorRateContract),
);

export { router as subcontractorRateContractRouter };
