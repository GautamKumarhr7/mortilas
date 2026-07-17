import { Router } from 'express';
import { PermissionController } from '../../controllers/authority/permission.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/permission.middleware.js';

const router = Router();
const permissionController = new PermissionController();

router.get(
  '/',
  authenticate,
  authorize('PERMISSION', 'READ'),
  asyncWrapper(permissionController.getAllPermissions),
);
router.get(
  '/:id',
  authenticate,
  authorize('PERMISSION', 'READ'),
  asyncWrapper(permissionController.getPermissionById),
);
router.post(
  '/',
  authenticate,
  authorize('PERMISSION', 'CREATE'),
  asyncWrapper(permissionController.createPermission),
);
router.put(
  '/:id',
  authenticate,
  authorize('PERMISSION', 'UPDATE'),
  asyncWrapper(permissionController.updatePermission),
);
router.delete(
  '/:id',
  authenticate,
  authorize('PERMISSION', 'DELETE'),
  asyncWrapper(permissionController.deletePermission),
);

export { router as permissionRouter };
