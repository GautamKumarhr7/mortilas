import { Router } from 'express';
import { PayrollController } from '../../controllers/hr/payroll.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const payrollController = new PayrollController();

// Generate payroll for an employee (auto-calculates from basicPay)
router.post('/generate', authenticate, asyncWrapper(payrollController.generatePayroll));

// Get all payrolls for a specific employee
router.get(
  '/employee/:employeeId',
  authenticate,
  asyncWrapper(payrollController.getPayrollsByEmployee),
);

// Standard CRUD
router.get('/', authenticate, asyncWrapper(payrollController.getAllPayrolls));
router.get('/:id', authenticate, asyncWrapper(payrollController.getPayrollById));
router.put('/:id', authenticate, asyncWrapper(payrollController.updatePayroll));
router.delete('/:id', authenticate, asyncWrapper(payrollController.deletePayroll));

export { router as payrollRouter };
