import { Request, Response } from 'express';
import { InvoiceService } from '../../services/finance/invoice.service.js';

export class InvoiceController {
  private service: InvoiceService;

  constructor() {
    this.service = new InvoiceService();
  }

  createInvoice = async (req: Request, res: Response) => {
    try {
      if (req.body.issueDate) {
        req.body.issueDate = new Date(req.body.issueDate);
      }
      
      // Auto-generate invoice ID
      if (!req.body.invoiceId) {
          const date = new Date();
          req.body.invoiceId = `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const data = await this.service.createInvoice(req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllInvoices = async (req: Request, res: Response) => {
    try {
      const data = await this.service.getAllInvoices();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getInvoiceById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      const data = await this.service.getInvoiceById(id);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateInvoice = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      if (req.body.issueDate) {
        req.body.issueDate = new Date(req.body.issueDate);
      }
      const data = await this.service.updateInvoice(id, req.body);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteInvoice = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      await this.service.deleteInvoice(id);
      res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
