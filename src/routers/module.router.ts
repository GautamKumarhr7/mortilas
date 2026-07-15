import { Router } from 'express';
import { ModuleController } from '../controllers/module.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();
const moduleController = new ModuleController();

router.get('/', authenticate, asyncWrapper(moduleController.getAllModules));
router.get('/:id', authenticate, asyncWrapper(moduleController.getModuleById));
router.post('/', authenticate, asyncWrapper(moduleController.createModule));
router.put('/:id', authenticate, asyncWrapper(moduleController.updateModule));
router.delete('/:id', authenticate, asyncWrapper(moduleController.deleteModule));

export { router as moduleRouter };
