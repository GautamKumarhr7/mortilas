import { Router } from 'express';
import { RolePermissionController } from '../controllers/role_permission.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();
const rolePermissionController = new RolePermissionController();

router.get('/', authenticate, authorize('ROLE_PERMISSION', 'READ'), asyncWrapper(rolePermissionController.getAllRolePermissions));
router.get('/role/:roleId/modules', authenticate, authorize('ROLE_PERMISSION', 'READ'), asyncWrapper(rolePermissionController.getModulesAndSubmodulesByRoleId));
router.get('/:id', authenticate, authorize('ROLE_PERMISSION', 'READ'), asyncWrapper(rolePermissionController.getRolePermissionById));
router.post('/', authenticate, authorize('ROLE_PERMISSION', 'CREATE'), asyncWrapper(rolePermissionController.createRolePermission));
router.put('/:id', authenticate, authorize('ROLE_PERMISSION', 'UPDATE'), asyncWrapper(rolePermissionController.updateRolePermission));
router.delete('/:id', authenticate, authorize('ROLE_PERMISSION', 'DELETE'), asyncWrapper(rolePermissionController.deleteRolePermission));

export { router as rolePermissionRouter };
