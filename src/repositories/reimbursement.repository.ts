import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { reimbursements, Reimbursement, NewReimbursement } from '../models/hr/reimbursement.model.js';

export class ReimbursementRepository {
  async findAll(): Promise<Reimbursement[]> {
    return await db.select().from(reimbursements);
  }

  async findById(id: number): Promise<Reimbursement | undefined> {
    const result = await db.select().from(reimbursements).where(eq(reimbursements.id, id));
    return result[0];
  }

  async findByEmployee(employeeId: number): Promise<Reimbursement[]> {
    return await db.select().from(reimbursements).where(eq(reimbursements.employeeId, employeeId));
  }

  async create(data: NewReimbursement): Promise<Reimbursement> {
    const result = await db.insert(reimbursements).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<NewReimbursement>): Promise<Reimbursement | undefined> {
    const result = await db
      .update(reimbursements)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(reimbursements.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<Reimbursement | undefined> {
    const result = await db.delete(reimbursements).where(eq(reimbursements.id, id)).returning();
    return result[0];
  }
}
