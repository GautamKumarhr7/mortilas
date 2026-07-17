import { Router } from "express";
import { VendorCategoryController } from "../controllers/vendor-category.controller.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";

const router = Router();
const vendorCategoryController = new VendorCategoryController();

router.get(
  "/",
  authenticate,
  authorize("VENDOR_CATEGORY", "READ"),
  asyncWrapper(vendorCategoryController.getAllVendorCategories),
);
router.get(
  "/:id",
  authenticate,
  authorize("VENDOR_CATEGORY", "READ"),
  asyncWrapper(vendorCategoryController.getVendorCategoryById),
);
router.post(
  "/",
  authenticate,
  authorize("VENDOR_CATEGORY", "CREATE"),
  asyncWrapper(vendorCategoryController.createVendorCategory),
);
router.put(
  "/:id",
  authenticate,
  authorize("VENDOR_CATEGORY", "UPDATE"),
  asyncWrapper(vendorCategoryController.updateVendorCategory),
);
router.delete(
  "/:id",
  authenticate,
  authorize("VENDOR_CATEGORY", "DELETE"),
  asyncWrapper(vendorCategoryController.deleteVendorCategory),
);

export { router as vendorCategoryRouter };
