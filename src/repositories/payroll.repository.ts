import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { payrolls, Payroll, NewPayroll } from '../models/hr/payroll.model.js';

export class PayrollRepository {
  async findAll(): Promise<Payroll[]> {
    return await db.select().from(payrolls);
  }

  async findById(id: number): Promise<Payroll | undefined> {
    const result = await db.select().from(payrolls).where(eq(payrolls.id, id));
    return result[0];
  }

  async findByEmployee(employeeId: number): Promise<Payroll[]> {
    return await db.select().from(payrolls).where(eq(payrolls.employeeId, employeeId));
  }

  async create(payroll: NewPayroll): Promise<Payroll> {
    const result = await db.insert(payrolls).values(payroll).returning();
    return result[0];
  }

  async update(id: number, payroll: Partial<NewPayroll>): Promise<Payroll | undefined> {
    const result = await db
      .update(payrolls)
      .set({ ...payroll, updatedAt: new Date() })
      .where(eq(payrolls.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<Payroll | undefined> {
    const result = await db.delete(payrolls).where(eq(payrolls.id, id)).returning();
    return result[0];
  }
}
