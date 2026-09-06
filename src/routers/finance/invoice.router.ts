import { Router } from 'express';
import { InvoiceController } from '../../controllers/finance/invoice.controller.js';

const router = Router();
const controller = new InvoiceController();

router.post('/', controller.createInvoice);
router.get('/', controller.getAllInvoices);
router.get('/:id', controller.getInvoiceById);
router.put('/:id', controller.updateInvoice);
router.delete('/:id', controller.deleteInvoice);

export { router as invoiceRouter };
