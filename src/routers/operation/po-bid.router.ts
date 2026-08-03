import { Router } from 'express';
import { POBidController } from '../../controllers/operation/po-bid.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const poBidController = new POBidController();

router.get('/indent/:indentId', authenticate, asyncWrapper(poBidController.getPOBids));
router.get('/vendor/:vendorId', authenticate, asyncWrapper(poBidController.getBidsByVendor));
router.post('/', authenticate, asyncWrapper(poBidController.createBid));
router.patch('/:id/win', authenticate, asyncWrapper(poBidController.winBid));

export { router as poBidRouter };
