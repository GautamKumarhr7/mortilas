import { Router } from 'express';
import { BankAccountController } from '../../controllers/finance/bank-account.controller.js';

const router = Router();
const controller = new BankAccountController();

router.get('/', controller.getAllBankAccounts);
router.get('/:id', controller.getBankAccountById);
router.post('/', controller.createBankAccount);
router.put('/:id', controller.updateBankAccount);
router.delete('/:id', controller.deleteBankAccount);

export { router as bankAccountRouter };
