import { Request, Response } from 'express';
import { ChartOfAccountsService } from '../../services/finance/chart-of-accounts.service.js';

export class ChartOfAccountsController {
  private service: ChartOfAccountsService;

  constructor() {
    this.service = new ChartOfAccountsService();
  }

  getAllAccounts = async (req: Request, res: Response) => {
    try {
      const accounts = await this.service.getAllAccounts();
      res.status(200).json({ success: true, data: accounts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getAccountById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      const account = await this.service.getAccountById(id);
      if (!account) return res.status(404).json({ success: false, message: 'Account not found' });
      res.status(200).json({ success: true, data: account });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  createAccount = async (req: Request, res: Response) => {
    try {
      const account = await this.service.createAccount(req.body);
      res.status(201).json({ success: true, data: account });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateAccount = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      const account = await this.service.updateAccount(id, req.body);
      res.status(200).json({ success: true, data: account });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deactivateAccount = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      const account = await this.service.deactivateAccount(id);
      res.status(200).json({ success: true, data: account });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
