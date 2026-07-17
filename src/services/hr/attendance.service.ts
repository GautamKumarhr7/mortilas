import { AttendanceRepository } from '../../repositories/attendance.repository.js';
import { Attendance, NewAttendance } from '../../models/hr/attendance.model.js';

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

  async createAttendance(attendanceData: NewAttendance): Promise<Attendance> {
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
