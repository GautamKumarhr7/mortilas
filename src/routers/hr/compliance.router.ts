import { Router } from 'express';
import { ComplianceController } from '../../controllers/hr/compliance.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const ctrl = new ComplianceController();

router.get('/summary', authenticate, asyncWrapper(ctrl.getSummary));
router.get('/epf-ecr', authenticate, asyncWrapper(ctrl.generateEpfEcr));
router.get('/esi-report', authenticate, asyncWrapper(ctrl.generateEsiReport));

export { router as complianceRouter };
