import { Router } from 'express';
import { userRouter } from './user.router.js';
import { authRouter } from './auth.router.js';
import { roleRouter } from './role.router.js';
import { moduleRouter } from './module.router.js';
import { submoduleRouter } from './submodule.router.js';
import { permissionRouter } from './permission.router.js';
import { rolePermissionRouter } from './role_permission.router.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/roles', roleRouter);
router.use('/modules', moduleRouter);
router.use('/submodules', submoduleRouter);
router.use('/permissions', permissionRouter);
router.use('/role-permissions', rolePermissionRouter);

export { router as apiRouter };
