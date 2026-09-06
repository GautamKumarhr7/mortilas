import { Router } from 'express';
import { ChartOfAccountsController } from '../../controllers/finance/chart-of-accounts.controller.js';

const router = Router();
const controller = new ChartOfAccountsController();

router.get('/', controller.getAllAccounts);
router.get('/:id', controller.getAccountById);
router.post('/', controller.createAccount);
router.put('/:id', controller.updateAccount);
router.patch('/:id/deactivate', controller.deactivateAccount);

export { router as chartOfAccountsRouter };
