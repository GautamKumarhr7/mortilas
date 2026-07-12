import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();
const userController = new UserController();

router.get('/', authenticate, authorize('USER', 'READ'), asyncWrapper(userController.getAllUsers));
router.get('/:id', authenticate, authorize('USER', 'READ'), asyncWrapper(userController.getUserById));
router.post('/', authenticate, authorize('USER', 'CREATE'), asyncWrapper(userController.createUser));
router.put('/:id', authenticate, authorize('USER', 'UPDATE'), asyncWrapper(userController.updateUser));
router.delete('/:id', authenticate, authorize('USER', 'DELETE'), asyncWrapper(userController.deleteUser));

export { router as userRouter };
