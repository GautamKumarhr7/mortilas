import { Router } from 'express';
import { GRNController } from '../../controllers/operation/grn.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const grnController = new GRNController();

router.get('/', authenticate, asyncWrapper(grnController.getAllGRNs));
router.post('/from-po', authenticate, asyncWrapper(grnController.createFromPO));
router.patch('/:id/initiate-payment', authenticate, asyncWrapper(grnController.initiatePayment));

export { router as grnRouter };
