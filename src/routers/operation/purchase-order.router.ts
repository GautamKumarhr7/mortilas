import { Router } from 'express';
import { PurchaseOrderController } from '../../controllers/operation/purchase-order.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const poController = new PurchaseOrderController();

router.get('/', authenticate, asyncWrapper(poController.getAllPurchaseOrders));
router.post('/', authenticate, asyncWrapper(poController.createPurchaseOrder));
router.get('/:id/items', authenticate, asyncWrapper(poController.getPoWithItems));
router.patch('/:id/approve', authenticate, asyncWrapper(poController.approvePurchaseOrder));
router.patch('/:id/reject', authenticate, asyncWrapper(poController.rejectPurchaseOrder));
router.patch('/:id/delivery-status', authenticate, asyncWrapper(poController.updateDeliveryStatus));
router.post('/:id/invoice', authenticate, asyncWrapper(poController.generateInvoice));

export { router as purchaseOrderRouter };
