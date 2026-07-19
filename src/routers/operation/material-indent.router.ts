import { Router } from 'express';
import { MaterialIndentController } from '../../controllers/operation/material-indent.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const materialIndentController = new MaterialIndentController();

router.get('/', authenticate, asyncWrapper(materialIndentController.getAllMaterialIndents));
router.post('/', authenticate, asyncWrapper(materialIndentController.createMaterialIndent));

export { router as materialIndentRouter };
