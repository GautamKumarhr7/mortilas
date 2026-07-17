import { Router } from 'express';
import { LeaveRequestController } from '../../controllers/hr/leave-request.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const leaveRequestController = new LeaveRequestController();

router.get('/', authenticate, asyncWrapper(leaveRequestController.getAllLeaveRequests));
router.get('/:id', authenticate, asyncWrapper(leaveRequestController.getLeaveRequestById));
router.post('/', authenticate, asyncWrapper(leaveRequestController.createLeaveRequest));
router.put('/:id', authenticate, asyncWrapper(leaveRequestController.updateLeaveRequest));
router.delete('/:id', authenticate, asyncWrapper(leaveRequestController.deleteLeaveRequest));

export { router as leaveRequestRouter };
