import { Router } from 'express';
import { LeaveController } from '../../controllers/hr/leave.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const leaveController = new LeaveController();

router.get('/user/:userId', authenticate, asyncWrapper(leaveController.getLeaveBalanceByEmployeeId));

export { router as leaveRouter };
