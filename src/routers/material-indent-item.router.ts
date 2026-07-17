import { Router } from "express";
import { MaterialIndentItemController } from "../controllers/material-indent-item.controller.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";

const router = Router();
const materialIndentItemController = new MaterialIndentItemController();

router.get(
  "/",
  authenticate,
  authorize("MATERIAL_INDENT_ITEM", "READ"),
  asyncWrapper(materialIndentItemController.getAllMaterialIndentItems),
);
router.get(
  "/:id",
  authenticate,
  authorize("MATERIAL_INDENT_ITEM", "READ"),
  asyncWrapper(materialIndentItemController.getMaterialIndentItemById),
);
router.post(
  "/",
  authenticate,
  authorize("MATERIAL_INDENT_ITEM", "CREATE"),
  asyncWrapper(materialIndentItemController.createMaterialIndentItem),
);
router.put(
  "/:id",
  authenticate,
  authorize("MATERIAL_INDENT_ITEM", "UPDATE"),
  asyncWrapper(materialIndentItemController.updateMaterialIndentItem),
);
router.delete(
  "/:id",
  authenticate,
  authorize("MATERIAL_INDENT_ITEM", "DELETE"),
  asyncWrapper(materialIndentItemController.deleteMaterialIndentItem),
);

export { router as materialIndentItemRouter };
