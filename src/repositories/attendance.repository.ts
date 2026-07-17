import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { attendance, Attendance, NewAttendance } from '../models/hr/attendance.model.js';

export class AttendanceRepository {
  async findAll(): Promise<Attendance[]> {
    return await db.select().from(attendance);
  }

  async findById(id: number): Promise<Attendance | undefined> {
    const result = await db.select().from(attendance).where(eq(attendance.id, id));
    return result[0];
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
    const result = await db.delete(attendance).where(eq(attendance.id, id)).returning();
    return result[0];
  }
}
