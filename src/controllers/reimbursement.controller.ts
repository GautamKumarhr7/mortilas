import { Request, Response, NextFunction } from 'express';
import { ReimbursementService } from '../services/reimbursement.service.js';

export class ReimbursementController {
  private service: ReimbursementService;
  constructor() { this.service = new ReimbursementService(); }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ success: true, data: await this.service.getAll() });
    } catch (e) { next(e); }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.getById(parseInt(req.params.id as string, 10));
      if (!item) { res.status(404).json({ success: false, message: 'Not found' }); return; }
      res.json({ success: true, data: item });
    } catch (e) { next(e); }
  };

  getByEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ success: true, data: await this.service.getByEmployee(parseInt(req.params.employeeId as string, 10)) });
    } catch (e) { next(e); }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json({ success: true, data: await this.service.create(req.body) });
    } catch (e) { next(e); }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.update(parseInt(req.params.id as string, 10), req.body);
      if (!item) { res.status(404).json({ success: false, message: 'Not found' }); return; }
      res.json({ success: true, data: item });
    } catch (e) { next(e); }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.delete(parseInt(req.params.id as string, 10));
      if (!item) { res.status(404).json({ success: false, message: 'Not found' }); return; }
      res.json({ success: true, message: 'Deleted' });
    } catch (e) { next(e); }
  };

  // Approval workflow
  managerApprove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { managerId, remarks } = req.body;
      const item = await this.service.managerApprove(parseInt(req.params.id as string, 10), managerId, remarks);
      res.json({ success: true, data: item });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };

  financeApprove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { financeId, remarks } = req.body;
      const item = await this.service.financeApprove(parseInt(req.params.id as string, 10), financeId, remarks);
      res.json({ success: true, data: item });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };

  markPaid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.markPaid(parseInt(req.params.id as string, 10));
      res.json({ success: true, data: item });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };

  reject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rejectedBy, reason } = req.body;
      const item = await this.service.reject(parseInt(req.params.id as string, 10), rejectedBy, reason);
      res.json({ success: true, data: item });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };
}
