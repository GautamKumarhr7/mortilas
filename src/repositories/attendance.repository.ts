import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { 
  attendance, Attendance, NewAttendance, 
  attendanceLog, AttendanceLog, NewAttendanceLog 
} from '../models/hr/attendance.model.js';

export class AttendanceRepository {
  async findAll(): Promise<any[]> {
    const atts = await db.select().from(attendance);
    const logs = await db.select().from(attendanceLog);
    
    return atts.map(att => {
      const attLogs = logs.filter(l => l.attendanceId === att.id).sort((a, b) => a.id - b.id);
      return {
        ...att,
        clockIn: attLogs.length > 0 ? attLogs[0].punchTime : null,
        clockOut: (att.status === 'out' && attLogs.length > 1) ? attLogs[attLogs.length - 1].punchTime : null,
        logs: attLogs
      };
    });
  }

  async findById(id: number): Promise<any | undefined> {
    const result = await db.select().from(attendance).where(eq(attendance.id, id));
    if (!result[0]) return undefined;
    
    const logs = await db.select().from(attendanceLog).where(eq(attendanceLog.attendanceId, id));
    logs.sort((a, b) => a.id - b.id);
    
    const att = result[0];
    return {
      ...att,
      clockIn: logs.length > 0 ? logs[0].punchTime : null,
      clockOut: (att.status === 'out' && logs.length > 1) ? logs[logs.length - 1].punchTime : null,
      logs
    };
  }

  async findByEmployeeIdAndDate(employeeId: number, dateString: string): Promise<Attendance | undefined> {
    const result = await db.select().from(attendance)
      .where(and(eq(attendance.employeeId, employeeId), eq(attendance.date, dateString)));
    return result[0];
  }

  async createAttendanceAndLog(att: NewAttendance, log: Omit<NewAttendanceLog, 'attendanceId'>): Promise<Attendance> {
    return await db.transaction(async (tx) => {
      const result = await tx.insert(attendance).values(att).returning();
      const newAtt = result[0];
      await tx.insert(attendanceLog).values({ ...log, attendanceId: newAtt.id });
      return newAtt;
    });
  }

  async updateAttendanceAndLog(id: number, att: Partial<NewAttendance>, log: Omit<NewAttendanceLog, 'attendanceId'>): Promise<Attendance> {
    return await db.transaction(async (tx) => {
      const result = await tx.update(attendance).set({ ...att, updatedAt: new Date() }).where(eq(attendance.id, id)).returning();
      await tx.insert(attendanceLog).values({ ...log, attendanceId: id });
      return result[0];
    });
  }

  async create(att: NewAttendance): Promise<Attendance> {
    const result = await db.insert(attendance).values(att).returning();
    return result[0];
  }

  async update(id: number, att: Partial<NewAttendance>): Promise<Attendance | undefined> {
    const result = await db
      .update(attendance)
      .set({ ...att, updatedAt: new Date() })
      .where(eq(attendance.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<Attendance | undefined> {
    return await db.transaction(async (tx) => {
      await tx.delete(attendanceLog).where(eq(attendanceLog.attendanceId, id));
      const result = await tx.delete(attendance).where(eq(attendance.id, id)).returning();
      return result[0];
    });
  }

  async getInAttendancesForToday(): Promise<Attendance[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db.select().from(attendance)
      .where(and(eq(attendance.date, today), eq(attendance.status, 'in')));
  }
}
