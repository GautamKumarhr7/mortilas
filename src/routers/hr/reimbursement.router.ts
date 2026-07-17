import { Router } from 'express';
import { ReimbursementController } from '../../controllers/hr/reimbursement.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const ctrl = new ReimbursementController();

// CRUD
router.get('/', authenticate, asyncWrapper(ctrl.getAll));
router.get('/employee/:employeeId', authenticate, asyncWrapper(ctrl.getByEmployee));
router.get('/:id', authenticate, asyncWrapper(ctrl.getById));
router.post('/', authenticate, asyncWrapper(ctrl.create));
router.put('/:id', authenticate, asyncWrapper(ctrl.update));
router.delete('/:id', authenticate, asyncWrapper(ctrl.delete));

// Approval workflow
router.patch('/:id/manager-approve', authenticate, asyncWrapper(ctrl.managerApprove));
router.patch('/:id/finance-approve', authenticate, asyncWrapper(ctrl.financeApprove));
router.patch('/:id/mark-paid', authenticate, asyncWrapper(ctrl.markPaid));
router.patch('/:id/reject', authenticate, asyncWrapper(ctrl.reject));

export { router as reimbursementRouter };
