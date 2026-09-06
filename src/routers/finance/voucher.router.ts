import { Router } from 'express';
import { VoucherController } from '../../controllers/finance/voucher.controller.js';

const router = Router();
const controller = new VoucherController();

router.get('/ledger', controller.getLedger);
router.post('/', controller.createVoucher);
router.get('/', controller.getAllVouchers);
router.get('/:id', controller.getVoucherById);
router.put('/:id', controller.updateVoucher);
router.delete('/:id', controller.deleteVoucher);

export { router as voucherRouter };
