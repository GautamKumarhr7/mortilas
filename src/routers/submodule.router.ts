import { Router } from 'express';
import { SubModuleController } from '../controllers/submodule.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();
const submoduleController = new SubModuleController();

router.get('/', authenticate, authorize('SUBMODULE', 'READ'), asyncWrapper(submoduleController.getAllSubModules));
router.get('/:id', authenticate, authorize('SUBMODULE', 'READ'), asyncWrapper(submoduleController.getSubModuleById));
router.post('/', authenticate, authorize('SUBMODULE', 'CREATE'), asyncWrapper(submoduleController.createSubModule));
router.put('/:id', authenticate, authorize('SUBMODULE', 'UPDATE'), asyncWrapper(submoduleController.updateSubModule));
router.delete('/:id', authenticate, authorize('SUBMODULE', 'DELETE'), asyncWrapper(submoduleController.deleteSubModule));

export { router as submoduleRouter };
