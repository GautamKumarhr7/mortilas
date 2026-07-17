import { Request, Response, NextFunction } from 'express';
import { PayrollService } from '../services/payroll.service.js';

export class PayrollController {
  private payrollService: PayrollService;

  constructor() {
    this.payrollService = new PayrollService();
  }

  getAllPayrolls = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payrolls = await this.payrollService.getAllPayrolls();
      res.status(200).json({ success: true, data: payrolls });
    } catch (error) {
      next(error);
    }
  };

  getPayrollById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const payroll = await this.payrollService.getPayrollById(id);
      if (!payroll) {
        res.status(404).json({ success: false, message: 'Payroll not found' });
        return;
      }
      res.status(200).json({ success: true, data: payroll });
    } catch (error) {
      next(error);
    }
  };

  getPayrollsByEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeId = parseInt(req.params.employeeId, 10);
      const payrolls = await this.payrollService.getPayrollsByEmployee(employeeId);
      res.status(200).json({ success: true, data: payrolls });
    } catch (error) {
      next(error);
    }
  };

  generatePayroll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payroll = await this.payrollService.generatePayroll(req.body);
      res.status(201).json({ success: true, data: payroll });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  };

  updatePayroll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const payroll = await this.payrollService.updatePayroll(id, req.body);
      if (!payroll) {
        res.status(404).json({ success: false, message: 'Payroll not found' });
        return;
      }
      res.status(200).json({ success: true, data: payroll });
    } catch (error) {
      next(error);
    }
  };

  deletePayroll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const payroll = await this.payrollService.deletePayroll(id);
      if (!payroll) {
        res.status(404).json({ success: false, message: 'Payroll not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Payroll deleted' });
    } catch (error) {
      next(error);
    }
  };
}
