import { Request, Response } from 'express';
import { BankAccountService } from '../../services/finance/bank-account.service.js';

export class BankAccountController {
  private service: BankAccountService;

  constructor() {
    this.service = new BankAccountService();
  }

  getAllBankAccounts = async (req: Request, res: Response) => {
    try {
      const accounts = await this.service.getAllBankAccounts();
      res.status(200).json({ success: true, data: accounts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getBankAccountById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      const account = await this.service.getBankAccountById(id);
      if (!account) return res.status(404).json({ success: false, message: 'Bank account not found' });
      res.status(200).json({ success: true, data: account });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  createBankAccount = async (req: Request, res: Response) => {
    try {
      const account = await this.service.createBankAccount(req.body);
      res.status(201).json({ success: true, data: account });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateBankAccount = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      const account = await this.service.updateBankAccount(id, req.body);
      res.status(200).json({ success: true, data: account });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteBankAccount = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      await this.service.deleteBankAccount(id);
      res.status(200).json({ success: true, message: 'Bank account deleted' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
