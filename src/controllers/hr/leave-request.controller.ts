import { Request, Response, NextFunction } from 'express';
import { LeaveRequestService } from '../../services/hr/leave-request.service.js';

export class LeaveRequestController {
  private leaveRequestService: LeaveRequestService;

  constructor() {
    this.leaveRequestService = new LeaveRequestService();
  }

  getAllLeaveRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const leaveRequests = await this.leaveRequestService.getAllLeaveRequests();
      res.status(200).json({ success: true, data: leaveRequests });
    } catch (error) {
      next(error);
    }
  };

  getLeaveRequestById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const leaveRequest = await this.leaveRequestService.getLeaveRequestById(id);
      if (!leaveRequest) {
        res.status(404).json({ success: false, message: 'Leave Request not found' });
        return;
      }
      res.status(200).json({ success: true, data: leaveRequest });
    } catch (error) {
      next(error);
    }
  };

  createLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const leaveRequest = await this.leaveRequestService.createLeaveRequest(req.body);
      res.status(201).json({ success: true, data: leaveRequest });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Insufficient')) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  };

  updateLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const leaveRequest = await this.leaveRequestService.updateLeaveRequest(id, req.body);
      if (!leaveRequest) {
        res.status(404).json({ success: false, message: 'Leave Request not found' });
        return;
      }
      res.status(200).json({ success: true, data: leaveRequest });
    } catch (error) {
      next(error);
    }
  };

  deleteLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const leaveRequest = await this.leaveRequestService.deleteLeaveRequest(id);
      if (!leaveRequest) {
        res.status(404).json({ success: false, message: 'Leave Request not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Leave Request deleted' });
    } catch (error) {
      next(error);
    }
  };
}
