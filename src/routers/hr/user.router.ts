import { Router } from 'express';
import { UserController } from '../../controllers/hr/user.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/permission.middleware.js';

const router = Router();
const userController = new UserController();

router.get('/', authenticate, authorize('EM', 'READ'), asyncWrapper(userController.getAllUsers));
router.get('/:id', authenticate, authorize('EM', 'READ'), asyncWrapper(userController.getUserById));
router.post('/', authenticate, authorize('EM', 'CREATE'), asyncWrapper(userController.createUser));
router.put(
  '/:id',
  authenticate,
  authorize('EM', 'UPDATE'),
  asyncWrapper(userController.updateUser),
);
router.delete(
  '/:id',
  authenticate,
  authorize('EM', 'DELETE'),
  asyncWrapper(userController.deleteUser),
);

export { router as userRouter };
