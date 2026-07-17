import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendance.service.js';

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
      const att = await this.attendanceService.createAttendance(req.body);
      res.status(201).json({ success: true, data: att });
    } catch (error) {
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
