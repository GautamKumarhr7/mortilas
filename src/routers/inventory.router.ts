import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();
const inventoryController = new InventoryController();

router.get(
  '/',
  authenticate,
  authorize('INVENTORY', 'READ'),
  asyncWrapper(inventoryController.getAllInventories),
);
router.get(
  '/:id',
  authenticate,
  authorize('INVENTORY', 'READ'),
  asyncWrapper(inventoryController.getInventoryById),
);
router.post(
  '/',
  authenticate,
  authorize('INVENTORY', 'CREATE'),
  asyncWrapper(inventoryController.createInventory),
);
router.put(
  '/:id',
  authenticate,
  authorize('INVENTORY', 'UPDATE'),
  asyncWrapper(inventoryController.updateInventory),
);
router.delete(
  '/:id',
  authenticate,
  authorize('INVENTORY', 'DELETE'),
  asyncWrapper(inventoryController.deleteInventory),
);

export { router as inventoryRouter };
