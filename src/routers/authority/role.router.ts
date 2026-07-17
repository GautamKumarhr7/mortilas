import { Router } from 'express';
import { RoleController } from '../../controllers/authority/role.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/permission.middleware.js';

const router = Router();
const roleController = new RoleController();

router.get('/', authenticate, authorize('ROLE', 'READ'), asyncWrapper(roleController.getAllRoles));
router.get(
  '/:id',
  authenticate,
  authorize('ROLE', 'READ'),
  asyncWrapper(roleController.getRoleById),
);
router.post(
  '/',
  authenticate,
  authorize('ROLE', 'CREATE'),
  asyncWrapper(roleController.createRole),
);
router.put(
  '/:id',
  authenticate,
  authorize('ROLE', 'UPDATE'),
  asyncWrapper(roleController.updateRole),
);
router.delete(
  '/:id',
  authenticate,
  authorize('ROLE', 'DELETE'),
  asyncWrapper(roleController.deleteRole),
);

export { router as roleRouter };
