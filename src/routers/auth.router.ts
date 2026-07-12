import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

const router = Router();
const authController = new AuthController();

router.post('/login', asyncWrapper(authController.login));
router.post('/refresh', asyncWrapper(authController.refreshToken));

export { router as authRouter };
