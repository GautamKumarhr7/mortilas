import { Router } from 'express';
import { VendorController } from '../controllers/vendor.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();
const vendorController = new VendorController();

router.get(
  '/',
  authenticate,
  authorize('VM', 'READ'),
  asyncWrapper(vendorController.getAllVendors),
);
router.get(
  '/:id',
  authenticate,
  authorize('VM', 'READ'),
  asyncWrapper(vendorController.getVendorById),
);
router.post(
  '/',
  authenticate,
  authorize('VM', 'CREATE'),
  asyncWrapper(vendorController.createVendor),
);
router.put(
  '/:id',
  authenticate,
  authorize('VM', 'UPDATE'),
  asyncWrapper(vendorController.updateVendor),
);
router.delete(
  '/:id',
  authenticate,
  authorize('VM', 'DELETE'),
  asyncWrapper(vendorController.deleteVendor),
);

// Rate Contracts
router.get(
  '/:id/rate-contracts',
  authenticate,
  authorize('VM', 'READ'),
  asyncWrapper(vendorController.getRateContracts),
);
router.post(
  '/:id/rate-contracts',
  authenticate,
  authorize('VM', 'CREATE'),
  asyncWrapper(vendorController.createRateContract),
);
router.put(
  '/:id/rate-contracts/:contractId',
  authenticate,
  authorize('VM', 'UPDATE'),
  asyncWrapper(vendorController.updateRateContract),
);

export { router as vendorRouter };
