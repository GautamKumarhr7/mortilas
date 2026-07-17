import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { leaves, Leave, NewLeave } from '../models/hr/leave.model.js';

export class LeaveRepository {
  async findByEmployeeId(employeeId: number): Promise<Leave | undefined> {
    const result = await db.select().from(leaves).where(eq(leaves.employeeId, employeeId));
    return result[0];
  }

  async create(leave: NewLeave): Promise<Leave> {
    const result = await db.insert(leaves).values(leave).returning();
    return result[0];
  }

  async update(id: number, leave: Partial<NewLeave>): Promise<Leave | undefined> {
    const result = await db
      .update(leaves)
      .set({ ...leave, updatedAt: new Date() })
      .where(eq(leaves.id, id))
      .returning();
    return result[0];
  }
}
