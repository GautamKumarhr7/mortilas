import { Router } from 'express';
import { ClientController } from '../controllers/client.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();
const clientController = new ClientController();

router.get(
  '/',
  authenticate,
  authorize('CLIENT', 'READ'),
  asyncWrapper(clientController.getAllClients),
);
router.get(
  '/:id',
  authenticate,
  authorize('CLIENT', 'READ'),
  asyncWrapper(clientController.getClientById),
);
router.post(
  '/',
  authenticate,
  authorize('CLIENT', 'CREATE'),
  asyncWrapper(clientController.createClient),
);
router.put(
  '/:id',
  authenticate,
  authorize('CLIENT', 'UPDATE'),
  asyncWrapper(clientController.updateClient),
);
router.delete(
  '/:id',
  authenticate,
  authorize('CLIENT', 'DELETE'),
  asyncWrapper(clientController.deleteClient),
);

export { router as clientRouter };
