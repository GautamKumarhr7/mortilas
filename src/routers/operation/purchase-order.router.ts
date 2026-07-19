import { Router } from 'express';
import { PurchaseOrderController } from '../../controllers/operation/purchase-order.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const poController = new PurchaseOrderController();

router.get('/', authenticate, asyncWrapper(poController.getAllPurchaseOrders));
router.post('/', authenticate, asyncWrapper(poController.createPurchaseOrder));

export { router as purchaseOrderRouter };
