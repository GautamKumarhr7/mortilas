import { Router } from 'express';
import { SubModuleController } from '../controllers/submodule.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();
const submoduleController = new SubModuleController();

router.get('/', authenticate, asyncWrapper(submoduleController.getAllSubModules));
router.get('/:id', authenticate, asyncWrapper(submoduleController.getSubModuleById));
router.post('/', authenticate, asyncWrapper(submoduleController.createSubModule));
router.put('/:id', authenticate, asyncWrapper(submoduleController.updateSubModule));
router.delete('/:id', authenticate, asyncWrapper(submoduleController.deleteSubModule));

export { router as submoduleRouter };
