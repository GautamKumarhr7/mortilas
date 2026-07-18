import { AttendanceRepository } from '../../repositories/attendance.repository.js';
import { Attendance, NewAttendance, NewAttendanceLog } from '../../models/hr/attendance.model.js';

export class AttendanceService {
  private attendanceRepository: AttendanceRepository;

  constructor() {
    this.attendanceRepository = new AttendanceRepository();
  }

  async getAllAttendance(): Promise<Attendance[]> {
    return await this.attendanceRepository.findAll();
  }

  async getAttendanceById(id: number): Promise<Attendance | undefined> {
    return await this.attendanceRepository.findById(id);
  }

  async punch(employeeId: number, status: 'in' | 'out', attendanceType: 'manual' | 'biometric' = 'manual'): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

    const existingAtt = await this.attendanceRepository.findByEmployeeIdAndDate(employeeId, today);

    const log: Omit<NewAttendanceLog, 'attendanceId'> = {
      punchTime: currentTime,
      punchType: status
    };

    if (!existingAtt) {
      if (status === 'out') {
        throw new Error('Cannot punch out before punching in.');
      }
      const attData: NewAttendance = {
        employeeId,
        date: today,
        status,
        attendanceType
      };
      return await this.attendanceRepository.createAttendanceAndLog(attData, log);
    } else {
      if (existingAtt.status === status) {
        throw new Error(`Already punched ${status}.`);
      }
      
      return await this.attendanceRepository.updateAttendanceAndLog(existingAtt.id, { status, attendanceType }, log);
    }
  }

  async createAttendance(attendanceData: NewAttendance): Promise<Attendance> {
    // Legacy support, recommend using punch instead
    return await this.attendanceRepository.create(attendanceData);
  }

  async updateAttendance(
    id: number,
    attendanceData: Partial<NewAttendance>,
  ): Promise<Attendance | undefined> {
    return await this.attendanceRepository.update(id, attendanceData);
  }

  async deleteAttendance(id: number): Promise<Attendance | undefined> {
    return await this.attendanceRepository.delete(id);
  }
}
