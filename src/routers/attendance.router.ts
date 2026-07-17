import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
const attendanceController = new AttendanceController();

router.get('/', authenticate, asyncWrapper(attendanceController.getAllAttendance));
router.get('/:id', authenticate, asyncWrapper(attendanceController.getAttendanceById));
router.post('/', authenticate, asyncWrapper(attendanceController.createAttendance));
router.put('/:id', authenticate, asyncWrapper(attendanceController.updateAttendance));
router.delete('/:id', authenticate, asyncWrapper(attendanceController.deleteAttendance));

export { router as attendanceRouter };
