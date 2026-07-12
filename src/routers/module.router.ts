import { Router } from 'express';
import { ModuleController } from '../controllers/module.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();
const moduleController = new ModuleController();

router.get('/', authenticate, authorize('MODULE', 'READ'), asyncWrapper(moduleController.getAllModules));
router.get('/:id', authenticate, authorize('MODULE', 'READ'), asyncWrapper(moduleController.getModuleById));
router.post('/', authenticate, authorize('MODULE', 'CREATE'), asyncWrapper(moduleController.createModule));
router.put('/:id', authenticate, authorize('MODULE', 'UPDATE'), asyncWrapper(moduleController.updateModule));
router.delete('/:id', authenticate, authorize('MODULE', 'DELETE'), asyncWrapper(moduleController.deleteModule));

export { router as moduleRouter };
