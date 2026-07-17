import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { employees, Employee, NewEmployee } from '../models/employee.model.js';

export class EmployeeRepository {
  async findAll(): Promise<Employee[]> {
    return await db.select().from(employees);
  }

  async findById(id: number): Promise<Employee | undefined> {
    const result = await db.select().from(employees).where(eq(employees.id, id));
    return result[0];
  }

  async create(employee: NewEmployee): Promise<Employee> {
    const result = await db.insert(employees).values(employee).returning();
    return result[0];
  }

  async update(id: number, employee: Partial<NewEmployee>): Promise<Employee | undefined> {
    const result = await db.update(employees).set({ ...employee, updatedAt: new Date() }).where(eq(employees.id, id)).returning();
    return result[0];
  }

  async delete(id: number): Promise<Employee | undefined> {
    const result = await db.delete(employees).where(eq(employees.id, id)).returning();
    return result[0];
  }
}
