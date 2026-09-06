import { Request, Response } from 'express';
import { VoucherService } from '../../services/finance/voucher.service.js';

export class VoucherController {
  private service: VoucherService;

  constructor() {
    this.service = new VoucherService();
  }

  createVoucher = async (req: Request, res: Response) => {
    try {
      const voucher = await this.service.createVoucher(req.body);
      res.status(201).json({ success: true, data: voucher });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getLedger = async (req: Request, res: Response) => {
    try {
      const bankId = req.query['bankId'] as string;
      if (!bankId) {
        return res.status(400).json({ success: false, message: 'bankId query param is required' });
      }
      const page  = Math.max(1, parseInt(req.query['page']  as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query['limit'] as string) || 10));
      const result = await this.service.getLedgerByBank(bankId, page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getAllVouchers = async (req: Request, res: Response) => {
    try {
      const vouchers = await this.service.getAllVouchers();
      res.status(200).json({ success: true, data: vouchers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getVoucherById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const voucher = await this.service.getVoucherById(id);
      if (!voucher) {
        return res.status(404).json({ success: false, message: 'Voucher not found' });
      }
      res.status(200).json({ success: true, data: voucher });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateVoucher = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const voucher = await this.service.updateVoucher(id, req.body);
      if (!voucher) {
        return res.status(404).json({ success: false, message: 'Voucher not found' });
      }
      res.status(200).json({ success: true, data: voucher });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  deleteVoucher = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const deleted = await this.service.deleteVoucher(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Voucher not found' });
      }
      res.status(200).json({ success: true, message: 'Voucher deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
