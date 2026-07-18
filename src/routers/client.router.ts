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
  asyncWrapper(clientController.getAllClients),
);
router.get(
  '/:id',
  authenticate,
  asyncWrapper(clientController.getClientById),
);
router.post(
  '/',
  authenticate,
  asyncWrapper(clientController.createClient),
);
router.put(
  '/:id',
  authenticate,
  asyncWrapper(clientController.updateClient),
);
router.delete(
  '/:id',
  authenticate,
  asyncWrapper(clientController.deleteClient),
);

export { router as clientRouter };
