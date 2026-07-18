import { Request, Response, NextFunction } from 'express';
import { LeaveService } from '../../services/hr/leave.service.js';

export class LeaveController {
  private leaveService: LeaveService;

  constructor() {
    this.leaveService = new LeaveService();
  }

  getLeaveBalanceByEmployeeId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.userId as string, 10);
      const leaveBalance = await this.leaveService.getLeaveBalanceByEmployeeId(userId);
      res.status(200).json({ success: true, data: leaveBalance });
    } catch (error) {
      next(error);
    }
  };
}
