import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../../services/hr/attendance.service.js';

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  getAllAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attendance = await this.attendanceService.getAllAttendance();
      res.status(200).json({ success: true, data: attendance });
    } catch (error) {
      next(error);
    }
  };

  getAttendanceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const att = await this.attendanceService.getAttendanceById(id);
      if (!att) {
        res.status(404).json({ success: false, message: 'Attendance not found' });
        return;
      }
      res.status(200).json({ success: true, data: att });
    } catch (error) {
      next(error);
    }
  };

  createAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // The frontend sends `punchType` ('in' or 'out') and `status` ('ontime').
      // Our new model expects `status` to be 'in' or 'out'.
      const { employeeId, punchType, attendanceType } = req.body;
      const actualStatus = punchType; // 'in' or 'out'
      
      if (!employeeId || !actualStatus) {
        res.status(400).json({ success: false, message: 'employeeId and punchType are required' });
        return;
      }
      
      const att = await this.attendanceService.punch(employeeId, actualStatus, attendanceType);
      res.status(201).json({ success: true, data: att });
    } catch (error: any) {
      if (error.message.includes('Already punched') || error.message.includes('Cannot punch out')) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  };

  updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const att = await this.attendanceService.updateAttendance(id, req.body);
      if (!att) {
        res.status(404).json({ success: false, message: 'Attendance not found' });
        return;
      }
      res.status(200).json({ success: true, data: att });
    } catch (error) {
      next(error);
    }
  };

  deleteAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const att = await this.attendanceService.deleteAttendance(id);
      if (!att) {
        res.status(404).json({ success: false, message: 'Attendance not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Attendance deleted' });
    } catch (error) {
      next(error);
    }
  };
}
