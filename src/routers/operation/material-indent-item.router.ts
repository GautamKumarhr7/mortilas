import { Router } from 'express';
import { MaterialIndentItemController } from '../../controllers/operation/material-indent-item.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/permission.middleware.js';

const router = Router();
const materialIndentItemController = new MaterialIndentItemController();

router.get(
  '/',
  authenticate,
  asyncWrapper(materialIndentItemController.getAllMaterialIndentItems),
);
router.get(
  '/:id',
  authenticate,
  asyncWrapper(materialIndentItemController.getMaterialIndentItemById),
);
router.post(
  '/',
  authenticate,
  asyncWrapper(materialIndentItemController.createMaterialIndentItem),
);
router.put(
  '/:id',
  authenticate,
  asyncWrapper(materialIndentItemController.updateMaterialIndentItem),
);
router.delete(
  '/:id',
  asyncWrapper(materialIndentItemController.deleteMaterialIndentItem),
);

export { router as materialIndentItemRouter };
