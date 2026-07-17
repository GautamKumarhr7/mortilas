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
  authorize('VENDOR', 'READ'),
  asyncWrapper(vendorController.getAllVendors),
);
router.get(
  '/:id',
  authenticate,
  authorize('VENDOR', 'READ'),
  asyncWrapper(vendorController.getVendorById),
);
router.post(
  '/',
  authenticate,
  authorize('VENDOR', 'CREATE'),
  asyncWrapper(vendorController.createVendor),
);
router.put(
  '/:id',
  authenticate,
  authorize('VENDOR', 'UPDATE'),
  asyncWrapper(vendorController.updateVendor),
);
router.delete(
  '/:id',
  authenticate,
  authorize('VENDOR', 'DELETE'),
  asyncWrapper(vendorController.deleteVendor),
);

export { router as vendorRouter };
