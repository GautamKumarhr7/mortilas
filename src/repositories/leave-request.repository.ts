import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { leaveRequests, LeaveRequest, NewLeaveRequest } from '../models/hr/leave-request.model.js';

export class LeaveRequestRepository {
  async findAll(): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests);
  }

  async findById(id: number): Promise<LeaveRequest | undefined> {
    const result = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
    return result[0];
  }

  async create(leaveRequest: NewLeaveRequest): Promise<LeaveRequest> {
    const result = await db.insert(leaveRequests).values(leaveRequest).returning();
    return result[0];
  }

  async update(
    id: number,
    leaveRequest: Partial<NewLeaveRequest>,
  ): Promise<LeaveRequest | undefined> {
    const result = await db
      .update(leaveRequests)
      .set({ ...leaveRequest, updatedAt: new Date() })
      .where(eq(leaveRequests.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<LeaveRequest | undefined> {
    const result = await db.delete(leaveRequests).where(eq(leaveRequests.id, id)).returning();
    return result[0];
  }
}
