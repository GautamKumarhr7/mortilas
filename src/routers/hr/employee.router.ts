import { Router } from 'express';
import { EmployeeController } from '../../controllers/hr/employee.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const employeeController = new EmployeeController();

router.get('/', authenticate, asyncWrapper(employeeController.getAllEmployees));
router.get('/:id', authenticate, asyncWrapper(employeeController.getEmployeeById));
router.post('/', authenticate, asyncWrapper(employeeController.createEmployee));
router.put('/:id', authenticate, asyncWrapper(employeeController.updateEmployee));
router.delete('/:id', authenticate, asyncWrapper(employeeController.deleteEmployee));

export { router as employeeRouter };
