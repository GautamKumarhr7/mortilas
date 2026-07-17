import { Router } from "express";
import { VendorRateContractController } from "../controllers/vendor-rate-contract.controller.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";

const router = Router();
const vendorRateContractController = new VendorRateContractController();

router.get(
  "/",
  authenticate,
  authorize("VENDOR_RATE_CONTRACT", "READ"),
  asyncWrapper(vendorRateContractController.getAllVendorRateContracts),
);
router.get(
  "/:id",
  authenticate,
  authorize("VENDOR_RATE_CONTRACT", "READ"),
  asyncWrapper(vendorRateContractController.getVendorRateContractById),
);
router.post(
  "/",
  authenticate,
  authorize("VENDOR_RATE_CONTRACT", "CREATE"),
  asyncWrapper(vendorRateContractController.createVendorRateContract),
);
router.put(
  "/:id",
  authenticate,
  authorize("VENDOR_RATE_CONTRACT", "UPDATE"),
  asyncWrapper(vendorRateContractController.updateVendorRateContract),
);
router.delete(
  "/:id",
  authenticate,
  authorize("VENDOR_RATE_CONTRACT", "DELETE"),
  asyncWrapper(vendorRateContractController.deleteVendorRateContract),
);

export { router as vendorRateContractRouter };
